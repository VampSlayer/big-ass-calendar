import React from "react";
import { format, isToday } from "date-fns";
import { GoogleCalendarEvent } from "@/types/calendar";
import { EventItem } from "./EventItem";
import { getEventColor } from "@/lib/google-calendar/utils";

interface DayCellProps {
  date: Date;
  events: GoogleCalendarEvent[];
  currentMonth: Date;
  onEventClick?: (event: GoogleCalendarEvent) => void;
  multiDayEventCount?: number;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  events,
  onEventClick,
  multiDayEventCount = 0,
}) => {
  const today = isToday(date);
  const dayNumber = format(date, "d");

  const cellClasses = [
    "border-end flex-column",
    today && "bg-info bg-opacity-10",
  ]
    .filter(Boolean)
    .join(" ");

  // Calculate margin top to leave space for multi-day event bars
  const eventAreaMarginTop =
    multiDayEventCount > 0 ? multiDayEventCount * 24 : 0;

  // Limit displayed events to first 2
  const displayedEvents = events.slice(0, 2);
  const hasMore = events.length > 2;

  return (
    <div
      className={cellClasses}
      style={{
        minWidth: "40px",
        padding: "4px",
        fontSize: "0.75rem",
      }}
    >
      <div className="fw-bold text-center mb-1" style={{ fontSize: "0.9rem" }}>
        {dayNumber}
      </div>
      <div style={{ marginTop: `${eventAreaMarginTop}px` }}>
        {displayedEvents.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            color={getEventColor(event)}
            onClick={onEventClick}
            isMultiDay={false}
          />
        ))}
        {hasMore && (
          <div
            className="text-muted text-center"
            style={{ fontSize: "0.65rem" }}
          >
            +{events.length - 2}
          </div>
        )}
      </div>
    </div>
  );
};
