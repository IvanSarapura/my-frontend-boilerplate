import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Tabs } from './tabs';
import { TabsContent } from './tabs-content';
import { TabsList } from './tabs-list';
import { TabsTrigger } from './tabs-trigger';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
          Overview panel — general summary of your project.
        </p>
      </TabsContent>
      <TabsContent value="analytics">
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
          Analytics panel — charts and usage statistics.
        </p>
      </TabsContent>
      <TabsContent value="settings">
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
          Settings panel — configure your preferences.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="profile" orientation="vertical">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
          Profile settings — update your display name and avatar.
        </p>
      </TabsContent>
      <TabsContent value="security">
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
          Security settings — manage passwords and 2FA.
        </p>
      </TabsContent>
      <TabsContent value="billing">
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--foreground)' }}>
          Billing — manage your subscription and invoices.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

export const Controlled: Story = {
  args: { children: null },
  render: () => {
    const [active, setActive] = useState('b');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
          Active tab: <code>{active}</code>
        </div>
        <Tabs value={active} onValueChange={setActive}>
          <TabsList>
            <TabsTrigger value="a">Tab A</TabsTrigger>
            <TabsTrigger value="b">Tab B</TabsTrigger>
            <TabsTrigger value="c">Tab C</TabsTrigger>
          </TabsList>
          <TabsContent value="a">Content A</TabsContent>
          <TabsContent value="b">Content B</TabsContent>
          <TabsContent value="c">Content C</TabsContent>
        </Tabs>
      </div>
    );
  },
};

export const WithDisabledTab: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="locked" disabled>
          Locked
        </TabsTrigger>
        <TabsTrigger value="available">Available</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        This tab is active and accessible.
      </TabsContent>
      <TabsContent value="locked">
        This content is unreachable — the tab is disabled.
      </TabsContent>
      <TabsContent value="available">
        This tab is also accessible via keyboard navigation.
      </TabsContent>
    </Tabs>
  ),
};

export const PreservesState: Story = {
  args: { children: null },
  render: () => (
    <Tabs defaultValue="form">
      <TabsList>
        <TabsTrigger value="form">Form</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="form">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          <label
            htmlFor="demo-input"
            style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}
          >
            Name
          </label>
          <input
            id="demo-input"
            type="text"
            placeholder="Type something…"
            style={{
              padding: 'var(--space-2) var(--space-3)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
            }}
          />
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>
            Switch to Preview and back — your input is preserved.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="preview">
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>
          Switch back to Form — the input value is still there because inactive
          panels use the HTML{' '}
          <code style={{ fontFamily: 'monospace' }}>hidden</code> attribute
          instead of unmounting.
        </p>
      </TabsContent>
    </Tabs>
  ),
};
