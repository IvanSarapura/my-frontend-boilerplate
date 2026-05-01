'use server';

import { contactSchema } from './schemas';

type ContactState =
  | { success: false; errors: Record<string, string[]> }
  | { success: true; message: string };

export async function submitContactAction(
  _prevState: ContactState | null,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: formData.get('name')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    message: formData.get('message')?.toString() ?? '',
  };

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Simulate a network delay and store/forward logic
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // In a real app you would send an email or save to a database here.

  console.log('[Server Action] Contact form submitted:', parsed.data);

  return {
    success: true,
    message: 'Thank you! Your message has been sent.',
  };
}
