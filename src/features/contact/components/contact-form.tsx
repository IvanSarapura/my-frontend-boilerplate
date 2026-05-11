'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import type { ContactState } from '../actions';
import { submitContactAction } from '../actions';
import type { ContactFormData } from '../schemas';
import { contactSchema } from '../schemas';
import styles from './contact-form.module.css';

function getServerError(
  state: ContactState | null,
  field: keyof ContactFormData,
): string | undefined {
  if (state && 'errors' in state) return state.errors[field]?.[0];
  return undefined;
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactAction,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const { addToast } = useToast();

  const {
    register,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (state?.success) {
      addToast({
        title: 'Success',
        description: state.message,
        variant: 'success',
      });
      reset();
    }
  }, [state, reset, addToast]);

  return (
    <form ref={formRef} action={formAction} className={styles.form} noValidate>
      <Input
        label="Name"
        placeholder="Your name"
        error={errors.name?.message ?? getServerError(state, 'name')}
        {...register('name')}
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message ?? getServerError(state, 'email')}
        {...register('email')}
      />
      <Textarea
        label="Message"
        placeholder="How can we help?"
        rows={5}
        error={errors.message?.message ?? getServerError(state, 'message')}
        {...register('message')}
      />
      <div className={styles.actions}>
        <Button type="submit" disabled={pending}>
          {pending ? 'Sending...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
}
