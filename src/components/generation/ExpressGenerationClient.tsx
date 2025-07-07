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
        "English": ["Alphabet", "Phonics", "Simple Sentences"], 
        "Mathematics": ["Counting", "Addition", "Subtraction", "Shapes"], 
        "EVS": ["My Body", "Family", "Animals Around Us", "Plants Around Us"] 
    },
    "2nd Grade": { 
        "English": ["Reading Comprehension", "Nouns and Verbs", "Punctuation"],
        "Mathematics": ["Place Value", "Basic Multiplication", "Measurement"],
        "EVS": ["Types of Houses", "Festivals", "Good Habits", "Our Helpers"],
        "Hindi": ["Varnmala (Alphabet)", "Matra (Vowels)", "Simple Words"]
    },
    "3rd Grade": { 
        "English": ["Writing Paragraphs", "Adjectives and Adverbs", "Story Elements"],
        "Mathematics": ["Multiplication & Division", "Fractions", "Area & Perimeter"],
        "EVS": ["Our Environment", "Water", "Safety and First Aid"],
        "Hindi": ["Vachan (Number)", "Ling (Gender)", "Vilom Shabd (Antonyms)"],
        "General Knowledge": ["Indian States", "National Symbols", "Famous Personalities"]
    },
    "4th Grade": { 
        "English": ["Complex Sentences", "Figurative Language", "Book Reports"],
        "Mathematics": ["Long Division", "Decimals", "Geometry Basics"],
        "EVS": ["Food Chains", "Geology", "Our Environment"],
        "Hindi": ["Sangya (Noun)", "Sarvanam (Pronoun)", "Kriya (Verb)"],
        "General Knowledge": ["World Capitals", "Inventions", "Sports"],
        "Computer": ["Parts of a Computer", "MS Paint", "Input and Output devices"]
    },
    "5th Grade": {
        "English": ["Essay Writing", "Verb Tenses", "Themes in Literature"],
        "Mathematics": ["Order of Operations", "Volume", "Graphing"],
        "EVS": ["Natural Disasters", "Pollution", "Conservation"],
        "Hindi": ["Visheshan (Adjective)", "Karak (Case)", "Muhavare (Idioms)"],
        "General Knowledge": ["Indian History", "Famous Monuments", "Science Facts"],
        "Computer": ["MS Word", "Internet Basics", "Computer Networks"],
        "Moral Science": ["Honesty", "Respect for Elders", "Responsibility"]
    },
    "6th Grade": { 
        "English": ["Research Papers", "Literary Analysis", "Mythology"],
        "Hindi": ["Sandhi (Joining)", "Samas (Compound words)", "Alankar (Figures of speech)"],
        "Mathematics": ["Ratios and Proportions", "Integers", "Expressions"],
        "Science": ["Components of Food", "Separation of Substances", "The Body and Movements"],
        "Social Science": ["History: What, Where, How and When?", "Geography: The Earth in the Solar System", "Civics: Understanding Diversity"],
        "Computer": ["Introduction to QBasic", "More on MS Word", "Internet and Email"]
    },
    "7th Grade": { 
        "English": ["Persuasive Writing", "Poetry Analysis", "Dystopian Literature"],
        "Hindi": ["Ras (Aesthetics)", "Chhand (Meter)", "Kavya (Poetry)"],
        "Mathematics": ["Algebraic Equations", "Probability", "Geometric Figures"],
        "Science": ["Nutrition in Plants and Animals", "Fibre to Fabric", "Heat", "Acids, Bases and Salts"],
        "Social Science": ["History: Tracing Changes Through A Thousand Years", "Geography: Environment", "Civics: On Equality"],
        "Computer": ["HTML Basics", "Introduction to MS Excel", "Cyber Security"]
    },
    "8th Grade": { 
        "English": ["Shakespeare", "Rhetorical Devices", "Thesis Statements"],
        "Hindi": ["Hindi Sahitya ka Itihas (History of Hindi Literature)", "Patra Lekhan (Letter Writing)"],
        "Mathematics": ["Linear Functions", "Pythagorean Theorem", "Scientific Notation"],
        "Science": ["Crop Production and Management", "Microorganisms: Friend and Foe", "Coal and Petroleum"],
        "Social Science": ["History: How, When and Where", "Geography: Resources", "Civics: The Indian Constitution"],
        "Computer": ["Introduction to C++", "Data Handling in Excel", "Networking Concepts"],
        "Sanskrit": ["Shabd Roop (Nouns)", "Dhatu Roop (Verbs)", "Anuvad (Translation)"]
    },
    "9th Grade": { 
        "English": ["Literary Archetypes", "Satire", "Advanced Grammar"],
        "Hindi": ["Kritika", "Kshitij", "Vyakaran (Grammar)"],
        "Mathematics": ["Number Systems", "Polynomials", "Coordinate Geometry", "Euclid's Geometry"],
        "Science": ["Matter in Our Surroundings", "The Fundamental Unit of Life", "Motion", "Force and Laws of Motion"],
        "Social Science": ["History: The French Revolution", "Geography: India - Size and Location", "Civics: What is Democracy? Why Democracy?", "Economics: The Story of Village Palampur"],
        "Computer": ["Basics of Information Technology", "Cyber-safety", "Office tools"],
        "Sanskrit": ["Sandhi Prakaran", "Samas Prakaran", "Pratyaya"]
    },
    "10th Grade": {
        "English": ["First Flight - Prose", "First Flight - Poetry", "Footprints Without Feet", "Grammar"],
        "Hindi": ["Kshitij (Poetry and Prose)", "Sanchayan", "Vyakaran (Grammar)"],
        "Mathematics": ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Statistics", "Probability"],
        "Science": ["Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds", "Life Processes", "Control and Coordination", "How do Organisms Reproduce?", "Heredity and Evolution", "Light – Reflection and Refraction", "Human Eye and the Colourful World", "Electricity", "Magnetic Effects of Electric Current"],
        "Social Science": ["History: The Rise of Nationalism in Europe", "Geography: Resources and Development", "Civics: Power Sharing", "Economics: Development"],
        "Computer": ["Digital Documentation", "Electronic Spreadsheet", "Database Management Systems", "Web Applications and Security"]
    },
    "11th Grade": {
        "Science": { 
            "Physics": ["Units and Measurement", "Motion in a Straight Line", "Laws of Motion", "Work, Energy and Power", "Gravitation"], 
            "Chemistry": ["Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity in Properties", "Chemical Bonding and Molecular Structure"], 
            "Mathematics": ["Sets", "Relations and Functions", "Trigonometric Functions", "Complex Numbers and Quadratic Equations"],
            "Biology": ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom"],
            "English": ["Hornbill - Prose and Poetry", "Snapshots - Supplementary Reader", "Grammar and Composition"],
            "Computer Science/IP": ["Computer Systems and Organisation", "Computational Thinking and Programming - 1", "Introduction to Python"],
            "Physical Education": ["Changing Trends & Career in Physical Education", "Olympic Value Education", "Physical Fitness, Wellness & Lifestyle"]
        },
        "Commerce": { 
            "Accountancy": ["Introduction to Accounting", "Theory Base of Accounting", "Recording of Business Transactions"],
            "Business Studies": ["Nature and Purpose of Business", "Forms of Business Organisation", "Private, Public and Global Enterprises"],
            "Economics": ["Indian Economy on the Eve of Independence", "Indian Economy (1950-1990)", "Statistics for Economics: Introduction"],
            "Mathematics": ["Sets", "Relations and Functions", "Trigonometric Functions"],
            "English": ["Business Communication", "Report Writing", "Grammar"],
            "IP": ["Introduction to Computer System", "Introduction to Python", "Database concepts and SQL"],
            "Physical Education": ["Changing Trends & Career in Physical Education", "Olympic Value Education", "Physical Fitness, Wellness & Lifestyle"]
        },
        "Arts": { 
            "History": ["From the Beginning of Time", "Writing and City Life", "An Empire Across Three Continents"],
            "Geography": ["Geography as a Discipline", "The Origin and Evolution of the Earth", "India: Location"],
            "Political Science": ["Constitution: Why and How?", "Rights in the Indian Constitution", "Election and Representation"],
            "Sociology": ["Sociology and Society", "Understanding Social Institutions", "Culture and Socialisation"],
            "English": ["Literary Theory", "World Literature Survey", "Advanced Composition"],
            "Psychology": ["What is Psychology?", "Methods of Enquiry in Psychology", "The Bases of Human Behaviour"],
            "Home Science": ["Concept and scope of Home Science", "Human Development", "Food, Nutrition, Health and Fitness"]
        },
    },
    "12th Grade": {
        "Science": { 
            "Physics": ["Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity", "Moving Charges and Magnetism"], 
            "Chemistry": ["Solutions", "Electrochemistry", "Chemical Kinetics", "The d-and f-Block Elements"], 
            "Mathematics": ["Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Calculus"],
            "Biology": ["Reproduction in Organisms", "Sexual Reproduction in Flowering Plants", "Human Reproduction", "Genetics and Evolution"],
            "English": ["Flamingo - Prose and Poetry", "Vistas - Supplementary Reader", "Advanced Writing Skills"],
            "Computer Science/IP": ["Computational Thinking and Programming - 2", "Computer Networks", "Database Management"],
            "Physical Education": ["Planning in Sports", "Sports & Nutrition", "Yoga & Lifestyle"]
        },
        "Commerce": { 
            "Accountancy": ["Accounting for Not-for-Profit Organisation", "Accounting for Partnership: Basic Concepts", "Reconstitution of a Partnership Firm"],
            "Business Studies": ["Nature and Significance of Management", "Principles of Management", "Business Environment"],
            "Economics": ["Introductory Macroeconomics: National Income", "Money and Banking", "Determination of Income and Employment"],
            "Mathematics": ["Calculus", "Vectors", "Probability"],
            "English": ["Advanced Business Writing", "Presentation Skills", "Flamingo and Vistas"],
            "IP": ["Data Handling using Pandas", "Data Visualization", "Database Query using SQL"],
            "Physical Education": ["Planning in Sports", "Sports & Nutrition", "Yoga & Lifestyle"]
        },
        "Arts": { 
            "History": ["Bricks, Beads and Bones: The Harappan Civilisation", "Kings, Farmers and Towns", "Kinship, Caste and Class"],
            "Geography": ["Human Geography: Nature and Scope", "The World Population: Distribution, Density and Growth", "Primary Activities"],
            "Political Science": ["The Cold War Era", "The End of Bipolarity", "US Hegemony in World Politics"],
            "Sociology": ["Introducing Indian Society", "The Demographic Structure of the Indian Society", "Social Institutions: Continuity and Change"],
            "English": ["Postcolonial Literature", "Critical Analysis", "Flamingo and Vistas"],
            "Psychology": ["Variations in Psychological Attributes", "Self and Personality", "Meeting Life Challenges"],
            "Home Science": ["Work, Livelihood And Career", "Nutrition for Self, Family and Community", "Management of Resources"]
        },
    },
    "University": {
        "Engineering": {
            "Computer Science": ["Data Structures", "Algorithms", "Operating Systems", "Computer Networks"],
            "Mechanical Engineering": ["Thermodynamics", "Fluid Mechanics", "Machine Design"],
            "Electrical Engineering": ["Circuit Theory", "Electromagnetics", "Power Systems"],
            "Civil Engineering": ["Structural Analysis", "Geotechnical Engineering", "Transportation Engineering"]
        },
        "Law": {
            "Constitutional Law": ["Fundamental Rights", "Directive Principles", "Judiciary"],
            "Criminal Law": ["Indian Penal Code", "Code of Criminal Procedure"],
            "Corporate Law": ["Company Law", "Securities Law"]
        },
        "Business Administration (BBA)": {
            "Marketing": ["Principles of Marketing", "Consumer Behavior", "Digital Marketing"],
            "Finance": ["Corporate Finance", "Financial Markets", "Investment Analysis"],
            "Human Resources": ["HR Management", "Organizational Behavior", "Talent Acquisition"]
        },
        "Medical": {
            "Anatomy": ["Gross Anatomy", "Histology", "Embryology"],
            "Physiology": ["Human Physiology", "Neurophysiology"],
            "Biochemistry": ["Metabolism", "Enzymology"]
        },
        "Humanities": {
            "History": ["Ancient Greek History", "The Roman Empire", "The French Revolution", "The Cold War"],
            "English Literature": ["Shakespearean Drama", "The Victorian Novel", "Modernist Poetry", "Literary Criticism"],
            "Art History": ["Italian Renaissance Art", "Baroque Art", "Impressionism", "Modern Art"]
        },
        "Journalism and Mass Communication": {
            "Introduction to Journalism": ["History of Media", "News Writing", "Media Ethics"],
            "Digital Media": ["Social Media Management", "Content Creation", "SEO for Journalists"],
            "Broadcast Journalism": ["TV Reporting", "Radio Production", "Documentary Filmmaking"]
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
            newTopics = gradeData[selectedSubject as keyof typeof gradeData] || [];
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

        <div className="space-y-4 pt-2">
            <Label>Number of Questions</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="mcq" className="font-normal">Multiple Choice</Label>
                    <Input id="mcq" name="mcq" type="number" defaultValue={10} min={0} max={25} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="one_liner" className="font-normal">One Liners</Label>
                    <Input id="one_liner" name="one_liner" type="number" defaultValue={0} min={0} max={25} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="short_note" className="font-normal">Short Answers</Label>

                    <Input id="short_note" name="short_note" type="number" defaultValue={0} min={0} max={25} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="long_answer" className="font-normal">Long Answers</Label>
                    <Input id="long_answer" name="long_answer" type="number" defaultValue={0} min={0} max={25} />
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
