const AUTHORIZED_TEAMS = [
  {
    teamId: 'ALPHA-001',
    regNum: '9924008110',
    teamName: 'INNOVATES',
    leadName: 'POLANKI VYSHNAVI',
    members: [
      { name: 'POLANKI VYSHNAVI', registrationNumber: '9924008110', role: 'LEAD' },
      { name: 'Y NAGA SREEJA', registrationNumber: '99240041193', role: 'MEMBER' },
      { name: 'RAJAPURAM POOJITHA', registrationNumber: '9924008116', role: 'MEMBER' },
      { name: 'MUNNANGI SUBHASHINI REDDY', registrationNumber: '9924008107', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-002',
    regNum: '99230041040',
    teamName: 'CODE TITANS',
    leadName: 'SATHRASALA MUKESH',
    members: [
      { name: 'SATHRASALA MUKESH', registrationNumber: '99230041040', role: 'LEAD' },
      { name: 'GURRAM MEGHANA', registrationNumber: '9923005179', role: 'MEMBER' },
      { name: 'KUNCHAPU ISHWARYA', registrationNumber: '9824005004', role: 'MEMBER' },
      { name: 'POREDDY HARSHA VARDHAN REDDY', registrationNumber: '9923005182', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-003',
    regNum: '9924005337',
    teamName: "BINARY BRAIN'S",
    leadName: 'THALARI BHAVYA SREE',
    members: [
      { name: 'THALARI BHAVYA SREE', registrationNumber: '9924005337', role: 'LEAD' },
      { name: 'BANDI NAGESWARI', registrationNumber: '9924005213', role: 'MEMBER' },
      { name: 'THANGELLA VAISHNAVI', registrationNumber: '9924005422', role: 'MEMBER' },
      { name: 'PEDDIMENI NITHEESHA', registrationNumber: '9924005188', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-004',
    regNum: '99240040829',
    teamName: 'DEEP THINKERS',
    leadName: 'BESTHA KRISHNA CHAITHANYA',
    members: [
      { name: 'BESTHA KRISHNA CHAITHANYA', registrationNumber: '99240040829', role: 'LEAD' },
      { name: 'BHUMANA KAVYA SREE', registrationNumber: '99240040832', role: 'MEMBER' },
      { name: 'DEVARINTI PAVAN KUMAR REDDY', registrationNumber: '99240040884', role: 'MEMBER' },
      { name: 'SHAIK NOORE SABHA', registrationNumber: '99240040771', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-005',
    regNum: '99230041058',
    teamName: 'ATLAS',
    leadName: 'REMATA SOMANATHA REDDY',
    members: [
      { name: 'REMATA SOMANATHA REDDY', registrationNumber: '99230041058', role: 'LEAD' },
      { name: 'DOMMARI ANJANEYULU', registrationNumber: '9923005074', role: 'MEMBER' },
      { name: 'MANCHIKANTI VENKATA KESAR SUNEEL KUMAR', registrationNumber: '99230041026', role: 'MEMBER' },
      { name: 'PANDHIRLA GUNA SEKHAR REDDY', registrationNumber: '9923005114', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-006',
    regNum: '99230040034',
    teamName: 'APXGP',
    leadName: 'A.LALITH SAGAT',
    members: [
      { name: 'A.LALITH SAGAT', registrationNumber: '99230040034', role: 'LEAD' },
      { name: 'MEGHAM NAGA VENKATA BRUNDHA', registrationNumber: '99240041034', role: 'MEMBER' },
      { name: 'MACHIKA RADHA KRISHNA', registrationNumber: '99240041002', role: 'MEMBER' },
      { name: 'CHENNUPATI DEEKSHITHA SAI', registrationNumber: '9924008099', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-007',
    regNum: '9923008026',
    teamName: 'FUNTASTIC 4',
    leadName: 'MADDUKURI BALAJI',
    members: [
      { name: 'MADDUKURI BALAJI', registrationNumber: '9923008026', role: 'LEAD' },
      { name: 'D. SHABANA BANU', registrationNumber: '9923008020', role: 'MEMBER' },
      { name: 'CH.SAMANVITHA', registrationNumber: '9923008003', role: 'MEMBER' },
      { name: 'M.NAGA VENKAT', registrationNumber: '9923008006', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-008',
    regNum: '99240040811',
    teamName: 'CODE 01',
    leadName: 'KANDANULA VAISHNAVI',
    members: [
      { name: 'KANDANULA VAISHNAVI', registrationNumber: '99240040811', role: 'LEAD' },
      { name: 'DAGGUPATI VINUSHA', registrationNumber: '99240041217', role: 'MEMBER' },
      { name: 'DAGGUPATI LIKITHA', registrationNumber: '99240041218', role: 'MEMBER' },
      { name: 'KALA PALLAVI', registrationNumber: '99240040246', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-009',
    regNum: '99240040676',
    teamName: 'PHEONIX',
    leadName: 'NARA HARSHITHA SAI',
    members: [
      { name: 'NARA HARSHITHA SAI', registrationNumber: '99240040676', role: 'LEAD' },
      { name: 'T.G.NAYANA SREE', registrationNumber: '99240040678', role: 'MEMBER' },
      { name: 'P.REDDY MANIDEEP REDDY', registrationNumber: '99240040316', role: 'MEMBER' },
      { name: 'P.SWAROOP KUMAR', registrationNumber: '99240040306', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-010',
    regNum: '99230041066',
    teamName: 'QUANTUM CODERS',
    leadName: 'M.NITHISH',
    members: [
      { name: 'M.NITHISH', registrationNumber: '99230041066', role: 'LEAD' },
      { name: 'KESAPURAM NARMADA', registrationNumber: '9923005020', role: 'MEMBER' },
      { name: 'AVULA NANDINI', registrationNumber: '9923005004', role: 'MEMBER' },
      { name: 'JAMMANA PRAVALIKA', registrationNumber: '9923005091', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-011',
    regNum: '9923005134',
    teamName: 'STAR',
    leadName: 'THOTA MADHUSUDHAN',
    members: [
      { name: 'THOTA MADHUSUDHAN', registrationNumber: '9923005134', role: 'LEAD' },
      { name: 'P.GAJAPATHI', registrationNumber: '99230040720', role: 'MEMBER' },
      { name: 'P.CHANDRA NANDI REDDY', registrationNumber: '99230040706', role: 'MEMBER' },
      { name: 'K.GANESH KUMAR', registrationNumber: '99230040031', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-012',
    regNum: '9925146015',
    teamName: 'WOLF CODER',
    leadName: 'MUTHU KRISHNAN',
    members: [
      { name: 'MUTHU KRISHNAN', registrationNumber: '9925146015', role: 'LEAD' },
      { name: 'SUDHAKAR V', registrationNumber: '9923009011', role: 'MEMBER' },
      { name: 'MARI RAJ S', registrationNumber: '9923009017', role: 'MEMBER' },
      { name: 'ARUN INDHU M', registrationNumber: '9924005183', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-013',
    regNum: '99240040809',
    teamName: 'THE INFINITE VISION',
    leadName: 'ANUMANDLA ABHIRAM',
    members: [
      { name: 'ANUMANDLA ABHIRAM', registrationNumber: '99240040809', role: 'LEAD' },
      { name: 'ANGARA RAJESH', registrationNumber: '99240040818', role: 'MEMBER' },
      { name: 'K. BALA ANJANEYA GANGADHAR', registrationNumber: '99240040254', role: 'MEMBER' },
      { name: 'GANDLA OMKAR', registrationNumber: '99240040911', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-014',
    regNum: '99240040734',
    teamName: 'KANYA RASHI',
    leadName: 'ROUTHU SAGAR',
    members: [
      { name: 'ROUTHU SAGAR', registrationNumber: '99240040734', role: 'LEAD' },
      { name: 'NARALA RAKESH REDDY', registrationNumber: '99240040744', role: 'MEMBER' },
      { name: 'BAPANAPALLI VIJAY', registrationNumber: '99240040726', role: 'MEMBER' },
      { name: 'POGULA BHANU PRAKASH REDDY', registrationNumber: '99240041154', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-015',
    regNum: '9923001004',
    teamName: 'CHAMPIONS',
    leadName: 'YELLALA LAKSHMANUDU',
    members: [
      { name: 'YELLALA LAKSHMANUDU', registrationNumber: '9923001004', role: 'LEAD' },
      { name: 'CHEPPALA UDAY KUMAR REDDY', registrationNumber: '9923001012', role: 'MEMBER' },
      { name: 'AYULURI SOMANADH MADHAVA REDDY', registrationNumber: '99230041030', role: 'MEMBER' },
      { name: 'OMKARAM GOVARDHAN RAJU', registrationNumber: '99230040990', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-016',
    regNum: '99240040693',
    teamName: 'CAFFEINE',
    leadName: 'PAMIDI MOHAMMAD KHALID',
    members: [
      { name: 'PAMIDI MOHAMMAD KHALID', registrationNumber: '99240040693', role: 'LEAD' },
      { name: 'NAGARCHI AFZAL', registrationNumber: '99240040787', role: 'MEMBER' },
      { name: 'VEERAVALLI HEMANTH CHOWDARY', registrationNumber: '99240040709', role: 'MEMBER' },
      { name: 'AVULA YASWANTH', registrationNumber: '99240040389', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-017',
    regNum: '99240040720',
    teamName: 'TARGERIAN DRAGONS',
    leadName: 'PRATHAPANI LAXMAN KUMAR',
    members: [
      { name: 'PRATHAPANI LAXMAN KUMAR', registrationNumber: '99240040720', role: 'LEAD' },
      { name: 'KAREDLA VENKATA SAI KISHORE', registrationNumber: '99240040400', role: 'MEMBER' },
      { name: 'PUTTA DWARAKANADHA REDDY', registrationNumber: '99240040715', role: 'MEMBER' },
      { name: 'APPALANENI VENU GOPALA SAI MANI KRISHNA', registrationNumber: '99240040402', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-018',
    regNum: '99240040199',
    teamName: 'TECH TITANS',
    leadName: 'BANDIKE SHIVA BHARATH',
    members: [
      { name: 'BANDIKE SHIVA BHARATH', registrationNumber: '99240040199', role: 'LEAD' },
      { name: 'YERRA VISHNUVARDHAN REDDY', registrationNumber: '99240040340', role: 'MEMBER' },
      { name: 'TOKA UPENDER RAO', registrationNumber: '99240040261', role: 'MEMBER' },
      { name: 'YARAMALA KARTHIK REDDY', registrationNumber: '99240040168', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-019',
    regNum: '99240041293',
    teamName: 'EAGLES',
    leadName: 'DUNNA NANI',
    members: [
      { name: 'DUNNA NANI', registrationNumber: '99240041293', role: 'LEAD' },
      { name: 'MANIKANETHULA SIVA VENKATA NARASIMHA RAO', registrationNumber: '99240041338', role: 'MEMBER' },
      { name: 'K BABA YOGESH', registrationNumber: '99240041072', role: 'MEMBER' },
      { name: 'KATURI KIRAN KUMAR', registrationNumber: '9924005438', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-020',
    regNum: '99240041294',
    teamName: 'CYBER PUNK',
    leadName: 'GORIPARTHI VIJAYA RAMA RAJU',
    members: [
      { name: 'GORIPARTHI VIJAYA RAMA RAJU', registrationNumber: '99240041294', role: 'LEAD' },
      { name: 'ANNEM ABHIRAM REDDY', registrationNumber: '99240041319', role: 'MEMBER' },
      { name: 'MANIKANETHULA VENKATA NIKHIL', registrationNumber: '99240041339', role: 'MEMBER' },
      { name: 'MOGADASU BALA SYAM', registrationNumber: '99240041304', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-021',
    regNum: '99240040713',
    teamName: 'CIVIC MINDS',
    leadName: 'PUNAGANTI BHAGYATEJ',
    members: [
      { name: 'PUNAGANTI BHAGYATEJ', registrationNumber: '99240040713', role: 'LEAD' },
      { name: 'SHAIK MOHAMMED TAHEER', registrationNumber: '99240040767', role: 'MEMBER' },
      { name: 'MENTA HARI SAI CHARAN', registrationNumber: '99240041029', role: 'MEMBER' },
      { name: 'SHAIK MOHAMMED SABAUDDIN', registrationNumber: '99240040751', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-022',
    regNum: '99240040397',
    teamName: 'SALAAR',
    leadName: 'BURRAMSETTI NAGA SAI GANESH',
    members: [
      { name: 'BURRAMSETTI NAGA SAI GANESH', registrationNumber: '99240040397', role: 'LEAD' },
      { name: 'BOMMADI ISHATH SRI', registrationNumber: '99240040405', role: 'MEMBER' },
      { name: 'MUNAGA VENKATA GOPI CHANDU', registrationNumber: '99240040403', role: 'MEMBER' },
      { name: 'TALAMARLA PRAVEEN', registrationNumber: '99240040408', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-023',
    regNum: '99250040948',
    teamName: 'DIGITAL DOMINATORS',
    leadName: 'RAHUL GANESH S',
    members: [
      { name: 'RAHUL GANESH S', registrationNumber: '99250040948', role: 'LEAD' },
      { name: 'JAGAN PRAVEEN A', registrationNumber: '99250040933', role: 'MEMBER' },
      { name: 'THIRUMURUGAN M', registrationNumber: '99250040883', role: 'MEMBER' },
      { name: 'PREMKUMAR M', registrationNumber: '99250040947', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-024',
    regNum: '9923005069',
    teamName: 'AVENGERS',
    leadName: 'CHEREDDY SUBBALAKSHMI DEVI',
    members: [
      { name: 'CHEREDDY SUBBALAKSHMI DEVI', registrationNumber: '9923005069', role: 'LEAD' },
      { name: 'PEDAMARLA BHARATH KUMAR REDDY', registrationNumber: '9923005158', role: 'MEMBER' },
      { name: 'MIDDE KURUBA SASIKALA', registrationNumber: '9923005032', role: 'MEMBER' },
      { name: 'TANGI ANUSHA', registrationNumber: '9923005161', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-025',
    regNum: '99240040120',
    teamName: 'NEXA',
    leadName: 'YEDUGURI HARSHA VARDHAN REDDY',
    members: [
      { name: 'YEDUGURI HARSHA VARDHAN REDDY', registrationNumber: '99240040120', role: 'LEAD' },
      { name: 'TAMATAM GANESH KUMAR REDDY', registrationNumber: '99240040032', role: 'MEMBER' },
      { name: 'KAMSALA ASHWANTHA CHARI', registrationNumber: '99240040114', role: 'MEMBER' },
      { name: 'TALLAM SAI HASIKA', registrationNumber: '99240040438', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-026',
    regNum: '99240041161',
    teamName: 'KANYARASI',
    leadName: 'SHAIK FAYZULLA',
    members: [
      { name: 'SHAIK FAYZULLA', registrationNumber: '99240041161', role: 'LEAD' },
      { name: 'SANKATI MADHAVAN', registrationNumber: '99240040324', role: 'MEMBER' },
      { name: 'SARAVAN K', registrationNumber: '99240041167', role: 'MEMBER' },
      { name: 'SAYELA YUVA SRI TEJA', registrationNumber: '99240041172', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-027',
    regNum: '99240041273',
    teamName: 'BLACK BOX',
    leadName: 'POLURI KRUSHITHA REDDY',
    members: [
      { name: 'POLURI KRUSHITHA REDDY', registrationNumber: '99240041273', role: 'LEAD' },
      { name: 'PEDDINENIKALVA GIRIDHAR REDDY', registrationNumber: '99240041274', role: 'MEMBER' },
      { name: 'POTTHALAM MANASA', registrationNumber: '99240040311', role: 'MEMBER' },
      { name: 'RANGAPPAGARI CHAITANYA REDDY', registrationNumber: '99240041253', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-028',
    regNum: '99240040566',
    teamName: 'FUTURE MINDS',
    leadName: 'VANGALI PRASAD REDDY',
    members: [
      { name: 'VANGALI PRASAD REDDY', registrationNumber: '99240040566', role: 'LEAD' },
      { name: 'NUTHI VARALAKSHMI PRANEETHA', registrationNumber: '99240041093', role: 'MEMBER' },
      { name: 'KARNATI SREEDHAR REDDY', registrationNumber: '99240041224', role: 'MEMBER' },
      { name: 'PINNI BHARATH KUMAR', registrationNumber: '99240040538', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-029',
    regNum: '99240040835',
    teamName: 'TARGARYENS',
    leadName: 'SIRPA SAI PRAKYATH',
    members: [
      { name: 'SIRPA SAI PRAKYATH', registrationNumber: '99240040835', role: 'LEAD' },
      { name: 'CHUNDRU KARTHIK', registrationNumber: '99240041085', role: 'MEMBER' },
      { name: 'BATAKALA MANIKANTA', registrationNumber: '99240040852', role: 'MEMBER' },
      { name: 'BHUKYA VIKAS NAIK', registrationNumber: '99240040847', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-030',
    regNum: '99240040823',
    teamName: 'VISION X',
    leadName: 'M KUMAR',
    members: [
      { name: 'M KUMAR', registrationNumber: '99240040823', role: 'LEAD' },
      { name: 'RANGAREDDY GARI MADHAN', registrationNumber: '99240041147', role: 'MEMBER' },
      { name: 'LAMBADI RAVI PRAKASH', registrationNumber: '99240041278', role: 'MEMBER' },
      { name: 'K NAVATEJ', registrationNumber: '9924005119', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-031',
    regNum: '9924005259',
    teamName: 'ALPHA',
    leadName: 'THOKALA CHARITH SAI',
    members: [
      { name: 'THOKALA CHARITH SAI', registrationNumber: '9924005259', role: 'LEAD' },
      { name: 'HAMPI KURUBA MAHESH', registrationNumber: '99240040241', role: 'MEMBER' },
      { name: 'GUDIPATI KAMMA AKHILESWAR RAO', registrationNumber: '9825005004', role: 'MEMBER' },
      { name: 'THOTA ADINARAYANA', registrationNumber: '9924005260', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-032',
    regNum: '9923008069',
    teamName: 'TETRA FORCE',
    leadName: 'RUSSELL S',
    members: [
      { name: 'RUSSELL S', registrationNumber: '9923008069', role: 'LEAD' },
      { name: 'M NEHA', registrationNumber: '9923002001', role: 'MEMBER' },
      { name: 'KISHORE S', registrationNumber: '9923008089', role: 'MEMBER' },
      { name: 'PANDI SELVI K', registrationNumber: '9923002002', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-033',
    regNum: '99240041083',
    teamName: 'SANDY',
    leadName: 'ODURI SANDEEP',
    members: [
      { name: 'ODURI SANDEEP', registrationNumber: '99240041083', role: 'LEAD' },
      { name: 'PAGIDIKALVA NAVYA SREE', registrationNumber: '99240041096', role: 'MEMBER' },
      { name: 'SREERAM RAKESH', registrationNumber: '9924051043', role: 'MEMBER' },
      { name: 'NEKKANTI MADHUGANESH', registrationNumber: '99240040302', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-034',
    regNum: '9923005040',
    teamName: 'DEAD',
    leadName: 'SHAIK NAYEEM',
    members: [
      { name: 'SHAIK NAYEEM', registrationNumber: '9923005040', role: 'LEAD' },
      { name: 'KODIMIGANI PALLI TEJESWAR REDDY', registrationNumber: '99240041247', role: 'MEMBER' },
      { name: 'ALAVALA NAGA TEJASWINI', registrationNumber: '99240040742', role: 'MEMBER' },
      { name: 'KATTHULA MADHURI', registrationNumber: '99240040556', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-035',
    regNum: '99230041089',
    teamName: 'CODERS',
    leadName: 'FREDERICK A',
    members: [
      { name: 'FREDERICK A', registrationNumber: '99230041089', role: 'LEAD' },
      { name: 'FARHAAN T', registrationNumber: '99230041088', role: 'MEMBER' },
      { name: 'S.TEJA DHANUSH', registrationNumber: '99230041104', role: 'MEMBER' },
      { name: 'G SUDHARSAN', registrationNumber: '99230041105', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-036',
    regNum: '99250040437',
    teamName: 'CODE PIONEERS',
    leadName: 'MALLIREDDY POOJITHA',
    members: [
      { name: 'MALLIREDDY POOJITHA', registrationNumber: '99250040437', role: 'LEAD' },
      { name: 'MONIKA V', registrationNumber: '99250040463', role: 'MEMBER' },
      { name: 'MANGALA SREE HARSHA', registrationNumber: '99250040448', role: 'MEMBER' },
      { name: 'MARASU YESHWANTH', registrationNumber: '99250040443', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-037',
    regNum: '9923005022',
    teamName: 'TECHNICAL DEBTORS',
    leadName: 'KODURU RAMITHA SATHVIKA',
    members: [
      { name: 'KODURU RAMITHA SATHVIKA', registrationNumber: '9923005022', role: 'LEAD' },
      { name: 'M.DIVYA SRUTHI', registrationNumber: '9923005028', role: 'MEMBER' },
      { name: 'Y.RAVI SREEKAR', registrationNumber: '9923005050', role: 'MEMBER' },
      { name: 'BEJAWADA JITHENDRA RAVI KUMAR', registrationNumber: '99230040081', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-038',
    regNum: '99240040948',
    teamName: 'TECH BUILDERS',
    leadName: 'NALLADIMMU NAGA LAKSHMAN REDDY',
    members: [
      { name: 'NALLADIMMU NAGA LAKSHMAN REDDY', registrationNumber: '99240040948', role: 'LEAD' },
      { name: 'VANKAM VENKATA SUBBAIAH', registrationNumber: '9924005082', role: 'MEMBER' },
      { name: 'RAYADURGAM NARAYANA REDDY', registrationNumber: '99240040952', role: 'MEMBER' },
      { name: 'KANCHARLA POORNA CHANDRA', registrationNumber: '99240040949', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-039',
    regNum: '9923005043',
    teamName: 'COSMOS',
    leadName: 'THOTA NAGA SESHU',
    members: [
      { name: 'THOTA NAGA SESHU', registrationNumber: '9923005043', role: 'LEAD' },
      { name: 'V.BALU', registrationNumber: '9923005143', role: 'MEMBER' },
      { name: 'B.SRI ADITYA VARSHINI', registrationNumber: '9923005301', role: 'MEMBER' },
      { name: 'S. HEMA LATHA', registrationNumber: '9923005308', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-040',
    regNum: '99230040641',
    teamName: 'CHAITANYA',
    leadName: 'MADISETTY VENKATA CHAITANYA LAHARI',
    members: [
      { name: 'MADISETTY VENKATA CHAITANYA LAHARI', registrationNumber: '99230040641', role: 'LEAD' },
      { name: 'GONGALREDDY SREE LAKSHMAN REDDY', registrationNumber: '99230040553', role: 'MEMBER' },
      { name: 'YARATAPALLI SAI SREEJA', registrationNumber: '99230040460', role: 'MEMBER' },
      { name: 'GIRAMAGARI BHARATH KUMAR REDDY', registrationNumber: '99230040105', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-041',
    regNum: '9923005115',
    teamName: 'DRAGON',
    leadName: 'PANYAM KRISHNA MOULI',
    members: [
      { name: 'PANYAM KRISHNA MOULI', registrationNumber: '9923005115', role: 'LEAD' },
      { name: 'KURUVA GURU TEJA', registrationNumber: '9923005320', role: 'MEMBER' },
      { name: 'PONNAPATI TEJA SIMHA REDDY', registrationNumber: '9923005316', role: 'MEMBER' },
      { name: 'PUTLURI MADHU CHARAN', registrationNumber: '9923005123', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-042',
    regNum: '9923037006',
    teamName: 'TEAMSOUL',
    leadName: 'ISHU KUMAR',
    members: [
      { name: 'ISHU KUMAR', registrationNumber: '9923037006', role: 'LEAD' },
      { name: 'AVIL JAMES', registrationNumber: '9923037004', role: 'MEMBER' },
      { name: 'KARTHIK A', registrationNumber: '9824037023', role: 'MEMBER' },
      { name: 'ALBIN JOLLY', registrationNumber: '9923037003', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-043',
    regNum: '9824037006',
    teamName: 'TEAMAPEX',
    leadName: 'DADALA SAMUEL SARTHVIK JEDIDIAH',
    members: [
      { name: 'DADALA SAMUEL SARTHVIK JEDIDIAH', registrationNumber: '9824037006', role: 'LEAD' },
      { name: 'CHINTHA REDDY VISHWADEEP REDDY', registrationNumber: '9824037005', role: 'MEMBER' },
      { name: 'SARAN SANJAY R', registrationNumber: '9824037014', role: 'MEMBER' },
      { name: 'SHASHANK KUMAR M', registrationNumber: '9824037021', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-044',
    regNum: '9824037007',
    teamName: 'WOLVES TEAM',
    leadName: 'CHAKALI MANIDEEP',
    members: [
      { name: 'CHAKALI MANIDEEP', registrationNumber: '9824037007', role: 'LEAD' },
      { name: 'RAVIKUMAR B S', registrationNumber: '9824037012', role: 'MEMBER' },
      { name: 'CHAITRA. M', registrationNumber: '9824037018', role: 'MEMBER' },
      { name: 'REDDYPALLI MEENAKSHI', registrationNumber: '9824037008', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-045',
    regNum: '99240040827',
    teamName: 'PIXEL PIONEERS',
    leadName: 'SIVAHARISH T',
    members: [
      { name: 'SIVAHARISH T', registrationNumber: '99240040827', role: 'LEAD' },
      { name: 'SIVASAKTHI S', registrationNumber: '9924005211', role: 'MEMBER' },
      { name: 'PATTAMUTHU S', registrationNumber: '9924005452', role: 'MEMBER' },
      { name: 'BHARATH.V', registrationNumber: '99240040824', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-046',
    regNum: '9824037001',
    teamName: 'RAM LEO TEAM',
    leadName: 'RAM MATHAVAN S',
    members: [
      { name: 'RAM MATHAVAN S', registrationNumber: '9824037001', role: 'LEAD' },
      { name: 'SINDHUSHREE K C', registrationNumber: '9824037017', role: 'MEMBER' },
      { name: 'MARISHETTI GANESH', registrationNumber: '9824037015', role: 'MEMBER' },
      { name: 'GANAVI N', registrationNumber: '9824037019', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-047',
    regNum: '9923037001',
    teamName: 'GLADIATOR TEAM',
    leadName: 'SRUNGAVARAPU HIMA KIRAN',
    members: [
      { name: 'SRUNGAVARAPU HIMA KIRAN', registrationNumber: '9923037001', role: 'LEAD' },
      { name: 'MAKODIKI YUNIS', registrationNumber: '9824037016', role: 'MEMBER' },
      { name: 'PRASHANTH S', registrationNumber: '9824037020', role: 'MEMBER' },
      { name: 'PRUTHVIRAJ S', registrationNumber: '9824037003', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-048',
    regNum: '9824037002',
    teamName: 'MPEX',
    leadName: 'MEER MAHDI HUSSAIN',
    members: [
      { name: 'MEER MAHDI HUSSAIN', registrationNumber: '9824037002', role: 'LEAD' },
      { name: 'SHAIK MOHAMMED MUZAFFAR HUSSAIN', registrationNumber: '9824037004', role: 'MEMBER' },
      { name: 'MADIGA PRISKILLA', registrationNumber: '9824037010', role: 'MEMBER' },
      { name: 'ADITHYA BENNY', registrationNumber: '9923037002', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-049',
    regNum: '9824037024',
    teamName: 'DRAGON TEAM 24',
    leadName: 'YASHWANTH C',
    members: [
      { name: 'YASHWANTH C', registrationNumber: '9824037024', role: 'LEAD' },
      { name: 'CHAKALI JHANSI', registrationNumber: '9824037009', role: 'MEMBER' },
      { name: 'LODADALA RENUKA', registrationNumber: '9824037011', role: 'MEMBER' },
      { name: 'BOLLA KARTHIK', registrationNumber: '9824037013', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-050',
    regNum: '9824005012',
    teamName: 'STRANGER THINGS',
    leadName: 'BOPADALA NAGA SANJAY',
    members: [
      { name: 'BOPADALA NAGA SANJAY', registrationNumber: '9824005012', role: 'LEAD' },
      { name: 'MORUMPALLI BHANUPRAKASH REDDY', registrationNumber: '9824005010', role: 'MEMBER' },
      { name: 'CHEMBETI VINAY HARSHA', registrationNumber: '9923005067', role: 'MEMBER' },
      { name: 'Y.PATHIV', registrationNumber: '9923005315', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-051',
    regNum: '99220042143',
    teamName: 'CULT',
    leadName: 'M.JANARTHANAN',
    members: [
      { name: 'M.JANARTHANAN', registrationNumber: '99220042143', role: 'LEAD' },
      { name: 'NAGA.N', registrationNumber: '99220041815', role: 'MEMBER' },
      { name: 'HARI VIKNESH.S', registrationNumber: '9922008428', role: 'MEMBER' },
      { name: 'DHARUN PRAKASH.V', registrationNumber: '9922008460', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-052',
    regNum: '99240041317',
    teamName: 'CYBERSPARK',
    leadName: 'G SHARON',
    members: [
      { name: 'G SHARON', registrationNumber: '99240041317', role: 'LEAD' },
      { name: 'G HARISH KUMAR REDDY', registrationNumber: '99240040912', role: 'MEMBER' },
      { name: 'KURUKUNDHA SUJANA DEVI', registrationNumber: '99240041334', role: 'MEMBER' },
      { name: 'PELLURI ARUN KUMAR', registrationNumber: '9924005338', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-053',
    regNum: '9924005237',
    teamName: 'HOUSE STARK',
    leadName: 'DIYYA VAMSI',
    members: [
      { name: 'DIYYA VAMSI', registrationNumber: '9924005237', role: 'LEAD' },
      { name: 'DUDDEKUNTA SRI VYSHNAV REDDY', registrationNumber: '99240040881', role: 'MEMBER' },
      { name: 'DHANUNJAY MAITY', registrationNumber: '99240040900', role: 'MEMBER' },
      { name: 'DUDEKULA FEROZ', registrationNumber: '99240040891', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-054',
    regNum: '99240040217',
    teamName: 'HOUSE TARGARYEN',
    leadName: 'DEVARAPU SUDHAKAR',
    members: [
      { name: 'DEVARAPU SUDHAKAR', registrationNumber: '99240040217', role: 'LEAD' },
      { name: 'DOLA HARSHITHA', registrationNumber: '9924005232', role: 'MEMBER' },
      { name: 'BOJANAPU VIKRAM', registrationNumber: '9924005025', role: 'MEMBER' },
      { name: 'RAGIMEKALA PRASHANTH', registrationNumber: '99240040150', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-055',
    regNum: '99230041272',
    teamName: 'TEAM 4',
    leadName: 'RUPANI RAMESH',
    members: [
      { name: 'RUPANI RAMESH', registrationNumber: '99230041272', role: 'LEAD' },
      { name: 'SHAIK SAHIL', registrationNumber: '9923030003', role: 'MEMBER' },
      { name: 'SK JALLALUDDIN BASHA', registrationNumber: '9923030005', role: 'MEMBER' },
      { name: 'S NAVEEN KRISHNA', registrationNumber: '9923030007', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-056',
    regNum: '99230040130',
    teamName: 'CREATERS',
    leadName: 'MAGULURI HAREESH',
    members: [
      { name: 'MAGULURI HAREESH', registrationNumber: '99230040130', role: 'LEAD' },
      { name: 'VEGINATI MANIKANTA', registrationNumber: '99240040567', role: 'MEMBER' },
      { name: 'VADDIREDDY YOGANANDA REDDY', registrationNumber: '99230040445', role: 'MEMBER' },
      { name: 'BOBBALA GANESH', registrationNumber: '99230040085', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-057',
    regNum: '99240040227',
    teamName: 'CODE NOVA',
    leadName: 'GODSON THOMAS',
    members: [
      { name: 'GODSON THOMAS', registrationNumber: '99240040227', role: 'LEAD' },
      { name: 'ANANDU PRADEEP', registrationNumber: '9924005205', role: 'MEMBER' },
      { name: 'PERURI LEELA SAINADH', registrationNumber: '99240041347', role: 'MEMBER' },
      { name: 'REBIZAMAN P', registrationNumber: '9924011058', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-058',
    regNum: '9923005107',
    teamName: 'NEUTRAL BOYS',
    leadName: 'MARELLA MURALI KRISHNA',
    members: [
      { name: 'MARELLA MURALI KRISHNA', registrationNumber: '9923005107', role: 'LEAD' },
      { name: 'BAPANAPALLI SUDHEER', registrationNumber: '99230040079', role: 'MEMBER' },
      { name: 'DATLA HEMASIDHARTHA', registrationNumber: '99230040293', role: 'MEMBER' },
      { name: 'DASARI KARTHEEK', registrationNumber: '99240040444', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-059',
    regNum: '99240041018',
    teamName: 'WARRIORS',
    leadName: 'KURUBA MOHITH KUMAR',
    members: [
      { name: 'KURUBA MOHITH KUMAR', registrationNumber: '99240041018', role: 'LEAD' },
      { name: 'NIRAGANTI GOWTHAM', registrationNumber: '99240041344', role: 'MEMBER' },
      { name: 'NIMMALA SRIMANNARAYANA', registrationNumber: '99240041342', role: 'MEMBER' },
      { name: 'N ANKITHA', registrationNumber: '99240041320', role: 'MEMBER' }
    ]
  },
  {
    teamId: 'ALPHA-060',
    regNum: '99240041322',
    teamName: 'DETA',
    leadName: 'ARIGELA VENKATA SUSHANTH',
    members: [
      { name: 'ARIGELA VENKATA SUSHANTH', registrationNumber: '99240041322', role: 'LEAD' },
      { name: 'C TEJASWINI', registrationNumber: '99250040143', role: 'MEMBER' },
      { name: 'BUSETTY SIVANAGA PRANATHI', registrationNumber: '99250040123', role: 'MEMBER' },
      { name: 'NANDYALA BALAJI', registrationNumber: '9924005332', role: 'MEMBER' }
    ]
  }
];

export default AUTHORIZED_TEAMS;
