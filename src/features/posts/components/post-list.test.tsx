import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PostList } from './post-list';

describe('PostList', () => {
  it('renders a list of posts', () => {
    const posts = [
      { id: 1, title: 'One', body: 'Body one' },
      { id: 2, title: 'Two', body: 'Body two' },
    ];

    render(<PostList posts={posts} />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  it('renders empty list when no posts', () => {
    render(<PostList posts={[]} />);
    expect(screen.getByRole('list')).toBeEmptyDOMElement();
  });
});
