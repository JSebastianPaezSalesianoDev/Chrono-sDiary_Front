// src/components/AllUserEvents/AllUserEvents.tsx
import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import './AllUserEvents.css';
import { useUserInfo } from '../../types/UserInfo';
import EventsService from '../../service/event.service';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../profile/profile'; // Ensure correct path

type UserResponseDto = {
  id: string;
  username: string;
  // Add email if your DTO and API returns it and you want to display it
  // email?: string; 
};

const AllUsersEvents = () => {
  const { userInfo } = useUserInfo();
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true); // Loading for the user list
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [dropdownOpenUserId, setDropdownOpenUserId] = useState<string | null>(null);

  const navigate = useNavigate();

  // Define fetchUsers using useCallback to stabilize its reference if passed as prop or used in useEffect
  const fetchUsers = useCallback(async () => {
    if (!userInfo.token) {
      setLoading(false);
      setError("User not authenticated to fetch user list.");
      setUsers([]); // Clear users if not authenticated
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
      setError(null); // Clear error on successful fetch
    } catch (err) {
      setError("Failed to fetch users.");
      console.error("Error fetching users:", err);
      setUsers([]); // Clear users on error
    } finally {
      setLoading(false);
    }
  }, [userInfo.token]); // Dependency: re-create fetchUsers if token changes

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // useEffect dependency on the stable fetchUsers function

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
    } catch (err) {
        console.error("Error deleting user:", err);
        alert(`Failed to delete user "${username}".`);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Or your specific token key
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    // Potentially localStorage.clear(); for a full cleanup
    navigate("/");
    // You might want to also reset any global state (like useUserInfo) if applicable
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
        className="settings-logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>

      <div className="users-events-title-banner">
        <h1 className="users-events-title-text">ALL USERS/EVENTS</h1>
      </div>

      {users.length === 0 && !loading && (
        <p style={{textAlign: 'center', marginTop: '20px'}}>No users found.</p>
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

            {/* Actions Dropdown Trigger */}
            <button
              className="user-actions-icon-button" /* Simple icon button styling */
              onClick={() => setDropdownOpenUserId(prevId => prevId === user.id ? null : user.id)}
              aria-haspopup="true"
              aria-expanded={dropdownOpenUserId === user.id}
              title="User Actions"
            >
              ⚙️ {/* Settings icon, or "..." */}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpenUserId === user.id && (
              <div className="user-actions-dropdown">
                <button
                  onClick={() => {
                    setSelectedUserId(user.id);
                    // dropdown will be closed by ProfileModal's onClose or by clicking away
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
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Profile Modal Invocation */}
      {selectedUserId && (
        <ProfileModal
          isOpen={!!selectedUserId} // Ensure isOpen is boolean and true when selectedUserId is not null
          targetUserId={selectedUserId} // Pass the ID of the user to be edited
          onClose={(updated?: boolean) => {
            setSelectedUserId(null); // Always close the modal by clearing selectedUserId
            setDropdownOpenUserId(null); // Also close the dropdown
            if (updated) {
              fetchUsers(); // Re-fetch users if an update occurred in the modal
            }
          }}
        />
      )}
    </div>
  );
};

export default AllUsersEvents;