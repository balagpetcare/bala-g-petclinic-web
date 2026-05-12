'use client';

import { useCallback, useState, type FormEvent } from 'react';
import { Button, Input, TextArea, Select } from '@/components/ui';
import { FormStatusMessage } from '@/components/shared';
import type { FormState, SelectOption } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { clientCreateReview } from '@/services/public-booking-client';

const ratingOptions: SelectOption[] = [5, 4, 3, 2, 1].map((n) => ({
  label: `${n} star${n === 1 ? '' : 's'}`,
  value: String(n),
}));

export interface ReviewFormProps {
  targetType: 'DOCTOR' | 'BRANCH';
  targetId: string;
}

export function ReviewForm({ targetType, targetId }: ReviewFormProps) {
  const { user } = useAuth();
  const [guestName, setGuestName] = useState('');
  const [rating, setRating] = useState('5');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [state, setState] = useState<FormState>({ status: 'idle', message: null });

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!user && !guestName.trim()) {
        setState({ status: 'error', message: 'Please enter your name.' });
        return;
      }
      if (body.trim().length < 10) {
        setState({ status: 'error', message: 'Review must be at least 10 characters.' });
        return;
      }
      setState({ status: 'submitting', message: null });
      const res = await clientCreateReview({
        targetType,
        targetId,
        guestName: user ? undefined : guestName.trim() || undefined,
        rating: Number(rating),
        title: title.trim() || undefined,
        body: body.trim(),
        honeypot: honeypot.trim() || undefined,
      });
      if (!res.success) {
        setState({
          status: 'error',
          message: res.error?.message ?? 'Could not submit review.',
        });
        return;
      }
      setState({
        status: 'success',
        message:
          'Thank you. Your review was received and is pending moderation before it appears publicly.',
      });
      setBody('');
      setTitle('');
      if (!user) setGuestName('');
    },
    [body, guestName, honeypot, rating, targetId, targetType, title, user]
  );

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <h3 className="text-base font-semibold text-neutral-950 dark:text-white">Share your experience</h3>
      <FormStatusMessage state={state} />
      {!user && (
        <Input
          label="Your name"
          name="guestName"
          placeholder="How we should display your name"
          required
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
        />
      )}
      <Select
        label="Rating"
        name="rating"
        options={ratingOptions}
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />
      <Input label="Title (optional)" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextArea
        label="Review"
        name="body"
        required
        rows={4}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <input
        aria-hidden="true"
        autoComplete="off"
        className="absolute -left-[9999px] h-px w-px opacity-0"
        tabIndex={-1}
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
      />
      <Button disabled={state.status === 'submitting'} type="submit">
        Submit review
      </Button>
    </form>
  );
}
