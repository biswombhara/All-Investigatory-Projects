
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Loader } from '../../components/Loader.jsx';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert.jsx';
import { Lock } from 'lucide-react';
import { AdminDashboard } from '../../components/admin/AdminDashboard.jsx';
import { VisitorCounter } from '../../components/VisitorCounter.jsx';

// In a real app, this would be an environment variable
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      // Asynchronously check for admin status to avoid flash of unauthorized content
      if (user && user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    }
  }, [user, authLoading]);

  if (loading || authLoading) {
    return <Loader />;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto flex h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <Alert variant="destructive" className="max-w-md text-center">
          <Lock className="mx-auto h-6 w-6" />
          <AlertTitle className="mt-2 text-xl font-bold">Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-headline text-4xl font-bold">Admin Dashboard</h1>
      <VisitorCounter />
      <div className="mt-8">
         <AdminDashboard />
      </div>
    </div>
  );
}
