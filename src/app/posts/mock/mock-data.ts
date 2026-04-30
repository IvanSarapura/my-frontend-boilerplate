export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

export const mockPosts: Post[] = [
  {
    id: 1,
    userId: 1,
    title: 'Getting started with Next.js',
    body: 'Next.js is a React framework that gives you building blocks to create web applications.',
  },
  {
    id: 2,
    userId: 1,
    title: 'TypeScript best practices',
    body: 'TypeScript adds static types to JavaScript, helping you catch errors at compile time.',
  },
  {
    id: 3,
    userId: 2,
    title: 'Testing with Vitest',
    body: 'Vitest is a blazing fast unit-test framework powered by Vite, compatible with Jest.',
  },
  {
    id: 4,
    userId: 2,
    title: 'CSS architecture with @layer',
    body: 'The @layer at-rule lets you define cascade layers for explicit specificity control.',
  },
  {
    id: 5,
    userId: 3,
    title: 'Accessibility in React',
    body: 'Building accessible applications means everyone can use your product, regardless of ability.',
  },
];
