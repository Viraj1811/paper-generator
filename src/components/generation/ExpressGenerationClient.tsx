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
    "1st Grade": {
        "Mathematics": ["Counting", "Addition", "Subtraction", "Shapes"],
        "English": ["Alphabet", "Phonics", "Simple Sentences"],
        "Science": ["Living Things", "Weather", "The 5 Senses"],
    },
    "2nd Grade": {
        "Mathematics": ["Place Value", "Basic Multiplication", "Measurement"],
        "English": ["Reading Comprehension", "Nouns and Verbs", "Punctuation"],
        "Science": ["Plants", "Animals", "The Solar System"],
    },
    "3rd Grade": {
        "Mathematics": ["Multiplication & Division", "Fractions", "Area & Perimeter"],
        "English": ["Writing Paragraphs", "Adjectives and Adverbs", "Story Elements"],
        "Science": ["Ecosystems", "Simple Machines", "Matter"],
    },
    "4th Grade": {
        "Mathematics": ["Long Division", "Decimals", "Geometry Basics"],
        "English": ["Complex Sentences", "Figurative Language", "Book Reports"],
        "Science": ["Electricity", "Food Chains", "Geology"],
    },
    "5th Grade": {
        "Mathematics": ["Order of Operations", "Volume", "Graphing"],
        "English": ["Essay Writing", "Verb Tenses", "Themes in Literature"],
        "Social Studies": ["US History", "World Geography", "Ancient Civilizations"],
        "Science": ["Cells", "Atoms and Molecules", "Weather Systems"],
    },
    "6th Grade": {
        "Mathematics": ["Ratios and Proportions", "Integers", "Expressions"],
        "English": ["Research Papers", "Literary Analysis", "Greek Mythology"],
        "Social Studies": ["World History", "Civics & Government", "Economics Basics"],
        "Science": ["Plate Tectonics", "Genetics Basics", "Energy"],
    },
    "7th Grade": {
        "Mathematics": ["Algebraic Equations", "Probability", "Geometric Figures"],
        "English": ["Persuasive Writing", "Poetry Analysis", "Dystopian Literature"],
        "History": ["American Revolution", "Medieval Europe", "Industrial Revolution"],
        "Science": ["Chemistry Basics", "Human Body Systems", "Ecology"],
    },
    "8th Grade": {
        "Mathematics": ["Linear Functions", "Pythagorean Theorem", "Scientific Notation"],
        "English": ["Shakespeare", "Rhetorical Devices", "Thesis Statements"],
        "History": ["The Civil War", "World War I", "The Constitution"],
        "Science": ["Physics of Motion", "Chemical Reactions", "Evolution"],
    },
    "9th Grade": {
        "English": ["Literary Archetypes", "Satire", "Advanced Grammar"],
        "Algebra I": ["Linear Equations", "Quadratics", "Functions"],
        "Biology": ["Cellular Biology", "Genetics", "Ecosystems"],
        "World History": ["Ancient Civilizations", "Rise of Empires", "The Middle Ages"],
    },
    "10th Grade": {
        "English": ["American Literature", "Research Skills", "Rhetorical Analysis"],
        "Geometry": ["Proofs", "Trigonometry", "Circles"],
        "Chemistry": ["The Periodic Table", "Stoichiometry", "Gas Laws", "Acids and Bases"],
        "World History": ["The Renaissance", "The Enlightenment", "Global Conflicts"],
    },
    "11th Grade": {
        "English": ["British Literature", "AP Language & Composition", "Modernist Literature"],
        "Algebra II": ["Polynomials", "Logarithms", "Matrices"],
        "Physics": ["Kinematics", "Newton's Laws", "Thermodynamics", "Electromagnetism"],
        "US History": ["Colonial Period", "Westward Expansion", "The Gilded Age", "The Cold War"],
    },
    "12th Grade": {
        "English": ["AP Literature", "Creative Writing", "World Literature"],
        "Pre-Calculus": ["Trigonometric Functions", "Vectors", "Limits"],
        "AP Biology": ["Advanced Cellular Processes", "Evolutionary Biology", "Biotechnology"],
        "AP Physics": ["Modern Physics", "Quantum Mechanics", "Relativity"],
        "Government": ["US Government", "Comparative Politics", "Political Theory"],
    },
    "University": {
        "Computer Science": ["Data Structures", "Algorithms", "Operating Systems", "Networking"],
        "Chemistry": ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Biochemistry"],
        "Physics": ["Classical Mechanics", "Quantum Physics", "Astrophysics"],
        "Mathematics": ["Calculus", "Linear Algebra", "Differential Equations"],
        "History": ["Ancient Rome", "World War II", "The Renaissance"],
        "English": ["Shakespearean Literature", "Modernist Poetry", "Victorian Novels"],
        "Art": ["Impressionism", "Cubism", "Surrealism", "History of Art"],
        "Music": ["Classical Music Theory", "Jazz History", "Modern Pop Music", "Music Composition"],
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
  const [subjectsForGrade, setSubjectsForGrade] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [topicsForSubject, setTopicsForSubject] = useState<string[]>([]);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    const defaultSubjects = Object.keys(gradeSubjectTopicMap[grade as keyof typeof gradeSubjectTopicMap] || {});
    setSubjectsForGrade(defaultSubjects);
  }, []);

  const handleGradeChange = (selectedGrade: string) => {
    setGrade(selectedGrade);
    const newSubjects = Object.keys(gradeSubjectTopicMap[selectedGrade as keyof typeof gradeSubjectTopicMap] || {});
    setSubjectsForGrade(newSubjects);
    setSubject('');
    setTopic('');
    setTopicsForSubject([]);
  };

  const handleSubjectChange = (selectedSubject: string) => {
    setSubject(selectedSubject);
    const gradeMap = gradeSubjectTopicMap[grade as keyof typeof gradeSubjectTopicMap];
    if (gradeMap) {
      const newTopics = gradeMap[selectedSubject as keyof typeof gradeMap] || [];
      setTopicsForSubject(newTopics);
    } else {
        setTopicsForSubject([]);
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
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
             <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select name="subject" value={subject} onValueChange={handleSubjectChange} required disabled={!grade}>
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
                <Label htmlFor="topic">Topic</Label>
                <Select name="topic" value={topic} onValueChange={setTopic} disabled={!subject} required>
                    <SelectTrigger id="topic">
                        <SelectValue placeholder="Select topic" />
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
