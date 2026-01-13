import { GoogleCalendarEvent } from '@/types/calendar';
import { parseISO, format, eachDayOfInterval, isSameDay, differenceInDays } from 'date-fns';

/**
 * Parse event date (handles both dateTime and date formats)
 */
export const parseEventDate = (dateObj: { dateTime?: string; date?: string }): Date => {
  if (dateObj.dateTime) {
    return parseISO(dateObj.dateTime);
  }
  if (dateObj.date) {
    return parseISO(dateObj.date);
  }
  return new Date();
};

/**
 * Check if event is all-day
 */
export const isAllDayEvent = (event: GoogleCalendarEvent): boolean => {
  return !!event.start.date && !event.start.dateTime;
};

/**
 * Format event time for display
 */
export const formatEventTime = (event: GoogleCalendarEvent): string => {
  if (isAllDayEvent(event)) {
    return 'All day';
  }

  const startDate = parseEventDate(event.start);
  const endDate = parseEventDate(event.end);

  const startTime = format(startDate, 'h:mm a');
  const endTime = format(endDate, 'h:mm a');

  return `${startTime} - ${endTime}`;
};

/**
 * Check if event is multi-day
 */
export const isMultiDayEvent = (event: GoogleCalendarEvent): boolean => {
  const startDate = parseEventDate(event.start);
  const endDate = parseEventDate(event.end);

  // For all-day events, check if end date is more than 1 day after start
  if (isAllDayEvent(event)) {
    return differenceInDays(endDate, startDate) > 1;
  }

  // For timed events, check if they don't end on the same day
  return !isSameDay(startDate, endDate);
};

/**
 * Get all dates that an event spans
 */
export const getEventDates = (event: GoogleCalendarEvent): Date[] => {
  const startDate = parseEventDate(event.start);
  const endDate = parseEventDate(event.end);

  // For multi-day events, get all days in the interval
  if (isMultiDayEvent(event)) {
    return eachDayOfInterval({ start: startDate, end: endDate });
  }

  // Single day event
  return [startDate];
};

/**
 * Group events by date (YYYY-MM-DD)
 * Handles multi-day events by showing them on all days they span
 */
export const groupEventsByDate = (events: GoogleCalendarEvent[]): Map<string, GoogleCalendarEvent[]> => {
  const grouped = new Map<string, GoogleCalendarEvent[]>();

  events.forEach((event) => {
    // Get all dates this event spans
    const eventDates = getEventDates(event);

    // Add event to each date it spans
    eventDates.forEach((date) => {
      const dateKey = format(date, 'yyyy-MM-dd');

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(event);
    });
  });

  return grouped;
};

/**
 * Get event color (from calendar or event colorId)
 */
export const getEventColor = (event: GoogleCalendarEvent, fallbackColor: string = '#3788d8'): string => {
  // Event-specific colors (if provided by API)
  const eventColors: Record<string, string> = {
    '1': '#a4bdfc', // Lavender
    '2': '#7ae7bf', // Sage
    '3': '#dbadff', // Grape
    '4': '#ff887c', // Flamingo
    '5': '#fbd75b', // Banana
    '6': '#ffb878', // Tangerine
    '7': '#46d6db', // Peacock
    '8': '#e1e1e1', // Graphite
    '9': '#5484ed', // Blueberry
    '10': '#51b749', // Basil
    '11': '#dc2127', // Tomato
  };

  // Priority: event-specific color > calendar color > fallback
  if (event.colorId && eventColors[event.colorId]) {
    return eventColors[event.colorId];
  }

  if (event.calendarColor) {
    return event.calendarColor;
  }

  return fallbackColor;
};
