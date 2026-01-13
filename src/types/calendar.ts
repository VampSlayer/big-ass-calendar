// Google Calendar Event
export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  attendees?: Array<{ email: string; displayName?: string }>;
  recurrence?: string[];
  colorId?: string;
  htmlLink?: string;
  calendarColor?: string; // The parent calendar's background color
}

// Google Calendar
export interface GoogleCalendar {
  id: string;
  summary: string;
  backgroundColor: string;
  foregroundColor?: string;
  primary?: boolean;
  selected?: boolean;
}

// View Models for rendering
export interface DayViewModel {
  date: Date;
  dayNumber: number;
  events: GoogleCalendarEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
}

export interface MonthViewModel {
  year: number;
  month: number; // 0-11
  monthName: string;
  days: DayViewModel[];
}
