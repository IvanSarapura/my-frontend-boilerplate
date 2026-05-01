import { apiClient } from '@/lib/api/client';

export type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export async function getComments(postId: number): Promise<Comment[]> {
  return apiClient(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`,
  );
}
