import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useCalendarEvents } from "./hooks/useCalendarEvents";
import { LoginBanner } from "./components/auth/LoginBanner";
import { YearView } from "./components/calendar/YearView";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { Button } from "react-bootstrap";
import { signOut } from "./lib/firebase/auth";
import { GoogleSignIn } from "./components/auth/GoogleSignIn";
import { EventModal } from "./components/calendar/EventModal";
import { GoogleCalendarEvent } from "./types/calendar";

function App() {
  const { user, loading: authLoading } = useAuth();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedEvent, setSelectedEvent] = useState<GoogleCalendarEvent | null>(null);
  const {
    allEvents,
    loading: eventsLoading,
    error,
    refresh,
  } = useCalendarEvents(selectedYear);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleEventClick = (event: GoogleCalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  if (authLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">📅 Big Calendar</span>
          {user && (
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">{user.email}</span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          )}
          {!user && <GoogleSignIn />}
        </div>
      </nav>

      {/* Content */}
      <div className="container-fluid py-4">
        {!user && <LoginBanner />}

        {eventsLoading ? (
          <LoadingSpinner message="Loading calendar events..." />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <YearView
            year={selectedYear}
            events={allEvents}
            onEventClick={handleEventClick}
            onYearChange={handleYearChange}
            onRefresh={refresh}
          />
        )}
      </div>

      {/* Event Details Modal */}
      <EventModal
        event={selectedEvent}
        show={!!selectedEvent}
        onHide={handleCloseModal}
      />
    </div>
  );
}

export default App;
