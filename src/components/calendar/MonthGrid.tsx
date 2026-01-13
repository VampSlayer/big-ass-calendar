import React from "react";
import { format, getDaysInMonth } from "date-fns";
import { GoogleCalendarEvent } from "@/types/calendar";
import { DayCell } from "./DayCell";
import {
  groupEventsByDate,
  isMultiDayEvent,
  parseEventDate,
  getEventColor,
} from "@/lib/google-calendar/utils";

interface MonthGridProps {
  year: number;
  month: number;
  events: GoogleCalendarEvent[];
  onEventClick?: (event: GoogleCalendarEvent) => void;
}

interface MultiDayEventSpan {
  event: GoogleCalendarEvent;
  startDay: number;
  endDay: number;
  color: string;
}

export const MonthGrid: React.FC<MonthGridProps> = ({
  year,
  month,
  events,
  onEventClick,
}) => {
  const monthDate = new Date(year, month);
  const monthName = format(monthDate, "MMM").toUpperCase();
  const daysInMonth = getDaysInMonth(monthDate);

  // Separate single-day and multi-day events
  const singleDayEvents: GoogleCalendarEvent[] = [];
  const multiDayEventSpans: MultiDayEventSpan[] = [];

  events.forEach((event) => {
    if (isMultiDayEvent(event)) {
      const startDate = parseEventDate(event.start);
      const endDate = parseEventDate(event.end);

      // Calculate which days in THIS month the event spans
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month, daysInMonth, 23, 59, 59);

      // Check if event overlaps with this month
      // Event overlaps if it starts before month ends AND ends after month starts
      const eventOverlapsMonth = startDate <= monthEnd && endDate >= monthStart;

      if (eventOverlapsMonth) {
        // Clamp to current month boundaries for display
        const effectiveStart = startDate < monthStart ? monthStart : startDate;
        const effectiveEnd = endDate > monthEnd ? monthEnd : endDate;

        multiDayEventSpans.push({
          event,
          startDay: effectiveStart.getDate(),
          endDay: effectiveEnd.getDate(),
          color: getEventColor(event),
        });
      }
    } else {
      singleDayEvents.push(event);
    }
  });

  // Group single-day events by date
  const eventsByDate = groupEventsByDate(singleDayEvents);

  // Generate array of days [1, 2, 3, ..., 31]
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div
      className="border-bottom"
      style={{ minHeight: "120px", position: "relative" }}
    >
      <div className="d-flex">
        {/* Month name column */}
        <div
          className="border-end d-flex align-items-center justify-content-center fw-bold text-primary"
          style={{
            width: "80px",
            fontSize: "1.5rem",
            backgroundColor: "#f8f9fa",
          }}
        >
          {monthName}
        </div>

        {/* Days row */}
        <div className="d-flex flex-grow-1" style={{ position: "relative" }}>
          {/* Multi-day event bars */}
          {multiDayEventSpans.map((span, idx) => {
            const dayWidth = 100 / daysInMonth;
            const left = (span.startDay - 1) * dayWidth;
            const width = (span.endDay - span.startDay + 1) * dayWidth;

            return (
              <div
                key={`${span.event.id}-${idx}`}
                className="text-white px-2 py-1"
                style={{
                  position: "absolute",
                  top: `${28 + idx * 24}px`,
                  left: `${left}%`,
                  width: `${width}%`,
                  backgroundColor: span.color,
                  fontSize: "0.7rem",
                  borderRadius: "3px",
                  cursor: "pointer",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: "bold",
                  zIndex: 10,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
                onClick={() => onEventClick?.(span.event)}
                title={`${span.event.summary} (Multi-day)`}
              >
                {span.event.summary}
              </div>
            );
          })}

          {/* Day cells */}
          {days.map((day) => {
            const date = new Date(year, month, day);
            const dateKey = format(date, "yyyy-MM-dd");
            const dayEvents = eventsByDate.get(dateKey) || [];

            return (
              <DayCell
                key={day}
                date={date}
                events={dayEvents}
                currentMonth={monthDate}
                onEventClick={onEventClick}
                multiDayEventCount={multiDayEventSpans.length}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
