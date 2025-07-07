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

const subjectsAndTopics: Record<string, string[]> = {
    "Physics": ["Kinematics", "Optics", "Thermodynamics", "Electromagnetism"],
    "History": ["Ancient Rome", "World War II", "The Renaissance", "The Cold War"],
    "Mathematics": ["Calculus", "Algebra", "Geometry", "Trigonometry"],
    "Biology": ["Genetics", "Cell Biology", "Ecology", "Human Anatomy"],
    "Chemistry": ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Biochemistry"],
    "English": ["Shakespearean Literature", "Modernist Poetry", "Grammar and Composition", "Victorian Novels"],
    "Geography": ["Physical Geography", "Human Geography", "Climatology", "Geopolitics"],
    "Computer Science": ["Data Structures", "Algorithms", "Operating Systems", "Networking"],
    "Art": ["Impressionism", "Cubism", "Surrealism", "History of Art"],
    "Music": ["Classical Music Theory", "Jazz History", "Modern Pop Music", "Music Composition"],
    "Coding": ["Python Basics", "JavaScript for Web", "Java Fundamentals", "C++ Programming"]
};
const allSubjects = Object.keys(subjectsAndTopics);
const gradeLevels = ["1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade", "University"];

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
  
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [topicsForSubject, setTopicsForSubject] = useState<string[]>([]);

  const handleSubjectChange = (selectedSubject: string) => {
    setSubject(selectedSubject);
    setTopic('');
    setTopicsForSubject(subjectsAndTopics[selectedSubject] || []);
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
                <Label htmlFor="subject">Subject</Label>
                <Select name="subject" value={subject} onValueChange={handleSubjectChange} required>
                    <SelectTrigger id="subject">
                        <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                        {allSubjects.map(s => (
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
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <Select name="gradeLevel" defaultValue="10th Grade">
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
