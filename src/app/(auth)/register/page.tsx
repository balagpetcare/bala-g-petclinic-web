import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Register for the Bala G Pet Clinic patient portal.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
