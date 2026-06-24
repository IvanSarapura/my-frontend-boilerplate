import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Accordion } from './accordion';
import { AccordionContent } from './accordion-content';
import { AccordionItem } from './accordion-item';
import { AccordionTrigger } from './accordion-trigger';

function ThreeItems({
  type = 'single' as 'single' | 'multiple',
  defaultValue,
  disabledItem2 = false,
}: {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  disabledItem2?: boolean;
}) {
  return (
    <Accordion
      type={type as 'single'}
      {...(defaultValue !== undefined
        ? { defaultValue: defaultValue as string }
        : {})}
    >
      <AccordionItem value="one">
        <AccordionTrigger>Item one</AccordionTrigger>
        <AccordionContent>Body one</AccordionContent>
      </AccordionItem>
      <AccordionItem value="two" disabled={disabledItem2}>
        <AccordionTrigger>Item two</AccordionTrigger>
        <AccordionContent>Body two</AccordionContent>
      </AccordionItem>
      <AccordionItem value="three">
        <AccordionTrigger>Item three</AccordionTrigger>
        <AccordionContent>Body three</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renders triggers with aria-expanded=false by default', () => {
    render(<ThreeItems />);
    const triggers = screen.getAllByRole('button');
    triggers.forEach(t => expect(t).toHaveAttribute('aria-expanded', 'false'));
  });

  it('opens an item on click and sets aria-expanded=true', async () => {
    const user = userEvent.setup();
    render(<ThreeItems />);
    const one = screen.getByRole('button', { name: /item one/i });
    expect(one).toHaveAttribute('aria-expanded', 'false');
    await user.click(one);
    expect(one).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes an open item on second click', async () => {
    const user = userEvent.setup();
    render(<ThreeItems defaultValue="one" />);
    const one = screen.getByRole('button', { name: /item one/i });
    expect(one).toHaveAttribute('aria-expanded', 'true');
    await user.click(one);
    expect(one).toHaveAttribute('aria-expanded', 'false');
  });

  it('single mode: opening another item closes the previous one', async () => {
    const user = userEvent.setup();
    render(<ThreeItems defaultValue="one" />);
    const one = screen.getByRole('button', { name: /item one/i });
    const two = screen.getByRole('button', { name: /item two/i });
    expect(one).toHaveAttribute('aria-expanded', 'true');
    await user.click(two);
    expect(one).toHaveAttribute('aria-expanded', 'false');
    expect(two).toHaveAttribute('aria-expanded', 'true');
  });

  it('multiple mode: allows several items open at the same time', async () => {
    const user = userEvent.setup();
    render(<ThreeItems type="multiple" />);
    const one = screen.getByRole('button', { name: /item one/i });
    const two = screen.getByRole('button', { name: /item two/i });
    await user.click(one);
    await user.click(two);
    expect(one).toHaveAttribute('aria-expanded', 'true');
    expect(two).toHaveAttribute('aria-expanded', 'true');
  });

  it('honors defaultValue (multiple)', () => {
    render(<ThreeItems type="multiple" defaultValue={['one', 'three']} />);
    expect(screen.getByRole('button', { name: /item one/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: /item three/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: /item two/i })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('controlled mode: respects external value and onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Controlled() {
      const [value, setValue] = useState<string>('one');
      return (
        <Accordion
          type="single"
          value={value}
          onValueChange={v => {
            setValue(v);
            onValueChange(v);
          }}
        >
          <AccordionItem value="one">
            <AccordionTrigger>Item one</AccordionTrigger>
            <AccordionContent>Body one</AccordionContent>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionTrigger>Item two</AccordionTrigger>
            <AccordionContent>Body two</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }

    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: /item two/i }));
    expect(onValueChange).toHaveBeenCalledWith('two');
    expect(screen.getByRole('button', { name: /item two/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('disabled item does not respond to clicks', async () => {
    const user = userEvent.setup();
    render(<ThreeItems disabledItem2 />);
    const two = screen.getByRole('button', { name: /item two/i });
    expect(two).toBeDisabled();
    await user.click(two);
    expect(two).toHaveAttribute('aria-expanded', 'false');
  });

  it('wires aria-controls and aria-labelledby between trigger and content', () => {
    render(<ThreeItems defaultValue="one" />);
    const one = screen.getByRole('button', { name: /item one/i });
    const controlsId = one.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();
    const region = screen.getByRole('region', { name: /item one/i });
    expect(region.id).toBe(controlsId);
    expect(region.getAttribute('aria-labelledby')).toBe(one.id);
  });

  it('marks a collapsed panel inert and an open panel interactive', () => {
    render(<ThreeItems defaultValue="one" />);
    const open = document.getElementById(
      screen
        .getByRole('button', { name: /item one/i })
        .getAttribute('aria-controls') ?? '',
    );
    const closed = document.getElementById(
      screen
        .getByRole('button', { name: /item two/i })
        .getAttribute('aria-controls') ?? '',
    );
    expect(open).not.toHaveAttribute('inert');
    expect(closed).toHaveAttribute('inert');
  });

  it('throws when sub-component is rendered outside <Accordion>', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(<AccordionTrigger>Trigger without Accordion</AccordionTrigger>),
    ).toThrow('Accordion sub-components must be used inside <Accordion>.');
    spy.mockRestore();
  });

  it('throws when sub-component is rendered outside <AccordionItem>', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <Accordion>
          <AccordionTrigger>Trigger without Item</AccordionTrigger>
        </Accordion>,
      ),
    ).toThrow(
      'AccordionTrigger and AccordionContent must be used inside <AccordionItem>.',
    );
    spy.mockRestore();
  });
});
