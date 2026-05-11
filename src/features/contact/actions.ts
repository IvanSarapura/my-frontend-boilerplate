'use server';

import { contactSchema } from './schemas';

export type ContactState =
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

  // TODO: send via transactional email (Resend, Postmark, etc.)

  return {
    success: true,
    message: 'Thank you! Your message has been sent.',
  };
}
