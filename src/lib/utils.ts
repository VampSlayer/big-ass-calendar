import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, subDays } from 'date-fns';
import { GoogleCalendarEvent } from '@/types/calendar';

/**
 * Format date for display
 */
export const formatDate = (date: Date, formatStr: string = 'MMM d, yyyy'): string => {
  return format(date, formatStr);
};

/**
 * Get all days for a month (including padding days from prev/next month)
 */
export const getMonthDays = (year: number, month: number): Date[] => {
  const firstDay = startOfMonth(new Date(year, month));
  const lastDay = endOfMonth(new Date(year, month));
  
  // Get the day of week for first day (0 = Sunday)
  const firstDayOfWeek = getDay(firstDay);
  
  // Add padding days from previous month
  const paddingStart = firstDayOfWeek;
  const startDate = subDays(firstDay, paddingStart);
  
  // Get all days in month
  const monthDays = eachDayOfInterval({ start: firstDay, end: lastDay });
  
  // Add padding days to make complete weeks
  const totalDays = paddingStart + monthDays.length;
  const paddingEnd = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
  
  const allDays = [
    ...eachDayOfInterval({ start: startDate, end: subDays(firstDay, 1) }),
    ...monthDays,
    ...eachDayOfInterval({ 
      start: addDays(lastDay, 1), 
      end: addDays(lastDay, paddingEnd) 
    }),
  ];
  
  return allDays;
};

/**
 * Generate demo calendar events for unauthenticated users
 * Creates random events throughout the year
 */
export const generateDemoEvents = (year: number): GoogleCalendarEvent[] => {
  const events: GoogleCalendarEvent[] = [];

  // Use year as seed for consistent randomization per year
  const seed = year;
  const random = (max: number, offset: number = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };

  // Event templates (with multi-day flag)
  const eventTemplates = [
    { summary: 'Team Meeting', colors: ['#4285f4', '#5484ed'], multiDay: false },
    { summary: 'Project Deadline', colors: ['#ea4335', '#dc2127'], multiDay: false },
    { summary: 'Birthday Party', colors: ['#fbbc04', '#fbd75b'], multiDay: false },
    { summary: 'Conference', colors: ['#34a853', '#51b749'], multiDay: true },
    { summary: 'Client Call', colors: ['#46bdc6', '#7ae7bf'], multiDay: false },
    { summary: 'Workshop', colors: ['#9e69af', '#dbadff'], multiDay: true },
    { summary: 'Lunch Meeting', colors: ['#ff887c', '#ffb878'], multiDay: false },
    { summary: 'Gym', colors: ['#46d6db', '#a4bdfc'], multiDay: false },
    { summary: 'Doctor Appointment', colors: ['#e1e1e1', '#5484ed'], multiDay: false },
    { summary: 'Team Standup', colors: ['#4285f4', '#51b749'], multiDay: false },
    { summary: 'Code Review', colors: ['#34a853', '#7ae7bf'], multiDay: false },
    { summary: 'Sprint Planning', colors: ['#5484ed', '#4285f4'], multiDay: false },
    { summary: 'Vacation', colors: ['#46bdc6', '#46d6db'], multiDay: true },
    { summary: 'Training Session', colors: ['#9e69af', '#dbadff'], multiDay: true },
    { summary: 'Holiday', colors: ['#ea4335', '#dc2127'], multiDay: false },
    { summary: 'Business Trip', colors: ['#5484ed', '#4285f4'], multiDay: true },
  ];

  // Generate 30-50 random events throughout the year
  const numEvents = 35 + random(16, year);

  for (let i = 0; i < numEvents; i++) {
    // Random month (0-11)
    const month = random(12, i * 100);

    // Random day in that month (1-28 to avoid month-end issues)
    const day = 1 + random(28, i * 200);

    // Random hour (8-17 for work hours)
    const hour = 8 + random(10, i * 300);

    // Random template
    const template = eventTemplates[random(eventTemplates.length, i * 400)];

    // Random color from template
    const color = template.colors[random(template.colors.length, i * 500)];

    const date = new Date(year, month, day, hour, 0, 0);

    // For multi-day events, use date format and span 2-5 days
    if (template.multiDay) {
      const daysToSpan = 2 + random(4, i * 700); // 2-5 days
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + daysToSpan);

      events.push({
        id: `demo-${year}-${i}`,
        summary: template.summary,
        start: { date: format(date, 'yyyy-MM-dd') },
        end: { date: format(endDate, 'yyyy-MM-dd') },
        colorId: '1',
      });
    } else {
      // Regular events: 30min, 1hr, or 2hrs
      const durations = [1800000, 3600000, 7200000]; // 30min, 1hr, 2hr in ms
      const duration = durations[random(3, i * 600)];

      events.push({
        id: `demo-${year}-${i}`,
        summary: template.summary,
        start: { dateTime: date.toISOString() },
        end: { dateTime: new Date(date.getTime() + duration).toISOString() },
        colorId: '1',
      });
    }
  }

  return events;
};
