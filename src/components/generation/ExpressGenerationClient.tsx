'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generatePaperAction } from '@/app/teacher/generate/express/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QuestionPaperPreview } from '@/components/generation/QuestionPaperPreview';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const initialState = {
  message: '',
  questionPapers: [],
  success: false,
};

const languages = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "हिन्दी" },
    { value: "Marathi", label: "मराठी" },
    { value: "Gujarati", label: "ગુજરાતી" },
    { value: "Bengali", label: "বাংলা" },
    { value: "Tamil", label: "தமிழ்" },
    { value: "Telugu", label: "తెలుగు" },
    { value: "Kannada", label: "ಕನ್ನಡ" },
    { value: "Punjabi", label: "ਪੰਜਾਬੀ" },
    { value: "Malayalam", label: "മലയാളം" },
    { value: "Odia", label: "ଓଡ଼ିଆ" },
    { value: "Assamese", label: "অসমীয়া" },
];

const gradeLevels = [
    "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", 
    "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", 
    "11th Grade", "12th Grade", "University"
];

const gradeSubjectTopicMap = {
    "1st Grade": { 
        "English": ["Alphabet", "Phonics", "Simple Sentences", "Vocabulary"], 
        "Mathematics": ["Counting (1-100)", "Addition & Subtraction (single digit)", "Shapes", "Number Names"], 
        "EVS": ["My Body", "My Family", "Animals Around Us", "Plants Around Us", "Seasons"] 
    },
    "2nd Grade": { 
        "English": ["Reading Comprehension", "Nouns and Verbs", "Punctuation", "Simple Paragraphs"],
        "Mathematics": ["Place Value", "Addition & Subtraction (two digits)", "Basic Multiplication", "Measurement"],
        "EVS": ["Types of Houses", "Festivals of India", "Good Habits", "Our Helpers", "Means of Transport"],
        "Hindi": ["Varnmala (Alphabet)", "Matra (Vowels)", "Simple Words & Sentences", "Ginti (Counting)"]
    },
    "3rd Grade": { 
        "English": ["Writing Paragraphs", "Adjectives and Adverbs", "Story Elements", "Tenses (Simple Present/Past)"],
        "Mathematics": ["Multiplication & Division", "Introduction to Fractions", "Area & Perimeter", "Time and Money"],
        "EVS": ["Our Environment", "Water Cycle", "Safety and First Aid", "The Solar System"],
        "Hindi": ["Vachan (Number)", "Ling (Gender)", "Vilom Shabd (Antonyms)", "Sangya (Noun)"],
        "General Knowledge": ["Indian States & Capitals", "National Symbols", "Famous Indian Personalities", "Sports"]
    },
    "4th Grade": { 
        "English": ["Complex Sentences", "Figurative Language (Simile, Metaphor)", "Letter Writing", "Pronouns"],
        "Mathematics": ["Long Division", "Decimals", "Geometry Basics (Angles, Lines)", "Factors and Multiples"],
        "EVS": ["Food Chains", "States of Matter", "Human Body Systems (Digestive, Respiratory)", "Our Constitution"],
        "Hindi": ["Sarvanam (Pronoun)", "Kriya (Verb)", "Visheshan (Adjective)", "Paryayvachi (Synonyms)"],
        "General Knowledge": ["World Capitals", "Famous Inventions", "Indian Rivers", "Current Affairs"],
        "Computer": ["Parts of a Computer", "MS Paint", "Input and Output devices", "Introduction to Keyboard"]
    },
    "5th Grade": {
        "English": ["Essay Writing", "Verb Tenses (Continuous, Perfect)", "Active and Passive Voice", "Types of Sentences"],
        "Mathematics": ["Order of Operations (BODMAS)", "Volume", "Graphing (Bar graphs)", "Profit and Loss"],
        "EVS": ["Natural Disasters", "Pollution and its types", "Conservation of Resources", "Freedom Struggle of India"],
        "Hindi": ["Karak (Case)", "Muhavare (Idioms)", "Patra Lekhan (Letter Writing)", "Kahani Lekhan (Story Writing)"],
        "General Knowledge": ["Indian History overview", "Famous Monuments of World", "Science Facts", "Awards and Honours"],
        "Computer": ["MS Word Basics", "Internet & Email Basics", "Computer Networks Introduction", "History of Computers"],
        "Moral Science": ["Honesty", "Respect for Elders", "Responsibility", "Kindness to Animals"]
    },
    "6th Grade": { 
        "English": ["Notice Writing", "Literary Devices", "Reading Unseen Passages", "Grammar Revision"],
        "Hindi": ["Sandhi (Joining)", "Samas (Compound words)", "Alankar (Figures of speech)", "Upasarg and Pratyay"],
        "Mathematics": ["Ratios and Proportions", "Integers", "Basic Algebra (Expressions)", "Basic Geometry"],
        "Science": ["Components of Food", "Separation of Substances", "The Body and Its Movements", "Light, Shadows and Reflections"],
        "Social Science": ["History: What, Where, How and When?", "Geography: The Earth in the Solar System", "Civics: Understanding Diversity"],
        "Computer": ["Introduction to QBasic", "More on MS Word", "Internet and Email Etiquette", "File Management"]
    },
    "7th Grade": { 
        "English": ["Persuasive Writing", "Poetry Analysis", "Report Writing", "Direct and Indirect Speech"],
        "Hindi": ["Ras (Aesthetics)", "Chhand (Meter)", "Kavya (Poetry Analysis)", "Viram Chinh (Punctuation)"],
        "Mathematics": ["Algebraic Equations", "Probability", "Triangles and their Properties", "Data Handling (Mean, Median, Mode)"],
        "Science": ["Nutrition in Plants and Animals", "Fibre to Fabric", "Heat", "Acids, Bases and Salts", "Weather, Climate, and Adaptations"],
        "Social Science": ["History: Tracing Changes Through A Thousand Years", "Geography: Inside Our Earth", "Civics: On Equality"],
        "Computer": ["HTML Basics", "Introduction to MS Excel", "Cyber Security Basics", "Algorithms and Flowcharts"]
    },
    "8th Grade": { 
        "English": ["Dialogue Writing", "Rhetorical Devices", "Thesis Statements", "Clauses"],
        "Hindi": ["Hindi Sahitya ka Itihas (History of Hindi Literature)", "Nibandh Lekhan (Essay Writing)", "Vachya (Voice)"],
        "Mathematics": ["Linear Equations in One Variable", "Squares and Square Roots", "Cubes and Cube Roots", "Comparing Quantities (Percentage, Profit & Loss)"],
        "Science": ["Crop Production and Management", "Microorganisms: Friend and Foe", "Coal and Petroleum", "Cell - Structure and Functions", "Force and Pressure"],
        "Social Science": ["History: How, When and Where", "Geography: Resources", "Civics: The Indian Constitution"],
        "Computer": ["Introduction to C++", "Data Handling in Excel", "Networking Concepts", "Introduction to Photoshop"],
        "Sanskrit": ["Shabd Roop (Nouns)", "Dhatu Roop (Verbs)", "Anuvad (Translation)", "Sandhi Prakaran"]
    },
    "9th Grade": { 
        "English": ["Literary Archetypes", "Satire", "Advanced Grammar (Modals, Conditionals)", "Story Writing"],
        "Hindi": ["Kritika (Part 1)", "Kshitij (Part 1)", "Vyakaran (Grammar)", "Samvad Lekhan (Dialogue Writing)"],
        "Mathematics": ["Number Systems", "Polynomials", "Coordinate Geometry", "Lines and Angles", "Triangles", "Circles", "Surface Areas and Volumes", "Statistics"],
        "Science": ["Matter in Our Surroundings", "The Fundamental Unit of Life", "Tissues", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy"],
        "Social Science": ["History: The French Revolution", "Geography: India - Size and Location", "Civics: What is Democracy? Why Democracy?", "Economics: The Story of Village Palampur"],
        "Computer": ["Basics of Information Technology", "Cyber-safety", "Office tools (Word, Excel, PowerPoint)", "Scratch or Python Basics"],
        "Sanskrit": ["Sandhi Prakaran", "Samas Prakaran", "Pratyaya", "Shabd Roop & Dhatu Roop Revision"]
    },
    "10th Grade": {
        "English": ["First Flight (Prose)", "First Flight (Poetry)", "Footprints Without Feet (Suppl. Reader)", "Grammar (Tenses, Modals, Voice, Speech)"],
        "Hindi": ["Kshitij (Part 2 - Poetry)", "Kshitij (Part 2 - Prose)", "Sanchayan (Part 2)", "Vyakaran (Grammar - Rass, Vachya, Pad Parichay)"],
        "Mathematics": ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles", "Constructions", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"],
        "Science": ["Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds", "Periodic Classification of Elements", "Life Processes", "Control and Coordination", "How do Organisms Reproduce?", "Heredity and Evolution", "Light – Reflection and Refraction", "The Human Eye and the Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Sources of Energy", "Our Environment"],
        "Social Science": ["History: The Rise of Nationalism in Europe", "Geography: Resources and Development", "Civics: Power Sharing", "Economics: Development"],
        "Computer": ["Digital Documentation (Advanced)", "Electronic Spreadsheet (Advanced)", "Database Management Systems", "Web Applications and Security"]
    },
    "11th Grade": {
        "Science": { 
            "Physics": ["Units and Measurement", "Motion in a Straight Line", "Laws of Motion", "Work, Energy and Power", "Gravitation", "Thermodynamics"], 
            "Chemistry": ["Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity in Properties", "Chemical Bonding and Molecular Structure", "States of Matter", "Equilibrium"], 
            "Mathematics": ["Sets", "Relations and Functions", "Trigonometric Functions", "Principle of Mathematical Induction", "Complex Numbers and Quadratic Equations", "Linear Inequalities", "Permutations and Combinations", "Binomial Theorem"],
            "Biology": ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom", "Cell: The Unit of Life", "Photosynthesis in Higher Plants"],
            "English": ["Hornbill (Prose and Poetry)", "Snapshots (Supplementary Reader)", "Grammar and Composition", "Note Making"],
            "Computer Science": ["Computer Systems and Organisation", "Computational Thinking and Programming - 1", "Introduction to Python Programming"],
            "Physical Education": ["Changing Trends & Career in Physical Education", "Olympic Value Education", "Physical Fitness, Wellness & Lifestyle"]
        },
        "Commerce": { 
            "Accountancy": ["Introduction to Accounting", "Theory Base of Accounting", "Recording of Business Transactions", "Bank Reconciliation Statement", "Depreciation, Provisions and Reserves"],
            "Business Studies": ["Nature and Purpose of Business", "Forms of Business Organisation", "Private, Public and Global Enterprises", "Business Services", "Emerging Modes of Business"],
            "Economics": ["Indian Economy on the Eve of Independence", "Indian Economy (1950-1990)", "Statistics for Economics: Introduction", "Collection, Organisation and Presentation of Data"],
            "Mathematics": ["Sets and Functions", "Algebra", "Coordinate Geometry", "Calculus", "Statistics and Probability"],
            "English": ["Hornbill (Prose and Poetry)", "Snapshots (Supplementary Reader)", "Business Communication", "Report Writing"],
            "IP": ["Introduction to Computer System", "Introduction to Python", "Database concepts and SQL", "Emerging Trends"],
            "Physical Education": ["Changing Trends & Career in Physical Education", "Olympic Value Education", "Physical Fitness, Wellness & Lifestyle"]
        },
        "Arts": { 
            "History": ["From the Beginning of Time", "Writing and City Life", "An Empire Across Three Continents", "The Central Islamic Lands"],
            "Geography": ["Geography as a Discipline", "The Origin and Evolution of the Earth", "Interior of the Earth", "India: Location"],
            "Political Science": ["Constitution: Why and How?", "Rights in the Indian Constitution", "Election and Representation", "Executive", "Legislature"],
            "Sociology": ["Sociology and Society", "Terms, Concepts and their use in Sociology", "Understanding Social Institutions", "Culture and Socialisation"],
            "English": ["Hornbill (Prose and Poetry)", "Snapshots (Supplementary Reader)", "Literary Theory", "World Literature Survey"],
            "Psychology": ["What is Psychology?", "Methods of Enquiry in Psychology", "The Bases of Human Behaviour", "Human Development"],
            "Home Science": ["Concept and scope of Home Science", "Human Development: Life Span Approach", "Food, Nutrition, Health and Fitness", "Family and Community Resources"]
        },
    },
    "12th Grade": {
        "Science": { 
            "Physics": ["Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity", "Moving Charges and Magnetism", "Ray Optics", "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms and Nuclei", "Semiconductor Electronics"], 
            "Chemistry": ["Solutions", "Electrochemistry", "Chemical Kinetics", "The d-and f-Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules"], 
            "Mathematics": ["Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity and Differentiability", "Application of Derivatives", "Integrals", "Application of Integrals", "Differential Equations", "Vector Algebra", "Three Dimensional Geometry", "Linear Programming", "Probability"],
            "Biology": ["Reproduction in Organisms", "Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health", "Principles of Inheritance and Variation", "Molecular Basis of Inheritance", "Evolution", "Human Health and Disease", "Biotechnology: Principles and Processes", "Ecosystem", "Biodiversity and Conservation"],
            "English": ["Flamingo (Prose and Poetry)", "Vistas (Supplementary Reader)", "Advanced Writing Skills (Notice, Report, Letter)", "Reading Comprehension"],
            "Computer Science": ["Computational Thinking and Programming - 2", "Computer Networks", "Database Management", "Python Revision Tour"],
            "Physical Education": ["Planning in Sports", "Sports & Nutrition", "Yoga & Lifestyle", "Psychology & Sports"]
        },
        "Commerce": { 
            "Accountancy": ["Accounting for Not-for-Profit Organisation", "Accounting for Partnership: Basic Concepts", "Reconstitution of a Partnership Firm", "Dissolution of Partnership Firm", "Accounting for Share Capital", "Financial Statements of a Company", "Ratio Analysis", "Cash Flow Statement"],
            "Business Studies": ["Nature and Significance of Management", "Principles of Management", "Business Environment", "Planning", "Organising", "Staffing", "Directing", "Controlling", "Financial Management", "Marketing Management"],
            "Economics": ["Introductory Macroeconomics: National Income", "Money and Banking", "Determination of Income and Employment", "Government Budget and the Economy", "Balance of Payments", "Indian Economic Development"],
            "Mathematics": ["Relations and Functions", "Matrices & Determinants", "Calculus (Continuity, Differentiation, Integration)", "Vectors & 3D Geometry", "Linear Programming", "Probability"],
            "English": ["Flamingo (Prose and Poetry)", "Vistas (Supplementary Reader)", "Advanced Business Writing", "Presentation Skills"],
            "IP": ["Data Handling using Pandas and Data Visualization", "Database Query using SQL", "Introduction to Computer Networks", "Societal Impacts"],
            "Physical Education": ["Planning in Sports", "Sports & Nutrition", "Yoga & Lifestyle", "Psychology & Sports"]
        },
        "Arts": { 
            "History": ["Bricks, Beads and Bones: The Harappan Civilisation", "Kings, Farmers and Towns", "Kinship, Caste and Class", "Thinkers, Beliefs and Buildings", "Bhakti-Sufi Traditions", "The Mughal Empire", "Colonialism and the Countryside", "Mahatma Gandhi and the Nationalist Movement"],
            "Geography": ["Human Geography: Nature and Scope", "The World Population: Distribution, Density and Growth", "Primary, Secondary, and Tertiary Activities", "Transport and Communication", "Human Settlements", "India: People and Economy"],
            "Political Science": ["The Cold War Era", "The End of Bipolarity", "US Hegemony in World Politics", "Politics in India Since Independence", "Challenges to Nation Building"],
            "Sociology": ["Introducing Indian Society", "The Demographic Structure of the Indian Society", "Social Institutions: Continuity and Change", "The Market as a Social Institution", "Social Movements"],
            "English": ["Flamingo (Prose and Poetry)", "Vistas (Supplementary Reader)", "Postcolonial Literature", "Critical Analysis"],
            "Psychology": ["Variations in Psychological Attributes", "Self and Personality", "Meeting Life Challenges", "Psychological Disorders", "Therapeutic Approaches"],
            "Home Science": ["Work, Livelihood And Career", "Nutrition for Self, Family and Community", "Management of Resources", "Fabric and Apparel", "Community Development"]
        },
    },
    "University": {
        "Engineering": {
            "Computer Science": ["Data Structures", "Algorithms", "Operating Systems", "Computer Networks", "Database Management Systems", "Artificial Intelligence"],
            "Mechanical Engineering": ["Thermodynamics", "Fluid Mechanics", "Machine Design", "Manufacturing Processes", "Theory of Machines"],
            "Electrical Engineering": ["Circuit Theory", "Electromagnetics", "Power Systems", "Control Systems", "Digital Electronics"],
            "Civil Engineering": ["Structural Analysis", "Geotechnical Engineering", "Transportation Engineering", "Environmental Engineering", "Fluid Mechanics"],
            "Chemical Engineering": ["Process Calculations", "Chemical Thermodynamics", "Fluid Flow Operations", "Mass Transfer"]
        },
        "Medical": {
            "Anatomy": ["Gross Anatomy", "Histology", "Embryology", "Neuroanatomy"],
            "Physiology": ["Human Physiology", "Neurophysiology", "Cardiovascular Physiology"],
            "Biochemistry": ["Metabolism", "Enzymology", "Molecular Biology"],
            "Pharmacology": ["General Pharmacology", "Autonomic Nervous System", "Cardiovascular Drugs"],
            "Pathology": ["General Pathology", "Systemic Pathology", "Hematology"]
        },
        "Law": {
            "Constitutional Law": ["Fundamental Rights", "Directive Principles", "Judiciary", "Indian Federalism"],
            "Criminal Law": ["Indian Penal Code", "Code of Criminal Procedure", "Law of Evidence"],
            "Corporate Law": ["Company Law", "Securities Law", "Insolvency and Bankruptcy Code"],
            "International Law": ["Public International Law", "Private International Law", "Human Rights Law"],
            "Cyber Law": ["IT Act 2000", "Cybercrimes", "Intellectual Property in Cyberspace"]
        },
        "Business Administration": {
            "Marketing": ["Principles of Marketing", "Consumer Behavior", "Digital Marketing", "Market Research", "Brand Management"],
            "Finance": ["Corporate Finance", "Financial Markets", "Investment Analysis", "Portfolio Management", "International Finance"],
            "Human Resources": ["HR Management", "Organizational Behavior", "Talent Acquisition", "Performance Management"],
            "Operations": ["Supply Chain Management", "Logistics", "Project Management", "Quality Management"]
        },
        "Humanities & Arts": {
            "History": ["Ancient Indian History", "Medieval Indian History", "Modern Indian History", "World History"],
            "English Literature": ["Shakespearean Drama", "The Victorian Novel", "Modernist Poetry", "Literary Criticism", "Indian Writing in English"],
            "Political Science": ["Indian Political Thought", "Western Political Thought", "International Relations", "Public Administration"],
            "Sociology": ["Introduction to Sociology", "Social Stratification", "Sociology of India", "Classical Sociological Theory"],
            "Economics": ["Microeconomics", "Macroeconomics", "Indian Economy", "Development Economics"]
        },
        "Journalism & Mass Communication": {
            "Introduction to Journalism": ["History of Media", "News Writing & Reporting", "Media Ethics & Laws"],
            "Digital Media": ["Social Media Management", "Content Creation", "SEO for Journalists", "Podcast Production"],
            "Broadcast Journalism": ["TV Reporting", "Radio Production", "Documentary Filmmaking"],
            "Public Relations": ["Principles of PR", "Corporate Communication", "Crisis Management"]
        }
    }
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Generate Paper(s)
    </Button>
  );
}

export function ExpressGenerationClient() {
  const [state, formAction] = useFormState(generatePaperAction, initialState);
  const { toast } = useToast();
  
  const [grade, setGrade] = useState('10th Grade');
  const [streamsForGrade, setStreamsForGrade] = useState<string[]>([]);
  const [stream, setStream] = useState(''); // Also used for University Field
  const [subjectsForGrade, setSubjectsForGrade] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [topicsForSubject, setTopicsForSubject] = useState<string[]>([]);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    handleGradeChange(grade);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGradeChange = (selectedGrade: string) => {
    setGrade(selectedGrade);
    const gradeData = gradeSubjectTopicMap[selectedGrade as keyof typeof gradeSubjectTopicMap] || {};
    const gradeDataKeys = Object.keys(gradeData);

    // Reset dependent fields
    setStream('');
    setSubject('');
    setTopic('');
    setStreamsForGrade([]);
    setSubjectsForGrade([]);
    setTopicsForSubject([]);

    if (["11th Grade", "12th Grade", "University"].includes(selectedGrade)) {
        setStreamsForGrade(gradeDataKeys);
    } else {
        setSubjectsForGrade(gradeDataKeys);
    }
  };

  const handleStreamChange = (selectedStream: string) => {
      setStream(selectedStream);
      const gradeData = gradeSubjectTopicMap[grade as keyof typeof gradeSubjectTopicMap] || {};
      const streamData = gradeData[selectedStream as keyof typeof gradeData] || {};
      const newSubjects = Object.keys(streamData);
      
      setSubjectsForGrade(newSubjects);
      setSubject('');
      setTopic('');
      setTopicsForSubject([]);
  };

  const handleSubjectChange = (selectedSubject: string) => {
    setSubject(selectedSubject);
    let newTopics: string[] = [];
    const gradeData = gradeSubjectTopicMap[grade as keyof typeof gradeSubjectTopicMap];

    if (gradeData) {
        if (stream && (["11th Grade", "12th Grade", "University"].includes(grade))) {
            const streamData = gradeData[stream as keyof typeof gradeData];
            if (streamData && typeof streamData === 'object' && !Array.isArray(streamData)) {
                 newTopics = streamData[selectedSubject as keyof typeof streamData] || [];
            }
        } else { // For grades 1-10
            const subjectData = gradeData[selectedSubject as keyof typeof gradeData];
            if(Array.isArray(subjectData)) {
                newTopics = subjectData;
            }
        }
    }
    setTopicsForSubject(newTopics);
    setTopic('');
  };

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);
  
  return (
    <div className="space-y-8">
      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select name="language" defaultValue="English">
                    <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        {languages.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <Select name="gradeLevel" value={grade} onValueChange={handleGradeChange}>
                    <SelectTrigger id="gradeLevel">
                        <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                        {gradeLevels.map(g => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {streamsForGrade.length > 0 && (
                 <div className="space-y-2">
                    <Label htmlFor="stream">{grade === 'University' ? 'Field of Study' : 'Stream'}</Label>
                    <Select name="stream" value={stream} onValueChange={handleStreamChange} required>
                        <SelectTrigger id="stream">
                            <SelectValue placeholder={`Select ${grade === 'University' ? 'field' : 'stream'}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {streamsForGrade.map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
             <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select name="subject" value={subject} onValueChange={handleSubjectChange} required disabled={!grade || (streamsForGrade.length > 0 && !stream) || subjectsForGrade.length === 0}>
                    <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                        {subjectsForGrade.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="topic">{grade === 'University' ? 'Course / Paper' : 'Topic'}</Label>
                <Select name="topic" value={topic} onValueChange={setTopic} disabled={!subject} required>
                    <SelectTrigger id="topic">
                        <SelectValue placeholder={`Select ${grade === 'University' ? 'course' : 'topic'}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {topicsForSubject.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                <Select name="difficultyLevel" defaultValue="medium">
                    <SelectTrigger id="difficultyLevel">
                        <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="paperCount">Number of Papers</Label>
                <Input id="paperCount" name="paperCount" type="number" defaultValue={1} min={1} max={5} />
            </div>
        </div>

        <div className="space-y-4 pt-4">
            <Label className="text-lg font-semibold">Question Distribution & Marks</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3 rounded-lg border p-4">
                    <Label htmlFor="mcq" className="font-medium text-base">Multiple Choice</Label>
                    <div className="space-y-1.5">
                        <Label htmlFor="mcq" className="text-xs text-muted-foreground">Number of Questions</Label>
                        <Input id="mcq" name="mcq" type="number" defaultValue={10} min={0} max={25} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="mcq_marks" className="text-xs text-muted-foreground">Marks per Question</Label>
                        <Input id="mcq_marks" name="mcq_marks" type="number" defaultValue={1} min={1} max={6} />
                    </div>
                </div>
                <div className="space-y-3 rounded-lg border p-4">
                    <Label htmlFor="one_liner" className="font-medium text-base">One Liners</Label>
                    <div className="space-y-1.5">
                        <Label htmlFor="one_liner" className="text-xs text-muted-foreground">Number of Questions</Label>
                        <Input id="one_liner" name="one_liner" type="number" defaultValue={0} min={0} max={25} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="one_liner_marks" className="text-xs text-muted-foreground">Marks per Question</Label>
                        <Input id="one_liner_marks" name="one_liner_marks" type="number" defaultValue={1} min={1} max={6} />
                    </div>
                </div>
                <div className="space-y-3 rounded-lg border p-4">
                    <Label htmlFor="short_note" className="font-medium text-base">Short Answers</Label>
                    <div className="space-y-1.5">
                        <Label htmlFor="short_note" className="text-xs text-muted-foreground">Number of Questions</Label>
                        <Input id="short_note" name="short_note" type="number" defaultValue={0} min={0} max={25} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="short_note_marks" className="text-xs text-muted-foreground">Marks per Question</Label>
                        <Input id="short_note_marks" name="short_note_marks" type="number" defaultValue={2} min={1} max={6} />
                    </div>
                </div>
                <div className="space-y-3 rounded-lg border p-4">
                    <Label htmlFor="long_answer" className="font-medium text-base">Long Answers</Label>
                    <div className="space-y-1.5">
                        <Label htmlFor="long_answer" className="text-xs text-muted-foreground">Number of Questions</Label>
                        <Input id="long_answer" name="long_answer" type="number" defaultValue={0} min={0} max={25} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="long_answer_marks" className="text-xs text-muted-foreground">Marks per Question</Label>
                        <Input id="long_answer_marks" name="long_answer_marks" type="number" defaultValue={5} min={1} max={6} />
                    </div>
                </div>
            </div>
        </div>
        
        <SubmitButton />
      </form>

      {state.success && state.questionPapers && state.questionPapers.length > 0 && (
        <Tabs defaultValue="paper-0" className="pt-4">
            <TabsList>
                 {state.questionPapers.map((_, index) => (
                    <TabsTrigger key={`trigger-${index}`} value={`paper-${index}`}>
                        Paper {index + 1}
                    </TabsTrigger>
                ))}
            </TabsList>
            {state.questionPapers.map((paper, index) => (
                <TabsContent key={`content-${index}`} value={`paper-${index}`}>
                    <QuestionPaperPreview content={paper} />
                </TabsContent>
            ))}
        </Tabs>
      )}
    </div>
  );
}
