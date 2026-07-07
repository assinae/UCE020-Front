'use client';

import { Suspense } from 'react';
import { RedefinePasswordForm } from "@/features/auth/components/RedefinePasswordForm";

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={null}>
      <RedefinePasswordForm />
    </Suspense>
  );
}