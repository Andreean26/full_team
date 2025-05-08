import React, { createContext, useContext, useEffect, useState } from 'react';

const EventContext = createContext(null);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState<{ id: any; message: string }[]>([]); // State untuk notifikasi
  const [loading, setLoading] = useState(true);

  // Fetch events from API
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://178.128.103.81:3002/api/v1/events');
      const result = await response.json();
      if (result.success) {
        setEvents(result.data);
      } else {
        console.error('Failed to fetch events:', result.message);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tambahkan event baru ke state dan buat notifikasi
  const addEvent = (newEvent: any) => {
    setEvents((prevEvents) => [newEvent, ...prevEvents]);
    setNotifications((prevNotifications) => [
      { id: newEvent.id, message: `Event "${newEvent.event_name}" telah ditambahkan.` },
      ...prevNotifications,
    ]);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventContext.Provider value={{ events, notifications, loading, fetchEvents, addEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);