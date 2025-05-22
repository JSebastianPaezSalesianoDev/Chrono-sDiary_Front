import React, { useEffect, useState } from 'react';
import './AllUserEvents.css';
import { useUserInfo } from '../../types/UserInfo';
import EventsService from '../../service/event.service';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../profile/profile';

type UserResponseDto = {
  id: string;
  username: string;
};

const AllUsersEvents = () => {
  const { userInfo } = useUserInfo();
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); 
  const [dropdownOpenUserId, setDropdownOpenUserId] = useState<string | null>(null); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userInfo.token) {
        setLoading(false);
        setError("User not authenticated.");
        return;
      }

      try {
        setLoading(true);
        const fetchedUsers = await EventsService.aGetUsers(userInfo.token);
        const usersList = Array.isArray(fetchedUsers?.data)
          ? fetchedUsers.data
          : Array.isArray(fetchedUsers)
            ? fetchedUsers
            : [];

        setUsers(usersList);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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

      <div className="users-events-cards-grid">
        {users.map((user) => (
          <div className="users-events-user-card" key={user.id}>
            <div className="users-events-username-label">{user.username}</div>
            <button
              className="users-events-view-events-button"
              onClick={() => handleViewEventsClick(user.id)}
            >
              Ver eventos
            </button>

            <button
              className="user-actions-icon-button"
              onClick={() =>
                setDropdownOpenUserId((prev) => (prev === user.id ? null : user.id))
              }
            >
              ✏️
            </button>

            {dropdownOpenUserId === user.id && (
              <div className="user-actions-dropdown">
                <button
                  onClick={() => setSelectedUserId(user.id)}
                  className="user-actions-dropdown-btn edit"
                >
                  📝
                </button>
                <button
                  className="users-events-action-btn delete"
                  onClick={async () => {
                    if (!userInfo.token) return;  

                    const confirmed = window.confirm(`Are you sure you want to delete user "${user.username}"?`);
                    if (!confirmed) return;

                    try {
                      await EventsService.aDeleteUser(userInfo.token, user.id);
                      setUsers((prev) => prev.filter((u) => u.id !== user.id)); 
                    } catch (err) {
                      console.error("Error deleting user:", err);
                      alert("Failed to delete user.");
                    }
                  }}
                >
                  🗑️ 
                </button>

              </div>
            )}
          </div>
        ))}
      </div>


      {selectedUserId && (
        <ProfileModal
          isOpen={true}
          userId={selectedUserId}
          onClose={() => {
            setSelectedUserId(null);
            setDropdownOpenUserId(null);
          }}
        />
      )}
    </div>
  );
};

export default AllUsersEvents;