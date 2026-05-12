'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Input, TextArea, Select, Button } from '@/components/ui';
import { FormStatusMessage } from '@/components/shared';
import type { FormState, SelectOption } from '@/types';
import { isValidPhone } from '@/lib/utils';
import { clientListBranches, clientCreateEmergencyIntake } from '@/services/public-booking-client';

const petTypeOptions: SelectOption[] = [
  { label: 'Dog', value: 'dog' },
  { label: 'Cat', value: 'cat' },
  { label: 'Bird', value: 'bird' },
  { label: 'Rabbit', value: 'rabbit' },
  { label: 'Other', value: 'other' },
];

const severityOptions: SelectOption[] = [
  { label: 'Low — can wait for next appointment', value: 'low' },
  { label: 'Medium — urgent but stable', value: 'medium' },
  { label: 'High — needs immediate attention', value: 'high' },
  { label: 'Critical — life-threatening emergency', value: 'critical' },
];

type EmergencyFormData = {
  petName: string;
  petType: string;
  ownerName: string;
  phone: string;
  symptoms: string;
  severity: string;
  branchId: string;
};

const initialFormData: EmergencyFormData = {
  petName: '',
  petType: '',
  ownerName: '',
  phone: '',
  symptoms: '',
  severity: 'medium',
  branchId: '',
};

function validate(data: EmergencyFormData): Partial<Record<keyof EmergencyFormData, string>> {
  const errors: Partial<Record<keyof EmergencyFormData, string>> = {};

  if (!data.petName.trim()) errors.petName = 'Pet name is required';
  if (!data.petType) errors.petType = 'Select a pet type';
  if (!data.ownerName.trim()) errors.ownerName = 'Your name is required';
  if (!data.phone.trim()) errors.phone = 'Phone number is required';
  else if (!isValidPhone(data.phone)) errors.phone = 'Enter a valid phone number';
  if (!data.symptoms.trim()) errors.symptoms = 'Describe the symptoms';

  return errors;
}

export function EmergencyForm() {
  const [branchOptions, setBranchOptions] = useState<SelectOption[]>([]);
  const [formData, setFormData] = useState<EmergencyFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof EmergencyFormData, string>>>({});
  const [state, setState] = useState<FormState>({ status: 'idle', message: null });

  useEffect(() => {
    void clientListBranches().then((rows) => {
      if (rows.length > 1) {
        setBranchOptions(rows.map((b) => ({ label: b.clinicName || b.name, value: b.id })));
      }
    });
  }, []);

  const updateField = useCallback(
    (field: keyof EmergencyFormData, value: string) => {
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

      const description = [
        `Severity (self-reported): ${formData.severity}`,
        '',
        'Symptoms / situation:',
        formData.symptoms.trim(),
        '',
        `Owner (callback): ${formData.ownerName.trim()}`,
      ].join('\n');

      const res = await clientCreateEmergencyIntake({
        branchId: formData.branchId || undefined,
        contactPhone: formData.phone.trim(),
        petSpecies: formData.petType,
        petName: formData.petName.trim(),
        description,
      });

      if (!res.success) {
        setState({
          status: 'error',
          message: res.error?.message ?? 'Could not send request. Please call the emergency line.',
        });
        return;
      }

      setState({
        status: 'success',
        message: `Request logged (reference ${res.data?.referenceNumber ?? ''}). Our team will contact you shortly. If this is life-threatening, call the emergency number above immediately.`,
      });
      setFormData(initialFormData);
    },
    [formData]
  );

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit}>
      <FormStatusMessage state={state} />

      {branchOptions.length > 0 && (
        <Select
          hint="Optional — helps route your request to the nearest team"
          label="Preferred branch"
          name="branchId"
          options={branchOptions}
          placeholder="Any location"
          value={formData.branchId}
          onChange={(e) => updateField('branchId', e.target.value)}
        />
      )}

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

      <Select
        error={errors.severity as string | undefined}
        label="Severity level"
        name="severity"
        options={severityOptions}
        required
        value={formData.severity}
        onChange={(e) => updateField('severity', e.target.value)}
      />

      <TextArea
        error={errors.symptoms}
        label="Describe symptoms"
        name="symptoms"
        placeholder="What symptoms is your pet showing? When did it start? Any known causes?"
        required
        rows={4}
        value={formData.symptoms}
        onChange={(e) => updateField('symptoms', e.target.value)}
      />

      <Button
        className="w-full"
        disabled={state.status === 'submitting'}
        size="lg"
        type="submit"
        variant="destructive"
      >
        {state.status === 'submitting' ? 'Sending...' : 'Submit Emergency Request'}
      </Button>
    </form>
  );
}
