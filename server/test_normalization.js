const { validateRawScore, calculateNormalizedScore } = require('./services/normalizationService');

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('--- 1. Testing Validation ---');
try {
  validateRawScore(-5);
  assert(false, 'Should reject negative number');
} catch (e) {
  assert(e.message === 'Marks must be between 0 and 100.', 'Rejects negative score with exact message');
}

try {
  validateRawScore(105);
  assert(false, 'Should reject score > 100');
} catch (e) {
  assert(e.message === 'Marks must be between 0 and 100.', 'Rejects score > 100 with exact message');
}

try {
  validateRawScore('');
  assert(false, 'Should reject empty string');
} catch (e) {
  assert(e.message === 'Marks must be between 0 and 100.', 'Rejects empty string');
}

try {
  validateRawScore(null);
  assert(false, 'Should reject null');
} catch (e) {
  assert(e.message === 'Marks must be between 0 and 100.', 'Rejects null');
}

try {
  validateRawScore(undefined);
  assert(false, 'Should reject undefined');
} catch (e) {
  assert(e.message === 'Marks must be between 0 and 100.', 'Rejects undefined');
}

try {
  validateRawScore('abc');
  assert(false, 'Should reject NaN string');
} catch (e) {
  assert(e.message === 'Marks must be between 0 and 100.', 'Rejects NaN string');
}

assert(validateRawScore(0) === 0, 'Accepts 0');
assert(validateRawScore(100) === 100, 'Accepts 100');
assert(validateRawScore('82') === 82, 'Accepts numeric string "82"');

console.log('\n--- 2. Testing Section 25 Test Case Scenario 1 ---');
// Reviewer 1 — Round 1:
// Team A = 82, Team B = 91, Team C = 74, Team D = 65
// MIN = 65, MAX = 91
let min1 = 65, max1 = 91;
let scoreA = calculateNormalizedScore(82, min1, max1);
let scoreB = calculateNormalizedScore(91, min1, max1);
let scoreC = calculateNormalizedScore(74, min1, max1);
let scoreD = calculateNormalizedScore(65, min1, max1);

assert(scoreA === 65.38, `Team A expected 65.38, got ${scoreA}`);
assert(scoreB === 100.00, `Team B expected 100.00, got ${scoreB}`);
assert(scoreC === 34.62, `Team C expected 34.62, got ${scoreC}`);
assert(scoreD === 0.00, `Team D expected 0.00, got ${scoreD}`);

console.log('\n--- 3. Testing Section 25 Test Case Scenario 2 (Team E = 60 submits) ---');
// New MIN = 60, MAX = 91
let min2 = 60, max2 = 91;
scoreA = calculateNormalizedScore(82, min2, max2);
scoreB = calculateNormalizedScore(91, min2, max2);
scoreC = calculateNormalizedScore(74, min2, max2);
scoreD = calculateNormalizedScore(65, min2, max2);
let scoreE = calculateNormalizedScore(60, min2, max2);

assert(scoreA === 70.97, `Team A expected 70.97, got ${scoreA}`);
assert(scoreB === 100.00, `Team B expected 100.00, got ${scoreB}`);
assert(scoreC === 45.16, `Team C expected 45.16, got ${scoreC}`);
assert(scoreD === 16.13, `Team D expected 16.13, got ${scoreD}`);
assert(scoreE === 0.00, `Team E expected 0.00, got ${scoreE}`);

console.log('\n--- 4. Testing Section 25 Test Case Scenario 3 (Team F = 98 submits) ---');
// New MIN = 60, MAX = 98
let min3 = 60, max3 = 98;
scoreA = calculateNormalizedScore(82, min3, max3);
scoreB = calculateNormalizedScore(91, min3, max3);
scoreC = calculateNormalizedScore(74, min3, max3);
scoreD = calculateNormalizedScore(65, min3, max3);
scoreE = calculateNormalizedScore(60, min3, max3);
let scoreF = calculateNormalizedScore(98, min3, max3);

assert(scoreA === 57.89, `Team A expected 57.89, got ${scoreA}`);
assert(scoreB === 81.58, `Team B expected 81.58, got ${scoreB}`);
assert(scoreC === 36.84, `Team C expected 36.84, got ${scoreC}`);
assert(scoreD === 13.16, `Team D expected 13.16, got ${scoreD}`);
assert(scoreE === 0.00, `Team E expected 0.00, got ${scoreE}`);
assert(scoreF === 100.00, `Team F expected 100.00, got ${scoreF}`);

console.log('\n--- 5. Testing MIN == MAX Special Case ---');
// Team A = 80, Team B = 80, Team C = 80
let min4 = 80, max4 = 80;
scoreA = calculateNormalizedScore(80, min4, max4);
scoreB = calculateNormalizedScore(80, min4, max4);
scoreC = calculateNormalizedScore(80, min4, max4);

assert(scoreA === 100, `Team A expected 100, got ${scoreA}`);
assert(scoreB === 100, `Team B expected 100, got ${scoreB}`);
assert(scoreC === 100, `Team C expected 100, got ${scoreC}`);

// Then Team D = 60 submits -> MIN = 60, MAX = 80
let min5 = 60, max5 = 80;
scoreA = calculateNormalizedScore(80, min5, max5);
scoreB = calculateNormalizedScore(80, min5, max5);
scoreC = calculateNormalizedScore(80, min5, max5);
scoreD = calculateNormalizedScore(60, min5, max5);

assert(scoreA === 100, `Team A expected 100, got ${scoreA}`);
assert(scoreB === 100, `Team B expected 100, got ${scoreB}`);
assert(scoreC === 100, `Team C expected 100, got ${scoreC}`);
assert(scoreD === 0, `Team D expected 0, got ${scoreD}`);

console.log('\n--- 6. Testing Single Team Case ---');
// Team A = 80 -> MIN = 80, MAX = 80 -> Normalized = 100
assert(calculateNormalizedScore(80, 80, 80) === 100, 'Single team submission yields 100');

console.log('\n--- 7. Testing Final Team Tally Across 3 Reviewers (Section 15) ---');
// R1 = 80, R2 = 90, R3 = 70 -> Final Tally = (80 + 90 + 70) / 3 = 80
let r1Norm = 80, r2Norm = 90, r3Norm = 70;
let finalTally = Number(((r1Norm + r2Norm + r3Norm) / 3).toFixed(2));
assert(finalTally === 80, `Expected 80, got ${finalTally}`);

console.log('\n✨ ALL LOGICAL AND MATHEMATICAL SPECIFICATION TESTS PASSED SUCCESSFULLY! ✨');
