import { describe, it, expect } from 'vitest';
import {
  parseEventDate,
  isAllDayEvent,
  isMultiDayEvent,
  getEventDates,
  groupEventsByDate,
  getEventColor,
  formatEventTime,
} from './utils';
import { GoogleCalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';

describe('google-calendar/utils', () => {
  describe('parseEventDate', () => {
    it('parses dateTime format', () => {
      const date = parseEventDate({ dateTime: '2024-01-15T10:00:00Z' });
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0); // January
      expect(date.getDate()).toBe(15);
    });

    it('parses date format', () => {
      const date = parseEventDate({ date: '2024-01-15' });
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(15);
    });

    it('returns current date when no date provided', () => {
      const date = parseEventDate({});
      expect(date).toBeInstanceOf(Date);
    });
  });

  describe('isAllDayEvent', () => {
    it('returns true for all-day events', () => {
      const event: GoogleCalendarEvent = {
        id: '1',
        summary: 'All Day Event',
        start: { date: '2024-01-15' },
        end: { date: '2024-01-16' },
      };
      expect(isAllDayEvent(event)).toBe(true);
    });

    it('returns false for timed events', () => {
      const event: GoogleCalendarEvent = {
        id: '1',
        summary: 'Timed Event',
        start: { dateTime: '2024-01-15T10:00:00Z' },
        end: { dateTime: '2024-01-15T11:00:00Z' },
      };
      expect(isAllDayEvent(event)).toBe(false);
    });
  });

  describe('isMultiDayEvent', () => {
    it('returns true for multi-day all-day events', () => {
      const event: GoogleCalendarEvent = {
        id: '1',
        summary: 'Conference',
        start: { date: '2024-01-15' },
        end: { date: '2024-01-18' },
      };
      expect(isMultiDayEvent(event)).toBe(true);
    });

    it('returns false for single-day all-day events', () => {
      const event: GoogleCalendarEvent = {
        id: '1',
        summary: 'Holiday',
        start: { date: '2024-01-15' },
        end: { date: '2024-01-15' },
      };
      expect(isMultiDayEvent(event)).toBe(false);
    });

    it('returns true for timed events spanning multiple days', () => {
      const event: GoogleCalendarEvent = {
        id: '1',
        summary: 'Long Meeting',
        start: { dateTime: '2024-01-15T23:00:00Z' },
        end: { dateTime: '2024-01-16T01:00:00Z' },
      };
      expect(isMultiDayEvent(event)).toBe(true);
    });

    it('returns false for same-day timed events', () => {
      const event: GoogleCalendarEvent = {
        id: '1',
        summary: 'Meeting',
        start: { dateTime: '2024-01-15T10:00:00Z' },
        end: { dateTime: '2024-01-15T11:00:00Z' },
      };
      expect(isMultiDayEvent(event)).toBe(false);
    });
  });

  describe('getEventDates', () => {
    it('returns all dates for multi-day events', () => {
      const event: GoogleCalendarEvent = {
        id: '1',
        summary: 'Conference',
        start: { date: '2024-01-15' },
        end: { date: '2024-01-17' },
      };
      const dates = getEventDates(event);
      expect(dates).toHaveLength(3);
      expect(dates[0].getDate()).toBe(15);
      expect(dates[1].getDate()).toBe(16);
      expect(dates[2].getDate()).toBe(17);
    });

    it('returns single date for single-day events', () => {
      const event: GoogleCalendarEvent = {
        id: '1',
        summary: 'Meeting',
        start: { dateTime: '2024-01-15T10:00:00Z' },
        end: { dateTime: '2024-01-15T11:00:00Z' },
      };
      const dates = getEventDates(event);
      expect(dates).toHaveLength(1);
      expect(dates[0].getDate()).toBe(15);
    });
  });

  describe('groupEventsByDate', () => {
    it('groups events by date key', () => {
      const events: GoogleCalendarEvent[] = [
        {
          id: '1',
          summary: 'Event 1',
          start: { dateTime: '2024-01-15T10:00:00Z' },
          end: { dateTime: '2024-01-15T11:00:00Z' },
        },
        {
          id: '2',
          summary: 'Event 2',
          start: { dateTime: '2024-01-15T14:00:00Z' },
          end: { dateTime: '2024-01-15T15:00:00Z' },
        },
        {
          id: '3',
          summary: 'Event 3',
          start: { dateTime: '2024-01-16T10:00:00Z' },
          end: { dateTime: '2024-01-16T11:00:00Z' },
        },
      ];

      const grouped = groupEventsByDate(events);

      expect(grouped.get('2024-01-15')).toHaveLength(2);
      expect(grouped.get('2024-01-16')).toHaveLength(1);
    });

    it('includes multi-day events on all their dates', () => {
      const events: GoogleCalendarEvent[] = [
        {
          id: '1',
          summary: 'Conference',
          start: { date: '2024-01-15' },
          end: { date: '2024-01-17' },
        },
      ];

      const grouped = groupEventsByDate(events);

      expect(grouped.get('2024-01-15')).toHaveLength(1);
      expect(grouped.get('2024-01-16')).toHaveLength(1);
      expect(grouped.get('2024-01-17')).toHaveLength(1);
    });
  });

  describe('getEventColor', () => {
    it('returns event-specific color when colorId is provided', () => {
      const event: GoogleCalendarEvent = {
        id: '1',
        summary: 'Event',
        start: { dateTime: '2024-01-15T10:00:00Z' },
        end: { dateTime: '2024-01-15T11:00:00Z' },
        colorId: '1',
      };
      expect(getEventColor(event)).toBe('#a4bdfc');
    });

    it('returns calendar color when calendarColor is provided', () => {
      const event: GoogleCalendarEvent = {
        id: '1',
        summary: 'Event',
        start: { dateTime: '2024-01-15T10:00:00Z' },
        end: { dateTime: '2024-01-15T11:00:00Z' },
        calendarColor: '#ff0000',
      };
      expect(getEventColor(event)).toBe('#ff0000');
    });

    it('prioritizes event colorId over calendar color', () => {
      const event: GoogleCalendarEvent = {
        id: '1',
        summary: 'Event',
        start: { dateTime: '2024-01-15T10:00:00Z' },
        end: { dateTime: '2024-01-15T11:00:00Z' },
        colorId: '1',
        calendarColor: '#ff0000',
      };
      expect(getEventColor(event)).toBe('#a4bdfc');
    });

    it('returns fallback color when no color is provided', () => {
      const event: GoogleCalendarEvent = {
        id: '1',
        summary: 'Event',
        start: { dateTime: '2024-01-15T10:00:00Z' },
        end: { dateTime: '2024-01-15T11:00:00Z' },
      };
      expect(getEventColor(event)).toBe('#3788d8');
    });
  });

  describe('formatEventTime', () => {
    it('returns "All day" for all-day events', () => {
      const event: GoogleCalendarEvent = {
        id: '1',
        summary: 'All Day Event',
        start: { date: '2024-01-15' },
        end: { date: '2024-01-16' },
      };
      expect(formatEventTime(event)).toBe('All day');
    });

    it('formats time range for timed events', () => {
      const event: GoogleCalendarEvent = {
        id: '1',
        summary: 'Meeting',
        start: { dateTime: '2024-01-15T10:00:00Z' },
        end: { dateTime: '2024-01-15T11:00:00Z' },
      };
      const result = formatEventTime(event);
      expect(result).toContain(' - ');
    });
  });
});
