export const TOP_40_PROBLEMS = [
  {
    "problemId": "PS-001",
    "title": "VoiceSentry: Real-Time Synthetic Voice & Audio Deepfake Detector",
    "description": "Generative speech synthesis (ElevenLabs, VALL-E) allows malicious actors to clone human voices with just a 3-second\nsample. Traditional fraud prevention relies on caller ID or SMS OTPs, which are easily bypassed. Existing audio forensic\ntools are slow, offline, and require lab-grade signal processing, leaving consumers and call center agents defenseless\nagainst live voice impersonation.\n\nDesign a real-time audio analysis tool that listens to an incoming voice stream or uploaded audio, extracts acoustic and\nfrequency biomarkers, and provides an immediate confidence score indicating whether the voice is authentic human speech\nor AI-generated.",
    "background": "• THE CORE QUESTION:\nHow can an intelligent audio system instantly detect synthetic voice clones in live communication before financial fraud or\nsocial engineering succeeds?\n\n• THE PROBLEM GAP:\nGenerative speech synthesis (ElevenLabs, VALL-E) allows malicious actors to clone human voices with just a 3-second\nsample. Traditional fraud prevention relies on caller ID or SMS OTPs, which are easily bypassed. Existing audio forensic\ntools are slow, offline, and require lab-grade signal processing, leaving consumers and call center agents defenseless\nagainst live voice impersonation.\n\n• SCOPE GUIDANCE:\nTeams are not expected to train a foundation audio model from scratch. Focus on extracting key acoustic features (MFCCs,\nspectral roll-off, pitch jitter, phase continuity) and using a pre-trained classifier or fine-tuned model on synthetic/real audio\nbenchmarks.",
    "expectedSolution": "Acoustic Feature Inspection: Analyze anomalous pitch consistency and unnatural frequency cutoffs typical of synthetic\naudio.\n\n• Real-Time Confidence Gauge: Visual latency meter showing live risk level (Authentic, Suspicious, Cloned).\n\n• Audio Spectrogram Visualizer: Highlight tampered frequency bins for forensic explainability.",
    "requirements": [
      "Detection Accuracy on Test Audio (40%)",
      "Forensic Explainability & Spectrogram Insights (30%)",
      "Real-time Latency & UX (30%)"
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
      "FastAPI"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-003",
      "ALPHA-035"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-002",
    "title": "VisionGuard: Smart CCTV Perimeter Intrusion & Unattended Baggage Sentinel",
    "description": "Most campus and commercial CCTV setups are strictly passive: security guards watch multi-screen walls with inevitable\nfatigue, or footage is reviewed only after an incident occurs. Conventional video analytics tools are rigid, trigger hundreds of\nfalse alarms on animals or shadows, and fail to track stationary unattended objects over time.\n\nDevelop an intelligent vision monitoring dashboard that ingests live webcam or recorded CCTV streams, allows security\nofficers to draw virtual perimeter tripwires, and autonomously flags boundary intrusions and unattended baggage lasting\nover 15 seconds.",
    "background": "• THE CORE QUESTION:\nHow can standard, low-cost CCTV infrastructure be transformed into an autonomous spatial intelligence sentinel without\nrequiring expensive edge hardware?\n\n• THE PROBLEM GAP:\nMost campus and commercial CCTV setups are strictly passive: security guards watch multi-screen walls with inevitable\nfatigue, or footage is reviewed only after an incident occurs. Conventional video analytics tools are rigid, trigger hundreds of\nfalse alarms on animals or shadows, and fail to track stationary unattended objects over time.\n\n• SCOPE GUIDANCE:\nTeams do not need massive physical CCTV camera networks. Use sample CCTV footage or local webcam feeds with\nsimulated objects (backpacks, bags) and test persons to demonstrate tripwire breach and object abandoned time-tracking.",
    "expectedSolution": "Dynamic Tripwire Configuration: Draw polygon zones and crossing lines on live video feeds.\n\n• Object Association & Dwell Timer: Track who placed a bag and start an alert timer if the owner walks away.\n\n• Instant Alert Generation: Generate audio siren triggers, snapshot logging, and Telegram/WebSocket alerts.",
    "requirements": [
      "Detection Precision & Object Tracking Consistency (40%)",
      "Usability of Security Monitoring UI (30%)",
      "Alert Latency & Edge Optimization (30%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-011",
      "ALPHA-014"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-003",
    "title": "MediScan AI: Explainable Primary Retinal & Dermatological Diagnostic Screener",
    "description": "Over 70% of primary health centers in rural regions lack ophthalmologists and dermatologists. Patients travel hundreds of\nkilometers for routine screenings of diabetic retinopathy or malignant skin lesions. Existing AI diagnostic apps function as\nblack boxes, outputting opaque percentages that clinicians distrust and cannot explain to patients.\n\nCreate an explainable diagnostic screener that takes fundus or skin lesion images, determines condition severity stages,\nand visually highlights the exact pathological markers driving the decision using Grad-CAM heatmaps.",
    "background": "• THE CORE QUESTION:\nHow can frontline rural health workers receive instant, explainable second opinions on medical imagery without relying on\nabsent specialists?\n\n• THE PROBLEM GAP:\nOver 70% of primary health centers in rural regions lack ophthalmologists and dermatologists. Patients travel hundreds of\nkilometers for routine screenings of diabetic retinopathy or malignant skin lesions. Existing AI diagnostic apps function as\nblack boxes, outputting opaque percentages that clinicians distrust and cannot explain to patients.\n\n• SCOPE GUIDANCE:\nUse open benchmark datasets (Kaggle APTOS, EyePACS, or ISIC Skin Cancer dataset). The focus is not 99.9% clinical\nvalidation, but on decision explainability, confidence intervals, and clinician-friendly interface design.",
    "expectedSolution": "Multi-Condition Triage: Screen uploaded images for severity levels (Normal, Mild, Moderate, Severe).\n\n• Visual Decision Grounding: Overlay Grad-CAM attention heatmaps pinpointing microaneurysms or lesions.\n\n• Clinical Summary Report: Export a structured patient advisory sheet explaining findings in layperson terms.",
    "requirements": [
      "Explainability & Heatmap Quality (40%)",
      "Model Classification Coherence (30%)",
      "Healthcare Worker Interface Simplicity (30%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-058",
      "ALPHA-059"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-004",
    "title": "AgriDoctor: Multilingual Crop Leaf Disease Identifier & Voice Advisory",
    "description": "Plant diseases destroy up to 40% of smallholder harvest yields annually. When crop infestations strike, farmers struggle to\nidentify the exact fungal or bacterial pathogen. Existing diagnostic platforms return dense scientific names in English and\npush expensive commercial chemicals that farmers cannot afford or obtain locally.\n\nBuild an offline-ready mobile web tool where farmers upload or capture a photo of an infected leaf, receive an instant\nidentification of the disease, and listen to spoken, practical, low-cost organic treatment steps in vernacular Indian\nlanguages.",
    "background": "• THE CORE QUESTION:\nHow can AI turn a smartphone camera into a localized agricultural expert that diagnoses crop pests and speaks organic\nremedies in native dialects?\n\n• THE PROBLEM GAP:\nPlant diseases destroy up to 40% of smallholder harvest yields annually. When crop infestations strike, farmers struggle to\nidentify the exact fungal or bacterial pathogen. Existing diagnostic platforms return dense scientific names in English and\npush expensive commercial chemicals that farmers cannot afford or obtain locally.\n\n• SCOPE GUIDANCE:\nUse pre-trained models on the PlantVillage dataset (covering potato, tomato, corn, etc.). Prioritize multilingual\ntext-to-speech feedback and practical, actionable farming remedies over rare crop edge cases.",
    "expectedSolution": "Visual Pathogen Identification: Detect leaf blights, rusts, and pest damage from camera photos.\n\n• Vernacular Voice Synthesis: Read out remedies in Hindi, Tamil, Telugu, etc., using Web Speech/TTS.\n\n• Cost-Effective Remedy Engine: Prioritize bio-pesticides (neem oil, buttermilk spray) over chemical brands.",
    "requirements": [
      "Farmer-Centric UX & Voice Accessibility (40%)",
      "Diagnosis Accuracy & Remedy Relevance (30%)",
      "Lightweight Mobile Responsiveness (30%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-023"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-005",
    "title": "SignBridge Lite: One-Way ISL Gesture-to-Speech Translator (Core Vocabulary)",
    "description": "Over 18 million hearing and speech-impaired individuals in India struggle daily at railway ticket windows, banks, and post\noffices due to the absence of sign language interpreters. Existing translator apps are static dictionary lookup tables that\nrequire typing, defeating the purpose of seamless face-to-face conversation.\n\nDevelop an interactive, bidirectional camera communication bridge that tracks hand and facial landmarks to translate live\nIndian Sign Language gestures into spoken audio/text, and converts the clerk's spoken responses back into animated/visual\nsign sequences.",
    "background": "• THE CORE QUESTION:\nHow can real-time computer vision dismantle the communication wall between hearing-impaired citizens and public service\ncounters?\n\n• THE PROBLEM GAP:\nOver 18 million hearing and speech-impaired individuals in India struggle daily at railway ticket windows, banks, and post\noffices due to the absence of sign language interpreters. Existing translator apps are static dictionary lookup tables that\nrequire typing, defeating the purpose of seamless face-to-face conversation.\n\n• SCOPE GUIDANCE:\nFocus on a core operational vocabulary (numbers, common emergency words, public counter interactions like 'ticket', 'help',\n'money', 'where', 'train'). Focus on fluid real-time landmark tracking rather than parsing complex multi-sentence sign\ngrammar.",
    "expectedSolution": "Dynamic Hand Landmark Tracking: 21-point MediaPipe hand landmark tracking without wearable gloves.\n\n• Sign-to-Speech Conversion: Translate sign gestures into fluid spoken audio via browser speech synthesis.\n\n• Reverse Translation: Listen to counter speech and render corresponding sign gesture cards or animated avatar.",
    "requirements": [
      "Landmark Tracking Fluidity & Gesture Accuracy (40%)",
      "Bidirectional Flow & Communication Usability (35%)",
      "Technical Architecture & Latency (25%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-048"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-006",
    "title": "SignAvatar Lite: Text-to-Sign Visual Reply Player (Core Vocabulary)",
    "description": "Over 18 million hearing and speech-impaired individuals in India struggle daily at railway ticket windows, banks, and post\noffices due to the absence of sign language interpreters. Existing translator apps are static dictionary lookup tables that\nrequire typing, defeating the purpose of seamless face-to-face conversation.\n\nDevelop an interactive, bidirectional camera communication bridge that tracks hand and facial landmarks to translate live\nIndian Sign Language gestures into spoken audio/text, and converts the clerk's spoken responses back into animated/visual\nsign sequences.",
    "background": "• THE CORE QUESTION:\nHow can real-time computer vision dismantle the communication wall between hearing-impaired citizens and public service\ncounters?\n\n• THE PROBLEM GAP:\nOver 18 million hearing and speech-impaired individuals in India struggle daily at railway ticket windows, banks, and post\noffices due to the absence of sign language interpreters. Existing translator apps are static dictionary lookup tables that\nrequire typing, defeating the purpose of seamless face-to-face conversation.\n\n• SCOPE GUIDANCE:\nFocus on a core operational vocabulary (numbers, common emergency words, public counter interactions like 'ticket', 'help',\n'money', 'where', 'train'). Focus on fluid real-time landmark tracking rather than parsing complex multi-sentence sign\ngrammar.",
    "expectedSolution": "Dynamic Hand Landmark Tracking: 21-point MediaPipe hand landmark tracking without wearable gloves.\n\n• Sign-to-Speech Conversion: Translate sign gestures into fluid spoken audio via browser speech synthesis.\n\n• Reverse Translation: Listen to counter speech and render corresponding sign gesture cards or animated avatar.",
    "requirements": [
      "Landmark Tracking Fluidity & Gesture Accuracy (40%)",
      "Bidirectional Flow & Communication Usability (35%)",
      "Technical Architecture & Latency (25%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-049"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-007",
    "title": "SafeFleet: Driver Drowsiness, Yawning & Distraction Warning Sentinel",
    "description": "Driver fatigue and microsleeps cause over 30% of nighttime commercial vehicle crashes. Traditional hardware setups\nrequire expensive steering sensors or infrared eye trackers that transport operators cannot afford. Simple timer reminders\nignore the driver's actual physical condition and fail to act during critical microsleep moments.\n\nBuild a lightweight, webcam-based driver safety companion that monitors facial landmarks in real time, computes Eye\nAspect Ratio (EAR) and Mouth Aspect Ratio (MAR) to detect microsleeps, continuous yawning, and distraction (looking\naway), triggering escalating audio alarms.",
    "background": "• THE CORE QUESTION:\nHow can non-intrusive edge computer vision prevent fatal highway collisions by detecting driver fatigue seconds before a\ncrash?\n\n• THE PROBLEM GAP:\nDriver fatigue and microsleeps cause over 30% of nighttime commercial vehicle crashes. Traditional hardware setups\nrequire expensive steering sensors or infrared eye trackers that transport operators cannot afford. Simple timer reminders\nignore the driver's actual physical condition and fail to act during critical microsleep moments.\n\n• SCOPE GUIDANCE:\nRun the system on a standard laptop webcam. Simulated sleep (closing eyes for >2 seconds), yawning, and turning heads\nshould trigger the alerts reliably under variable lighting conditions.",
    "expectedSolution": "Real-Time Facial Geometric Ratios: Compute 68-point landmarks to calculate eye aspect ratio dynamically.\n\n• Adaptive Fatigue Thresholding: Account for individual natural eye blink baselines.\n\n• Escalating Audio Intervention: Trigger loud audio sirens and visual dashboard flashers upon sustained closure.",
    "requirements": [
      "Fatigue & Yawn Detection Responsiveness (40%)",
      "Zero-Lag Real-Time FPS Performance (35%)",
      "User Interface & Alarm Escalation Logic (25%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-050"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-008",
    "title": "LegalBrief AI: RAG-Powered Legal Contract Risk & Hidden Clause Analyzer",
    "description": "Freelancers, gig workers, and startup founders routinely sign 20-page service agreements and vendor contracts without\nlegal counsel. Hidden indemnity clauses, non-compete locks, and unilateral termination terms expose them to severe\nfinancial jeopardy. Standard chatbot summaries miss subtle legal loopholes and fail to explain why a clause is dangerous.\n\nDevelop an intelligent legal contract analyzer that parses legal PDF documents, uses Retrieval-Augmented Generation\n(RAG) against a knowledge base of fair contracting principles, and produces a clause-by-clause risk scorecard highlighting\nhostile terms in plain English.",
    "background": "• THE CORE QUESTION:\nHow can generative AI make legal contracts instantly transparent, identifying hostile liabilities and one-sided clauses for\nnon-lawyers?\n\n• THE PROBLEM GAP:\nFreelancers, gig workers, and startup founders routinely sign 20-page service agreements and vendor contracts without\nlegal counsel. Hidden indemnity clauses, non-compete locks, and unilateral termination terms expose them to severe\nfinancial jeopardy. Standard chatbot summaries miss subtle legal loopholes and fail to explain why a clause is dangerous.\n\n• SCOPE GUIDANCE:\nTeams do not need a full legal library. Ingest sample freelance, NDA, or employment agreements. Emphasize semantic\nsearch over text chunks, clear categorization of risks (Red, Amber, Green), and actionable renegotiation suggestions.",
    "expectedSolution": "Automated Clause Extraction: Segment contract into indemnification, liability, termination, and IP clauses.\n\n• Risk Scorecard & Plain-English Breakdown: Explain why a clause is unfavorable and suggest balanced wording.\n\n• Interactive Clause Q&A: Allow users to ask specific questions ('Can the client terminate without pay?').",
    "requirements": [
      "Accuracy of Legal Risk Identification (45%)",
      "Quality & Clarity of Plain-English Explanations (35%)",
      "Interface Design & Document Navigation (20%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-043"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-009",
    "title": "LiveFace: Interactive Face Liveness & Anti-Spoof Authentication",
    "description": "With remote video KYC and biometric exams becoming ubiquitous, presentation attacks have surged. Fraudsters hold\nhigh-definition tablet screens or curved color printouts in front of webcams to pass attendance and authentication. Static\nface recognition verifies identity but fails completely at verifying physical liveness.\n\nDesign an interactive face liveness detection module that issues random micro-challenges to the user (e.g., blink twice,\nsmile, turn head 30 degrees right) while running frequency texture analysis to detect screen glare, moiré patterns, and\nprinted paper edges.",
    "background": "• THE CORE QUESTION:\nHow can biometric verification prove a user is physically present without being tricked by high-resolution smartphone\nscreens or printed photos?\n\n• THE PROBLEM GAP:\nWith remote video KYC and biometric exams becoming ubiquitous, presentation attacks have surged. Fraudsters hold\nhigh-definition tablet screens or curved color printouts in front of webcams to pass attendance and authentication. Static\nface recognition verifies identity but fails completely at verifying physical liveness.\n\n• SCOPE GUIDANCE:\nFocus on detecting 2D presentation attacks (holding up a phone or photo). Implement a reliable challenge-response\nprotocol and basic texture/micro-movement heuristics rather than training multi-modal 3D mesh neural nets from scratch.",
    "expectedSolution": "Dynamic Challenge Sequencer: Issue randomized instructions that pre-recorded videos cannot predict.\n\n• Texture & Reflection Analysis: Detect high-frequency screen pixels, device borders, and paper curvature.\n\n• Seamless Verification State Machine: Pass or fail within 4-6 seconds with actionable user feedback.",
    "requirements": [
      "Anti-Spoofing Robustness against Screen/Photo Replay (45%)",
      "Verification Speed & Low Latency (30%)",
      "User Guidance & Interactive Challenge Flow (25%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-039"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-010",
    "title": "SmartScribe: Doctor-Patient Conversation Summarizer & Prescription Generator",
    "description": "Doctors spend nearly 40% of their working hours typing clinical notes into electronic health record systems. This\nadministrative burnout degrades doctor-patient communication and leads to incomplete records. Existing medical dictation\ntools require rigid voice commands and cannot extract structured insights from natural human dialogue.\n\nCreate an ambient clinical assistant that listens to audio recordings of doctor-patient consultations, automatically separates\nclinical facts from conversational banter, and extracts Chief Complaints, Symptoms, Diagnoses, and Prescribed Medications\ninto a clean, printable medical prescription PDF.",
    "background": "• THE CORE QUESTION:\nHow can ambient conversational AI liberate healthcare providers from screens and keyboards during clinical consultations?\n\n• THE PROBLEM GAP:\nDoctors spend nearly 40% of their working hours typing clinical notes into electronic health record systems. This\nadministrative burnout degrades doctor-patient communication and leads to incomplete records. Existing medical dictation\ntools require rigid voice commands and cannot extract structured insights from natural human dialogue.\n\n• SCOPE GUIDANCE:\nTeams can simulate consultations using synthetic dialogue audio or open clinical consultation datasets (e.g., MTSamples).\nFocus on natural language entity recognition (symptoms, drugs, dosages) and clinical summary structuring rather than\nreal-time speech recognition optimization.",
    "expectedSolution": "Ambient Conversation Ingestion: Transcribe raw consultation dialogue containing medical terminology.\n\n• Clinical Named Entity Recognition: Identify medications, dosages, duration, symptoms, and dietary advice.\n\n• Structured Prescription Generation: Export a standardized digital prescription ready for doctor sign-off.",
    "requirements": [
      "Extraction Accuracy for Clinical Entities (40%)",
      "Quality & Structure of Medical Summary (35%)",
      "Doctor Review & Editing Experience (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-007",
      "ALPHA-012"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-011",
    "title": "PhishGuard: Intelligent Email Threat Hunter & Header Geolocation Analyzer",
    "description": "Spear-phishing remains the primary initial attack vector for over 85% of corporate ransomware breaches. Modern attackers\nforge display names, leverage open redirect URLs, and exploit misconfigured SPF/DMARC records. Standard mail clients\nprovide no visibility into message headers, leaving users unable to assess risk.\n\nBuild an automated email security triage tool that accepts uploaded .eml files or pasted headers, parses RFC 822 routing\nheaders, validates SPF/DKIM/DMARC alignment, traces relay IP geolocation on a world map, and scans body content for\ndeceptive psychological triggers and suspicious URLs.",
    "background": "• THE CORE QUESTION:\nHow can an automated email analyzer uncover hidden spoofing, malicious attachments, and weaponized URLs before an\nemployee clicks?\n\n• THE PROBLEM GAP:\nSpear-phishing remains the primary initial attack vector for over 85% of corporate ransomware breaches. Modern attackers\nforge display names, leverage open redirect URLs, and exploit misconfigured SPF/DMARC records. Standard mail clients\nprovide no visibility into message headers, leaving users unable to assess risk.\n\n• SCOPE GUIDANCE:\nUse open sample phishing email corpora (e.g., Enron/SpamAssassin datasets or custom simulated phishing emails).\nEmphasize header parsing, cryptographic signature validation status, and threat score explainability.",
    "expectedSolution": "Header Integrity Parser: Validate SPF, DKIM, and DMARC alignment against the envelope sender.\n\n• Visual IP Relay Hop Map: Plot intermediate mail transfer agents across countries to highlight anomalous routes.\n\n• Content & URL Risk Engine: Flag lookalike domains, shortened URLs, and high-pressure social engineering keywords.",
    "requirements": [
      "Forensic Header Parsing & Integrity Verification (40%)",
      "Threat Scoring Logic & Geolocation Visualization (35%)",
      "Usability & Speed of Triage Report (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-029",
      "ALPHA-060"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-012",
    "title": "TrustDegree: Soulbound NFT-Based Academic Credential Verification Platform",
    "description": "Degree forgery and certificate mills undermine academic trust, forcing employers to hire third-party background check\nagencies that take 3-6 weeks per verification. Paper certificates and simple digital PDFs are trivial to modify in image\neditors, while centralized university databases face single-point-of-failure vulnerabilities and downtime.\n\nDevelop a decentralized academic credential platform on an EVM-compatible testnet (Polygon/Sepolia) where authorized\ninstitutions issue non-transferable Soulbound Tokens (SBTs) representing degrees to student wallet addresses,\naccompanied by a public QR verification portal for employers.",
    "background": "• THE CORE QUESTION:\nHow can decentralized ledger technology permanently eliminate degree certificate forgery and streamline instant worldwide\nemployment checks?\n\n• THE PROBLEM GAP:\nDegree forgery and certificate mills undermine academic trust, forcing employers to hire third-party background check\nagencies that take 3-6 weeks per verification. Paper certificates and simple digital PDFs are trivial to modify in image\neditors, while centralized university databases face single-point-of-failure vulnerabilities and downtime.\n\n• SCOPE GUIDANCE:\nDeploy on a testnet. The key is proving non-transferability (preventing students from selling or sending their degree NFT to\nothers), metadata hashing on IPFS, and a 1-click mobile verification view that displays credential legitimacy in seconds.",
    "expectedSolution": "Soulbound Smart Contract (ERC-5192 / Custom): Restrict token transfers to enforce permanent owner binding.\n\n• Decentralized Storage (IPFS): Pin academic transcript metadata, student details, and cryptographic hashes.\n\n• Instant Verifier Portal: Scan resume QR codes to instantly validate issuer public key and certificate status.",
    "requirements": [
      "Smart Contract Architecture & Security (40%)",
      "Non-Transferability & IPFS Integration (30%)",
      "Employer Verification Workflow (30%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-005"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-013",
    "title": "CryptoTrace: Multi-Hop Crypto Wallet Fund Flow & Money Laundering Visualizer",
    "description": "Criminal syndicates operating ransomware, investment scams, and cyber extortion rapidly route stolen cryptocurrency\nthrough peeling chains and mixer wallets across multiple hops. Investigating officers cannot track these transactions\nthrough standard block explorers, as reading tabular transaction lists with hundreds of hex addresses is nearly impossible.\n\nCreate an automated blockchain intelligence visualizer that takes a suspect wallet address, queries public blockchain APIs\n(Ethereum/Bitcoin), recursively maps transaction flows across up to 3 hops, and highlights anomalous fund splitting and\ninteractions with known exchange deposit wallets.",
    "background": "• THE CORE QUESTION:\nHow can visual graph intelligence untangle complex multi-wallet crypto dispersals and identify when illicit funds enter\nexchange off-ramps?\n\n• THE PROBLEM GAP:\nCriminal syndicates operating ransomware, investment scams, and cyber extortion rapidly route stolen cryptocurrency\nthrough peeling chains and mixer wallets across multiple hops. Investigating officers cannot track these transactions\nthrough standard block explorers, as reading tabular transaction lists with hundreds of hex addresses is nearly impossible.\n\n• SCOPE GUIDANCE:\nUse public testnet transactions or mainnet transaction histories via free APIs (Etherscan, Blockstream, Alchemy). Focus on\ngraph generation (nodes as wallets, edges as transactions with amounts) and identifying clustering behaviors.",
    "expectedSolution": "Recursive Transaction Graph Generation: Expand outgoing and incoming transactions into a directed graph.\n\n• Rapid Dispersal & Peel Chain Detection: Highlight wallets that immediately forward identical funds to split addresses.\n\n• Centralized Exchange Attribution: Flag transactions that terminate at known Binance/Coinbase hot wallets.",
    "requirements": [
      "Graph Visualization & Multi-Hop Navigation (45%)",
      "Heuristic Identification of Laundering Patterns (30%)",
      "Performance & API Throttling Handling (25%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-001"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-014",
    "title": "DataMask: Automated Document PII Redaction & Leak Prevention Sentinel",
    "description": "Government departments, universities, and legal registries frequently publish public PDF circulars, results, and case files\ncontaining unredacted national identification numbers, phone numbers, home addresses, and bank accounts. Black marker\nredactions or layered PDFs often fail, allowing attackers to select and copy the text hidden beneath.\n\nBuild a privacy-preserving document sanitizer that scans uploaded PDF and image documents, employs regular\nexpressions and Named Entity Recognition (NER) to detect sensitive personal identifiers, and produces an irreversibly\nflattened, redacted document with permanent blacked-out bounding boxes.",
    "background": "• THE CORE QUESTION:\nHow can public institutions publish digital notices and gazettes without accidentally leaking citizen identity numbers and\nfinancial data?\n\n• THE PROBLEM GAP:\nGovernment departments, universities, and legal registries frequently publish public PDF circulars, results, and case files\ncontaining unredacted national identification numbers, phone numbers, home addresses, and bank accounts. Black marker\nredactions or layered PDFs often fail, allowing attackers to select and copy the text hidden beneath.\n\n• SCOPE GUIDANCE:\nSupport standard scanned and text-based PDFs. The system must physically remove text streams and render redacted\nareas as permanent pixels, ensuring that no underlying text can be recovered through copy-paste or PDF text extractors.",
    "expectedSolution": "Multi-Modal PII Extraction: Detect citizen IDs, phone numbers, email addresses, and bank IFSC numbers.\n\n• Permanent Rasterized Redaction: Burn solid black blocks directly into rendered page images.\n\n• Dual-View Compliance Auditor: Provide side-by-side view showing detected entities and sanitized preview.",
    "requirements": [
      "Redaction Irreversibility & Security (40%)",
      "Detection Accuracy for PII Entities (35%)",
      "Document Formatting Preservation & UX (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-021",
      "ALPHA-025"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-015",
    "title": "NetSentry: Live Network Traffic Anomaly & DDoS Mitigation Sentinel",
    "description": "Cloud servers and campus intranets are subjected to constant automated port scanning, SSH brute force attacks, and\nvolumetric DDoS floods. Traditional firewalls rely on static IP blacklists, which fail against rotating residential proxies and\nnewly orchestrated botnets.\n\nDevelop an automated network traffic monitoring engine that ingests PCAP log streams or synthetic packet feeds, extracts\nstatistical features (packet arrival rate, protocol entropy, SYN/ACK ratios), and runs an anomaly detection model to flag\nattacks and dynamically output firewall block rules.",
    "background": "• THE CORE QUESTION:\nHow can behavioral packet analytics detect network intrusion scans and distributed denial-of-service floods before servers\ncollapse?\n\n• THE PROBLEM GAP:\nCloud servers and campus intranets are subjected to constant automated port scanning, SSH brute force attacks, and\nvolumetric DDoS floods. Traditional firewalls rely on static IP blacklists, which fail against rotating residential proxies and\nnewly orchestrated botnets.\n\n• SCOPE GUIDANCE:\nUse benchmark intrusion datasets (NSL-KDD, CIC-IDS2017) or simulated live Scapy packet streams. Focus on\ndistinguishing normal web browsing traffic from SYN floods and port sweeps.",
    "expectedSolution": "Statistical Flow Feature Extraction: Calculate rolling packet velocity, average payload size, and TCP flag distribution.\n\n• Unsupervised Anomaly Detection: Train an Isolation Forest / One-Class SVM to flag traffic outliers.\n\n• Automated Mitigation Output: Generate live iptables commands and visual bandwidth spike warnings.",
    "requirements": [
      "Anomaly Detection Precision & Low False Positives (40%)",
      "Live Dashboard Visualization & Flow Metrics (35%)",
      "Mitigation Rule Generation & Code Quality (25%)"
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
      "FastAPI"
    ],
    "maxTeamCapacity": 2,
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-008",
      "ALPHA-030"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-016",
    "title": "VulnHunter: Automated Web Application Security Fuzzer & Vulnerability Scanner",
    "description": "Developers frequently deploy web applications with critical vulnerabilities such as SQL injection, cross-site scripting (XSS),\nand exposed administrative files (.git, .env). Commercial enterprise vulnerability scanners (Qualys, Nessus) are expensive,\ncomplex, and heavy, while manual penetration testing cannot scale to continuous deployments.\n\nBuild a lightweight, automated web application vulnerability fuzzer that takes a local or staging URL, crawls endpoints and\nform inputs, injects non-destructive security payloads, and produces an actionable vulnerability remediation scorecard.",
    "background": "• THE CORE QUESTION:\nHow can student and startup web applications be continuously audited for critical OWASP Top 10 vulnerabilities before\nproduction deployment?\n\n• THE PROBLEM GAP:\nDevelopers frequently deploy web applications with critical vulnerabilities such as SQL injection, cross-site scripting (XSS),\nand exposed administrative files (.git, .env). Commercial enterprise vulnerability scanners (Qualys, Nessus) are expensive,\ncomplex, and heavy, while manual penetration testing cannot scale to continuous deployments.\n\n• SCOPE GUIDANCE:\nTest against intentionally vulnerable web applications (DVWA, Juice Shop, or a custom test Flask app). Focus on detecting\nSQLi error reflection, Reflected XSS execution proof, and sensitive endpoint discovery (.env, /admin).",
    "expectedSolution": "Automated Endpoint & Form Crawler: Extract all `<form>` action parameters, query strings, and routes.\n\n• Payload Injection Engine: Test parameterized payloads for SQL syntax errors and HTML script reflection.\n\n• Actionable Developer Report: Detail exact reproduction steps, affected URLs, and code-level remediation advice.",
    "requirements": [
      "Vulnerability Detection Accuracy without False Positives (40%)",
      "Safe Fuzzing Execution & Reporting Clarity (35%)",
      "Crawler Depth & Form Handling (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-027",
      "ALPHA-054"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-017",
    "title": "RapidTriage: Endpoint Incident Response & Digital Forensic Timeline Extractor",
    "description": "When a corporate workstation or lab PC is suspected of infection, incident responders must quickly understand what\noccurred: what files were downloaded, what USB drives were inserted, and what commands were executed. Manually\nopening Windows Event Viewer, registry hives, and browser databases takes hours, during which malware may erase\nevidence.\n\nCreate a portable forensic triage script that runs on an endpoint, extracts key volatile artifacts (browser SQLite history, USB\ninsertion registry keys, recently executed programs via UserAssist/Prefetch, and active network connections), and visualizes\na unified chronological incident timeline.",
    "background": "• THE CORE QUESTION:\nHow can a first responder reconstruct the timeline of an endpoint cyber compromise in under 3 minutes without tampering\nwith evidence?\n\n• THE PROBLEM GAP:\nWhen a corporate workstation or lab PC is suspected of infection, incident responders must quickly understand what\noccurred: what files were downloaded, what USB drives were inserted, and what commands were executed. Manually\nopening Windows Event Viewer, registry hives, and browser databases takes hours, during which malware may erase\nevidence.\n\n• SCOPE GUIDANCE:\nSimulate endpoint artifacts on a local machine or process sample registry and browser database files. Focus on timeline\nreconstruction and highlighting anomalous activities (e.g. executable launched from temp directory after suspicious\ndownload).",
    "expectedSolution": "Multi-Artifact Parser: Parse SQLite history from Chrome/Firefox, USB serial keys, and execution logs.\n\n• Chronological Incident Timeline: Assemble events from multiple sources into a single navigable timeline.\n\n• Suspicious Activity Highlighting: Flag processes running from `%AppData%` or execution right after download.",
    "requirements": [
      "Timeline Correlation & Artifact Extraction Accuracy (45%)",
      "Forensic Integrity & Non-Destructive Operation (30%)",
      "Dashboard Clarity & Filterability (25%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-026"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-018",
    "title": "AgriLedger: Farm-to-Fork Transparent Organic Produce Provenance DApp",
    "description": "Organic food markets command a 30-50% price premium, creating an enormous incentive for unscrupulous suppliers to\nlabel conventionally grown, pesticide-treated crops as 'organic.' Centralized certification paper labels are easily forged, and\nconsumers have no verifiable proof of farm origin or chemical residue testing.\n\nDevelop an end-to-end decentralized food provenance application on an EVM testnet where certified farmers log harvest\nbatches, licensed labs upload verifiable pesticide-free test certificates to IPFS, and consumers scan packaging QR codes to\nview the immutable lifecycle.",
    "background": "• THE CORE QUESTION:\nHow can consumers be guaranteed that organic produce is truly authentic, unadulterated, and sustainably cultivated?\n\n• THE PROBLEM GAP:\nOrganic food markets command a 30-50% price premium, creating an enormous incentive for unscrupulous suppliers to\nlabel conventionally grown, pesticide-treated crops as 'organic.' Centralized certification paper labels are easily forged, and\nconsumers have no verifiable proof of farm origin or chemical residue testing.\n\n• SCOPE GUIDANCE:\nDeploy a prototype smart contract tracking 3 key milestones: Harvest Log $\\rightarrow$ Lab Certification $\\rightarrow$\nDistribution Hub. Consumer scans a dynamic QR code on their smartphone to view the verified timeline.",
    "expectedSolution": "Provenance Smart Contract: Record batch IDs, timestamped transitions, and authorized actor signatures.\n\n• IPFS Lab Certificate Storage: Pin decentralized lab reports and geotagged farm photos on IPFS.\n\n• Consumer Verification View: Clean mobile UI showing farm location, harvest date, and lab approval hash.",
    "requirements": [
      "Smart Contract Integrity & Role-Based Permissions (40%)",
      "Decentralized File Storage & Data Linking (30%)",
      "Consumer Trust UI & QR Scan Experience (30%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-055"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-019",
    "title": "AndroidStaticScan: Automated Mobile APK Security & Secret Leak Auditor",
    "description": "Mobile developers frequently ship Android apps with compiled-in production AWS secret keys, Firebase URLs with open\nread/write rules, and excessive permission requests. Attackers routinely decompile APKs using free tools to harvest these\ncredentials, gaining unauthorized access to cloud backends and user databases.\n\nCreate an automated static analysis tool that accepts an uploaded Android APK file, extracts and parses the\nAndroidManifest.xml and decompiled DEX bytecode, scans for hardcoded secrets and tokens using regex rules, and\nevaluates permission risks against security best practices.",
    "background": "• THE CORE QUESTION:\nHow can developers detect leaked API keys, hardcoded database credentials, and dangerous Android permissions in\ncompiled mobile APKs?\n\n• THE PROBLEM GAP:\nMobile developers frequently ship Android apps with compiled-in production AWS secret keys, Firebase URLs with open\nread/write rules, and excessive permission requests. Attackers routinely decompile APKs using free tools to harvest these\ncredentials, gaining unauthorized access to cloud backends and user databases.\n\n• SCOPE GUIDANCE:\nTest on open-source APKs or build a sample test APK with dummy leaked API keys. Focus on manifest permission risk\nscoring and regex detection of high-value secrets (Google API keys, AWS credentials, private keys).",
    "expectedSolution": "APK Decompilation & Extraction: Extract manifest structure, package names, and readable string constants.\n\n• Hardcoded Secret Scanner: Scan for AWS access keys, JWT tokens, Stripe keys, and cleartext passwords.\n\n• Permission & Component Risk Matrix: Flag exported activities, broadcast receivers, and excessive permissions.",
    "requirements": [
      "Secret Detection Accuracy & Regex Coverage (45%)",
      "Permission Security Assessment & Risk Grading (30%)",
      "Report Usability for Developers (25%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-016"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-020",
    "title": "PassZero: Passwordless Biometric WebAuthn Authentication & Key Vault",
    "description": "Passwords are the single weakest link in digital security. Users reuse simple passwords across personal and academic\nservices, leaving them vulnerable to data breaches, phishing, and credential-stuffing bots. Multi-factor authentication via\nSMS OTP is also susceptible to SIM-swapping and social engineering.\n\nBuild a modern passwordless authentication portal implementing the W3C WebAuthn / FIDO2 standard, enabling users to\nregister and sign in using their laptop/phone's native biometric sensors (TouchID, Windows Hello) via public-key\ncryptography, with no passwords ever sent or stored.",
    "background": "• THE CORE QUESTION:\nHow can organizations eradicate phishing and credential theft by eliminating passwords entirely in favor of cryptographic\ndevice biometrics?\n\n• THE PROBLEM GAP:\nPasswords are the single weakest link in digital security. Users reuse simple passwords across personal and academic\nservices, leaving them vulnerable to data breaches, phishing, and credential-stuffing bots. Multi-factor authentication via\nSMS OTP is also susceptible to SIM-swapping and social engineering.\n\n• SCOPE GUIDANCE:\nImplement WebAuthn ceremony flows (Registration and Authentication). Demonstrate that the server stores only public\nkeys and counter values, ensuring that a database compromise leaks zero user credentials.",
    "expectedSolution": "FIDO2 / WebAuthn Protocol Flow: Implement challenge generation, client-side credential creation, and verification.\n\n• Biometric Sensor Interfacing: Leverage browser `navigator.credentials.create` and `.get` APIs.\n\n• Secure User Session Dashboard: Display cryptographic public key details and active biometric authenticators.",
    "requirements": [
      "WebAuthn Standard Compliance & Cryptographic Soundness (45%)",
      "User Onboarding & Biometric Authentication Flow (35%)",
      "Zero-Knowledge Server Security Architecture (20%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-053"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-021",
    "title": "AgroPrice Lite: One-Commodity Mandi Price Forecast & Nearby Arbitrage Dashboard",
    "description": "Smallholder farmers frequently sell crops at steep losses because wholesale mandi prices crash unexpectedly during\nharvest gluts. Simultaneously, a mandi just 60 km away might be trading the same crop at a 30% higher price due to\nlocalized supply deficits. Farmers have zero access to predictive price intelligence.\n\nDevelop a predictive market analytics dashboard that trains on historical wholesale commodity price records (Agmarknet\ndata), forecasts price trends for the next 15-30 days, and recommends the most lucrative mandi within a 100 km radius\nfactoring in transport costs.",
    "background": "• THE CORE QUESTION:\nHow can predictive data science protect farmers from distress sales by forecasting harvest prices and pinpointing profitable\nregional markets?\n\n• THE PROBLEM GAP:\nSmallholder farmers frequently sell crops at steep losses because wholesale mandi prices crash unexpectedly during\nharvest gluts. Simultaneously, a mandi just 60 km away might be trading the same crop at a 30% higher price due to\nlocalized supply deficits. Farmers have zero access to predictive price intelligence.\n\n• SCOPE GUIDANCE:\nUse open Agmarknet datasets for commodities like onion, potato, or pulses. Focus on time-series forecasting (Prophet,\nARIMA, or XGBoost) and spatial price comparison between nearby market yards.",
    "expectedSolution": "Time-Series Price Forecasting: Model seasonal price trends and generate 15-day price trajectories.\n\n• Mandi Arbitrage Map: Visualize nearby mandis with price differentials and net profit estimates.\n\n• Best-Time-To-Sell Indicator: Actionable recommendation indicating whether to harvest now or store produce.",
    "requirements": [
      "Forecasting Accuracy & Model Validation (40%)",
      "Practical Economic Value & Arbitrage Logic (35%)",
      "Visualization & Map Usability (25%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-009"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-022",
    "title": "GridPulse: Campus/City Microgrid Electricity Demand Forecaster & Peak Spikes Alert",
    "description": "Universities and industrial campuses face massive surge tariffs when peak electricity consumption exceeds their sanctioned\ncontract demand. Renewable rooftop solar generation is intermittent, and facility managers lack foresight into upcoming\ndemand spikes driven by ambient temperature and class schedules.\n\nBuild an intelligent energy demand forecasting system that trains on historical hourly power consumption, ambient weather\nmetrics (temperature, humidity), and calendar schedules to forecast the upcoming 24-hour load curve and predict peak\ndemand threshold breaches.",
    "background": "• THE CORE QUESTION:\nHow can multivariate energy analytics predict campus power surges and schedule battery storage to prevent blackout\npenalties?\n\n• THE PROBLEM GAP:\nUniversities and industrial campuses face massive surge tariffs when peak electricity consumption exceeds their sanctioned\ncontract demand. Renewable rooftop solar generation is intermittent, and facility managers lack foresight into upcoming\ndemand spikes driven by ambient temperature and class schedules.\n\n• SCOPE GUIDANCE:\nUse open building energy datasets or simulated hourly smart-meter records. Emphasize feature engineering (lagged\nconsumption, weather correlation) and actionable battery dispatch alerts before peak load hits.",
    "expectedSolution": "Multivariate Load Forecasting: Predict next 24-hour electricity demand in megawatts/kilowatts.\n\n• Peak Exceedance Early Warning: Trigger visual alerts 4 hours before projected contract limit breaches.\n\n• Smart Battery Optimization: Recommend optimal hours to charge from solar and discharge to offset grid load.",
    "requirements": [
      "Predictive Accuracy on Load Curves (40%)",
      "Feature Engineering & Weather Correlation (30%)",
      "Energy Management Dashboard Usability (30%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-010"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-023",
    "title": "HydroCast Lite: Interactive Groundwater Budget & Recharge Pit Sizer",
    "description": "Over 60% of rural and peri-urban districts face critical groundwater depletion due to unmonitored borewell drilling.\nPanchayat heads and local builders have no predictive insight into seasonal water table drops, leading to dry borewells and\nmassive expenditures on private water tankers.\n\nDesign an interactive predictive hydrology dashboard where users select a district or soil type, input historical rainfall and\nseasonal extraction rates, and forecast the water table depth trajectory over the next 12 months, calculating the exact\nrainwater harvesting recharge pit dimensions needed to stabilize the aquifer.",
    "background": "• THE CORE QUESTION:\nHow can spatial data science forecast subterranean water table shifts and calculate exact rooftop recharge requirements for\ndrought resilience?\n\n• THE PROBLEM GAP:\nOver 60% of rural and peri-urban districts face critical groundwater depletion due to unmonitored borewell drilling.\nPanchayat heads and local builders have no predictive insight into seasonal water table drops, leading to dry borewells and\nmassive expenditures on private water tankers.\n\n• SCOPE GUIDANCE:\nUse open Central Ground Water Board (CGWB) data or simulated regional hydrology figures. Focus on spatial regression\nmodeling and practical engineering formulas for rainwater recharge sizing.",
    "expectedSolution": "Aquifer Level Trend Forecaster: Predict seasonal water table rise and fall based on rainfall deficit.\n\n• Aquifer Stress Classification: Categorize zones into Safe, Semi-Critical, and Over-Exploited.\n\n• Rainwater Sizing Calculator: Output custom recharge pit dimensions based on rooftop square footage.",
    "requirements": [
      "Hydrological Modeling Consistency (40%)",
      "Practicality of Rainwater Harvesting Calculations (35%)",
      "Spatial Mapping & User Accessibility (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-018",
      "ALPHA-019"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-024",
    "title": "FraudLocate Lite: Mule Withdrawal Hotspot Mapper & Patrol Route Suggester",
    "description": "When victims report cyber financial fraud to police helplines (1930), stolen money is rapidly split across multiple 'mule' bank\naccounts and withdrawn at physical ATMs within hours. Law enforcement patrol teams struggle to intercept fraudsters\nbecause they lack predictive intelligence on which ATM clusters and neighborhoods are being actively targeted.\n\nDevelop a predictive geospatial analytics engine that ingests simulated cybercrime complaint logs (timestamps, mule bank\nbranches, ATM withdrawal locations), applies spatial clustering (DBSCAN) and time-decay modeling, and highlights\nhigh-probability ATM zones where withdrawals are anticipated over the next 2-4 hours.",
    "background": "• THE CORE QUESTION:\nHow can geospatial clustering anticipate where money mules will withdraw cyber fraud proceeds in the golden hour after a\nscam?\n\n• THE PROBLEM GAP:\nWhen victims report cyber financial fraud to police helplines (1930), stolen money is rapidly split across multiple 'mule' bank\naccounts and withdrawn at physical ATMs within hours. Law enforcement patrol teams struggle to intercept fraudsters\nbecause they lack predictive intelligence on which ATM clusters and neighborhoods are being actively targeted.\n\n• SCOPE GUIDANCE:\nUse synthetic or anonymized cybercrime complaint feeds. Focus on clustering spatial coordinates of known mule\nwithdrawals and calculating police patrol intercept routes.",
    "expectedSolution": "Spatial Clustering Engine: Use DBSCAN / K-Means to identify recurring ATM withdrawal hotspots.\n\n• Time-Decay Risk Scoring: Weight recent withdrawals higher to predict immediate next targets.\n\n• Police Dispatch Map: Visualize high-alert zones with suggested patrol interception radiuses.",
    "requirements": [
      "Geospatial Clustering Logic & Predictive Value (45%)",
      "Heatmap Visualization & Filtering UI (30%)",
      "Analytical Coherence on Simulated Data (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-015",
      "ALPHA-045"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-025",
    "title": "FareRadar Lite: Airfare History Dashboard & Buy-Wait Heuristic",
    "description": "Airlines employ opaque dynamic pricing algorithms that adjust ticket fares based on booking velocity, days to departure, and\nuser cookies. Consumers face immense anxiety, either overpaying by booking prematurely or waiting too long and getting\npriced out by sudden surge hikes.\n\nBuild an airfare price tracking and predictive intelligence engine that analyzes historical domestic flight fares, computes a\nroute-specific Price Volatility Index, and provides a clear 'Buy Now' vs. 'Wait for Price Drop' recommendation with projected\nprice trajectories.",
    "background": "• THE CORE QUESTION:\nHow can predictive price tracking demystify dynamic airline pricing and tell travelers whether to book now or wait for a price\ndip?\n\n• THE PROBLEM GAP:\nAirlines employ opaque dynamic pricing algorithms that adjust ticket fares based on booking velocity, days to departure, and\nuser cookies. Consumers face immense anxiety, either overpaying by booking prematurely or waiting too long and getting\npriced out by sudden surge hikes.\n\n• SCOPE GUIDANCE:\nUse flight fare datasets or query free travel APIs across major metro routes (e.g. Delhi-Bangalore, Mumbai-Chennai). Focus\non price trend regression and classification of price drops.",
    "expectedSolution": "Historical Trend & Volatility Index: Quantify price fluctuations for specific flight routes over time.\n\n• Buy vs. Wait Recommendation: Classification model predicting whether the fare will drop within 7 days.\n\n• Interactive Fare History Chart: Visual trajectory comparing current fare against median historical prices.",
    "requirements": [
      "Model Predictive Quality & Backtesting (40%)",
      "Usability & Transparency of Recommendations (35%)",
      "Data Pipeline Efficiency (25%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-056"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-026",
    "title": "DropOutShield: Student Academic Risk Scoring & Early Intervention Engine",
    "description": "Universities lose thousands of students each year to academic dropout, often triggered by early failure in foundational\ncourses, attendance slumps, or financial distress. Faculty advisors only discover these problems at the end of the semester\nafter grades are finalized, when it is too late to rescue the student's academic standing.\n\nCreate an early-warning predictive analytics portal for academic mentors that trains on student semester marks, continuous\ninternal assessment trends, attendance decline rates, and LMS engagement, generating a personalized academic risk\nscore (Low, Medium, High) with explainable risk drivers.",
    "background": "• THE CORE QUESTION:\nHow can institutional data science identify students on the verge of dropping out early enough for counselors to intervene?\n\n• THE PROBLEM GAP:\nUniversities lose thousands of students each year to academic dropout, often triggered by early failure in foundational\ncourses, attendance slumps, or financial distress. Faculty advisors only discover these problems at the end of the semester\nafter grades are finalized, when it is too late to rescue the student's academic standing.\n\n• SCOPE GUIDANCE:\nUse open educational data (e.g., Open University Learning Analytics Dataset - OULAD) or synthetic college student\nrecords. Emphasize model explainability (SHAP values) so mentors know exactly why a student was flagged.",
    "expectedSolution": "Multi-Factor Risk Classifier: Predict probability of academic probation or course dropout.\n\n• Explainable Risk Drivers (SHAP/Feature Importance): Pinpoint key contributors (e.g., 40% drop in Math II attendance).\n\n• Advisor Intervention Workflow: Enable mentors to log counseling notes and track student recovery progress.",
    "requirements": [
      "Predictive Model Precision & Recall on At-Risk Cohorts (40%)",
      "Explainability & Root-Cause Insight (35%)",
      "Mentor Dashboard Design (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-033",
      "ALPHA-042"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-027",
    "title": "CrimeNet: Telecom CDR Call-Chain Graph Analyzer & Syndicate Identifier",
    "description": "During major criminal investigations, police teams receive Excel spreadsheets containing hundreds of thousands of Call\nDetail Records (CDRs) from telecom operators. Officers spend days manually cross-referencing phone numbers and cell\ntowers in spreadsheets, often missing the shadowy coordinator who only communicates via intermediaries.\n\nDevelop an automated graph analytics and network intelligence tool that ingests raw telecom CDR files, constructs a\ndirected communication graph, calculates network centrality metrics (Degree, Betweenness, Closeness) to isolate syndicate\nringleaders, and maps common cell-tower locations.",
    "background": "• THE CORE QUESTION:\nHow can graph algorithms automatically uncover criminal hierarchy and hidden conspirators from thousands of raw call\ndetail records?\n\n• THE PROBLEM GAP:\nDuring major criminal investigations, police teams receive Excel spreadsheets containing hundreds of thousands of Call\nDetail Records (CDRs) from telecom operators. Officers spend days manually cross-referencing phone numbers and cell\ntowers in spreadsheets, often missing the shadowy coordinator who only communicates via intermediaries.\n\n• SCOPE GUIDANCE:\nUse synthetic CDR datasets (caller, receiver, timestamp, duration, cell tower coordinates). Focus on network graph\nalgorithms and visual exploration of connected components.",
    "expectedSolution": "Network Graph Construction: Model phone numbers as nodes and calls as directed weighted edges.\n\n• Centrality Metric Analysis: Automatically identify the top 3 'bridge' coordinators using Betweenness Centrality.\n\n• Spatio-Temporal Filter: Pinpoint instances where two suspect numbers pinged the same cell tower concurrently.",
    "requirements": [
      "Graph Analytics Depth & Algorithmic Rigor (45%)",
      "Interactive Graph Exploration & Filtering UI (35%)",
      "Data Ingestion & Scalability on Large Logs (20%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-013"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-028",
    "title": "CivicAudit: Anomaly & Fraud Detection in Public Works Fund Allocations",
    "description": "Billions in public funds are lost annually to corruption in municipal public works. Corrupt contractors collude to submit\nartificial bids, split large contracts just below tender approval thresholds, and repeatedly inflate budgets through delayed\nproject extensions. Manual audits examine less than 5% of all files.\n\nBuild an automated public expenditure anomaly detection engine that parses public works project data (sanctioned\namounts, contractor IDs, project duration, completion delays), flags statistical outliers, and visualizes suspicious contractor\nmonopolies and split-billing clusters.",
    "background": "• THE CORE QUESTION:\nHow can machine learning identify corrupt contractor cartels, split tenders, and budget inflation in municipal civic projects?\n\n• THE PROBLEM GAP:\nBillions in public funds are lost annually to corruption in municipal public works. Corrupt contractors collude to submit\nartificial bids, split large contracts just below tender approval thresholds, and repeatedly inflate budgets through delayed\nproject extensions. Manual audits examine less than 5% of all files.\n\n• SCOPE GUIDANCE:\nUse open government procurement datasets or simulated municipal tender records. Apply unsupervised outlier detection\n(Isolation Forest, Local Outlier Factor) to identify suspicious bidding and execution patterns.",
    "expectedSolution": "Unsupervised Anomaly Scoring: Detect contracts with abnormal cost-to-time ratios or sudden cost revisions.\n\n• Cartel & Split-Tender Detection: Flag repeated contract awards clustered just below mandatory audit thresholds.\n\n• Civic Transparency Scorecard: Provide an executive dashboard ranking departments and contractors by risk.",
    "requirements": [
      "Outlier Detection Validity & Analytical Depth (40%)",
      "Anomaly Explainability & Procurement Heuristics (35%)",
      "Dashboard Visualizations (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-022",
      "ALPHA-038"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-029",
    "title": "PulseCrisis: Real-Time Disaster Tweet SOS Extractor & Resource Heatmap",
    "description": "During natural disasters (floods, earthquakes), victims post urgent SOS requests on social media containing addresses and\nmedical emergencies. Emergency disaster control rooms are overwhelmed by thousands of posts, unable to distinguish\nbetween genuine life-threatening cries for rescue, general news sharing, and spam.\n\nCreate a real-time crisis intelligence engine that ingests simulated social media feeds during a natural disaster, applies NLP\nclassification to filter actionable SOS requests from general commentary, extracts physical location entities via NER, and\nplots prioritized rescue heatmaps.",
    "background": "• THE CORE QUESTION:\nHow can natural language processing filter the noise of social media during floods and cyclones to pinpoint citizens in\ncritical danger?\n\n• THE PROBLEM GAP:\nDuring natural disasters (floods, earthquakes), victims post urgent SOS requests on social media containing addresses and\nmedical emergencies. Emergency disaster control rooms are overwhelmed by thousands of posts, unable to distinguish\nbetween genuine life-threatening cries for rescue, general news sharing, and spam.\n\n• SCOPE GUIDANCE:\nUse open disaster response tweet datasets (e.g. CrisisLex, Disaster Tweets Kaggle dataset). Focus on binary classification\n(Actionable SOS vs. Non-Actionable) and spatial mapping of extracted locations.",
    "expectedSolution": "Actionable Intent Classification: Distinguish urgent requests (e.g., 'need boat pregnant woman trapped') from commentary.\n\n• Disaster Entity Extraction: Extract trapped victim count, critical needs (medical, food, rescue), and landmark names.\n\n• Live Emergency Command Map: Render clustered distress pins prioritized by urgency level.",
    "requirements": [
      "NLP Intent & Entity Extraction Precision (40%)",
      "Emergency Triage Prioritization Logic (35%)",
      "Command Center Map Usability (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-031",
      "ALPHA-041"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-030",
    "title": "TransitSync Lite: Simulated Bus ETA & Delay Propagation Demo",
    "description": "Millions of daily commuters waste hours at bus stops because published static timetables fail to account for urban traffic\ncongestion, weather, and peak boarding delays. Existing GPS bus trackers only display current geographic location, leaving\npassengers in the dark about actual arrival time at downstream stops.\n\nDesign a machine learning transit prediction pipeline that models historical route travel times, time-of-day traffic patterns,\nand live stop delays to predict accurate Estimated Time of Arrival (ETA) for buses at upcoming stops, complete with\nconfidence bounds.",
    "background": "• THE CORE QUESTION:\nHow can machine learning turn unpredictable public bus timetables into accurate, traffic-aware arrival predictions?\n\n• THE PROBLEM GAP:\nMillions of daily commuters waste hours at bus stops because published static timetables fail to account for urban traffic\ncongestion, weather, and peak boarding delays. Existing GPS bus trackers only display current geographic location, leaving\npassengers in the dark about actual arrival time at downstream stops.\n\n• SCOPE GUIDANCE:\nUse public GTFS (General Transit Feed Specification) data or simulated bus route logs. Emphasize predictive machine\nlearning (XGBoost / LightGBM) over simple distance/speed calculations.",
    "expectedSolution": "Dynamic ETA Regression: Calculate arrival times factoring in weather, peak hour coefficients, and past stop delays.\n\n• Real-Time Delay Propagation: Adjust entire downstream route arrival estimates when a bus is delayed at one stop.\n\n• Commuter Web Display: Clean mobile interface with live countdown timers and route delay indicators.",
    "requirements": [
      "Model Accuracy on Downstream ETA Predictions (40%)",
      "Real-time Delay Propagation Logic (35%)",
      "Commuter Mobile UI Cleanliness (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-017",
      "ALPHA-024"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-031",
    "title": "SmartOPD: Hospital Queue Virtualization & Live Bed Availability Portal",
    "description": "Government and charitable hospital outpatient departments (OPDs) suffer from dangerous overcrowding, with patients\nwaiting 4-6 hours in poorly ventilated corridors. Simultaneously, ambulances wander between hospitals because there is no\ncentralized, real-time tracking of vacant ICU and oxygen beds.\n\nDevelop a full-stack hospital management web application where patients generate digital queue tokens with live estimated\nconsultation countdowns, while hospital administrators manage clinical triage and maintain a verified public live bed\navailability counter.",
    "background": "• THE CORE QUESTION:\nHow can cloud software eliminate chaotic outpatient hospital waiting crowds while providing real-time visibility into\nemergency bed vacancies?\n\n• THE PROBLEM GAP:\nGovernment and charitable hospital outpatient departments (OPDs) suffer from dangerous overcrowding, with patients\nwaiting 4-6 hours in poorly ventilated corridors. Simultaneously, ambulances wander between hospitals because there is no\ncentralized, real-time tracking of vacant ICU and oxygen beds.\n\n• SCOPE GUIDANCE:\nSimulate hospital patient check-ins and bed status updates. Implement real-time WebSocket communication for token\nstatus and a responsive patient portal that updates without manual page refreshes.",
    "expectedSolution": "Virtual Queue & Token Generation: Issue digital tokens with live estimated consult wait time via WebSockets.\n\n• Real-Time Bed Availability Dashboard: Live ward tracking of General, ICU, and Oxygen beds with vacancy status.\n\n• Doctor Triage Interface: Enable clinicians to call next patient, mark completed, or transfer to labs.",
    "requirements": [
      "Full-Stack Architecture & Real-Time Sync (40%)",
      "Patient & Hospital Staff User Experience (35%)",
      "Code Modularity & System Reliability (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-044",
      "ALPHA-057"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-032",
    "title": "KisanDirect: Zero-Brokerage Farmer-to-Retail Direct Produce Marketplace",
    "description": "Agricultural supply chains in India are dominated by multi-tiered middlemen (dalals), who take up to 50% of the produce\nvalue while leaving farmers with minimal margins. Local grocery vendors in nearby towns pay high prices, yet cannot\ndiscover which local farmers have freshly harvested crops ready for dispatch.\n\nBuild a mobile-first marketplace platform where farmers create simple produce listings (crop type, quantity in quintals,\nminimum price, farm photo) and verified local retail vendors place direct bids or purchases, generating automated\nWhatsApp order confirmation receipts.",
    "background": "• THE CORE QUESTION:\nHow can digital commerce connect agricultural producers directly with local retail grocery stores, cutting out predatory\nmiddlemen?\n\n• THE PROBLEM GAP:\nAgricultural supply chains in India are dominated by multi-tiered middlemen (dalals), who take up to 50% of the produce\nvalue while leaving farmers with minimal margins. Local grocery vendors in nearby towns pay high prices, yet cannot\ndiscover which local farmers have freshly harvested crops ready for dispatch.\n\n• SCOPE GUIDANCE:\nDesign for low-literacy users with high-contrast, image-driven UI. Simulate the transaction flow from crop listing to merchant\nbid acceptance and WhatsApp receipt notification dispatch.",
    "expectedSolution": "Streamlined Crop Listing: 3-step crop posting with photo upload, harvest date, and expected price.\n\n• Merchant Bidding & Purchase Flow: Retailers view nearby listings on a map and place binding bids.\n\n• Automated WhatsApp / SMS Deal Slip: Trigger automated order receipt summaries via Twilio / WhatsApp API.",
    "requirements": [
      "Marketplace User Flow & Usability for Rural Users (40%)",
      "Real-time Bidding & Deal State Machine (35%)",
      "Notification Integration & Architecture (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-028",
      "ALPHA-051"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-033",
    "title": "CivicFix: Geotagged Civic Issue Reporting & Automated SLA Router",
    "description": "Citizens encountering open potholes, overflowing garbage dumps, or non-functional streetlights rarely report them because\nmunicipal complaint helplines are unresponsive and bureaucratically convoluted. Tickets languish for months because\ncomplaints are routed to the wrong ward departments.\n\nCreate a progressive web application (PWA) where citizens snap a photo of a civic issue with auto-detected GPS\ncoordinates; an automated image classifier categorizes the issue (pothole, waste, lighting) and assigns the ticket to the\nrespective ward officer with an active 48-hour SLA countdown timer.",
    "background": "• THE CORE QUESTION:\nHow can citizen-reported municipal complaints be automatically categorized, geotagged, and routed to the exact division\nofficer with strict SLA accountability?\n\n• THE PROBLEM GAP:\nCitizens encountering open potholes, overflowing garbage dumps, or non-functional streetlights rarely report them because\nmunicipal complaint helplines are unresponsive and bureaucratically convoluted. Tickets languish for months because\ncomplaints are routed to the wrong ward departments.\n\n• SCOPE GUIDANCE:\nUse mobile web camera and geolocation APIs. Implement a lightweight image classifier (MobileNet) to suggest the issue\ncategory automatically and build a municipal officer dashboard to mark tickets resolved with before/after photos.",
    "expectedSolution": "Geotagged Photo Capture: Capture issue evidence with tamper-resistant GPS metadata.\n\n• Automated Department Routing: Classify photo into Roads, Sanitation, or Electrical divisions.\n\n• SLA Countdown & Escalation Engine: Track 48-hour resolution deadlines with escalation badges.",
    "requirements": [
      "End-to-End Civic Workflow & Usability (40%)",
      "Automated Categorization & Routing Logic (35%)",
      "Officer Dashboard & SLA Enforcement (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-040",
      "ALPHA-047"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-034",
    "title": "JusticeBail Lite: Curated 436A Eligibility Calculator & Petition Template Generator",
    "description": "Over 75% of India's prison population comprises undertrial prisoners, many of whom have spent more time incarcerated\nthan the maximum sentence for their alleged offense. Under Section 436A of the CrPC, they are legally entitled to bail, but\nlanguish in jail because legal aid volunteers lack automated tools to track statutory thresholds.\n\nDevelop an interactive legal decision-support web platform where paralegals and legal aid volunteers input prisoner offense\nsections, custody start dates, and trial status; the engine computes Section 436A bail eligibility and automatically drafts a\nready-to-file bail petition PDF.",
    "background": "• THE CORE QUESTION:\nHow can legal tech automate bail eligibility checks for indigent prisoners and generate error-free court petitions in seconds?\n\n• THE PROBLEM GAP:\nOver 75% of India's prison population comprises undertrial prisoners, many of whom have spent more time incarcerated\nthan the maximum sentence for their alleged offense. Under Section 436A of the CrPC, they are legally entitled to bail, but\nlanguish in jail because legal aid volunteers lack automated tools to track statutory thresholds.\n\n• SCOPE GUIDANCE:\nEncode standard penal code sections (e.g., theft, simple assault) with their maximum statutory punishments. The system\nmust verify time-served thresholds and populate standard legal court petition templates with client data.",
    "expectedSolution": "Statutory Eligibility Calculator: Evaluate custody duration against maximum penalties (1/2 or 1/3 rules).\n\n• Legal Reason Engine: Generate statutory justifications citing CrPC 436A and landmark bail precedents.\n\n• Automated Court Petition PDF Generator: Export completed, properly formatted bail application ready for signature.",
    "requirements": [
      "Legal Logic Accuracy & CrPC 436A Modeling (45%)",
      "Petition Template Quality & Formatting (30%)",
      "Usability for Paralegal Workers (25%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-034"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-035",
    "title": "SkillBridge: AI-Powered Academia-Industry Micro-Project & Hiring Portal",
    "description": "Traditional campus placement relies on rigid GPA cutoffs and generic resumes, leaving talented student coders overlooked\nwhile tech startups struggle to find candidates with hands-on framework experience. Students lack avenues to prove their\ncapabilities on bite-sized, real-world industry tasks.\n\nBuild a dual-sided matching platform where tech companies post scoped micro-projects (bug fixes, feature additions) with\nrequired skill tags, and students connect their GitHub profiles and project portfolios; a semantic matching algorithm ranks\ncandidates based on demonstrated skills rather than pedigree.",
    "background": "• THE CORE QUESTION:\nHow can engineering students match their verifiable coding skills with real-world industry micro-internships without resume\nbias?\n\n• THE PROBLEM GAP:\nTraditional campus placement relies on rigid GPA cutoffs and generic resumes, leaving talented student coders overlooked\nwhile tech startups struggle to find candidates with hands-on framework experience. Students lack avenues to prove their\ncapabilities on bite-sized, real-world industry tasks.\n\n• SCOPE GUIDANCE:\nSimulate employer project postings and student profile ingestions. Focus on skill taxonomy matching (cosine similarity over\ntechnical tags and GitHub repository languages) and a clean collaboration workspace.",
    "expectedSolution": "Micro-Project Marketplace: Employers post scoped tasks with clear deliverables and stipend rewards.\n\n• Automated Skill Extraction: Parse student GitHub repositories and language proficiencies into a verified badge profile.\n\n• Semantic Matchmaker: Recommend top student matches to employers using cosine similarity on skills.",
    "requirements": [
      "Matching Algorithm Relevance & Scoring Logic (40%)",
      "Platform Dual-Persona UX (Student vs Employer) (35%)",
      "GitHub Data Integration & Profile Verification (25%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-052"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-036",
    "title": "KalaKriti: AI-Powered Multilingual Cataloging Portal for Rural Artisans",
    "description": "Millions of skilled rural artisans (potters, weavers, painters) struggle to sell their craft on digital platforms because cataloging\nproducts requires writing fluent English descriptions, measuring dimensions, and categorizing crafts correctly. High agency\ncommissions eat up their profits.\n\nDesign a mobile progressive web app where artisans snap a photo of their handmade craft; multimodal vision AI analyzes\nthe image, automatically tags craft categories, identifies colors and materials, and generates compelling promotional\ndescriptions in both English and local Indian languages for instant digital sharing.",
    "background": "• THE CORE QUESTION:\nHow can traditional artisans create digital e-commerce storefronts with professional marketing descriptions using just their\nphone camera?\n\n• THE PROBLEM GAP:\nMillions of skilled rural artisans (potters, weavers, painters) struggle to sell their craft on digital platforms because cataloging\nproducts requires writing fluent English descriptions, measuring dimensions, and categorizing crafts correctly. High agency\ncommissions eat up their profits.\n\n• SCOPE GUIDANCE:\nUse free vision-language APIs (BLIP, CLIP, or Gemini API). The artisan workflow must be one-click simple: upload photo\n$\\rightarrow$ review generated product card $\\rightarrow$ share on WhatsApp or export catalog.",
    "expectedSolution": "Photo-to-Catalog Pipeline: Extract craft type (e.g., 'Terracotta pottery', 'Bandhani saree') and color palette.\n\n• Multilingual Marketing Copywriter: Generate engaging product descriptions in English, Hindi, Tamil, etc.\n\n• Digital Showcase Storefront: Auto-generate a sharable web link where customers can view products and message the\nartisan.",
    "requirements": [
      "Vision-to-Copy Generation Quality (40%)",
      "Artisan Mobile Usability & Accessibility (35%)",
      "Storefront Presentation & Sharing Flow (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-006",
      "ALPHA-032"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-037",
    "title": "GeoAttend Lite: Geofenced Check-in with Rotating Code & Basic Anomaly Flags",
    "description": "Manual roll calls waste 10 minutes of every college lecture, while biometric fingerprint scanners create long hallway lines\nand hygiene concerns. Existing mobile attendance apps are easily tricked by students using GPS spoofing apps or sharing\nlogin credentials with friends.\n\nDevelop a spoof-resistant mobile web attendance portal that verifies a student's presence inside a designated classroom\npolygon using the Haversine formula and HTML5 Geolocation, detects fake location providers/mock location flags, and\nupdates a real-time faculty attendance dashboard.",
    "background": "• THE CORE QUESTION:\nHow can campus attendance be automated via student smartphones while making location-spoofing and proxy check-ins\nimpossible?\n\n• THE PROBLEM GAP:\nManual roll calls waste 10 minutes of every college lecture, while biometric fingerprint scanners create long hallway lines\nand hygiene concerns. Existing mobile attendance apps are easily tricked by students using GPS spoofing apps or sharing\nlogin credentials with friends.\n\n• SCOPE GUIDANCE:\nTest on a simulated campus polygon boundary. The student checks in on their phone browser, and the system verifies that\nthe coordinates are within the classroom radius, logging attendance in real time.",
    "expectedSolution": "Geofence Polygon Validator: Check student coordinates against classroom bounding polygons.\n\n• Anti-Spoofing Heuristics: Check mock-location browser flags, abnormal speed jumps, and device fingerprinting.\n\n• Live Faculty Monitor: Display live classroom occupancy with instant absentee list export.",
    "requirements": [
      "Geofence Accuracy & Spoof Detection Rigor (45%)",
      "Faculty Dashboard & Live Roster UX (30%)",
      "Mobile Responsiveness & Lightweight Design (25%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-036"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-038",
    "title": "SchemeFinder: Dynamic Citizen Welfare Scheme Matcher & Document Guide",
    "description": "Central and state governments operate hundreds of welfare schemes for students, farmers, women entrepreneurs, and\nsenior citizens. However, over 70% of eligible beneficiaries fail to access them because scheme rules are buried across\ndozens of departmental websites with confusing bureaucratic criteria.\n\nCreate a simple, conversational 4-step wizard where citizens answer basic demographic questions (age, state, caste\ncategory, annual income, occupation, education); the system matches their profile against an indexed database of\ngovernment schemes and produces a personalized eligibility scorecard with a step-by-step document checklist.",
    "background": "• THE CORE QUESTION:\nHow can an intuitive digital advisor discover the exact government subsidies, scholarships, and pensions a citizen is entitled\nto?\n\n• THE PROBLEM GAP:\nCentral and state governments operate hundreds of welfare schemes for students, farmers, women entrepreneurs, and\nsenior citizens. However, over 70% of eligible beneficiaries fail to access them because scheme rules are buried across\ndozens of departmental websites with confusing bureaucratic criteria.\n\n• SCOPE GUIDANCE:\nCurate a representative database of 20-30 major central and state schemes (PM-Kisan, Post-Matric Scholarships, Mudra\nLoan, etc.). Emphasize fuzzy search, rule filtering, and clear document checklists for applying.",
    "expectedSolution": "Multi-Criteria Rule Matching: Filter schemes matching intersection of income, social category, and occupation.\n\n• Personalized Document Checklist: List exact required documents (Aadhaar, Income Certificate, Bank Passbook).\n\n• Plain-Language Benefits Breakdown: Display expected monetary or grant benefits without bureaucratic jargon.",
    "requirements": [
      "Matching Logic Precision & Scheme Rule Accuracy (40%)",
      "Simplicity of Citizen Wizard & Document Checklist (35%)",
      "Database Schema & Extensibility (25%)"
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
    "selectedCount": 1,
    "assignedTeams": [
      "ALPHA-020"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-039",
    "title": "MedInventory: Hospital Pharmacy Batch Expiry Tracker & Stockout Sentinel",
    "description": "Hospitals routinely discard thousands of dollars worth of expired medicines, while other wards in the same facility face acute\nshortages of those exact drugs. Paper logbooks and basic spreadsheets fail to track batch-level expiration dates, leading to\nexpired medicines remaining on dispensing shelves.\n\nBuild a barcode/QR-enabled pharmacy inventory tracking web application that logs medicine batches with manufacturing\nand expiry dates, enforces First Expired, First Out (FEFO) dispensing rules, triggers automated color-coded expiry alerts\n(Red = expiring in 30 days), and enables internal inter-ward medicine transfers.",
    "background": "• THE CORE QUESTION:\nHow can smart pharmacy software enforce First-Expired-First-Out dispensing and prevent life-saving medicines from\nexpiring unnoticed?\n\n• THE PROBLEM GAP:\nHospitals routinely discard thousands of dollars worth of expired medicines, while other wards in the same facility face acute\nshortages of those exact drugs. Paper logbooks and basic spreadsheets fail to track batch-level expiration dates, leading to\nexpired medicines remaining on dispensing shelves.\n\n• SCOPE GUIDANCE:\nImplement webcam barcode/QR scanning using browser libraries. Simulate pharmacy stock entries and show dynamic\nalerts when an expiry date approaches.",
    "expectedSolution": "Batch-Level Barcode / QR Scanning: Ingest medicine shipments with batch numbers, quantities, and expiration dates.\n\n• Automated FEFO Dispensing Guide: Prompt pharmacists to dispense the nearest-expiring batch first.\n\n• Critical Expiry Sentinel: Automated color-coded alerts and inter-ward surplus transfer requests.",
    "requirements": [
      "FEFO Logic & Expiry Alert Automation (45%)",
      "Barcode Scanning & Inventory UX (30%)",
      "Data Integrity & Relational Schema (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-002",
      "ALPHA-046"
    ],
    "status": "PUBLISHED"
  },
  {
    "problemId": "PS-040",
    "title": "RailResolve: Smart Railway Passenger Grievance Categorizer & Ticket Triage",
    "description": "The railway complaint helpline receives tens of thousands of unstructured passenger complaints daily across social media,\napps, and SMS. During major train delays, dozens of passengers from the same train log identical complaints about air\nconditioning or dirty coaches, swamping support staff and burying critical medical/security emergencies.\n\nDesign an intelligent railway passenger grievance ticketing portal that ingests complaint text, automatically classifies issues\ninto departments (Catering, Cleanliness, Electrical, Security, Medical), detects and groups duplicate complaints from the\nsame train/coach number, and visualizes an emergency-first triage board for division managers.",
    "background": "• THE CORE QUESTION:\nHow can natural language processing turn chaotic passenger complaints into prioritized, de-duplicated tickets for railway\nmaintenance crews?\n\n• THE PROBLEM GAP:\nThe railway complaint helpline receives tens of thousands of unstructured passenger complaints daily across social media,\napps, and SMS. During major train delays, dozens of passengers from the same train log identical complaints about air\nconditioning or dirty coaches, swamping support staff and burying critical medical/security emergencies.\n\n• SCOPE GUIDANCE:\nUse sample passenger complaints. Implement a text classification model (Naive Bayes / DistilBERT) to categorize issues\nand a grouping heuristic that aggregates complaints sharing PNR / Train number and issue category.",
    "expectedSolution": "Multi-Class Issue Tagging: Automatically route complaints to Sanitation, Pantry, Electrical, or Security.\n\n• Train-Level De-Duplication: Group 20 separate complaints about 'Coach B2 AC not working' into a single actionable ticket.\n\n• Emergency Priority Escalation: Flag safety, security, and medical emergencies at the top of the triage board.",
    "requirements": [
      "NLP Categorization & De-Duplication Accuracy (40%)",
      "Triage Board Design & Department Routing (35%)",
      "Emergency Escalation Responsiveness (25%)"
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
    "selectedCount": 2,
    "assignedTeams": [
      "ALPHA-004",
      "ALPHA-037"
    ],
    "status": "PUBLISHED"
  }
];
export default TOP_40_PROBLEMS;
