import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEvents } from '../../hooks/EventContext';

export default function HistoryScreen() {
  const router = useRouter();
  const { events, fetchEvents } = useEvents(); // Ambil events dan fungsi fetchEvents dari context

  useEffect(() => {
    fetchEvents(); // Muat ulang data saat halaman dibuka
  }, []);

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
          {events.length === 0 ? (
            <Text style={styles.emptyText}>No events found.</Text>
          ) : (
            events.map((event) => (
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
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});
