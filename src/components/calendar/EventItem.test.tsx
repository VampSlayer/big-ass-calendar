import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventItem } from './EventItem';
import { GoogleCalendarEvent } from '@/types/calendar';

describe('EventItem', () => {
  const mockEvent: GoogleCalendarEvent = {
    id: 'test-event-1',
    summary: 'Team Meeting',
    start: { dateTime: '2024-01-15T10:00:00Z' },
    end: { dateTime: '2024-01-15T11:00:00Z' },
  };

  it('renders event summary', () => {
    render(<EventItem event={mockEvent} color="#3788d8" />);
    expect(screen.getByText('Team Meeting')).toBeInTheDocument();
  });

  it('applies the provided color', () => {
    const { container } = render(<EventItem event={mockEvent} color="#ff0000" />);
    const eventDiv = container.firstChild as HTMLElement;
    expect(eventDiv).toHaveStyle({ backgroundColor: '#ff0000' });
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<EventItem event={mockEvent} color="#3788d8" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Team Meeting'));
    expect(handleClick).toHaveBeenCalledWith(mockEvent);
  });

  it('displays multi-day indicator when isMultiDay is true', () => {
    render(<EventItem event={mockEvent} color="#3788d8" isMultiDay={true} />);
    expect(screen.getByText(/⬌/)).toBeInTheDocument();
  });

  it('does not display multi-day indicator when isMultiDay is false', () => {
    render(<EventItem event={mockEvent} color="#3788d8" isMultiDay={false} />);
    expect(screen.queryByText(/⬌/)).not.toBeInTheDocument();
  });

  it('applies bold font weight for multi-day events', () => {
    const { container } = render(
      <EventItem event={mockEvent} color="#3788d8" isMultiDay={true} />
    );
    const eventDiv = container.firstChild as HTMLElement;
    expect(eventDiv).toHaveStyle({ fontWeight: 'bold' });
  });

  it('includes "(Multi-day)" in title for multi-day events', () => {
    const { container } = render(
      <EventItem event={mockEvent} color="#3788d8" isMultiDay={true} />
    );
    const eventDiv = container.firstChild as HTMLElement;
    expect(eventDiv.title).toContain('(Multi-day)');
  });
});
