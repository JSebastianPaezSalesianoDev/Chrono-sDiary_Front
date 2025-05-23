import React, { useEffect, useState, useCallback, useRef } from 'react';
import './AllUserEvents.css';
import { useUserInfo } from '../../types/UserInfo';
import EventsService from '../../service/event.service';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../profile/profile';

type UserResponseDto = {
  id: string;
  username: string;
  roles?: Array<{ name: string }>;
};

const AllUsersEvents = () => {
  const { userInfo } = useUserInfo();
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserIdForModal, setSelectedUserIdForModal] = useState<string | null>(null);
  const [dropdownOpenUserId, setDropdownOpenUserId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    if (!userInfo.token) {
      setLoading(false);
      setError("User not authenticated to fetch user list.");
      setUsers([]);
      return;
    }
    try {
      setLoading(true);
      const fetchedUsersResponse = await EventsService.aGetUsers(userInfo.token);
      const usersList = Array.isArray(fetchedUsersResponse?.data)
        ? fetchedUsersResponse.data
        : Array.isArray(fetchedUsersResponse)
          ? fetchedUsersResponse
          : [];
      setUsers(usersList);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [userInfo.token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpenUserId(null);
      }
    };

    if (dropdownOpenUserId) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpenUserId]);

  const handleViewEventsClick = (userId: string) => {
    navigate(`/events/${userId}`);
  };

  const handleDeleteUser = async (userIdToDelete: string, username: string) => {
    if (!userInfo.token) {
      alert("Authentication error. Cannot delete user.");
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      await EventsService.aDeleteUser(userInfo.token, userIdToDelete);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userIdToDelete));
      alert(`User "${username}" deleted successfully.`);
      setDropdownOpenUserId(null);
    } catch (err) {
      alert(`Failed to delete user "${username}".`);
    }
  };

  const handleToggleAdmin = async (userIdToToggle: string) => {
    if (!userInfo.token) {
      alert("Authentication error. Cannot toggle admin status.");
      return;
    }
    try {
      const updatedUser = await EventsService.toggleUserAdminStatus(userInfo.token, userIdToToggle);
      setUsers(prevUsers =>
        prevUsers.map(u => (u.id === userIdToToggle ? { ...u, roles: updatedUser.roles } : u))
      );
      alert(`Admin status for user ID ${userIdToToggle} toggled.`);
      setDropdownOpenUserId(null);
    } catch (err) {
      alert(`Failed to toggle admin status for user ID ${userIdToToggle}.`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/");
  };

  const isUserAdmin = (user: UserResponseDto): boolean => {
    return !!user.roles?.some(role => role.name === 'ADMIN');
  };

  if (loading) {
    return <div className="users-events-page-container"><p>Loading users...</p></div>;
  }

  if (error) {
    return <div className="users-events-page-container"><p className="modal-error">Error: {error}</p></div>;
  }

  return (
    <div className="users-events-page-container">
 <button
      className="fixed-logout-button" 
      onClick={handleLogout}
    >
      Logout
    </button>
      <div className="users-events-title-banner">
        <h1 className="users-events-title-text">ALL USERS/EVENTS</h1>
      </div>
      {users.length === 0 && !loading && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No users found.</p>
      )}
      <div className="users-events-cards-grid">
        {users.map((user) => (
          <div className="users-events-user-card" key={user.id}>
            <div className="users-events-username-label">{user.username}</div>
            <button
              className="users-events-view-events-button"
              onClick={() => handleViewEventsClick(user.id)}
            >
              View Events
            </button>
            <div className="user-actions-container">
              <button
                className="user-actions-icon-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpenUserId(prevId => prevId === user.id ? null : user.id);
                }}
                aria-haspopup="true"
                aria-expanded={dropdownOpenUserId === user.id}
                title="User Actions"
              >
                ⚙️
              </button>
              {dropdownOpenUserId === user.id && (
                <div className="user-actions-dropdown" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setSelectedUserIdForModal(user.id);
                      setDropdownOpenUserId(null);
                    }}
                    className="user-actions-dropdown-btn edit"
                    title="Edit User Profile"
                  >
                    📝 Edit Profile
                  </button>
                  <button
                    className="user-actions-dropdown-btn delete"
                    onClick={() => handleDeleteUser(user.id, user.username)}
                    title="Delete User"
                  >
                    🗑️ Delete User
                  </button>
                  <div className="user-actions-dropdown-item toggle-admin-item">
                    <span>Make Admin:</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={isUserAdmin(user)}
                        onChange={() => handleToggleAdmin(user.id)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedUserIdForModal && (
        <ProfileModal
          isOpen={!!selectedUserIdForModal}
          targetUserId={selectedUserIdForModal}
          onClose={(updated?: boolean) => {
            setSelectedUserIdForModal(null);
            if (updated) {
              fetchUsers();
            }
          }}
        />
      )}
    </div>
  );
};

export default AllUsersEvents;