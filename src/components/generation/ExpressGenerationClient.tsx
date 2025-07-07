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
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const initialState = {
  message: '',
  questionPaper: '',
  success: false,
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
  const [numQuestions, setNumQuestions] = useState(10);

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
                <Input id="subject" name="subject" placeholder="e.g., Physics, History" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <Input id="gradeLevel" name="gradeLevel" placeholder="e.g., 10th Grade" required />
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
                <Label htmlFor="numberOfQuestions">Number of Questions: {numQuestions}</Label>
                <Slider
                  id="numberOfQuestions"
                  name="numberOfQuestions"
                  min={1}
                  max={50}
                  step={1}
                  value={[numQuestions]}
                  onValueChange={(value) => setNumQuestions(value[0])}
                />
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
