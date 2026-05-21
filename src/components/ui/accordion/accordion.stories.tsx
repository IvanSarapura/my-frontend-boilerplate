import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Accordion } from './accordion';
import { AccordionContent } from './accordion-content';
import { AccordionItem } from './accordion-item';
import { AccordionTrigger } from './accordion-trigger';

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['single', 'multiple'],
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    value: 'item-1',
    title: 'What is this boilerplate?',
    body: 'A production-ready Next.js 16 + React 19 starter with strict TypeScript, an accessible design system, and CI/CD baked in.',
  },
  {
    value: 'item-2',
    title: 'How do I add a new component?',
    body: 'Create a folder under src/components/ui/<name>/ with tsx, module.css, stories.tsx, test.tsx and an index.ts barrel.',
  },
  {
    value: 'item-3',
    title: 'Can I use my own theme?',
    body: 'Yes — all colors and spacing live as CSS custom properties in src/app/globals.css. Override the :root values to re-skin everything.',
  },
];

export const Single: Story = {
  args: { type: 'single', defaultValue: 'item-1', children: null },
  render: args => (
    <Accordion {...args}>
      {items.map(item => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['item-1', 'item-3'],
    children: null,
  },
  render: args => (
    <Accordion {...args}>
      {items.map(item => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const Controlled: Story = {
  args: { type: 'single', children: null },
  render: () => {
    const [value, setValue] = useState<string>('item-2');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
          Open item: <code>{value || '(none)'}</code>
        </div>
        <Accordion type="single" value={value} onValueChange={setValue}>
          {items.map(item => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>{item.body}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    );
  },
};

export const WithDisabledItem: Story = {
  args: { type: 'single', defaultValue: 'item-1', children: null },
  render: args => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Available section</AccordionTrigger>
        <AccordionContent>This one can be toggled.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Locked section</AccordionTrigger>
        <AccordionContent>You cannot open this.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Another available section</AccordionTrigger>
        <AccordionContent>This one is fine too.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const FAQ: Story = {
  args: { type: 'single', children: null },
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <h3
        style={{
          fontSize: 'var(--text-lg)',
          marginBottom: 'var(--space-3)',
        }}
      >
        Frequently Asked Questions
      </h3>
      <Accordion type="single">
        {items.map(item => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};
