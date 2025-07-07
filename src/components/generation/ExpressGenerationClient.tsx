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
import { Checkbox } from '@/components/ui/checkbox';

const initialState = {
  message: '',
  questionPaper: '',
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
    "10th Grade": { "Geometry": ["Proofs", "Trigonometry", "Circles"], "Chemistry": ["The Periodic Table", "Stoichiometry", "Gas Laws"], "English": ["American Literature", "Research Skills", "Rhetorical Analysis"], "World History": ["The Renaissance", "The Enlightenment", "Global Conflicts"], },
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
        "Computer Science": ["Data Structures", "Algorithms", "Operating Systems", "Database Management", "Computer Networks", "Artificial Intelligence"],
        "History": ["Ancient Greek History", "The Roman Empire", "The French Revolution", "The Cold War", "History of Science"],
        "Chemistry": ["Organic Chemistry I & II", "Physical Chemistry", "Inorganic Chemistry", "Analytical Chemistry", "Biochemistry"],
        "Physics": ["Classical Mechanics", "Quantum Mechanics", "Electromagnetism", "Thermodynamics & Statistical Mechanics", "Astrophysics"],
        "Mathematics": ["Calculus I, II, III", "Linear Algebra", "Differential Equations", "Abstract Algebra", "Real Analysis"],
        "English Literature": ["Shakespearean Drama", "The Victorian Novel", "Modernist Poetry", "Literary Criticism", "Postmodernism"],
        "Art History": ["Italian Renaissance Art", "Baroque Art", "Impressionism and Post-Impressionism", "Modern Art", "History of Photography"],
        "Music Theory": ["Diatonic Harmony", "Chromatic Harmony", "Counterpoint", "Form and Analysis", "Orchestration"],
    },
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Generate Paper
    </Button>
  );
}

export function ExpressGenerationClient() {
  const [state, formAction] = useFormState(generatePaperAction, initialState);
  const { toast } = useToast();
  
  const [grade, setGrade] = useState('10th Grade');
  const [streamsForGrade, setStreamsForGrade] = useState<string[]>([]);
  const [stream, setStream] = useState('');
  const [subjectsForGrade, setSubjectsForGrade] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [topicsForSubject, setTopicsForSubject] = useState<string[]>([]);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    handleGradeChange(grade);
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

    if (["11th Grade", "12th Grade"].includes(selectedGrade)) {
        setStreamsForGrade(gradeDataKeys);
    } else {
        setSubjectsForGrade(gradeDataKeys);
        if (selectedGrade === "University") {
            setSubject(gradeDataKeys[0] || '');
            handleSubjectChange(gradeDataKeys[0] || '', selectedGrade, '');
        }
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

  const handleSubjectChange = (selectedSubject: string, currentGrade?: string, currentStream?: string) => {
    const effGrade = currentGrade || grade;
    const effStream = currentStream || stream;

    setSubject(selectedSubject);
    let newTopics: string[] = [];
    const gradeData = gradeSubjectTopicMap[effGrade as keyof typeof gradeSubjectTopicMap];

    if (gradeData) {
        if (effStream && ["11th Grade", "12th Grade"].includes(effGrade)) { // For 11th/12th grade
            const streamData = gradeData[effStream as keyof typeof gradeData];
            if (streamData && typeof streamData === 'object' && !Array.isArray(streamData)) {
                 newTopics = streamData[selectedSubject as keyof typeof streamData] || [];
            }
        } else { // For grades 1-10 and University
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
                    <Label htmlFor="stream">Stream</Label>
                    <Select name="stream" value={stream} onValueChange={handleStreamChange} required>
                        <SelectTrigger id="stream">
                            <SelectValue placeholder="Select stream" />
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
                <Label htmlFor="subject">{grade === 'University' ? 'Field of Study' : 'Subject'}</Label>
                <Select name="subject" value={subject} onValueChange={handleSubjectChange} required disabled={!grade || (streamsForGrade.length > 0 && !stream)}>
                    <SelectTrigger id="subject">
                        <SelectValue placeholder={`Select ${grade === 'University' ? 'field' : 'subject'}`} />
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
                <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                <Input id="numberOfQuestions" name="numberOfQuestions" type="number" defaultValue={10} min={1} max={50} required />
            </div>
        </div>

        <div className="space-y-4 pt-2">
            <Label>Question Types</Label>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center space-x-2">
                    <Checkbox id="qt_mcq" name="questionTypes" value="mcq" defaultChecked />
                    <Label htmlFor="qt_mcq" className="font-normal cursor-pointer">Multiple Choice</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="qt_one_liner" name="questionTypes" value="one_liner" />
                    <Label htmlFor="qt_one_liner" className="font-normal cursor-pointer">One Liner</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="qt_short_note" name="questionTypes" value="short_note" />
                    <Label htmlFor="qt_short_note" className="font-normal cursor-pointer">Short Answer</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="qt_long_answer" name="questionTypes" value="long_answer" />
                    <Label htmlFor="qt_long_answer" className="font-normal cursor-pointer">Long Answer</Label>
                </div>
            </div>
        </div>
        
        <SubmitButton />
      </form>

      {state.success && state.questionPaper && (
        <QuestionPaperPreview content={state.questionPaper} />
      )}
    </div>
  );
}
