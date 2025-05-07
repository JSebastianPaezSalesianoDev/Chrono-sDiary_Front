import './createEvent.css';

type modalProps = {
    isOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => {},
};
const EventModal = ({ isOpen , onClose }: modalProps) => {

    if (!isOpen) {
        return null;
    }

    const handleCloseOnClick = (e: any) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-close" onClick={handleCloseOnClick}>
            <div className="event-modal">
                <button className="close-event-modal" onClick={onClose}> 
                    <i className='bx bx-x'></i>
                </button>
                <h3 className="modal-title">Create Event</h3>

                <div className="modal-section">
                    <label htmlFor="event-title">Event title</label>
                    <input type="text" id="event-title" name="event-title" placeholder="Event name..." />
                </div>

                <div className="modal-section modal-field-with-icon">
                    <i className='bx bx-time-five'></i>
                    <span>Sunday, May 7 | All day</span>
                </div>

                <div className="modal-section">
                    <label htmlFor="invite-people">Invite People</label>
                    <div className="invite-input-group">
                        <i className='bx bx-group'></i>
                        <input type="text" id="invite-people" name="invite-people" placeholder="USERNAME" />
                        <button className="invite-button">INVITE</button>
                    </div>
                </div>

                <div className="modal-section modal-field-with-icon">
                    <i className='bx bx-map'></i>
                    <input type="text" id="event-location" name="event-location" placeholder="Santa Cruz De Tenerife" />
                </div>

                <div className="modal-section">
                    <label htmlFor="event-description">Description</label>
                    <textarea id="event-description" name="event-description" rows={4}></textarea>
                </div>

                <div className="modal-section owner-section">
                    <label>Owner</label>
                    <span className="owner-name">Juan Sebastian Paez Delgado</span>
                </div>

                <div className="modal-actions">
                    <button className="submit-button">ENVIAR</button>
                </div>
            </div>
         </div>
    );
};

export default EventModal;