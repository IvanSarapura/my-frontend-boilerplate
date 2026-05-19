import { cacheLife } from 'next/cache';
import { z } from 'zod';

import { apiClient, ApiError } from '@/lib/api/client';

const JSONPLACEHOLDER_API = 'https://jsonplaceholder.typicode.com';

import type { Post } from '../types';

const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

export async function getPosts(): Promise<Post[]> {
  'use cache';
  cacheLife('minutes');

  return apiClient(`${JSONPLACEHOLDER_API}/posts?_limit=10`, {
    schema: z.array(postSchema),
  });
}

export async function getPostById(id: number): Promise<Post | null> {
  'use cache';
  cacheLife('minutes');

  try {
    return await apiClient(`${JSONPLACEHOLDER_API}/posts/${id}`, {
      schema: postSchema,
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
