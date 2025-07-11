'use client';

import { useRef, useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { generateSolutionAction, refinePaperAction } from '@/app/teacher/generate/express/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Shuffle, Edit, Check, Lightbulb, Loader2 } from 'lucide-react';
import { Marked } from 'marked';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface QuestionPaperPreviewProps {
  content: string;
  headerText?: string;
  logoSrc?: string | null;
}

function RefineButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shuffle className="mr-2 h-4 w-4" />}
            Refine Paper
        </Button>
    )
}

function RefineForm({ paperContent, onRefine }: { paperContent: string, onRefine: (newContent: string) => void }) {
    const [state, formAction] = useActionState(refinePaperAction, {
        message: '',
        success: false,
    });
    const { toast } = useToast();

    useEffect(() => {
        if (state.success && state.refinedPaper) {
            onRefine(state.refinedPaper);
            toast({
                title: 'Success',
                description: state.message,
            });
        } else if (!state.success && state.message) {
            toast({
                variant: 'destructive',
                title: 'Refinement Error',
                description: state.message,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);
    
    return (
        <form action={formAction}>
            <input type="hidden" name="questionPaper" value={paperContent} />
            <Separator className="my-4" />
            <CardHeader className="p-6 pt-0">
                <CardTitle className="text-xl">Refine Paper (Optional)</CardTitle>
                <CardDescription>
                    Provide instructions to modify the paper above. For example, "Replace the first two questions with questions about the Cold War."
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                    <Textarea
                        name="prompt"
                        placeholder="Your instructions..."
                        className="min-h-[100px] resize-y"
                        required
                    />
                    <RefineButton />
                </div>
            </CardContent>
        </form>
    )
}

export function QuestionPaperPreview({ content, headerText, logoSrc }: QuestionPaperPreviewProps) {
  const paperForPdfRef = useRef<HTMLDivElement>(null);
  const solutionForPdfRef = useRef<HTMLDivElement>(null);
  const [paperContent, setPaperContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);
  
  const [isSolutionLoading, setIsSolutionLoading] = useState(false);
  const [solutionContent, setSolutionContent] = useState('');
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setPaperContent(content);
    setIsEditing(false); // Reset edit mode when a new paper is generated
    setSolutionContent(''); // Clear previous solution
  }, [content]);

  const handleDownloadPdf = async (elementRef: React.RefObject<HTMLDivElement>, filename: string) => {
    const contentElement = elementRef.current;
    if (!contentElement) {
      return;
    }

    const canvas = await html2canvas(contentElement, {
      scale: 2,
      width: contentElement.scrollWidth,
      height: contentElement.scrollHeight,
      windowWidth: contentElement.scrollWidth,
      windowHeight: contentElement.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(filename);
  };

  const handleShuffle = () => {
    const sections = paperContent.split(/(?=^##\s.*$)/m);

    const shuffledFullContent = sections.map(section => {
        const questions = section.split(/(?=\n\d+\.\s)/);
        const header = questions.shift() || '';
        
        if (questions.length < 2) return section; 
        
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        
        const renumberedQuestions = questions.map((q, index) => {
            return q.trim().replace(/^\d+\.\s/, `${index + 1}. `);
        });
        
        return header.trim() + '\n\n' + renumberedQuestions.join('\n\n');
    }).join('\n\n');

    setPaperContent(shuffledFullContent.trim());
  };

  const handleShowSolution = async () => {
    setIsSolutionLoading(true);
    const result = await generateSolutionAction(paperContent);
    setIsSolutionLoading(false);

    if (result.success && result.solution) {
      setSolutionContent(result.solution);
      setIsSolutionModalOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Solution',
        description: result.message,
      });
    }
  };

  const getHtmlContent = (markdown: string) => {
    if (!markdown) return { __html: '' };
    const marked = new Marked({
      gfm: true,
      breaks: true,
      smartLists: true,
    });
    const rawMarkup = marked.parse(markdown) as string;
    return { __html: rawMarkup };
  };

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Generated Paper Preview</CardTitle>
        <CardDescription>
          Review the generated questions. You can edit, shuffle, download, or view the solution.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
            <Textarea 
                value={paperContent} 
                onChange={(e) => setPaperContent(e.target.value)}
                className="h-96 w-full resize-y font-mono text-sm"
                aria-label="Edit question paper content"
            />
        ) : (
            <ScrollArea className="h-96 w-full rounded-md border bg-card">
              <div
                className="prose dark:prose-invert prose-sm min-w-full p-4"
                dangerouslySetInnerHTML={getHtmlContent(paperContent)}
              />
            </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-2">
        {isEditing ? (
            <>
                <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    setPaperContent(content); // Reset to original on cancel
                }} className="w-full sm:w-auto">
                    Cancel
                </Button>
                <Button onClick={() => setIsEditing(false)} className="w-full sm:w-auto">
                    <Check className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </>
        ) : (
            <>
                <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" onClick={handleShuffle} className="w-full sm:w-auto">
                  <Shuffle className="mr-2 h-4 w-4" /> Shuffle
                </Button>
                <Button variant="outline" onClick={() => handleDownloadPdf(paperForPdfRef, 'question-paper.pdf')} className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" /> Download Paper
                </Button>
                <Button onClick={handleShowSolution} disabled={isSolutionLoading} className="w-full sm:w-auto">
                  {isSolutionLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Lightbulb className="mr-2 h-4 w-4" />
                  )}
                  Show Solution
                </Button>
            </>
        )}
      </CardFooter>
      
      {!isEditing && <RefineForm paperContent={paperContent} onRefine={setPaperContent} />}
    </Card>

    <Dialog open={isSolutionModalOpen} onOpenChange={setIsSolutionModalOpen}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Solutions</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] w-full rounded-md border bg-card">
          <div
            className="prose dark:prose-invert prose-sm min-w-full p-4"
            dangerouslySetInnerHTML={getHtmlContent(solutionContent)}
          />
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleDownloadPdf(solutionForPdfRef, 'solution-paper.pdf')}>
            <Download className="mr-2 h-4 w-4" /> Download as PDF
          </Button>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    {/* Hidden container for PDF rendering */}
    <div className="absolute -left-[9999px] top-auto w-[800px] text-black">
      <div ref={paperForPdfRef} className="bg-white p-12">
        {(logoSrc || headerText) && (
          <div className="flex items-center justify-between pb-4 border-b mb-6">
            {logoSrc ? ( <img src={logoSrc} alt="School Logo" className="h-20 object-contain" /> ) : <div className="w-20 h-20"/> }
            {headerText && <div className="text-2xl font-bold text-center flex-grow mx-4 sm:text-3xl">{headerText}</div>}
            <div className="w-20 h-20" /> {/* Spacer */}
          </div>
        )}
        <div
          className="prose min-w-full"
          dangerouslySetInnerHTML={getHtmlContent(paperContent)}
        />
      </div>
      
      <div ref={solutionForPdfRef} className="bg-white p-12">
        {(logoSrc || headerText) && (
          <div className="flex items-center justify-between pb-4 border-b mb-6">
            {logoSrc ? ( <img src={logoSrc} alt="School Logo" className="h-20 object-contain" /> ) : <div className="w-20 h-20"/> }
            {headerText && <div className="text-2xl font-bold text-center flex-grow mx-4 sm:text-3xl">{headerText}</div>}
            <div className="w-20 h-20" /> {/* Spacer */}
          </div>
        )}
        <div
          className="prose min-w-full"
          dangerouslySetInnerHTML={getHtmlContent(solutionContent)}
        />
      </div>
    </div>
    </>
  );
}
