import React, { useEffect, useState } from 'react';
import EventsService from '../../service/event.service';
import './profile.css';
import { useUserInfo } from '../../types/UserInfo';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userId }) => {
  const { userInfo } = useUserInfo();

  const [profileUsername, setProfileUsername] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userInfo.token && userId) {
      setProfilePassword('');
      setProfileMessage(null);
      setProfileError(null);

      EventsService.aGetUserById(userInfo.token, userId)
        .then((user: any) => {
          setProfileUsername(user.username || '');
          setProfileEmail(user.email || '');
        })
        .catch((err) => {
          console.error('Error fetching user:', err);
          setProfileError('Could not load user details.');
        });
    }
  }, [isOpen, userId, userInfo.token]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    setProfileError(null);
    setProfileLoading(true);

    if (!userInfo.token) {
      setProfileError('Authentication token is missing.');
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
      await EventsService.aUpdateUser(userInfo.token, userId, updateData);
      setProfileMessage('Profile updated successfully.');
      setProfilePassword('');

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setProfileError(err?.response?.data?.message || err.message || 'Error updating profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="profile-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form className="profile-modal-content" onSubmit={handleProfileUpdate}>
        <button type="button" className="profile-modal-close-btn" onClick={onClose}>
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
          {profileLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileModal;