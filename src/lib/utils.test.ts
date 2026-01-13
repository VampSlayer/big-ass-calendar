import { describe, it, expect } from 'vitest';
import { formatDate, getMonthDays, generateDemoEvents } from './utils';

describe('utils', () => {
  describe('formatDate', () => {
    it('formats date with default format', () => {
      const date = new Date(2024, 0, 15); // Jan 15, 2024
      expect(formatDate(date)).toBe('Jan 15, 2024');
    });

    it('formats date with custom format', () => {
      const date = new Date(2024, 0, 15);
      expect(formatDate(date, 'yyyy-MM-dd')).toBe('2024-01-15');
    });
  });

  describe('getMonthDays', () => {
    it('returns correct number of days for January 2024', () => {
      const days = getMonthDays(2024, 0); // January 2024
      expect(days.length).toBeGreaterThanOrEqual(31); // At least 31 days in January
    });

    it('includes padding days from previous month', () => {
      const days = getMonthDays(2024, 0); // January 2024
      const firstDay = days[0];
      // First day should be Dec 31 (month 11) or a day in January (month 0)
      expect(firstDay.getMonth() === 11 || firstDay.getMonth() === 0).toBe(true);
    });

    it('creates complete weeks (divisible by 7)', () => {
      const days = getMonthDays(2024, 0);
      expect(days.length % 7).toBe(0);
    });

    it('returns correct days for leap year February', () => {
      const days = getMonthDays(2024, 1); // February 2024 (leap year)
      const februaryDays = days.filter(d => d.getMonth() === 1);
      expect(februaryDays.length).toBe(29);
    });

    it('returns correct days for non-leap year February', () => {
      const days = getMonthDays(2023, 1); // February 2023
      const februaryDays = days.filter(d => d.getMonth() === 1);
      expect(februaryDays.length).toBe(28);
    });
  });

  describe('generateDemoEvents', () => {
    it('generates events for the specified year', () => {
      const events = generateDemoEvents(2024);
      expect(events.length).toBeGreaterThan(0);
    });

    it('generates consistent events for same year', () => {
      const events1 = generateDemoEvents(2024);
      const events2 = generateDemoEvents(2024);
      expect(events1.length).toBe(events2.length);
      expect(events1[0].id).toBe(events2[0].id);
      expect(events1[0].summary).toBe(events2[0].summary);
    });

    it('generates different events for different years', () => {
      const events2024 = generateDemoEvents(2024);
      const events2025 = generateDemoEvents(2025);
      expect(events2024[0].id).not.toBe(events2025[0].id);
    });

    it('generates events with valid structure', () => {
      const events = generateDemoEvents(2024);
      const event = events[0];

      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('summary');
      expect(event).toHaveProperty('start');
      expect(event).toHaveProperty('end');
      expect(event).toHaveProperty('colorId');
    });

    it('generates both single-day and multi-day events', () => {
      const events = generateDemoEvents(2024);
      const singleDayEvents = events.filter(e => e.start.dateTime);
      const multiDayEvents = events.filter(e => e.start.date);

      expect(singleDayEvents.length).toBeGreaterThan(0);
      expect(multiDayEvents.length).toBeGreaterThan(0);
    });

    it('generates events throughout the year', () => {
      const events = generateDemoEvents(2024);
      const months = new Set(
        events.map(e => {
          const dateStr = e.start.dateTime || e.start.date;
          return new Date(dateStr!).getMonth();
        })
      );

      // Should have events in multiple months
      expect(months.size).toBeGreaterThan(3);
    });
  });
});
