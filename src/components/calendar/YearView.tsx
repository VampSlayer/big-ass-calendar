import React from "react";
import { Container } from "react-bootstrap";
import { GoogleCalendarEvent } from "@/types/calendar";
import { MonthGrid } from "./MonthGrid";
import { YearNavigation } from "./YearNavigation";

interface YearViewProps {
  year: number;
  events: GoogleCalendarEvent[];
  onEventClick?: (event: GoogleCalendarEvent) => void;
  onYearChange?: (year: number) => void;
  onRefresh?: () => void;
}

export const YearView: React.FC<YearViewProps> = ({
  year,
  events,
  onEventClick,
  onYearChange,
  onRefresh,
}) => {
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <Container fluid className="py-4 pt-0">
      {/* Year Navigation */}
      {onYearChange && (
        <YearNavigation
          currentYear={year}
          onYearChange={onYearChange}
          onRefresh={onRefresh}
        />
      )}

      {/* Calendar grid - all months stacked vertically */}
      <div className="border rounded overflow-hidden bg-white shadow-sm">
        {months.map((month) => {
          // Filter events for this month
          const monthEvents = events.filter((event) => {
            const eventDate = event.start.dateTime
              ? new Date(event.start.dateTime)
              : new Date(event.start.date!);
            return (
              eventDate.getFullYear() === year && eventDate.getMonth() === month
            );
          });

          return (
            <MonthGrid
              key={month}
              year={year}
              month={month}
              events={monthEvents}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </Container>
  );
};
