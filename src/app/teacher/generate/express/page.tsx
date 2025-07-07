import { ExpressGenerationClient } from '@/components/generation/ExpressGenerationClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ExpressGenerationPage() {
    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Express Question Paper Generator</CardTitle>
                    <CardDescription>
                        Instantly generate a question paper with AI. Just specify your requirements below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ExpressGenerationClient />
                </CardContent>
            </Card>
        </div>
    );
}
