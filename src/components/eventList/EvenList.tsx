import React, { useEffect, useState } from "react";
import "./eventList.css";
import EventsService, { InvitationResponse, InvitationStatus } from "../../service/event.service";
import { format, isSameDay } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../types/UserInfo";

// Lista de eventos e invitaciones del usuario
const EventList = ({ onOpenCreateModal, selectedDate, refreshEvents }: EventListProps) => {
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<InvitationResponse[]>([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const { userInfo } = useUserInfo();
  const navigate = useNavigate();

  // Obtiene eventos e invitaciones del usuario
  const fetchUserEventsAndInvitations = async () => {
    if (!userInfo.token || !userInfo.userId) {
      return;
    }
    try {
      const eventsResponse = await EventsService.aGetEventsById(userInfo.token, userInfo.userId);
      setUserEvents(eventsResponse.data.map((evt: any) => ({ ...evt, id: evt.id?.toString() || Math.random().toString() })) || []);

      const invitationsResponse = await EventsService.aGetUserInvitations(userInfo.token, userInfo.userId);
      const invitations = Array.isArray(invitationsResponse)
        ? invitationsResponse
        : invitationsResponse?.data || [];
      setPendingInvitations(invitations.filter(inv => inv.status === "PENDING"));
    } catch (error) {}
  };

  useEffect(() => {
    fetchUserEventsAndInvitations();
  }, []);

  useEffect(() => {
    setShowAllEvents(false);
  }, [selectedDate]);

  // Maneja la campana de notificaciones
  const handleBellClick = () => {
    setShowNotificationsDropdown(!showNotificationsDropdown);
  };

  // Acepta o rechaza invitaciones
  const handleInvitationAction = async (invitation: InvitationResponse, newStatus: InvitationStatus) => {
    if (!userInfo.token) return;
    try {
      await EventsService.aUpdateInvitationStatus(
        userInfo.token,
        invitation.id,
        invitation.eventId,
        invitation.userId,
        newStatus
      );
      fetchUserEventsAndInvitations();
      setShowNotificationsDropdown(false);
      refreshEvents();
    } catch (error) {}
  };

  const sameDayEvents = selectedDate
    ? userEvents.filter(event =>
        event.startTime && isSameDay(new Date(event.startTime), selectedDate)
      )
    : userEvents;

  const filteredEventsToDisplay = selectedDate && !showAllEvents ? sameDayEvents : userEvents;

  // Renderiza los eventos
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
    if (filteredEventsToDisplay.length === 0) {
        return <p className="no-events-text">No events to display.</p>;
    }
    return filteredEventsToDisplay.map((event) => {
      const formattedDate = event.startTime ? format(new Date(event.startTime), 'MMM d, yyyy') : 'N/A';
      const formattedTime = event.startTime ? format(new Date(event.startTime), 'HH:mm') : 'N/A';
      return (
        <div className="event-item" key={event.id}>
          <div className="event-item-date">
            <div className="event-day">{formattedDate}</div>
            <div className="event-time">{formattedTime}</div>
          </div>
          <div className="event-item-text">{event.title}</div>
        </div>
      );
    });
  };

  // Agrupa invitaciones por título de evento
  const groupedInvitations = React.useMemo(() => {
    const map = new Map<string, InvitationResponse[]>();
    pendingInvitations.forEach(inv => {
      const key = inv.eventTitle || `Event ID ${inv.eventId}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(inv);
    });
    return Array.from(map.entries());
  }, [pendingInvitations]);

  // Cantidad de invitaciones únicas por título
  const uniqueInvitationsCount = groupedInvitations.length;

  return (
    <div className="events-section">
      <div className="events-header">
        <h2>EVENTS</h2>
        <div className="notification-bell-container">
          <div className="notification-bell" onClick={handleBellClick} style={{ cursor: 'pointer' }}>
            <i className="bx bxs-bell"></i>
            {uniqueInvitationsCount > 0 && <span>{uniqueInvitationsCount}</span>}
          </div>
          {showNotificationsDropdown && (
            <div className="notifications-dropdown">
              {pendingInvitations.length === 0 ? (
                <p className="no-notifications">No pending invitations.</p>
              ) : (
                groupedInvitations.map(([title, invitations]) => {
                  const inv = invitations[0];
                  return (
                    <div key={inv.id} className="notification-item">
                      <p>
                        {inv.invitingUserName || `User ID ${inv.invitingUserId || 'Unknown'}`} invited you to "{title}"
                      </p>
                      <div className="notification-actions">
                        <button onClick={() => handleInvitationAction(inv, "ACCEPTED")} className="accept-button">
                          Accept
                        </button>
                        <button onClick={() => handleInvitationAction(inv, "DECLINED")} className="decline-button">
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
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