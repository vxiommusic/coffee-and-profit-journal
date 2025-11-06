'use client';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';
import { useMemo } from 'react';

// A temporary check to prevent app crash if Firebase config is missing.
const isFirebaseConfigured =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseApp, auth, firestore } = useMemo(() => initializeFirebase(), []);

  if (!isFirebaseConfigured) {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
            <div className="w-full max-w-md rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
                <h1 className="mb-4 text-2xl font-bold">Firebase Configuration Missing</h1>
                <p className="mb-2 text-muted-foreground">
                    It looks like your Firebase environment variables are not set. Please create a <code>.env.local</code> file in the root of your project and add your Firebase configuration.
                </p>
                <p className="text-muted-foreground">
                    You can use the <code>.env.local.example</code> file as a template.
                </p>
            </div>
        </div>
    );
  }

  return (
    <FirebaseProvider value={{ app: firebaseApp, auth, firestore }}>
      {children}
    </FirebaseProvider>
  );
}
