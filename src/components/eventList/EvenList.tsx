import { useEffect, useState } from "react";
import "./eventList.css";
import EventsService from "../../service/event.service";
import { format, isSameDay } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { Userinfo } from "../../types/UserInfo";

type EventListProps = {
  onOpenCreateModal: () => void;
  selectedDate: Date | null;
};

type Event = {
  startTime: string;
  endTime: string;
  title: string;
  date: string;
};

const EventList = ({ onOpenCreateModal, selectedDate }: EventListProps) => {
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Userinfo.token || !Userinfo.userId) {
      console.error("No hay token o userId en localStorage.");
      return;
    }

    EventsService.aGetEventsById(Userinfo.token, Userinfo.userId)
      .then((response) => {
        setUserEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  // 🔄 Resetear "ver todos" al cambiar de día
  useEffect(() => {
    setShowAllEvents(false);
  }, [selectedDate]);

  const sameDayEvents = selectedDate
    ? userEvents.filter(event =>
        isSameDay(new Date(event.startTime), selectedDate)
      )
    : userEvents;

  const filteredEvents = selectedDate && !showAllEvents ? sameDayEvents : userEvents;

  const renderEvents = () => {
    if (selectedDate && sameDayEvents.length === 0 && !showAllEvents) {
      return (
        <div className="no-events">
          <p>No hay eventos para esta fecha.</p>
          <button
            className="show-all-button"
            onClick={() => setShowAllEvents(true)}
          >
            Ver todos
          </button>
        </div>
      );
    }

    return filteredEvents.map((event, index) => {
      const formattedDate = format(new Date(event.startTime), 'MMM d, yyyy');
      const formattedTime = format(new Date(event.startTime), 'HH:mm');

      return (
        <div className="event-item" key={index}>
          <div className="event-item-date">
            <div className="event-day">{formattedDate}</div>
            <div className="event-time">{formattedTime}</div>
          </div>
          <div className="event-item-text">{event.title}</div>
        </div>
      );
    });
  };

  return (  
    <div className="events-section">
      <div className="events-header">
        <h2>EVENTS</h2>
        <div className="notification-bell">
          <i className="bx bxs-bell"></i>
          <span>{filteredEvents.length}</span>
        </div>
      </div>
      <div className="events-list">
        {renderEvents()}
      </div>
      <div className="events-actions">
        <button className="view-all-events-button" onClick={() => navigate('/AllEvents')}>
          Ver todos mis eventos
        </button>
        <button className="create-event-button" onClick={onOpenCreateModal}>
          Create Event
        </button>
      </div>
    </div>
  );
};

export default EventList;
