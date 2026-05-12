'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { Input, TextArea, Select, Button } from '@/components/ui';
import { FormStatusMessage } from '@/components/shared';
import type { ContactFormData, FormState, SelectOption } from '@/types';
import { isValidEmail, isValidPhone } from '@/lib/utils';

const subjectOptions: SelectOption[] = [
  { label: 'General enquiry', value: 'general' },
  { label: 'Appointment question', value: 'appointment' },
  { label: 'Service information', value: 'service' },
  { label: 'Shop / product enquiry', value: 'shop' },
  { label: 'Feedback or complaint', value: 'feedback' },
  { label: 'Partnership / business', value: 'business' },
];

const initialFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

function validate(data: ContactFormData): Partial<Record<keyof ContactFormData, string>> {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};

  if (!data.name.trim()) errors.name = 'Name is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!isValidEmail(data.email)) errors.email = 'Enter a valid email';
  if (data.phone && !isValidPhone(data.phone)) errors.phone = 'Enter a valid phone number';
  if (!data.subject) errors.subject = 'Select a subject';
  if (!data.message.trim()) errors.message = 'Message is required';
  else if (data.message.trim().length < 10)
    errors.message = 'Message should be at least 10 characters';

  return errors;
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [state, setState] = useState<FormState>({ status: 'idle', message: null });

  const updateField = useCallback(
    (field: keyof ContactFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const validationErrors = validate(formData);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setState({ status: 'submitting', message: null });
      await new Promise((r) => setTimeout(r, 1200));

      setState({
        status: 'success',
        message: 'Your message has been sent. We will get back to you within 24 hours.',
      });
      setFormData(initialFormData);
    },
    [formData]
  );

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit}>
      <FormStatusMessage state={state} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          error={errors.name}
          label="Full name"
          name="name"
          placeholder="Your name"
          required
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
        />
        <Input
          error={errors.email}
          label="Email address"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          error={errors.phone}
          hint="Optional"
          label="Phone number"
          name="phone"
          placeholder="+91 XXXXXXXXXX"
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
        />
        <Select
          error={errors.subject}
          label="Subject"
          name="subject"
          options={subjectOptions}
          placeholder="Select subject"
          required
          value={formData.subject}
          onChange={(e) => updateField('subject', e.target.value)}
        />
      </div>

      <TextArea
        error={errors.message}
        label="Message"
        name="message"
        placeholder="How can we help you?"
        required
        rows={5}
        value={formData.message}
        onChange={(e) => updateField('message', e.target.value)}
      />

      <Button
        className="w-full sm:w-auto"
        disabled={state.status === 'submitting'}
        size="lg"
        type="submit"
      >
        {state.status === 'submitting' ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}
