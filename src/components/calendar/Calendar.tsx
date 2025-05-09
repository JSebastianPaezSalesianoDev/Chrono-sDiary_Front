import React, { useState, useEffect } from 'react'; 
import "./CalendarApp.css";
import EventModal from '../createEvent/CreateEvent';
import EventList from '../eventList/EvenList';
import EventsService from '../../service/event.service'; 
import { Userinfo } from '../../types/UserInfo'; 


type Event = {
  _id: string; 
  startTime: string;
  endTime: string;
  title: string;
  date: string;

};


const CalendarApp = () => { 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 24));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2025, 6, 24)); 

  const [userEvents, setUserEvents] = useState<Event[]>([]);

  const fetchUserEvents = () => {
    if (!Userinfo.token || !Userinfo.userId) {
      console.error("No hay token o userId en localStorage.");
      setUserEvents([]);
      return;
    }

    EventsService.aGetEventsById(Userinfo.token, Userinfo.userId)
      .then((response) => {
 
        setUserEvents(response.data || []);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setUserEvents([]); 
      });
  };

  
  useEffect(() => {
    fetchUserEvents();
  }, []); 

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEventCreated = () => {
    fetchUserEvents(); 
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
            events={userEvents} 
            refreshEvents={fetchUserEvents} 
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
              const isSelected = selectedDate &&
                                 date.getFullYear() === selectedDate.getFullYear() &&
                                 date.getMonth() === selectedDate.getMonth() &&
                                 date.getDate() === selectedDate.getDate();
              return (
                <span
                  key={day}
                  className={`day-cell ${isSelected ? 'selected-day' : ''}`}
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

      <EventModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onEventCreated={handleEventCreated} 
        selectedCalendarDate={selectedDate} 
      />
    </>
  );
};

export default CalendarApp;