'use client';

import { useState, type FormEvent } from 'react';
import { Input, TextArea, Button } from '@/components/ui';
import { FormStatusMessage } from '@/components/shared';
import { useEcommerce } from '@/providers';
import { isValidEmail, isValidPhone } from '@/lib/utils';
import type { CheckoutFormData, FormState } from '@/types';

const initialData: CheckoutFormData = {
  fullName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  notes: '',
};

function validate(data: CheckoutFormData) {
  const errors: Partial<Record<keyof CheckoutFormData, string>> = {};
  if (!data.fullName.trim()) errors.fullName = 'Full name is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!isValidEmail(data.email)) errors.email = 'Enter a valid email';
  if (!data.phone.trim()) errors.phone = 'Phone number is required';
  else if (!isValidPhone(data.phone)) errors.phone = 'Enter a valid phone number';
  if (!data.addressLine1.trim()) errors.addressLine1 = 'Address line 1 is required';
  if (!data.city.trim()) errors.city = 'City is required';
  if (!data.state.trim()) errors.state = 'State is required';
  if (!data.postalCode.trim()) errors.postalCode = 'Postal code is required';
  return errors;
}

export function CheckoutForm() {
  const { dispatch } = useEcommerce();
  const [formData, setFormData] = useState<CheckoutFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [state, setState] = useState<FormState>({ status: 'idle', message: null });

  const updateField = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setState({ status: 'submitting', message: null });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setState({
      status: 'success',
      message: 'Order placed in demo mode. Payment integration will be added with backend APIs.',
    });
    dispatch({ type: 'CLEAR_CART' });
    setFormData(initialData);
  };

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit}>
      <FormStatusMessage state={state} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          error={errors.fullName}
          label="Full name"
          required
          value={formData.fullName}
          onChange={(event) => updateField('fullName', event.target.value)}
        />
        <Input
          error={errors.email}
          label="Email"
          required
          type="email"
          value={formData.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
      </div>

      <Input
        error={errors.phone}
        label="Phone"
        required
        value={formData.phone}
        onChange={(event) => updateField('phone', event.target.value)}
      />

      <Input
        error={errors.addressLine1}
        label="Address line 1"
        required
        value={formData.addressLine1}
        onChange={(event) => updateField('addressLine1', event.target.value)}
      />

      <Input
        error={errors.addressLine2}
        label="Address line 2 (optional)"
        value={formData.addressLine2}
        onChange={(event) => updateField('addressLine2', event.target.value)}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <Input
          error={errors.city}
          label="City"
          required
          value={formData.city}
          onChange={(event) => updateField('city', event.target.value)}
        />
        <Input
          error={errors.state}
          label="State"
          required
          value={formData.state}
          onChange={(event) => updateField('state', event.target.value)}
        />
        <Input
          error={errors.postalCode}
          label="Postal code"
          required
          value={formData.postalCode}
          onChange={(event) => updateField('postalCode', event.target.value)}
        />
      </div>

      <TextArea
        label="Order notes"
        rows={3}
        value={formData.notes}
        onChange={(event) => updateField('notes', event.target.value)}
      />

      <Button
        disabled={state.status === 'submitting'}
        fullWidth
        size="lg"
        type="submit"
      >
        {state.status === 'submitting' ? 'Placing order...' : 'Place Order'}
      </Button>
    </form>
  );
}
