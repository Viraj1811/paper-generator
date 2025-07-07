import Image from 'next/image';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">ExamCraft</h1>
            <p className="text-balance text-muted-foreground">
              The intelligent question paper generator
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://placehold.co/1080/1920.png"
          alt="Image"
          width="1080"
          height="1920"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          data-ai-hint="education classroom"
        />
      </div>
    </div>
  );
}
