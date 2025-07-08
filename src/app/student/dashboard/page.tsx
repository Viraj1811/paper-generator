import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, BarChart2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const upcomingTests = [
    { id: 1, subject: 'Physics', topic: 'Kinematics', date: '2024-08-15', time: '10:00 AM' },
    { id: 2, subject: 'Chemistry', topic: 'Organic Chemistry', date: '2024-08-18', time: '02:00 PM' },
    { id: 3, subject: 'Mathematics', topic: 'Calculus', date: '2024-08-22', time: '11:00 AM' },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl font-headline">Welcome, Student!</h1>
        <p className="text-muted-foreground">Ready to ace your next test?</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Tests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Upcoming tests this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">View your past performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88%</div>
            <p className="text-xs text-muted-foreground">Great work, keep it up!</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
          <CardHeader>
              <CardTitle>Upcoming Tests</CardTitle>
              <CardDescription>Don't forget to prepare for these.</CardDescription>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead className="w-[150px] sm:w-auto">Subject</TableHead>
                          <TableHead>Topic</TableHead>
                          <TableHead className="hidden md:table-cell">Date</TableHead>
                          <TableHead className="hidden md:table-cell">Time</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {upcomingTests.map((test) => (
                          <TableRow key={test.id}>
                              <TableCell className="font-medium">{test.subject}</TableCell>
                              <TableCell>{test.topic}</TableCell>
                              <TableCell className="hidden md:table-cell">{test.date}</TableCell>
                              <TableCell className="hidden md:table-cell">{test.time}</TableCell>
                              <TableCell className="text-right">
                                  <Button variant="outline" size="sm" disabled>Start Test</Button>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>

    </div>
  );
}
