import React from 'react';
import { GoogleCalendarEvent } from '@/types/calendar';

interface EventItemProps {
  event: GoogleCalendarEvent;
  color: string;
  onClick?: (event: GoogleCalendarEvent) => void;
  isMultiDay?: boolean;
}

export const EventItem: React.FC<EventItemProps> = ({ event, color, onClick, isMultiDay }) => {
  return (
    <div
      className="text-white text-center mb-1"
      style={{
        backgroundColor: color,
        fontSize: '0.65rem',
        padding: '2px',
        borderRadius: '2px',
        cursor: 'pointer',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        borderLeft: isMultiDay ? '3px solid rgba(255,255,255,0.6)' : 'none',
        fontWeight: isMultiDay ? 'bold' : 'normal',
      }}
      onClick={() => onClick?.(event)}
      title={`${event.summary}${isMultiDay ? ' (Multi-day)' : ''}`}
    >
      {isMultiDay && '⬌ '}{event.summary}
    </div>
  );
};
