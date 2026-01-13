import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventModal } from './EventModal';
import { GoogleCalendarEvent } from '@/types/calendar';

describe('EventModal', () => {
  const mockEvent: GoogleCalendarEvent = {
    id: 'event-1',
    summary: 'Team Meeting',
    description: 'Discuss project updates',
    location: 'Conference Room A',
    start: { dateTime: '2024-01-15T10:00:00Z' },
    end: { dateTime: '2024-01-15T11:00:00Z' },
    attendees: [
      { email: 'john@example.com', displayName: 'John Doe' },
      { email: 'jane@example.com', displayName: 'Jane Smith' },
    ],
    htmlLink: 'https://calendar.google.com/event?eid=123',
  };

  const mockAllDayEvent: GoogleCalendarEvent = {
    id: 'event-2',
    summary: 'All Day Conference',
    start: { date: '2024-01-15' },
    end: { date: '2024-01-16' },
  };

  it('renders event title', () => {
    render(<EventModal event={mockEvent} show={true} onHide={vi.fn()} />);
    expect(screen.getByText('Team Meeting')).toBeInTheDocument();
  });

  it('renders event description', () => {
    render(<EventModal event={mockEvent} show={true} onHide={vi.fn()} />);
    expect(screen.getByText('Discuss project updates')).toBeInTheDocument();
  });

  it('renders event location', () => {
    render(<EventModal event={mockEvent} show={true} onHide={vi.fn()} />);
    expect(screen.getByText('Conference Room A')).toBeInTheDocument();
  });

  it('renders attendees list', () => {
    render(<EventModal event={mockEvent} show={true} onHide={vi.fn()} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders Google Calendar link', () => {
    render(<EventModal event={mockEvent} show={true} onHide={vi.fn()} />);
    const link = screen.getByText('View in Google Calendar →');
    expect(link).toHaveAttribute('href', 'https://calendar.google.com/event?eid=123');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays "All-day" for all-day events', () => {
    render(<EventModal event={mockAllDayEvent} show={true} onHide={vi.fn()} />);
    expect(screen.getByText(/All-day/)).toBeInTheDocument();
  });

  it('calls onHide when Close button is clicked', () => {
    const handleHide = vi.fn();
    render(<EventModal event={mockEvent} show={true} onHide={handleHide} />);

    // Bootstrap Modal Footer doesn't render "Close" text, it's in the modal-footer
    // We need to query by role instead
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(handleHide).toHaveBeenCalledTimes(1);
  });

  it('returns null when event is null', () => {
    const { container } = render(
      <EventModal event={null} show={true} onHide={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('does not render optional fields when not provided', () => {
    const minimalEvent: GoogleCalendarEvent = {
      id: 'event-3',
      summary: 'Simple Event',
      start: { dateTime: '2024-01-15T10:00:00Z' },
      end: { dateTime: '2024-01-15T11:00:00Z' },
    };

    render(<EventModal event={minimalEvent} show={true} onHide={vi.fn()} />);

    expect(screen.queryByText('Description')).not.toBeInTheDocument();
    expect(screen.queryByText('Location')).not.toBeInTheDocument();
    expect(screen.queryByText('Attendees')).not.toBeInTheDocument();
  });
});
