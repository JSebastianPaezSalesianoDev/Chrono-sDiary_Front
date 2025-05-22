import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import EventsService from "../../service/event.service";
import "./EventGroupedList.css";
import { useUserInfo } from '../../types/UserInfo';
<<<<<<< HEAD

=======
>>>>>>> admin
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

<<<<<<< HEAD
  const { userInfo, userRole } = useUserInfo();

  const { userId: targetUserId } = useParams<{ userId: string }>();

  const navigate = useNavigate();
=======
  const { userInfo } = useUserInfo();
  const { userId: targetUserIdParam } = useParams<{ userId?: string }>();
  const navigate = useNavigate();

  const targetUserId = targetUserIdParam || userInfo.userId;
>>>>>>> admin

  useEffect(() => {
    const fetchUserDataAndEvents = async () => {
      const loggedInUserToken = userInfo.token;
<<<<<<< HEAD
      let userIdToFetch = targetUserId;
      
      if (!userRole?.isAdmin) {
        userIdToFetch = localStorage.getItem("userId") || userInfo.userId;
      }

      if (!loggedInUserToken || !userIdToFetch) {
=======

      if (!loggedInUserToken || !targetUserId) {
>>>>>>> admin
        setError("Authentication token or target user ID missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setViewingUsername(null);

      try {
<<<<<<< HEAD
        if (userIdToFetch === userInfo.userId) {
          setViewingUsername(userInfo.username);
        } else if (userRole?.isAdmin) {
          const storedViewedUsername = localStorage.getItem('viewedUsername');
          if (storedViewedUsername) {
            setViewingUsername(storedViewedUsername);
          } else {
            try {
              const userDetailsResponse = await EventsService.aGetUserById(loggedInUserToken, userIdToFetch);
              if (userDetailsResponse && userDetailsResponse.username) {
                setViewingUsername(userDetailsResponse.username);
              } else {
                setViewingUsername("Unknown User");
              }
            } catch (userFetchError) {
              setViewingUsername("Error fetching user name");
            }
          }
        } else {
          setViewingUsername(userInfo.username);
        }

        const eventsResponse = await EventsService.aGetEventsById(loggedInUserToken, userIdToFetch);
=======
        if (targetUserId === userInfo.userId) {
          setViewingUsername(userInfo.username);
        } else {
          try {
            const userDetailsResponse = await EventsService.aGetUserById(loggedInUserToken, targetUserId);
            if (userDetailsResponse && userDetailsResponse.data?.username) {
              setViewingUsername(userDetailsResponse.data.username);
            } else {
              console.warn("Could not fetch username for target user:", targetUserId, userDetailsResponse);
              setViewingUsername("Unknown User");
            }
          } catch (userFetchError) {
            console.error("Error fetching target user details:", userFetchError);
            setViewingUsername("Error fetching user name");
          }
        }

        const eventsResponse = await EventsService.aGetEventsById(loggedInUserToken, targetUserId);
>>>>>>> admin

        if (eventsResponse && Array.isArray(eventsResponse.data)) {
          setEvents(eventsResponse.data);
        } else {
          setEvents([]);
          setError("Unexpected data format received for events.");
        }

      } catch (error: any) {
<<<<<<< HEAD
=======
        console.error("Error fetching events:", error);
>>>>>>> admin
        setError(error.response?.data?.message || error.message || "Error al cargar eventos.");
        setEvents([]);
        setViewingUsername(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndEvents();

<<<<<<< HEAD
    return () => {
      localStorage.removeItem('viewedUsername');
    };

  }, [userInfo.token, userInfo.userId, userRole, targetUserId]);
=======
  }, [userInfo.token, userInfo.userId, targetUserId]);
>>>>>>> admin

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
<<<<<<< HEAD
=======
  const isViewingOwnEvents = targetUserId === userInfo.userId;
>>>>>>> admin

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

  const isViewingOwnEvents = targetUserId === userInfo.userId;

  return (
    <div className="event-page">
      <div className="event-header">
        <h1>EVENTS</h1>
      </div>
      <div className="controls-container">
<<<<<<< HEAD
        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ⬅ Ir atrás
        </button>
=======
        <button className="back-button" onClick={() => navigate(-1)}>⬅ Ir atrás</button>
>>>>>>> admin
      </div>
      <h2 className="event-subtitle">
        {viewingUsername ? `${viewingUsername}’s Events` : (isViewingOwnEvents ? 'My Events' : 'User Events')}
      </h2>

      {loading && <p>Cargando eventos...</p>}
      {error && <p className="modal-error">Error: {error}</p>}

      {!loading && !error && events.length === 0 && (
        <p>{isViewingOwnEvents ? "No tienes eventos programados." : "No se encontraron eventos para este usuario."}</p>
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
                {isViewingOwnEvents && (
<<<<<<< HEAD
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(event.id)}
                  >
=======
                  <button className="delete-button" onClick={() => handleDelete(event.id)}>
>>>>>>> admin
                    🗑
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupedEventList;
