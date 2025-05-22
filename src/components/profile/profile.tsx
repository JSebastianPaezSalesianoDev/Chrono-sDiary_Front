import React, { useState, useEffect } from 'react';
import EventsService from '../../service/event.service';
import "./profile.css";
import { useUserInfo } from '../../types/UserInfo';
import { useNavigate } from 'react-router-dom';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { userInfo, refreshUserInfo } = useUserInfo();
  const [profileUsername, setProfileUsername] = useState(userInfo.username || "");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    if (isOpen) {
      setProfilePassword("");
      setProfileMessage(null);
      setProfileError(null);

      // Pre-fill username from context immediately
      setProfileUsername(userInfo.username || "");
      // Then try to fetch more details if authenticated
      if (userInfo.token && userInfo.userId) {
        EventsService.aGetUsers(userInfo.token).then((usersResponse: any) => {
          let user = null;
          // Ensure usersResponse.data is an array, or usersResponse itself if data isn't present
          const usersArray = Array.isArray(usersResponse?.data) ? usersResponse.data : (Array.isArray(usersResponse) ? usersResponse : []);
          
          user = usersArray.find((u: any) => u.id?.toString() === userInfo.userId);

          if (user) {
            setProfileUsername(user.username || userInfo.username || "");
            setProfileEmail(user.email || "");
          } else {
            // If user not found by ID (shouldn't happen if ID is correct and user exists)
            // Fallback to context username, email might be unavailable
            setProfileUsername(userInfo.username || "");
            setProfileEmail(""); // Or try to get it from userInfo if it exists there
            console.warn("User details not found via API for the current userId, using locally stored username.");
          }
        }).catch(err => {
          console.error("Error fetching user details for profile:", err);
          setProfileUsername(userInfo.username || ""); // Fallback
          setProfileEmail(""); // Fallback
          // Provide a user-facing error if desired, e.g.:
          // setProfileError("Could not load full profile details. Some information may be unavailable.");
        });
      } else {
        setProfileUsername(userInfo.username || "");
        setProfileEmail(""); // Email likely unavailable if not authenticated to fetch
        // Optionally set an error if profile is opened without auth
        // setProfileError("Not authenticated. Cannot fetch full profile details.");
      }
    }
  }, [isOpen, userInfo.token, userInfo.userId, userInfo.username]); // Added userInfo.username to deps for consistency

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);
    setProfileLoading(true);

    if (!userInfo.token || !userInfo.userId) {
      setProfileError("Authentication details are missing. Please log in again.");
      setProfileLoading(false);
      return;
    }

    const updateData: { username: string; email: string; password?: string } = {
      username: profileUsername,
      email: profileEmail,
    };

    if (profilePassword) {
      updateData.password = profilePassword;
    }

    console.log("Enviando datos de actualización:", updateData);

    try {
      await EventsService.aUpdateUser(userInfo.token, userInfo.userId, updateData);
      setProfileMessage("Profile updated successfully.");
      setProfilePassword("");

      const oldUsername = userInfo.username;
      await refreshUserInfo(); // This should update userInfo in the context

      // Check if username actually changed after refreshUserInfo()
      // refreshUserInfo might be asynchronous and userInfo might not be updated immediately here
      // It's safer to compare profileUsername with oldUsername
      if (oldUsername !== profileUsername) {
        // If username changed, the token might be associated with the old username
        // or some downstream systems might rely on the username in localStorage.
        // Clearing localStorage and redirecting to home is a common pattern for re-auth.
        localStorage.clear(); // Or more selectively: localStorage.removeItem('token'), localStorage.removeItem('userId'), etc.
        navigate("/");
        // No need to call onClose as the component might unmount due to navigation
        // However, if navigation doesn't cause unmount or if you want to ensure modal is closed:
        // onClose();
      } else {
        // If username didn't change, just close the modal after a delay
        setTimeout(() => {
          onClose();
        }, 1500);
      }

    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setProfileError("Authentication failed. Your session may have expired or your credentials are no longer valid.or value is already taken.");
      } else {
        // Try to get a message from the server's response
        const serverMessage = err.response?.data?.message;
        // Otherwise, use a generic message or the error object's message
        setProfileError(serverMessage || "Failed to update profile. Please check the provided data or try again later.");
      }
      console.error("Error updating profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="profile-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="profile-modal-content" onSubmit={handleProfileUpdate}>
        <button
          type="button"
          className="profile-modal-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2>Profile</h2>
        {profileMessage && <div className="profile-modal-message success">{profileMessage}</div>}
        {profileError && <div className="profile-modal-message error">{profileError}</div>}
        
        <label htmlFor="profileUsernameModal">Username</label>
        <input
          id="profileUsernameModal"
          type="text"
          value={profileUsername}
          onChange={(e) => setProfileUsername(e.target.value)}
          required
        />
        
        <label htmlFor="profileEmailModal">Email</label>
        <input
          id="profileEmailModal"
          type="email"
          value={profileEmail}
          onChange={(e) => setProfileEmail(e.target.value)}
          required
        />
        
        <label htmlFor="profilePasswordModal">New Password</label>
        <input
          id="profilePasswordModal"
          type="password"
          value={profilePassword}
          onChange={(e) => setProfilePassword(e.target.value)}
          placeholder="Leave blank to keep current"
        />
        
        <button type="submit" className="profile-modal-submit-btn" disabled={profileLoading}>
          {profileLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileModal;