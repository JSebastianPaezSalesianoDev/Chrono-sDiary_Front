
  import { useEffect, useState } from "react";
  import { format, parseISO } from "date-fns";
  import EventsService from "../../service/event.service";
  import "./EventGroupedList.css";
  import { useUserInfo } from '../../types/UserInfo';
  import { useParams, useNavigate } from 'react-router-dom';

  type Event = {
    startTime: string;
    endTime: string;
    title: string;
    description: string;
    id: string;
  };

  const GroupedEventList = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewingUsername, setViewingUsername] = useState<string | null>(null);

    const { userInfo } = useUserInfo();
    const { userId: targetUserIdParam } = useParams<{ userId?: string }>();
    const navigate = useNavigate();
    const targetUserId = targetUserIdParam || userInfo.userId;

    useEffect(() => {
      const fetchUserDataAndEvents = async () => {
        const loggedInUserToken = userInfo.token;
        let userIdToFetch = targetUserId;
        if (!loggedInUserToken || !userIdToFetch) {
          setError("Authentication token or target user ID missing.");
          setLoading(false);
          return;
        }
        setLoading(true);
        setError(null);
        setViewingUsername(null);
        try {
          if (userIdToFetch === userInfo.userId) {
            setViewingUsername(userInfo.username);
          } else {
            try {
              const userDetailsResponse = await EventsService.aGetUserById(loggedInUserToken, userIdToFetch);
              if (userDetailsResponse && userDetailsResponse.data.username) {
                setViewingUsername(userDetailsResponse.data.username);
              } else {
                setViewingUsername("Unknown User");
              }
            } catch (userFetchError) {
              setViewingUsername("Error fetching user name");
            }
          }
          const eventsResponse = await EventsService.aGetEventsById(loggedInUserToken, userIdToFetch);
          if (eventsResponse && Array.isArray(eventsResponse.data)) {
            setEvents(eventsResponse.data);
          } else {
            setEvents([]);
            setError("Unexpected data format received for events.");
          }
        } catch (error: any) {
          setError(error.response?.data?.message || error.message || "Error al cargar eventos.");
          setEvents([]);
          setViewingUsername(null);
        } finally {
          setLoading(false);
        }
      };
      fetchUserDataAndEvents();
    }, [userInfo.token, userInfo.userId, targetUserId]);

    const groupedEvents = events.reduce<Record<string, Event[]>>((acc, event) => {
      try {
        const date = parseISO(event.startTime);
        const dateKey = format(date, "MMMM d, yyyy");
        acc[dateKey] = [...(acc[dateKey] || []), event];
      } catch (e) {
        console.error("Invalid startTime format for event:", event, e);
      }
      return acc;
    }, {});

    const sortedDates = Object.keys(groupedEvents).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const isViewingOwnEvents = targetUserId === userInfo.userId;

    const handleDelete = async (eventId: string) => {
      if (!userInfo.token) {
        setError("Authentication token missing for deletion.");
        return;
      }
      try {
        await EventsService.aDeleteEvent(userInfo.token, eventId);
        setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
      } catch (error) {
        setError((error as Error).message || "Error al borrar evento.");
      }
    };

    return (
      <div className="event-page">
        <div className="event-header">
          <h1>EVENTS</h1>
        </div>
        <div className="controls-container">
          <button className="back-button" onClick={() => navigate(-1)}>⬅ Ir atrás</button>
        </div>
        <h2 className="event-subtitle">
          {viewingUsername ? `${viewingUsername}’s Events` : (isViewingOwnEvents ? 'My Events' : 'User Events')}
        </h2>
        {loading && <p>Cargando eventos...</p>}
        {error && <p className="modal-error">Error: {error}</p>}
        {!loading && !error && events.length === 0 && (
          <p style={{ textAlign: "center" }}>
            {isViewingOwnEvents ? "No tienes eventos programados." : "No se encontraron eventos para este usuario."}
          </p>
        )}

        <div className="event-list">
          {sortedDates.map((date) => (
            <div key={date} className="event-day-group">
              {date !== 'Invalid Date' && <h3>{format(new Date(date), "MMMM d, yyyy").toUpperCase()}</h3>}
              {groupedEvents[date].map((event) => (
                <div className="event-box" key={event.id}>
                  <div className="event-entry">
                    <p className="event-title">{event.title}</p>
                    <p className="event-time">
                      {event.startTime && format(parseISO(event.startTime), "HH:mm")}
                      {event.startTime !== event.endTime && event.endTime && (
                        <> - {format(parseISO(event.endTime), "HH:mm")}</>
                      )}
                    </p>
                    <p className="event-description">
                      • {event.description && event.description.trim() !== "" ? event.description : "Sin descripción"}
                    </p>
                  </div>
                  
                    <button className="delete-button" onClick={() => handleDelete(event.id)}>
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
