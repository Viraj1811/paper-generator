'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Shuffle, Edit, Check } from 'lucide-react';
import { Marked } from 'marked';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Textarea } from '@/components/ui/textarea';

interface QuestionPaperPreviewProps {
  content: string;
}

export function QuestionPaperPreview({ content }: QuestionPaperPreviewProps) {
  const paperContentRef = useRef<HTMLDivElement>(null);
  const [paperContent, setPaperContent] = useState(content);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setPaperContent(content);
    setIsEditing(false); // Reset edit mode when a new paper is generated
  }, [content]);

  const handleDownloadPdf = async () => {
    const contentElement = paperContentRef.current;
    if (!contentElement) {
      return;
    }

    if (isEditing) {
      // To get the rendered view, we temporarily exit edit mode
      // This is a bit of a trick, but ensures what you see is what you download
      await setIsEditing(false);
    }

    // A short delay to allow React to re-render the preview
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(paperContentRef.current!, {
      scale: 2,
      width: paperContentRef.current!.scrollWidth,
      height: paperContentRef.current!.scrollHeight,
      windowWidth: paperContentRef.current!.scrollWidth,
      windowHeight: paperContentRef.current!.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('question-paper.pdf');
  };

  const handleShuffle = () => {
    const sections = paperContent.split(/(?=^##\s.*$)/m); // Split by lines starting with ##, keeping the delimiter

    const shuffledFullContent = sections.map(section => {
        // Split section into header and questions. Questions are identified by newline + number + dot.
        const questions = section.split(/(?=\n\d+\.\s)/);
        
        const header = questions.shift() || '';
        
        // Don't shuffle if there's 1 or 0 questions
        if (questions.length < 2) {
            return section; 
        }
        
        // Fisher-Yates shuffle algorithm
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        
        // Re-number the shuffled questions, cleaning them up
        const renumberedQuestions = questions.map((q, index) => {
            return q.trim().replace(/^\d+\.\s/, `${index + 1}. `);
        });
        
        // Put the section back together
        return header.trim() + '\n\n' + renumberedQuestions.join('\n\n');
    }).join('\n\n');

    setPaperContent(shuffledFullContent.trim());
  };

  const getHtmlContent = () => {
    if (!paperContent) return { __html: '' };
    const marked = new Marked({
      gfm: true,
      breaks: true,
      smartLists: true,
    });
    const rawMarkup = marked.parse(paperContent) as string;
    return { __html: rawMarkup };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated Paper Preview</CardTitle>
        <CardDescription>
          Review the generated questions. You can edit, shuffle, or download the
          paper.
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
                ref={paperContentRef}
                className="prose dark:prose-invert prose-sm min-w-full p-4"
                dangerouslySetInnerHTML={getHtmlContent()}
              />
            </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="justify-end gap-2">
        {isEditing ? (
            <>
                <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    setPaperContent(content); // Reset to original on cancel
                }}>
                    Cancel
                </Button>
                <Button onClick={() => setIsEditing(false)}>
                    <Check className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </>
        ) : (
            <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="outline" onClick={handleShuffle}>
                  <Shuffle className="mr-2 h-4 w-4" /> Shuffle
                </Button>
                <Button onClick={handleDownloadPdf}>
                  <Download className="mr-2 h-4 w-4" /> Download as PDF
                </Button>
            </>
        )}
      </CardFooter>
    </Card>
  );
}
