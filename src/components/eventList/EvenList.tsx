import React, { useEffect, useState } from "react";
import "./eventList.css";
import EventsService, { InvitationResponse, InvitationStatus } from "../../service/event.service";
import { format, isSameDay } from 'date-fns';
import { useNavigate } from "react-router-dom";
import { Userinfo } from "../../types/UserInfo";

type EventListProps = {
  onOpenCreateModal: () => void;
  selectedDate: Date | null;
  refreshEvents: () => void;
};

type Event = {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  date?: string;
};

const EventList = ({ onOpenCreateModal, selectedDate, refreshEvents }: EventListProps) => {
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<InvitationResponse[]>([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const navigate = useNavigate();

  const fetchUserEventsAndInvitations = async () => {
    if (!Userinfo.token || !Userinfo.userId) {
      console.error("No hay token o userId en localStorage.");
      return;
    }
    try {
      const eventsResponse = await EventsService.aGetEventsById(Userinfo.token, Userinfo.userId);
      setUserEvents(eventsResponse.data.map((evt: any) => ({ ...evt, id: evt.id?.toString() || Math.random().toString() })) || []);

      const invitationsResponse = await EventsService.aGetUserInvitations(Userinfo.token, Userinfo.userId);
      const invitations = Array.isArray(invitationsResponse)
        ? invitationsResponse
        : invitationsResponse?.data || [];
      setPendingInvitations(invitations.filter(inv => inv.status === "PENDING"));

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchUserEventsAndInvitations();
  }, []);

  useEffect(() => {
    setShowAllEvents(false);
  }, [selectedDate]);

  const handleBellClick = () => {
    setShowNotificationsDropdown(!showNotificationsDropdown);
  };

  const handleInvitationAction = async (invitation: InvitationResponse, newStatus: InvitationStatus) => {
    if (!Userinfo.token) return;
    try {
      await EventsService.aUpdateInvitationStatus(
        Userinfo.token,
        invitation.id,
        invitation.eventId,
        invitation.userId,
        newStatus
      );
      fetchUserEventsAndInvitations();
      setShowNotificationsDropdown(false);
      refreshEvents();
    } catch (error) {
      console.error(`Error ${newStatus === "ACCEPTED" ? "accepting" : "declining"} invitation:`, error);
      alert(`Failed to ${newStatus === "ACCEPTED" ? "accept" : "decline"} invitation.`);
    }
  };

  const sameDayEvents = selectedDate
    ? userEvents.filter(event =>
        event.startTime && isSameDay(new Date(event.startTime), selectedDate)
      )
    : userEvents;

  const filteredEventsToDisplay = selectedDate && !showAllEvents ? sameDayEvents : userEvents;

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

  return (
    <div className="events-section">
      <div className="events-header">
        <h2>EVENTS</h2>
        <div className="notification-bell-container">
          <div className="notification-bell" onClick={handleBellClick} style={{ cursor: 'pointer' }}>
            <i className="bx bxs-bell"></i>
            {pendingInvitations.length > 0 && <span>{pendingInvitations.length}</span>}
          </div>
          {showNotificationsDropdown && (
            <div className="notifications-dropdown">
              {pendingInvitations.length === 0 ? (
                <p className="no-notifications">No pending invitations.</p>
              ) : (
                pendingInvitations.map(inv => (
                  <div key={inv.id} className="notification-item">
                    <p>
                      {inv.invitingUserName || `User ID ${inv.invitingUserId || 'Unknown'}`} invited you to "{inv.eventTitle || `Event ID ${inv.eventId}`}"
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
                ))
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