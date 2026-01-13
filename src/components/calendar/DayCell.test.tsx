import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DayCell } from './DayCell';
import { GoogleCalendarEvent } from '@/types/calendar';

describe('DayCell', () => {
  const mockDate = new Date(2024, 0, 15); // Jan 15, 2024
  const currentMonth = new Date(2024, 0, 1);

  const mockEvents: GoogleCalendarEvent[] = [
    {
      id: 'event-1',
      summary: 'Meeting 1',
      start: { dateTime: '2024-01-15T10:00:00Z' },
      end: { dateTime: '2024-01-15T11:00:00Z' },
    },
    {
      id: 'event-2',
      summary: 'Meeting 2',
      start: { dateTime: '2024-01-15T14:00:00Z' },
      end: { dateTime: '2024-01-15T15:00:00Z' },
    },
    {
      id: 'event-3',
      summary: 'Meeting 3',
      start: { dateTime: '2024-01-15T16:00:00Z' },
      end: { dateTime: '2024-01-15T17:00:00Z' },
    },
  ];

  it('renders the day number', () => {
    render(
      <DayCell date={mockDate} events={[]} currentMonth={currentMonth} />
    );
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('displays first 2 events', () => {
    render(
      <DayCell
        date={mockDate}
        events={mockEvents}
        currentMonth={currentMonth}
      />
    );
    expect(screen.getByText('Meeting 1')).toBeInTheDocument();
    expect(screen.getByText('Meeting 2')).toBeInTheDocument();
  });

  it('shows "+1" indicator when there are more than 2 events', () => {
    render(
      <DayCell
        date={mockDate}
        events={mockEvents}
        currentMonth={currentMonth}
      />
    );
    expect(screen.getByText('+1')).toBeInTheDocument();
  });

  it('does not show "+more" indicator when there are 2 or fewer events', () => {
    render(
      <DayCell
        date={mockDate}
        events={mockEvents.slice(0, 2)}
        currentMonth={currentMonth}
      />
    );
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
  });

  it('highlights today with background color', () => {
    const today = new Date();
    const { container } = render(
      <DayCell date={today} events={[]} currentMonth={currentMonth} />
    );
    const cellDiv = container.firstChild as HTMLElement;
    expect(cellDiv.className).toContain('bg-info');
  });

  it('applies top margin when multiDayEventCount is provided', () => {
    const { container } = render(
      <DayCell
        date={mockDate}
        events={[]}
        currentMonth={currentMonth}
        multiDayEventCount={2}
      />
    );
    // Find the inner div that has the margin-top style
    const allDivs = container.querySelectorAll('div');
    const eventArea = Array.from(allDivs).find(div =>
      div.style.marginTop === '48px'
    ) as HTMLElement;
    expect(eventArea).toBeDefined();
    expect(eventArea).toHaveStyle({ marginTop: '48px' }); // 2 * 24px
  });
});
