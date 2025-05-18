import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useEvents } from '../../hooks/EventContext'; // Import useEvents

export default function HomeScreen() {
  const { events, loading } = useEvents(); // Ambil events dan loading dari context

  const router = useRouter();

  const handleCardPress = (event: any) => {
    router.push({
      pathname: `/teamDetail/${event.id}`, // ID sudah ada di path, tidak perlu lagi di params
      params: {
        imageUrl: event.image_url || 'https://example.com/default-image.jpg',
        name: event.event_name,
        details: event.description,
        category: event.Category?.category_name || 'Unknown',
        time: `${new Date(event.event_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.event_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        location: event.location,
        people: `${event.number_people}`,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading events...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/logo1.png')} style={styles.logo} />
        <Text style={styles.title}>FULL TEAM</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput placeholder="Search for partner team" style={styles.searchInput} />
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
      </View>

      {/* Team Cards */}
      <View style={styles.cardGrid}>
        {events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.card}
            onPress={() => handleCardPress(event)}
          >
            <Image source={{ uri: event.image_url || 'https://example.com/default-image.jpg' }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Ionicons name="football" size={16} color="#6C4AB6" />
                <Text style={styles.cardCategory}>{event.Category?.category_name || 'Unknown'}</Text>
              </View>
              <Text style={styles.cardTitle}>{event.event_name}</Text>
              <Text style={styles.cardSubtitle}>
                {new Date(event.event_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.event_end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={styles.cardLocation}>
                <Ionicons name="location" size={16} color="#7a6bbc" /> {event.location}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardPlayers}>
                  <Ionicons name="people" size={16} color="#7a6bbc" /> {event.number_people}
                </Text>
                <TouchableOpacity style={styles.favoriteButton}>
                  <Ionicons name="heart-outline" size={16} color="#6C4AB6" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textInfo: {
    flex: 1,
    gap: 4,
  },

  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 50,
    paddingLeft: 50,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8,
    
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6C4AB6',
    flex: 1,
    // centered
    // textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  homeIcon: {
    marginRight: 8,
  },
  searchIcon: {
    marginLeft: 8,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#BFA2DB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  joinButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  joinText: {
    color: '#6C4AB6',
    fontWeight: 'bold',
  },
  bannerImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginLeft: 12,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6C4AB6',
  },
  showAll: {
    fontSize: 14,
    color: '#999',
  },

  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  categoryCard: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    width: '30%',
  },

  categoryText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },

  cardContainer: {
    gap: 16,
    marginBottom: 32,
  },

  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    width: '48%', // Gunakan width tetap sebagai persentase daripada flexBasis
    marginBottom: 16,
    overflow: 'hidden',
  },

  cardImage: {
    width: '100%',
    height: 120,
  },

  cardContent: {
    padding: 12,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  cardCategory: {
    fontSize: 12,
    color: '#6C4AB6',
    marginLeft: 4,
  },

  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 12,
    color: '#555',
    marginBottom: 8,
  },

  cardLocation: {
    fontSize: 12,
    color: '#888',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardPlayers: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7a6bbc',
  },

  favoriteButton: {
    backgroundColor: '#F5F5F5',
    padding: 6,
    borderRadius: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
