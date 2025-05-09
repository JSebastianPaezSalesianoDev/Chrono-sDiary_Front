import React, { useState } from 'react';
import "./CalendarApp.css";
import EventModal from '../createEvent/CreateEvent'; 
import EventList from '../eventList/EvenList';    

const Calendar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 24)); 
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // <-- nuevo

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); 

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  const currentMonthName = monthNames[month];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const emptyDaysCount = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;
  const emptyDaysArray = Array.from({ length: emptyDaysCount }, (_, i) => `empty-${i}`);

  return (
    <>
      <div className="calendar-app">
        <div className="events-section-container">
          <EventList 
            onOpenCreateModal={openModal}
            selectedDate={selectedDate} 
          />
        </div>
        <div className="calendar-section">
          <div className="calendar-header">
            <h2 className="current-date">{currentMonthName}, {year}</h2>
            <div className="navigation-buttons">
              <button className="nav-button prev" onClick={handlePrevMonth}>
                <i className="bx bx-chevron-left"></i>
              </button>
              <button className="nav-button next" onClick={handleNextMonth}>
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
            {emptyDaysArray.map(key => (
              <span key={key} className="empty-day"></span>
            ))}
            {daysArray.map(day => {
              const date = new Date(year, month, day);
              return (
                <span
                  key={day}
                  className="day-cell"
                  onClick={() => setSelectedDate(date)} 
                  style={{ cursor: "pointer" }}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <EventModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Calendar;
