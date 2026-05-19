import { z } from 'zod';

export type ContactErrorMessages = {
  nameMin: string;
  emailInvalid: string;
  messageMin: string;
};

export function getContactSchema(errors: ContactErrorMessages) {
  return z.object({
    name: z.string().min(2, errors.nameMin),
    email: z.string().email(errors.emailInvalid),
    message: z.string().min(10, errors.messageMin),
  });
}

export type ContactSchema = ReturnType<typeof getContactSchema>;
export type ContactFormData = z.infer<ContactSchema>;
