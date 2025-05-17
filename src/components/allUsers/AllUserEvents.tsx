import React, { useEffect, useState } from 'react';
import './AllUserEvents.css';
import { Userinfo } from '../../types/UserInfo';
import EventsService from '../../service/event.service';

type UserResponseDto = {
  id: string;
  username: string;
};

const AllUsersEvents = () => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!Userinfo.token || !Userinfo.userId) {
        console.error("No token or UserID found in localstorage.");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const fetchedUsers = await EventsService.aGetUsers(Userinfo.token);
        if (Array.isArray(fetchedUsers)) {
          setUsers(fetchedUsers);
        } else if (fetchedUsers && Array.isArray(fetchedUsers.users)) {
          setUsers(fetchedUsers.users);
        } else if (fetchedUsers && Array.isArray(fetchedUsers.data)) {
          setUsers(fetchedUsers.data);
        } else {
          console.warn("Fetched users data is not an array, object with 'users' array, or object with 'data' array:", fetchedUsers);
          setUsers([]);
          setError("Unexpected data format received from server.");
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError(err.message || "Failed to fetch users. Please try again.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [Userinfo.token]);

  return (
    <div className="users-events-page-container">
      <div className="users-events-title-banner">
        <h1 className="users-events-title-text">ALL USERS/EVENTS</h1>
      </div>

      <div className="users-events-search-bar-container">
        <div className="users-events-search-input-wrapper">
          <span className="users-events-search-icon">
            
          </span>
          <input
            type="text"
            placeholder="Search by name"
            className="users-events-search-input"
          />
        </div>
      </div>

      {loading && <p className="users-events-loading-message">Loading users...</p>}
      {error && <p className="users-events-error-message">Error: {error}</p>}

      {!loading && !error && users.length === 0 && (
        <p className="users-events-no-users-message">No users found.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="users-events-cards-grid">
          {users.map((user) => (
            <div className="users-events-user-card" key={user.id}>
              <div className="users-events-username-label">{user.username}</div>
              <button className="users-events-view-events-button">Ver eventos</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllUsersEvents;