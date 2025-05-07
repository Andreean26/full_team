import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Data dummy untuk history events
const historyEvents = [
  {
    id: '1',
    category: 'Football/Futsal',
    name: 'Informatic FC',
    time: '19.00 - 21.00 WIB',
    date: '12 May 2025', 
    location: 'SM Futsal',
    people: '8/20',
    image: require('../../assets/images/futsal.jpg'),
    icon: 'football',
    description: 'Weekly friendly futsal match for all skill levels. Join us for some fun!'
  },
  {
    id: '2',
    category: 'Basketball',
    name: 'Fun Basket',
    time: '16.00 - 18.00 WIB',
    date: '10 May 2025',
    location: 'Almahira Basketball',
    people: '10/12',
    image: require('../../assets/images/futsal.jpg'),
    icon: 'basketball',
    description: 'Basketball practice session for beginners and intermediates.'
  },
  {
    id: '3',
    category: 'Football/Futsal',
    name: 'Weekend Futsal',
    time: '20.00 - 22.00 WIB',
    date: '8 May 2025',
    location: 'Galaxy Futsal',
    people: '12/14',
    image: require('../../assets/images/futsal.jpg'),
    icon: 'football',
    description: 'Weekend futsal session. All players welcome, any skill level.'
  }
];

export default function HistoryScreen() {
  const router = useRouter();

  const handleEventPress = (event: any) => {
    // Navigasi ke halaman detail dengan data event
    router.push({
      pathname: "/eventDetail/[id]",
      params: {
        id: event.id,
        category: event.category,
        name: event.name,
        time: event.time,
        // date: event.date,
        location: event.location,
        people: event.people,
        description: event.description,
      }
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
        {/* Filter options */}
        {/* <View style={styles.filterContainer}>
          <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
            <Text style={styles.activeFilterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Past</Text>
          </TouchableOpacity>
        </View> */}

        {/* Event Cards */}
        <View style={styles.eventList}>
          {historyEvents.map((event) => (
            <TouchableOpacity 
              key={event.id}
              style={styles.eventCard}
              onPress={() => handleEventPress(event)}
            >
              <Image source={event.image} style={styles.eventImage} />
              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <Ionicons name={event.icon as any} size={16} color="#6C4AB6" />
                  <Text style={styles.eventCategory}>{event.category}</Text>
                </View>
                <Text style={styles.eventTitle}>{event.name}</Text>
                {/* <Text style={styles.eventDate}>{event.date}</Text> */}
                <Text style={styles.eventTime}>{event.time}</Text>
                <Text style={styles.eventLocation}>
                  <Ionicons name="location" size={14} color="#7a6bbc" /> {event.location}
                </Text>
                <View style={styles.eventFooter}>
                  <Text style={styles.eventPeople}>
                    <Ionicons name="people" size={14} color="#7a6bbc" /> {event.people}
                  </Text>
                  <View style={styles.eventStatus}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 + 16 : 16,
    paddingBottom: 16,
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
    marginTop: 30,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeFilter: {
    backgroundColor: '#6C4AB6',
  },
  filterText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventCategory: {
    fontSize: 14,
    color: '#6C4AB6',
    fontWeight: '500',
    marginLeft: 6,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  eventDate: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  eventLocation: {
    fontSize: 14,
    color: '#777',
    marginBottom: 12,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventPeople: {
    fontSize: 14,
    color: '#666',
  },
  eventStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F6E7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
});
