import { useEffect, useState } from "react";
import { format } from "date-fns";
import EventsService from "../../service/event.service";
import "./EventGroupedList.css";
import { Userinfo } from "../../types/UserInfo";

type Event = {
  startTime: string; 
  endTime: string;
  title: string;
  description: string;
  id: string; 
};

const GroupedEventList = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
      if (!Userinfo.token || !Userinfo.userId) {
          console.error("No hay token o userId en localStorage.");
          return;
        }
 EventsService.aGetEventsById(Userinfo.token!, Userinfo.userId!)
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  // Agrupar por fecha (yyyy-MM-dd)
  const groupedEvents = events.reduce<Record<string, Event[]>>((acc, event) => {
    const dateKey = format(new Date(event.startTime), "yyyy-MM-dd");
    acc[dateKey] = [...(acc[dateKey] || []), event];
    return acc;
  }, {});

const handleDelete = async (eventId: string) => {
    if (!Userinfo.token || !Userinfo.userId) {
        console.error("No hay token o userId en localStorage.");
        return;
    }

    try {
        await EventsService.aDeleteEvent(Userinfo.token, eventId);
        setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
    } catch (error) {
        console.error("Error deleting event:", error);
    }
};

  return (
    <div className="event-page">
      <div className="event-header">
        <h1>EVENTS</h1>
      </div>
      <h2 className="event-subtitle">Username’s Events</h2>

      <div className="event-list">
        {Object.entries(groupedEvents).map(([date, dayEvents]) => (
          <div key={date} className="event-day-group">
            <h3>{format(new Date(date), "MMMM d, yyyy").toUpperCase()}</h3>

            {dayEvents.map((event) => (
              <div className="event-box" key={event.id}>
                <div className="event-entry">
                  <p className="event-time">
                    {format(new Date(event.startTime), "H:mm")} -{" "}
                    {format(new Date(event.endTime), "H:mm")}
                  </p>
                  <p className="event-description">• {event.description}</p>
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(event.id)}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupedEventList;
