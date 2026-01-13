// Type declarations for Google API
declare const gapi: {
  load: (api: string, callback: () => void) => void;
  client: {
    init: (config: {
      apiKey: string;
      discoveryDocs: string[];
    }) => Promise<void>;
    setToken: (token: { access_token: string }) => void;
    calendar: {
      calendarList: {
        list: () => Promise<any>;
      };
      events: {
        list: (params: {
          calendarId: string;
          timeMin: string;
          timeMax: string;
          singleEvents: boolean;
          orderBy: string;
          maxResults: number;
        }) => Promise<any>;
      };
    };
  };
};
