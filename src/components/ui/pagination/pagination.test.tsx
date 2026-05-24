import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Pagination } from './pagination';

describe('Pagination', () => {
  it('uses default English labels and allows overriding them', () => {
    const { rerender } = render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={() => {}}
        showFirstLast
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();

    rerender(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={() => {}}
        showFirstLast
        labels={{
          first: 'Primera',
          previous: 'Anterior',
          next: 'Siguiente',
          last: 'Última',
          page: n => `Página ${n}`,
        }}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Anterior' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Página 1' }),
    ).toBeInTheDocument();
  });

  it('returns null when totalPages is 0', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders a navigation landmark with an accessible name', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />,
    );
    expect(
      screen.getByRole('navigation', { name: 'Pagination' }),
    ).toBeInTheDocument();
  });

  it('marks the current page with aria-current="page"', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />,
    );
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: 'Page 2' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('calls onPageChange when a page button is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />,
    );
    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables Previous on the first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />,
    );
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeDisabled();
  });

  it('disables Next on the last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />,
    );
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('calls onPageChange with currentPage - 1 when Previous is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    );
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with currentPage + 1 when Next is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    );
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('does not call onPageChange when clicking the current page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />,
    );
    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('renders First and Last buttons when showFirstLast is true', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        showFirstLast
        onPageChange={() => {}}
      />,
    );
    expect(
      screen.getByRole('button', { name: 'First page' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Last page' }),
    ).toBeInTheDocument();
  });

  it('renders ellipsis when there is a gap between pages', () => {
    render(
      <Pagination currentPage={5} totalPages={20} onPageChange={() => {}} />,
    );
    const ellipses = screen.getAllByText('…');
    expect(ellipses.length).toBeGreaterThanOrEqual(2);
  });

  it('disables all page buttons when disabled is true', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        disabled
        onPageChange={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Page 3' })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('integrates as a controlled component', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [page, setPage] = useState(1);
      return (
        <>
          <span data-testid="current">{page}</span>
          <Pagination
            currentPage={page}
            totalPages={10}
            onPageChange={setPage}
          />
        </>
      );
    }

    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(screen.getByTestId('current')).toHaveTextContent('2');
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByTestId('current')).toHaveTextContent('3');
  });
});
