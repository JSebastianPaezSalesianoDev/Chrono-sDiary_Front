import React, { useState, useEffect } from 'react';
import EventsService from '../../service/event.service'; 
import { Userinfo } from '../../types/UserInfo'; 
import "./profile.css"

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const [profileUsername, setProfileUsername] = useState(Userinfo.username || "");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProfilePassword(""); 
      setProfileMessage(null);
      setProfileError(null);

      if (Userinfo.token && Userinfo.userId) {
        EventsService.aGetUsers(Userinfo.token).then((usersResponse: any) => {
          let user = null;
          const usersArray = Array.isArray(usersResponse?.data) ? usersResponse.data : (Array.isArray(usersResponse) ? usersResponse : []);
          
          user = usersArray.find((u: any) => u.id?.toString() === Userinfo.userId);

          if (user) {
            setProfileUsername(user.username || Userinfo.username || "");
            setProfileEmail(user.email || "");
          } else {
            setProfileUsername(Userinfo.username || "");
            console.warn("User details not found via API, using locally stored username.");
          }
        }).catch(err => {
          console.error("Error fetching user details for profile:", err);
          setProfileUsername(Userinfo.username || "");
          setProfileError("Could not load current user details. Using available information.");
        });
      } else {
  
        setProfileUsername(Userinfo.username || "");
        setProfileError("Not authenticated. Cannot fetch full profile details.");
      }
    }
  }, [isOpen]); 

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);
    setProfileLoading(true);

    if (!Userinfo.token || !Userinfo.userId) {
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
      await EventsService.aUpdateUser(Userinfo.token, Userinfo.userId, updateData);
      setProfileMessage("Profile updated successfully.");
      setProfilePassword(""); 

      if (Userinfo.username !== profileUsername) {
        localStorage.setItem("username", profileUsername);
        Userinfo.username = profileUsername; 
      }

     setTimeout(() => {
       onClose();
     }, 1500);
    } catch (err: any) {
      setProfileError(err?.response?.data?.message || err.message || "Error updating profile.");
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