import './createEvent.css';
import { useState, useEffect } from 'react';
import EventsService from '../../service/event.service';
import { useUserInfo } from '../../types/UserInfo';
import { format } from 'date-fns';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onEventCreated: () => void;
    selectedCalendarDate: Date | null;
};

const EventModal = ({ isOpen, onClose, onEventCreated, selectedCalendarDate }: ModalProps) => {
    const [title, setTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const { userInfo } = useUserInfo();
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [invitedEmailsString, setInvitedEmailsString] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (selectedCalendarDate) {
                setEventDate(format(selectedCalendarDate, 'yyyy-MM-dd'));
            } else {
                setEventDate(format(new Date(), 'yyyy-MM-dd'));
            }

            setTitle('');
            setStartTime('');
            setEndTime('');
            setInvitedEmailsString('');
            setLocation('');
            setDescription('');
            setError(null);
            setSuccessMessage(null);
            setIsLoading(false);
        }
    }, [isOpen, selectedCalendarDate]);

    if (!isOpen) {
        return null;
    }

    const handleCloseOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            if (!isLoading && !successMessage) {
                onClose();
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        if (!userInfo.token) {
            setError("Authentication token not found. Please log in.");
            setIsLoading(false);
            return;
        }

        if (!eventDate || !startTime || !endTime) {
            setError("Event date, start time, and end time are required.");
            setIsLoading(false);
            return;
        }

        const combinedStartTime = `${eventDate}T${startTime}:00`;
        const combinedEndTime = `${eventDate}T${endTime}:00`;

        if (new Date(combinedEndTime) <= new Date(combinedStartTime)) {
            setError("End time must be after start time.");
            setIsLoading(false);
            return;
        }

        const invitedUserEmails = invitedEmailsString
            .split(',')
            .map(email => email.trim())
            .filter(email => email !== '');

        const eventData = {
            title,
            startTime: combinedStartTime,
            endTime: combinedEndTime,
            invitedUserEmails,
            location,
            description,
        };

        try {
            await EventsService.aCreateEvent(userInfo.token, eventData);
            setSuccessMessage("Event created successfully!");
            onEventCreated();
            setTimeout(() => {
                setSuccessMessage(null);
                onClose();
                setIsLoading(false);
            }, 2000);
        } catch (err: any) {
            console.error("Error creating event:", err);
            setError(err.response?.data?.message || err.message || "Failed to create event.");
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-close" onClick={handleCloseOnClick}>
            <form className="event-modal" onSubmit={handleSubmit}>
                <button
                    type="button"
                    className="close-event-modal"
                    onClick={onClose}
                    disabled={isLoading && !!successMessage}
                >
                    <i className='bx bx-x'></i>
                </button>
                <h3 className="modal-title">Create Event</h3>

                {error && <p className="modal-error">{error}</p>}
                {successMessage && <p className="modal-success">{successMessage}</p>}

                {(!successMessage || isLoading) && (
                    <>
                        <div className="modal-section">
                            <label htmlFor="event-title">Event title *</label>
                            <input
                                type="text"
                                id="event-title"
                                name="event-title"
                                placeholder="Event name..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="modal-section">
                            <label htmlFor="event-date">Event Date *</label>
                            <input
                                type="date"
                                id="event-date"
                                name="event-date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="modal-grid-half">
                            <div className="modal-section">
                                <label htmlFor="event-start-time">Start Time *</label>
                                <input
                                    type="time"
                                    id="event-start-time"
                                    name="event-start-time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="modal-section">
                                <label htmlFor="event-end-time">End Time *</label>
                                <input
                                    type="time"
                                    id="event-end-time"
                                    name="event-end-time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="modal-section">
                            <label htmlFor="invite-people">Invite People (comma-separated emails)</label>
                            <div className="invite-input-group">
                                <i className='bx bx-group'></i>
                                <input
                                    type="text"
                                    id="invite-people"
                                    name="invite-people"
                                    placeholder="email1@example.com, email2@example.com"
                                    value={invitedEmailsString}
                                    onChange={(e) => setInvitedEmailsString(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="modal-section modal-field-with-icon">
                            <i className='bx bx-map'></i>
                            <input
                                type="text"
                                id="event-location"
                                name="event-location"
                                placeholder="Location..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="modal-section">
                            <label htmlFor="event-description">Description</label>
                            <textarea
                                id="event-description"
                                name="event-description"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isLoading}
                            ></textarea>
                        </div>

                        <div className="modal-section owner-section">
                            <label>Owner</label>
                            <span className="owner-name">{userInfo.username || 'Current User'}</span>
                        </div>

                        <div className="modal-actions">
                            <button type="submit" className="submit-button" disabled={isLoading}>
                                {isLoading ? (successMessage ? 'EVENT CREATED!' : 'CREATING...') : 'CREATE EVENT'}
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default EventModal;