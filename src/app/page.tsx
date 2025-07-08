import Image from 'next/image';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="mx-auto grid w-full max-w-sm gap-6">
          <div className="grid gap-4 text-center">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl font-headline">Shayak's Paper Generator</h1>
            <p className="text-balance text-muted-foreground">
              The intelligent question paper generator
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
      <div className="hidden bg-secondary lg:block">
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
