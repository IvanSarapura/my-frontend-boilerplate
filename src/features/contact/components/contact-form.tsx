'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Messages } from '@/i18n/config';

import type { ContactState } from '../actions';
import { submitContactAction } from '../actions';
import type { ContactErrorMessages, ContactFormData } from '../schemas';
import { getContactSchema } from '../schemas';
import styles from './contact-form.module.css';

function getServerError(
  state: ContactState | null,
  field: keyof ContactFormData,
): string | undefined {
  if (state && 'errors' in state) return state.errors[field]?.[0];
  return undefined;
}

type ContactFormProps = {
  errorMessages: ContactErrorMessages;
  labels: Messages['contact'];
};

export function ContactForm({ errorMessages, labels }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(
    submitContactAction,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const { addToast } = useToast();

  const schema = useMemo(
    () => getContactSchema(errorMessages),
    [errorMessages],
  );

  const {
    register,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (state?.success) {
      addToast({
        title: labels.successTitle,
        description: state.message,
        variant: 'success',
      });
      reset();
    }
  }, [state, reset, addToast, labels]);

  return (
    <form ref={formRef} action={formAction} className={styles.form} noValidate>
      <Input
        label={labels.nameLabel}
        placeholder={labels.namePlaceholder}
        error={errors.name?.message ?? getServerError(state, 'name')}
        {...register('name')}
      />
      <Input
        label={labels.emailLabel}
        type="email"
        placeholder={labels.emailPlaceholder}
        error={errors.email?.message ?? getServerError(state, 'email')}
        {...register('email')}
      />
      <Textarea
        label={labels.messageLabel}
        placeholder={labels.messagePlaceholder}
        rows={5}
        error={errors.message?.message ?? getServerError(state, 'message')}
        {...register('message')}
      />
      <div className={styles.actions}>
        <Button type="submit" disabled={pending}>
          {pending ? labels.sendingLabel : labels.submitLabel}
        </Button>
      </div>
    </form>
  );
}
