'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  EMPTY_FORM,
  createTouchedState,
  getErrors,
  isFormValid,
  type ActivityFormState,
  type TouchedState,
} from '../utils/activityFormRules';

interface UseActivityFormOptions {
  initialValues?: Partial<ActivityFormState>;
  eventDateRange?: { start: string; end: string };
  maxWorkload?: number;
  onSubmit?: (data: ActivityFormState) => void;
}

export function useActivityForm({
  initialValues,
  eventDateRange,
  maxWorkload,
  onSubmit,
}: UseActivityFormOptions) {
  const [form, setForm] = useState<ActivityFormState>({
    ...EMPTY_FORM,
    ...initialValues,
    guests: initialValues?.guests ?? [],
  });
  const [touched, setTouched] = useState<TouchedState>(createTouchedState);

  useEffect(() => {
    if (!initialValues) return;
    Promise.resolve().then(() => {
      setForm({
        ...EMPTY_FORM,
        ...initialValues,
        guests: initialValues.guests ?? [],
      });
      setTouched(createTouchedState());
    });
  }, [initialValues]);

  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [editingGuestIndex, setEditingGuestIndex] = useState<number | null>(null);

  const errors = useMemo(
    () => getErrors(form, touched, eventDateRange, maxWorkload),
    [form, touched, eventDateRange, maxWorkload]
  );
  const canSubmit = isFormValid(form, errors, eventDateRange, maxWorkload);

  function updateField(field: Exclude<keyof ActivityFormState, 'guests'>, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function markTouched(field: Exclude<keyof ActivityFormState, 'guests'>) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function toggleGenerateCertificate(value: boolean) {
    setForm((current) => ({ ...current, generateCertificate: value }));
  }

  async function handleGuestSubmit(payload: { fullName: string; role: string; email: string }) {
    const guestData = { name: payload.fullName, email: payload.email, role: payload.role };

    setForm((cur) => {
      if (editingGuestIndex !== null) {
        const next = [...cur.guests];
        next[editingGuestIndex] = guestData;
        return { ...cur, guests: next };
      }
      return { ...cur, guests: [...cur.guests, guestData] };
    });

    setEditingGuestIndex(null);
  }

  function handleRemoveGuest(index: number) {
    setForm((cur) => ({ ...cur, guests: cur.guests.filter((_, i) => i !== index) }));
  }

  function handleOpenNewGuest() {
    setEditingGuestIndex(null);
    setGuestModalOpen(true);
  }

  function handleOpenEditGuest(index: number) {
    setEditingGuestIndex(index);
    setGuestModalOpen(true);
  }

  function handleSubmit() {
    const allTouched = createTouchedState();
    (Object.keys(allTouched) as (keyof TouchedState)[]).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    const currentErrors = getErrors(form, allTouched, eventDateRange, maxWorkload);
    if (!isFormValid(form, currentErrors, eventDateRange, maxWorkload)) return;

    onSubmit?.(form);
  }

  return {
    form,
    errors,
    canSubmit,
    updateField,
    markTouched,
    toggleGenerateCertificate,
    guestModalOpen,
    setGuestModalOpen,
    editingGuestIndex,
    handleGuestSubmit,
    handleRemoveGuest,
    handleOpenNewGuest,
    handleOpenEditGuest,
    handleSubmit,
  };
}
