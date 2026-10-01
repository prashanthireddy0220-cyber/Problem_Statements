const fs = require('fs');
const path = require('path');

const rawBooklet = [
  {
    "id": "KARE-AI-01",
    "domain": "Artificial Intelligence & Machine Learning",
    "title": "VoiceSentry: Real-Time Synthetic Voice & Audio Deepfake Detector",
    "coreQuestion": "How can an intelligent audio system instantly detect synthetic voice clones in live communication before financial fraud or social engineering succeeds?",
    "background": "Generative speech synthesis (ElevenLabs, VALL-E) allows malicious actors to clone human voices with just a 3-second sample. Traditional fraud prevention relies on caller ID or SMS OTPs, which are easily bypassed. Existing audio forensic tools are slow, offline, and require lab-grade signal processing, leaving consumers and call center agents defenseless against live voice impersonation.",
    "description": "Design a real-time audio analysis tool that listens to an incoming voice stream or uploaded audio, extracts acoustic and frequency biomarkers, and provides an immediate confidence score indicating whether the voice is authentic human speech or AI-generated.",
    "scopeGuidance": "Teams are not expected to train a foundation audio model from scratch. Focus on extracting key acoustic features (MFCCs, spectral roll-off, pitch jitter, phase continuity) and using a pre-trained classifier or fine-tuned model on synthetic/real audio benchmarks.",
    "requirements": [
      "Acoustic Feature Inspection: Analyze anomalous pitch consistency and unnatural frequency cutoffs typical of synthetic audio.",
      "Real-Time Confidence Gauge: Visual latency meter showing live risk level (Authentic, Suspicious, Cloned).",
      "Audio Spectrogram Visualizer: Highlight tampered frequency bins for forensic explainability."
    ],
    "constraints": [
      "Building a speech recognition or transcription engine.",
      "Scraping millions of YouTube voice clips.",
      "Complex telecommunication telecom-layer hacking."
    ],
    "judgingCriteria": "• Detection Accuracy on Test Audio (40%)\n• Forensic Explainability & Spectrogram Insights (30%)\n• Real-time Latency & UX (30%)",
    "technologies": ["Python", "Librosa", "PyTorch", "Scikit-learn", "Torchaudio", "Streamlit", "React", "FastAPI", "ASVspoof dataset samples"],
    "pdfDescription": `VOICESENTRY: REAL-TIME SYNTHETIC VOICE & AUDIO DEEPFAKE DETECTOR
Problem Statement ID: KARE-AI-01 | Domain: Artificial Intelligence & Machine Learning

• THE CORE QUESTION:
How can an intelligent audio system instantly detect synthetic voice clones in live communication before financial fraud or social engineering succeeds?

• THE PROBLEM GAP:
Generative speech synthesis (ElevenLabs, VALL-E) allows malicious actors to clone human voices with just a 3-second sample. Traditional fraud prevention relies on caller ID or SMS OTPs, which are easily bypassed. Existing audio forensic tools are slow, offline, and require lab-grade signal processing, leaving consumers and call center agents defenseless against live voice impersonation.

• THE CHALLENGE:
Design a real-time audio analysis tool that listens to an incoming voice stream or uploaded audio, extracts acoustic and frequency biomarkers, and provides an immediate confidence score indicating whether the voice is authentic human speech or AI-generated.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Teams are not expected to train a foundation audio model from scratch. Focus on extracting key acoustic features (MFCCs, spectral roll-off, pitch jitter, phase continuity) and using a pre-trained classifier or fine-tuned model on synthetic/real audio benchmarks.

• SOLUTION DIRECTIONS:
• Acoustic Feature Inspection: Analyze anomalous pitch consistency and unnatural frequency cutoffs typical of synthetic audio.
• Real-Time Confidence Gauge: Visual latency meter showing live risk level (Authentic, Suspicious, Cloned).
• Audio Spectrogram Visualizer: Highlight tampered frequency bins for forensic explainability.

• ANTI-GOALS (WHAT THIS IS NOT):
• Building a speech recognition or transcription engine.
• Scraping millions of YouTube voice clips.
• Complex telecommunication telecom-layer hacking.

• JUDGING CRITERIA:
• Detection Accuracy on Test Audio (40%)
• Forensic Explainability & Spectrogram Insights (30%)
• Real-time Latency & UX (30%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, Librosa, PyTorch/Scikit-learn, Torchaudio, Streamlit / React, FastAPI, ASVspoof dataset samples`
  },
  {
    "id": "KARE-AI-02",
    "domain": "Artificial Intelligence & Machine Learning",
    "title": "VisionGuard: Smart CCTV Perimeter Intrusion & Unattended Baggage Sentinel",
    "coreQuestion": "How can standard, low-cost CCTV infrastructure be transformed into an autonomous spatial intelligence sentinel without requiring expensive edge hardware?",
    "background": "Most campus and commercial CCTV setups are strictly passive: security guards watch multi-screen walls with inevitable fatigue, or footage is reviewed only after an incident occurs. Conventional video analytics tools are rigid, trigger hundreds of false alarms on animals or shadows, and fail to track stationary unattended objects over time.",
    "description": "Develop an intelligent vision monitoring dashboard that ingests live webcam or recorded CCTV streams, allows security officers to draw virtual perimeter tripwires, and autonomously flags boundary intrusions and unattended baggage lasting over 15 seconds.",
    "scopeGuidance": "Teams do not need massive physical CCTV camera networks. Use sample CCTV footage or local webcam feeds with simulated objects (backpacks, bags) and test persons to demonstrate tripwire breach and object abandoned time-tracking.",
    "requirements": [
      "Dynamic Tripwire Configuration: Draw polygon zones and crossing lines on live video feeds.",
      "Object Association & Dwell Timer: Track who placed a bag and start an alert timer if the owner walks away.",
      "Instant Alert Generation: Generate audio siren triggers, snapshot logging, and Telegram/WebSocket alerts."
    ],
    "constraints": [
      "Full-scale hardware NVR manufacturing.",
      "Face recognition surveillance across thousands of identities.",
      "High-latency offline video processing."
    ],
    "judgingCriteria": "• Detection Precision & Object Tracking Consistency (40%)\n• Usability of Security Monitoring UI (30%)\n• Alert Latency & Edge Optimization (30%)",
    "technologies": ["Python", "OpenCV", "YOLOv8", "YOLO-NAS", "DeepSORT", "ByteTrack", "Flask", "FastAPI", "WebSockets", "React", "Tailwind"],
    "pdfDescription": `VISIONGUARD: SMART CCTV PERIMETER INTRUSION & UNATTENDED BAGGAGE SENTINEL
Problem Statement ID: KARE-AI-02 | Domain: Artificial Intelligence & Machine Learning

• THE CORE QUESTION:
How can standard, low-cost CCTV infrastructure be transformed into an autonomous spatial intelligence sentinel without requiring expensive edge hardware?

• THE PROBLEM GAP:
Most campus and commercial CCTV setups are strictly passive: security guards watch multi-screen walls with inevitable fatigue, or footage is reviewed only after an incident occurs. Conventional video analytics tools are rigid, trigger hundreds of false alarms on animals or shadows, and fail to track stationary unattended objects over time.

• THE CHALLENGE:
Develop an intelligent vision monitoring dashboard that ingests live webcam or recorded CCTV streams, allows security officers to draw virtual perimeter tripwires, and autonomously flags boundary intrusions and unattended baggage lasting over 15 seconds.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Teams do not need massive physical CCTV camera networks. Use sample CCTV footage or local webcam feeds with simulated objects (backpacks, bags) and test persons to demonstrate tripwire breach and object abandoned time-tracking.

• SOLUTION DIRECTIONS:
• Dynamic Tripwire Configuration: Draw polygon zones and crossing lines on live video feeds.
• Object Association & Dwell Timer: Track who placed a bag and start an alert timer if the owner walks away.
• Instant Alert Generation: Generate audio siren triggers, snapshot logging, and Telegram/WebSocket alerts.

• ANTI-GOALS (WHAT THIS IS NOT):
• Full-scale hardware NVR manufacturing.
• Face recognition surveillance across thousands of identities.
• High-latency offline video processing.

• JUDGING CRITERIA:
• Detection Precision & Object Tracking Consistency (40%)
• Usability of Security Monitoring UI (30%)
• Alert Latency & Edge Optimization (30%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, OpenCV, YOLOv8 / YOLO-NAS, DeepSORT / ByteTrack, Flask/FastAPI, WebSockets, React/Tailwind`
  },
  {
    "id": "KARE-AI-03",
    "domain": "Artificial Intelligence & Machine Learning",
    "title": "MediScan AI: Explainable Primary Retinal & Dermatological Diagnostic Screener",
    "coreQuestion": "How can frontline rural health workers receive instant, explainable second opinions on medical imagery without relying on absent specialists?",
    "background": "Over 70% of primary health centers in rural regions lack ophthalmologists and dermatologists. Patients travel hundreds of kilometers for routine screenings of diabetic retinopathy or malignant skin lesions. Existing AI diagnostic apps function as black boxes, outputting opaque percentages that clinicians distrust and cannot explain to patients.",
    "description": "Create an explainable diagnostic screener that takes fundus or skin lesion images, determines condition severity stages, and visually highlights the exact pathological markers driving the decision using Grad-CAM heatmaps.",
    "scopeGuidance": "Use open benchmark datasets (Kaggle APTOS, EyePACS, or ISIC Skin Cancer dataset). The focus is not 99.9% clinical validation, but on decision explainability, confidence intervals, and clinician-friendly interface design.",
    "requirements": [
      "Multi-Condition Triage: Screen uploaded images for severity levels (Normal, Mild, Moderate, Severe).",
      "Visual Decision Grounding: Overlay Grad-CAM attention heatmaps pinpointing microaneurysms or lesions.",
      "Clinical Summary Report: Export a structured patient advisory sheet explaining findings in layperson terms."
    ],
    "constraints": [
      "Replacing professional medical diagnosis.",
      "Training multi-gigabyte models on local laptops.",
      "Gathering patient medical history forms with manual input friction."
    ],
    "judgingCriteria": "• Explainability & Heatmap Quality (40%)\n• Model Classification Coherence (30%)\n• Healthcare Worker Interface Simplicity (30%)",
    "technologies": ["PyTorch", "Torchvision", "ResNet50", "EfficientNet", "Grad-CAM", "FastAPI", "Gradio", "React", "Kaggle APTOS/ISIC data"],
    "pdfDescription": `MEDISCAN AI: EXPLAINABLE PRIMARY RETINAL & DERMATOLOGICAL DIAGNOSTIC SCREENER
Problem Statement ID: KARE-AI-03 | Domain: Artificial Intelligence & Machine Learning

• THE CORE QUESTION:
How can frontline rural health workers receive instant, explainable second opinions on medical imagery without relying on absent specialists?

• THE PROBLEM GAP:
Over 70% of primary health centers in rural regions lack ophthalmologists and dermatologists. Patients travel hundreds of kilometers for routine screenings of diabetic retinopathy or malignant skin lesions. Existing AI diagnostic apps function as black boxes, outputting opaque percentages that clinicians distrust and cannot explain to patients.

• THE CHALLENGE:
Create an explainable diagnostic screener that takes fundus or skin lesion images, determines condition severity stages, and visually highlights the exact pathological markers driving the decision using Grad-CAM heatmaps.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Use open benchmark datasets (Kaggle APTOS, EyePACS, or ISIC Skin Cancer dataset). The focus is not 99.9% clinical validation, but on decision explainability, confidence intervals, and clinician-friendly interface design.

• SOLUTION DIRECTIONS:
• Multi-Condition Triage: Screen uploaded images for severity levels (Normal, Mild, Moderate, Severe).
• Visual Decision Grounding: Overlay Grad-CAM attention heatmaps pinpointing microaneurysms or lesions.
• Clinical Summary Report: Export a structured patient advisory sheet explaining findings in layperson terms.

• ANTI-GOALS (WHAT THIS IS NOT):
• Replacing professional medical diagnosis.
• Training multi-gigabyte models on local laptops.
• Gathering patient medical history forms with manual input friction.

• JUDGING CRITERIA:
• Explainability & Heatmap Quality (40%)
• Model Classification Coherence (30%)
• Healthcare Worker Interface Simplicity (30%)

• RECOMMENDED TECH STACK & RESOURCES:
PyTorch, Torchvision, ResNet50/EfficientNet, Grad-CAM, FastAPI, Gradio/React, Kaggle APTOS/ISIC data`
  },
  {
    "id": "KARE-AI-04",
    "domain": "Artificial Intelligence & Machine Learning",
    "title": "AgriDoctor: Multilingual Crop Leaf Disease Identifier & Voice Advisory",
    "coreQuestion": "How can AI turn a smartphone camera into a localized agricultural expert that diagnoses crop pests and speaks organic remedies in native dialects?",
    "background": "Plant diseases destroy up to 40% of smallholder harvest yields annually. When crop infestations strike, farmers struggle to identify the exact fungal or bacterial pathogen. Existing diagnostic platforms return dense scientific names in English and push expensive commercial chemicals that farmers cannot afford or obtain locally.",
    "description": "Build an offline-ready mobile web tool where farmers upload or capture a photo of an infected leaf, receive an instant identification of the disease, and listen to spoken, practical, low-cost organic treatment steps in vernacular Indian languages.",
    "scopeGuidance": "Use pre-trained models on the PlantVillage dataset (covering potato, tomato, corn, etc.). Prioritize multilingual text-to-speech feedback and practical, actionable farming remedies over rare crop edge cases.",
    "requirements": [
      "Visual Pathogen Identification: Detect leaf blights, rusts, and pest damage from camera photos.",
      "Vernacular Voice Synthesis: Read out remedies in Hindi, Tamil, Telugu, etc., using Web Speech/TTS.",
      "Cost-Effective Remedy Engine: Prioritize bio-pesticides (neem oil, buttermilk spray) over chemical brands."
    ],
    "constraints": [
      "Building a comprehensive botanical encyclopedia.",
      "Soil sensor IoT hardware integration.",
      "Requiring complex login forms or high-bandwidth video streaming."
    ],
    "judgingCriteria": "• Farmer-Centric UX & Voice Accessibility (40%)\n• Diagnosis Accuracy & Remedy Relevance (30%)\n• Lightweight Mobile Responsiveness (30%)",
    "technologies": ["TensorFlow", "PyTorch", "MobileNetV2", "PlantVillage Dataset", "Web Speech API", "gTTS", "Next.js", "PWA"],
    "pdfDescription": `AGRIDOCTOR: MULTILINGUAL CROP LEAF DISEASE IDENTIFIER & VOICE ADVISORY
Problem Statement ID: KARE-AI-04 | Domain: Artificial Intelligence & Machine Learning

• THE CORE QUESTION:
How can AI turn a smartphone camera into a localized agricultural expert that diagnoses crop pests and speaks organic remedies in native dialects?

• THE PROBLEM GAP:
Plant diseases destroy up to 40% of smallholder harvest yields annually. When crop infestations strike, farmers struggle to identify the exact fungal or bacterial pathogen. Existing diagnostic platforms return dense scientific names in English and push expensive commercial chemicals that farmers cannot afford or obtain locally.

• THE CHALLENGE:
Build an offline-ready mobile web tool where farmers upload or capture a photo of an infected leaf, receive an instant identification of the disease, and listen to spoken, practical, low-cost organic treatment steps in vernacular Indian languages.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Use pre-trained models on the PlantVillage dataset (covering potato, tomato, corn, etc.). Prioritize multilingual text-to-speech feedback and practical, actionable farming remedies over rare crop edge cases.

• SOLUTION DIRECTIONS:
• Visual Pathogen Identification: Detect leaf blights, rusts, and pest damage from camera photos.
• Vernacular Voice Synthesis: Read out remedies in Hindi, Tamil, Telugu, etc., using Web Speech/TTS.
• Cost-Effective Remedy Engine: Prioritize bio-pesticides (neem oil, buttermilk spray) over chemical brands.

• ANTI-GOALS (WHAT THIS IS NOT):
• Building a comprehensive botanical encyclopedia.
• Soil sensor IoT hardware integration.
• Requiring complex login forms or high-bandwidth video streaming.

• JUDGING CRITERIA:
• Farmer-Centric UX & Voice Accessibility (40%)
• Diagnosis Accuracy & Remedy Relevance (30%)
• Lightweight Mobile Responsiveness (30%)

• RECOMMENDED TECH STACK & RESOURCES:
TensorFlow / PyTorch, MobileNetV2, PlantVillage Dataset, Web Speech API / gTTS, Next.js / PWA`
  },
  {
    "id": "KARE-AI-05",
    "domain": "Artificial Intelligence & Machine Learning",
    "title": "SignBridge Lite: One-Way ISL Gesture-to-Speech Translator (Core Vocabulary)",
    "coreQuestion": "How can a webcam application translate a small vocabulary of Indian Sign Language (ISL) gestures into text and spoken audio for public counter interactions?",
    "background": "Deaf and hard-of-hearing citizens struggle to communicate at ticket counters, pharmacies, and government offices because sign language interpreters are scarce and frontline staff cannot sign.",
    "description": "Build a webcam tool that tracks hand landmarks using MediaPipe, recognizes 15 to 25 core ISL gestures (numbers plus words like help, ticket, water, where, money, thank you) using a classifier, and instantly displays the recognized word and speaks it aloud using text-to-speech.",
    "scopeGuidance": "One gesture at a time; no continuous signing or sentence-level grammar. Record 50 to 100 samples per gesture under varied lighting with standard laptop webcam.",
    "requirements": [
      "Landmark Feature Extraction: MediaPipe hand landmarks and finger angles per frame.",
      "Gesture Classifier: RandomForest / kNN / small LSTM over landmark sequences with hold detection.",
      "Instant Speech Output: Show the recognized word and speak it via text-to-speech in English or one regional language."
    ],
    "constraints": [
      "Two-way translation",
      "Full ISL grammar or continuous sentence recognition",
      "Regional dialect coverage",
      "Signing avatars"
    ],
    "judgingCriteria": "• Recognition accuracy on held-out gestures (45%)\n• Recognition latency (25%)\n• UI clarity for counter staff (30%)",
    "technologies": ["Python", "MediaPipe", "OpenCV", "Scikit-learn", "gTTS", "Streamlit", "React"],
    "pdfDescription": `SIGNBRIDGE LITE: ONE-WAY INDIAN SIGN LANGUAGE GESTURE-TO-SPEECH TRANSLATOR
Problem Statement ID: KARE-AI-05 | Domain: Artificial Intelligence & Machine Learning

• THE CORE QUESTION:
How can a webcam application translate a small vocabulary of Indian Sign Language (ISL) gestures into text and spoken audio for public counter interactions?

• THE PROBLEM GAP:
Deaf and hard-of-hearing citizens struggle to communicate at ticket counters, pharmacies, and government offices because sign language interpreters are scarce and frontline staff cannot sign.

• THE CHALLENGE (24-HR FEASIBILITY):
Build a webcam tool that tracks hand landmarks using MediaPipe, recognizes 15 to 25 core ISL gestures (numbers plus words like help, ticket, water, where, money, thank you) using a classifier trained on a dataset the team records themselves, and instantly displays the recognized word and speaks it aloud using text-to-speech.

• SCOPE GUIDANCE:
One gesture at a time; no continuous signing or sentence-level grammar. Record 50 to 100 samples per gesture with 2 to 3 team members as a self-built dataset under varied lighting. Standard laptop webcam. Include a short note acknowledging regional ISL variation.

• SOLUTION DIRECTIONS:
• Landmark Feature Extraction: MediaPipe hand landmarks and finger angles per frame.
• Gesture Classifier: RandomForest / kNN / small LSTM over landmark sequences with hold detection.
• Instant Speech Output: Show the recognized word and speak it via text-to-speech in English or one regional language.

• ANTI-GOALS:
• Two-way translation
• Full ISL grammar or continuous sentence recognition
• Regional dialect coverage
• Signing avatars

• JUDGING CRITERIA:
• Recognition accuracy on held-out gestures (45%)
• Recognition latency (25%)
• UI clarity for counter staff (30%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, MediaPipe, OpenCV, scikit-learn, gTTS, Streamlit / React`
  },
  {
    "id": "KARE-AI-06",
    "domain": "Artificial Intelligence & Machine Learning",
    "title": "SignAvatar Lite: Text-to-Sign Visual Reply Player (Core Vocabulary)",
    "coreQuestion": "How can a frontline clerk's typed reply be conveyed visually in sign language for a deaf citizen using a small recorded vocabulary?",
    "background": "Communication at public counters fails in both directions: even when a deaf citizen is understood, hearing staff have no way to reply in sign, leaving the interaction incomplete.",
    "description": "Build a web tool where the clerk types a reply or picks from quick phrases (e.g., Platform 5, 200 rupees, come tomorrow); the system maps each word to a short pre-recorded sign video clip and plays the sequence, so the deaf citizen can watch the reply in sign.",
    "scopeGuidance": "Same 15 to 25 word core vocabulary as the sign-to-speech direction. Clips are pre-recorded and played in sequence; no grammar-level sign synthesis. Text input or Web Speech API dictation only; no camera needed on this side.",
    "requirements": [
      "Quick-Phrase Keyboard: One-tap common counter replies.",
      "Word-to-Clip Mapping Engine: JSON dictionary with fallback text display for missing words.",
      "Sequenced Playback View: Replay, pause, and speed control on the citizen's screen."
    ],
    "constraints": [
      "Full machine translation into ISL grammar",
      "Photorealistic signing avatars",
      "Automated two-way conversation"
    ],
    "judgingCriteria": "• Vocabulary coverage and mapping logic (40%)\n• Playback clarity and sequencing (35%)\n• Clerk usability (25%)",
    "technologies": ["React", "Next.js", "HTML5 Video", "Web Speech API", "JSON", "Tailwind CSS"],
    "pdfDescription": `SIGNAVATAR LITE: TEXT-TO-SIGN VISUAL REPLY PLAYER FOR A CORE VOCABULARY
Problem Statement ID: KARE-AI-06 | Domain: Artificial Intelligence & Machine Learning

• THE CORE QUESTION:
How can a frontline clerk's typed reply be conveyed visually in sign language for a deaf citizen using a small recorded vocabulary?

• THE PROBLEM GAP:
Communication at public counters fails in both directions: even when a deaf citizen is understood, hearing staff have no way to reply in sign, leaving the interaction incomplete.

• THE CHALLENGE (24-HR FEASIBILITY):
Build a web tool where the clerk types a reply or picks from quick phrases (e.g., Platform 5, 200 rupees, come tomorrow); the system maps each word to a short pre-recorded sign video clip recorded by the team and plays the sequence, so the deaf citizen can watch the reply in sign.

• SCOPE GUIDANCE:
Same 15 to 25 word core vocabulary as the sign-to-speech direction. Clips are pre-recorded and played in sequence; no grammar-level sign synthesis. Text input or Web Speech API dictation only; no camera needed on this side.

• SOLUTION DIRECTIONS:
• Quick-Phrase Keyboard: One-tap common counter replies.
• Word-to-Clip Mapping Engine: JSON dictionary with fallback text display for missing words.
• Sequenced Playback View: Replay, pause, and speed control on the citizen's screen.

• ANTI-GOALS:
• Full machine translation into ISL grammar
• Photorealistic signing avatars
• Automated two-way conversation

• JUDGING CRITERIA:
• Vocabulary coverage and mapping logic (40%)
• Playback clarity and sequencing (35%)
• Clerk usability (25%)

• RECOMMENDED TECH STACK & RESOURCES:
React / Next.js, HTML5 Video, Web Speech API (optional), JSON`
  },
  {
    "id": "KARE-AI-07",
    "domain": "Artificial Intelligence & Machine Learning",
    "title": "SafeFleet: Driver Drowsiness, Yawning & Distraction Warning Sentinel",
    "coreQuestion": "How can non-intrusive edge computer vision prevent fatal highway collisions by detecting driver fatigue seconds before a crash?",
    "background": "Driver fatigue and microsleeps cause over 30% of nighttime commercial vehicle crashes. Traditional hardware setups require expensive steering sensors or infrared eye trackers that transport operators cannot afford. Simple timer reminders ignore the driver's actual physical condition and fail to act during critical microsleep moments.",
    "description": "Build a lightweight, webcam-based driver safety companion that monitors facial landmarks in real time, computes Eye Aspect Ratio (EAR) and Mouth Aspect Ratio (MAR) to detect microsleeps, continuous yawning, and distraction (looking away), triggering escalating audio alarms.",
    "scopeGuidance": "Run the system on a standard laptop webcam. Simulated sleep (closing eyes for >2 seconds), yawning, and turning heads should trigger the alerts reliably under variable lighting conditions.",
    "requirements": [
      "Real-Time Facial Geometric Ratios: Compute 68-point landmarks to calculate eye aspect ratio dynamically.",
      "Adaptive Fatigue Thresholding: Account for individual natural eye blink baselines.",
      "Escalating Audio Intervention: Trigger loud audio sirens and visual dashboard flashers upon sustained closure."
    ],
    "constraints": [
      "Building automotive CAN-bus hardware telemetry.",
      "Requiring bulky VR headsets or infrared glasses.",
      "Collecting GPS route tracking data instead of focusing on driver vision."
    ],
    "judgingCriteria": "• Fatigue & Yawn Detection Responsiveness (40%)\n• Zero-Lag Real-Time FPS Performance (35%)\n• User Interface & Alarm Escalation Logic (25%)",
    "technologies": ["Python", "OpenCV", "MediaPipe FaceMesh", "Dlib", "NumPy", "Pygame Audio", "Flask", "Streamlit"],
    "pdfDescription": `SAFEFLEET: DRIVER DROWSINESS, YAWNING & DISTRACTION WARNING SENTINEL
Problem Statement ID: KARE-AI-07 | Domain: Artificial Intelligence & Machine Learning

• THE CORE QUESTION:
How can non-intrusive edge computer vision prevent fatal highway collisions by detecting driver fatigue seconds before a crash?

• THE PROBLEM GAP:
Driver fatigue and microsleeps cause over 30% of nighttime commercial vehicle crashes. Traditional hardware setups require expensive steering sensors or infrared eye trackers that transport operators cannot afford. Simple timer reminders ignore the driver's actual physical condition and fail to act during critical microsleep moments.

• THE CHALLENGE:
Build a lightweight, webcam-based driver safety companion that monitors facial landmarks in real time, computes Eye Aspect Ratio (EAR) and Mouth Aspect Ratio (MAR) to detect microsleeps, continuous yawning, and distraction (looking away), triggering escalating audio alarms.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Run the system on a standard laptop webcam. Simulated sleep (closing eyes for >2 seconds), yawning, and turning heads should trigger the alerts reliably under variable lighting conditions.

• SOLUTION DIRECTIONS:
• Real-Time Facial Geometric Ratios: Compute 68-point landmarks to calculate eye aspect ratio dynamically.
• Adaptive Fatigue Thresholding: Account for individual natural eye blink baselines.
• Escalating Audio Intervention: Trigger loud audio sirens and visual dashboard flashers upon sustained closure.

• ANTI-GOALS (WHAT THIS IS NOT):
• Building automotive CAN-bus hardware telemetry.
• Requiring bulky VR headsets or infrared glasses.
• Collecting GPS route tracking data instead of focusing on driver vision.

• JUDGING CRITERIA:
• Fatigue & Yawn Detection Responsiveness (40%)
• Zero-Lag Real-Time FPS Performance (35%)
• User Interface & Alarm Escalation Logic (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, OpenCV, MediaPipe FaceMesh / Dlib, NumPy, Pygame Audio, Flask / Streamlit`
  },
  {
    "id": "KARE-AI-08",
    "domain": "Artificial Intelligence & Machine Learning",
    "title": "LegalBrief AI: RAG-Powered Legal Contract Risk & Hidden Clause Analyzer",
    "coreQuestion": "How can generative AI make legal contracts instantly transparent, identifying hostile liabilities and one-sided clauses for non-lawyers?",
    "background": "Freelancers, gig workers, and startup founders routinely sign 20-page service agreements and vendor contracts without legal counsel. Hidden indemnity clauses, non-compete locks, and unilateral termination terms expose them to severe financial jeopardy. Standard chatbot summaries miss subtle legal loopholes and fail to explain why a clause is dangerous.",
    "description": "Develop an intelligent legal contract analyzer that parses legal PDF documents, uses Retrieval-Augmented Generation (RAG) against a knowledge base of fair contracting principles, and produces a clause-by-clause risk scorecard highlighting hostile terms in plain English.",
    "scopeGuidance": "Teams do not need a full legal library. Ingest sample freelance, NDA, or employment agreements. Emphasize semantic search over text chunks, clear categorization of risks (Red, Amber, Green), and actionable renegotiation suggestions.",
    "requirements": [
      "Automated Clause Extraction: Segment contract into indemnification, liability, termination, and IP clauses.",
      "Risk Scorecard & Plain-English Breakdown: Explain why a clause is unfavorable and suggest balanced wording.",
      "Interactive Clause Q&A: Allow users to ask specific questions ('Can the client terminate without pay?')."
    ],
    "constraints": [
      "Providing certified legal advice or replacing practicing attorneys.",
      "Building a legal CRM or billing platform.",
      "Generic document chat that does not actively evaluate risk."
    ],
    "judgingCriteria": "• Accuracy of Legal Risk Identification (45%)\n• Quality & Clarity of Plain-English Explanations (35%)\n• Interface Design & Document Navigation (20%)",
    "technologies": ["Python", "LangChain", "LlamaIndex", "FAISS", "ChromaDB", "HuggingFace Transformers", "Groq API", "Next.js", "React"],
    "pdfDescription": `LEGALBRIEF AI: RAG-POWERED LEGAL CONTRACT RISK & HIDDEN CLAUSE ANALYZER
Problem Statement ID: KARE-AI-08 | Domain: Artificial Intelligence & Machine Learning

• THE CORE QUESTION:
How can generative AI make legal contracts instantly transparent, identifying hostile liabilities and one-sided clauses for non-lawyers?

• THE PROBLEM GAP:
Freelancers, gig workers, and startup founders routinely sign 20-page service agreements and vendor contracts without legal counsel. Hidden indemnity clauses, non-compete locks, and unilateral termination terms expose them to severe financial jeopardy. Standard chatbot summaries miss subtle legal loopholes and fail to explain why a clause is dangerous.

• THE CHALLENGE:
Develop an intelligent legal contract analyzer that parses legal PDF documents, uses Retrieval-Augmented Generation (RAG) against a knowledge base of fair contracting principles, and produces a clause-by-clause risk scorecard highlighting hostile terms in plain English.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Teams do not need a full legal library. Ingest sample freelance, NDA, or employment agreements. Emphasize semantic search over text chunks, clear categorization of risks (Red, Amber, Green), and actionable renegotiation suggestions.

• SOLUTION DIRECTIONS:
• Automated Clause Extraction: Segment contract into indemnification, liability, termination, and IP clauses.
• Risk Scorecard & Plain-English Breakdown: Explain why a clause is unfavorable and suggest balanced wording.
• Interactive Clause Q&A: Allow users to ask specific questions ('Can the client terminate without pay?').

• ANTI-GOALS (WHAT THIS IS NOT):
• Providing certified legal advice or replacing practicing attorneys.
• Building a legal CRM or billing platform.
• Generic document chat that does not actively evaluate risk.

• JUDGING CRITERIA:
• Accuracy of Legal Risk Identification (45%)
• Quality & Clarity of Plain-English Explanations (35%)
• Interface Design & Document Navigation (20%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, LangChain / LlamaIndex, FAISS / ChromaDB, HuggingFace Transformers / Groq API, Next.js / React`
  },
  {
    "id": "KARE-AI-09",
    "domain": "Artificial Intelligence & Machine Learning",
    "title": "LiveFace: Interactive Face Liveness & Anti-Spoof Authentication",
    "coreQuestion": "How can biometric verification prove a user is physically present without being tricked by high-resolution smartphone screens or printed photos?",
    "background": "With remote video KYC and biometric exams becoming ubiquitous, presentation attacks have surged. Fraudsters hold high-definition tablet screens or curved color printouts in front of webcams to pass attendance and authentication. Static face recognition verifies identity but fails completely at verifying physical liveness.",
    "description": "Design an interactive face liveness detection module that issues random micro-challenges to the user (e.g., blink twice, smile, turn head 30 degrees right) while running frequency texture analysis to detect screen glare, moiré patterns, and printed paper edges.",
    "scopeGuidance": "Focus on detecting 2D presentation attacks (holding up a phone or photo). Implement a reliable challenge-response protocol and basic texture/micro-movement heuristics rather than training multi-modal 3D mesh neural nets from scratch.",
    "requirements": [
      "Dynamic Challenge Sequencer: Issue randomized instructions that pre-recorded videos cannot predict.",
      "Texture & Reflection Analysis: Detect high-frequency screen pixels, device borders, and paper curvature.",
      "Seamless Verification State Machine: Pass or fail within 4-6 seconds with actionable user feedback."
    ],
    "constraints": [
      "Large-scale identity database matching (1:N search).",
      "Requiring specialized 3D depth sensors (iPhone TrueDepth).",
      "High-latency server-side batch analysis."
    ],
    "judgingCriteria": "• Anti-Spoofing Robustness against Screen/Photo Replay (45%)\n• Verification Speed & Low Latency (30%)\n• User Guidance & Interactive Challenge Flow (25%)",
    "technologies": ["OpenCV", "MediaPipe FaceMesh", "NumPy", "SciPy (FFT / Texture)", "Flask", "FastAPI", "React"],
    "pdfDescription": `LIVEFACE: INTERACTIVE FACE LIVENESS & ANTI-SPOOF AUTHENTICATION
Problem Statement ID: KARE-AI-09 | Domain: Artificial Intelligence & Machine Learning

• THE CORE QUESTION:
How can biometric verification prove a user is physically present without being tricked by high-resolution smartphone screens or printed photos?

• THE PROBLEM GAP:
With remote video KYC and biometric exams becoming ubiquitous, presentation attacks have surged. Fraudsters hold high-definition tablet screens or curved color printouts in front of webcams to pass attendance and authentication. Static face recognition verifies identity but fails completely at verifying physical liveness.

• THE CHALLENGE:
Design an interactive face liveness detection module that issues random micro-challenges to the user (e.g., blink twice, smile, turn head 30 degrees right) while running frequency texture analysis to detect screen glare, moiré patterns, and printed paper edges.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Focus on detecting 2D presentation attacks (holding up a phone or photo). Implement a reliable challenge-response protocol and basic texture/micro-movement heuristics rather than training multi-modal 3D mesh neural nets from scratch.

• SOLUTION DIRECTIONS:
• Dynamic Challenge Sequencer: Issue randomized instructions that pre-recorded videos cannot predict.
• Texture & Reflection Analysis: Detect high-frequency screen pixels, device borders, and paper curvature.
• Seamless Verification State Machine: Pass or fail within 4-6 seconds with actionable user feedback.

• ANTI-GOALS (WHAT THIS IS NOT):
• Large-scale identity database matching (1:N search).
• Requiring specialized 3D depth sensors (iPhone TrueDepth).
• High-latency server-side batch analysis.

• JUDGING CRITERIA:
• Anti-Spoofing Robustness against Screen/Photo Replay (45%)
• Verification Speed & Low Latency (30%)
• User Guidance & Interactive Challenge Flow (25%)

• RECOMMENDED TECH STACK & RESOURCES:
OpenCV, MediaPipe FaceMesh, NumPy, SciPy (FFT / Texture), Flask / FastAPI, React`
  },
  {
    "id": "KARE-AI-10",
    "domain": "Artificial Intelligence & Machine Learning",
    "title": "SmartScribe: Doctor-Patient Conversation Summarizer & Prescription Generator",
    "coreQuestion": "How can ambient conversational AI liberate healthcare providers from screens and keyboards during clinical consultations?",
    "background": "Doctors spend nearly 40% of their working hours typing clinical notes into electronic health record systems. This administrative burnout degrades doctor-patient communication and leads to incomplete records. Existing medical dictation tools require rigid voice commands and cannot extract structured insights from natural human dialogue.",
    "description": "Create an ambient clinical assistant that listens to audio recordings of doctor-patient consultations, automatically separates clinical facts from conversational banter, and extracts Chief Complaints, Symptoms, Diagnoses, and Prescribed Medications into a clean, printable medical prescription PDF.",
    "scopeGuidance": "Teams can simulate consultations using synthetic dialogue audio or open clinical consultation datasets (e.g., MTSamples). Focus on natural language entity recognition (symptoms, drugs, dosages) and clinical summary structuring rather than real-time speech recognition optimization.",
    "requirements": [
      "Ambient Conversation Ingestion: Transcribe raw consultation dialogue containing medical terminology.",
      "Clinical Named Entity Recognition: Identify medications, dosages, duration, symptoms, and dietary advice.",
      "Structured Prescription Generation: Export a standardized digital prescription ready for doctor sign-off."
    ],
    "constraints": [
      "Autonomous diagnosis without doctor intervention.",
      "Complex hospital inventory billing integration.",
      "Requiring clinical EHR software deployment."
    ],
    "judgingCriteria": "• Extraction Accuracy for Clinical Entities (40%)\n• Quality & Structure of Medical Summary (35%)\n• Doctor Review & Editing Experience (25%)",
    "technologies": ["Whisper API", "VOSK", "spaCy", "scispaCy", "ReportLab", "jsPDF", "Python", "Next.js", "Tailwind CSS"],
    "pdfDescription": `SMARTSCRIBE: DOCTOR-PATIENT CONVERSATION SUMMARIZER & PRESCRIPTION GENERATOR
Problem Statement ID: KARE-AI-10 | Domain: Artificial Intelligence & Machine Learning

• THE CORE QUESTION:
How can ambient conversational AI liberate healthcare providers from screens and keyboards during clinical consultations?

• THE PROBLEM GAP:
Doctors spend nearly 40% of their working hours typing clinical notes into electronic health record systems. This administrative burnout degrades doctor-patient communication and leads to incomplete records. Existing medical dictation tools require rigid voice commands and cannot extract structured insights from natural human dialogue.

• THE CHALLENGE:
Create an ambient clinical assistant that listens to audio recordings of doctor-patient consultations, automatically separates clinical facts from conversational banter, and extracts Chief Complaints, Symptoms, Diagnoses, and Prescribed Medications into a clean, printable medical prescription PDF.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Teams can simulate consultations using synthetic dialogue audio or open clinical consultation datasets (e.g., MTSamples). Focus on natural language entity recognition (symptoms, drugs, dosages) and clinical summary structuring rather than real-time speech recognition optimization.

• SOLUTION DIRECTIONS:
• Ambient Conversation Ingestion: Transcribe raw consultation dialogue containing medical terminology.
• Clinical Named Entity Recognition: Identify medications, dosages, duration, symptoms, and dietary advice.
• Structured Prescription Generation: Export a standardized digital prescription ready for doctor sign-off.

• ANTI-GOALS (WHAT THIS IS NOT):
• Autonomous diagnosis without doctor intervention.
• Complex hospital inventory billing integration.
• Requiring clinical EHR software deployment.

• JUDGING CRITERIA:
• Extraction Accuracy for Clinical Entities (40%)
• Quality & Structure of Medical Summary (35%)
• Doctor Review & Editing Experience (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Whisper API / VOSK, spaCy (scispaCy / NER), ReportLab / jsPDF, Python, Next.js / Tailwind CSS`
  },
  {
    "id": "KARE-SEC-01",
    "domain": "Cybersecurity & Blockchain",
    "title": "PhishGuard: Intelligent Email Threat Hunter & Header Geolocation Analyzer",
    "coreQuestion": "How can an automated email analyzer uncover hidden spoofing, malicious attachments, and weaponized URLs before an employee clicks?",
    "background": "Spear-phishing remains the primary initial attack vector for over 85% of corporate ransomware breaches. Modern attackers forge display names, leverage open redirect URLs, and exploit misconfigured SPF/DMARC records. Standard mail clients provide no visibility into message headers, leaving users unable to assess risk.",
    "description": "Build an automated email security triage tool that accepts uploaded .eml files or pasted headers, parses RFC 822 routing headers, validates SPF/DKIM/DMARC alignment, traces relay IP geolocation on a world map, and scans body content for deceptive psychological triggers and suspicious URLs.",
    "scopeGuidance": "Use open sample phishing email corpora (e.g., Enron/SpamAssassin datasets or custom simulated phishing emails). Emphasize header parsing, cryptographic signature validation status, and threat score explainability.",
    "requirements": [
      "Header Integrity Parser: Validate SPF, DKIM, and DMARC alignment against the envelope sender.",
      "Visual IP Relay Hop Map: Plot intermediate mail transfer agents across countries to highlight anomalous routes.",
      "Content & URL Risk Engine: Flag lookalike domains, shortened URLs, and high-pressure social engineering keywords."
    ],
    "constraints": [
      "Replacing enterprise email gateways (like Proofpoint/Mimecast).",
      "Building a full-fledged email client with inbox sync.",
      "Launching offensive brute-force credential attacks."
    ],
    "judgingCriteria": "• Forensic Header Parsing & Integrity Verification (40%)\n• Threat Scoring Logic & Geolocation Visualization (35%)\n• Usability & Speed of Triage Report (25%)",
    "technologies": ["Python", "email/mailbox module", "MaxMind GeoIP", "IP-API", "BeautifulSoup", "React", "Leaflet.js", "FastAPI"],
    "pdfDescription": `PHISHGUARD: INTELLIGENT EMAIL THREAT HUNTER & HEADER GEOLOCATION ANALYZER
Problem Statement ID: KARE-SEC-01 | Domain: Cybersecurity & Blockchain

• THE CORE QUESTION:
How can an automated email analyzer uncover hidden spoofing, malicious attachments, and weaponized URLs before an employee clicks?

• THE PROBLEM GAP:
Spear-phishing remains the primary initial attack vector for over 85% of corporate ransomware breaches. Modern attackers forge display names, leverage open redirect URLs, and exploit misconfigured SPF/DMARC records. Standard mail clients provide no visibility into message headers, leaving users unable to assess risk.

• THE CHALLENGE:
Build an automated email security triage tool that accepts uploaded .eml files or pasted headers, parses RFC 822 routing headers, validates SPF/DKIM/DMARC alignment, traces relay IP geolocation on a world map, and scans body content for deceptive psychological triggers and suspicious URLs.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Use open sample phishing email corpora (e.g., Enron/SpamAssassin datasets or custom simulated phishing emails). Emphasize header parsing, cryptographic signature validation status, and threat score explainability.

• SOLUTION DIRECTIONS:
• Header Integrity Parser: Validate SPF, DKIM, and DMARC alignment against the envelope sender.
• Visual IP Relay Hop Map: Plot intermediate mail transfer agents across countries to highlight anomalous routes.
• Content & URL Risk Engine: Flag lookalike domains, shortened URLs, and high-pressure social engineering keywords.

• ANTI-GOALS (WHAT THIS IS NOT):
• Replacing enterprise email gateways (like Proofpoint/Mimecast).
• Building a full-fledged email client with inbox sync.
• Launching offensive brute-force credential attacks.

• JUDGING CRITERIA:
• Forensic Header Parsing & Integrity Verification (40%)
• Threat Scoring Logic & Geolocation Visualization (35%)
• Usability & Speed of Triage Report (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, email/mailbox module, MaxMind GeoIP / IP-API, BeautifulSoup, React, Leaflet.js, FastAPI`
  },
  {
    "id": "KARE-SEC-02",
    "domain": "Cybersecurity & Blockchain",
    "title": "TrustDegree: Soulbound NFT-Based Academic Credential Verification Platform",
    "coreQuestion": "How can decentralized ledger technology permanently eliminate degree certificate forgery and streamline instant worldwide employment checks?",
    "background": "Degree forgery and certificate mills undermine academic trust, forcing employers to hire third-party background check agencies that take 3-6 weeks per verification. Paper certificates and simple digital PDFs are trivial to modify in image editors, while centralized university databases face single-point-of-failure vulnerabilities and downtime.",
    "description": "Develop a decentralized academic credential platform on an EVM-compatible testnet (Polygon/Sepolia) where authorized institutions issue non-transferable Soulbound Tokens (SBTs) representing degrees to student wallet addresses, accompanied by a public QR verification portal for employers.",
    "scopeGuidance": "Deploy on a testnet. The key is proving non-transferability (preventing students from selling or sending their degree NFT to others), metadata hashing on IPFS, and a 1-click mobile verification view that displays credential legitimacy in seconds.",
    "requirements": [
      "Soulbound Smart Contract (ERC-5192 / Custom): Restrict token transfers to enforce permanent owner binding.",
      "Decentralized Storage (IPFS): Pin academic transcript metadata, student details, and cryptographic hashes.",
      "Instant Verifier Portal: Scan resume QR codes to instantly validate issuer public key and certificate status."
    ],
    "constraints": [
      "Storing raw confidential student personal data directly on public blockchains.",
      "Monetizing certificates or building an NFT trading marketplace.",
      "Writing custom cryptographic consensus protocols."
    ],
    "judgingCriteria": "• Smart Contract Architecture & Security (40%)\n• Non-Transferability & IPFS Integration (30%)\n• Employer Verification Workflow (30%)",
    "technologies": ["Solidity", "Polygon Amoy Testnet", "Hardhat", "Foundry", "Ethers.js", "IPFS", "Pinata", "Next.js", "React"],
    "pdfDescription": `TRUSTDEGREE: SOULBOUND NFT-BASED ACADEMIC CREDENTIAL VERIFICATION PLATFORM
Problem Statement ID: KARE-SEC-02 | Domain: Cybersecurity & Blockchain

• THE CORE QUESTION:
How can decentralized ledger technology permanently eliminate degree certificate forgery and streamline instant worldwide employment checks?

• THE PROBLEM GAP:
Degree forgery and certificate mills undermine academic trust, forcing employers to hire third-party background check agencies that take 3-6 weeks per verification. Paper certificates and simple digital PDFs are trivial to modify in image editors, while centralized university databases face single-point-of-failure vulnerabilities and downtime.

• THE CHALLENGE:
Develop a decentralized academic credential platform on an EVM-compatible testnet (Polygon/Sepolia) where authorized institutions issue non-transferable Soulbound Tokens (SBTs) representing degrees to student wallet addresses, accompanied by a public QR verification portal for employers.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Deploy on a testnet. The key is proving non-transferability (preventing students from selling or sending their degree NFT to others), metadata hashing on IPFS, and a 1-click mobile verification view that displays credential legitimacy in seconds.

• SOLUTION DIRECTIONS:
• Soulbound Smart Contract (ERC-5192 / Custom): Restrict token transfers to enforce permanent owner binding.
• Decentralized Storage (IPFS): Pin academic transcript metadata, student details, and cryptographic hashes.
• Instant Verifier Portal: Scan resume QR codes to instantly validate issuer public key and certificate status.

• ANTI-GOALS (WHAT THIS IS NOT):
• Storing raw confidential student personal data directly on public blockchains.
• Monetizing certificates or building an NFT trading marketplace.
• Writing custom cryptographic consensus protocols.

• JUDGING CRITERIA:
• Smart Contract Architecture & Security (40%)
• Non-Transferability & IPFS Integration (30%)
• Employer Verification Workflow (30%)

• RECOMMENDED TECH STACK & RESOURCES:
Solidity, Polygon Amoy Testnet, Hardhat / Foundry, Ethers.js, IPFS / Pinata, Next.js / React`
  },
  {
    "id": "KARE-SEC-03",
    "domain": "Cybersecurity & Blockchain",
    "title": "CryptoTrace: Multi-Hop Crypto Wallet Fund Flow & Money Laundering Visualizer",
    "coreQuestion": "How can visual graph intelligence untangle complex multi-wallet crypto dispersals and identify when illicit funds enter exchange off-ramps?",
    "background": "Criminal syndicates operating ransomware, investment scams, and cyber extortion rapidly route stolen cryptocurrency through peeling chains and mixer wallets across multiple hops. Investigating officers cannot track these transactions through standard block explorers, as reading tabular transaction lists with hundreds of hex addresses is nearly impossible.",
    "description": "Create an automated blockchain intelligence visualizer that takes a suspect wallet address, queries public blockchain APIs (Ethereum/Bitcoin), recursively maps transaction flows across up to 3 hops, and highlights anomalous fund splitting and interactions with known exchange deposit wallets.",
    "scopeGuidance": "Use public testnet transactions or mainnet transaction histories via free APIs (Etherscan, Blockstream, Alchemy). Focus on graph generation (nodes as wallets, edges as transactions with amounts) and identifying clustering behaviors.",
    "requirements": [
      "Recursive Transaction Graph Generation: Expand outgoing and incoming transactions into a directed graph.",
      "Rapid Dispersal & Peel Chain Detection: Highlight wallets that immediately forward identical funds to split addresses.",
      "Centralized Exchange Attribution: Flag transactions that terminate at known Binance/Coinbase hot wallets."
    ],
    "constraints": [
      "Cracking private keys or seed phrases.",
      "Performing deanonymization through dark web hacking.",
      "Re-indexing the entire multi-terabyte Ethereum blockchain locally."
    ],
    "judgingCriteria": "• Graph Visualization & Multi-Hop Navigation (45%)\n• Heuristic Identification of Laundering Patterns (30%)\n• Performance & API Throttling Handling (25%)",
    "technologies": ["Python", "Web3.py", "Etherscan API", "NetworkX", "Cytoscape.js", "D3.js", "FastAPI", "React", "Tailwind CSS"],
    "pdfDescription": `CRYPTOTRACE: MULTI-HOP CRYPTO WALLET FUND FLOW & MONEY LAUNDERING VISUALIZER
Problem Statement ID: KARE-SEC-03 | Domain: Cybersecurity & Blockchain

• THE CORE QUESTION:
How can visual graph intelligence untangle complex multi-wallet crypto dispersals and identify when illicit funds enter exchange off-ramps?

• THE PROBLEM GAP:
Criminal syndicates operating ransomware, investment scams, and cyber extortion rapidly route stolen cryptocurrency through peeling chains and mixer wallets across multiple hops. Investigating officers cannot track these transactions through standard block explorers, as reading tabular transaction lists with hundreds of hex addresses is nearly impossible.

• THE CHALLENGE:
Create an automated blockchain intelligence visualizer that takes a suspect wallet address, queries public blockchain APIs (Ethereum/Bitcoin), recursively maps transaction flows across up to 3 hops, and highlights anomalous fund splitting and interactions with known exchange deposit wallets.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Use public testnet transactions or mainnet transaction histories via free APIs (Etherscan, Blockstream, Alchemy). Focus on graph generation (nodes as wallets, edges as transactions with amounts) and identifying clustering behaviors.

• SOLUTION DIRECTIONS:
• Recursive Transaction Graph Generation: Expand outgoing and incoming transactions into a directed graph.
• Rapid Dispersal & Peel Chain Detection: Highlight wallets that immediately forward identical funds to split addresses.
• Centralized Exchange Attribution: Flag transactions that terminate at known Binance/Coinbase hot wallets.

• ANTI-GOALS (WHAT THIS IS NOT):
• Cracking private keys or seed phrases.
• Performing deanonymization through dark web hacking.
• Re-indexing the entire multi-terabyte Ethereum blockchain locally.

• JUDGING CRITERIA:
• Graph Visualization & Multi-Hop Navigation (45%)
• Heuristic Identification of Laundering Patterns (30%)
• Performance & API Throttling Handling (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, Web3.py / Etherscan API, NetworkX, Cytoscape.js / D3.js, FastAPI, React / Tailwind CSS`
  },
  {
    "id": "KARE-SEC-04",
    "domain": "Cybersecurity & Blockchain",
    "title": "DataMask: Automated Document PII Redaction & Leak Prevention Sentinel",
    "coreQuestion": "How can public institutions publish digital notices and gazettes without accidentally leaking citizen identity numbers and financial data?",
    "background": "Government departments, universities, and legal registries frequently publish public PDF circulars, results, and case files containing unredacted national identification numbers, phone numbers, home addresses, and bank accounts. Black marker redactions or layered PDFs often fail, allowing attackers to select and copy the text hidden beneath.",
    "description": "Build a privacy-preserving document sanitizer that scans uploaded PDF and image documents, employs regular expressions and Named Entity Recognition (NER) to detect sensitive personal identifiers, and produces an irreversibly flattened, redacted document with permanent blacked-out bounding boxes.",
    "scopeGuidance": "Support standard scanned and text-based PDFs. The system must physically remove text streams and render redacted areas as permanent pixels, ensuring that no underlying text can be recovered through copy-paste or PDF text extractors.",
    "requirements": [
      "Multi-Modal PII Extraction: Detect citizen IDs, phone numbers, email addresses, and bank IFSC numbers.",
      "Permanent Rasterized Redaction: Burn solid black blocks directly into rendered page images.",
      "Dual-View Compliance Auditor: Provide side-by-side view showing detected entities and sanitized preview."
    ],
    "constraints": [
      "Simple CSS black overlay that leaves underlying text in the PDF file.",
      "Complex enterprise DLP policy engines with thousands of enterprise rules.",
      "Manual redacting of every individual word."
    ],
    "judgingCriteria": "• Redaction Irreversibility & Security (40%)\n• Detection Accuracy for PII Entities (35%)\n• Document Formatting Preservation & UX (25%)",
    "technologies": ["Python", "PyPDF", "pdfplumber", "Tesseract OCR", "spaCy", "Streamlit", "React", "ReportLab"],
    "pdfDescription": `DATAMASK: AUTOMATED DOCUMENT PII REDACTION & LEAK PREVENTION SENTINEL
Problem Statement ID: KARE-SEC-04 | Domain: Cybersecurity & Blockchain

• THE CORE QUESTION:
How can public institutions publish digital notices and gazettes without accidentally leaking citizen identity numbers and financial data?

• THE PROBLEM GAP:
Government departments, universities, and legal registries frequently publish public PDF circulars, results, and case files containing unredacted national identification numbers, phone numbers, home addresses, and bank accounts. Black marker redactions or layered PDFs often fail, allowing attackers to select and copy the text hidden beneath.

• THE CHALLENGE:
Build a privacy-preserving document sanitizer that scans uploaded PDF and image documents, employs regular expressions and Named Entity Recognition (NER) to detect sensitive personal identifiers, and produces an irreversibly flattened, redacted document with permanent blacked-out bounding boxes.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Support standard scanned and text-based PDFs. The system must physically remove text streams and render redacted areas as permanent pixels, ensuring that no underlying text can be recovered through copy-paste or PDF text extractors.

• SOLUTION DIRECTIONS:
• Multi-Modal PII Extraction: Detect citizen IDs, phone numbers, email addresses, and bank IFSC numbers.
• Permanent Rasterized Redaction: Burn solid black blocks directly into rendered page images.
• Dual-View Compliance Auditor: Provide side-by-side view showing detected entities and sanitized preview.

• ANTI-GOALS (WHAT THIS IS NOT):
• Simple CSS black overlay that leaves underlying text in the PDF file.
• Complex enterprise DLP policy engines with thousands of enterprise rules.
• Manual redacting of every individual word.

• JUDGING CRITERIA:
• Redaction Irreversibility & Security (40%)
• Detection Accuracy for PII Entities (35%)
• Document Formatting Preservation & UX (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, PyPDF, pdfplumber, Tesseract OCR, spaCy (NER), Streamlit / React, ReportLab`
  },
  {
    "id": "KARE-SEC-05",
    "domain": "Cybersecurity & Blockchain",
    "title": "NetSentry: Live Network Traffic Anomaly & DDoS Mitigation Sentinel",
    "coreQuestion": "How can behavioral packet analytics detect network intrusion scans and distributed denial-of-service floods before servers collapse?",
    "background": "Cloud servers and campus intranets are subjected to constant automated port scanning, SSH brute force attacks, and volumetric DDoS floods. Traditional firewalls rely on static IP blacklists, which fail against rotating residential proxies and newly orchestrated botnets.",
    "description": "Develop an automated network traffic monitoring engine that ingests PCAP log streams or synthetic packet feeds, extracts statistical features (packet arrival rate, protocol entropy, SYN/ACK ratios), and runs an anomaly detection model to flag attacks and dynamically output firewall block rules.",
    "scopeGuidance": "Use benchmark intrusion datasets (NSL-KDD, CIC-IDS2017) or simulated live Scapy packet streams. Focus on distinguishing normal web browsing traffic from SYN floods and port sweeps.",
    "requirements": [
      "Statistical Flow Feature Extraction: Calculate rolling packet velocity, average payload size, and TCP flag distribution.",
      "Unsupervised Anomaly Detection: Train an Isolation Forest / One-Class SVM to flag traffic outliers.",
      "Automated Mitigation Output: Generate live iptables commands and visual bandwidth spike warnings."
    ],
    "constraints": [
      "Building a multi-gigabit hardware packet inspection appliance.",
      "Deep packet inspection of encrypted TLS payloads.",
      "Performing offensive network attacks on external targets."
    ],
    "judgingCriteria": "• Anomaly Detection Precision & Low False Positives (40%)\n• Live Dashboard Visualization & Flow Metrics (35%)\n• Mitigation Rule Generation & Code Quality (25%)",
    "technologies": ["Python", "Scapy", "Scikit-learn", "Pandas", "Dash", "Streamlit", "React", "FastAPI"],
    "pdfDescription": `NETSENTRY: LIVE NETWORK TRAFFIC ANOMALY & DDOS MITIGATION SENTINEL
Problem Statement ID: KARE-SEC-05 | Domain: Cybersecurity & Blockchain

• THE CORE QUESTION:
How can behavioral packet analytics detect network intrusion scans and distributed denial-of-service floods before servers collapse?

• THE PROBLEM GAP:
Cloud servers and campus intranets are subjected to constant automated port scanning, SSH brute force attacks, and volumetric DDoS floods. Traditional firewalls rely on static IP blacklists, which fail against rotating residential proxies and newly orchestrated botnets.

• THE CHALLENGE:
Develop an automated network traffic monitoring engine that ingests PCAP log streams or synthetic packet feeds, extracts statistical features (packet arrival rate, protocol entropy, SYN/ACK ratios), and runs an anomaly detection model to flag attacks and dynamically output firewall block rules.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Use benchmark intrusion datasets (NSL-KDD, CIC-IDS2017) or simulated live Scapy packet streams. Focus on distinguishing normal web browsing traffic from SYN floods and port sweeps.

• SOLUTION DIRECTIONS:
• Statistical Flow Feature Extraction: Calculate rolling packet velocity, average payload size, and TCP flag distribution.
• Unsupervised Anomaly Detection: Train an Isolation Forest / One-Class SVM to flag traffic outliers.
• Automated Mitigation Output: Generate live iptables commands and visual bandwidth spike warnings.

• ANTI-GOALS (WHAT THIS IS NOT):
• Building a multi-gigabit hardware packet inspection appliance.
• Deep packet inspection of encrypted TLS payloads.
• Performing offensive network attacks on external targets.

• JUDGING CRITERIA:
• Anomaly Detection Precision & Low False Positives (40%)
• Live Dashboard Visualization & Flow Metrics (35%)
• Mitigation Rule Generation & Code Quality (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, Scapy, Scikit-learn, Pandas, Dash / Streamlit / React, FastAPI, CIC-IDS dataset samples`
  },
  {
    "id": "KARE-SEC-06",
    "domain": "Cybersecurity & Blockchain",
    "title": "VulnHunter: Automated Web Application Security Fuzzer & Vulnerability Scanner",
    "coreQuestion": "How can student and startup web applications be continuously audited for critical OWASP Top 10 vulnerabilities before production deployment?",
    "background": "Developers frequently deploy web applications with critical vulnerabilities such as SQL injection, cross-site scripting (XSS), and exposed administrative files (.git, .env). Commercial enterprise vulnerability scanners (Qualys, Nessus) are expensive, complex, and heavy, while manual penetration testing cannot scale to continuous deployments.",
    "description": "Build a lightweight, automated web application vulnerability fuzzer that takes a local or staging URL, crawls endpoints and form inputs, injects non-destructive security payloads, and produces an actionable vulnerability remediation scorecard.",
    "scopeGuidance": "Test against intentionally vulnerable web applications (DVWA, Juice Shop, or a custom test Flask app). Focus on detecting SQLi error reflection, Reflected XSS execution proof, and sensitive endpoint discovery (.env, /admin).",
    "requirements": [
      "Automated Endpoint & Form Crawler: Extract all <form> action parameters, query strings, and routes.",
      "Payload Injection Engine: Test parameterized payloads for SQL syntax errors and HTML script reflection.",
      "Actionable Developer Report: Detail exact reproduction steps, affected URLs, and code-level remediation advice."
    ],
    "constraints": [
      "Destructive hacking (database dropping, website defacement).",
      "Brute-forcing production third-party websites without permission.",
      "Exhaustive scanning that takes hours to complete."
    ],
    "judgingCriteria": "• Vulnerability Detection Accuracy without False Positives (40%)\n• Safe Fuzzing Execution & Reporting Clarity (35%)\n• Crawler Depth & Form Handling (25%)",
    "technologies": ["Python", "Requests", "BeautifulSoup4", "SQLite", "Tailwind CSS", "Flask", "Node.js"],
    "pdfDescription": `VULNHUNTER: AUTOMATED WEB APPLICATION SECURITY FUZZER & VULNERABILITY SCANNER
Problem Statement ID: KARE-SEC-06 | Domain: Cybersecurity & Blockchain

• THE CORE QUESTION:
How can student and startup web applications be continuously audited for critical OWASP Top 10 vulnerabilities before production deployment?

• THE PROBLEM GAP:
Developers frequently deploy web applications with critical vulnerabilities such as SQL injection, cross-site scripting (XSS), and exposed administrative files (.git, .env). Commercial enterprise vulnerability scanners (Qualys, Nessus) are expensive, complex, and heavy, while manual penetration testing cannot scale to continuous deployments.

• THE CHALLENGE:
Build a lightweight, automated web application vulnerability fuzzer that takes a local or staging URL, crawls endpoints and form inputs, injects non-destructive security payloads, and produces an actionable vulnerability remediation scorecard.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Test against intentionally vulnerable web applications (DVWA, Juice Shop, or a custom test Flask app). Focus on detecting SQLi error reflection, Reflected XSS execution proof, and sensitive endpoint discovery (.env, /admin).

• SOLUTION DIRECTIONS:
• Automated Endpoint & Form Crawler: Extract all <form> action parameters, query strings, and routes.
• Payload Injection Engine: Test parameterized payloads for SQL syntax errors and HTML script reflection.
• Actionable Developer Report: Detail exact reproduction steps, affected URLs, and code-level remediation advice.

• ANTI-GOALS (WHAT THIS IS NOT):
• Destructive hacking (database dropping, website defacement).
• Brute-forcing production third-party websites without permission.
• Exhaustive scanning that takes hours to complete.

• JUDGING CRITERIA:
• Vulnerability Detection Accuracy without False Positives (40%)
• Safe Fuzzing Execution & Reporting Clarity (35%)
• Crawler Depth & Form Handling (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, Requests, BeautifulSoup4, SQLite, Tailwind CSS, Flask / Node.js`
  },
  {
    "id": "KARE-SEC-07",
    "domain": "Cybersecurity & Blockchain",
    "title": "RapidTriage: Endpoint Incident Response & Digital Forensic Timeline Extractor",
    "coreQuestion": "How can a first responder reconstruct the timeline of an endpoint cyber compromise in under 3 minutes without tampering with evidence?",
    "background": "When a corporate workstation or lab PC is suspected of infection, incident responders must quickly understand what occurred: what files were downloaded, what USB drives were inserted, and what commands were executed. Manually opening Windows Event Viewer, registry hives, and browser databases takes hours, during which malware may erase evidence.",
    "description": "Create a portable forensic triage script that runs on an endpoint, extracts key volatile artifacts (browser SQLite history, USB insertion registry keys, recently executed programs via UserAssist/Prefetch, and active network connections), and visualizes a unified chronological incident timeline.",
    "scopeGuidance": "Simulate endpoint artifacts on a local machine or process sample registry and browser database files. Focus on timeline reconstruction and highlighting anomalous activities (e.g. executable launched from temp directory after suspicious download).",
    "requirements": [
      "Multi-Artifact Parser: Parse SQLite history from Chrome/Firefox, USB serial keys, and execution logs.",
      "Chronological Incident Timeline: Assemble events from multiple sources into a single navigable timeline.",
      "Suspicious Activity Highlighting: Flag processes running from %AppData% or execution right after download."
    ],
    "constraints": [
      "Complex kernel-level memory dump acquisition (Volatility).",
      "Bypassing administrative permissions or writing malicious rootkits.",
      "Encrypted file system cracking."
    ],
    "judgingCriteria": "• Timeline Correlation & Artifact Extraction Accuracy (45%)\n• Forensic Integrity & Non-Destructive Operation (30%)\n• Dashboard Clarity & Filterability (25%)",
    "technologies": ["Python", "SQLite3", "psutil", "winreg", "Chart.js", "HTML5", "Flask", "Streamlit"],
    "pdfDescription": `RAPIDTRIAGE: ENDPOINT INCIDENT RESPONSE & DIGITAL FORENSIC TIMELINE EXTRACTOR
Problem Statement ID: KARE-SEC-07 | Domain: Cybersecurity & Blockchain

• THE CORE QUESTION:
How can a first responder reconstruct the timeline of an endpoint cyber compromise in under 3 minutes without tampering with evidence?

• THE PROBLEM GAP:
When a corporate workstation or lab PC is suspected of infection, incident responders must quickly understand what occurred: what files were downloaded, what USB drives were inserted, and what commands were executed. Manually opening Windows Event Viewer, registry hives, and browser databases takes hours, during which malware may erase evidence.

• THE CHALLENGE:
Create a portable forensic triage script that runs on an endpoint, extracts key volatile artifacts (browser SQLite history, USB insertion registry keys, recently executed programs via UserAssist/Prefetch, and active network connections), and visualizes a unified chronological incident timeline.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Simulate endpoint artifacts on a local machine or process sample registry and browser database files. Focus on timeline reconstruction and highlighting anomalous activities (e.g. executable launched from temp directory after suspicious download).

• SOLUTION DIRECTIONS:
• Multi-Artifact Parser: Parse SQLite history from Chrome/Firefox, USB serial keys, and execution logs.
• Chronological Incident Timeline: Assemble events from multiple sources into a single navigable timeline.
• Suspicious Activity Highlighting: Flag processes running from %AppData% or execution right after download.

• ANTI-GOALS (WHAT THIS IS NOT):
• Complex kernel-level memory dump acquisition (Volatility).
• Bypassing administrative permissions or writing malicious rootkits.
• Encrypted file system cracking.

• JUDGING CRITERIA:
• Timeline Correlation & Artifact Extraction Accuracy (45%)
• Forensic Integrity & Non-Destructive Operation (30%)
• Dashboard Clarity & Filterability (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, SQLite3, OS / psutil / winreg, Chart.js, HTML5 / Flask / Streamlit`
  },
  {
    "id": "KARE-SEC-08",
    "domain": "Cybersecurity & Blockchain",
    "title": "AgriLedger: Farm-to-Fork Transparent Organic Produce Provenance DApp",
    "coreQuestion": "How can consumers be guaranteed that organic produce is truly authentic, unadulterated, and sustainably cultivated?",
    "background": "Organic food markets command a 30-50% price premium, creating an enormous incentive for unscrupulous suppliers to label conventionally grown, pesticide-treated crops as 'organic.' Centralized certification paper labels are easily forged, and consumers have no verifiable proof of farm origin or chemical residue testing.",
    "description": "Develop an end-to-end decentralized food provenance application on an EVM testnet where certified farmers log harvest batches, licensed labs upload verifiable pesticide-free test certificates to IPFS, and consumers scan packaging QR codes to view the immutable lifecycle.",
    "scopeGuidance": "Deploy a prototype smart contract tracking 3 key milestones: Harvest Log -> Lab Certification -> Distribution Hub. Consumer scans a dynamic QR code on their smartphone to view the verified timeline.",
    "requirements": [
      "Provenance Smart Contract: Record batch IDs, timestamped transitions, and authorized actor signatures.",
      "IPFS Lab Certificate Storage: Pin decentralized lab reports and geotagged farm photos on IPFS.",
      "Consumer Verification View: Clean mobile UI showing farm location, harvest date, and lab approval hash."
    ],
    "constraints": [
      "Physical barcode hardware printer integration.",
      "Financial token speculation or crypto trading exchanges.",
      "Complex multi-national customs tracking."
    ],
    "judgingCriteria": "• Smart Contract Integrity & Role-Based Permissions (40%)\n• Decentralized File Storage & Data Linking (30%)\n• Consumer Trust UI & QR Scan Experience (30%)",
    "technologies": ["Solidity", "Polygon Amoy Testnet", "IPFS", "Pinata", "Hardhat", "React", "Wagmi", "Ethers.js"],
    "pdfDescription": `AGRILEDGER: FARM-TO-FORK TRANSPARENT ORGANIC PRODUCE PROVENANCE DAPP
Problem Statement ID: KARE-SEC-08 | Domain: Cybersecurity & Blockchain

• THE CORE QUESTION:
How can consumers be guaranteed that organic produce is truly authentic, unadulterated, and sustainably cultivated?

• THE PROBLEM GAP:
Organic food markets command a 30-50% price premium, creating an enormous incentive for unscrupulous suppliers to label conventionally grown, pesticide-treated crops as 'organic.' Centralized certification paper labels are easily forged, and consumers have no verifiable proof of farm origin or chemical residue testing.

• THE CHALLENGE:
Develop an end-to-end decentralized food provenance application on an EVM testnet where certified farmers log harvest batches, licensed labs upload verifiable pesticide-free test certificates to IPFS, and consumers scan packaging QR codes to view the immutable lifecycle.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Deploy a prototype smart contract tracking 3 key milestones: Harvest Log -> Lab Certification -> Distribution Hub. Consumer scans a dynamic QR code on their smartphone to view the verified timeline.

• SOLUTION DIRECTIONS:
• Provenance Smart Contract: Record batch IDs, timestamped transitions, and authorized actor signatures.
• IPFS Lab Certificate Storage: Pin decentralized lab reports and geotagged farm photos on IPFS.
• Consumer Verification View: Clean mobile UI showing farm location, harvest date, and lab approval hash.

• ANTI-GOALS (WHAT THIS IS NOT):
• Physical barcode hardware printer integration.
• Financial token speculation or crypto trading exchanges.
• Complex multi-national customs tracking.

• JUDGING CRITERIA:
• Smart Contract Integrity & Role-Based Permissions (40%)
• Decentralized File Storage & Data Linking (30%)
• Consumer Trust UI & QR Scan Experience (30%)

• RECOMMENDED TECH STACK & RESOURCES:
Solidity, Polygon Amoy Testnet, IPFS / Pinata, Hardhat, React / Wagmi / Ethers.js`
  },
  {
    "id": "KARE-SEC-09",
    "domain": "Cybersecurity & Blockchain",
    "title": "AndroidStaticScan: Automated Mobile APK Security & Secret Leak Auditor",
    "coreQuestion": "How can developers detect leaked API keys, hardcoded database credentials, and dangerous Android permissions in compiled mobile APKs?",
    "background": "Mobile developers frequently ship Android apps with compiled-in production AWS secret keys, Firebase URLs with open read/write rules, and excessive permission requests. Attackers routinely decompile APKs using free tools to harvest these credentials, gaining unauthorized access to cloud backends and user databases.",
    "description": "Create an automated static analysis tool that accepts an uploaded Android APK file, extracts and parses the AndroidManifest.xml and decompiled DEX bytecode, scans for hardcoded secrets and tokens using regex rules, and evaluates permission risks against security best practices.",
    "scopeGuidance": "Test on open-source APKs or build a sample test APK with dummy leaked API keys. Focus on manifest permission risk scoring and regex detection of high-value secrets (Google API keys, AWS credentials, private keys).",
    "requirements": [
      "APK Decompilation & Extraction: Extract manifest structure, package names, and readable string constants.",
      "Hardcoded Secret Scanner: Scan for AWS access keys, JWT tokens, Stripe keys, and cleartext passwords.",
      "Permission & Component Risk Matrix: Flag exported activities, broadcast receivers, and excessive permissions."
    ],
    "constraints": [
      "Dynamic malware sandbox execution in an emulator.",
      "Developing mobile malware or bypassing Android OS security.",
      "Decompiling heavily obfuscated native C++ binaries."
    ],
    "judgingCriteria": "• Secret Detection Accuracy & Regex Coverage (45%)\n• Permission Security Assessment & Risk Grading (30%)\n• Report Usability for Developers (25%)",
    "technologies": ["Python", "Androguard", "Apktool", "Regex", "Streamlit", "Next.js", "FastAPI"],
    "pdfDescription": `ANDROIDSTATICSCAN: AUTOMATED MOBILE APK SECURITY & SECRET LEAK AUDITOR
Problem Statement ID: KARE-SEC-09 | Domain: Cybersecurity & Blockchain

• THE CORE QUESTION:
How can developers detect leaked API keys, hardcoded database credentials, and dangerous Android permissions in compiled mobile APKs?

• THE PROBLEM GAP:
Mobile developers frequently ship Android apps with compiled-in production AWS secret keys, Firebase URLs with open read/write rules, and excessive permission requests. Attackers routinely decompile APKs using free tools to harvest these credentials, gaining unauthorized access to cloud backends and user databases.

• THE CHALLENGE:
Create an automated static analysis tool that accepts an uploaded Android APK file, extracts and parses the AndroidManifest.xml and decompiled DEX bytecode, scans for hardcoded secrets and tokens using regex rules, and evaluates permission risks against security best practices.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Test on open-source APKs or build a sample test APK with dummy leaked API keys. Focus on manifest permission risk scoring and regex detection of high-value secrets (Google API keys, AWS credentials, private keys).

• SOLUTION DIRECTIONS:
• APK Decompilation & Extraction: Extract manifest structure, package names, and readable string constants.
• Hardcoded Secret Scanner: Scan for AWS access keys, JWT tokens, Stripe keys, and cleartext passwords.
• Permission & Component Risk Matrix: Flag exported activities, broadcast receivers, and excessive permissions.

• ANTI-GOALS (WHAT THIS IS NOT):
• Dynamic malware sandbox execution in an emulator.
• Developing mobile malware or bypassing Android OS security.
• Decompiling heavily obfuscated native C++ binaries.

• JUDGING CRITERIA:
• Secret Detection Accuracy & Regex Coverage (45%)
• Permission Security Assessment & Risk Grading (30%)
• Report Usability for Developers (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, Androguard / Apktool, Regex, Streamlit / Next.js, FastAPI`
  },
  {
    "id": "KARE-SEC-10",
    "domain": "Cybersecurity & Blockchain",
    "title": "PassZero: Passwordless Biometric WebAuthn Authentication & Key Vault",
    "coreQuestion": "How can organizations eradicate phishing and credential theft by eliminating passwords entirely in favor of cryptographic device biometrics?",
    "background": "Passwords are the single weakest link in digital security. Users reuse simple passwords across personal and academic services, leaving them vulnerable to data breaches, phishing, and credential-stuffing bots. Multi-factor authentication via SMS OTP is also susceptible to SIM-swapping and social engineering.",
    "description": "Build a modern passwordless authentication portal implementing the W3C WebAuthn / FIDO2 standard, enabling users to register and sign in using their laptop/phone's native biometric sensors (TouchID, Windows Hello) via public-key cryptography, with no passwords ever sent or stored.",
    "scopeGuidance": "Implement WebAuthn ceremony flows (Registration and Authentication). Demonstrate that the server stores only public keys and counter values, ensuring that a database compromise leaks zero user credentials.",
    "requirements": [
      "FIDO2 / WebAuthn Protocol Flow: Implement challenge generation, client-side credential creation, and verification.",
      "Biometric Sensor Interfacing: Leverage browser navigator.credentials.create and .get APIs.",
      "Secure User Session Dashboard: Display cryptographic public key details and active biometric authenticators."
    ],
    "constraints": [
      "Writing low-level hardware biometric drivers.",
      "Falling back to legacy email/SMS OTP passwords.",
      "Complex enterprise Active Directory LDAP integration."
    ],
    "judgingCriteria": "• WebAuthn Standard Compliance & Cryptographic Soundness (45%)\n• User Onboarding & Biometric Authentication Flow (35%)\n• Zero-Knowledge Server Security Architecture (20%)",
    "technologies": ["Node.js", "SimpleWebAuthn", "React", "MongoDB", "PostgreSQL", "Tailwind CSS"],
    "pdfDescription": `PASSZERO: PASSWORDLESS BIOMETRIC WEBAUTHN AUTHENTICATION & KEY VAULT
Problem Statement ID: KARE-SEC-10 | Domain: Cybersecurity & Blockchain

• THE CORE QUESTION:
How can organizations eradicate phishing and credential theft by eliminating passwords entirely in favor of cryptographic device biometrics?

• THE PROBLEM GAP:
Passwords are the single weakest link in digital security. Users reuse simple passwords across personal and academic services, leaving them vulnerable to data breaches, phishing, and credential-stuffing bots. Multi-factor authentication via SMS OTP is also susceptible to SIM-swapping and social engineering.

• THE CHALLENGE:
Build a modern passwordless authentication portal implementing the W3C WebAuthn / FIDO2 standard, enabling users to register and sign in using their laptop/phone's native biometric sensors (TouchID, Windows Hello) via public-key cryptography, with no passwords ever sent or stored.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Implement WebAuthn ceremony flows (Registration and Authentication). Demonstrate that the server stores only public keys and counter values, ensuring that a database compromise leaks zero user credentials.

• SOLUTION DIRECTIONS:
• FIDO2 / WebAuthn Protocol Flow: Implement challenge generation, client-side credential creation, and verification.
• Biometric Sensor Interfacing: Leverage browser navigator.credentials.create and .get APIs.
• Secure User Session Dashboard: Display cryptographic public key details and active biometric authenticators.

• ANTI-GOALS (WHAT THIS IS NOT):
• Writing low-level hardware biometric drivers.
• Falling back to legacy email/SMS OTP passwords.
• Complex enterprise Active Directory LDAP integration.

• JUDGING CRITERIA:
• WebAuthn Standard Compliance & Cryptographic Soundness (45%)
• User Onboarding & Biometric Authentication Flow (35%)
• Zero-Knowledge Server Security Architecture (20%)

• RECOMMENDED TECH STACK & RESOURCES:
Node.js, SimpleWebAuthn, React, MongoDB / PostgreSQL, Tailwind CSS`
  },
  {
    "id": "KARE-DS-01",
    "domain": "Data Science & Predictive Analytics",
    "title": "AgroPrice Lite: One-Commodity Mandi Price Forecast & Nearby Arbitrage Dashboard",
    "coreQuestion": "How can short-term price forecasting help farmers choose a profitable nearby mandi for one crop after transport costs?",
    "background": "Farmers often sell at distress prices because they lack price forecasts and nearby mandi price comparisons.",
    "description": "Use a preloaded Agmarknet sample for one commodity (e.g., onion or potato) across 5 to 10 mandis. Train Prophet or LightGBM to forecast 7 to 15 days of prices. Show nearby mandis on a map with price differentials and net profit after transport cost.",
    "scopeGuidance": "One commodity, limited mandis, static transport cost matrix. No nationwide live data, no futures exchange, no algorithmic trading. Forecast validation on a held-out time period.",
    "requirements": [
      "Time-Series Price Forecasting: 7 to 15 day price trajectory.",
      "Mandi Arbitrage Map: Price differential plus estimated net profit.",
      "Best-Time-To-Sell Indicator: Sell now or store based on forecast trend."
    ],
    "constraints": [
      "Full commodity futures exchange",
      "Real-time nationwide fleet tracking",
      "High-frequency automated trading"
    ],
    "judgingCriteria": "• Forecasting accuracy and validation (40%)\n• Practical arbitrage and economic logic (35%)\n• Visualization and map usability (25%)",
    "technologies": ["Python", "Prophet", "LightGBM", "Pandas", "Scikit-learn", "Streamlit", "Next.js", "Leaflet", "Folium"],
    "pdfDescription": `AGROPRICE LITE: ONE-COMMODITY MANDI PRICE FORECAST AND NEARBY ARBITRAGE DASHBOARD
Problem Statement ID: KARE-DS-01 | Domain: Data Science & Predictive Analytics

• THE CORE QUESTION:
How can short-term price forecasting help farmers choose a profitable nearby mandi for one crop after transport costs?

• THE PROBLEM GAP:
Farmers often sell at distress prices because they lack price forecasts and nearby mandi price comparisons.

• THE CHALLENGE (24-HR FEASIBILITY):
Use a preloaded Agmarknet sample for one commodity (e.g., onion or potato) across 5 to 10 mandis. Train Prophet or LightGBM to forecast 7 to 15 days of prices. Show nearby mandis on a map with price differentials and net profit after transport cost.

• SCOPE GUIDANCE:
One commodity, limited mandis, static transport cost matrix. No nationwide live data, no futures exchange, no algorithmic trading. Forecast validation on a held-out time period.

• SOLUTION DIRECTIONS:
• Time-Series Price Forecasting: 7 to 15 day price trajectory.
• Mandi Arbitrage Map: Price differential plus estimated net profit.
• Best-Time-To-Sell Indicator: Sell now or store based on forecast trend.

• ANTI-GOALS:
• Full commodity futures exchange
• Real-time nationwide fleet tracking
• High-frequency automated trading

• JUDGING CRITERIA:
• Forecasting accuracy and validation (40%)
• Practical arbitrage and economic logic (35%)
• Visualization and map usability (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, Prophet / LightGBM, Pandas, Scikit-learn, Streamlit / Next.js, Leaflet / Folium`
  },
  {
    "id": "KARE-DS-02",
    "domain": "Data Science & Predictive Analytics",
    "title": "GridPulse: Campus/City Microgrid Electricity Demand Forecaster & Peak Spikes Alert",
    "coreQuestion": "How can multivariate energy analytics predict campus power surges and schedule battery storage to prevent blackout penalties?",
    "background": "Universities and industrial campuses face massive surge tariffs when peak electricity consumption exceeds their sanctioned contract demand. Renewable rooftop solar generation is intermittent, and facility managers lack foresight into upcoming demand spikes driven by ambient temperature and class schedules.",
    "description": "Build an intelligent energy demand forecasting system that trains on historical hourly power consumption, ambient weather metrics (temperature, humidity), and calendar schedules to forecast the upcoming 24-hour load curve and predict peak demand threshold breaches.",
    "scopeGuidance": "Use open building energy datasets or simulated hourly smart-meter records. Emphasize feature engineering (lagged consumption, weather correlation) and actionable battery dispatch alerts before peak load hits.",
    "requirements": [
      "Multivariate Load Forecasting: Predict next 24-hour electricity demand in megawatts/kilowatts.",
      "Peak Exceedance Early Warning: Trigger visual alerts 4 hours before projected contract limit breaches.",
      "Smart Battery Optimization: Recommend optimal hours to charge from solar and discharge to offset grid load."
    ],
    "constraints": [
      "Physical smart meter hardware wiring.",
      "High-voltage substation relay control.",
      "Nuclear/thermal grid transmission modeling."
    ],
    "judgingCriteria": "• Predictive Accuracy on Load Curves (40%)\n• Feature Engineering & Weather Correlation (30%)\n• Energy Management Dashboard Usability (30%)",
    "technologies": ["Python", "XGBoost", "Scikit-learn", "Pandas", "Chart.js", "Plotly", "FastAPI", "Streamlit", "React"],
    "pdfDescription": `GRIDPULSE: CAMPUS/CITY MICROGRID ELECTRICITY DEMAND FORECASTER & PEAK SPIKES ALERT
Problem Statement ID: KARE-DS-02 | Domain: Data Science & Predictive Analytics

• THE CORE QUESTION:
How can multivariate energy analytics predict campus power surges and schedule battery storage to prevent blackout penalties?

• THE PROBLEM GAP:
Universities and industrial campuses face massive surge tariffs when peak electricity consumption exceeds their sanctioned contract demand. Renewable rooftop solar generation is intermittent, and facility managers lack foresight into upcoming demand spikes driven by ambient temperature and class schedules.

• THE CHALLENGE:
Build an intelligent energy demand forecasting system that trains on historical hourly power consumption, ambient weather metrics (temperature, humidity), and calendar schedules to forecast the upcoming 24-hour load curve and predict peak demand threshold breaches.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Use open building energy datasets or simulated hourly smart-meter records. Emphasize feature engineering (lagged consumption, weather correlation) and actionable battery dispatch alerts before peak load hits.

• SOLUTION DIRECTIONS:
• Multivariate Load Forecasting: Predict next 24-hour electricity demand in megawatts/kilowatts.
• Peak Exceedance Early Warning: Trigger visual alerts 4 hours before projected contract limit breaches.
• Smart Battery Optimization: Recommend optimal hours to charge from solar and discharge to offset grid load.

• ANTI-GOALS (WHAT THIS IS NOT):
• Physical smart meter hardware wiring.
• High-voltage substation relay control.
• Nuclear/thermal grid transmission modeling.

• JUDGING CRITERIA:
• Predictive Accuracy on Load Curves (40%)
• Feature Engineering & Weather Correlation (30%)
• Energy Management Dashboard Usability (30%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, XGBoost / Scikit-learn, Pandas, Chart.js / Plotly, FastAPI, Streamlit / React`
  },
  {
    "id": "KARE-DS-03",
    "domain": "Data Science & Predictive Analytics",
    "title": "HydroCast Lite: Interactive Groundwater Budget & Recharge Pit Sizer",
    "coreQuestion": "How can a simple annual water-balance model help a panchayat estimate the rainwater harvesting needed to stabilize its groundwater?",
    "background": "Villages want to plan rainwater harvesting but lack an accessible tool connecting local rainfall, extraction, and recharge; professional groundwater models need data and expertise they do not have.",
    "description": "Build an interactive dashboard where the user selects a district (defaults loaded from a small curated CGWB snapshot), adjusts sliders for annual rainfall, irrigated area, and water extraction, and sees the annual water balance computed with the standard rainfall-recharge equation, plus recommended recharge pit dimensions and the number of structures needed.",
    "scopeGuidance": "Annual water-balance arithmetic; no 12-month forecast claim. Curated static CGWB district defaults or simulated figures. Standard CGWB / NDMA recharge-pit sizing formulas. This is a scenario what-if tool, not a predictive model.",
    "requirements": [
      "Water Balance Engine: rainfall x area x infiltration factor minus estimated extraction.",
      "Recharge Pit Sizer: pit dimensions and unit count for a chosen recharge target.",
      "Scenario Comparison: save and compare 2 to 3 what-if scenarios side by side."
    ],
    "constraints": [
      "Real-time aquifer forecasting",
      "MODFLOW-style groundwater simulation",
      "Live sensor / IoT integration",
      "Sub-district precision claims"
    ],
    "judgingCriteria": "• Water-balance math correctness (45%)\n• Scenario visualization clarity (30%)\n• Practical actionability of pit sizing (25%)",
    "technologies": ["Python", "Pandas", "Streamlit", "Plotly", "CGWB CSV", "GeoPandas"],
    "pdfDescription": `HYDROCAST LITE: INTERACTIVE GROUNDWATER BUDGET AND RECHARGE PIT SIZER
Problem Statement ID: KARE-DS-03 | Domain: Data Science & Predictive Analytics

• THE CORE QUESTION:
How can a simple annual water-balance model help a panchayat estimate the rainwater harvesting needed to stabilize its groundwater?

• THE PROBLEM GAP:
Villages want to plan rainwater harvesting but lack an accessible tool connecting local rainfall, extraction, and recharge; professional groundwater models need data and expertise they do not have.

• THE CHALLENGE (24-HR FEASIBILITY):
Build an interactive dashboard where the user selects a district (defaults loaded from a small curated CGWB snapshot), adjusts sliders for annual rainfall, irrigated area, and water extraction, and sees the annual water balance computed with the standard rainfall-recharge equation, plus recommended recharge pit dimensions and the number of structures needed.

• SCOPE GUIDANCE:
Annual water-balance arithmetic; no 12-month forecast claim. Curated static CGWB district defaults or simulated figures. Standard CGWB / NDMA recharge-pit sizing formulas. This is a scenario what-if tool, not a predictive model.

• SOLUTION DIRECTIONS:
• Water Balance Engine: rainfall x area x infiltration factor minus estimated extraction.
• Recharge Pit Sizer: pit dimensions and unit count for a chosen recharge target.
• Scenario Comparison: save and compare 2 to 3 what-if scenarios side by side.

• ANTI-GOALS:
• Real-time aquifer forecasting
• MODFLOW-style groundwater simulation
• Live sensor / IoT integration
• Sub-district precision claims

• JUDGING CRITERIA:
• Water-balance math correctness (45%)
• Scenario visualization clarity (30%)
• Practical actionability of pit sizing (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, Pandas, Streamlit, Plotly, curated CGWB CSV`
  },
  {
    "id": "KARE-DS-04",
    "domain": "Data Science & Predictive Analytics",
    "title": "FraudLocate Lite: Mule Withdrawal Hotspot Mapper & Patrol Route Suggester",
    "coreQuestion": "How can descriptive geospatial analytics of past cybercrime withdrawals help police plan patrol coverage?",
    "background": "After mule accounts cash out stolen funds, investigations stay case-by-case with no map view of where withdrawals cluster, so patrol planning misses repeat hotspots.",
    "description": "Build a dashboard that ingests a preloaded synthetic complaint feed (timestamp, ATM or bank branch coordinates, amount), clusters withdrawal hotspots using DBSCAN, shows hour-of-day and day-of-week heat patterns, and suggests an efficient patrol route covering the top hotspots using a nearest-neighbor heuristic on a city map.",
    "scopeGuidance": "Purely descriptive on past data; no future prediction claim. One synthetic dataset preloaded with the app. Haversine distances; routes are suggestions, not guaranteed optimal tours.",
    "requirements": [
      "Hotspot Clustering: DBSCAN on withdrawal coordinates with tunable radius and min-points.",
      "Time Pattern View: hour-of-day and day-of-week heatmaps of cash-outs.",
      "Patrol Route Suggester: nearest-neighbor tour over top clusters with estimated travel time."
    ],
    "constraints": [
      "Predicting future withdrawal locations",
      "Live bank or FIR data integration",
      "Agent-based criminal simulation",
      "Conviction-grade evidentiary output"
    ],
    "judgingCriteria": "• Clustering quality and parameter handling (40%)\n• Patrol route suggestion logic (30%)\n• Map dashboard usability (30%)",
    "technologies": ["Python", "Scikit-learn (DBSCAN)", "Folium", "Pandas", "Streamlit", "Mapbox"],
    "pdfDescription": `FRAUDLOCATE LITE: MULE WITHDRAWAL HOTSPOT MAPPER AND PATROL ROUTE SUGGESTER
Problem Statement ID: KARE-DS-04 | Domain: Data Science & Predictive Analytics

• THE CORE QUESTION:
How can descriptive geospatial analytics of past cybercrime withdrawals help police plan patrol coverage?

• THE PROBLEM GAP:
After mule accounts cash out stolen funds, investigations stay case-by-case with no map view of where withdrawals cluster, so patrol planning misses repeat hotspots.

• THE CHALLENGE (24-HR FEASIBILITY):
Build a dashboard that ingests a preloaded synthetic complaint feed (timestamp, ATM or bank branch coordinates, amount), clusters withdrawal hotspots using DBSCAN, shows hour-of-day and day-of-week heat patterns, and suggests an efficient patrol route covering the top hotspots using a nearest-neighbor heuristic on a city map.

• SCOPE GUIDANCE:
Purely descriptive on past data; no future prediction claim. One synthetic dataset preloaded with the app. Haversine distances; routes are suggestions, not guaranteed optimal tours.

• SOLUTION DIRECTIONS:
• Hotspot Clustering: DBSCAN on withdrawal coordinates with tunable radius and min-points.
• Time Pattern View: hour-of-day and day-of-week heatmaps of cash-outs.
• Patrol Route Suggester: nearest-neighbor tour over top clusters with estimated travel time.

• ANTI-GOALS:
• Predicting future withdrawal locations
• Live bank or FIR data integration
• Agent-based criminal simulation
• Conviction-grade evidentiary output

• JUDGING CRITERIA:
• Clustering quality and parameter handling (40%)
• Patrol route suggestion logic (30%)
• Map dashboard usability (30%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, scikit-learn (DBSCAN), Folium, Pandas, Streamlit`
  },
  {
    "id": "KARE-DS-05",
    "domain": "Data Science & Predictive Analytics",
    "title": "FareRadar Lite: Airfare History Dashboard & Buy-Wait Heuristic",
    "coreQuestion": "How can a route's historical fare range help a traveler judge whether today's quoted price is high or low?",
    "background": "Travelers cannot tell if a quoted fare is a good deal because they have no easy view of a route's typical price range and volatility across recent months.",
    "description": "Use a preloaded fare-history dataset (Kaggle or simulated) for 5 to 10 domestic routes, compute each route's 30 / 60 / 90-day price statistics and a simple Volatility Index, plot the trend, and give a transparent heuristic verdict (today's price percentile versus the route's own history) with a 7-day Prophet projection clearly labeled as indicative.",
    "scopeGuidance": "No live airline API scraping. One preloaded dataset. The heuristic is percentile-based and explainable, not a trained prediction claim. Include a disclaimer that output is informational, not booking advice.",
    "requirements": [
      "Route Price Statistics: rolling median, quartiles, and volatility index per route.",
      "Buy-Wait Heuristic: current price percentile against the route's own history.",
      "7-Day Trend Projection: Prophet forecast with confidence band, labeled as indicative."
    ],
    "constraints": [
      "Real-time fare scraping",
      "Guaranteed price-drop prediction",
      "Booking or checkout integration",
      "Multi-airline API orchestration"
    ],
    "judgingCriteria": "• Statistical soundness of the heuristic (40%)\n• Dashboard clarity (30%)\n• Honest validation on held-out dates (30%)",
    "technologies": ["Python", "Pandas", "Prophet", "Plotly", "Streamlit", "XGBoost"],
    "pdfDescription": `FARERADAR LITE: AIRFARE HISTORY DASHBOARD AND BUY-WAIT HEURISTIC
Problem Statement ID: KARE-DS-05 | Domain: Data Science & Predictive Analytics

• THE CORE QUESTION:
How can a route's historical fare range help a traveler judge whether today's quoted price is high or low?

• THE PROBLEM GAP:
Travelers cannot tell if a quoted fare is a good deal because they have no easy view of a route's typical price range and volatility across recent months.

• THE CHALLENGE (24-HR FEASIBILITY):
Use a preloaded fare-history dataset (Kaggle or simulated) for 5 to 10 domestic routes, compute each route's 30 / 60 / 90-day price statistics and a simple Volatility Index, plot the trend, and give a transparent heuristic verdict (today's price percentile versus the route's own history) with a 7-day Prophet projection clearly labeled as indicative.

• SCOPE GUIDANCE:
No live airline API scraping. One preloaded dataset. The heuristic is percentile-based and explainable, not a trained prediction claim. Include a disclaimer that output is informational, not booking advice.

• SOLUTION DIRECTIONS:
• Route Price Statistics: rolling median, quartiles, and volatility index per route.
• Buy-Wait Heuristic: current price percentile against the route's own history.
• 7-Day Trend Projection: Prophet forecast with confidence band, labeled as indicative.

• ANTI-GOALS:
• Real-time fare scraping
• Guaranteed price-drop prediction
• Booking or checkout integration
• Multi-airline API orchestration

• JUDGING CRITERIA:
• Statistical soundness of the heuristic (40%)
• Dashboard clarity (30%)
• Honest validation on held-out dates (30%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, Pandas, Prophet, Plotly, Streamlit`
  },
  {
    "id": "KARE-DS-06",
    "domain": "Data Science & Predictive Analytics",
    "title": "DropOutShield: Student Academic Risk Scoring & Early Intervention Engine",
    "coreQuestion": "How can institutional data science identify students on the verge of dropping out early enough for counselors to intervene?",
    "background": "Universities lose thousands of students each year to academic dropout, often triggered by early failure in foundational courses, attendance slumps, or financial distress. Faculty advisors only discover these problems at the end of the semester after grades are finalized, when it is too late to rescue the student's academic standing.",
    "description": "Create an early-warning predictive analytics portal for academic mentors that trains on student semester marks, continuous internal assessment trends, attendance decline rates, and LMS engagement, generating a personalized academic risk score (Low, Medium, High) with explainable risk drivers.",
    "scopeGuidance": "Use open educational data (e.g., Open University Learning Analytics Dataset - OULAD) or synthetic college student records. Emphasize model explainability (SHAP values) so mentors know exactly why a student was flagged.",
    "requirements": [
      "Multi-Factor Risk Classifier: Predict probability of academic probation or course dropout.",
      "Explainable Risk Drivers (SHAP/Feature Importance): Pinpoint key contributors (e.g., 40% drop in Math II attendance).",
      "Advisor Intervention Workflow: Enable mentors to log counseling notes and track student recovery progress."
    ],
    "constraints": [
      "Storing unencrypted private student grades publicly.",
      "Automated disciplinary punishment or expulsion.",
      "Manual spreadsheet data entry."
    ],
    "judgingCriteria": "• Predictive Model Precision & Recall on At-Risk Cohorts (40%)\n• Explainability & Root-Cause Insight (35%)\n• Mentor Dashboard Design (25%)",
    "technologies": ["Python", "Scikit-learn", "XGBoost", "SHAP", "Pandas", "React", "Tailwind CSS", "FastAPI"],
    "pdfDescription": `DROPOUTSHIELD: STUDENT ACADEMIC RISK SCORING & EARLY INTERVENTION ENGINE
Problem Statement ID: KARE-DS-06 | Domain: Data Science & Predictive Analytics

• THE CORE QUESTION:
How can institutional data science identify students on the verge of dropping out early enough for counselors to intervene?

• THE PROBLEM GAP:
Universities lose thousands of students each year to academic dropout, often triggered by early failure in foundational courses, attendance slumps, or financial distress. Faculty advisors only discover these problems at the end of the semester after grades are finalized, when it is too late to rescue the student's academic standing.

• THE CHALLENGE:
Create an early-warning predictive analytics portal for academic mentors that trains on student semester marks, continuous internal assessment trends, attendance decline rates, and LMS engagement, generating a personalized academic risk score (Low, Medium, High) with explainable risk drivers.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Use open educational data (e.g., Open University Learning Analytics Dataset - OULAD) or synthetic college student records. Emphasize model explainability (SHAP values) so mentors know exactly why a student was flagged.

• SOLUTION DIRECTIONS:
• Multi-Factor Risk Classifier: Predict probability of academic probation or course dropout.
• Explainable Risk Drivers (SHAP/Feature Importance): Pinpoint key contributors (e.g., 40% drop in Math II attendance).
• Advisor Intervention Workflow: Enable mentors to log counseling notes and track student recovery progress.

• ANTI-GOALS (WHAT THIS IS NOT):
• Storing unencrypted private student grades publicly.
• Automated disciplinary punishment or expulsion.
• Manual spreadsheet data entry.

• JUDGING CRITERIA:
• Predictive Model Precision & Recall on At-Risk Cohorts (40%)
• Explainability & Root-Cause Insight (35%)
• Mentor Dashboard Design (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, Scikit-learn, XGBoost, SHAP, Pandas, React, Tailwind CSS, FastAPI`
  },
  {
    "id": "KARE-DS-07",
    "domain": "Data Science & Predictive Analytics",
    "title": "CrimeNet: Telecom CDR Call-Chain Graph Analyzer & Syndicate Identifier",
    "coreQuestion": "How can graph algorithms automatically uncover criminal hierarchy and hidden conspirators from thousands of raw call detail records?",
    "background": "During major criminal investigations, police teams receive Excel spreadsheets containing hundreds of thousands of Call Detail Records (CDRs) from telecom operators. Officers spend days manually cross-referencing phone numbers and cell towers in spreadsheets, often missing the shadowy coordinator who only communicates via intermediaries.",
    "description": "Develop an automated graph analytics and network intelligence tool that ingests raw telecom CDR files, constructs a directed communication graph, calculates network centrality metrics (Degree, Betweenness, Closeness) to isolate syndicate ringleaders, and maps common cell-tower locations.",
    "scopeGuidance": "Use synthetic CDR datasets (caller, receiver, timestamp, duration, cell tower coordinates). Focus on network graph algorithms and visual exploration of connected components.",
    "requirements": [
      "Network Graph Construction: Model phone numbers as nodes and calls as directed weighted edges.",
      "Centrality Metric Analysis: Automatically identify the top 3 'bridge' coordinators using Betweenness Centrality.",
      "Spatio-Temporal Filter: Pinpoint instances where two suspect numbers pinged the same cell tower concurrently."
    ],
    "constraints": [
      "Live interception of active phone calls or reading SMS content.",
      "Accessing real-world telecom proprietary subscriber databases.",
      "Building telecom network infrastructure."
    ],
    "judgingCriteria": "• Graph Analytics Depth & Algorithmic Rigor (45%)\n• Interactive Graph Exploration & Filtering UI (35%)\n• Data Ingestion & Scalability on Large Logs (20%)",
    "technologies": ["Python", "NetworkX", "PyVis", "Cytoscape.js", "Pandas", "Flask", "FastAPI", "React"],
    "pdfDescription": `CRIMENET: TELECOM CDR CALL-CHAIN GRAPH ANALYZER & SYNDICATE IDENTIFIER
Problem Statement ID: KARE-DS-07 | Domain: Data Science & Predictive Analytics

• THE CORE QUESTION:
How can graph algorithms automatically uncover criminal hierarchy and hidden conspirators from thousands of raw call detail records?

• THE PROBLEM GAP:
During major criminal investigations, police teams receive Excel spreadsheets containing hundreds of thousands of Call Detail Records (CDRs) from telecom operators. Officers spend days manually cross-referencing phone numbers and cell towers in spreadsheets, often missing the shadowy coordinator who only communicates via intermediaries.

• THE CHALLENGE:
Develop an automated graph analytics and network intelligence tool that ingests raw telecom CDR files, constructs a directed communication graph, calculates network centrality metrics (Degree, Betweenness, Closeness) to isolate syndicate ringleaders, and maps common cell-tower locations.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Use synthetic CDR datasets (caller, receiver, timestamp, duration, cell tower coordinates). Focus on network graph algorithms and visual exploration of connected components.

• SOLUTION DIRECTIONS:
• Network Graph Construction: Model phone numbers as nodes and calls as directed weighted edges.
• Centrality Metric Analysis: Automatically identify the top 3 'bridge' coordinators using Betweenness Centrality.
• Spatio-Temporal Filter: Pinpoint instances where two suspect numbers pinged the same cell tower concurrently.

• ANTI-GOALS (WHAT THIS IS NOT):
• Live interception of active phone calls or reading SMS content.
• Accessing real-world telecom proprietary subscriber databases.
• Building telecom network infrastructure.

• JUDGING CRITERIA:
• Graph Analytics Depth & Algorithmic Rigor (45%)
• Interactive Graph Exploration & Filtering UI (35%)
• Data Ingestion & Scalability on Large Logs (20%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, NetworkX, PyVis / Cytoscape.js, Pandas, Flask / FastAPI, React`
  },
  {
    "id": "KARE-DS-08",
    "domain": "Data Science & Predictive Analytics",
    "title": "CivicAudit: Anomaly & Fraud Detection in Public Works Fund Allocations",
    "coreQuestion": "How can machine learning identify corrupt contractor cartels, split tenders, and budget inflation in municipal civic projects?",
    "background": "Billions in public funds are lost annually to corruption in municipal public works. Corrupt contractors collude to submit artificial bids, split large contracts just below tender approval thresholds, and repeatedly inflate budgets through delayed project extensions. Manual audits examine less than 5% of all files.",
    "description": "Build an automated public expenditure anomaly detection engine that parses public works project data (sanctioned amounts, contractor IDs, project duration, completion delays), flags statistical outliers, and visualizes suspicious contractor monopolies and split-billing clusters.",
    "scopeGuidance": "Use open government procurement datasets or simulated municipal tender records. Apply unsupervised outlier detection (Isolation Forest, Local Outlier Factor) to identify suspicious bidding and execution patterns.",
    "requirements": [
      "Unsupervised Anomaly Scoring: Detect contracts with abnormal cost-to-time ratios or sudden cost revisions.",
      "Cartel & Split-Tender Detection: Flag repeated contract awards clustered just below mandatory audit thresholds.",
      "Civic Transparency Scorecard: Provide an executive dashboard ranking departments and contractors by risk."
    ],
    "constraints": [
      "Legal enforcement prosecution filings.",
      "Simple keyword search without statistical modeling.",
      "Manual auditing interfaces that require human line-by-line review."
    ],
    "judgingCriteria": "• Outlier Detection Validity & Analytical Depth (40%)\n• Anomaly Explainability & Procurement Heuristics (35%)\n• Dashboard Visualizations (25%)",
    "technologies": ["Python", "Scikit-learn (Isolation Forest)", "Pandas", "Plotly", "Dash", "Streamlit", "Next.js"],
    "pdfDescription": `CIVICAUDIT: ANOMALY & FRAUD DETECTION IN PUBLIC WORKS FUND ALLOCATIONS
Problem Statement ID: KARE-DS-08 | Domain: Data Science & Predictive Analytics

• THE CORE QUESTION:
How can machine learning identify corrupt contractor cartels, split tenders, and budget inflation in municipal civic projects?

• THE PROBLEM GAP:
Billions in public funds are lost annually to corruption in municipal public works. Corrupt contractors collude to submit artificial bids, split large contracts just below tender approval thresholds, and repeatedly inflate budgets through delayed project extensions. Manual audits examine less than 5% of all files.

• THE CHALLENGE:
Build an automated public expenditure anomaly detection engine that parses public works project data (sanctioned amounts, contractor IDs, project duration, completion delays), flags statistical outliers, and visualizes suspicious contractor monopolies and split-billing clusters.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Use open government procurement datasets or simulated municipal tender records. Apply unsupervised outlier detection (Isolation Forest, Local Outlier Factor) to identify suspicious bidding and execution patterns.

• SOLUTION DIRECTIONS:
• Unsupervised Anomaly Scoring: Detect contracts with abnormal cost-to-time ratios or sudden cost revisions.
• Cartel & Split-Tender Detection: Flag repeated contract awards clustered just below mandatory audit thresholds.
• Civic Transparency Scorecard: Provide an executive dashboard ranking departments and contractors by risk.

• ANTI-GOALS (WHAT THIS IS NOT):
• Legal enforcement prosecution filings.
• Simple keyword search without statistical modeling.
• Manual auditing interfaces that require human line-by-line review.

• JUDGING CRITERIA:
• Outlier Detection Validity & Analytical Depth (40%)
• Anomaly Explainability & Procurement Heuristics (35%)
• Dashboard Visualizations (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, Scikit-learn (Isolation Forest), Pandas, Plotly / Dash, Streamlit / Next.js`
  },
  {
    "id": "KARE-DS-09",
    "domain": "Data Science & Predictive Analytics",
    "title": "PulseCrisis: Real-Time Disaster Tweet SOS Extractor & Resource Heatmap",
    "coreQuestion": "How can natural language processing filter the noise of social media during floods and cyclones to pinpoint citizens in critical danger?",
    "background": "During natural disasters (floods, earthquakes), victims post urgent SOS requests on social media containing addresses and medical emergencies. Emergency disaster control rooms are overwhelmed by thousands of posts, unable to distinguish between genuine life-threatening cries for rescue, general news sharing, and spam.",
    "description": "Create a real-time crisis intelligence engine that ingests simulated social media feeds during a natural disaster, applies NLP classification to filter actionable SOS requests from general commentary, extracts physical location entities via NER, and plots prioritized rescue heatmaps.",
    "scopeGuidance": "Use open disaster response tweet datasets (e.g. CrisisLex, Disaster Tweets Kaggle dataset). Focus on binary classification (Actionable SOS vs. Non-Actionable) and spatial mapping of extracted locations.",
    "requirements": [
      "Actionable Intent Classification: Distinguish urgent requests (e.g., 'need boat pregnant woman trapped') from commentary.",
      "Disaster Entity Extraction: Extract trapped victim count, critical needs (medical, food, rescue), and landmark names.",
      "Live Emergency Command Map: Render clustered distress pins prioritized by urgency level."
    ],
    "constraints": [
      "Live real-time deployment requiring expensive Twitter/X enterprise API keys.",
      "Launching physical drone rescue missions.",
      "Scraping personal chat messages on private messaging platforms."
    ],
    "judgingCriteria": "• NLP Intent & Entity Extraction Precision (40%)\n• Emergency Triage Prioritization Logic (35%)\n• Command Center Map Usability (25%)",
    "technologies": ["HuggingFace Transformers (DistilBERT)", "spaCy (NER)", "Leaflet.js", "Mapbox", "FastAPI", "React"],
    "pdfDescription": `PULSECRISIS: REAL-TIME DISASTER TWEET SOS EXTRACTOR & RESOURCE HEATMAP
Problem Statement ID: KARE-DS-09 | Domain: Data Science & Predictive Analytics

• THE CORE QUESTION:
How can natural language processing filter the noise of social media during floods and cyclones to pinpoint citizens in critical danger?

• THE PROBLEM GAP:
During natural disasters (floods, earthquakes), victims post urgent SOS requests on social media containing addresses and medical emergencies. Emergency disaster control rooms are overwhelmed by thousands of posts, unable to distinguish between genuine life-threatening cries for rescue, general news sharing, and spam.

• THE CHALLENGE:
Create a real-time crisis intelligence engine that ingests simulated social media feeds during a natural disaster, applies NLP classification to filter actionable SOS requests from general commentary, extracts physical location entities via NER, and plots prioritized rescue heatmaps.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Use open disaster response tweet datasets (e.g. CrisisLex, Disaster Tweets Kaggle dataset). Focus on binary classification (Actionable SOS vs. Non-Actionable) and spatial mapping of extracted locations.

• SOLUTION DIRECTIONS:
• Actionable Intent Classification: Distinguish urgent requests (e.g., 'need boat pregnant woman trapped') from commentary.
• Disaster Entity Extraction: Extract trapped victim count, critical needs (medical, food, rescue), and landmark names.
• Live Emergency Command Map: Render clustered distress pins prioritized by urgency level.

• ANTI-GOALS (WHAT THIS IS NOT):
• Live real-time deployment requiring expensive Twitter/X enterprise API keys.
• Launching physical drone rescue missions.
• Scraping personal chat messages on private messaging platforms.

• JUDGING CRITERIA:
• NLP Intent & Entity Extraction Precision (40%)
• Emergency Triage Prioritization Logic (35%)
• Command Center Map Usability (25%)

• RECOMMENDED TECH STACK & RESOURCES:
HuggingFace Transformers (DistilBERT), spaCy (NER), Leaflet.js / Mapbox, FastAPI, React`
  },
  {
    "id": "KARE-DS-10",
    "domain": "Data Science & Predictive Analytics",
    "title": "TransitSync Lite: Simulated Bus ETA & Delay Propagation Demo",
    "coreQuestion": "How can ML predict bus arrival at the next few stops using historical or simulated route logs and propagate a current delay downstream?",
    "background": "Commuters lack reliable arrival times because static timetables ignore traffic and boarding delays. GPS trackers show only where the bus is, not when it will reach downstream stops.",
    "description": "Build a pipeline on a preloaded or simulated GTFS-like CSV for 1 to 3 bus routes. Train a LightGBM or XGBoost model to predict travel time to the next stop. Simulate a live bus delay from a dashboard and recalculate downstream ETAs with a simple confidence range.",
    "scopeGuidance": "Use simulated bus logs or a small public GTFS sample. No live GPS, no real weather API, no city-scale deployment. Weather and peak-hour can be pre-labelled columns in the dataset. Real-time means a local simulator that injects delay at a stop.",
    "requirements": [
      "Dynamic ETA Regression: Predict travel minutes using route ID, stop sequence, hour, day, weather flag, previous delay, and dwell time.",
      "Real-Time Delay Propagation: If bus is delayed at stop N, add predicted downstream travel times and propagate the delay with decay.",
      "Commuter Web Display: Mobile-friendly countdown for next 3 stops, delay indicator, and confidence interval."
    ],
    "constraints": [
      "Live GPS hardware integration",
      "Full city-scale traffic simulation",
      "Ticketing or booking system",
      "Complex 3D visualization"
    ],
    "judgingCriteria": "• Downstream ETA accuracy (MAE or RMSE on held-out simulated data) (40%)\n• Delay propagation logic (35%)\n• Mobile UI cleanliness (25%)",
    "technologies": ["Python", "Pandas", "LightGBM", "XGBoost", "FastAPI", "React", "Next.js", "CSV", "SQLite", "Leaflet"],
    "pdfDescription": `TRANSITSYNC LITE: SIMULATED BUS ETA AND DELAY PROPAGATION DEMO
Problem Statement ID: KARE-DS-10 | Domain: Data Science & Predictive Analytics

• THE CORE QUESTION:
How can ML predict bus arrival at the next few stops using historical or simulated route logs and propagate a current delay downstream?

• THE PROBLEM GAP:
Commuters lack reliable arrival times because static timetables ignore traffic and boarding delays. GPS trackers show only where the bus is, not when it will reach downstream stops.

• THE CHALLENGE (24-HR FEASIBILITY):
Build a pipeline on a preloaded or simulated GTFS-like CSV for 1 to 3 bus routes. Train a LightGBM or XGBoost model to predict travel time to the next stop. Simulate a live bus delay from a dashboard and recalculate downstream ETAs with a simple confidence range.

• SCOPE GUIDANCE:
Use simulated bus logs or a small public GTFS sample. No live GPS, no real weather API, no city-scale deployment. Weather and peak-hour can be pre-labelled columns in the dataset. Real-time means a local simulator that injects delay at a stop.

• SOLUTION DIRECTIONS:
• Dynamic ETA Regression: Predict travel minutes using route ID, stop sequence, hour, day, weather flag, previous delay, and dwell time.
• Real-Time Delay Propagation: If bus is delayed at stop N, add predicted downstream travel times and propagate the delay with decay.
• Commuter Web Display: Mobile-friendly countdown for next 3 stops, delay indicator, and confidence interval.

• ANTI-GOALS:
• Live GPS hardware integration
• Full city-scale traffic simulation
• Ticketing or booking system
• Complex 3D visualization

• JUDGING CRITERIA:
• Downstream ETA accuracy (MAE or RMSE on held-out simulated data) (40%)
• Delay propagation logic (35%)
• Mobile UI cleanliness (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, Pandas, LightGBM / XGBoost, FastAPI, React / Next.js, CSV / SQLite, Leaflet (optional)`
  },
  {
    "id": "KARE-SYS-01",
    "domain": "Full-Stack Web & Smart Automation",
    "title": "SmartOPD: Hospital Queue Virtualization & Live Bed Availability Portal",
    "coreQuestion": "How can cloud software eliminate chaotic outpatient hospital waiting crowds while providing real-time visibility into emergency bed vacancies?",
    "background": "Government and charitable hospital outpatient departments (OPDs) suffer from dangerous overcrowding, with patients waiting 4-6 hours in poorly ventilated corridors. Simultaneously, ambulances wander between hospitals because there is no centralized, real-time tracking of vacant ICU and oxygen beds.",
    "description": "Develop a full-stack hospital management web application where patients generate digital queue tokens with live estimated consultation countdowns, while hospital administrators manage clinical triage and maintain a verified public live bed availability counter.",
    "scopeGuidance": "Simulate hospital patient check-ins and bed status updates. Implement real-time WebSocket communication for token status and a responsive patient portal that updates without manual page refreshes.",
    "requirements": [
      "Virtual Queue & Token Generation: Issue digital tokens with live estimated consult wait time via WebSockets.",
      "Real-Time Bed Availability Dashboard: Live ward tracking of General, ICU, and Oxygen beds with vacancy status.",
      "Doctor Triage Interface: Enable clinicians to call next patient, mark completed, or transfer to labs."
    ],
    "constraints": [
      "Full enterprise Hospital Information System (HIS) with complex billing.",
      "Direct integration with national health insurance claim clearinghouses.",
      "IoT biometric bed sensors."
    ],
    "judgingCriteria": "• Full-Stack Architecture & Real-Time Sync (40%)\n• Patient & Hospital Staff User Experience (35%)\n• Code Modularity & System Reliability (25%)",
    "technologies": ["Next.js", "React", "Node.js", "Express", "Socket.io", "PostgreSQL", "Supabase", "Tailwind CSS"],
    "pdfDescription": `SMARTOPD: HOSPITAL QUEUE VIRTUALIZATION & LIVE BED AVAILABILITY PORTAL
Problem Statement ID: KARE-SYS-01 | Domain: Full-Stack Web & Smart Automation

• THE CORE QUESTION:
How can cloud software eliminate chaotic outpatient hospital waiting crowds while providing real-time visibility into emergency bed vacancies?

• THE PROBLEM GAP:
Government and charitable hospital outpatient departments (OPDs) suffer from dangerous overcrowding, with patients waiting 4-6 hours in poorly ventilated corridors. Simultaneously, ambulances wander between hospitals because there is no centralized, real-time tracking of vacant ICU and oxygen beds.

• THE CHALLENGE:
Develop a full-stack hospital management web application where patients generate digital queue tokens with live estimated consultation countdowns, while hospital administrators manage clinical triage and maintain a verified public live bed availability counter.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Simulate hospital patient check-ins and bed status updates. Implement real-time WebSocket communication for token status and a responsive patient portal that updates without manual page refreshes.

• SOLUTION DIRECTIONS:
• Virtual Queue & Token Generation: Issue digital tokens with live estimated consult wait time via WebSockets.
• Real-Time Bed Availability Dashboard: Live ward tracking of General, ICU, and Oxygen beds with vacancy status.
• Doctor Triage Interface: Enable clinicians to call next patient, mark completed, or transfer to labs.

• ANTI-GOALS (WHAT THIS IS NOT):
• Full enterprise Hospital Information System (HIS) with complex billing.
• Direct integration with national health insurance claim clearinghouses.
• IoT biometric bed sensors.

• JUDGING CRITERIA:
• Full-Stack Architecture & Real-Time Sync (40%)
• Patient & Hospital Staff User Experience (35%)
• Code Modularity & System Reliability (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Next.js / React, Node.js / Express, Socket.io, PostgreSQL / Supabase, Tailwind CSS`
  },
  {
    "id": "KARE-SYS-02",
    "domain": "Full-Stack Web & Smart Automation",
    "title": "KisanDirect: Zero-Brokerage Farmer-to-Retail Direct Produce Marketplace",
    "coreQuestion": "How can digital commerce connect agricultural producers directly with local retail grocery stores, cutting out predatory middlemen?",
    "background": "Agricultural supply chains in India are dominated by multi-tiered middlemen (dalals), who take up to 50% of the produce value while leaving farmers with minimal margins. Local grocery vendors in nearby towns pay high prices, yet cannot discover which local farmers have freshly harvested crops ready for dispatch.",
    "description": "Build a mobile-first marketplace platform where farmers create simple produce listings (crop type, quantity in quintals, minimum price, farm photo) and verified local retail vendors place direct bids or purchases, generating automated WhatsApp order confirmation receipts.",
    "scopeGuidance": "Design for low-literacy users with high-contrast, image-driven UI. Simulate the transaction flow from crop listing to merchant bid acceptance and WhatsApp receipt notification dispatch.",
    "requirements": [
      "Streamlined Crop Listing: 3-step crop posting with photo upload, harvest date, and expected price.",
      "Merchant Bidding & Purchase Flow: Retailers view nearby listings on a map and place binding bids.",
      "Automated WhatsApp / SMS Deal Slip: Trigger automated order receipt summaries via Twilio / WhatsApp API."
    ],
    "constraints": [
      "Complex nationwide refrigerated freight logistics management.",
      "Commodity futures speculation and derivatives.",
      "Mandatory credit card payment gateway integration."
    ],
    "judgingCriteria": "• Marketplace User Flow & Usability for Rural Users (40%)\n• Real-time Bidding & Deal State Machine (35%)\n• Notification Integration & Architecture (25%)",
    "technologies": ["Next.js", "Supabase", "Tailwind CSS", "Twilio", "WhatsApp Business API", "React"],
    "pdfDescription": `KISANDIRECT: ZERO-BROKERAGE FARMER-TO-RETAIL DIRECT PRODUCE MARKETPLACE
Problem Statement ID: KARE-SYS-02 | Domain: Full-Stack Web & Smart Automation

• THE CORE QUESTION:
How can digital commerce connect agricultural producers directly with local retail grocery stores, cutting out predatory middlemen?

• THE PROBLEM GAP:
Agricultural supply chains in India are dominated by multi-tiered middlemen (dalals), who take up to 50% of the produce value while leaving farmers with minimal margins. Local grocery vendors in nearby towns pay high prices, yet cannot discover which local farmers have freshly harvested crops ready for dispatch.

• THE CHALLENGE:
Build a mobile-first marketplace platform where farmers create simple produce listings (crop type, quantity in quintals, minimum price, farm photo) and verified local retail vendors place direct bids or purchases, generating automated WhatsApp order confirmation receipts.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Design for low-literacy users with high-contrast, image-driven UI. Simulate the transaction flow from crop listing to merchant bid acceptance and WhatsApp receipt notification dispatch.

• SOLUTION DIRECTIONS:
• Streamlined Crop Listing: 3-step crop posting with photo upload, harvest date, and expected price.
• Merchant Bidding & Purchase Flow: Retailers view nearby listings on a map and place binding bids.
• Automated WhatsApp / SMS Deal Slip: Trigger automated order receipt summaries via Twilio / WhatsApp API.

• ANTI-GOALS (WHAT THIS IS NOT):
• Complex nationwide refrigerated freight logistics management.
• Commodity futures speculation and derivatives.
• Mandatory credit card payment gateway integration.

• JUDGING CRITERIA:
• Marketplace User Flow & Usability for Rural Users (40%)
• Real-time Bidding & Deal State Machine (35%)
• Notification Integration & Architecture (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Next.js, Supabase (Auth, Storage & Database), Tailwind CSS, Twilio / WhatsApp Business API, React`
  },
  {
    "id": "KARE-SYS-03",
    "domain": "Full-Stack Web & Smart Automation",
    "title": "CivicFix: Geotagged Civic Issue Reporting & Automated SLA Router",
    "coreQuestion": "How can citizen-reported municipal complaints be automatically categorized, geotagged, and routed to the exact division officer with strict SLA accountability?",
    "background": "Citizens encountering open potholes, overflowing garbage dumps, or non-functional streetlights rarely report them because municipal complaint helplines are unresponsive and bureaucratically convoluted. Tickets languish for months because complaints are routed to the wrong ward departments.",
    "description": "Create a progressive web application (PWA) where citizens snap a photo of a civic issue with auto-detected GPS coordinates; an automated image classifier categorizes the issue (pothole, waste, lighting) and assigns the ticket to the respective ward officer with an active 48-hour SLA countdown timer.",
    "scopeGuidance": "Use mobile web camera and geolocation APIs. Implement a lightweight image classifier (MobileNet) to suggest the issue category automatically and build a municipal officer dashboard to mark tickets resolved with before/after photos.",
    "requirements": [
      "Geotagged Photo Capture: Capture issue evidence with tamper-resistant GPS metadata.",
      "Automated Department Routing: Classify photo into Roads, Sanitation, or Electrical divisions.",
      "SLA Countdown & Escalation Engine: Track 48-hour resolution deadlines with escalation badges."
    ],
    "constraints": [
      "Full municipal ERP accounting and employee payroll systems.",
      "Deploying physical street maintenance crews.",
      "Complex municipal GIS map servers."
    ],
    "judgingCriteria": "• End-to-End Civic Workflow & Usability (40%)\n• Automated Categorization & Routing Logic (35%)\n• Officer Dashboard & SLA Enforcement (25%)",
    "technologies": ["Flutter", "React PWA", "Node.js", "MongoDB", "PostgreSQL", "Leaflet.js", "MobileNet (TensorFlow.js)", "Tailwind CSS"],
    "pdfDescription": `CIVICFIX: GEOTAGGED CIVIC ISSUE REPORTING & AUTOMATED SLA ROUTER
Problem Statement ID: KARE-SYS-03 | Domain: Full-Stack Web & Smart Automation

• THE CORE QUESTION:
How can citizen-reported municipal complaints be automatically categorized, geotagged, and routed to the exact division officer with strict SLA accountability?

• THE PROBLEM GAP:
Citizens encountering open potholes, overflowing garbage dumps, or non-functional streetlights rarely report them because municipal complaint helplines are unresponsive and bureaucratically convoluted. Tickets languish for months because complaints are routed to the wrong ward departments.

• THE CHALLENGE:
Create a progressive web application (PWA) where citizens snap a photo of a civic issue with auto-detected GPS coordinates; an automated image classifier categorizes the issue (pothole, waste, lighting) and assigns the ticket to the respective ward officer with an active 48-hour SLA countdown timer.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Use mobile web camera and geolocation APIs. Implement a lightweight image classifier (MobileNet) to suggest the issue category automatically and build a municipal officer dashboard to mark tickets resolved with before/after photos.

• SOLUTION DIRECTIONS:
• Geotagged Photo Capture: Capture issue evidence with tamper-resistant GPS metadata.
• Automated Department Routing: Classify photo into Roads, Sanitation, or Electrical divisions.
• SLA Countdown & Escalation Engine: Track 48-hour resolution deadlines with escalation badges.

• ANTI-GOALS (WHAT THIS IS NOT):
• Full municipal ERP accounting and employee payroll systems.
• Deploying physical street maintenance crews.
• Complex municipal GIS map servers.

• JUDGING CRITERIA:
• End-to-End Civic Workflow & Usability (40%)
• Automated Categorization & Routing Logic (35%)
• Officer Dashboard & SLA Enforcement (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Flutter / React PWA, Node.js, MongoDB / PostgreSQL, Leaflet.js, MobileNet (TensorFlow.js), Tailwind CSS`
  },
  {
    "id": "KARE-SYS-04",
    "domain": "Full-Stack Web & Smart Automation",
    "title": "JusticeBail Lite: Curated 436A Eligibility Calculator & Petition Template Generator",
    "coreQuestion": "How can a legal-aid tool help paralegals check Section 436A eligibility for a small set of common offences and auto-fill a bail petition draft?",
    "background": "Many undertrial prisoners remain in jail beyond statutory thresholds because legal-aid volunteers lack quick eligibility-checking and petition-drafting tools.",
    "description": "Build an interactive web tool where paralegals input offence section from a curated list of 10 to 15 common sections, custody start date, and trial status. The engine computes half or one-third custody thresholds under CrPC 436A and generates an editable PDF draft using a standard petition template. Include a clear prototype disclaimer.",
    "scopeGuidance": "Encode only selected sections with maximum punishment. No precedent engine, no full CrPC or BNS coverage, no police database. Petition is template-based, not AI-generated legal reasoning.",
    "requirements": [
      "Statutory Eligibility Calculator: Compare custody duration against 1/2 or 1/3 rule.",
      "Legal Reason Template: Insert statutory justification citing CrPC 436A.",
      "Petition PDF Generator: Populate court template with client data and export PDF."
    ],
    "constraints": [
      "Replacing trial lawyers",
      "Connecting to classified police databases",
      "Sentencing or judicial outcome prediction",
      "Covering every penal section"
    ],
    "judgingCriteria": "• Legal logic accuracy for curated sections (45%)\n• Petition template formatting (30%)\n• Usability for paralegal workers (25%)",
    "technologies": ["React", "Next.js", "FastAPI", "Node.js", "ReportLab", "jsPDF", "Tailwind", "Bootstrap", "SQLite", "JSON"],
    "pdfDescription": `JUSTICEBAIL LITE: CURATED 436A ELIGIBILITY CALCULATOR AND PETITION TEMPLATE GENERATOR
Problem Statement ID: KARE-SYS-04 | Domain: Full-Stack Web & Smart Automation

• THE CORE QUESTION:
How can a legal-aid tool help paralegals check Section 436A eligibility for a small set of common offences and auto-fill a bail petition draft?

• THE PROBLEM GAP:
Many undertrial prisoners remain in jail beyond statutory thresholds because legal-aid volunteers lack quick eligibility-checking and petition-drafting tools.

• THE CHALLENGE (24-HR FEASIBILITY):
Build an interactive web tool where paralegals input offence section from a curated list of 10 to 15 common sections, custody start date, and trial status. The engine computes half or one-third custody thresholds under CrPC 436A and generates an editable PDF draft using a standard petition template. Include a clear prototype disclaimer.

• SCOPE GUIDANCE:
Encode only selected sections with maximum punishment. No precedent engine, no full CrPC or BNS coverage, no police database. Petition is template-based, not AI-generated legal reasoning.

• SOLUTION DIRECTIONS:
• Statutory Eligibility Calculator: Compare custody duration against 1/2 or 1/3 rule.
• Legal Reason Template: Insert statutory justification citing CrPC 436A.
• Petition PDF Generator: Populate court template with client data and export PDF.

• ANTI-GOALS:
• Replacing trial lawyers
• Connecting to classified police databases
• Sentencing or judicial outcome prediction
• Covering every penal section

• JUDGING CRITERIA:
• Legal logic accuracy for curated sections (45%)
• Petition template formatting (30%)
• Usability for paralegal workers (25%)

• RECOMMENDED TECH STACK & RESOURCES:
React / Next.js, FastAPI / Node.js, ReportLab / jsPDF, Tailwind / Bootstrap, SQLite / JSON`
  },
  {
    "id": "KARE-SYS-05",
    "domain": "Full-Stack Web & Smart Automation",
    "title": "SkillBridge: AI-Powered Academia-Industry Micro-Project & Hiring Portal",
    "coreQuestion": "How can engineering students match their verifiable coding skills with real-world industry micro-internships without resume bias?",
    "background": "Traditional campus placement relies on rigid GPA cutoffs and generic resumes, leaving talented student coders overlooked while tech startups struggle to find candidates with hands-on framework experience. Students lack avenues to prove their capabilities on bite-sized, real-world industry tasks.",
    "description": "Build a dual-sided matching platform where tech companies post scoped micro-projects (bug fixes, feature additions) with required skill tags, and students connect their GitHub profiles and project portfolios; a semantic matching algorithm ranks candidates based on demonstrated skills rather than pedigree.",
    "scopeGuidance": "Simulate employer project postings and student profile ingestions. Focus on skill taxonomy matching (cosine similarity over technical tags and GitHub repository languages) and a clean collaboration workspace.",
    "requirements": [
      "Micro-Project Marketplace: Employers post scoped tasks with clear deliverables and stipend rewards.",
      "Automated Skill Extraction: Parse student GitHub repositories and language proficiencies into a verified badge profile.",
      "Semantic Matchmaker: Recommend top student matches to employers using cosine similarity on skills."
    ],
    "constraints": [
      "Building a full-fledged video conferencing platform.",
      "Automated code compilation and grading for every programming language.",
      "Replacing global job portals (LinkedIn)."
    ],
    "judgingCriteria": "• Matching Algorithm Relevance & Scoring Logic (40%)\n• Platform Dual-Persona UX (Student vs Employer) (35%)\n• GitHub Data Integration & Profile Verification (25%)",
    "technologies": ["Next.js", "FastAPI", "Node.js", "Scikit-learn (Cosine Similarity)", "Supabase", "PostgreSQL", "GitHub REST API"],
    "pdfDescription": `SKILLBRIDGE: AI-POWERED ACADEMIA-INDUSTRY MICRO-PROJECT & HIRING PORTAL
Problem Statement ID: KARE-SYS-05 | Domain: Full-Stack Web & Smart Automation

• THE CORE QUESTION:
How can engineering students match their verifiable coding skills with real-world industry micro-internships without resume bias?

• THE PROBLEM GAP:
Traditional campus placement relies on rigid GPA cutoffs and generic resumes, leaving talented student coders overlooked while tech startups struggle to find candidates with hands-on framework experience. Students lack avenues to prove their capabilities on bite-sized, real-world industry tasks.

• THE CHALLENGE:
Build a dual-sided matching platform where tech companies post scoped micro-projects (bug fixes, feature additions) with required skill tags, and students connect their GitHub profiles and project portfolios; a semantic matching algorithm ranks candidates based on demonstrated skills rather than pedigree.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Simulate employer project postings and student profile ingestions. Focus on skill taxonomy matching (cosine similarity over technical tags and GitHub repository languages) and a clean collaboration workspace.

• SOLUTION DIRECTIONS:
• Micro-Project Marketplace: Employers post scoped tasks with clear deliverables and stipend rewards.
• Automated Skill Extraction: Parse student GitHub repositories and language proficiencies into a verified badge profile.
• Semantic Matchmaker: Recommend top student matches to employers using cosine similarity on skills.

• ANTI-GOALS (WHAT THIS IS NOT):
• Building a full-fledged video conferencing platform.
• Automated code compilation and grading for every programming language.
• Replacing global job portals (LinkedIn).

• JUDGING CRITERIA:
• Matching Algorithm Relevance & Scoring Logic (40%)
• Platform Dual-Persona UX (Student vs Employer) (35%)
• GitHub Data Integration & Profile Verification (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Next.js, FastAPI / Node.js, Scikit-learn (Cosine Similarity), Supabase / PostgreSQL, GitHub REST API`
  },
  {
    "id": "KARE-SYS-06",
    "domain": "Full-Stack Web & Smart Automation",
    "title": "KalaKriti: AI-Powered Multilingual Cataloging Portal for Rural Artisans",
    "coreQuestion": "How can traditional artisans create digital e-commerce storefronts with professional marketing descriptions using just their phone camera?",
    "background": "Millions of skilled rural artisans (potters, weavers, painters) struggle to sell their craft on digital platforms because cataloging products requires writing fluent English descriptions, measuring dimensions, and categorizing crafts correctly. High agency commissions eat up their profits.",
    "description": "Design a mobile progressive web app where artisans snap a photo of their handmade craft; multimodal vision AI analyzes the image, automatically tags craft categories, identifies colors and materials, and generates compelling promotional descriptions in both English and local Indian languages for instant digital sharing.",
    "scopeGuidance": "Use free vision-language APIs (BLIP, CLIP, or Gemini API). The artisan workflow must be one-click simple: upload photo -> review generated product card -> share on WhatsApp or export catalog.",
    "requirements": [
      "Photo-to-Catalog Pipeline: Extract craft type (e.g., 'Terracotta pottery', 'Bandhani saree') and color palette.",
      "Multilingual Marketing Copywriter: Generate engaging product descriptions in English, Hindi, Tamil, etc.",
      "Digital Showcase Storefront: Auto-generate a sharable web link where customers can view products and message the artisan."
    ],
    "constraints": [
      "Building an entire payment gateway and banking settlement engine.",
      "Requiring complex inventory SKU management.",
      "Manual multi-page form filling."
    ],
    "judgingCriteria": "• Vision-to-Copy Generation Quality (40%)\n• Artisan Mobile Usability & Accessibility (35%)\n• Storefront Presentation & Sharing Flow (25%)",
    "technologies": ["React", "Next.js", "FastAPI", "HuggingFace Inference API", "BLIP", "Vision", "Firebase", "Supabase", "Tailwind CSS"],
    "pdfDescription": `KALAKRITI: AI-POWERED MULTILINGUAL CATALOGING PORTAL FOR RURAL ARTISANS
Problem Statement ID: KARE-SYS-06 | Domain: Full-Stack Web & Smart Automation

• THE CORE QUESTION:
How can traditional artisans create digital e-commerce storefronts with professional marketing descriptions using just their phone camera?

• THE PROBLEM GAP:
Millions of skilled rural artisans (potters, weavers, painters) struggle to sell their craft on digital platforms because cataloging products requires writing fluent English descriptions, measuring dimensions, and categorizing crafts correctly. High agency commissions eat up their profits.

• THE CHALLENGE:
Design a mobile progressive web app where artisans snap a photo of their handmade craft; multimodal vision AI analyzes the image, automatically tags craft categories, identifies colors and materials, and generates compelling promotional descriptions in both English and local Indian languages for instant digital sharing.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Use free vision-language APIs (BLIP, CLIP, or Gemini API). The artisan workflow must be one-click simple: upload photo -> review generated product card -> share on WhatsApp or export catalog.

• SOLUTION DIRECTIONS:
• Photo-to-Catalog Pipeline: Extract craft type (e.g., 'Terracotta pottery', 'Bandhani saree') and color palette.
• Multilingual Marketing Copywriter: Generate engaging product descriptions in English, Hindi, Tamil, etc.
• Digital Showcase Storefront: Auto-generate a sharable web link where customers can view products and message the artisan.

• ANTI-GOALS (WHAT THIS IS NOT):
• Building an entire payment gateway and banking settlement engine.
• Requiring complex inventory SKU management.
• Manual multi-page form filling.

• JUDGING CRITERIA:
• Vision-to-Copy Generation Quality (40%)
• Artisan Mobile Usability & Accessibility (35%)
• Storefront Presentation & Sharing Flow (25%)

• RECOMMENDED TECH STACK & RESOURCES:
React / Next.js, FastAPI, HuggingFace Inference API (BLIP / Vision), Firebase / Supabase, Tailwind CSS`
  },
  {
    "id": "KARE-SYS-07",
    "domain": "Full-Stack Web & Smart Automation",
    "title": "GeoAttend Lite: Geofenced Check-in with Rotating Code & Basic Anomaly Flags",
    "coreQuestion": "How can a mobile web app automate classroom attendance using geofencing and a rotating check-in code while deterring simple proxy or spoofing attempts?",
    "background": "Roll calls waste lecture time. Biometrics create queues and hygiene issues. Simple attendance apps are tricked by GPS spoofing or credential sharing.",
    "description": "Build a mobile web attendance portal where faculty displays a rotating 6-digit code or QR, students submit the code plus browser geolocation, and the system verifies coordinates inside a simulated classroom polygon using Haversine logic while flagging basic anomalies (out-of-polygon, duplicate device ID, rapid speed jumps).",
    "scopeGuidance": "One simulated campus and one classroom polygon. No RFID hardware, no background tracking outside class. Use localStorage or device ID plus rotating code for basic proxy deterrence. Note: spoof-deterrent rather than claim of impossible spoof-proofing.",
    "requirements": [
      "Geofence Validator: Check student coordinates against classroom polygon.",
      "Anti-Spoofing Heuristics: Mock-location flag if available, abnormal speed, duplicate device, low GPS accuracy.",
      "Live Faculty Monitor: Occupancy view, absentee export, session code rotation."
    ],
    "constraints": [
      "RFID gates in every doorway",
      "Tracking students outside lecture hours",
      "Multi-semester grading portal",
      "Claiming impossible spoof-proof security"
    ],
    "judgingCriteria": "• Geofence accuracy and basic spoof deterrence (45%)\n• Faculty dashboard and live roster UX (30%)\n• Mobile responsiveness and lightweight design (25%)",
    "technologies": ["React", "Next.js", "HTML5 Geolocation API", "Node.js", "FastAPI", "SQLite", "PostgreSQL", "MongoDB", "Tailwind CSS"],
    "pdfDescription": `GEOATTEND LITE: GEOFENCED CHECK-IN WITH ROTATING CODE AND BASIC ANOMALY FLAGS
Problem Statement ID: KARE-SYS-07 | Domain: Full-Stack Web & Smart Automation

• THE CORE QUESTION:
How can a mobile web app automate classroom attendance using geofencing and a rotating check-in code while deterring simple proxy or spoofing attempts?

• THE PROBLEM GAP:
Roll calls waste lecture time. Biometrics create queues and hygiene issues. Simple attendance apps are tricked by GPS spoofing or credential sharing.

• THE CHALLENGE (24-HR FEASIBILITY):
Build a mobile web attendance portal where faculty displays a rotating 6-digit code or QR, students submit the code plus browser geolocation, and the system verifies coordinates inside a simulated classroom polygon using Haversine logic while flagging basic anomalies (out-of-polygon, duplicate device ID, rapid speed jumps).

• SCOPE GUIDANCE:
One simulated campus and one classroom polygon. No RFID hardware, no background tracking outside class. Use localStorage or device ID plus rotating code for basic proxy deterrence. Note: spoof-deterrent rather than claim of impossible spoof-proofing.

• SOLUTION DIRECTIONS:
• Geofence Validator: Check student coordinates against classroom polygon.
• Anti-Spoofing Heuristics: Mock-location flag if available, abnormal speed, duplicate device, low GPS accuracy.
• Live Faculty Monitor: Occupancy view, absentee export, session code rotation.

• ANTI-GOALS:
• RFID gates in every doorway
• Tracking students outside lecture hours
• Multi-semester grading portal
• Claiming impossible spoof-proof security

• JUDGING CRITERIA:
• Geofence accuracy and basic spoof deterrence (45%)
• Faculty dashboard and live roster UX (30%)
• Mobile responsiveness and lightweight design (25%)

• RECOMMENDED TECH STACK & RESOURCES:
React / Next.js, HTML5 Geolocation API, Node.js / FastAPI, SQLite / PostgreSQL / MongoDB, Tailwind CSS`
  },
  {
    "id": "KARE-SYS-08",
    "domain": "Full-Stack Web & Smart Automation",
    "title": "SchemeFinder: Dynamic Citizen Welfare Scheme Matcher & Document Guide",
    "coreQuestion": "How can an intuitive digital advisor discover the exact government subsidies, scholarships, and pensions a citizen is entitled to?",
    "background": "Central and state governments operate hundreds of welfare schemes for students, farmers, women entrepreneurs, and senior citizens. However, over 70% of eligible beneficiaries fail to access them because scheme rules are buried across dozens of departmental websites with confusing bureaucratic criteria.",
    "description": "Create a simple, conversational 4-step wizard where citizens answer basic demographic questions (age, state, caste category, annual income, occupation, education); the system matches their profile against an indexed database of government schemes and produces a personalized eligibility scorecard with a step-by-step document checklist.",
    "scopeGuidance": "Curate a representative database of 20-30 major central and state schemes (PM-Kisan, Post-Matric Scholarships, Mudra Loan, etc.). Emphasize fuzzy search, rule filtering, and clear document checklists for applying.",
    "requirements": [
      "Multi-Criteria Rule Matching: Filter schemes matching intersection of income, social category, and occupation.",
      "Personalized Document Checklist: List exact required documents (Aadhaar, Income Certificate, Bank Passbook).",
      "Plain-Language Benefits Breakdown: Display expected monetary or grant benefits without bureaucratic jargon."
    ],
    "constraints": [
      "Direct integration with national treasury disbursement.",
      "Requiring complex government single-sign-on login.",
      "Building a broad search engine with unverified links."
    ],
    "judgingCriteria": "• Matching Logic Precision & Scheme Rule Accuracy (40%)\n• Simplicity of Citizen Wizard & Document Checklist (35%)\n• Database Schema & Extensibility (25%)",
    "technologies": ["Next.js", "React", "Fuse.js", "SQLite", "Supabase", "Tailwind CSS", "Python", "FastAPI"],
    "pdfDescription": `SCHEMEFINDER: DYNAMIC CITIZEN WELFARE SCHEME MATCHER & DOCUMENT GUIDE
Problem Statement ID: KARE-SYS-08 | Domain: Full-Stack Web & Smart Automation

• THE CORE QUESTION:
How can an intuitive digital advisor discover the exact government subsidies, scholarships, and pensions a citizen is entitled to?

• THE PROBLEM GAP:
Central and state governments operate hundreds of welfare schemes for students, farmers, women entrepreneurs, and senior citizens. However, over 70% of eligible beneficiaries fail to access them because scheme rules are buried across dozens of departmental websites with confusing bureaucratic criteria.

• THE CHALLENGE:
Create a simple, conversational 4-step wizard where citizens answer basic demographic questions (age, state, caste category, annual income, occupation, education); the system matches their profile against an indexed database of government schemes and produces a personalized eligibility scorecard with a step-by-step document checklist.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Curate a representative database of 20-30 major central and state schemes (PM-Kisan, Post-Matric Scholarships, Mudra Loan, etc.). Emphasize fuzzy search, rule filtering, and clear document checklists for applying.

• SOLUTION DIRECTIONS:
• Multi-Criteria Rule Matching: Filter schemes matching intersection of income, social category, and occupation.
• Personalized Document Checklist: List exact required documents (Aadhaar, Income Certificate, Bank Passbook).
• Plain-Language Benefits Breakdown: Display expected monetary or grant benefits without bureaucratic jargon.

• ANTI-GOALS (WHAT THIS IS NOT):
• Direct integration with national treasury disbursement.
• Requiring complex government single-sign-on login.
• Building a broad search engine with unverified links.

• JUDGING CRITERIA:
• Matching Logic Precision & Scheme Rule Accuracy (40%)
• Simplicity of Citizen Wizard & Document Checklist (35%)
• Database Schema & Extensibility (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Next.js / React, Fuse.js / SQLite, Supabase, Tailwind CSS, Python / FastAPI`
  },
  {
    "id": "KARE-SYS-09",
    "domain": "Full-Stack Web & Smart Automation",
    "title": "MedInventory: Hospital Pharmacy Batch Expiry Tracker & Stockout Sentinel",
    "coreQuestion": "How can smart pharmacy software enforce First-Expired-First-Out dispensing and prevent life-saving medicines from expiring unnoticed?",
    "background": "Hospitals routinely discard thousands of dollars worth of expired medicines, while other wards in the same facility face acute shortages of those exact drugs. Paper logbooks and basic spreadsheets fail to track batch-level expiration dates, leading to expired medicines remaining on dispensing shelves.",
    "description": "Build a barcode/QR-enabled pharmacy inventory tracking web application that logs medicine batches with manufacturing and expiry dates, enforces First Expired, First Out (FEFO) dispensing rules, triggers automated color-coded expiry alerts (Red = expiring in 30 days), and enables internal inter-ward medicine transfers.",
    "scopeGuidance": "Implement webcam barcode/QR scanning using browser libraries. Simulate pharmacy stock entries and show dynamic alerts when an expiry date approaches.",
    "requirements": [
      "Batch-Level Barcode / QR Scanning: Ingest medicine shipments with batch numbers, quantities, and expiration dates.",
      "Automated FEFO Dispensing Guide: Prompt pharmacists to dispense the nearest-expiring batch first.",
      "Critical Expiry Sentinel: Automated color-coded alerts and inter-ward surplus transfer requests."
    ],
    "constraints": [
      "Automated drug compounding robotics.",
      "Full billing and insurance claim settlement.",
      "Clinical pharmacy trial protocols."
    ],
    "judgingCriteria": "• FEFO Logic & Expiry Alert Automation (45%)\n• Barcode Scanning & Inventory UX (30%)\n• Data Integrity & Relational Schema (25%)",
    "technologies": ["React", "Next.js", "HTML5-QRCode Scanner", "Node.js", "Express", "PostgreSQL", "Supabase", "Tailwind CSS"],
    "pdfDescription": `MEDINVENTORY: HOSPITAL PHARMACY BATCH EXPIRY TRACKER & STOCKOUT SENTINEL
Problem Statement ID: KARE-SYS-09 | Domain: Full-Stack Web & Smart Automation

• THE CORE QUESTION:
How can smart pharmacy software enforce First-Expired-First-Out dispensing and prevent life-saving medicines from expiring unnoticed?

• THE PROBLEM GAP:
Hospitals routinely discard thousands of dollars worth of expired medicines, while other wards in the same facility face acute shortages of those exact drugs. Paper logbooks and basic spreadsheets fail to track batch-level expiration dates, leading to expired medicines remaining on dispensing shelves.

• THE CHALLENGE:
Build a barcode/QR-enabled pharmacy inventory tracking web application that logs medicine batches with manufacturing and expiry dates, enforces First Expired, First Out (FEFO) dispensing rules, triggers automated color-coded expiry alerts (Red = expiring in 30 days), and enables internal inter-ward medicine transfers.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Implement webcam barcode/QR scanning using browser libraries. Simulate pharmacy stock entries and show dynamic alerts when an expiry date approaches.

• SOLUTION DIRECTIONS:
• Batch-Level Barcode / QR Scanning: Ingest medicine shipments with batch numbers, quantities, and expiration dates.
• Automated FEFO Dispensing Guide: Prompt pharmacists to dispense the nearest-expiring batch first.
• Critical Expiry Sentinel: Automated color-coded alerts and inter-ward surplus transfer requests.

• ANTI-GOALS (WHAT THIS IS NOT):
• Automated drug compounding robotics.
• Full billing and insurance claim settlement.
• Clinical pharmacy trial protocols.

• JUDGING CRITERIA:
• FEFO Logic & Expiry Alert Automation (45%)
• Barcode Scanning & Inventory UX (30%)
• Data Integrity & Relational Schema (25%)

• RECOMMENDED TECH STACK & RESOURCES:
React / Next.js, HTML5-QRCode Scanner library, Node.js / Express, PostgreSQL / Supabase, Tailwind CSS`
  },
  {
    "id": "KARE-SYS-10",
    "domain": "Full-Stack Web & Smart Automation",
    "title": "RailResolve: Smart Railway Passenger Grievance Categorizer & Ticket Triage",
    "coreQuestion": "How can natural language processing turn chaotic passenger complaints into prioritized, de-duplicated tickets for railway maintenance crews?",
    "background": "The railway complaint helpline receives tens of thousands of unstructured passenger complaints daily across social media, apps, and SMS. During major train delays, dozens of passengers from the same train log identical complaints about air conditioning or dirty coaches, swamping support staff and burying critical medical/security emergencies.",
    "description": "Design an intelligent railway passenger grievance ticketing portal that ingests complaint text, automatically classifies issues into departments (Catering, Cleanliness, Electrical, Security, Medical), detects and groups duplicate complaints from the same train/coach number, and visualizes an emergency-first triage board for division managers.",
    "scopeGuidance": "Use sample passenger complaints. Implement a text classification model (Naive Bayes / DistilBERT) to categorize issues and a grouping heuristic that aggregates complaints sharing PNR / Train number and issue category.",
    "requirements": [
      "Multi-Class Issue Tagging: Automatically route complaints to Sanitation, Pantry, Electrical, or Security.",
      "Train-Level De-Duplication: Group 20 separate complaints about 'Coach B2 AC not working' into a single actionable ticket.",
      "Emergency Priority Escalation: Flag safety, security, and medical emergencies at the top of the triage board."
    ],
    "constraints": [
      "Real-time locomotive sensor telemetry.",
      "Direct integration with national railway ticketing booking databases.",
      "Passenger refund payment processing."
    ],
    "judgingCriteria": "• NLP Categorization & De-Duplication Accuracy (40%)\n• Triage Board Design & Department Routing (35%)\n• Emergency Escalation Responsiveness (25%)",
    "technologies": ["FastAPI", "Node.js", "Scikit-learn (NLP Classifier)", "React", "Chart.js", "PostgreSQL", "Supabase"],
    "pdfDescription": `RAILRESOLVE: SMART RAILWAY PASSENGER GRIEVANCE CATEGORIZER & TICKET TRIAGE
Problem Statement ID: KARE-SYS-10 | Domain: Full-Stack Web & Smart Automation

• THE CORE QUESTION:
How can natural language processing turn chaotic passenger complaints into prioritized, de-duplicated tickets for railway maintenance crews?

• THE PROBLEM GAP:
The railway complaint helpline receives tens of thousands of unstructured passenger complaints daily across social media, apps, and SMS. During major train delays, dozens of passengers from the same train log identical complaints about air conditioning or dirty coaches, swamping support staff and burying critical medical/security emergencies.

• THE CHALLENGE:
Design an intelligent railway passenger grievance ticketing portal that ingests complaint text, automatically classifies issues into departments (Catering, Cleanliness, Electrical, Security, Medical), detects and groups duplicate complaints from the same train/coach number, and visualizes an emergency-first triage board for division managers.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Use sample passenger complaints. Implement a text classification model (Naive Bayes / DistilBERT) to categorize issues and a grouping heuristic that aggregates complaints sharing PNR / Train number and issue category.

• SOLUTION DIRECTIONS:
• Multi-Class Issue Tagging: Automatically route complaints to Sanitation, Pantry, Electrical, or Security.
• Train-Level De-Duplication: Group 20 separate complaints about 'Coach B2 AC not working' into a single actionable ticket.
• Emergency Priority Escalation: Flag safety, security, and medical emergencies at the top of the triage board.

• ANTI-GOALS (WHAT THIS IS NOT):
• Real-time locomotive sensor telemetry.
• Direct integration with national railway ticketing booking databases.
• Passenger refund payment processing.

• JUDGING CRITERIA:
• NLP Categorization & De-Duplication Accuracy (40%)
• Triage Board Design & Department Routing (35%)
• Emergency Escalation Responsiveness (25%)

• RECOMMENDED TECH STACK & RESOURCES:
FastAPI / Node.js, Scikit-learn (NLP Classifier), React, Chart.js, PostgreSQL / Supabase`
  },
  {
    "id": "PS-041",
    "domain": "Full-Stack Web & Smart Automation",
    "title": "NSS Blood Connect – Smart Blood Donor & Emergency Coordination System",
    "coreQuestion": "How can an intelligent digital platform connect blood donors with patients and hospitals in real time to eliminate delays during critical emergencies?",
    "background": "During critical medical emergencies, finding suitable blood donors quickly is challenging due to limited access to donor information, outdated contact records, and lack of real-time availability tracking.",
    "description": "During emergencies, finding suitable blood donors quickly can be challenging due to limited access to donor information and availability. Develop a digital platform that connects blood donors with patients, hospitals, and organizations through blood-group matching, location-based donor search, availability tracking, emergency blood requests, donor responses, and request tracking. The system should provide a centralized dashboard for managing donors, blood requests, emergency requirements, donation records, and blood-group statistics.",
    "scopeGuidance": "Build a responsive web platform featuring real-time donor-patient matching via geolocation radius filtering, live emergency WebSocket request broadcasts, and a centralized management dashboard for donors, requests, and blood inventory statistics.",
    "requirements": [
      "Blood-Group Matching & Location-Based Donor Search: Connect patients with eligible donors using blood compatibility and geolocation radius proximity on an interactive map.",
      "Emergency Blood Requests & Real-Time Tracking: Broadcast urgent SOS requests with instant notifications via WebSockets and live donor acceptance tracking.",
      "Centralized Management Dashboard: Manage donors, blood requests, emergency requirements, donation records, and blood-group statistics."
    ],
    "constraints": [
      "Exposing donor private contact info without consent.",
      "Manual phone-based coordination during emergency workflows.",
      "Unsecured API endpoints without JWT authorization."
    ],
    "judgingCriteria": "• Emergency Matching & Notification Latency (40%)\n• Centralized Dashboard & Inventory Analytics (35%)\n• Security, Privacy & JWT Implementation (25%)",
    "technologies": ["React", "Node.js", "Express.js", "MongoDB", "Google Maps API", "WebSockets", "JWT"],
    "pdfDescription": `NSS BLOOD CONNECT – SMART BLOOD DONOR & EMERGENCY COORDINATION SYSTEM
Problem Statement ID: PS-041 | Domain: Full-Stack Web & Smart Automation

• THE CORE QUESTION:
How can an intelligent digital platform connect blood donors with patients and hospitals in real time to eliminate delays during critical emergencies?

• THE PROBLEM GAP:
During emergencies, finding suitable blood donors quickly can be challenging due to limited access to donor information and availability. Traditional coordination relies on frantic manual calls and unverified social media messages, losing vital minutes when lives are at risk.

• THE CHALLENGE:
Develop a digital platform that connects blood donors with patients, hospitals, and organizations through blood-group matching, location-based donor search, availability tracking, emergency blood requests, donor responses, and request tracking. The system should provide a centralized dashboard for managing donors, blood requests, emergency requirements, donation records, and blood-group statistics.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Build a responsive full-stack platform using React, Node.js, Express, and MongoDB. Implement geolocation radius searches for donors with Google Maps API, use WebSockets for real-time emergency broadcasts and response tracking, and secure all user and administrative roles with JWT.

• SOLUTION DIRECTIONS:
• Location-Based Donor Matching: Search and filter available donors based on compatible blood groups and proximity radius.
• Real-Time Emergency SOS & WebSockets: Broadcast urgent blood requirements with instant notifications and donor response tracking.
• Centralized Management Dashboard: Track donation records, donor availability status, emergency requirements, and blood-group statistics.

• ANTI-GOALS (WHAT THIS IS NOT):
• Building automated laboratory blood cross-matching hardware.
• Exposing unverified personal phone numbers publicly without privacy guards.
• Ingesting national hospital EHR databases with heavy enterprise compliance overhead.

• JUDGING CRITERIA:
• Emergency Matching & Notification Latency (40%)
• Centralized Dashboard & Inventory Analytics (35%)
• Security, Privacy & JWT Implementation (25%)

• RECOMMENDED TECH STACK & RESOURCES:
React, Node.js, Express.js, MongoDB, Google Maps API, WebSockets, JWT`
  },
  {
    "id": "PS-042",
    "domain": "Artificial Intelligence & Machine Learning",
    "title": "AI-Driven EV Range Prediction & Smart Navigation System",
    "coreQuestion": "How can an AI navigation system accurately predict electric vehicle battery range under real-world dynamic conditions and recommend energy-optimal charging routes?",
    "background": "EV users often experience range anxiety due to uncertain battery consumption caused by traffic, driving speed, weather, vehicle load, air-conditioning usage, and vehicle characteristics.",
    "description": "EV users often experience range anxiety due to uncertain battery consumption caused by traffic, driving speed, weather, vehicle load, air-conditioning usage, and vehicle characteristics. Develop an AI-powered EV navigation system that predicts the vehicle's remaining driving range using real-time and user-provided parameters. The system should recommend energy-efficient routes by considering distance, traffic conditions, estimated energy consumption, and nearby charging-station availability.",
    "scopeGuidance": "Train a machine learning regression model on simulated or open EV telemetry datasets. Feed real-time speed, weather temperature, elevation profile, and cabin AC settings to compute remaining range, and dynamically map energy-efficient routes with smart charging station waypoints.",
    "requirements": [
      "AI/ML Driving Range Prediction: Predict real-time battery consumption and remaining distance factoring in speed, vehicle weight, weather, and climate control.",
      "Energy-Efficient Smart Navigation: Route planning algorithm that optimizes for minimal battery expenditure rather than just shortest distance.",
      "Charging Station Integration & Stop Planner: Discover nearby charging points along the route using EV charging APIs with live availability and automated charging stop suggestions."
    ],
    "constraints": [
      "Static linear range estimations without ML regression.",
      "Hardware OBD-II or CAN-bus reverse-engineering.",
      "Offline routing without dynamic traffic consideration."
    ],
    "judgingCriteria": "• ML Prediction Accuracy & Feature Engineering (40%)\n• Energy-Optimal Route Planning & Efficiency (35%)\n• Navigation UI & Charging Station Integration (25%)",
    "technologies": ["Python", "Machine Learning", "React", "Node.js", "MongoDB", "Google Maps API", "EV Charging APIs"],
    "pdfDescription": `AI-DRIVEN EV RANGE PREDICTION & SMART NAVIGATION SYSTEM
Problem Statement ID: PS-042 | Domain: Artificial Intelligence & Machine Learning

• THE CORE QUESTION:
How can an AI navigation system accurately predict electric vehicle battery range under real-world dynamic conditions and recommend energy-optimal charging routes?

• THE PROBLEM GAP:
EV users often experience range anxiety due to uncertain battery consumption caused by traffic, driving speed, weather, vehicle load, air-conditioning usage, and vehicle characteristics. Existing navigation apps calculate routes based purely on distance or time without factoring in vehicle energy dynamics or charger queues.

• THE CHALLENGE:
Develop an AI-powered EV navigation system that predicts the vehicle's remaining driving range using real-time and user-provided parameters. The system should recommend energy-efficient routes by considering distance, traffic conditions, estimated energy consumption, and nearby charging-station availability.

• SCOPE GUIDANCE (24-HR FEASIBILITY):
Train or evaluate an ML regression model (e.g. Scikit-learn, XGBoost) using EV driving cycle parameters. Build a full-stack interface using React and Node.js that visualizes estimated battery levels along the route, alerts on critical battery drop, and routes via nearby charging stations using Google Maps API.

• SOLUTION DIRECTIONS:
• Dynamic ML Range Prediction: Predict real-time energy consumption factoring in speed, payload, HVAC usage, and elevation profile.
• Energy-Aware Route Optimization: Recommend optimal paths balancing battery longevity, travel time, and live traffic conditions.
• Smart Charging Corridor Navigation: Integrate EV charging station APIs to schedule automated charging stops when range drops below critical thresholds.

• ANTI-GOALS (WHAT THIS IS NOT):
• Physical vehicle ECU or CAN-bus reverse-engineering.
• Designing high-voltage physical charging hardware.
• Static lookup tables without machine learning regression.

• JUDGING CRITERIA:
• ML Prediction Accuracy & Feature Engineering (40%)
• Energy-Optimal Route Planning & Efficiency (35%)
• Navigation UI & Charging Station Integration (25%)

• RECOMMENDED TECH STACK & RESOURCES:
Python, Machine Learning, React, Node.js, MongoDB, Google Maps API, EV Charging APIs`
  }
];

const mappedProblems = rawBooklet.map(item => ({
  problemId: item.id,
  title: item.title,
  description: item.description,
  background: item.background,
  expectedSolution: item.pdfDescription,
  requirements: item.requirements,
  constraints: item.constraints,
  domain: item.domain,
  difficulty: item.difficulty || (item.id.includes('-03') || item.id.includes('-05') || item.id.includes('-08') ? 'Hard' : 'Medium'),
  technologies: item.technologies,
  maxTeamCapacity: 2,
  selectedCount: 0,
  status: 'PUBLISHED'
}));

const fileContent = `/**
 * Hackathon 2026 - Comprehensive Problem Statement Booklet
 * Exactly 42 Problem Statements across Core CSE Domains
 * Strictly enforced 2-team capacity limit per problem statement
 */

const problemStatements = ${JSON.stringify(mappedProblems, null, 2)};

module.exports = problemStatements;
`;

const outputPath = path.join(__dirname, '../server/data/problemStatements.js');
fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`✅ Successfully generated ${mappedProblems.length} problem statements at: ${outputPath}`);
