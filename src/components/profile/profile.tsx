// src/components/profile/profile.tsx
import React, { useState, useEffect } from 'react';
import EventsService from '../../service/event.service';
import "./profile.css";
import { useUserInfo } from '../../types/UserInfo';
import { useNavigate } from 'react-router-dom';

// Modal de perfil de usuario
const ProfileModal = ({ isOpen, onClose, targetUserId }) => {
  const { userInfo, refreshUserInfo } = useUserInfo();
  const navigate = useNavigate();
  const [profileUsername, setProfileUsername] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [initialUsername, setInitialUsername] = useState("");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Obtiene los datos del perfil
  useEffect(() => {
    const fetchProfileData = async () => {
      setProfilePassword("");
      setProfileMessage(null);
      setProfileError(null);
      setProfileLoading(true);
      const userIdToLoad = targetUserId || userInfo.userId;
      if (!targetUserId && userIdToLoad === userInfo.userId) {
        setProfileUsername(userInfo.username || "");
        setInitialUsername(userInfo.username || "");
      } else {
        setProfileUsername("");
        setInitialUsername("");
      }
      setProfileEmail("");
      if (!userInfo.token || !userIdToLoad) {
        setProfileError("Cannot load profile: Authentication token or User ID is missing.");
        setProfileLoading(false);
        return;
      }
      try {
        const response = await EventsService.aGetUserById(userInfo.token, userIdToLoad);
        if (response && response.data) {
          const userToEdit = response.data;
          setProfileUsername(userToEdit.username || "");
          setInitialUsername(userToEdit.username || "");
          setProfileEmail(userToEdit.email || "");
        } else {
          setProfileError(`User with ID ${userIdToLoad} not found or data is invalid.`);
          if (targetUserId) {
              setProfileUsername("");
              setInitialUsername("");
              setProfileEmail("");
          }
        }
      } catch (err: any) {
        let errorMessage = "Could not load user details. Please try again.";
        if (err.response?.status === 404) {
            errorMessage = `User with ID ${userIdToLoad} not found.`;
        } else if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        }
        setProfileError(errorMessage);
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
  }, [isOpen, userInfo.token, userInfo.userId, targetUserId, userInfo.username]);

  // Actualiza el perfil
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
    const updateData = {
      username: profileUsername,
      email: profileEmail,
    };
    if (profilePassword && profilePassword.trim() !== "") {
      updateData.password = profilePassword;
    }
    try {
      await EventsService.aUpdateUser(userInfo.token, idToUpdate, updateData);
      setProfileMessage("Profile updated successfully.");
      setProfilePassword("");
      const usernameActuallyChanged = initialUsername !== profileUsername;
      if (idToUpdate === userInfo.userId) {
        await refreshUserInfo();
        if (usernameActuallyChanged) {
          localStorage.clear();
          navigate("/");
        } else {
          setTimeout(() => {
            onClose(true);
          }, 1500);
        }
      } else {
        setTimeout(() => {
          onClose(true);
        }, 1500);
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setProfileError("Authentication failed or action not authorized. Your session may have expired, you lack permission, or the username/email is already taken.");
      } else if (err.response && err.response.status === 409) {
        setProfileError(err.response.data.message || "Username or email is already taken.");
      }
      else {
        const serverMessage = err.response?.data?.message;
        setProfileError(serverMessage || "Failed to update profile. Please check the provided data or try again later.");
      }
    } finally {
      setProfileLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const modalTitle = (targetUserId && targetUserId !== userInfo.userId) 
    ? `Edit User: ${initialUsername || profileUsername || 'Loading...'}`
    : "My Profile";

  return (
    <div
      className="profile-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(false);
      }}
    >
      <form className="profile-modal-content" onSubmit={handleProfileUpdate}>
        <button
          type="button"
          className="profile-modal-close-btn"
          onClick={() => onClose(false)}
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