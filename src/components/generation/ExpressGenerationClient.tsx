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

const gradeLevels = [
    "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", 
    "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", 
    "11th Grade", "12th Grade", "University"
];

const gradeSubjectTopicMap = {
    "1st Grade": { "Mathematics": ["Counting", "Addition", "Subtraction", "Shapes"], "English": ["Alphabet", "Phonics", "Simple Sentences"], "Environmental Science": ["Living Things", "Weather", "The 5 Senses"], },
    "2nd Grade": { "Mathematics": ["Place Value", "Basic Multiplication", "Measurement"], "English": ["Reading Comprehension", "Nouns and Verbs", "Punctuation"], "Environmental Science": ["Plants", "Animals", "The Solar System"], },
    "3rd Grade": { "Mathematics": ["Multiplication & Division", "Fractions", "Area & Perimeter"], "English": ["Writing Paragraphs", "Adjectives and Adverbs", "Story Elements"], "Science": ["Ecosystems", "Simple Machines", "Matter"], "Social Studies": ["Local Government", "Maps", "Community Helpers"], },
    "4th Grade": { "Mathematics": ["Long Division", "Decimals", "Geometry Basics"], "English": ["Complex Sentences", "Figurative Language", "Book Reports"], "Science": ["Electricity", "Food Chains", "Geology"], "Social Studies": ["State History", "Explorers", "Branches of Government"], },
    "5th Grade": { "Mathematics": ["Order of Operations", "Volume", "Graphing"], "English": ["Essay Writing", "Verb Tenses", "Themes in Literature"], "Science": ["Cells", "Atoms and Molecules", "Weather Systems"], "Social Studies": ["US History", "World Geography", "Ancient Civilizations"], },
    "6th Grade": { "Mathematics": ["Ratios and Proportions", "Integers", "Expressions"], "English": ["Research Papers", "Literary Analysis", "Mythology"], "Science": ["Plate Tectonics", "Genetics Basics", "Energy"], "Social Studies": ["World History", "Civics & Government", "Economics Basics"], },
    "7th Grade": { "Mathematics": ["Algebraic Equations", "Probability", "Geometric Figures"], "English": ["Persuasive Writing", "Poetry Analysis", "Dystopian Literature"], "Science": ["Chemistry Basics", "Human Body Systems", "Ecology"], "History": ["American Revolution", "Medieval Europe", "Industrial Revolution"], },
    "8th Grade": { "Mathematics": ["Linear Functions", "Pythagorean Theorem", "Scientific Notation"], "English": ["Shakespeare", "Rhetorical Devices", "Thesis Statements"], "Science": ["Physics of Motion", "Chemical Reactions", "Evolution"], "History": ["The Civil War", "World War I", "The Constitution"], },
    "9th Grade": { "Biology": ["Cellular Biology", "Genetics", "Ecosystems"], "Algebra I": ["Linear Equations", "Quadratics", "Functions"], "English": ["Literary Archetypes", "Satire", "Advanced Grammar"], "World History": ["Ancient Civilizations", "Rise of Empires", "The Middle Ages"], },
    "10th Grade": {
        "Science": {
            "Physics": ["Light – Reflection and Refraction", "Human Eye and Colourful World", "Electricity"],
            "Chemistry": ["Chemical Reactions", "Acids, Bases and Salts", "Carbon Compounds"],
            "Biology": ["Life Processes", "Reproduction", "Heredity"]
        },
        "Commerce": {
            "Introduction to Commerce": ["Business Basics", "Trade and Commerce"],
            "Elements of Book-keeping": ["Introduction to Accounting", "Journal Entries"],
            "Mathematics": ["Algebra", "Statistics Basics"]
        },
        "Arts": {
            "History": ["Nationalism in Europe", "Nationalism in India"],
            "Civics": ["Power Sharing", "Federalism", "Political Parties"],
            "Geography": ["Resources and Development", "Agriculture", "Minerals"]
        }
    },
    "11th Grade": {
        "Science": { "Physics": ["Kinematics", "Newton's Laws", "Work and Energy"], "Chemistry": ["Atomic Structure", "Chemical Bonding", "Thermodynamics"], "Biology": ["Plant Physiology", "Human Physiology", "Genetics"], "Mathematics": ["Sets and Functions", "Trigonometry", "Complex Numbers"], "English": ["Advanced Composition", "British Literature"], },
        "Commerce": { "Accountancy": ["Financial Accounting I", "Theory Base of Accounting"], "Business Studies": ["Forms of Business Organisation", "Emerging Modes of Business"], "Economics": ["Statistics for Economics", "Microeconomics"], "English": ["Business Communication", "Report Writing"], },
        "Arts": { "History": ["Early Societies", "Empires", "Changing Traditions"], "Political Science": ["Constitution: Why and How?", "Rights in the Indian Constitution"], "Sociology": ["Introducing Sociology", "Understanding Social Institutions"], "Psychology": ["What is Psychology?", "Methods of Enquiry in Psychology"], "English": ["Literary Theory", "World Literature Survey"], },
    },
    "12th Grade": {
        "Science": { "Physics": ["Electrostatics", "Magnetism", "Optics", "Modern Physics"], "Chemistry": ["Solutions", "Electrochemistry", "Organic Chemistry"], "Biology": ["Reproduction", "Genetics and Evolution", "Biotechnology"], "Mathematics": ["Calculus", "Vectors", "Probability"], "English": ["AP Literature", "Creative Writing"], },
        "Commerce": { "Accountancy": ["Accounting for Partnerships", "Company Accounts", "Cash Flow Statement"], "Business Studies": ["Principles of Management", "Marketing Management", "Consumer Protection"], "Economics": ["Macroeconomics", "Indian Economic Development"], "English": ["Advanced Business Writing", "Presentation Skills"], },
        "Arts": { "History": ["Themes in Indian History", "Modern World History"], "Political Science": ["Contemporary World Politics", "Politics in India Since Independence"], "Sociology": ["Social Stratification", "Social Change and Development in India"], "Psychology": ["Variations in Psychological Attributes", "Therapeutic Approaches"], "English": ["Postcolonial Literature", "Critical Analysis"], },
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

    if (["10th Grade", "11th Grade", "12th Grade", "University"].includes(selectedGrade)) {
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
        if (stream && (["10th Grade", "11th Grade", "12th Grade", "University"].includes(grade))) {
            const streamData = gradeData[stream as keyof typeof gradeData];
            if (streamData && typeof streamData === 'object' && !Array.isArray(streamData)) {
                 newTopics = streamData[selectedSubject as keyof typeof streamData] || [];
            }
        } else { // For grades 1-9
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
