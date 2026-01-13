import { GoogleCalendar, GoogleCalendarEvent } from "@/types/calendar";

// Initialize Google API client
let gapiInitialized = false;

/**
 * Load and initialize the Google API client
 */
export const initializeGoogleAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (gapiInitialized) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      gapi.load("client", async () => {
        try {
          await gapi.client.init({
            // No API key needed when using OAuth access tokens
            apiKey: "",
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
            ],
          });
          gapiInitialized = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

/**
 * Set the access token for Google Calendar API requests
 */
export const setAccessToken = (accessToken: string): void => {
  gapi.client.setToken({ access_token: accessToken });
};

/**
 * Fetch the list of user's calendars
 */
export const fetchCalendarList = async (): Promise<GoogleCalendar[]> => {
  try {
    const response = await gapi.client.calendar.calendarList.list();
    return (response.result.items || []).map((item: any) => ({
      id: item.id,
      summary: item.summary,
      backgroundColor: item.backgroundColor || "#3788d8",
      foregroundColor: item.foregroundColor,
      primary: item.primary || false,
      selected: item.selected !== false, // Default to true if not specified
    }));
  } catch (error) {
    console.error("Error fetching calendar list:", error);
    throw error;
  }
};

/**
 * Fetch events from a specific calendar for a given year
 */
export const fetchEvents = async (
  calendarId: string,
  year: number
): Promise<GoogleCalendarEvent[]> => {
  try {
    const timeMin = new Date(year, 0, 1).toISOString();
    const timeMax = new Date(year + 1, 0, 1).toISOString();

    const response = await gapi.client.calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true, // Expand recurring events
      orderBy: "startTime",
      maxResults: 2500, // Maximum allowed by API
    });

    return (response.result.items || []).map((item: any) => ({
      id: item.id,
      summary: item.summary || "(No title)",
      description: item.description,
      start: item.start,
      end: item.end,
      location: item.location,
      attendees: item.attendees,
      recurrence: item.recurrence,
      colorId: item.colorId,
      htmlLink: item.htmlLink,
    }));
  } catch (error) {
    console.error(`Error fetching events for calendar ${calendarId}:`, error);
    throw error;
  }
};

/**
 * Fetch events from all calendars for a given year
 */
export const fetchAllCalendarEvents = async (
  calendars: GoogleCalendar[],
  year: number
): Promise<Map<string, GoogleCalendarEvent[]>> => {
  const eventsMap = new Map<string, GoogleCalendarEvent[]>();

  // Fetch events for each calendar in parallel
  const promises = calendars
    .filter((cal) => cal.selected !== false)
    .map(async (calendar) => {
      try {
        const events = await fetchEvents(calendar.id, year);
        // Attach the calendar's background color to each event
        const eventsWithColor = events.map((event) => ({
          ...event,
          calendarColor: calendar.backgroundColor,
        }));
        eventsMap.set(calendar.id, eventsWithColor);
      } catch (error) {
        console.error(`Failed to fetch events for ${calendar.summary}:`, error);
        eventsMap.set(calendar.id, []);
      }
    });

  await Promise.all(promises);
  return eventsMap;
};
