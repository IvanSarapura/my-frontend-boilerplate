'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { useToast } from '@/components/providers/toast-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { submitContactAction } from '../actions';
import type { ContactFormData } from '../schemas';
import { contactSchema } from '../schemas';
import styles from './contact-form.module.css';

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
        error={
          errors.name?.message ??
          (state && 'errors' in state ? state.errors.name?.[0] : undefined)
        }
        {...register('name')}
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={
          errors.email?.message ??
          (state && 'errors' in state ? state.errors.email?.[0] : undefined)
        }
        {...register('email')}
      />
      <Textarea
        label="Message"
        placeholder="How can we help?"
        rows={5}
        error={
          errors.message?.message ??
          (state && 'errors' in state ? state.errors.message?.[0] : undefined)
        }
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
