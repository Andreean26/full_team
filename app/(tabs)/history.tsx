import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEvents } from '../../hooks/EventContext';

export default function HistoryScreen() {
  const router = useRouter();
  const { events, fetchEvents } = useEvents();
  const [currentUsername, setCurrentUsername] = useState('');
  const [userEvents, setUserEvents] = useState([]);

  // Ambil username pengguna yang login dan filter event
  useEffect(() => {
    const getUserInfo = async () => {
      const username = await SecureStore.getItemAsync('username');
      setCurrentUsername(username || '');
      
      // Filter event hanya yang dibuat oleh user yang login
      if (username && events.length > 0) {
        const filteredEvents = events.filter(event => event.username === username);
        setUserEvents(filteredEvents);
      }
    };
    
    getUserInfo();
  }, [events]);

  // Fetch events saat komponen dimount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fungsi untuk menghapus event
  const handleDelete = async (eventId: number) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const accessToken = await SecureStore.getItemAsync('accessToken');
              const response = await fetch(`http://178.128.103.81:3002/api/v1/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
              });
              const result = await response.json();
              if (result.success) {
                Alert.alert("Success", "Event deleted successfully.");
                fetchEvents(); // Refresh list
              } else {
                Alert.alert("Error", result.message || "Failed to delete event.");
              }
            } catch (error) {
              Alert.alert("Error", "An error occurred while deleting the event.");
            }
          }
        }
      ]
    );
  };

  const handleEventPress = (event: any) => {
    // Navigasi ke halaman detail dengan data event
    router.push({
      pathname: "/eventDetail/[id]",
      params: {
        id: event.id,
        category: event.Category?.category_name || 'Unknown',
        name: event.event_name,
        time: `${new Date(event.event_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.event_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        location: event.location,
        people: `${event.number_people}`,
        description: event.description,
        imageUrl: event.image_url || 'https://example.com/default-image.jpg',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header dengan gradient */}
      <LinearGradient
        colors={['#6C4AB6', '#8D72E1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerContainer}
      >
        <Text style={styles.title}>Your Event History</Text>
      </LinearGradient>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Cards */}
        <View style={styles.eventList}>
          {userEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>You haven't created any events yet</Text>
              <TouchableOpacity 
                style={styles.createEventButton}
                onPress={() => router.push('/(tabs)/add')}
              >
                <Text style={styles.createEventText}>Create New Event</Text>
              </TouchableOpacity>
            </View>
          ) : (
            userEvents.map((event) => (
              <TouchableOpacity 
                key={event.id}
                style={styles.eventCard}
                onPress={() => handleEventPress(event)}
              >
                {/* Event Image */}
                <Image source={{ uri: event.image_url || 'https://example.com/default-image.jpg' }} style={styles.eventImage} />
                
                {/* Event Content */}
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.event_name}</Text>
                  
                  <Text style={styles.eventTime}>
                    <Ionicons name="time-outline" size={14} color="#6C4AB6" /> {`${new Date(event.event_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.event_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </Text>
                  <Text style={styles.eventLocation}>
                    <Ionicons name="location-outline" size={14} color="#6C4AB6" /> {event.location}
                  </Text>
                  <Text style={styles.eventPeople}>
                    <Ionicons name="people-outline" size={14} color="#6C4AB6" /> {event.number_people} people
                  </Text>
                  
                  {/* Tombol Delete */}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={(e) => {
                      e.stopPropagation(); // Mencegah trigger handleEventPress
                      handleDelete(event.id);
                    }}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  eventList: {
    gap: 16,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 160,
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  eventTime: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  eventPeople: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  createEventButton: {
    backgroundColor: '#6C4AB6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createEventText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#E74C3C',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff', 
    fontWeight: 'bold'
  },
  eventCreator: {
    fontSize: 14,
    color: '#6C4AB6',
    marginBottom: 4,
    fontWeight: '500',
  },
});
