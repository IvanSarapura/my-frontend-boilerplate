import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import PostDetailPage, { generateMetadata, generateStaticParams } from './page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('@/i18n/dictionaries', () => ({
  getDictionary: vi.fn().mockResolvedValue({
    posts: { title: 'Posts', description: 'Demo' },
    common: {},
    home: {},
  }),
}));

const mockPosts = [
  { id: 1, userId: 1, title: 'First Post', body: 'Body one' },
  { id: 2, userId: 1, title: 'Second Post', body: 'Body two' },
];

vi.mock('@/features/posts', () => ({
  getPosts: vi.fn().mockResolvedValue([
    { id: 1, userId: 1, title: 'First Post', body: 'Body one' },
    { id: 2, userId: 1, title: 'Second Post', body: 'Body two' },
  ]),
  getPostById: vi.fn(async (id: number) => {
    return mockPosts.find((p) => p.id === id) ?? null;
  }),
}));

describe('Post detail page', () => {
  it('renders title and body for an existing post', async () => {
    const jsx = await PostDetailPage({
      params: Promise.resolve({ locale: 'en', id: '1' }),
    });
    render(jsx);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'First Post',
    );
    expect(screen.getByText('Body one')).toBeInTheDocument();
  });

  it('calls notFound for a missing post id', async () => {
    const { notFound } = await import('next/navigation');
    await expect(
      PostDetailPage({ params: Promise.resolve({ locale: 'en', id: '9999' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });

  it('calls notFound for an unknown locale', async () => {
    const { notFound } = await import('next/navigation');
    await expect(
      PostDetailPage({ params: Promise.resolve({ locale: 'fr', id: '1' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });

  it('calls notFound for a non-numeric id', async () => {
    await expect(
      PostDetailPage({ params: Promise.resolve({ locale: 'en', id: 'abc' }) }),
    ).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it('generateStaticParams enumerates one entry per post id', async () => {
    const params = await generateStaticParams();
    expect(params).toEqual([{ id: '1' }, { id: '2' }]);
  });

  it('generateMetadata returns translated title for an existing post', async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ locale: 'en', id: '1' }),
    });
    expect(meta.title).toBe('First Post | Posts');
  });

  it('generateMetadata returns empty metadata for a missing post', async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ locale: 'en', id: '9999' }),
    });
    expect(meta).toEqual({});
  });
});
