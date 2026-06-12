import { z } from 'zod';

import { apiClient } from '@/lib/api/client';
import { env } from '@/lib/env';

const commentSchema = z.object({
  postId: z.number(),
  id: z.number(),
  name: z.string(),
  email: z.string(),
  body: z.string(),
});

export type Comment = z.infer<typeof commentSchema>;

export async function getComments(postId: number): Promise<Comment[]> {
  return apiClient(`${env.NEXT_PUBLIC_API_ORIGIN}/posts/${postId}/comments`, {
    schema: z.array(commentSchema),
  });
}
