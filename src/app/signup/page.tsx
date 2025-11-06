'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const formSchema = z
  .object({
    email: z.string().email('Неверный формат email'),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export default function SignupPage() {
  const { app } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!app) return;
    setIsLoading(true);
    const auth = getAuth(app);
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка регистрации',
        description:
          error.code === 'auth/email-already-in-use'
            ? 'Этот email уже используется.'
            : 'Произошла ошибка. Пожалуйста, попробуйте еще раз.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="animate-in fade-in-0">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <Flame className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">
              Создать аккаунт
            </CardTitle>
            <CardDescription>
              Начните свой путь к прибыльной торговле.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Подтвердите пароль</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Создание аккаунта...' : 'Создать аккаунт'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
            <p className="text-muted-foreground">
              Уже есть аккаунт?{' '}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Войти
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
