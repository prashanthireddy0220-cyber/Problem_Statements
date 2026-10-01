const { SystemSettings } = require('../models/Schema');

let stateCache = null;
let lastStateFetchTime = 0;

function invalidateSystemStateCache() {
  stateCache = null;
  lastStateFetchTime = 0;
}

/**
 * System State Service
 * Centrally manages hackathon selection phases, timer calculations, and manual overrides.
 * Ensures 100% synchronization between Admin Dashboard, Team Lead Portals, and backend APIs.
 */
async function getOrUpdateSystemState(forceRefresh = false) {
  const now = new Date();

  // Serve from in-memory cache if fresh (<1000ms) with dynamically recalculated countdowns
  if (!forceRefresh && stateCache && (now.getTime() - lastStateFetchTime < 1000)) {
    const cached = stateCache;
    let timeUntilReleaseSeconds = 0;
    let timeUntilSelectionStartSeconds = 0;
    let selectionTimeRemainingSeconds = 0;

    let effectivePhase = cached.currentPhase;

    if (effectivePhase === 'ROUND_STARTED_UNRELEASED' && cached.releaseScheduledAt && now < new Date(cached.releaseScheduledAt)) {
      timeUntilReleaseSeconds = Math.max(0, Math.floor((new Date(cached.releaseScheduledAt) - now) / 1000));
    }
    if (cached.selectionScheduledStart) {
      const startTime = new Date(cached.selectionScheduledStart);
      if (now < startTime) {
        effectivePhase = 'RELEASED_LOCKED';
        timeUntilSelectionStartSeconds = Math.max(0, Math.floor((startTime - now) / 1000));
      } else if (cached.selectionEndsAt && now < new Date(cached.selectionEndsAt)) {
        if (cached.selectionManualState !== 'CLOSED') {
          effectivePhase = 'SELECTION_OPEN';
          selectionTimeRemainingSeconds = Math.max(0, Math.floor((new Date(cached.selectionEndsAt) - now) / 1000));
        }
      } else if (cached.selectionEndsAt && now >= new Date(cached.selectionEndsAt)) {
        effectivePhase = 'SELECTION_CLOSED';
      }
    } else if (effectivePhase === 'RELEASED_LOCKED' && cached.readingEndsAt && now < new Date(cached.readingEndsAt)) {
      timeUntilSelectionStartSeconds = Math.max(0, Math.floor((new Date(cached.readingEndsAt) - now) / 1000));
    }
    if (effectivePhase === 'SELECTION_OPEN' && cached.selectionEndsAt && now < new Date(cached.selectionEndsAt)) {
      selectionTimeRemainingSeconds = Math.max(0, Math.floor((new Date(cached.selectionEndsAt) - now) / 1000));
    }

    return {
      ...cached,
      currentPhase: effectivePhase,
      serverTime: now,
      timeUntilReleaseSeconds,
      timeUntilSelectionStartSeconds,
      selectionTimeRemainingSeconds
    };
  }

  let settings = await SystemSettings.findOne();
  if (!settings) {
    settings = await SystemSettings.create({
      releaseDelayMinutes: 5,
      selectionDelayMinutes: 2,
      selectionDurationMinutes: 10,
      readingDurationMinutes: 2,
      problemStatementsReleased: false,
      selectionScheduledStart: null,
      selectionManualState: 'NONE',
      releaseManualState: 'NONE',
      roundStatus: 'IDLE',
      currentPhase: 'NOT_RELEASED'
    });
  }

  const now = new Date();

  // Dynamic Phase Evaluation Logic
  let computedPhase = 'NOT_RELEASED';
  let isReleased = false;

  // 1. Explicit Manual Unrelease override (Admin hid all problems)
  if (settings.releaseManualState === 'UNRELEASED') {
    computedPhase = 'NOT_RELEASED';
    isReleased = false;
  }
  // 2. Explicit Manual Close override (Admin locked selection)
  else if (settings.selectionManualState === 'CLOSED') {
    computedPhase = 'SELECTION_CLOSED';
    isReleased = Boolean(settings.problemStatementsReleased || settings.releaseManualState === 'RELEASED');
  }
  // 3. Explicit Manual Open override (Admin enabled selection now)
  else if (settings.selectionManualState === 'OPEN') {
    isReleased = true;
    if (settings.selectionEndsAt && now >= new Date(settings.selectionEndsAt)) {
      computedPhase = 'SELECTION_CLOSED';
    } else {
      computedPhase = 'SELECTION_OPEN';
    }
  }
  // 4. Manual Release active (Problems released, selection depends on schedule / state)
  else if (settings.releaseManualState === 'RELEASED') {
    isReleased = true;
    if (settings.selectionScheduledStart && now < new Date(settings.selectionScheduledStart)) {
      computedPhase = 'RELEASED_LOCKED';
    } else if (settings.selectionEndsAt && now >= new Date(settings.selectionEndsAt)) {
      computedPhase = 'SELECTION_CLOSED';
    } else if (settings.selectionScheduledStart && now >= new Date(settings.selectionScheduledStart)) {
      computedPhase = 'SELECTION_OPEN';
    } else {
      // Released for viewing, selection locked until enabled
      computedPhase = 'RELEASED_LOCKED';
    }
  }
  // 5. Automated Timed Round active
  else if (settings.roundStatus === 'ACTIVE' || settings.releaseScheduledAt || settings.selectionScheduledStart) {
    const releaseTime = settings.releaseScheduledAt ? new Date(settings.releaseScheduledAt) : null;
    const selectStartTime = settings.selectionScheduledStart ? new Date(settings.selectionScheduledStart) : null;
    const selectEndTime = settings.selectionEndsAt ? new Date(settings.selectionEndsAt) : null;

    if (releaseTime && now < releaseTime) {
      // Stage 1: Problem Statements completely hidden
      computedPhase = 'ROUND_STARTED_UNRELEASED';
      isReleased = false;
    } else {
      // Release delay has elapsed -> Problems are released
      isReleased = true;

      if (selectStartTime && now < selectStartTime) {
        // Stage 2: View / Read-Only Mode
        computedPhase = 'RELEASED_LOCKED';
      } else if (selectEndTime && now >= selectEndTime) {
        // Stage 3: Selection time expired
        computedPhase = 'SELECTION_CLOSED';
      } else {
        // Stage 3: Selection actively open
        computedPhase = 'SELECTION_OPEN';
        if (!settings.selectionEndsAt && selectStartTime) {
          const durMs = (settings.selectionDurationMinutes || 10) * 60 * 1000;
          settings.selectionEndsAt = new Date(selectStartTime.getTime() + durMs);
          await settings.save();
        }
      }
    }
  }
  // 6. Round is IDLE (Default Initial State)
  else {
    if (settings.problemStatementsReleased) {
      isReleased = true;
      computedPhase = 'RELEASED_LOCKED';
    } else {
      isReleased = false;
      computedPhase = 'NOT_RELEASED';
    }
  }

  // Persist if computed phase or release status changed
  if (settings.problemStatementsReleased !== isReleased || settings.currentPhase !== computedPhase) {
    settings.problemStatementsReleased = isReleased;
    settings.currentPhase = computedPhase;
    await settings.save();
  }

  // Calculate remaining seconds strictly against server time
  let timeUntilReleaseSeconds = 0;
  let timeUntilSelectionStartSeconds = 0;
  let selectionTimeRemainingSeconds = 0;

  if (computedPhase === 'ROUND_STARTED_UNRELEASED' && settings.releaseScheduledAt && now < new Date(settings.releaseScheduledAt)) {
    timeUntilReleaseSeconds = Math.max(0, Math.floor((new Date(settings.releaseScheduledAt) - now) / 1000));
  }

  if (computedPhase === 'RELEASED_LOCKED' && settings.selectionScheduledStart && now < new Date(settings.selectionScheduledStart)) {
    timeUntilSelectionStartSeconds = Math.max(0, Math.floor((new Date(settings.selectionScheduledStart) - now) / 1000));
  } else if (computedPhase === 'RELEASED_LOCKED' && settings.readingEndsAt && now < new Date(settings.readingEndsAt)) {
    timeUntilSelectionStartSeconds = Math.max(0, Math.floor((new Date(settings.readingEndsAt) - now) / 1000));
  }

  if (computedPhase === 'SELECTION_OPEN' && settings.selectionEndsAt && now < new Date(settings.selectionEndsAt)) {
    selectionTimeRemainingSeconds = Math.max(0, Math.floor((new Date(settings.selectionEndsAt) - now) / 1000));
  }

  const result = {
    settings,
    serverTime: now,
    currentPhase: computedPhase,
    problemStatementsReleased: isReleased,
    roundStartedAt: settings.roundStartedAt,
    releaseScheduledAt: settings.releaseScheduledAt,
    selectionScheduledStart: settings.selectionScheduledStart,
    selectionEndsAt: settings.selectionEndsAt,
    timeUntilReleaseSeconds,
    timeUntilSelectionStartSeconds,
    selectionTimeRemainingSeconds,
    releaseDelayMinutes: settings.releaseDelayMinutes || 5,
    selectionDelayMinutes: settings.selectionDelayMinutes || settings.readingDurationMinutes || 2,
    selectionDurationMinutes: settings.selectionDurationMinutes || 10,
    problemSelectionEnabled: settings.problemSelectionEnabled,
    roundStatus: settings.roundStatus
  };

  stateCache = result;
  lastStateFetchTime = now.getTime();
  return result;
}

module.exports = {
  getOrUpdateSystemState,
  invalidateSystemStateCache
};
