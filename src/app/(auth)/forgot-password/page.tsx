import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Reset your Bala G Pet Clinic portal password.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
