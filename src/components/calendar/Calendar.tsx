import "./CalendarApp.css"; 

const Calendar = () => {

    const currentMonth = "MAY";
    const currentYear = 2024;
    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1); 

    return (
        <div className="calendar-app">
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

                <div className="event-modal"> 
                    <button className="close-event-modal"> <i className='bx bx-x'></i></button>
                    <h3 className="modal-title">Modal</h3>

                    <div className="modal-section">
                        <label htmlFor="event-title">Event title</label>
                        <input type="text" id="event-title" name="event-title" placeholder="PlaceHolder" />
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

            <div className="calendar-section">
                <div className="calendar-header">
                    <h2 className="current-date">{currentMonth}, {currentYear}</h2>
                    <div className="navigation-buttons">
                        <button className="nav-button prev">
                            <i className="bx bx-chevron-left"></i>
                        </button>
                        <button className="nav-button next">
                            <i className="bx bx-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div className="weekdays">
                    <span>Monday</span>
                    <span>Tuesday</span>
                    <span>Wednesday</span>
                    <span>Thursday</span>
                    <span>Friday</span>
                    <span>Saturday</span>
                    <span>Sunday</span>
                </div>
                <div className="days">
             
                    <span className="empty-day"></span>
                    <span className="empty-day"></span>
                    {daysInMonth.map(day => (
                        <span key={day} className="day-cell">{day}</span>
                    ))}
            
                     <span className="empty-day"></span>
                     <span className="empty-day"></span>
                     <span className="empty-day"></span>

                </div>
            </div>
        </div>
    );
};

export default Calendar;