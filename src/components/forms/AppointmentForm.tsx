'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { Input, TextArea, Select, Button } from '@/components/ui';
import { FormStatusMessage } from '@/components/shared';
import type { AppointmentFormData, FormState, SelectOption } from '@/types';
import { isValidEmail, isValidPhone } from '@/lib/utils';
import { clinicServices } from '@/data/services';

const petTypeOptions: SelectOption[] = [
  { label: 'Dog', value: 'dog' },
  { label: 'Cat', value: 'cat' },
  { label: 'Bird', value: 'bird' },
  { label: 'Rabbit', value: 'rabbit' },
  { label: 'Other', value: 'other' },
];

const serviceOptions: SelectOption[] = clinicServices.map((s) => ({
  label: s.title,
  value: s.slug,
}));

const timeSlotOptions: SelectOption[] = [
  { label: '9:00 AM – 10:00 AM', value: '09:00' },
  { label: '10:00 AM – 11:00 AM', value: '10:00' },
  { label: '11:00 AM – 12:00 PM', value: '11:00' },
  { label: '12:00 PM – 1:00 PM', value: '12:00' },
  { label: '2:00 PM – 3:00 PM', value: '14:00' },
  { label: '3:00 PM – 4:00 PM', value: '15:00' },
  { label: '4:00 PM – 5:00 PM', value: '16:00' },
  { label: '5:00 PM – 6:00 PM', value: '17:00' },
  { label: '6:00 PM – 7:00 PM', value: '18:00' },
  { label: '7:00 PM – 8:00 PM', value: '19:00' },
];

const initialFormData: AppointmentFormData = {
  petName: '',
  petType: '',
  ownerName: '',
  phone: '',
  email: '',
  serviceSlug: '',
  preferredDate: '',
  preferredTime: '',
  notes: '',
};

function validate(data: AppointmentFormData): Partial<Record<keyof AppointmentFormData, string>> {
  const errors: Partial<Record<keyof AppointmentFormData, string>> = {};

  if (!data.petName.trim()) errors.petName = 'Pet name is required';
  if (!data.petType) errors.petType = 'Select a pet type';
  if (!data.ownerName.trim()) errors.ownerName = 'Your name is required';
  if (!data.phone.trim()) errors.phone = 'Phone number is required';
  else if (!isValidPhone(data.phone)) errors.phone = 'Enter a valid phone number';
  if (data.email && !isValidEmail(data.email)) errors.email = 'Enter a valid email';
  if (!data.serviceSlug) errors.serviceSlug = 'Select a service';
  if (!data.preferredDate) errors.preferredDate = 'Select a date';
  if (!data.preferredTime) errors.preferredTime = 'Select a time slot';

  return errors;
}

export function AppointmentForm() {
  const [formData, setFormData] = useState<AppointmentFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof AppointmentFormData, string>>>({});
  const [state, setState] = useState<FormState>({ status: 'idle', message: null });

  const updateField = useCallback(
    (field: keyof AppointmentFormData, value: string) => {
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

      // Simulate API call (replace with actual API integration later)
      await new Promise((r) => setTimeout(r, 1200));

      setState({
        status: 'success',
        message: 'Appointment request submitted successfully! We will confirm your booking shortly.',
      });
      setFormData(initialFormData);
    },
    [formData]
  );

  const todayISO = new Date().toISOString().split('T')[0];

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit}>
      <FormStatusMessage state={state} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          error={errors.petName}
          label="Pet name"
          name="petName"
          placeholder="e.g. Buddy"
          required
          value={formData.petName}
          onChange={(e) => updateField('petName', e.target.value)}
        />
        <Select
          error={errors.petType}
          label="Pet type"
          name="petType"
          options={petTypeOptions}
          placeholder="Select type"
          required
          value={formData.petType}
          onChange={(e) => updateField('petType', e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          error={errors.ownerName}
          label="Your name"
          name="ownerName"
          placeholder="Full name"
          required
          value={formData.ownerName}
          onChange={(e) => updateField('ownerName', e.target.value)}
        />
        <Input
          error={errors.phone}
          label="Phone number"
          name="phone"
          placeholder="+91 XXXXXXXXXX"
          required
          type="tel"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
        />
      </div>

      <Input
        error={errors.email}
        hint="Optional — for appointment confirmation email"
        label="Email address"
        name="email"
        placeholder="you@example.com"
        type="email"
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
      />

      <Select
        error={errors.serviceSlug}
        label="Service required"
        name="serviceSlug"
        options={serviceOptions}
        placeholder="Select a service"
        required
        value={formData.serviceSlug}
        onChange={(e) => updateField('serviceSlug', e.target.value)}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          error={errors.preferredDate}
          label="Preferred date"
          min={todayISO}
          name="preferredDate"
          required
          type="date"
          value={formData.preferredDate}
          onChange={(e) => updateField('preferredDate', e.target.value)}
        />
        <Select
          error={errors.preferredTime}
          label="Preferred time"
          name="preferredTime"
          options={timeSlotOptions}
          placeholder="Select time slot"
          required
          value={formData.preferredTime}
          onChange={(e) => updateField('preferredTime', e.target.value)}
        />
      </div>

      <TextArea
        hint="Any specific concerns, symptoms, or requests?"
        label="Additional notes"
        name="notes"
        placeholder="Describe any specific concerns..."
        rows={4}
        value={formData.notes}
        onChange={(e) => updateField('notes', e.target.value)}
      />

      <Button
        className="w-full sm:w-auto"
        disabled={state.status === 'submitting'}
        size="lg"
        type="submit"
      >
        {state.status === 'submitting' ? 'Submitting...' : 'Book Appointment'}
      </Button>
    </form>
  );
}
