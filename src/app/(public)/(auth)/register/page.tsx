import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { Suspense } from 'react';

export default function CadastroPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}