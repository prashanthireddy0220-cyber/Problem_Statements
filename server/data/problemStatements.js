/**
 * Hackathon 2026 - Top 40 Problem Statement Booklet
 * Strictly 40 Verified Problem Statements across 4 Core CSE Domains (10 Each)
 * Enforces 2-Team Capacity Limit Per Statement
 */

const problemStatements = [
  {
    "problemId": "KARE-AI-01",
    "title": "VoiceSentry: Real-Time Synthetic Voice & Audio Deepfake Detector",
    "description": "Design a real-time audio analysis tool that listens to an incoming voice stream or uploaded audio, extracts acoustic and frequency biomarkers, and provides an immediate confidence score indicating whether the voice is authentic human speech or AI-generated.",
    "background": "Generative speech synthesis (ElevenLabs, VALL-E) allows malicious actors to clone human voices with just a 3-second sample. Traditional fraud prevention relies on caller ID or SMS OTPs, which are easily bypassed. Existing audio forensic tools are slow, offline, and require lab-grade signal processing, leaving consumers and call center agents defenseless against live voice impersonation.",
    "expectedSolution": "VOICESENTRY: REAL-TIME SYNTHETIC VOICE & AUDIO DEEPFAKE DETECTOR\nProblem Statement ID: KARE-AI-01 | Domain: Artificial Intelligence & Machine Learning\n\n• THE CORE QUESTION:\nHow can an intelligent audio system instantly detect synthetic voice clones in live communication before financial fraud or social engineering succeeds?\n\n• THE PROBLEM GAP:\nGenerative speech synthesis (ElevenLabs, VALL-E) allows malicious actors to clone human voices with just a 3-second sample. Traditional fraud prevention relies on caller ID or SMS OTPs, which are easily bypassed. Existing audio forensic tools are slow, offline, and require lab-grade signal processing, leaving consumers and call center agents defenseless against live voice impersonation.\n\n• THE CHALLENGE:\nDesign a real-time audio analysis tool that listens to an incoming voice stream or uploaded audio, extracts acoustic and frequency biomarkers, and provides an immediate confidence score indicating whether the voice is authentic human speech or AI-generated.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nTeams are not expected to train a foundation audio model from scratch. Focus on extracting key acoustic features (MFCCs, spectral roll-off, pitch jitter, phase continuity) and using a pre-trained classifier or fine-tuned model on synthetic/real audio benchmarks.\n\n• SOLUTION DIRECTIONS:\n• Acoustic Feature Inspection: Analyze anomalous pitch consistency and unnatural frequency cutoffs typical of synthetic audio.\n• Real-Time Confidence Gauge: Visual latency meter showing live risk level (Authentic, Suspicious, Cloned).\n• Audio Spectrogram Visualizer: Highlight tampered frequency bins for forensic explainability.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Building a speech recognition or transcription engine.\n• Scraping millions of YouTube voice clips.\n• Complex telecommunication telecom-layer hacking.\n\n• JUDGING CRITERIA:\n• Detection Accuracy on Test Audio (40%)\n• Forensic Explainability & Spectrogram Insights (30%)\n• Real-time Latency & UX (30%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, Librosa, PyTorch/Scikit-learn, Torchaudio, Streamlit / React, FastAPI, ASVspoof dataset samples",
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
    "domain": "Artificial Intelligence & Machine Learning",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "Librosa",
      "PyTorch",
      "Scikit-learn",
      "Torchaudio",
      "Streamlit",
      "React",
      "FastAPI",
      "ASVspoof dataset samples"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-AI-02",
    "title": "VisionGuard: Smart CCTV Perimeter Intrusion & Unattended Baggage Sentinel",
    "description": "Develop an intelligent vision monitoring dashboard that ingests live webcam or recorded CCTV streams, allows security officers to draw virtual perimeter tripwires, and autonomously flags boundary intrusions and unattended baggage lasting over 15 seconds.",
    "background": "Most campus and commercial CCTV setups are strictly passive: security guards watch multi-screen walls with inevitable fatigue, or footage is reviewed only after an incident occurs. Conventional video analytics tools are rigid, trigger hundreds of false alarms on animals or shadows, and fail to track stationary unattended objects over time.",
    "expectedSolution": "VISIONGUARD: SMART CCTV PERIMETER INTRUSION & UNATTENDED BAGGAGE SENTINEL\nProblem Statement ID: KARE-AI-02 | Domain: Artificial Intelligence & Machine Learning\n\n• THE CORE QUESTION:\nHow can standard, low-cost CCTV infrastructure be transformed into an autonomous spatial intelligence sentinel without requiring expensive edge hardware?\n\n• THE PROBLEM GAP:\nMost campus and commercial CCTV setups are strictly passive: security guards watch multi-screen walls with inevitable fatigue, or footage is reviewed only after an incident occurs. Conventional video analytics tools are rigid, trigger hundreds of false alarms on animals or shadows, and fail to track stationary unattended objects over time.\n\n• THE CHALLENGE:\nDevelop an intelligent vision monitoring dashboard that ingests live webcam or recorded CCTV streams, allows security officers to draw virtual perimeter tripwires, and autonomously flags boundary intrusions and unattended baggage lasting over 15 seconds.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nTeams do not need massive physical CCTV camera networks. Use sample CCTV footage or local webcam feeds with simulated objects (backpacks, bags) and test persons to demonstrate tripwire breach and object abandoned time-tracking.\n\n• SOLUTION DIRECTIONS:\n• Dynamic Tripwire Configuration: Draw polygon zones and crossing lines on live video feeds.\n• Object Association & Dwell Timer: Track who placed a bag and start an alert timer if the owner walks away.\n• Instant Alert Generation: Generate audio siren triggers, snapshot logging, and Telegram/WebSocket alerts.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Full-scale hardware NVR manufacturing.\n• Face recognition surveillance across thousands of identities.\n• High-latency offline video processing.\n\n• JUDGING CRITERIA:\n• Detection Precision & Object Tracking Consistency (40%)\n• Usability of Security Monitoring UI (30%)\n• Alert Latency & Edge Optimization (30%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, OpenCV, YOLOv8 / YOLO-NAS, DeepSORT / ByteTrack, Flask/FastAPI, WebSockets, React/Tailwind",
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
    "domain": "Artificial Intelligence & Machine Learning",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "OpenCV",
      "YOLOv8",
      "YOLO-NAS",
      "DeepSORT",
      "ByteTrack",
      "Flask",
      "FastAPI",
      "WebSockets",
      "React",
      "Tailwind"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-AI-03",
    "title": "MediScan AI: Explainable Primary Retinal & Dermatological Diagnostic Screener",
    "description": "Create an explainable diagnostic screener that takes fundus or skin lesion images, determines condition severity stages, and visually highlights the exact pathological markers driving the decision using Grad-CAM heatmaps.",
    "background": "Over 70% of primary health centers in rural regions lack ophthalmologists and dermatologists. Patients travel hundreds of kilometers for routine screenings of diabetic retinopathy or malignant skin lesions. Existing AI diagnostic apps function as black boxes, outputting opaque percentages that clinicians distrust and cannot explain to patients.",
    "expectedSolution": "MEDISCAN AI: EXPLAINABLE PRIMARY RETINAL & DERMATOLOGICAL DIAGNOSTIC SCREENER\nProblem Statement ID: KARE-AI-03 | Domain: Artificial Intelligence & Machine Learning\n\n• THE CORE QUESTION:\nHow can frontline rural health workers receive instant, explainable second opinions on medical imagery without relying on absent specialists?\n\n• THE PROBLEM GAP:\nOver 70% of primary health centers in rural regions lack ophthalmologists and dermatologists. Patients travel hundreds of kilometers for routine screenings of diabetic retinopathy or malignant skin lesions. Existing AI diagnostic apps function as black boxes, outputting opaque percentages that clinicians distrust and cannot explain to patients.\n\n• THE CHALLENGE:\nCreate an explainable diagnostic screener that takes fundus or skin lesion images, determines condition severity stages, and visually highlights the exact pathological markers driving the decision using Grad-CAM heatmaps.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nUse open benchmark datasets (Kaggle APTOS, EyePACS, or ISIC Skin Cancer dataset). The focus is not 99.9% clinical validation, but on decision explainability, confidence intervals, and clinician-friendly interface design.\n\n• SOLUTION DIRECTIONS:\n• Multi-Condition Triage: Screen uploaded images for severity levels (Normal, Mild, Moderate, Severe).\n• Visual Decision Grounding: Overlay Grad-CAM attention heatmaps pinpointing microaneurysms or lesions.\n• Clinical Summary Report: Export a structured patient advisory sheet explaining findings in layperson terms.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Replacing professional medical diagnosis.\n• Training multi-gigabyte models on local laptops.\n• Gathering patient medical history forms with manual input friction.\n\n• JUDGING CRITERIA:\n• Explainability & Heatmap Quality (40%)\n• Model Classification Coherence (30%)\n• Healthcare Worker Interface Simplicity (30%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPyTorch, Torchvision, ResNet50/EfficientNet, Grad-CAM, FastAPI, Gradio/React, Kaggle APTOS/ISIC data",
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
    "domain": "Artificial Intelligence & Machine Learning",
    "difficulty": "Medium",
    "technologies": [
      "PyTorch",
      "Torchvision",
      "ResNet50",
      "EfficientNet",
      "Grad-CAM",
      "FastAPI",
      "Gradio",
      "React",
      "Kaggle APTOS",
      "ISIC data"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-AI-04",
    "title": "AgriDoctor: Multilingual Crop Leaf Disease Identifier & Voice Advisory",
    "description": "Build an offline-ready mobile web tool where farmers upload or capture a photo of an infected leaf, receive an instant identification of the disease, and listen to spoken, practical, low-cost organic treatment steps in vernacular Indian languages.",
    "background": "Plant diseases destroy up to 40% of smallholder harvest yields annually. When crop infestations strike, farmers struggle to identify the exact fungal or bacterial pathogen. Existing diagnostic platforms return dense scientific names in English and push expensive commercial chemicals that farmers cannot afford or obtain locally.",
    "expectedSolution": "AGRIDOCTOR: MULTILINGUAL CROP LEAF DISEASE IDENTIFIER & VOICE ADVISORY\nProblem Statement ID: KARE-AI-04 | Domain: Artificial Intelligence & Machine Learning\n\n• THE CORE QUESTION:\nHow can AI turn a smartphone camera into a localized agricultural expert that diagnoses crop pests and speaks organic remedies in native dialects?\n\n• THE PROBLEM GAP:\nPlant diseases destroy up to 40% of smallholder harvest yields annually. When crop infestations strike, farmers struggle to identify the exact fungal or bacterial pathogen. Existing diagnostic platforms return dense scientific names in English and push expensive commercial chemicals that farmers cannot afford or obtain locally.\n\n• THE CHALLENGE:\nBuild an offline-ready mobile web tool where farmers upload or capture a photo of an infected leaf, receive an instant identification of the disease, and listen to spoken, practical, low-cost organic treatment steps in vernacular Indian languages.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nUse pre-trained models on the PlantVillage dataset (covering potato, tomato, corn, etc.). Prioritize multilingual text-to-speech feedback and practical, actionable farming remedies over rare crop edge cases.\n\n• SOLUTION DIRECTIONS:\n• Visual Pathogen Identification: Detect leaf blights, rusts, and pest damage from camera photos.\n• Vernacular Voice Synthesis: Read out remedies in Hindi, Tamil, Telugu, etc., using Web Speech/TTS.\n• Cost-Effective Remedy Engine: Prioritize bio-pesticides (neem oil, buttermilk spray) over chemical brands.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Building a comprehensive botanical encyclopedia.\n• Soil sensor IoT hardware integration.\n• Requiring complex login forms or high-bandwidth video streaming.\n\n• JUDGING CRITERIA:\n• Farmer-Centric UX & Voice Accessibility (40%)\n• Diagnosis Accuracy & Remedy Relevance (30%)\n• Lightweight Mobile Responsiveness (30%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nTensorFlow / PyTorch, MobileNetV2, PlantVillage Dataset, Web Speech API / gTTS, Next.js / PWA",
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
    "domain": "Artificial Intelligence & Machine Learning",
    "difficulty": "Medium",
    "technologies": [
      "TensorFlow",
      "PyTorch",
      "MobileNetV2",
      "PlantVillage Dataset",
      "Web Speech API",
      "gTTS",
      "Next.js",
      "PWA"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-AI-05",
    "title": "SignBridge Lite: One-Way ISL Gesture-to-Speech Translator (Core Vocabulary)",
    "description": "Develop an interactive, bidirectional camera communication bridge that tracks hand and facial landmarks to translate live Indian Sign Language gestures into spoken audio/text, and converts the clerk's spoken responses back into animated/visual sign sequences.",
    "background": "Over 18 million hearing and speech-impaired individuals in India struggle daily at railway ticket windows, banks, and post offices due to the absence of sign language interpreters. Existing translator apps are static dictionary lookup tables that require typing, defeating the purpose of seamless face-to-face conversation.",
    "expectedSolution": "SIGNBRIDGE LITE: ONE-WAY INDIAN SIGN LANGUAGE GESTURE-TO-SPEECH TRANSLATOR\nProblem Statement ID: KARE-AI-05 | Domain: Artificial Intelligence and Machine Learning\n\n• THE CORE QUESTION:\nHow can a webcam application translate a small vocabulary of Indian Sign Language (ISL) gestures into text and spoken audio for public counter interactions?\n\n• THE PROBLEM GAP:\nDeaf and hard-of-hearing citizens struggle to communicate at ticket counters, pharmacies, and government offices because sign language interpreters are scarce and frontline staff cannot sign.\n\n• THE CHALLENGE (24-HR FEASIBILITY):\nBuild a webcam tool that tracks hand landmarks using MediaPipe, recognizes 15 to 25 core ISL gestures (numbers plus words like help, ticket, water, where, money, thank you) using a classifier trained on a dataset the team records themselves, and instantly displays the recognized word and speaks it aloud using text-to-speech.\n\n• SCOPE GUIDANCE:\nOne gesture at a time; no continuous signing or sentence-level grammar. Record 50 to 100 samples per gesture with 2 to 3 team members as a self-built dataset under varied lighting. Standard laptop webcam. Include a short note acknowledging regional ISL variation.\n\n• SOLUTION DIRECTIONS:\n• Landmark Feature Extraction: MediaPipe hand landmarks and finger angles per frame.\n• Gesture Classifier: RandomForest / kNN / small LSTM over landmark sequences with hold detection.\n• Instant Speech Output: Show the recognized word and speak it via text-to-speech in English or one regional language.\n\n• ANTI-GOALS:\n• Two-way translation\n• Full ISL grammar or continuous sentence recognition\n• Regional dialect coverage\n• Signing avatars\n\n• JUDGING CRITERIA:\n• Recognition accuracy on held-out gestures (45%)\n• Recognition latency (25%)\n• UI clarity for counter staff (30%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, MediaPipe, OpenCV, scikit-learn, gTTS, Streamlit / React",
    "requirements": [
      "Dynamic Hand Landmark Tracking: 21-point MediaPipe hand landmark tracking without wearable gloves.",
      "Sign-to-Speech Conversion: Translate sign gestures into fluid spoken audio via browser speech synthesis.",
      "Reverse Translation: Listen to counter speech and render corresponding sign gesture cards or animated avatar."
    ],
    "constraints": [
      "Translating every nuanced regional sign language dialect.",
      "Building custom 3D Hollywood-level avatar animations.",
      "Requiring specialized infrared depth cameras (like Leap Motion)."
    ],
    "domain": "Artificial Intelligence & Machine Learning",
    "difficulty": "Medium",
    "technologies": [
      "MediaPipe Hands",
      "Holistic",
      "OpenCV",
      "Python",
      "JavaScript",
      "Web Speech API",
      "React",
      "Tailwind CSS"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-AI-06",
    "title": "SignAvatar Lite: Text-to-Sign Visual Reply Player (Core Vocabulary)",
    "description": "Develop an interactive, bidirectional camera communication bridge that tracks hand and facial landmarks to translate live Indian Sign Language gestures into spoken audio/text, and converts the clerk's spoken responses back into animated/visual sign sequences.",
    "background": "Over 18 million hearing and speech-impaired individuals in India struggle daily at railway ticket windows, banks, and post offices due to the absence of sign language interpreters. Existing translator apps are static dictionary lookup tables that require typing, defeating the purpose of seamless face-to-face conversation.",
    "expectedSolution": "SIGNAVATAR LITE: TEXT-TO-SIGN VISUAL REPLY PLAYER FOR A CORE VOCABULARY\nProblem Statement ID: KARE-AI-06 | Domain: Artificial Intelligence and Machine Learning\n\n• THE CORE QUESTION:\nHow can a frontline clerk's typed reply be conveyed visually in sign language for a deaf citizen using a small recorded vocabulary?\n\n• THE PROBLEM GAP:\nCommunication at public counters fails in both directions: even when a deaf citizen is understood, hearing staff have no way to reply in sign, leaving the interaction incomplete.\n\n• THE CHALLENGE (24-HR FEASIBILITY):\nBuild a web tool where the clerk types a reply or picks from quick phrases (e.g., Platform 5, 200 rupees, come tomorrow); the system maps each word to a short pre-recorded sign video clip recorded by the team and plays the sequence, so the deaf citizen can watch the reply in sign.\n\n• SCOPE GUIDANCE:\nSame 15 to 25 word core vocabulary as the sign-to-speech direction. Clips are pre-recorded and played in sequence; no grammar-level sign synthesis. Text input or Web Speech API dictation only; no camera needed on this side.\n\n• SOLUTION DIRECTIONS:\n• Quick-Phrase Keyboard: One-tap common counter replies.\n• Word-to-Clip Mapping Engine: JSON dictionary with fallback text display for missing words.\n• Sequenced Playback View: Replay, pause, and speed control on the citizen's screen.\n\n• ANTI-GOALS:\n• Full machine translation into ISL grammar\n• Photorealistic signing avatars\n• Automated two-way conversation\n\n• JUDGING CRITERIA:\n• Vocabulary coverage and mapping logic (40%)\n• Playback clarity and sequencing (35%)\n• Clerk usability (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nReact / Next.js, HTML5 Video, Web Speech API (optional), JSON",
    "requirements": [
      "Dynamic Hand Landmark Tracking: 21-point MediaPipe hand landmark tracking without wearable gloves.",
      "Sign-to-Speech Conversion: Translate sign gestures into fluid spoken audio via browser speech synthesis.",
      "Reverse Translation: Listen to counter speech and render corresponding sign gesture cards or animated avatar."
    ],
    "constraints": [
      "Translating every nuanced regional sign language dialect.",
      "Building custom 3D Hollywood-level avatar animations.",
      "Requiring specialized infrared depth cameras (like Leap Motion)."
    ],
    "domain": "Artificial Intelligence & Machine Learning",
    "difficulty": "Medium",
    "technologies": [
      "MediaPipe Hands",
      "Holistic",
      "OpenCV",
      "Python",
      "JavaScript",
      "Web Speech API",
      "React",
      "Tailwind CSS"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-AI-07",
    "title": "SafeFleet: Driver Drowsiness, Yawning & Distraction Warning Sentinel",
    "description": "Build a lightweight, webcam-based driver safety companion that monitors facial landmarks in real time, computes Eye Aspect Ratio (EAR) and Mouth Aspect Ratio (MAR) to detect microsleeps, continuous yawning, and distraction (looking away), triggering escalating audio alarms.",
    "background": "Driver fatigue and microsleeps cause over 30% of nighttime commercial vehicle crashes. Traditional hardware setups require expensive steering sensors or infrared eye trackers that transport operators cannot afford. Simple timer reminders ignore the driver's actual physical condition and fail to act during critical microsleep moments.",
    "expectedSolution": "SAFEFLEET: DRIVER DROWSINESS, YAWNING & DISTRACTION WARNING SENTINEL\nProblem Statement ID: KARE-AI-07 | Domain: Artificial Intelligence & Machine Learning\n\n• THE CORE QUESTION:\nHow can non-intrusive edge computer vision prevent fatal highway collisions by detecting driver fatigue seconds before a crash?\n\n• THE PROBLEM GAP:\nDriver fatigue and microsleeps cause over 30% of nighttime commercial vehicle crashes. Traditional hardware setups require expensive steering sensors or infrared eye trackers that transport operators cannot afford. Simple timer reminders ignore the driver's actual physical condition and fail to act during critical microsleep moments.\n\n• THE CHALLENGE:\nBuild a lightweight, webcam-based driver safety companion that monitors facial landmarks in real time, computes Eye Aspect Ratio (EAR) and Mouth Aspect Ratio (MAR) to detect microsleeps, continuous yawning, and distraction (looking away), triggering escalating audio alarms.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nRun the system on a standard laptop webcam. Simulated sleep (closing eyes for >2 seconds), yawning, and turning heads should trigger the alerts reliably under variable lighting conditions.\n\n• SOLUTION DIRECTIONS:\n• Real-Time Facial Geometric Ratios: Compute 68-point landmarks to calculate eye aspect ratio dynamically.\n• Adaptive Fatigue Thresholding: Account for individual natural eye blink baselines.\n• Escalating Audio Intervention: Trigger loud audio sirens and visual dashboard flashers upon sustained closure.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Building automotive CAN-bus hardware telemetry.\n• Requiring bulky VR headsets or infrared glasses.\n• Collecting GPS route tracking data instead of focusing on driver vision.\n\n• JUDGING CRITERIA:\n• Fatigue & Yawn Detection Responsiveness (40%)\n• Zero-Lag Real-Time FPS Performance (35%)\n• User Interface & Alarm Escalation Logic (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, OpenCV, MediaPipe FaceMesh / Dlib, NumPy, Pygame Audio, Flask / Streamlit",
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
    "domain": "Artificial Intelligence & Machine Learning",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "OpenCV",
      "MediaPipe FaceMesh",
      "Dlib",
      "NumPy",
      "Pygame Audio",
      "Flask",
      "Streamlit"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-AI-08",
    "title": "LegalBrief AI: RAG-Powered Legal Contract Risk & Hidden Clause Analyzer",
    "description": "Develop an intelligent legal contract analyzer that parses legal PDF documents, uses Retrieval-Augmented Generation (RAG) against a knowledge base of fair contracting principles, and produces a clause-by-clause risk scorecard highlighting hostile terms in plain English.",
    "background": "Freelancers, gig workers, and startup founders routinely sign 20-page service agreements and vendor contracts without legal counsel. Hidden indemnity clauses, non-compete locks, and unilateral termination terms expose them to severe financial jeopardy. Standard chatbot summaries miss subtle legal loopholes and fail to explain why a clause is dangerous.",
    "expectedSolution": "LEGALBRIEF AI: RAG-POWERED LEGAL CONTRACT RISK & HIDDEN CLAUSE ANALYZER\nProblem Statement ID: KARE-AI-08 | Domain: Artificial Intelligence & Machine Learning\n\n• THE CORE QUESTION:\nHow can generative AI make legal contracts instantly transparent, identifying hostile liabilities and one-sided clauses for non-lawyers?\n\n• THE PROBLEM GAP:\nFreelancers, gig workers, and startup founders routinely sign 20-page service agreements and vendor contracts without legal counsel. Hidden indemnity clauses, non-compete locks, and unilateral termination terms expose them to severe financial jeopardy. Standard chatbot summaries miss subtle legal loopholes and fail to explain why a clause is dangerous.\n\n• THE CHALLENGE:\nDevelop an intelligent legal contract analyzer that parses legal PDF documents, uses Retrieval-Augmented Generation (RAG) against a knowledge base of fair contracting principles, and produces a clause-by-clause risk scorecard highlighting hostile terms in plain English.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nTeams do not need a full legal library. Ingest sample freelance, NDA, or employment agreements. Emphasize semantic search over text chunks, clear categorization of risks (Red, Amber, Green), and actionable renegotiation suggestions.\n\n• SOLUTION DIRECTIONS:\n• Automated Clause Extraction: Segment contract into indemnification, liability, termination, and IP clauses.\n• Risk Scorecard & Plain-English Breakdown: Explain why a clause is unfavorable and suggest balanced wording.\n• Interactive Clause Q&A: Allow users to ask specific questions ('Can the client terminate without pay?').\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Providing certified legal advice or replacing practicing attorneys.\n• Building a legal CRM or billing platform.\n• Generic document chat that does not actively evaluate risk.\n\n• JUDGING CRITERIA:\n• Accuracy of Legal Risk Identification (45%)\n• Quality & Clarity of Plain-English Explanations (35%)\n• Interface Design & Document Navigation (20%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, LangChain / LlamaIndex, FAISS / ChromaDB, HuggingFace Transformers / Groq API, Next.js / React",
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
    "domain": "Artificial Intelligence & Machine Learning",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "LangChain",
      "LlamaIndex",
      "FAISS",
      "ChromaDB",
      "HuggingFace Transformers",
      "Groq API",
      "Next.js",
      "React"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-AI-09",
    "title": "LiveFace: Interactive Face Liveness & Anti-Spoof Authentication",
    "description": "Design an interactive face liveness detection module that issues random micro-challenges to the user (e.g., blink twice, smile, turn head 30 degrees right) while running frequency texture analysis to detect screen glare, moiré patterns, and printed paper edges.",
    "background": "With remote video KYC and biometric exams becoming ubiquitous, presentation attacks have surged. Fraudsters hold high-definition tablet screens or curved color printouts in front of webcams to pass attendance and authentication. Static face recognition verifies identity but fails completely at verifying physical liveness.",
    "expectedSolution": "LIVEFACE: INTERACTIVE FACE LIVENESS & ANTI-SPOOF AUTHENTICATION\nProblem Statement ID: KARE-AI-09 | Domain: Artificial Intelligence & Machine Learning\n\n• THE CORE QUESTION:\nHow can biometric verification prove a user is physically present without being tricked by high-resolution smartphone screens or printed photos?\n\n• THE PROBLEM GAP:\nWith remote video KYC and biometric exams becoming ubiquitous, presentation attacks have surged. Fraudsters hold high-definition tablet screens or curved color printouts in front of webcams to pass attendance and authentication. Static face recognition verifies identity but fails completely at verifying physical liveness.\n\n• THE CHALLENGE:\nDesign an interactive face liveness detection module that issues random micro-challenges to the user (e.g., blink twice, smile, turn head 30 degrees right) while running frequency texture analysis to detect screen glare, moiré patterns, and printed paper edges.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nFocus on detecting 2D presentation attacks (holding up a phone or photo). Implement a reliable challenge-response protocol and basic texture/micro-movement heuristics rather than training multi-modal 3D mesh neural nets from scratch.\n\n• SOLUTION DIRECTIONS:\n• Dynamic Challenge Sequencer: Issue randomized instructions that pre-recorded videos cannot predict.\n• Texture & Reflection Analysis: Detect high-frequency screen pixels, device borders, and paper curvature.\n• Seamless Verification State Machine: Pass or fail within 4-6 seconds with actionable user feedback.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Large-scale identity database matching (1:N search).\n• Requiring specialized 3D depth sensors (iPhone TrueDepth).\n• High-latency server-side batch analysis.\n\n• JUDGING CRITERIA:\n• Anti-Spoofing Robustness against Screen/Photo Replay (45%)\n• Verification Speed & Low Latency (30%)\n• User Guidance & Interactive Challenge Flow (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nOpenCV, MediaPipe FaceMesh, NumPy, SciPy (FFT / Texture), Flask / FastAPI, React",
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
    "domain": "Artificial Intelligence & Machine Learning",
    "difficulty": "Medium",
    "technologies": [
      "OpenCV",
      "MediaPipe FaceMesh",
      "NumPy",
      "SciPy (FFT",
      "Texture)",
      "Flask",
      "FastAPI",
      "React"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-AI-10",
    "title": "SmartScribe: Doctor-Patient Conversation Summarizer & Prescription Generator",
    "description": "Create an ambient clinical assistant that listens to audio recordings of doctor-patient consultations, automatically separates clinical facts from conversational banter, and extracts Chief Complaints, Symptoms, Diagnoses, and Prescribed Medications into a clean, printable medical prescription PDF.",
    "background": "Doctors spend nearly 40% of their working hours typing clinical notes into electronic health record systems. This administrative burnout degrades doctor-patient communication and leads to incomplete records. Existing medical dictation tools require rigid voice commands and cannot extract structured insights from natural human dialogue.",
    "expectedSolution": "SMARTSCRIBE: DOCTOR-PATIENT CONVERSATION SUMMARIZER & PRESCRIPTION GENERATOR\nProblem Statement ID: KARE-AI-10 | Domain: Artificial Intelligence & Machine Learning\n\n• THE CORE QUESTION:\nHow can ambient conversational AI liberate healthcare providers from screens and keyboards during clinical consultations?\n\n• THE PROBLEM GAP:\nDoctors spend nearly 40% of their working hours typing clinical notes into electronic health record systems. This administrative burnout degrades doctor-patient communication and leads to incomplete records. Existing medical dictation tools require rigid voice commands and cannot extract structured insights from natural human dialogue.\n\n• THE CHALLENGE:\nCreate an ambient clinical assistant that listens to audio recordings of doctor-patient consultations, automatically separates clinical facts from conversational banter, and extracts Chief Complaints, Symptoms, Diagnoses, and Prescribed Medications into a clean, printable medical prescription PDF.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nTeams can simulate consultations using synthetic dialogue audio or open clinical consultation datasets (e.g., MTSamples). Focus on natural language entity recognition (symptoms, drugs, dosages) and clinical summary structuring rather than real-time speech recognition optimization.\n\n• SOLUTION DIRECTIONS:\n• Ambient Conversation Ingestion: Transcribe raw consultation dialogue containing medical terminology.\n• Clinical Named Entity Recognition: Identify medications, dosages, duration, symptoms, and dietary advice.\n• Structured Prescription Generation: Export a standardized digital prescription ready for doctor sign-off.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Autonomous diagnosis without doctor intervention.\n• Complex hospital inventory billing integration.\n• Requiring clinical EHR software deployment.\n\n• JUDGING CRITERIA:\n• Extraction Accuracy for Clinical Entities (40%)\n• Quality & Structure of Medical Summary (35%)\n• Doctor Review & Editing Experience (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nWhisper API / VOSK, spaCy (scispaCy / NER), ReportLab / jsPDF, Python, Next.js / Tailwind CSS",
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
    "domain": "Artificial Intelligence & Machine Learning",
    "difficulty": "Medium",
    "technologies": [
      "Whisper API",
      "VOSK",
      "spaCy (scispaCy",
      "NER)",
      "ReportLab",
      "jsPDF",
      "Python",
      "Next.js",
      "Tailwind CSS"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SEC-01",
    "title": "PhishGuard: Intelligent Email Threat Hunter & Header Geolocation Analyzer",
    "description": "Build an automated email security triage tool that accepts uploaded .eml files or pasted headers, parses RFC 822 routing headers, validates SPF/DKIM/DMARC alignment, traces relay IP geolocation on a world map, and scans body content for deceptive psychological triggers and suspicious URLs.",
    "background": "Spear-phishing remains the primary initial attack vector for over 85% of corporate ransomware breaches. Modern attackers forge display names, leverage open redirect URLs, and exploit misconfigured SPF/DMARC records. Standard mail clients provide no visibility into message headers, leaving users unable to assess risk.",
    "expectedSolution": "PHISHGUARD: INTELLIGENT EMAIL THREAT HUNTER & HEADER GEOLOCATION ANALYZER\nProblem Statement ID: KARE-SEC-01 | Domain: Cybersecurity & Blockchain\n\n• THE CORE QUESTION:\nHow can an automated email analyzer uncover hidden spoofing, malicious attachments, and weaponized URLs before an employee clicks?\n\n• THE PROBLEM GAP:\nSpear-phishing remains the primary initial attack vector for over 85% of corporate ransomware breaches. Modern attackers forge display names, leverage open redirect URLs, and exploit misconfigured SPF/DMARC records. Standard mail clients provide no visibility into message headers, leaving users unable to assess risk.\n\n• THE CHALLENGE:\nBuild an automated email security triage tool that accepts uploaded .eml files or pasted headers, parses RFC 822 routing headers, validates SPF/DKIM/DMARC alignment, traces relay IP geolocation on a world map, and scans body content for deceptive psychological triggers and suspicious URLs.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nUse open sample phishing email corpora (e.g., Enron/SpamAssassin datasets or custom simulated phishing emails). Emphasize header parsing, cryptographic signature validation status, and threat score explainability.\n\n• SOLUTION DIRECTIONS:\n• Header Integrity Parser: Validate SPF, DKIM, and DMARC alignment against the envelope sender.\n• Visual IP Relay Hop Map: Plot intermediate mail transfer agents across countries to highlight anomalous routes.\n• Content & URL Risk Engine: Flag lookalike domains, shortened URLs, and high-pressure social engineering keywords.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Replacing enterprise email gateways (like Proofpoint/Mimecast).\n• Building a full-fledged email client with inbox sync.\n• Launching offensive brute-force credential attacks.\n\n• JUDGING CRITERIA:\n• Forensic Header Parsing & Integrity Verification (40%)\n• Threat Scoring Logic & Geolocation Visualization (35%)\n• Usability & Speed of Triage Report (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, email/mailbox module, MaxMind GeoIP / IP-API, BeautifulSoup, React, Leaflet.js, FastAPI",
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
    "domain": "Cybersecurity & Blockchain",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "email",
      "mailbox module",
      "MaxMind GeoIP",
      "IP-API",
      "BeautifulSoup",
      "React",
      "Leaflet.js",
      "FastAPI"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SEC-02",
    "title": "TrustDegree: Soulbound NFT-Based Academic Credential Verification Platform",
    "description": "Develop a decentralized academic credential platform on an EVM-compatible testnet (Polygon/Sepolia) where authorized institutions issue non-transferable Soulbound Tokens (SBTs) representing degrees to student wallet addresses, accompanied by a public QR verification portal for employers.",
    "background": "Degree forgery and certificate mills undermine academic trust, forcing employers to hire third-party background check agencies that take 3-6 weeks per verification. Paper certificates and simple digital PDFs are trivial to modify in image editors, while centralized university databases face single-point-of-failure vulnerabilities and downtime.",
    "expectedSolution": "TRUSTDEGREE: SOULBOUND NFT-BASED ACADEMIC CREDENTIAL VERIFICATION PLATFORM\nProblem Statement ID: KARE-SEC-02 | Domain: Cybersecurity & Blockchain\n\n• THE CORE QUESTION:\nHow can decentralized ledger technology permanently eliminate degree certificate forgery and streamline instant worldwide employment checks?\n\n• THE PROBLEM GAP:\nDegree forgery and certificate mills undermine academic trust, forcing employers to hire third-party background check agencies that take 3-6 weeks per verification. Paper certificates and simple digital PDFs are trivial to modify in image editors, while centralized university databases face single-point-of-failure vulnerabilities and downtime.\n\n• THE CHALLENGE:\nDevelop a decentralized academic credential platform on an EVM-compatible testnet (Polygon/Sepolia) where authorized institutions issue non-transferable Soulbound Tokens (SBTs) representing degrees to student wallet addresses, accompanied by a public QR verification portal for employers.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nDeploy on a testnet. The key is proving non-transferability (preventing students from selling or sending their degree NFT to others), metadata hashing on IPFS, and a 1-click mobile verification view that displays credential legitimacy in seconds.\n\n• SOLUTION DIRECTIONS:\n• Soulbound Smart Contract (ERC-5192 / Custom): Restrict token transfers to enforce permanent owner binding.\n• Decentralized Storage (IPFS): Pin academic transcript metadata, student details, and cryptographic hashes.\n• Instant Verifier Portal: Scan resume QR codes to instantly validate issuer public key and certificate status.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Storing raw confidential student personal data directly on public blockchains.\n• Monetizing certificates or building an NFT trading marketplace.\n• Writing custom cryptographic consensus protocols.\n\n• JUDGING CRITERIA:\n• Smart Contract Architecture & Security (40%)\n• Non-Transferability & IPFS Integration (30%)\n• Employer Verification Workflow (30%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nSolidity, Polygon Amoy Testnet, Hardhat / Foundry, Ethers.js, IPFS / Pinata, Next.js / React",
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
    "domain": "Cybersecurity & Blockchain",
    "difficulty": "Medium",
    "technologies": [
      "Solidity",
      "Polygon Amoy Testnet",
      "Hardhat",
      "Foundry",
      "Ethers.js",
      "IPFS",
      "Pinata",
      "Next.js",
      "React"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SEC-03",
    "title": "CryptoTrace: Multi-Hop Crypto Wallet Fund Flow & Money Laundering Visualizer",
    "description": "Create an automated blockchain intelligence visualizer that takes a suspect wallet address, queries public blockchain APIs (Ethereum/Bitcoin), recursively maps transaction flows across up to 3 hops, and highlights anomalous fund splitting and interactions with known exchange deposit wallets.",
    "background": "Criminal syndicates operating ransomware, investment scams, and cyber extortion rapidly route stolen cryptocurrency through peeling chains and mixer wallets across multiple hops. Investigating officers cannot track these transactions through standard block explorers, as reading tabular transaction lists with hundreds of hex addresses is nearly impossible.",
    "expectedSolution": "CRYPTOTRACE: MULTI-HOP CRYPTO WALLET FUND FLOW & MONEY LAUNDERING VISUALIZER\nProblem Statement ID: KARE-SEC-03 | Domain: Cybersecurity & Blockchain\n\n• THE CORE QUESTION:\nHow can visual graph intelligence untangle complex multi-wallet crypto dispersals and identify when illicit funds enter exchange off-ramps?\n\n• THE PROBLEM GAP:\nCriminal syndicates operating ransomware, investment scams, and cyber extortion rapidly route stolen cryptocurrency through peeling chains and mixer wallets across multiple hops. Investigating officers cannot track these transactions through standard block explorers, as reading tabular transaction lists with hundreds of hex addresses is nearly impossible.\n\n• THE CHALLENGE:\nCreate an automated blockchain intelligence visualizer that takes a suspect wallet address, queries public blockchain APIs (Ethereum/Bitcoin), recursively maps transaction flows across up to 3 hops, and highlights anomalous fund splitting and interactions with known exchange deposit wallets.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nUse public testnet transactions or mainnet transaction histories via free APIs (Etherscan, Blockstream, Alchemy). Focus on graph generation (nodes as wallets, edges as transactions with amounts) and identifying clustering behaviors.\n\n• SOLUTION DIRECTIONS:\n• Recursive Transaction Graph Generation: Expand outgoing and incoming transactions into a directed graph.\n• Rapid Dispersal & Peel Chain Detection: Highlight wallets that immediately forward identical funds to split addresses.\n• Centralized Exchange Attribution: Flag transactions that terminate at known Binance/Coinbase hot wallets.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Cracking private keys or seed phrases.\n• Performing deanonymization through dark web hacking.\n• Re-indexing the entire multi-terabyte Ethereum blockchain locally.\n\n• JUDGING CRITERIA:\n• Graph Visualization & Multi-Hop Navigation (45%)\n• Heuristic Identification of Laundering Patterns (30%)\n• Performance & API Throttling Handling (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, Web3.py / Etherscan API, NetworkX, Cytoscape.js / D3.js, FastAPI, React / Tailwind CSS",
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
    "domain": "Cybersecurity & Blockchain",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "Web3.py",
      "Etherscan API",
      "NetworkX",
      "Cytoscape.js",
      "D3.js",
      "FastAPI",
      "React",
      "Tailwind CSS"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SEC-04",
    "title": "DataMask: Automated Document PII Redaction & Leak Prevention Sentinel",
    "description": "Build a privacy-preserving document sanitizer that scans uploaded PDF and image documents, employs regular expressions and Named Entity Recognition (NER) to detect sensitive personal identifiers, and produces an irreversibly flattened, redacted document with permanent blacked-out bounding boxes.",
    "background": "Government departments, universities, and legal registries frequently publish public PDF circulars, results, and case files containing unredacted national identification numbers, phone numbers, home addresses, and bank accounts. Black marker redactions or layered PDFs often fail, allowing attackers to select and copy the text hidden beneath.",
    "expectedSolution": "DATAMASK: AUTOMATED DOCUMENT PII REDACTION & LEAK PREVENTION SENTINEL\nProblem Statement ID: KARE-SEC-04 | Domain: Cybersecurity & Blockchain\n\n• THE CORE QUESTION:\nHow can public institutions publish digital notices and gazettes without accidentally leaking citizen identity numbers and financial data?\n\n• THE PROBLEM GAP:\nGovernment departments, universities, and legal registries frequently publish public PDF circulars, results, and case files containing unredacted national identification numbers, phone numbers, home addresses, and bank accounts. Black marker redactions or layered PDFs often fail, allowing attackers to select and copy the text hidden beneath.\n\n• THE CHALLENGE:\nBuild a privacy-preserving document sanitizer that scans uploaded PDF and image documents, employs regular expressions and Named Entity Recognition (NER) to detect sensitive personal identifiers, and produces an irreversibly flattened, redacted document with permanent blacked-out bounding boxes.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nSupport standard scanned and text-based PDFs. The system must physically remove text streams and render redacted areas as permanent pixels, ensuring that no underlying text can be recovered through copy-paste or PDF text extractors.\n\n• SOLUTION DIRECTIONS:\n• Multi-Modal PII Extraction: Detect citizen IDs, phone numbers, email addresses, and bank IFSC numbers.\n• Permanent Rasterized Redaction: Burn solid black blocks directly into rendered page images.\n• Dual-View Compliance Auditor: Provide side-by-side view showing detected entities and sanitized preview.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Simple CSS black overlay that leaves underlying text in the PDF file.\n• Complex enterprise DLP policy engines with thousands of enterprise rules.\n• Manual redacting of every individual word.\n\n• JUDGING CRITERIA:\n• Redaction Irreversibility & Security (40%)\n• Detection Accuracy for PII Entities (35%)\n• Document Formatting Preservation & UX (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, PyPDF, pdfplumber, Tesseract OCR, spaCy (NER), Streamlit / React, ReportLab",
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
    "domain": "Cybersecurity & Blockchain",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "PyPDF",
      "pdfplumber",
      "Tesseract OCR",
      "spaCy (NER)",
      "Streamlit",
      "React",
      "ReportLab"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SEC-05",
    "title": "NetSentry: Live Network Traffic Anomaly & DDoS Mitigation Sentinel",
    "description": "Develop an automated network traffic monitoring engine that ingests PCAP log streams or synthetic packet feeds, extracts statistical features (packet arrival rate, protocol entropy, SYN/ACK ratios), and runs an anomaly detection model to flag attacks and dynamically output firewall block rules.",
    "background": "Cloud servers and campus intranets are subjected to constant automated port scanning, SSH brute force attacks, and volumetric DDoS floods. Traditional firewalls rely on static IP blacklists, which fail against rotating residential proxies and newly orchestrated botnets.",
    "expectedSolution": "NETSENTRY: LIVE NETWORK TRAFFIC ANOMALY & DDOS MITIGATION SENTINEL\nProblem Statement ID: KARE-SEC-05 | Domain: Cybersecurity & Blockchain\n\n• THE CORE QUESTION:\nHow can behavioral packet analytics detect network intrusion scans and distributed denial-of-service floods before servers collapse?\n\n• THE PROBLEM GAP:\nCloud servers and campus intranets are subjected to constant automated port scanning, SSH brute force attacks, and volumetric DDoS floods. Traditional firewalls rely on static IP blacklists, which fail against rotating residential proxies and newly orchestrated botnets.\n\n• THE CHALLENGE:\nDevelop an automated network traffic monitoring engine that ingests PCAP log streams or synthetic packet feeds, extracts statistical features (packet arrival rate, protocol entropy, SYN/ACK ratios), and runs an anomaly detection model to flag attacks and dynamically output firewall block rules.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nUse benchmark intrusion datasets (NSL-KDD, CIC-IDS2017) or simulated live Scapy packet streams. Focus on distinguishing normal web browsing traffic from SYN floods and port sweeps.\n\n• SOLUTION DIRECTIONS:\n• Statistical Flow Feature Extraction: Calculate rolling packet velocity, average payload size, and TCP flag distribution.\n• Unsupervised Anomaly Detection: Train an Isolation Forest / One-Class SVM to flag traffic outliers.\n• Automated Mitigation Output: Generate live iptables commands and visual bandwidth spike warnings.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Building a multi-gigabit hardware packet inspection appliance.\n• Deep packet inspection of encrypted TLS payloads.\n• Performing offensive network attacks on external targets.\n\n• JUDGING CRITERIA:\n• Anomaly Detection Precision & Low False Positives (40%)\n• Live Dashboard Visualization & Flow Metrics (35%)\n• Mitigation Rule Generation & Code Quality (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, Scapy, Scikit-learn, Pandas, Dash / Streamlit / React, FastAPI, CIC-IDS dataset samples",
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
    "domain": "Cybersecurity & Blockchain",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "Scapy",
      "Scikit-learn",
      "Pandas",
      "Dash",
      "Streamlit",
      "React",
      "FastAPI",
      "CIC-IDS dataset samples"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SEC-06",
    "title": "VulnHunter: Automated Web Application Security Fuzzer & Vulnerability Scanner",
    "description": "Build a lightweight, automated web application vulnerability fuzzer that takes a local or staging URL, crawls endpoints and form inputs, injects non-destructive security payloads, and produces an actionable vulnerability remediation scorecard.",
    "background": "Developers frequently deploy web applications with critical vulnerabilities such as SQL injection, cross-site scripting (XSS), and exposed administrative files (.git, .env). Commercial enterprise vulnerability scanners (Qualys, Nessus) are expensive, complex, and heavy, while manual penetration testing cannot scale to continuous deployments.",
    "expectedSolution": "VULNHUNTER: AUTOMATED WEB APPLICATION SECURITY FUZZER & VULNERABILITY SCANNER\nProblem Statement ID: KARE-SEC-06 | Domain: Cybersecurity & Blockchain\n\n• THE CORE QUESTION:\nHow can student and startup web applications be continuously audited for critical OWASP Top 10 vulnerabilities before production deployment?\n\n• THE PROBLEM GAP:\nDevelopers frequently deploy web applications with critical vulnerabilities such as SQL injection, cross-site scripting (XSS), and exposed administrative files (.git, .env). Commercial enterprise vulnerability scanners (Qualys, Nessus) are expensive, complex, and heavy, while manual penetration testing cannot scale to continuous deployments.\n\n• THE CHALLENGE:\nBuild a lightweight, automated web application vulnerability fuzzer that takes a local or staging URL, crawls endpoints and form inputs, injects non-destructive security payloads, and produces an actionable vulnerability remediation scorecard.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nTest against intentionally vulnerable web applications (DVWA, Juice Shop, or a custom test Flask app). Focus on detecting SQLi error reflection, Reflected XSS execution proof, and sensitive endpoint discovery (.env, /admin).\n\n• SOLUTION DIRECTIONS:\n• Automated Endpoint & Form Crawler: Extract all `<form>` action parameters, query strings, and routes.\n• Payload Injection Engine: Test parameterized payloads for SQL syntax errors and HTML script reflection.\n• Actionable Developer Report: Detail exact reproduction steps, affected URLs, and code-level remediation advice.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Destructive hacking (database dropping, website defacement).\n• Brute-forcing production third-party websites without permission.\n• Exhaustive scanning that takes hours to complete.\n\n• JUDGING CRITERIA:\n• Vulnerability Detection Accuracy without False Positives (40%)\n• Safe Fuzzing Execution & Reporting Clarity (35%)\n• Crawler Depth & Form Handling (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, Requests, BeautifulSoup4, SQLite, Tailwind CSS, Flask / Node.js",
    "requirements": [
      "Automated Endpoint & Form Crawler: Extract all `<form>` action parameters, query strings, and routes.",
      "Payload Injection Engine: Test parameterized payloads for SQL syntax errors and HTML script reflection.",
      "Actionable Developer Report: Detail exact reproduction steps, affected URLs, and code-level remediation advice."
    ],
    "constraints": [
      "Destructive hacking (database dropping, website defacement).",
      "Brute-forcing production third-party websites without permission.",
      "Exhaustive scanning that takes hours to complete."
    ],
    "domain": "Cybersecurity & Blockchain",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "Requests",
      "BeautifulSoup4",
      "SQLite",
      "Tailwind CSS",
      "Flask",
      "Node.js"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SEC-07",
    "title": "RapidTriage: Endpoint Incident Response & Digital Forensic Timeline Extractor",
    "description": "Create a portable forensic triage script that runs on an endpoint, extracts key volatile artifacts (browser SQLite history, USB insertion registry keys, recently executed programs via UserAssist/Prefetch, and active network connections), and visualizes a unified chronological incident timeline.",
    "background": "When a corporate workstation or lab PC is suspected of infection, incident responders must quickly understand what occurred: what files were downloaded, what USB drives were inserted, and what commands were executed. Manually opening Windows Event Viewer, registry hives, and browser databases takes hours, during which malware may erase evidence.",
    "expectedSolution": "RAPIDTRIAGE: ENDPOINT INCIDENT RESPONSE & DIGITAL FORENSIC TIMELINE EXTRACTOR\nProblem Statement ID: KARE-SEC-07 | Domain: Cybersecurity & Blockchain\n\n• THE CORE QUESTION:\nHow can a first responder reconstruct the timeline of an endpoint cyber compromise in under 3 minutes without tampering with evidence?\n\n• THE PROBLEM GAP:\nWhen a corporate workstation or lab PC is suspected of infection, incident responders must quickly understand what occurred: what files were downloaded, what USB drives were inserted, and what commands were executed. Manually opening Windows Event Viewer, registry hives, and browser databases takes hours, during which malware may erase evidence.\n\n• THE CHALLENGE:\nCreate a portable forensic triage script that runs on an endpoint, extracts key volatile artifacts (browser SQLite history, USB insertion registry keys, recently executed programs via UserAssist/Prefetch, and active network connections), and visualizes a unified chronological incident timeline.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nSimulate endpoint artifacts on a local machine or process sample registry and browser database files. Focus on timeline reconstruction and highlighting anomalous activities (e.g. executable launched from temp directory after suspicious download).\n\n• SOLUTION DIRECTIONS:\n• Multi-Artifact Parser: Parse SQLite history from Chrome/Firefox, USB serial keys, and execution logs.\n• Chronological Incident Timeline: Assemble events from multiple sources into a single navigable timeline.\n• Suspicious Activity Highlighting: Flag processes running from `%AppData%` or execution right after download.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Complex kernel-level memory dump acquisition (Volatility).\n• Bypassing administrative permissions or writing malicious rootkits.\n• Encrypted file system cracking.\n\n• JUDGING CRITERIA:\n• Timeline Correlation & Artifact Extraction Accuracy (45%)\n• Forensic Integrity & Non-Destructive Operation (30%)\n• Dashboard Clarity & Filterability (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, SQLite3, OS / psutil / winreg, Chart.js, HTML5 / Flask / Streamlit",
    "requirements": [
      "Multi-Artifact Parser: Parse SQLite history from Chrome/Firefox, USB serial keys, and execution logs.",
      "Chronological Incident Timeline: Assemble events from multiple sources into a single navigable timeline.",
      "Suspicious Activity Highlighting: Flag processes running from `%AppData%` or execution right after download."
    ],
    "constraints": [
      "Complex kernel-level memory dump acquisition (Volatility).",
      "Bypassing administrative permissions or writing malicious rootkits.",
      "Encrypted file system cracking."
    ],
    "domain": "Cybersecurity & Blockchain",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "SQLite3",
      "OS",
      "psutil",
      "winreg",
      "Chart.js",
      "HTML5",
      "Flask",
      "Streamlit"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SEC-08",
    "title": "AgriLedger: Farm-to-Fork Transparent Organic Produce Provenance DApp",
    "description": "Develop an end-to-end decentralized food provenance application on an EVM testnet where certified farmers log harvest batches, licensed labs upload verifiable pesticide-free test certificates to IPFS, and consumers scan packaging QR codes to view the immutable lifecycle.",
    "background": "Organic food markets command a 30-50% price premium, creating an enormous incentive for unscrupulous suppliers to label conventionally grown, pesticide-treated crops as 'organic.' Centralized certification paper labels are easily forged, and consumers have no verifiable proof of farm origin or chemical residue testing.",
    "expectedSolution": "AGRILEDGER: FARM-TO-FORK TRANSPARENT ORGANIC PRODUCE PROVENANCE DAPP\nProblem Statement ID: KARE-SEC-08 | Domain: Cybersecurity & Blockchain\n\n• THE CORE QUESTION:\nHow can consumers be guaranteed that organic produce is truly authentic, unadulterated, and sustainably cultivated?\n\n• THE PROBLEM GAP:\nOrganic food markets command a 30-50% price premium, creating an enormous incentive for unscrupulous suppliers to label conventionally grown, pesticide-treated crops as 'organic.' Centralized certification paper labels are easily forged, and consumers have no verifiable proof of farm origin or chemical residue testing.\n\n• THE CHALLENGE:\nDevelop an end-to-end decentralized food provenance application on an EVM testnet where certified farmers log harvest batches, licensed labs upload verifiable pesticide-free test certificates to IPFS, and consumers scan packaging QR codes to view the immutable lifecycle.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nDeploy a prototype smart contract tracking 3 key milestones: Harvest Log $\\rightarrow$ Lab Certification $\\rightarrow$ Distribution Hub. Consumer scans a dynamic QR code on their smartphone to view the verified timeline.\n\n• SOLUTION DIRECTIONS:\n• Provenance Smart Contract: Record batch IDs, timestamped transitions, and authorized actor signatures.\n• IPFS Lab Certificate Storage: Pin decentralized lab reports and geotagged farm photos on IPFS.\n• Consumer Verification View: Clean mobile UI showing farm location, harvest date, and lab approval hash.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Physical barcode hardware printer integration.\n• Financial token speculation or crypto trading exchanges.\n• Complex multi-national customs tracking.\n\n• JUDGING CRITERIA:\n• Smart Contract Integrity & Role-Based Permissions (40%)\n• Decentralized File Storage & Data Linking (30%)\n• Consumer Trust UI & QR Scan Experience (30%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nSolidity, Polygon Amoy Testnet, IPFS / Pinata, Hardhat, React / Wagmi / Ethers.js",
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
    "domain": "Cybersecurity & Blockchain",
    "difficulty": "Medium",
    "technologies": [
      "Solidity",
      "Polygon Amoy Testnet",
      "IPFS",
      "Pinata",
      "Hardhat",
      "React",
      "Wagmi",
      "Ethers.js"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SEC-09",
    "title": "AndroidStaticScan: Automated Mobile APK Security & Secret Leak Auditor",
    "description": "Create an automated static analysis tool that accepts an uploaded Android APK file, extracts and parses the AndroidManifest.xml and decompiled DEX bytecode, scans for hardcoded secrets and tokens using regex rules, and evaluates permission risks against security best practices.",
    "background": "Mobile developers frequently ship Android apps with compiled-in production AWS secret keys, Firebase URLs with open read/write rules, and excessive permission requests. Attackers routinely decompile APKs using free tools to harvest these credentials, gaining unauthorized access to cloud backends and user databases.",
    "expectedSolution": "ANDROIDSTATICSCAN: AUTOMATED MOBILE APK SECURITY & SECRET LEAK AUDITOR\nProblem Statement ID: KARE-SEC-09 | Domain: Cybersecurity & Blockchain\n\n• THE CORE QUESTION:\nHow can developers detect leaked API keys, hardcoded database credentials, and dangerous Android permissions in compiled mobile APKs?\n\n• THE PROBLEM GAP:\nMobile developers frequently ship Android apps with compiled-in production AWS secret keys, Firebase URLs with open read/write rules, and excessive permission requests. Attackers routinely decompile APKs using free tools to harvest these credentials, gaining unauthorized access to cloud backends and user databases.\n\n• THE CHALLENGE:\nCreate an automated static analysis tool that accepts an uploaded Android APK file, extracts and parses the AndroidManifest.xml and decompiled DEX bytecode, scans for hardcoded secrets and tokens using regex rules, and evaluates permission risks against security best practices.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nTest on open-source APKs or build a sample test APK with dummy leaked API keys. Focus on manifest permission risk scoring and regex detection of high-value secrets (Google API keys, AWS credentials, private keys).\n\n• SOLUTION DIRECTIONS:\n• APK Decompilation & Extraction: Extract manifest structure, package names, and readable string constants.\n• Hardcoded Secret Scanner: Scan for AWS access keys, JWT tokens, Stripe keys, and cleartext passwords.\n• Permission & Component Risk Matrix: Flag exported activities, broadcast receivers, and excessive permissions.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Dynamic malware sandbox execution in an emulator.\n• Developing mobile malware or bypassing Android OS security.\n• Decompiling heavily obfuscated native C++ binaries.\n\n• JUDGING CRITERIA:\n• Secret Detection Accuracy & Regex Coverage (45%)\n• Permission Security Assessment & Risk Grading (30%)\n• Report Usability for Developers (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, Androguard / Apktool, Regex, Streamlit / Next.js, FastAPI",
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
    "domain": "Cybersecurity & Blockchain",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "Androguard",
      "Apktool",
      "Regex",
      "Streamlit",
      "Next.js",
      "FastAPI"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SEC-10",
    "title": "PassZero: Passwordless Biometric WebAuthn Authentication & Key Vault",
    "description": "Build a modern passwordless authentication portal implementing the W3C WebAuthn / FIDO2 standard, enabling users to register and sign in using their laptop/phone's native biometric sensors (TouchID, Windows Hello) via public-key cryptography, with no passwords ever sent or stored.",
    "background": "Passwords are the single weakest link in digital security. Users reuse simple passwords across personal and academic services, leaving them vulnerable to data breaches, phishing, and credential-stuffing bots. Multi-factor authentication via SMS OTP is also susceptible to SIM-swapping and social engineering.",
    "expectedSolution": "PASSZERO: PASSWORDLESS BIOMETRIC WEBAUTHN AUTHENTICATION & KEY VAULT\nProblem Statement ID: KARE-SEC-10 | Domain: Cybersecurity & Blockchain\n\n• THE CORE QUESTION:\nHow can organizations eradicate phishing and credential theft by eliminating passwords entirely in favor of cryptographic device biometrics?\n\n• THE PROBLEM GAP:\nPasswords are the single weakest link in digital security. Users reuse simple passwords across personal and academic services, leaving them vulnerable to data breaches, phishing, and credential-stuffing bots. Multi-factor authentication via SMS OTP is also susceptible to SIM-swapping and social engineering.\n\n• THE CHALLENGE:\nBuild a modern passwordless authentication portal implementing the W3C WebAuthn / FIDO2 standard, enabling users to register and sign in using their laptop/phone's native biometric sensors (TouchID, Windows Hello) via public-key cryptography, with no passwords ever sent or stored.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nImplement WebAuthn ceremony flows (Registration and Authentication). Demonstrate that the server stores only public keys and counter values, ensuring that a database compromise leaks zero user credentials.\n\n• SOLUTION DIRECTIONS:\n• FIDO2 / WebAuthn Protocol Flow: Implement challenge generation, client-side credential creation, and verification.\n• Biometric Sensor Interfacing: Leverage browser `navigator.credentials.create` and `.get` APIs.\n• Secure User Session Dashboard: Display cryptographic public key details and active biometric authenticators.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Writing low-level hardware biometric drivers.\n• Falling back to legacy email/SMS OTP passwords.\n• Complex enterprise Active Directory LDAP integration.\n\n• JUDGING CRITERIA:\n• WebAuthn Standard Compliance & Cryptographic Soundness (45%)\n• User Onboarding & Biometric Authentication Flow (35%)\n• Zero-Knowledge Server Security Architecture (20%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nNode.js, SimpleWebAuthn, React, MongoDB / PostgreSQL, Tailwind CSS",
    "requirements": [
      "FIDO2 / WebAuthn Protocol Flow: Implement challenge generation, client-side credential creation, and verification.",
      "Biometric Sensor Interfacing: Leverage browser `navigator.credentials.create` and `.get` APIs.",
      "Secure User Session Dashboard: Display cryptographic public key details and active biometric authenticators."
    ],
    "constraints": [
      "Writing low-level hardware biometric drivers.",
      "Falling back to legacy email/SMS OTP passwords.",
      "Complex enterprise Active Directory LDAP integration."
    ],
    "domain": "Cybersecurity & Blockchain",
    "difficulty": "Medium",
    "technologies": [
      "Node.js",
      "SimpleWebAuthn",
      "React",
      "MongoDB",
      "PostgreSQL",
      "Tailwind CSS"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-DS-01",
    "title": "AgroPrice Lite: One-Commodity Mandi Price Forecast & Nearby Arbitrage Dashboard",
    "description": "Develop a predictive market analytics dashboard that trains on historical wholesale commodity price records (Agmarknet data), forecasts price trends for the next 15-30 days, and recommends the most lucrative mandi within a 100 km radius factoring in transport costs.",
    "background": "Smallholder farmers frequently sell crops at steep losses because wholesale mandi prices crash unexpectedly during harvest gluts. Simultaneously, a mandi just 60 km away might be trading the same crop at a 30% higher price due to localized supply deficits. Farmers have zero access to predictive price intelligence.",
    "expectedSolution": "AGROPRICE LITE: ONE-COMMODITY MANDI PRICE FORECAST AND NEARBY ARBITRAGE DASHBOARD\nProblem Statement ID: KARE-DS-01 | Domain: Data Science and Predictive Analytics\n\n• THE CORE QUESTION:\nHow can short-term price forecasting help farmers choose a profitable nearby mandi for one crop after transport costs?\n\n• THE PROBLEM GAP:\nFarmers often sell at distress prices because they lack price forecasts and nearby mandi price comparisons.\n\n• THE CHALLENGE (24-HR FEASIBILITY):\nUse a preloaded Agmarknet sample for one commodity (e.g., onion or potato) across 5 to 10 mandis. Train Prophet or LightGBM to forecast 7 to 15 days of prices. Show nearby mandis on a map with price differentials and net profit after transport cost.\n\n• SCOPE GUIDANCE:\nOne commodity, limited mandis, static transport cost matrix. No nationwide live data, no futures exchange, no algorithmic trading. Forecast validation on a held-out time period.\n\n• SOLUTION DIRECTIONS:\n• Time-Series Price Forecasting: 7 to 15 day price trajectory.\n• Mandi Arbitrage Map: Price differential plus estimated net profit.\n• Best-Time-To-Sell Indicator: Sell now or store based on forecast trend.\n\n• ANTI-GOALS:\n• Full commodity futures exchange\n• Real-time nationwide fleet tracking\n• High-frequency automated trading\n\n• JUDGING CRITERIA:\n• Forecasting accuracy and validation (40%)\n• Practical arbitrage and economic logic (35%)\n• Visualization and map usability (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, Prophet / LightGBM, Pandas, Scikit-learn, Streamlit / Next.js, Leaflet / Folium",
    "requirements": [
      "Time-Series Price Forecasting: Model seasonal price trends and generate 15-day price trajectories.",
      "Mandi Arbitrage Map: Visualize nearby mandis with price differentials and net profit estimates.",
      "Best-Time-To-Sell Indicator: Actionable recommendation indicating whether to harvest now or store produce."
    ],
    "constraints": [
      "Building a full-fledged commodity futures exchange.",
      "Real-time nationwide fleet tracking.",
      "High-frequency automated algorithmic trading."
    ],
    "domain": "Data Science & Predictive Analytics",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "Prophet",
      "LightGBM",
      "Pandas",
      "Scikit-learn",
      "Leaflet.js",
      "Folium",
      "Streamlit",
      "Next.js"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-DS-02",
    "title": "GridPulse: Campus/City Microgrid Electricity Demand Forecaster & Peak Spikes Alert",
    "description": "Build an intelligent energy demand forecasting system that trains on historical hourly power consumption, ambient weather metrics (temperature, humidity), and calendar schedules to forecast the upcoming 24-hour load curve and predict peak demand threshold breaches.",
    "background": "Universities and industrial campuses face massive surge tariffs when peak electricity consumption exceeds their sanctioned contract demand. Renewable rooftop solar generation is intermittent, and facility managers lack foresight into upcoming demand spikes driven by ambient temperature and class schedules.",
    "expectedSolution": "GRIDPULSE: CAMPUS/CITY MICROGRID ELECTRICITY DEMAND FORECASTER & PEAK SPIKES ALERT\nProblem Statement ID: KARE-DS-02 | Domain: Data Science & Predictive Analytics\n\n• THE CORE QUESTION:\nHow can multivariate energy analytics predict campus power surges and schedule battery storage to prevent blackout penalties?\n\n• THE PROBLEM GAP:\nUniversities and industrial campuses face massive surge tariffs when peak electricity consumption exceeds their sanctioned contract demand. Renewable rooftop solar generation is intermittent, and facility managers lack foresight into upcoming demand spikes driven by ambient temperature and class schedules.\n\n• THE CHALLENGE:\nBuild an intelligent energy demand forecasting system that trains on historical hourly power consumption, ambient weather metrics (temperature, humidity), and calendar schedules to forecast the upcoming 24-hour load curve and predict peak demand threshold breaches.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nUse open building energy datasets or simulated hourly smart-meter records. Emphasize feature engineering (lagged consumption, weather correlation) and actionable battery dispatch alerts before peak load hits.\n\n• SOLUTION DIRECTIONS:\n• Multivariate Load Forecasting: Predict next 24-hour electricity demand in megawatts/kilowatts.\n• Peak Exceedance Early Warning: Trigger visual alerts 4 hours before projected contract limit breaches.\n• Smart Battery Optimization: Recommend optimal hours to charge from solar and discharge to offset grid load.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Physical smart meter hardware wiring.\n• High-voltage substation relay control.\n• Nuclear/thermal grid transmission modeling.\n\n• JUDGING CRITERIA:\n• Predictive Accuracy on Load Curves (40%)\n• Feature Engineering & Weather Correlation (30%)\n• Energy Management Dashboard Usability (30%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, XGBoost / Scikit-learn, Pandas, Chart.js / Plotly, FastAPI, Streamlit / React",
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
    "domain": "Data Science & Predictive Analytics",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "XGBoost",
      "Scikit-learn",
      "Pandas",
      "Chart.js",
      "Plotly",
      "FastAPI",
      "Streamlit",
      "React"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-DS-03",
    "title": "HydroCast Lite: Interactive Groundwater Budget & Recharge Pit Sizer",
    "description": "Design an interactive predictive hydrology dashboard where users select a district or soil type, input historical rainfall and seasonal extraction rates, and forecast the water table depth trajectory over the next 12 months, calculating the exact rainwater harvesting recharge pit dimensions needed to stabilize the aquifer.",
    "background": "Over 60% of rural and peri-urban districts face critical groundwater depletion due to unmonitored borewell drilling. Panchayat heads and local builders have no predictive insight into seasonal water table drops, leading to dry borewells and massive expenditures on private water tankers.",
    "expectedSolution": "HYDROCAST LITE: INTERACTIVE GROUNDWATER BUDGET AND RECHARGE PIT SIZER\nProblem Statement ID: KARE-DS-03 | Domain: Data Science and Predictive Analytics\n\n• THE CORE QUESTION:\nHow can a simple annual water-balance model help a panchayat estimate the rainwater harvesting needed to stabilize its groundwater?\n\n• THE PROBLEM GAP:\nVillages want to plan rainwater harvesting but lack an accessible tool connecting local rainfall, extraction, and recharge; professional groundwater models need data and expertise they do not have.\n\n• THE CHALLENGE (24-HR FEASIBILITY):\nBuild an interactive dashboard where the user selects a district (defaults loaded from a small curated CGWB snapshot), adjusts sliders for annual rainfall, irrigated area, and water extraction, and sees the annual water balance computed with the standard rainfall-recharge equation, plus recommended recharge pit dimensions and the number of structures needed.\n\n• SCOPE GUIDANCE:\nAnnual water-balance arithmetic; no 12-month forecast claim. Curated static CGWB district defaults or simulated figures. Standard CGWB / NDMA recharge-pit sizing formulas. This is a scenario what-if tool, not a predictive model.\n\n• SOLUTION DIRECTIONS:\n• Water Balance Engine: rainfall x area x infiltration factor minus estimated extraction.\n• Recharge Pit Sizer: pit dimensions and unit count for a chosen recharge target.\n• Scenario Comparison: save and compare 2 to 3 what-if scenarios side by side.\n\n• ANTI-GOALS:\n• Real-time aquifer forecasting\n• MODFLOW-style groundwater simulation\n• Live sensor / IoT integration\n• Sub-district precision claims\n\n• JUDGING CRITERIA:\n• Water-balance math correctness (45%)\n• Scenario visualization clarity (30%)\n• Practical actionability of pit sizing (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, Pandas, Streamlit, Plotly, curated CGWB CSV",
    "requirements": [
      "Aquifer Level Trend Forecaster: Predict seasonal water table rise and fall based on rainfall deficit.",
      "Aquifer Stress Classification: Categorize zones into Safe, Semi-Critical, and Over-Exploited.",
      "Rainwater Sizing Calculator: Output custom recharge pit dimensions based on rooftop square footage."
    ],
    "constraints": [
      "Seismic underground ultrasound exploration.",
      "Drilling physical borewell hardware.",
      "Building complex hydrodynamic river basin simulations."
    ],
    "domain": "Data Science & Predictive Analytics",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "GeoPandas",
      "Scikit-learn (Random Forest Regressor)",
      "Folium",
      "Mapbox",
      "Streamlit",
      "Dash"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-DS-04",
    "title": "FraudLocate Lite: Mule Withdrawal Hotspot Mapper & Patrol Route Suggester",
    "description": "Develop a predictive geospatial analytics engine that ingests simulated cybercrime complaint logs (timestamps, mule bank branches, ATM withdrawal locations), applies spatial clustering (DBSCAN) and time-decay modeling, and highlights high-probability ATM zones where withdrawals are anticipated over the next 2-4 hours.",
    "background": "When victims report cyber financial fraud to police helplines (1930), stolen money is rapidly split across multiple 'mule' bank accounts and withdrawn at physical ATMs within hours. Law enforcement patrol teams struggle to intercept fraudsters because they lack predictive intelligence on which ATM clusters and neighborhoods are being actively targeted.",
    "expectedSolution": "FRAUDLOCATE LITE: MULE WITHDRAWAL HOTSPOT MAPPER AND PATROL ROUTE SUGGESTER\nProblem Statement ID: KARE-DS-04 | Domain: Data Science and Predictive Analytics\n\n• THE CORE QUESTION:\nHow can descriptive geospatial analytics of past cybercrime withdrawals help police plan patrol coverage?\n\n• THE PROBLEM GAP:\nAfter mule accounts cash out stolen funds, investigations stay case-by-case with no map view of where withdrawals cluster, so patrol planning misses repeat hotspots.\n\n• THE CHALLENGE (24-HR FEASIBILITY):\nBuild a dashboard that ingests a preloaded synthetic complaint feed (timestamp, ATM or bank branch coordinates, amount), clusters withdrawal hotspots using DBSCAN, shows hour-of-day and day-of-week heat patterns, and suggests an efficient patrol route covering the top hotspots using a nearest-neighbor heuristic on a city map.\n\n• SCOPE GUIDANCE:\nPurely descriptive on past data; no future prediction claim. One synthetic dataset preloaded with the app. Haversine distances; routes are suggestions, not guaranteed optimal tours.\n\n• SOLUTION DIRECTIONS:\n• Hotspot Clustering: DBSCAN on withdrawal coordinates with tunable radius and min-points.\n• Time Pattern View: hour-of-day and day-of-week heatmaps of cash-outs.\n• Patrol Route Suggester: nearest-neighbor tour over top clusters with estimated travel time.\n\n• ANTI-GOALS:\n• Predicting future withdrawal locations\n• Live bank or FIR data integration\n• Agent-based criminal simulation\n• Conviction-grade evidentiary output\n\n• JUDGING CRITERIA:\n• Clustering quality and parameter handling (40%)\n• Patrol route suggestion logic (30%)\n• Map dashboard usability (30%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, scikit-learn (DBSCAN), Folium, Pandas, Streamlit",
    "requirements": [
      "Spatial Clustering Engine: Use DBSCAN / K-Means to identify recurring ATM withdrawal hotspots.",
      "Time-Decay Risk Scoring: Weight recent withdrawals higher to predict immediate next targets.",
      "Police Dispatch Map: Visualize high-alert zones with suggested patrol interception radiuses."
    ],
    "constraints": [
      "Hacking into private banking ATM networks.",
      "Real-time interception of cellular phone locations.",
      "Legal surveillance wiretapping."
    ],
    "domain": "Data Science & Predictive Analytics",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "Scikit-learn (DBSCAN)",
      "GeoPandas",
      "Folium",
      "Mapbox GL",
      "FastAPI",
      "React",
      "Tailwind CSS"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-DS-05",
    "title": "FareRadar Lite: Airfare History Dashboard & Buy-Wait Heuristic",
    "description": "Build an airfare price tracking and predictive intelligence engine that analyzes historical domestic flight fares, computes a route-specific Price Volatility Index, and provides a clear 'Buy Now' vs. 'Wait for Price Drop' recommendation with projected price trajectories.",
    "background": "Airlines employ opaque dynamic pricing algorithms that adjust ticket fares based on booking velocity, days to departure, and user cookies. Consumers face immense anxiety, either overpaying by booking prematurely or waiting too long and getting priced out by sudden surge hikes.",
    "expectedSolution": "FARERADAR LITE: AIRFARE HISTORY DASHBOARD AND BUY-WAIT HEURISTIC\nProblem Statement ID: KARE-DS-05 | Domain: Data Science and Predictive Analytics\n\n• THE CORE QUESTION:\nHow can a route's historical fare range help a traveler judge whether today's quoted price is high or low?\n\n• THE PROBLEM GAP:\nTravelers cannot tell if a quoted fare is a good deal because they have no easy view of a route's typical price range and volatility across recent months.\n\n• THE CHALLENGE (24-HR FEASIBILITY):\nUse a preloaded fare-history dataset (Kaggle or simulated) for 5 to 10 domestic routes, compute each route's 30 / 60 / 90-day price statistics and a simple Volatility Index, plot the trend, and give a transparent heuristic verdict (today's price percentile versus the route's own history) with a 7-day Prophet projection clearly labeled as indicative.\n\n• SCOPE GUIDANCE:\nNo live airline API scraping. One preloaded dataset. The heuristic is percentile-based and explainable, not a trained prediction claim. Include a disclaimer that output is informational, not booking advice.\n\n• SOLUTION DIRECTIONS:\n• Route Price Statistics: rolling median, quartiles, and volatility index per route.\n• Buy-Wait Heuristic: current price percentile against the route's own history.\n• 7-Day Trend Projection: Prophet forecast with confidence band, labeled as indicative.\n\n• ANTI-GOALS:\n• Real-time fare scraping\n• Guaranteed price-drop prediction\n• Booking or checkout integration\n• Multi-airline API orchestration\n\n• JUDGING CRITERIA:\n• Statistical soundness of the heuristic (40%)\n• Dashboard clarity (30%)\n• Honest validation on held-out dates (30%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, Pandas, Prophet, Plotly, Streamlit",
    "requirements": [
      "Historical Trend & Volatility Index: Quantify price fluctuations for specific flight routes over time.",
      "Buy vs. Wait Recommendation: Classification model predicting whether the fare will drop within 7 days.",
      "Interactive Fare History Chart: Visual trajectory comparing current fare against median historical prices."
    ],
    "constraints": [
      "Building a full-service online travel agency with payment processing.",
      "Violating airline terms of service with aggressive scraping.",
      "Predicting international multi-city layover fares."
    ],
    "domain": "Data Science & Predictive Analytics",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "Pandas",
      "Scikit-learn",
      "XGBoost",
      "Plotly",
      "Chart.js",
      "FastAPI",
      "Streamlit",
      "Next.js"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-DS-06",
    "title": "DropOutShield: Student Academic Risk Scoring & Early Intervention Engine",
    "description": "Create an early-warning predictive analytics portal for academic mentors that trains on student semester marks, continuous internal assessment trends, attendance decline rates, and LMS engagement, generating a personalized academic risk score (Low, Medium, High) with explainable risk drivers.",
    "background": "Universities lose thousands of students each year to academic dropout, often triggered by early failure in foundational courses, attendance slumps, or financial distress. Faculty advisors only discover these problems at the end of the semester after grades are finalized, when it is too late to rescue the student's academic standing.",
    "expectedSolution": "DROPOUTSHIELD: STUDENT ACADEMIC RISK SCORING & EARLY INTERVENTION ENGINE\nProblem Statement ID: KARE-DS-06 | Domain: Data Science & Predictive Analytics\n\n• THE CORE QUESTION:\nHow can institutional data science identify students on the verge of dropping out early enough for counselors to intervene?\n\n• THE PROBLEM GAP:\nUniversities lose thousands of students each year to academic dropout, often triggered by early failure in foundational courses, attendance slumps, or financial distress. Faculty advisors only discover these problems at the end of the semester after grades are finalized, when it is too late to rescue the student's academic standing.\n\n• THE CHALLENGE:\nCreate an early-warning predictive analytics portal for academic mentors that trains on student semester marks, continuous internal assessment trends, attendance decline rates, and LMS engagement, generating a personalized academic risk score (Low, Medium, High) with explainable risk drivers.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nUse open educational data (e.g., Open University Learning Analytics Dataset - OULAD) or synthetic college student records. Emphasize model explainability (SHAP values) so mentors know exactly why a student was flagged.\n\n• SOLUTION DIRECTIONS:\n• Multi-Factor Risk Classifier: Predict probability of academic probation or course dropout.\n• Explainable Risk Drivers (SHAP/Feature Importance): Pinpoint key contributors (e.g., 40% drop in Math II attendance).\n• Advisor Intervention Workflow: Enable mentors to log counseling notes and track student recovery progress.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Storing unencrypted private student grades publicly.\n• Automated disciplinary punishment or expulsion.\n• Manual spreadsheet data entry.\n\n• JUDGING CRITERIA:\n• Predictive Model Precision & Recall on At-Risk Cohorts (40%)\n• Explainability & Root-Cause Insight (35%)\n• Mentor Dashboard Design (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, Scikit-learn, XGBoost, SHAP, Pandas, React, Tailwind CSS, FastAPI",
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
    "domain": "Data Science & Predictive Analytics",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "Scikit-learn",
      "XGBoost",
      "SHAP",
      "Pandas",
      "React",
      "Tailwind CSS",
      "FastAPI"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-DS-07",
    "title": "CrimeNet: Telecom CDR Call-Chain Graph Analyzer & Syndicate Identifier",
    "description": "Develop an automated graph analytics and network intelligence tool that ingests raw telecom CDR files, constructs a directed communication graph, calculates network centrality metrics (Degree, Betweenness, Closeness) to isolate syndicate ringleaders, and maps common cell-tower locations.",
    "background": "During major criminal investigations, police teams receive Excel spreadsheets containing hundreds of thousands of Call Detail Records (CDRs) from telecom operators. Officers spend days manually cross-referencing phone numbers and cell towers in spreadsheets, often missing the shadowy coordinator who only communicates via intermediaries.",
    "expectedSolution": "CRIMENET: TELECOM CDR CALL-CHAIN GRAPH ANALYZER & SYNDICATE IDENTIFIER\nProblem Statement ID: KARE-DS-07 | Domain: Data Science & Predictive Analytics\n\n• THE CORE QUESTION:\nHow can graph algorithms automatically uncover criminal hierarchy and hidden conspirators from thousands of raw call detail records?\n\n• THE PROBLEM GAP:\nDuring major criminal investigations, police teams receive Excel spreadsheets containing hundreds of thousands of Call Detail Records (CDRs) from telecom operators. Officers spend days manually cross-referencing phone numbers and cell towers in spreadsheets, often missing the shadowy coordinator who only communicates via intermediaries.\n\n• THE CHALLENGE:\nDevelop an automated graph analytics and network intelligence tool that ingests raw telecom CDR files, constructs a directed communication graph, calculates network centrality metrics (Degree, Betweenness, Closeness) to isolate syndicate ringleaders, and maps common cell-tower locations.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nUse synthetic CDR datasets (caller, receiver, timestamp, duration, cell tower coordinates). Focus on network graph algorithms and visual exploration of connected components.\n\n• SOLUTION DIRECTIONS:\n• Network Graph Construction: Model phone numbers as nodes and calls as directed weighted edges.\n• Centrality Metric Analysis: Automatically identify the top 3 'bridge' coordinators using Betweenness Centrality.\n• Spatio-Temporal Filter: Pinpoint instances where two suspect numbers pinged the same cell tower concurrently.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Live interception of active phone calls or reading SMS content.\n• Accessing real-world telecom proprietary subscriber databases.\n• Building telecom network infrastructure.\n\n• JUDGING CRITERIA:\n• Graph Analytics Depth & Algorithmic Rigor (45%)\n• Interactive Graph Exploration & Filtering UI (35%)\n• Data Ingestion & Scalability on Large Logs (20%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, NetworkX, PyVis / Cytoscape.js, Pandas, Flask / FastAPI, React",
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
    "domain": "Data Science & Predictive Analytics",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "NetworkX",
      "PyVis",
      "Cytoscape.js",
      "Pandas",
      "Flask",
      "FastAPI",
      "React"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-DS-08",
    "title": "CivicAudit: Anomaly & Fraud Detection in Public Works Fund Allocations",
    "description": "Build an automated public expenditure anomaly detection engine that parses public works project data (sanctioned amounts, contractor IDs, project duration, completion delays), flags statistical outliers, and visualizes suspicious contractor monopolies and split-billing clusters.",
    "background": "Billions in public funds are lost annually to corruption in municipal public works. Corrupt contractors collude to submit artificial bids, split large contracts just below tender approval thresholds, and repeatedly inflate budgets through delayed project extensions. Manual audits examine less than 5% of all files.",
    "expectedSolution": "CIVICAUDIT: ANOMALY & FRAUD DETECTION IN PUBLIC WORKS FUND ALLOCATIONS\nProblem Statement ID: KARE-DS-08 | Domain: Data Science & Predictive Analytics\n\n• THE CORE QUESTION:\nHow can machine learning identify corrupt contractor cartels, split tenders, and budget inflation in municipal civic projects?\n\n• THE PROBLEM GAP:\nBillions in public funds are lost annually to corruption in municipal public works. Corrupt contractors collude to submit artificial bids, split large contracts just below tender approval thresholds, and repeatedly inflate budgets through delayed project extensions. Manual audits examine less than 5% of all files.\n\n• THE CHALLENGE:\nBuild an automated public expenditure anomaly detection engine that parses public works project data (sanctioned amounts, contractor IDs, project duration, completion delays), flags statistical outliers, and visualizes suspicious contractor monopolies and split-billing clusters.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nUse open government procurement datasets or simulated municipal tender records. Apply unsupervised outlier detection (Isolation Forest, Local Outlier Factor) to identify suspicious bidding and execution patterns.\n\n• SOLUTION DIRECTIONS:\n• Unsupervised Anomaly Scoring: Detect contracts with abnormal cost-to-time ratios or sudden cost revisions.\n• Cartel & Split-Tender Detection: Flag repeated contract awards clustered just below mandatory audit thresholds.\n• Civic Transparency Scorecard: Provide an executive dashboard ranking departments and contractors by risk.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Legal enforcement prosecution filings.\n• Simple keyword search without statistical modeling.\n• Manual auditing interfaces that require human line-by-line review.\n\n• JUDGING CRITERIA:\n• Outlier Detection Validity & Analytical Depth (40%)\n• Anomaly Explainability & Procurement Heuristics (35%)\n• Dashboard Visualizations (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, Scikit-learn (Isolation Forest), Pandas, Plotly / Dash, Streamlit / Next.js",
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
    "domain": "Data Science & Predictive Analytics",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "Scikit-learn (Isolation Forest)",
      "Pandas",
      "Plotly",
      "Dash",
      "Streamlit",
      "Next.js"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-DS-09",
    "title": "PulseCrisis: Real-Time Disaster Tweet SOS Extractor & Resource Heatmap",
    "description": "Create a real-time crisis intelligence engine that ingests simulated social media feeds during a natural disaster, applies NLP classification to filter actionable SOS requests from general commentary, extracts physical location entities via NER, and plots prioritized rescue heatmaps.",
    "background": "During natural disasters (floods, earthquakes), victims post urgent SOS requests on social media containing addresses and medical emergencies. Emergency disaster control rooms are overwhelmed by thousands of posts, unable to distinguish between genuine life-threatening cries for rescue, general news sharing, and spam.",
    "expectedSolution": "PULSECRISIS: REAL-TIME DISASTER TWEET SOS EXTRACTOR & RESOURCE HEATMAP\nProblem Statement ID: KARE-DS-09 | Domain: Data Science & Predictive Analytics\n\n• THE CORE QUESTION:\nHow can natural language processing filter the noise of social media during floods and cyclones to pinpoint citizens in critical danger?\n\n• THE PROBLEM GAP:\nDuring natural disasters (floods, earthquakes), victims post urgent SOS requests on social media containing addresses and medical emergencies. Emergency disaster control rooms are overwhelmed by thousands of posts, unable to distinguish between genuine life-threatening cries for rescue, general news sharing, and spam.\n\n• THE CHALLENGE:\nCreate a real-time crisis intelligence engine that ingests simulated social media feeds during a natural disaster, applies NLP classification to filter actionable SOS requests from general commentary, extracts physical location entities via NER, and plots prioritized rescue heatmaps.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nUse open disaster response tweet datasets (e.g. CrisisLex, Disaster Tweets Kaggle dataset). Focus on binary classification (Actionable SOS vs. Non-Actionable) and spatial mapping of extracted locations.\n\n• SOLUTION DIRECTIONS:\n• Actionable Intent Classification: Distinguish urgent requests (e.g., 'need boat pregnant woman trapped') from commentary.\n• Disaster Entity Extraction: Extract trapped victim count, critical needs (medical, food, rescue), and landmark names.\n• Live Emergency Command Map: Render clustered distress pins prioritized by urgency level.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Live real-time deployment requiring expensive Twitter/X enterprise API keys.\n• Launching physical drone rescue missions.\n• Scraping personal chat messages on private messaging platforms.\n\n• JUDGING CRITERIA:\n• NLP Intent & Entity Extraction Precision (40%)\n• Emergency Triage Prioritization Logic (35%)\n• Command Center Map Usability (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nHuggingFace Transformers (DistilBERT), spaCy (NER), Leaflet.js / Mapbox, FastAPI, React",
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
    "domain": "Data Science & Predictive Analytics",
    "difficulty": "Medium",
    "technologies": [
      "HuggingFace Transformers (DistilBERT)",
      "spaCy (NER)",
      "Leaflet.js",
      "Mapbox",
      "FastAPI",
      "React"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-DS-10",
    "title": "TransitSync Lite: Simulated Bus ETA & Delay Propagation Demo",
    "description": "Design a machine learning transit prediction pipeline that models historical route travel times, time-of-day traffic patterns, and live stop delays to predict accurate Estimated Time of Arrival (ETA) for buses at upcoming stops, complete with confidence bounds.",
    "background": "Millions of daily commuters waste hours at bus stops because published static timetables fail to account for urban traffic congestion, weather, and peak boarding delays. Existing GPS bus trackers only display current geographic location, leaving passengers in the dark about actual arrival time at downstream stops.",
    "expectedSolution": "TRANSITSYNC LITE: SIMULATED BUS ETA AND DELAY PROPAGATION DEMO\nProblem Statement ID: KARE-DS-10 | Domain: Data Science and Predictive Analytics\n\n• THE CORE QUESTION:\nHow can ML predict bus arrival at the next few stops using historical or simulated route logs and propagate a current delay downstream?\n\n• THE PROBLEM GAP:\nCommuters lack reliable arrival times because static timetables ignore traffic and boarding delays. GPS trackers show only where the bus is, not when it will reach downstream stops.\n\n• THE CHALLENGE (24-HR FEASIBILITY):\nBuild a pipeline on a preloaded or simulated GTFS-like CSV for 1 to 3 bus routes. Train a LightGBM or XGBoost model to predict travel time to the next stop. Simulate a live bus delay from a dashboard and recalculate downstream ETAs with a simple confidence range.\n\n• SCOPE GUIDANCE:\nUse simulated bus logs or a small public GTFS sample. No live GPS, no real weather API, no city-scale deployment. Weather and peak-hour can be pre-labelled columns in the dataset. Real-time means a local simulator that injects delay at a stop.\n\n• SOLUTION DIRECTIONS:\n• Dynamic ETA Regression: Predict travel minutes using route ID, stop sequence, hour, day, weather flag, previous delay, and dwell time.\n• Real-Time Delay Propagation: If bus is delayed at stop N, add predicted downstream travel times and propagate the delay with decay.\n• Commuter Web Display: Mobile-friendly countdown for next 3 stops, delay indicator, and confidence interval.\n\n• ANTI-GOALS:\n• Live GPS hardware integration\n• Full city-scale traffic simulation\n• Ticketing or booking system\n• Complex 3D visualization\n\n• JUDGING CRITERIA:\n• Downstream ETA accuracy (MAE or RMSE on held-out simulated data) (40%)\n• Delay propagation logic (35%)\n• Mobile UI cleanliness (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nPython, Pandas, LightGBM / XGBoost, FastAPI, React / Next.js, CSV / SQLite, Leaflet (optional)",
    "requirements": [
      "Dynamic ETA Regression: Calculate arrival times factoring in weather, peak hour coefficients, and past stop delays.",
      "Real-Time Delay Propagation: Adjust entire downstream route arrival estimates when a bus is delayed at one stop.",
      "Commuter Web Display: Clean mobile interface with live countdown timers and route delay indicators."
    ],
    "constraints": [
      "Manufacturing hardware GPS tracking devices for buses.",
      "Building a full-fledged ticket booking and ticketing machine ecosystem.",
      "Complex 3D city traffic simulation."
    ],
    "domain": "Data Science & Predictive Analytics",
    "difficulty": "Medium",
    "technologies": [
      "Python",
      "LightGBM",
      "XGBoost",
      "Pandas",
      "Socket.io",
      "React",
      "Next.js",
      "FastAPI",
      "OpenStreetMap"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SYS-01",
    "title": "SmartOPD: Hospital Queue Virtualization & Live Bed Availability Portal",
    "description": "Develop a full-stack hospital management web application where patients generate digital queue tokens with live estimated consultation countdowns, while hospital administrators manage clinical triage and maintain a verified public live bed availability counter.",
    "background": "Government and charitable hospital outpatient departments (OPDs) suffer from dangerous overcrowding, with patients waiting 4-6 hours in poorly ventilated corridors. Simultaneously, ambulances wander between hospitals because there is no centralized, real-time tracking of vacant ICU and oxygen beds.",
    "expectedSolution": "SMARTOPD: HOSPITAL QUEUE VIRTUALIZATION & LIVE BED AVAILABILITY PORTAL\nProblem Statement ID: KARE-SYS-01 | Domain: Full-Stack Web & Smart Automation\n\n• THE CORE QUESTION:\nHow can cloud software eliminate chaotic outpatient hospital waiting crowds while providing real-time visibility into emergency bed vacancies?\n\n• THE PROBLEM GAP:\nGovernment and charitable hospital outpatient departments (OPDs) suffer from dangerous overcrowding, with patients waiting 4-6 hours in poorly ventilated corridors. Simultaneously, ambulances wander between hospitals because there is no centralized, real-time tracking of vacant ICU and oxygen beds.\n\n• THE CHALLENGE:\nDevelop a full-stack hospital management web application where patients generate digital queue tokens with live estimated consultation countdowns, while hospital administrators manage clinical triage and maintain a verified public live bed availability counter.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nSimulate hospital patient check-ins and bed status updates. Implement real-time WebSocket communication for token status and a responsive patient portal that updates without manual page refreshes.\n\n• SOLUTION DIRECTIONS:\n• Virtual Queue & Token Generation: Issue digital tokens with live estimated consult wait time via WebSockets.\n• Real-Time Bed Availability Dashboard: Live ward tracking of General, ICU, and Oxygen beds with vacancy status.\n• Doctor Triage Interface: Enable clinicians to call next patient, mark completed, or transfer to labs.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Full enterprise Hospital Information System (HIS) with complex billing.\n• Direct integration with national health insurance claim clearinghouses.\n• IoT biometric bed sensors.\n\n• JUDGING CRITERIA:\n• Full-Stack Architecture & Real-Time Sync (40%)\n• Patient & Hospital Staff User Experience (35%)\n• Code Modularity & System Reliability (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nNext.js / React, Node.js / Express, Socket.io, PostgreSQL / Supabase, Tailwind CSS",
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
    "domain": "Full-Stack Web & Smart Automation",
    "difficulty": "Medium",
    "technologies": [
      "Next.js",
      "React",
      "Node.js",
      "Express",
      "Socket.io",
      "PostgreSQL",
      "Supabase",
      "Tailwind CSS"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SYS-02",
    "title": "KisanDirect: Zero-Brokerage Farmer-to-Retail Direct Produce Marketplace",
    "description": "Build a mobile-first marketplace platform where farmers create simple produce listings (crop type, quantity in quintals, minimum price, farm photo) and verified local retail vendors place direct bids or purchases, generating automated WhatsApp order confirmation receipts.",
    "background": "Agricultural supply chains in India are dominated by multi-tiered middlemen (dalals), who take up to 50% of the produce value while leaving farmers with minimal margins. Local grocery vendors in nearby towns pay high prices, yet cannot discover which local farmers have freshly harvested crops ready for dispatch.",
    "expectedSolution": "KISANDIRECT: ZERO-BROKERAGE FARMER-TO-RETAIL DIRECT PRODUCE MARKETPLACE\nProblem Statement ID: KARE-SYS-02 | Domain: Full-Stack Web & Smart Automation\n\n• THE CORE QUESTION:\nHow can digital commerce connect agricultural producers directly with local retail grocery stores, cutting out predatory middlemen?\n\n• THE PROBLEM GAP:\nAgricultural supply chains in India are dominated by multi-tiered middlemen (dalals), who take up to 50% of the produce value while leaving farmers with minimal margins. Local grocery vendors in nearby towns pay high prices, yet cannot discover which local farmers have freshly harvested crops ready for dispatch.\n\n• THE CHALLENGE:\nBuild a mobile-first marketplace platform where farmers create simple produce listings (crop type, quantity in quintals, minimum price, farm photo) and verified local retail vendors place direct bids or purchases, generating automated WhatsApp order confirmation receipts.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nDesign for low-literacy users with high-contrast, image-driven UI. Simulate the transaction flow from crop listing to merchant bid acceptance and WhatsApp receipt notification dispatch.\n\n• SOLUTION DIRECTIONS:\n• Streamlined Crop Listing: 3-step crop posting with photo upload, harvest date, and expected price.\n• Merchant Bidding & Purchase Flow: Retailers view nearby listings on a map and place binding bids.\n• Automated WhatsApp / SMS Deal Slip: Trigger automated order receipt summaries via Twilio / WhatsApp API.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Complex nationwide refrigerated freight logistics management.\n• Commodity futures speculation and derivatives.\n• Mandatory credit card payment gateway integration.\n\n• JUDGING CRITERIA:\n• Marketplace User Flow & Usability for Rural Users (40%)\n• Real-time Bidding & Deal State Machine (35%)\n• Notification Integration & Architecture (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nNext.js, Supabase (Auth, Storage & Database), Tailwind CSS, Twilio / WhatsApp Business API, React",
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
    "domain": "Full-Stack Web & Smart Automation",
    "difficulty": "Medium",
    "technologies": [
      "Next.js",
      "Supabase (Auth",
      "Storage & Database)",
      "Tailwind CSS",
      "Twilio",
      "WhatsApp Business API",
      "React"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SYS-03",
    "title": "CivicFix: Geotagged Civic Issue Reporting & Automated SLA Router",
    "description": "Create a progressive web application (PWA) where citizens snap a photo of a civic issue with auto-detected GPS coordinates; an automated image classifier categorizes the issue (pothole, waste, lighting) and assigns the ticket to the respective ward officer with an active 48-hour SLA countdown timer.",
    "background": "Citizens encountering open potholes, overflowing garbage dumps, or non-functional streetlights rarely report them because municipal complaint helplines are unresponsive and bureaucratically convoluted. Tickets languish for months because complaints are routed to the wrong ward departments.",
    "expectedSolution": "CIVICFIX: GEOTAGGED CIVIC ISSUE REPORTING & AUTOMATED SLA ROUTER\nProblem Statement ID: KARE-SYS-03 | Domain: Full-Stack Web & Smart Automation\n\n• THE CORE QUESTION:\nHow can citizen-reported municipal complaints be automatically categorized, geotagged, and routed to the exact division officer with strict SLA accountability?\n\n• THE PROBLEM GAP:\nCitizens encountering open potholes, overflowing garbage dumps, or non-functional streetlights rarely report them because municipal complaint helplines are unresponsive and bureaucratically convoluted. Tickets languish for months because complaints are routed to the wrong ward departments.\n\n• THE CHALLENGE:\nCreate a progressive web application (PWA) where citizens snap a photo of a civic issue with auto-detected GPS coordinates; an automated image classifier categorizes the issue (pothole, waste, lighting) and assigns the ticket to the respective ward officer with an active 48-hour SLA countdown timer.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nUse mobile web camera and geolocation APIs. Implement a lightweight image classifier (MobileNet) to suggest the issue category automatically and build a municipal officer dashboard to mark tickets resolved with before/after photos.\n\n• SOLUTION DIRECTIONS:\n• Geotagged Photo Capture: Capture issue evidence with tamper-resistant GPS metadata.\n• Automated Department Routing: Classify photo into Roads, Sanitation, or Electrical divisions.\n• SLA Countdown & Escalation Engine: Track 48-hour resolution deadlines with escalation badges.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Full municipal ERP accounting and employee payroll systems.\n• Deploying physical street maintenance crews.\n• Complex municipal GIS map servers.\n\n• JUDGING CRITERIA:\n• End-to-End Civic Workflow & Usability (40%)\n• Automated Categorization & Routing Logic (35%)\n• Officer Dashboard & SLA Enforcement (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nFlutter / React PWA, Node.js, MongoDB / PostgreSQL, Leaflet.js, MobileNet (TensorFlow.js), Tailwind CSS",
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
    "domain": "Full-Stack Web & Smart Automation",
    "difficulty": "Medium",
    "technologies": [
      "Flutter",
      "React PWA",
      "Node.js",
      "MongoDB",
      "PostgreSQL",
      "Leaflet.js",
      "MobileNet (TensorFlow.js)",
      "Tailwind CSS"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SYS-04",
    "title": "JusticeBail Lite: Curated 436A Eligibility Calculator & Petition Template Generator",
    "description": "Develop an interactive legal decision-support web platform where paralegals and legal aid volunteers input prisoner offense sections, custody start dates, and trial status; the engine computes Section 436A bail eligibility and automatically drafts a ready-to-file bail petition PDF.",
    "background": "Over 75% of India's prison population comprises undertrial prisoners, many of whom have spent more time incarcerated than the maximum sentence for their alleged offense. Under Section 436A of the CrPC, they are legally entitled to bail, but languish in jail because legal aid volunteers lack automated tools to track statutory thresholds.",
    "expectedSolution": "JUSTICEBAIL LITE: CURATED 436A ELIGIBILITY CALCULATOR AND PETITION TEMPLATE GENERATOR\nProblem Statement ID: KARE-SYS-04 | Domain: Full-Stack Web and Smart Automation\n\n• THE CORE QUESTION:\nHow can a legal-aid tool help paralegals check Section 436A eligibility for a small set of common offences and auto-fill a bail petition draft?\n\n• THE PROBLEM GAP:\nMany undertrial prisoners remain in jail beyond statutory thresholds because legal-aid volunteers lack quick eligibility-checking and petition-drafting tools.\n\n• THE CHALLENGE (24-HR FEASIBILITY):\nBuild an interactive web tool where paralegals input offence section from a curated list of 10 to 15 common sections, custody start date, and trial status. The engine computes half or one-third custody thresholds under CrPC 436A and generates an editable PDF draft using a standard petition template. Include a clear prototype disclaimer.\n\n• SCOPE GUIDANCE:\nEncode only selected sections with maximum punishment. No precedent engine, no full CrPC or BNS coverage, no police database. Petition is template-based, not AI-generated legal reasoning.\n\n• SOLUTION DIRECTIONS:\n• Statutory Eligibility Calculator: Compare custody duration against 1/2 or 1/3 rule.\n• Legal Reason Template: Insert statutory justification citing CrPC 436A.\n• Petition PDF Generator: Populate court template with client data and export PDF.\n\n• ANTI-GOALS:\n• Replacing trial lawyers\n• Connecting to classified police databases\n• Sentencing or judicial outcome prediction\n• Covering every penal section\n\n• JUDGING CRITERIA:\n• Legal logic accuracy for curated sections (45%)\n• Petition template formatting (30%)\n• Usability for paralegal workers (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nReact / Next.js, FastAPI / Node.js, ReportLab / jsPDF, Tailwind / Bootstrap, SQLite / JSON",
    "requirements": [
      "Statutory Eligibility Calculator: Evaluate custody duration against maximum penalties (1/2 or 1/3 rules).",
      "Legal Reason Engine: Generate statutory justifications citing CrPC 436A and landmark bail precedents.",
      "Automated Court Petition PDF Generator: Export completed, properly formatted bail application ready for signature."
    ],
    "constraints": [
      "Replacing professional trial lawyers in court.",
      "Connecting to classified police internal databases.",
      "Automated sentencing or judicial outcome prediction."
    ],
    "domain": "Full-Stack Web & Smart Automation",
    "difficulty": "Medium",
    "technologies": [
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "ReportLab",
      "jsPDF",
      "Bootstrap",
      "Tailwind CSS"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SYS-05",
    "title": "SkillBridge: AI-Powered Academia-Industry Micro-Project & Hiring Portal",
    "description": "Build a dual-sided matching platform where tech companies post scoped micro-projects (bug fixes, feature additions) with required skill tags, and students connect their GitHub profiles and project portfolios; a semantic matching algorithm ranks candidates based on demonstrated skills rather than pedigree.",
    "background": "Traditional campus placement relies on rigid GPA cutoffs and generic resumes, leaving talented student coders overlooked while tech startups struggle to find candidates with hands-on framework experience. Students lack avenues to prove their capabilities on bite-sized, real-world industry tasks.",
    "expectedSolution": "SKILLBRIDGE: AI-POWERED ACADEMIA-INDUSTRY MICRO-PROJECT & HIRING PORTAL\nProblem Statement ID: KARE-SYS-05 | Domain: Full-Stack Web & Smart Automation\n\n• THE CORE QUESTION:\nHow can engineering students match their verifiable coding skills with real-world industry micro-internships without resume bias?\n\n• THE PROBLEM GAP:\nTraditional campus placement relies on rigid GPA cutoffs and generic resumes, leaving talented student coders overlooked while tech startups struggle to find candidates with hands-on framework experience. Students lack avenues to prove their capabilities on bite-sized, real-world industry tasks.\n\n• THE CHALLENGE:\nBuild a dual-sided matching platform where tech companies post scoped micro-projects (bug fixes, feature additions) with required skill tags, and students connect their GitHub profiles and project portfolios; a semantic matching algorithm ranks candidates based on demonstrated skills rather than pedigree.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nSimulate employer project postings and student profile ingestions. Focus on skill taxonomy matching (cosine similarity over technical tags and GitHub repository languages) and a clean collaboration workspace.\n\n• SOLUTION DIRECTIONS:\n• Micro-Project Marketplace: Employers post scoped tasks with clear deliverables and stipend rewards.\n• Automated Skill Extraction: Parse student GitHub repositories and language proficiencies into a verified badge profile.\n• Semantic Matchmaker: Recommend top student matches to employers using cosine similarity on skills.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Building a full-fledged video conferencing platform.\n• Automated code compilation and grading for every programming language.\n• Replacing global job portals (LinkedIn).\n\n• JUDGING CRITERIA:\n• Matching Algorithm Relevance & Scoring Logic (40%)\n• Platform Dual-Persona UX (Student vs Employer) (35%)\n• GitHub Data Integration & Profile Verification (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nNext.js, FastAPI / Node.js, Scikit-learn (Cosine Similarity), Supabase / PostgreSQL, GitHub REST API",
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
    "domain": "Full-Stack Web & Smart Automation",
    "difficulty": "Medium",
    "technologies": [
      "Next.js",
      "FastAPI",
      "Node.js",
      "Scikit-learn (Cosine Similarity)",
      "Supabase",
      "PostgreSQL",
      "GitHub REST API"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SYS-06",
    "title": "KalaKriti: AI-Powered Multilingual Cataloging Portal for Rural Artisans",
    "description": "Design a mobile progressive web app where artisans snap a photo of their handmade craft; multimodal vision AI analyzes the image, automatically tags craft categories, identifies colors and materials, and generates compelling promotional descriptions in both English and local Indian languages for instant digital sharing.",
    "background": "Millions of skilled rural artisans (potters, weavers, painters) struggle to sell their craft on digital platforms because cataloging products requires writing fluent English descriptions, measuring dimensions, and categorizing crafts correctly. High agency commissions eat up their profits.",
    "expectedSolution": "KALAKRITI: AI-POWERED MULTILINGUAL CATALOGING PORTAL FOR RURAL ARTISANS\nProblem Statement ID: KARE-SYS-06 | Domain: Full-Stack Web & Smart Automation\n\n• THE CORE QUESTION:\nHow can traditional artisans create digital e-commerce storefronts with professional marketing descriptions using just their phone camera?\n\n• THE PROBLEM GAP:\nMillions of skilled rural artisans (potters, weavers, painters) struggle to sell their craft on digital platforms because cataloging products requires writing fluent English descriptions, measuring dimensions, and categorizing crafts correctly. High agency commissions eat up their profits.\n\n• THE CHALLENGE:\nDesign a mobile progressive web app where artisans snap a photo of their handmade craft; multimodal vision AI analyzes the image, automatically tags craft categories, identifies colors and materials, and generates compelling promotional descriptions in both English and local Indian languages for instant digital sharing.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nUse free vision-language APIs (BLIP, CLIP, or Gemini API). The artisan workflow must be one-click simple: upload photo $\\rightarrow$ review generated product card $\\rightarrow$ share on WhatsApp or export catalog.\n\n• SOLUTION DIRECTIONS:\n• Photo-to-Catalog Pipeline: Extract craft type (e.g., 'Terracotta pottery', 'Bandhani saree') and color palette.\n• Multilingual Marketing Copywriter: Generate engaging product descriptions in English, Hindi, Tamil, etc.\n• Digital Showcase Storefront: Auto-generate a sharable web link where customers can view products and message the artisan.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Building an entire payment gateway and banking settlement engine.\n• Requiring complex inventory SKU management.\n• Manual multi-page form filling.\n\n• JUDGING CRITERIA:\n• Vision-to-Copy Generation Quality (40%)\n• Artisan Mobile Usability & Accessibility (35%)\n• Storefront Presentation & Sharing Flow (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nReact / Next.js, FastAPI, HuggingFace Inference API (BLIP / Vision), Firebase / Supabase, Tailwind CSS",
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
    "domain": "Full-Stack Web & Smart Automation",
    "difficulty": "Medium",
    "technologies": [
      "React",
      "Next.js",
      "FastAPI",
      "HuggingFace Inference API (BLIP",
      "Vision)",
      "Firebase",
      "Supabase",
      "Tailwind CSS"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SYS-07",
    "title": "GeoAttend Lite: Geofenced Check-in with Rotating Code & Basic Anomaly Flags",
    "description": "Develop a spoof-resistant mobile web attendance portal that verifies a student's presence inside a designated classroom polygon using the Haversine formula and HTML5 Geolocation, detects fake location providers/mock location flags, and updates a real-time faculty attendance dashboard.",
    "background": "Manual roll calls waste 10 minutes of every college lecture, while biometric fingerprint scanners create long hallway lines and hygiene concerns. Existing mobile attendance apps are easily tricked by students using GPS spoofing apps or sharing login credentials with friends.",
    "expectedSolution": "GEOATTEND LITE: GEOFENCED CHECK-IN WITH ROTATING CODE AND BASIC ANOMALY FLAGS\nProblem Statement ID: KARE-SYS-07 | Domain: Full-Stack Web and Smart Automation\n\n• THE CORE QUESTION:\nHow can a mobile web app automate classroom attendance using geofencing and a rotating check-in code while deterring simple proxy or spoofing attempts?\n\n• THE PROBLEM GAP:\nRoll calls waste lecture time. Biometrics create queues and hygiene issues. Simple attendance apps are tricked by GPS spoofing or credential sharing.\n\n• THE CHALLENGE (24-HR FEASIBILITY):\nBuild a mobile web attendance portal where faculty displays a rotating 6-digit code or QR, students submit the code plus browser geolocation, and the system verifies coordinates inside a simulated classroom polygon using Haversine logic while flagging basic anomalies (out-of-polygon, duplicate device ID, rapid speed jumps).\n\n• SCOPE GUIDANCE:\nOne simulated campus and one classroom polygon. No RFID hardware, no background tracking outside class. Use localStorage or device ID plus rotating code for basic proxy deterrence. Note: spoof-deterrent rather than claim of impossible spoof-proofing.\n\n• SOLUTION DIRECTIONS:\n• Geofence Validator: Check student coordinates against classroom polygon.\n• Anti-Spoofing Heuristics: Mock-location flag if available, abnormal speed, duplicate device, low GPS accuracy.\n• Live Faculty Monitor: Occupancy view, absentee export, session code rotation.\n\n• ANTI-GOALS:\n• RFID gates in every doorway\n• Tracking students outside lecture hours\n• Multi-semester grading portal\n• Claiming impossible spoof-proof security\n\n• JUDGING CRITERIA:\n• Geofence accuracy and basic spoof deterrence (45%)\n• Faculty dashboard and live roster UX (30%)\n• Mobile responsiveness and lightweight design (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nReact / Next.js, HTML5 Geolocation API, Node.js / FastAPI, SQLite / PostgreSQL / MongoDB, Tailwind CSS",
    "requirements": [
      "Geofence Polygon Validator: Check student coordinates against classroom bounding polygons.",
      "Anti-Spoofing Heuristics: Check mock-location browser flags, abnormal speed jumps, and device fingerprinting.",
      "Live Faculty Monitor: Display live classroom occupancy with instant absentee list export."
    ],
    "constraints": [
      "Installing expensive RFID hardware gates in every doorway.",
      "Tracking student GPS movements outside lecture hours.",
      "Building complex multi-semester grading portals."
    ],
    "domain": "Full-Stack Web & Smart Automation",
    "difficulty": "Medium",
    "technologies": [
      "React",
      "Next.js",
      "HTML5 Geolocation API",
      "Node.js",
      "MongoDB",
      "PostgreSQL",
      "Tailwind CSS"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SYS-08",
    "title": "SchemeFinder: Dynamic Citizen Welfare Scheme Matcher & Document Guide",
    "description": "Create a simple, conversational 4-step wizard where citizens answer basic demographic questions (age, state, caste category, annual income, occupation, education); the system matches their profile against an indexed database of government schemes and produces a personalized eligibility scorecard with a step-by-step document checklist.",
    "background": "Central and state governments operate hundreds of welfare schemes for students, farmers, women entrepreneurs, and senior citizens. However, over 70% of eligible beneficiaries fail to access them because scheme rules are buried across dozens of departmental websites with confusing bureaucratic criteria.",
    "expectedSolution": "SCHEMEFINDER: DYNAMIC CITIZEN WELFARE SCHEME MATCHER & DOCUMENT GUIDE\nProblem Statement ID: KARE-SYS-08 | Domain: Full-Stack Web & Smart Automation\n\n• THE CORE QUESTION:\nHow can an intuitive digital advisor discover the exact government subsidies, scholarships, and pensions a citizen is entitled to?\n\n• THE PROBLEM GAP:\nCentral and state governments operate hundreds of welfare schemes for students, farmers, women entrepreneurs, and senior citizens. However, over 70% of eligible beneficiaries fail to access them because scheme rules are buried across dozens of departmental websites with confusing bureaucratic criteria.\n\n• THE CHALLENGE:\nCreate a simple, conversational 4-step wizard where citizens answer basic demographic questions (age, state, caste category, annual income, occupation, education); the system matches their profile against an indexed database of government schemes and produces a personalized eligibility scorecard with a step-by-step document checklist.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nCurate a representative database of 20-30 major central and state schemes (PM-Kisan, Post-Matric Scholarships, Mudra Loan, etc.). Emphasize fuzzy search, rule filtering, and clear document checklists for applying.\n\n• SOLUTION DIRECTIONS:\n• Multi-Criteria Rule Matching: Filter schemes matching intersection of income, social category, and occupation.\n• Personalized Document Checklist: List exact required documents (Aadhaar, Income Certificate, Bank Passbook).\n• Plain-Language Benefits Breakdown: Display expected monetary or grant benefits without bureaucratic jargon.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Direct integration with national treasury disbursement.\n• Requiring complex government single-sign-on login.\n• Building a broad search engine with unverified links.\n\n• JUDGING CRITERIA:\n• Matching Logic Precision & Scheme Rule Accuracy (40%)\n• Simplicity of Citizen Wizard & Document Checklist (35%)\n• Database Schema & Extensibility (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nNext.js / React, Fuse.js / SQLite, Supabase, Tailwind CSS, Python / FastAPI",
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
    "domain": "Full-Stack Web & Smart Automation",
    "difficulty": "Medium",
    "technologies": [
      "Next.js",
      "React",
      "Fuse.js",
      "SQLite",
      "Supabase",
      "Tailwind CSS",
      "Python",
      "FastAPI"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SYS-09",
    "title": "MedInventory: Hospital Pharmacy Batch Expiry Tracker & Stockout Sentinel",
    "description": "Build a barcode/QR-enabled pharmacy inventory tracking web application that logs medicine batches with manufacturing and expiry dates, enforces First Expired, First Out (FEFO) dispensing rules, triggers automated color-coded expiry alerts (Red = expiring in 30 days), and enables internal inter-ward medicine transfers.",
    "background": "Hospitals routinely discard thousands of dollars worth of expired medicines, while other wards in the same facility face acute shortages of those exact drugs. Paper logbooks and basic spreadsheets fail to track batch-level expiration dates, leading to expired medicines remaining on dispensing shelves.",
    "expectedSolution": "MEDINVENTORY: HOSPITAL PHARMACY BATCH EXPIRY TRACKER & STOCKOUT SENTINEL\nProblem Statement ID: KARE-SYS-09 | Domain: Full-Stack Web & Smart Automation\n\n• THE CORE QUESTION:\nHow can smart pharmacy software enforce First-Expired-First-Out dispensing and prevent life-saving medicines from expiring unnoticed?\n\n• THE PROBLEM GAP:\nHospitals routinely discard thousands of dollars worth of expired medicines, while other wards in the same facility face acute shortages of those exact drugs. Paper logbooks and basic spreadsheets fail to track batch-level expiration dates, leading to expired medicines remaining on dispensing shelves.\n\n• THE CHALLENGE:\nBuild a barcode/QR-enabled pharmacy inventory tracking web application that logs medicine batches with manufacturing and expiry dates, enforces First Expired, First Out (FEFO) dispensing rules, triggers automated color-coded expiry alerts (Red = expiring in 30 days), and enables internal inter-ward medicine transfers.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nImplement webcam barcode/QR scanning using browser libraries. Simulate pharmacy stock entries and show dynamic alerts when an expiry date approaches.\n\n• SOLUTION DIRECTIONS:\n• Batch-Level Barcode / QR Scanning: Ingest medicine shipments with batch numbers, quantities, and expiration dates.\n• Automated FEFO Dispensing Guide: Prompt pharmacists to dispense the nearest-expiring batch first.\n• Critical Expiry Sentinel: Automated color-coded alerts and inter-ward surplus transfer requests.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Automated drug compounding robotics.\n• Full billing and insurance claim settlement.\n• Clinical pharmacy trial protocols.\n\n• JUDGING CRITERIA:\n• FEFO Logic & Expiry Alert Automation (45%)\n• Barcode Scanning & Inventory UX (30%)\n• Data Integrity & Relational Schema (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nReact / Next.js, HTML5-QRCode Scanner library, Node.js / Express, PostgreSQL / Supabase, Tailwind CSS",
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
    "domain": "Full-Stack Web & Smart Automation",
    "difficulty": "Medium",
    "technologies": [
      "React",
      "Next.js",
      "HTML5-QRCode Scanner library",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Supabase",
      "Tailwind CSS"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  },
  {
    "problemId": "KARE-SYS-10",
    "title": "RailResolve: Smart Railway Passenger Grievance Categorizer & Ticket Triage",
    "description": "Design an intelligent railway passenger grievance ticketing portal that ingests complaint text, automatically classifies issues into departments (Catering, Cleanliness, Electrical, Security, Medical), detects and groups duplicate complaints from the same train/coach number, and visualizes an emergency-first triage board for division managers.",
    "background": "The railway complaint helpline receives tens of thousands of unstructured passenger complaints daily across social media, apps, and SMS. During major train delays, dozens of passengers from the same train log identical complaints about air conditioning or dirty coaches, swamping support staff and burying critical medical/security emergencies.",
    "expectedSolution": "RAILRESOLVE: SMART RAILWAY PASSENGER GRIEVANCE CATEGORIZER & TICKET TRIAGE\nProblem Statement ID: KARE-SYS-10 | Domain: Full-Stack Web & Smart Automation\n\n• THE CORE QUESTION:\nHow can natural language processing turn chaotic passenger complaints into prioritized, de-duplicated tickets for railway maintenance crews?\n\n• THE PROBLEM GAP:\nThe railway complaint helpline receives tens of thousands of unstructured passenger complaints daily across social media, apps, and SMS. During major train delays, dozens of passengers from the same train log identical complaints about air conditioning or dirty coaches, swamping support staff and burying critical medical/security emergencies.\n\n• THE CHALLENGE:\nDesign an intelligent railway passenger grievance ticketing portal that ingests complaint text, automatically classifies issues into departments (Catering, Cleanliness, Electrical, Security, Medical), detects and groups duplicate complaints from the same train/coach number, and visualizes an emergency-first triage board for division managers.\n\n• SCOPE GUIDANCE (24-HR FEASIBILITY):\nUse sample passenger complaints. Implement a text classification model (Naive Bayes / DistilBERT) to categorize issues and a grouping heuristic that aggregates complaints sharing PNR / Train number and issue category.\n\n• SOLUTION DIRECTIONS:\n• Multi-Class Issue Tagging: Automatically route complaints to Sanitation, Pantry, Electrical, or Security.\n• Train-Level De-Duplication: Group 20 separate complaints about 'Coach B2 AC not working' into a single actionable ticket.\n• Emergency Priority Escalation: Flag safety, security, and medical emergencies at the top of the triage board.\n\n• ANTI-GOALS (WHAT THIS IS NOT):\n• Real-time locomotive sensor telemetry.\n• Direct integration with national railway ticketing booking databases.\n• Passenger refund payment processing.\n\n• JUDGING CRITERIA:\n• NLP Categorization & De-Duplication Accuracy (40%)\n• Triage Board Design & Department Routing (35%)\n• Emergency Escalation Responsiveness (25%)\n\n• RECOMMENDED TECH STACK & RESOURCES:\nFastAPI / Node.js, Scikit-learn (NLP Classifier), React, Chart.js, PostgreSQL / Supabase",
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
    "domain": "Full-Stack Web & Smart Automation",
    "difficulty": "Medium",
    "technologies": [
      "FastAPI",
      "Node.js",
      "Scikit-learn (NLP Classifier)",
      "React",
      "Chart.js",
      "PostgreSQL",
      "Supabase"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 0,
    "status": "PUBLISHED"
  }
];

module.exports = problemStatements;
