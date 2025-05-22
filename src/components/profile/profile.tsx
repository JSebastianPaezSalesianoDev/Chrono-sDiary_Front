import React, { useState, useEffect } from 'react';
import EventsService from '../../service/event.service';
import "./profile.css";
import { useUserInfo } from '../../types/UserInfo'; // Assuming this provides { userInfo, setUserInfo } or similar

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  // If useUserInfo provides a setter, destructure it.
  // For this example, I'll assume it might not, and we'll focus on localStorage
  // and the API refetch. If it did, e.g., { userInfo, updateUserInfo }, you'd call updateUserInfo.
  const { userInfo } = useUserInfo();

  // Initialize state from userInfo, but useEffect will be the primary source on open
  const [profileUsername, setProfileUsername] = useState(userInfo.username || "");
  const [profileEmail, setProfileEmail] = useState(""); // Will be fetched
  const [profilePassword, setProfilePassword] = useState("");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form state specific to an update attempt
      setProfilePassword("");
      setProfileMessage(null);
      setProfileError(null);

      // Set initial values from current userInfo (which might be stale if useUserInfo hasn't updated yet)
      // The API call below is intended to overwrite these with the freshest data.
      setProfileUsername(userInfo.username || "");
      // setProfileEmail(""); // Clear email initially, or use userInfo.email if available

      if (userInfo.token && userInfo.userId) {
        // It's good practice to indicate loading for this fetch too if it's noticeable
        // For simplicity, we'll use the existing profileLoading for the submit button.
        EventsService.aGetUsers(userInfo.token)
          .then((usersResponse: any) => {
            let user = null;
            const usersArray = Array.isArray(usersResponse?.data)
              ? usersResponse.data
              : Array.isArray(usersResponse)
              ? usersResponse
              : [];

            user = usersArray.find(
              (u: any) => u.id?.toString() === userInfo.userId
            );

            if (user) {
              setProfileUsername(user.username || ""); // Prioritize API data, fallback to empty
              setProfileEmail(user.email || "");     // Prioritize API data, fallback to empty
            } else {
              // User not found via API, this is problematic.
              // Keep the username from userInfo as a last resort.
              setProfileUsername(userInfo.username || "");
              setProfileEmail(""); // No reliable source for email if user not found
              console.warn(
                "User details not found via API, using locally stored username (may be stale if update just occurred)."
              );
              setProfileError("Could not fully refresh profile from server.");
            }
          })
          .catch((err) => {
            console.error("Error fetching user details for profile:", err);
            // On error, fall back to what we have in userInfo
            setProfileUsername(userInfo.username || "");
            setProfileEmail(""); // Or userInfo.email if you want to show potentially stale email
            setProfileError(
              "Could not load current user details. Using available information."
            );
          });
      } else {
        // Not authenticated or missing details
        setProfileUsername(userInfo.username || ""); // Show whatever username we have (e.g., from localStorage via userInfo)
        setProfileEmail(""); // Can't get email if not authenticated
        setProfileError("Not authenticated. Cannot fetch full profile details.");
      }
    }
  }, [isOpen, userInfo.token, userInfo.userId, userInfo.username]); // Key dependencies

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

    try {
      await EventsService.aUpdateUser(userInfo.token, userInfo.userId, updateData);
      setProfileMessage("Profile updated successfully.");
      setProfilePassword(""); // Clear password field

      // If username changed, update localStorage.
      // useUserInfo hook should ideally react to localStorage changes or provide a setter.
      if (userInfo.username !== profileUsername) {
        localStorage.setItem("username", profileUsername);
        // IMPORTANT: If useUserInfo provides a setter function like `updateUserInfo` or `setUserInfo`
        // you MUST call it here to update the global state.
        // e.g., updateUserInfo({ ...userInfo, username: profileUsername });
        // Without this, `userInfo` in the next render cycle (when modal reopens) might still be stale
        // until a full page refresh or if `useUserInfo` itself listens to localStorage.
      }
      // Similarly for email if it's part of global userInfo state
      // if (userInfo.email !== profileEmail && typeof updateUserInfo === 'function') {
      //   updateUserInfo({ ...userInfo, email: profileEmail });
      //   localStorage.setItem("email", profileEmail); // If you store email in localStorage too
      // }


      setTimeout(() => {
        onClose(); // This will trigger the useEffect again because `isOpen` changes
      }, 1500);
    } catch (err: any) {
      setProfileError(
        err?.response?.data?.message || err.message || "Error updating profile."
      );
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
        {profileMessage && (
          <div className="profile-modal-message success">{profileMessage}</div>
        )}
        {profileError && (
          <div className="profile-modal-message error">{profileError}</div>
        )}

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

        <button
          type="submit"
          className="profile-modal-submit-btn"
          disabled={profileLoading}
        >
          {profileLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileModal;