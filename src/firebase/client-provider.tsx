'use client';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';
import { useMemo } from 'react';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseApp, auth, firestore } = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider value={{ app: firebaseApp, auth, firestore }}>
      {children}
    </FirebaseProvider>
  );
}
