import { useState, useEffect } from 'react';
import { GoogleCalendar, GoogleCalendarEvent } from '@/types/calendar';
import {
  initializeGoogleAPI,
  setAccessToken,
  fetchCalendarList,
  fetchAllCalendarEvents
} from '@/lib/google-calendar/api';
import { generateDemoEvents } from '@/lib/utils';
import { useAuth } from './useAuth';
import { getGoogleAccessToken } from '@/lib/firebase/auth';

export const useCalendarEvents = (year: number) => {
  const { user } = useAuth();
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);
  const [events, setEvents] = useState<Map<string, GoogleCalendarEvent[]>>(new Map());
  const [allEvents, setAllEvents] = useState<GoogleCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const loadCalendarData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!user) {
          // Demo mode - show demo events
          // Use refreshCounter to generate different events on refresh
          const demoEvents = generateDemoEvents(year + refreshCounter);
          setAllEvents(demoEvents);
          setLoading(false);
          return;
        }

        // Initialize Google API
        await initializeGoogleAPI();

        // Get OAuth access token from sessionStorage
        const token = getGoogleAccessToken();
        if (!token) {
          throw new Error('No Google access token found. Please sign in again.');
        }
        setAccessToken(token);

        // Fetch calendar list
        const calList = await fetchCalendarList();
        setCalendars(calList);

        // Fetch events from all calendars
        const eventsMap = await fetchAllCalendarEvents(calList, year);
        setEvents(eventsMap);

        // Flatten all events into single array
        const flatEvents: GoogleCalendarEvent[] = [];
        eventsMap.forEach((calEvents) => {
          flatEvents.push(...calEvents);
        });
        setAllEvents(flatEvents);

      } catch (err) {
        console.error('Error loading calendar data:', err);
        setError('Failed to load calendar data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCalendarData();
  }, [user, year, refreshCounter]);

  const refresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  return { calendars, events, allEvents, loading, error, refresh };
};
