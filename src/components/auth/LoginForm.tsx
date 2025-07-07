'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function LoginForm() {
  return (
    <Tabs defaultValue="teacher" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="teacher">Teacher</TabsTrigger>
        <TabsTrigger value="student">Student</TabsTrigger>
      </TabsList>
      <TabsContent value="teacher">
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Teacher Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="teacher-email">Email</Label>
                <Input
                  id="teacher-email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teacher-password">Password</Label>
                <Input id="teacher-password" type="password" required />
              </div>
              <Link href="/teacher/dashboard" legacyBehavior>
                <Button asChild type="submit" className="w-full">
                  <a>Login</a>
                </Button>
              </Link>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="student">
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Student Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="student-email">Email</Label>
                <Input
                  id="student-email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="student-password">Password</Label>
                <Input id="student-password" type="password" required />
              </div>
               <Link href="/student/dashboard" legacyBehavior>
                <Button asChild type="submit" className="w-full">
                  <a>Login</a>
                </Button>
              </Link>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
