import React, { useEffect, useState } from 'react';
import './AllUserEvents.css';
import { useUserInfo } from '../../types/UserInfo'; 
import EventsService from '../../service/event.service';
import { useNavigate } from 'react-router-dom';

type UserResponseDto = {
  id: string;
  username: string;
};

const AllUsersEvents = () => {
  const { userInfo, userRole } = useUserInfo();

  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchAndLogUserById = async (id: string, token: string) => {
    try {
      const user = await EventsService.aGetUserById(token, id);
      console.log('Usuario obtenido:', user);
      if (user && user.username) {
        localStorage.setItem('viewedUsername', user.username);
      }
      return user;
    } catch (error) {
      console.error('Error al obtener usuario por id:', error);
      return null;
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      if (!userInfo.token || !userInfo.userId) {
        setLoading(false);
        setError("User not authenticated.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const fetchedUsers = await EventsService.aGetUsers(userInfo.token);
        if (Array.isArray(fetchedUsers)) {
          setUsers(fetchedUsers);
        } else if (fetchedUsers && Array.isArray(fetchedUsers.users)) {
          setUsers(fetchedUsers.users);
        } else if (fetchedUsers && Array.isArray(fetchedUsers.data)) {
          setUsers(fetchedUsers.data);
        } else {
          setUsers([]);
          setError("Unexpected data format received from server.");
        }
      } catch (err) {
        setError((err as Error).message || "Failed to fetch users. Please try again.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo.token) {
       fetchUsers();
    } else {
       setLoading(false);
       setError("User not authenticated.");
    }

  }, [userInfo.token]);

  const handleViewEventsClick = (userId: string) => {
    navigate(`/events/${userId}`);
  };

  return (
    <div className="users-events-page-container">
                <button
                  className="settings-logout-btn"
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("username");
                    navigate("/");
                  }}
                >
                  Logout
                </button>
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
              <button
                className="users-events-view-events-button"
                onClick={async () => {
                  if (userInfo.token) {
                    await fetchAndLogUserById(user.id, userInfo.token);
                  }
                  handleViewEventsClick(user.id);
                }}
              >
                Ver eventos
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllUsersEvents;