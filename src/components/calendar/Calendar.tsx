import React, { useState } from 'react'; 
import "./CalendarApp.css";
import EventModal from '../createEvent/CreateEvent';

const Calendar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); 

    const currentMonth = "MAY";
    const currentYear = 2024;
    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);


    const openModal = () => {
        setIsModalOpen(true);
    };


    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (

        <>
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

           
                    <button
                        onClick={openModal}
                        style={{ 
                            marginTop: 'auto', 
                            padding: '10px 15px',
                            cursor: 'pointer',
                            backgroundColor: '#90ee90',
                            border: '1px solid #79d679',
                            borderRadius: '5px',
                            fontWeight: 'bold'
                         }}
                    >
                        Create Event
                    </button>
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

            <EventModal isOpen={isModalOpen} onClose={closeModal} />
        </>
    );
};

export default Calendar;