'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button, Card, Input, Select, TextArea, Skeleton } from '@/components/ui';
import { FormStatusMessage } from '@/components/shared';
import type { FormState, SelectOption } from '@/types';
import type { PublicBranchSummary, PublicDoctorSummary } from '@/types/public-booking';
import {
  clientListBranches,
  clientListDoctors,
  clientListAvailability,
  clientCreateBookingRequest,
  clientCreateAuthenticatedAppointment,
  clientListPets,
  clientGetDoctorBySlug,
} from '@/services/public-booking-client';
import { isValidEmail, isValidPhone } from '@/lib/utils';
import { clinicServices } from '@/data/services';

const PET_SPECIES: SelectOption[] = [
  { label: 'Dog', value: 'Dog' },
  { label: 'Cat', value: 'Cat' },
  { label: 'Bird', value: 'Bird' },
  { label: 'Rabbit', value: 'Rabbit' },
  { label: 'Other', value: 'Other' },
];

export interface BookingWizardProps {
  initialBranchId?: string | null;
  initialDoctorSlug?: string | null;
  initialServiceSlug?: string | null;
}

function formatSlotLabel(iso: string, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: timeZone || 'UTC',
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleString();
  }
}

export function BookingWizard({
  initialBranchId,
  initialDoctorSlug,
  initialServiceSlug,
}: BookingWizardProps) {
  const { user } = useAuth();
  const idempotencyRef = useRef<string | null>(null);

  const [branches, setBranches] = useState<PublicBranchSummary[]>([]);
  const [doctors, setDoctors] = useState<PublicDoctorSummary[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [pets, setPets] = useState<{ id: string; name: string; species: string }[]>([]);

  const [loadBranches, setLoadBranches] = useState(true);
  const [loadDoctors, setLoadDoctors] = useState(false);
  const [loadSlots, setLoadSlots] = useState(false);

  /** Step index depends on branch count (see `labels` below). */
  const [step, setStep] = useState(0);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(initialBranchId ?? '');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedSlotIso, setSelectedSlotIso] = useState<string>('');

  const [guestPetName, setGuestPetName] = useState('');
  const [guestSpecies, setGuestSpecies] = useState('');
  const [guestOwner, setGuestOwner] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestNotes, setGuestNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [petId, setPetId] = useState('');
  const [reason, setReason] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<FormState>({ status: 'idle', message: null });

  const multiBranch = branches.length > 1;
  const labels = multiBranch
    ? ['Location', 'Doctor', 'Time', 'Your details']
    : ['Doctor', 'Time', 'Your details'];
  const maxStepIndex = labels.length - 1;

  const selectedBranch = useMemo(
    () => branches.find((b) => b.id === selectedBranchId),
    [branches, selectedBranchId]
  );

  const selectedDoctor = useMemo(
    () => doctors.find((d) => d.id === selectedDoctorId),
    [doctors, selectedDoctorId]
  );

  const tz = selectedBranch?.timezone ?? 'Asia/Kolkata';

  useEffect(() => {
    if (initialBranchId) setSelectedBranchId(initialBranchId);
  }, [initialBranchId]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoadBranches(true);
      const list = await clientListBranches();
      if (cancelled) return;
      setBranches(list);
      setLoadBranches(false);
      if (list.length === 1) {
        const first = list[0];
        if (first) {
          setSelectedBranchId((prev) => prev || first.id);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!initialDoctorSlug) return;
    let cancelled = false;
    void (async () => {
      const d = await clientGetDoctorBySlug(initialDoctorSlug);
      if (cancelled || !d) return;
      setSelectedDoctorId(d.id);
      setSelectedBranchId((prev) => {
        if (prev && d.branches.some((b) => b.id === prev)) return prev;
        return d.branches[0]?.id ?? prev;
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [initialDoctorSlug]);

  useEffect(() => {
    if (!user) {
      setPets([]);
      setPetId('');
      return;
    }
    void clientListPets().then((rows) => {
      setPets(rows);
      const only = rows.length === 1 ? rows[0] : undefined;
      setPetId((prev) => prev || (only ? only.id : ''));
    });
  }, [user]);

  useEffect(() => {
    if (!selectedBranchId) {
      setDoctors([]);
      return;
    }
    let cancelled = false;
    void (async () => {
      setLoadDoctors(true);
      const list = await clientListDoctors(selectedBranchId);
      if (cancelled) return;
      setDoctors(list);
      setLoadDoctors(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedBranchId]);

  useEffect(() => {
    if (!selectedDoctorId || !selectedBranchId) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    void (async () => {
      setLoadSlots(true);
      const from = new Date();
      const to = new Date(from.getTime() + 14 * 24 * 60 * 60 * 1000);
      const res = await clientListAvailability({
        doctorId: selectedDoctorId,
        branchId: selectedBranchId,
        fromIso: from.toISOString(),
        toIso: to.toISOString(),
      });
      if (cancelled) return;
      setSlots(res?.slots ?? []);
      setLoadSlots(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedDoctorId, selectedBranchId]);

  const doctorOptions: SelectOption[] = useMemo(
    () =>
      doctors.map((d) => ({
        label: `${d.firstName} ${d.lastName} — ${d.specialization}`,
        value: d.id,
      })),
    [doctors]
  );

  const branchOptions: SelectOption[] = useMemo(
    () => branches.map((b) => ({ label: b.clinicName || b.name, value: b.id })),
    [branches]
  );

  const slotOptions: SelectOption[] = useMemo(
    () => slots.map((iso) => ({ label: formatSlotLabel(iso, tz), value: iso })),
    [slots, tz]
  );

  const serviceOptions: SelectOption[] = useMemo(
    () => clinicServices.map((s) => ({ label: s.title, value: s.slug })),
    []
  );

  const [serviceSlug, setServiceSlug] = useState(initialServiceSlug ?? '');

  const goNext = useCallback(() => {
    setStep((s) => Math.min(maxStepIndex, s + 1));
  }, [maxStepIndex]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const validateGuest = useCallback(() => {
    const e: Record<string, string> = {};
    if (!guestPetName.trim()) e['guestPetName'] = 'Pet name is required';
    if (!guestSpecies) e['guestSpecies'] = 'Select species';
    if (!guestOwner.trim()) e['guestOwner'] = 'Your name is required';
    if (!guestPhone.trim()) e['guestPhone'] = 'Phone is required';
    else if (!isValidPhone(guestPhone)) e['guestPhone'] = 'Enter a valid phone';
    if (guestEmail && !isValidEmail(guestEmail)) e['guestEmail'] = 'Invalid email';
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  }, [guestEmail, guestOwner, guestPetName, guestPhone, guestSpecies]);

  const handleGuestSubmit = useCallback(async () => {
    if (!validateGuest()) return;
    if (!selectedBranchId || !selectedDoctorId || !selectedSlotIso) {
      setState({ status: 'error', message: 'Please complete branch, doctor, and time selection.' });
      return;
    }
    if (!idempotencyRef.current) {
      idempotencyRef.current =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`;
    }
    setState({ status: 'submitting', message: null });
    const res = await clientCreateBookingRequest(
      {
        branchId: selectedBranchId,
        doctorId: selectedDoctorId,
        petName: guestPetName.trim(),
        petSpecies: guestSpecies,
        ownerName: guestOwner.trim(),
        contactPhone: guestPhone.trim(),
        contactEmail: guestEmail.trim() || undefined,
        serviceSlug: serviceSlug || undefined,
        preferredScheduledAt: selectedSlotIso,
        durationMinutes: 30,
        notes: guestNotes.trim() || undefined,
        honeypot: honeypot.trim() || undefined,
      },
      { idempotencyKey: idempotencyRef.current }
    );
    if (!res.success) {
      setState({
        status: 'error',
        message: res.error?.message ?? 'Could not submit booking. Please try again.',
      });
      return;
    }
    setState({
      status: 'success',
      message: `Request received. Reference ${res.data?.referenceNumber ?? ''}. Our team will confirm your visit.`,
    });
    idempotencyRef.current = null;
  }, [
    guestEmail,
    guestNotes,
    guestOwner,
    guestPetName,
    guestPhone,
    guestSpecies,
    honeypot,
    selectedBranchId,
    selectedDoctorId,
    selectedSlotIso,
    serviceSlug,
    validateGuest,
  ]);

  const handleAuthSubmit = useCallback(async () => {
    if (!petId) {
      setFieldErrors({ ['petId']: 'Select a pet' });
      return;
    }
    if (!selectedDoctorId || !selectedSlotIso) {
      setState({ status: 'error', message: 'Select doctor and time.' });
      return;
    }
    setState({ status: 'submitting', message: null });
    const res = await clientCreateAuthenticatedAppointment({
      petId,
      doctorId: selectedDoctorId,
      branchId: selectedBranchId || undefined,
      scheduledAt: selectedSlotIso,
      duration: 30,
      reason: reason.trim() || undefined,
    });
    if (!res.success) {
      setState({
        status: 'error',
        message: res.error?.message ?? 'Booking failed. Check details or try again.',
      });
      return;
    }
    setState({
      status: 'success',
      message: `Appointment created. Reference ID: ${res.data?.id ?? 'confirmed'}.`,
    });
  }, [petId, reason, selectedBranchId, selectedDoctorId, selectedSlotIso]);

  if (!loadBranches && branches.length === 0) {
    return (
      <Card padding="lg">
        <p className="text-neutral-700 dark:text-neutral-300">
          Online booking is not available right now. Please call the clinic or try again later.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <nav aria-label="Booking progress" className="flex flex-wrap gap-2 text-sm">
        {labels.map((label, i) => (
          <span
            key={label}
            aria-current={step === i ? 'step' : undefined}
            className={`rounded-full px-3 py-1 ${
              step === i
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
            }`}
          >
            {label}
          </span>
        ))}
      </nav>

      <FormStatusMessage state={state} />

      {multiBranch && step === 0 && (
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-neutral-950 dark:text-white">Choose location</h2>
          {loadBranches ? (
            <Skeleton className="mt-4 h-10 w-full" />
          ) : (
            <div className="mt-4 space-y-4">
              <Select
                label="Branch"
                name="branch"
                options={branchOptions}
                placeholder="Select a branch"
                value={selectedBranchId}
                onChange={(e) => {
                  setSelectedBranchId(e.target.value);
                  setSelectedDoctorId('');
                  setSelectedSlotIso('');
                }}
              />
              <Button disabled={!selectedBranchId} type="button" onClick={goNext}>
                Continue
              </Button>
            </div>
          )}
        </Card>
      )}

      {((multiBranch && step === 1) || (!multiBranch && step === 0)) && (
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-neutral-950 dark:text-white">Choose veterinarian</h2>
          {loadDoctors || (!multiBranch && branches.length === 1 && !selectedBranchId && !loadBranches) ? (
            <Skeleton className="mt-4 h-10 w-full" />
          ) : (
            <div className="mt-4 space-y-4">
              {!selectedBranchId ? (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Select a branch first.</p>
              ) : doctors.length === 0 ? (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  No published doctors for this branch yet. Please call the clinic.
                </p>
              ) : (
                <Select
                  label="Doctor"
                  name="doctor"
                  options={doctorOptions}
                  placeholder="Select a doctor"
                  value={selectedDoctorId}
                  onChange={(e) => {
                    setSelectedDoctorId(e.target.value);
                    setSelectedSlotIso('');
                  }}
                />
              )}
              <div className="flex flex-wrap gap-2">
                {multiBranch && (
                  <Button type="button" variant="outline" onClick={goBack}>
                    Back
                  </Button>
                )}
                <Button disabled={!selectedDoctorId} type="button" onClick={goNext}>
                  Continue
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {((multiBranch && step === 2) || (!multiBranch && step === 1)) && (
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-neutral-950 dark:text-white">Pick a time</h2>
          <p className="mt-1 text-xs text-neutral-500">Times shown in branch timezone: {tz}</p>
          {loadSlots ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : slots.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
              No open slots in the next two weeks for this selection. Try another doctor or call the clinic.
            </p>
          ) : (
            <div className="mt-4">
              <Select
                label="Available slot"
                name="slot"
                options={slotOptions}
                placeholder="Select a slot"
                value={selectedSlotIso}
                onChange={(e) => setSelectedSlotIso(e.target.value)}
              />
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={goBack}>
              Back
            </Button>
            <Button disabled={!selectedSlotIso} type="button" onClick={goNext}>
              Continue
            </Button>
          </div>
        </Card>
      )}

      {((multiBranch && step === 3) || (!multiBranch && step === 2)) && (
        <Card padding="lg">
          <h2 className="text-lg font-semibold text-neutral-950 dark:text-white">Confirm details</h2>

          <div className="mt-4 rounded-xl bg-neutral-50 p-4 text-sm dark:bg-neutral-900/60">
            <p>
              <span className="font-medium">When:</span>{' '}
              {selectedSlotIso ? formatSlotLabel(selectedSlotIso, tz) : '—'}
            </p>
            <p className="mt-1">
              <span className="font-medium">Doctor:</span>{' '}
              {selectedDoctor ? `${selectedDoctor.firstName} ${selectedDoctor.lastName}` : '—'}
            </p>
            <p className="mt-1">
              <span className="font-medium">Branch:</span> {selectedBranch?.clinicName ?? selectedBranch?.name ?? '—'}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <Select
              hint="Helps our team prepare for your visit"
              label="Service focus (optional)"
              name="serviceSlug"
              options={serviceOptions}
              placeholder="Any service"
              value={serviceSlug}
              onChange={(e) => setServiceSlug(e.target.value)}
            />

            {user ? (
              <>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Signed in as {user.firstName} {user.lastName}.
                </p>
                {pets.length === 0 ? (
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    No pets on file for this account. Sign out to submit a guest request, or contact the clinic to add a
                    pet to your profile.
                  </p>
                ) : (
                  <Select
                    error={fieldErrors['petId']}
                    label="Pet"
                    name="petId"
                    options={pets.map((p) => ({ label: `${p.name} (${p.species})`, value: p.id }))}
                    placeholder="Select pet"
                    value={petId}
                    onChange={(e) => setPetId(e.target.value)}
                  />
                )}
                <TextArea
                  label="Reason / notes (optional)"
                  name="reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={goBack}>
                    Back
                  </Button>
                  <Button
                    disabled={state.status === 'submitting' || pets.length === 0}
                    type="button"
                    onClick={() => void handleAuthSubmit()}
                  >
                    Confirm appointment
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    error={fieldErrors['guestPetName']}
                    label="Pet name"
                    name="petName"
                    value={guestPetName}
                    onChange={(e) => setGuestPetName(e.target.value)}
                  />
                  <Select
                    error={fieldErrors['guestSpecies']}
                    label="Species"
                    name="species"
                    options={PET_SPECIES}
                    placeholder="Select"
                    value={guestSpecies}
                    onChange={(e) => setGuestSpecies(e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    error={fieldErrors['guestOwner']}
                    label="Your name"
                    name="owner"
                    value={guestOwner}
                    onChange={(e) => setGuestOwner(e.target.value)}
                  />
                  <Input
                    error={fieldErrors['guestPhone']}
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                  />
                </div>
                <Input
                  error={fieldErrors['guestEmail']}
                  label="Email (optional)"
                  name="email"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
                <TextArea
                  label="Notes (optional)"
                  name="notes"
                  rows={3}
                  value={guestNotes}
                  onChange={(e) => setGuestNotes(e.target.value)}
                />
                <input
                  aria-hidden="true"
                  autoComplete="off"
                  className="absolute -left-[9999px] h-px w-px opacity-0"
                  name="company_site"
                  tabIndex={-1}
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={goBack}>
                    Back
                  </Button>
                  <Button disabled={state.status === 'submitting'} type="button" onClick={() => void handleGuestSubmit()}>
                    Submit booking request
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      <p className="text-xs text-neutral-500">
        Guest submissions create a staff-reviewed booking request. Signed-in patients with pets on file can confirm an
        appointment when the slot is available.
      </p>
    </div>
  );
}
