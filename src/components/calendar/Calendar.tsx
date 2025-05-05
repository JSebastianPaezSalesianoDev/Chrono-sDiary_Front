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

                <div className="event-popup">
               
                     <div className="time-input">
                        <div className="event-popup-time">Time</div>
                        <input type="number" name="hours" min={0} max={24} className="hours" placeholder="HH"/>
                        <span>:</span>
                        <input type="number" name="minutes" min={0} max={60} className="minutes" placeholder="MM"/>
                    </div>
                    <textarea name="event" id="event" cols={30} rows={5} placeholder="Enter Event Text"></textarea>
                    <button className="event-popup-btn">Add Event</button>
                    <button className="close-event-popup"> <i className='bx bx-x'></i></button>
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