import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus2, BookCopy, Users } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, Teacher!</h1>
        <p className="text-muted-foreground">Here's a summary of your activities.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <BookCopy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,540</div>
            <p className="text-xs text-muted-foreground">in your question bank</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Papers Generated</CardTitle>
            <FilePlus2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+215</div>
            <p className="text-xs text-muted-foreground">in the last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">across all batches</p>
          </CardContent>
        </Card>
      </div>

      <Card className="text-center">
        <CardHeader>
            <CardTitle>Create a New Question Paper</CardTitle>
            <CardDescription>Generate a new paper instantly using one of the modes below.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/teacher/generate/express" passHref legacyBehavior>
                <Button asChild size="lg" className="w-full sm:w-auto">
                    <a>
                        <FilePlus2 className="mr-2 h-4 w-4" />
                        Express Mode
                    </a>
                </Button>
            </Link>
            <Button size="lg" variant="outline" disabled className="w-full sm:w-auto">
                Automated Mode (Soon)
            </Button>
            <Button size="lg" variant="outline" disabled className="w-full sm:w-auto">
                Manual Mode (Soon)
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
