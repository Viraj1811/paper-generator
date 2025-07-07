import { ExpressGenerationClient } from '@/components/generation/ExpressGenerationClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ExpressGenerationPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold font-headline">Express Generator</h1>
                <p className="text-muted-foreground">
                    Instantly generate question papers with AI. Just specify your requirements below.
                </p>
            </header>
            <ExpressGenerationClient />
        </div>
    );
}
