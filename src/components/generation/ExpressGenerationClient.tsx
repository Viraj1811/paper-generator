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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="e.g., Physics, History" required />
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
        <SubmitButton />
      </form>

      {state.success && state.questionPaper && (
        <QuestionPaperPreview content={state.questionPaper} />
      )}
    </div>
  );
}
