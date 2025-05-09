import { useEffect, useState } from "react";
import "./eventList.css";
import EventsService from "../../service/event.service";
import { format } from 'date-fns';
import { Navigate, useNavigate } from "react-router-dom";
import { Userinfo } from "../../types/UserInfo";

type EventListProps = {
  onOpenCreateModal: () => void;
};

type Event = {
  startTime: string;
  endTime: string;
  title: string;
  date: string;
};

const EventList = ({ onOpenCreateModal }: EventListProps) => {
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const navigate = useNavigate()
  useEffect(() => {


    if (!Userinfo.token || !Userinfo.userId) {
      console.error("No hay token o userId en localStorage.");
      return;
    }
    EventsService.aGetEventsById(Userinfo.token!, Userinfo.userId!)
      .then((response) => {
        setUserEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const renderEvents = () => {
    return userEvents.map((event, index) => {
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
          <span>{userEvents.length}</span>
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
