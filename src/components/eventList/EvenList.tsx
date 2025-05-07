import "./eventList.css" 
const EventList = ({ onOpenCreateModal}) => {

    return (
        <div className="events-section">
            <div className="events-header">
                <h2>EVENTS</h2>
                <div className="notification-bell">
                    <i className="bx bxs-bell"></i>
                    <span>3</span> 
                </div>
            </div>
            <div className="events-list">

                <div className="event-item">
                    <div className="event-item-date">
                        <div className="event-day">MAY 7, 2025</div>
                        <div className="event-time">8:15</div>
                    </div>
                    <div className="event-item-text">
                        Quemar coches con Luis
                    </div>
                </div>
            </div>
            <div className="events-actions">
                 <button className="view-all-events-button">
                    Ver todos mis eventos
                </button>
                <button className="create-event-button" onClick={onOpenCreateModal}>
                    Create Event
                </button>
            </div>
        </div>
    );
};

export default EventList;