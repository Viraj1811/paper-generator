'use client';

import { useRef } from 'react';
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
import { Download, Shuffle, Edit } from 'lucide-react';
import { marked } from 'marked';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface QuestionPaperPreviewProps {
  content: string;
}

export function QuestionPaperPreview({ content }: QuestionPaperPreviewProps) {
  const paperContentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const contentElement = paperContentRef.current;
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
    pdf.save('question-paper.pdf');
  };

  const getHtmlContent = () => {
    if (!content) return { __html: '' };
    const rawMarkup = marked.parse(content, {
      gfm: true,
      breaks: true,
      smartLists: true,
    });
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
        <ScrollArea className="h-96 w-full rounded-md border bg-card">
          <div
            ref={paperContentRef}
            className="prose dark:prose-invert prose-sm min-w-full p-4"
            dangerouslySetInnerHTML={getHtmlContent()}
          />
        </ScrollArea>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
        <Button variant="outline">
          <Shuffle className="mr-2 h-4 w-4" /> Shuffle
        </Button>
        <Button onClick={handleDownloadPdf}>
          <Download className="mr-2 h-4 w-4" /> Download as PDF
        </Button>
      </CardFooter>
    </Card>
  );
}
