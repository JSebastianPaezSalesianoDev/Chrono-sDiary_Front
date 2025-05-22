// src/components/profile/profile.tsx
import React, { useState, useEffect } from 'react';
import EventsService from '../../service/event.service';
import "./profile.css";
import { useUserInfo } from '../../types/UserInfo';
import { useNavigate } from 'react-router-dom';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: (updated?: boolean) => void; // Callback to signal if an update occurred (for parent to refresh data)
  targetUserId?: string;                // Optional: ID of the user to edit (if not current user)
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, targetUserId }) => {
  const { userInfo, refreshUserInfo } = useUserInfo();
  const navigate = useNavigate();

  // State for the profile being edited
  const [profileUsername, setProfileUsername] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [initialUsername, setInitialUsername] = useState(""); // To track if username actually changed

  // Modal specific state
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setProfilePassword(""); // Reset password field
      setProfileMessage(null);
      setProfileError(null);
      setProfileLoading(true);

      const userIdToLoad = targetUserId || userInfo.userId;

      // Optimistic set for current user's username if no specific target, or clear before fetch
      if (!targetUserId && userIdToLoad === userInfo.userId) {
        setProfileUsername(userInfo.username || "");
        setInitialUsername(userInfo.username || "");
      } else {
        // Clear for target user or if current user's full profile is being fetched by ID
        setProfileUsername("");
        setInitialUsername("");
      }
      setProfileEmail(""); // Always clear email initially, to be fetched

      if (!userInfo.token || !userIdToLoad) {
        setProfileError("Cannot load profile: Authentication token or User ID is missing.");
        setProfileLoading(false);
        return;
      }

      try {
        // Use aGetUserById to fetch the specific user's details
        const response = await EventsService.aGetUserById(userInfo.token, userIdToLoad);
        
        if (response && response.data) { // Assuming response.data contains the user object
          const userToEdit = response.data;7
          console.log(userToEdit);
          setProfileUsername(userToEdit.username || "");
          setInitialUsername(userToEdit.username || ""); // Store the fetched initial username
          setProfileEmail(userToEdit.email || "");
        } else {
          setProfileError(`User with ID ${userIdToLoad} not found or data is invalid.`);
          // Clear fields if a specific target user was requested and not found
          if (targetUserId) {
              setProfileUsername("");
              setInitialUsername("");
              setProfileEmail("");
          }
        }
      } catch (err: any) {
        console.error("Error fetching user details for profile:", err);
        let errorMessage = "Could not load user details. Please try again.";
        if (err.response?.status === 404) {
            errorMessage = `User with ID ${userIdToLoad} not found.`;
        } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        }
        setProfileError(errorMessage);
         // Clear fields if a specific target user was requested and an error occurred
        if (targetUserId) {
            setProfileUsername("");
            setInitialUsername("");
            setProfileEmail("");
        }
      } finally {
        setProfileLoading(false);
      }
    };

    if (isOpen) {
      fetchProfileData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userInfo.token, userInfo.userId, targetUserId, userInfo.username]); 
  // Dependencies:
  // isOpen: Triggers the fetch when modal opens.
  // targetUserId: If this changes, we need to fetch new user data.
  // userInfo.token: Needed for authentication.
  // userInfo.userId: Used if targetUserId is not provided.
  // userInfo.username: Used for optimistic set for current user.

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);
    setProfileLoading(true);

    const idToUpdate = targetUserId || userInfo.userId;

    if (!userInfo.token || !idToUpdate) {
      setProfileError("Authentication details or user ID for update are missing.");
      setProfileLoading(false);
      return;
    }

    const updateData: { username: string; email: string; password?: string } = {
      username: profileUsername,
      email: profileEmail,
    };

    if (profilePassword && profilePassword.trim() !== "") {
      updateData.password = profilePassword;
    }

    try {
      await EventsService.aUpdateUser(userInfo.token, idToUpdate, updateData);
      setProfileMessage("Profile updated successfully.");
      setProfilePassword(""); // Clear password field

      const usernameActuallyChanged = initialUsername !== profileUsername;

      if (idToUpdate === userInfo.userId) { // Current logged-in user edited their own profile
        await refreshUserInfo(); // Refresh context for the logged-in user

        if (usernameActuallyChanged) {
          // Username of the logged-in user changed, requires re-authentication/session refresh
          localStorage.clear(); // Clear all user-related stored data
          navigate("/"); // Redirect to home/login
          // onClose might be called implicitly if navigation unmounts, or explicitly if needed
        } else {
          // Logged-in user updated other details (email/password), but not username
          setTimeout(() => {
            onClose(true); // Signal update occurred, parent might refresh
          }, 1500);
        }
      } else { // Admin (or other authorized user) edited someone else's profile
        // The list in AllUsersEvents (parent component) needs to be refreshed.
        setTimeout(() => {
          onClose(true); // Signal update occurred so parent can refresh its list
        }, 1500);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setProfileError("Authentication failed or action not authorized. Your session may have expired, you lack permission, or the username/email is already taken.");
      } else if (err.response && err.response.status === 409) { // Example: Conflict, username/email taken
        setProfileError(err.response.data.message || "Username or email is already taken.");
      }
      else {
        const serverMessage = err.response?.data?.message;
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

  const modalTitle = (targetUserId && targetUserId !== userInfo.userId) 
    ? `Edit User: ${initialUsername || profileUsername || 'Loading...'}` // Show initial or current username
    : "My Profile";

  return (
    <div
      className="profile-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(false); // Close without update signal
      }}
    >
      <form className="profile-modal-content" onSubmit={handleProfileUpdate}>
        <button
          type="button"
          className="profile-modal-close-btn"
          onClick={() => onClose(false)} // Close without update signal
          aria-label="Close"
        >
          ×
        </button>
        <h2>{modalTitle}</h2>
        {profileLoading && !profileError && <div className="profile-modal-message">Loading profile...</div>}
        {profileMessage && <div className="profile-modal-message success">{profileMessage}</div>}
        {profileError && <div className="profile-modal-message error">{profileError}</div>}
        
        <label htmlFor="profileUsernameModal">Username</label>
        <input
          id="profileUsernameModal"
          type="text"
          value={profileUsername}
          onChange={(e) => setProfileUsername(e.target.value)}
          required
          disabled={profileLoading}
        />
        
        <label htmlFor="profileEmailModal">Email</label>
        <input
          id="profileEmailModal"
          type="email"
          value={profileEmail}
          onChange={(e) => setProfileEmail(e.target.value)}
          required
          disabled={profileLoading}
        />
        
        <label htmlFor="profilePasswordModal">New Password</label>
        <input
          id="profilePasswordModal"
          type="password"
          value={profilePassword}
          onChange={(e) => setProfilePassword(e.target.value)}
          placeholder="Leave blank to keep current"
          disabled={profileLoading}
        />
        
        <button type="submit" className="profile-modal-submit-btn" disabled={profileLoading}>
          {profileLoading ? "Processing..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileModal;