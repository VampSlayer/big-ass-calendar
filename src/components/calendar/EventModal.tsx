import React from "react";
import { Modal } from "react-bootstrap";
import { GoogleCalendarEvent } from "@/types/calendar";
import {
  formatEventTime,
  isAllDayEvent,
  isMultiDayEvent,
  parseEventDate,
} from "@/lib/google-calendar/utils";
import { format } from "date-fns";

interface EventModalProps {
  event: GoogleCalendarEvent | null;
  show: boolean;
  onHide: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  show,
  onHide,
}) => {
  if (!event) return null;

  const startDate = parseEventDate(event.start);
  const endDate = parseEventDate(event.end);
  const isAllDay = isAllDayEvent(event);
  const isMultiDay = isMultiDayEvent(event);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{event.summary}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <strong className="d-block text-muted mb-1">Date & Time</strong>
          {isAllDay ? (
            <div>
              {isMultiDay ? (
                <>
                  {format(startDate, "MMMM d, yyyy")} -{" "}
                  {format(endDate, "MMMM d, yyyy")}
                  <div className="text-muted small">All-day event</div>
                </>
              ) : (
                <>
                  {format(startDate, "MMMM d, yyyy")}
                  <div className="text-muted small">All-day</div>
                </>
              )}
            </div>
          ) : (
            <div>
              {isMultiDay ? (
                <>
                  <div>{format(startDate, "MMMM d, yyyy h:mm a")}</div>
                  <div>{format(endDate, "MMMM d, yyyy h:mm a")}</div>
                </>
              ) : (
                <>
                  <div>{format(startDate, "MMMM d, yyyy")}</div>
                  <div>{formatEventTime(event)}</div>
                </>
              )}
            </div>
          )}
        </div>

        {event.description && (
          <div className="mb-3">
            <strong className="d-block text-muted mb-1">Description</strong>
            <div>{event.description}</div>
          </div>
        )}

        {event.location && (
          <div className="mb-3">
            <strong className="d-block text-muted mb-1">Location</strong>
            <div>{event.location}</div>
          </div>
        )}

        {event.attendees && event.attendees.length > 0 && (
          <div className="mb-3">
            <strong className="d-block text-muted mb-1">Attendees</strong>
            <ul className="mb-0">
              {event.attendees.map((attendee, idx) => (
                <li key={idx}>{attendee.displayName || attendee.email}</li>
              ))}
            </ul>
          </div>
        )}

        {event.htmlLink && (
          <div className="mb-3">
            <a
              href={event.htmlLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-link p-0"
            >
              View in Google Calendar →
            </a>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
