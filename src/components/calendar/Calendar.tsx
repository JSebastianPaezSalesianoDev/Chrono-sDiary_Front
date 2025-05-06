import React, { useState } from 'react';
import "./CalendarApp.css"; 
import EventModal from '../createEvent/CreateEvent';
import EventList from '../eventList/EvenList';

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
                <div className="events-section-container"> 
                   <EventList onOpenCreateModal={openModal} />
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