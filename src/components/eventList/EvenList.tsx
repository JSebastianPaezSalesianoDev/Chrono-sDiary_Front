import { useEffect, useState } from "react";
import "./eventList.css";
import EventsService from "../../service/event.service";

type EventListProps = {
  onOpenCreateModal: () => void;
};

type Event = {
  startTime: number;
  endTime: number;
  title: string;
  date: string;
};

const EventList = ({ onOpenCreateModal }: EventListProps) => {
  const [userEvents, setUserEvents] = useState<Event[]>([]);

  useEffect(() => {
    EventsService.aGetEventsById("1")
      .then((response) => {
        setUserEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const renderEvents = () => {
    console.log(userEvents);
    return userEvents.map((event, index) => (
      <div className="event-item" key={index}>
        <div className="event-item-date">
          <div className="event-day">{event.startTime.toString().slice(7,10)}</div>
          <div className="event-time">{event.startTime}</div>
        </div>
        <div className="event-item-text">{event.title}</div>
      </div>
    ));
  };

  return (
    <div className="events-section">
      <div className="events-header">
        <h2>EVENTS</h2>
        <div className="notification-bell">
          <i className="bx bxs-bell"></i>
          <span>{userEvents.length}</span>
        </div>
      </div>
      <div className="events-list">
        {renderEvents()}
      </div>
      <div className="events-actions">
        <button className="view-all-events-button">
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
