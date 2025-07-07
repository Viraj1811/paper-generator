import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Shuffle, Edit } from 'lucide-react';

interface QuestionPaperPreviewProps {
    content: string;
}

export function QuestionPaperPreview({ content }: QuestionPaperPreviewProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Generated Paper Preview</CardTitle>
                <CardDescription>Review the generated questions. You can edit, shuffle, or download the paper.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96 w-full rounded-md border p-4 bg-muted/20">
                    <pre className="whitespace-pre-wrap font-sans text-sm">{content}</pre>
                </ScrollArea>
            </CardContent>
            <CardFooter className="justify-end gap-2">
                <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                <Button variant="outline"><Shuffle className="mr-2 h-4 w-4" /> Shuffle</Button>
                <Button><Download className="mr-2 h-4 w-4" /> Download as PDF</Button>
            </CardFooter>
        </Card>
    );
}
