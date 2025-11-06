'use client';
import { FirebaseProvider } from './provider';
import { initializeFirebase } from './index';
import { useMemo } from 'react';

function MissingFirebaseConfig() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#1E1E1E',
      color: 'white',
      fontFamily: 'sans-serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Firebase Configuration Missing</h1>
        <p style={{ color: '#9E9E9E', lineHeight: '1.5' }}>
          It looks like your Firebase environment variables are not set. Please create a <code>.env.local</code> file in the root of your project and add your Firebase configuration. You can use the <code>.env.local.example</code> file as a template.
        </p>
      </div>
    </div>
  );
}


export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseApp, auth, firestore } = useMemo(() => initializeFirebase(), []);

  if (!firebaseApp) {
    // If Firebase isn't initialized (due to missing config), show a helpful message.
    return <MissingFirebaseConfig />;
  }

  return (
    <FirebaseProvider value={{ app: firebaseApp, auth, firestore }}>
      {children}
    </FirebaseProvider>
  );
}
