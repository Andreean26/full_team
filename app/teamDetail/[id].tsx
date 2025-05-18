import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TeamDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  console.log('Received params:', params);

  // Extract params
  const { 
    id,
    category, 
    name, 
    time, 
    location, 
    people,
    imageUrl, // Tetap ambil imageUrl dari params untuk fallback
    details
  } = params;

  const [isFavorite, setIsFavorite] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(true); // Tambahkan loading state
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false); // Tambahkan state ini di bagian atas komponen

  // Tambahkan state untuk price
  const [priceInfo, setPriceInfo] = useState<{ price?: number; price_per_person?: number }>({});

  // Pastikan id berupa string angka, lalu parse ke integer jika perlu
  const eventId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : '';

  // Fetch event data from API
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`http://178.128.103.81:3002/api/v1/events/${eventId}`);
        const result = await response.json();

        if (result.success) {
          setEventData(result.data);
        }
      } catch (error) {
        // handle error
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  // Fetch price info
  useEffect(() => {
    const fetchPrice = async () => {
      if (!eventId) return;
      try {
        const res = await fetch(`http://178.128.103.81:3002/api/v1/events/${eventId}/price`);
        const data = await res.json();
        // console.log('Price API result:', data);
        setPriceInfo({
          price: data.data?.price,
          price_per_person: data.data?.price_per_person,
        });
      } catch (e) {
        setPriceInfo({});
      }
    };
    fetchPrice();
  }, [eventId]);

  // Define fetchParticipants outside useEffect so it can be called elsewhere
  const fetchParticipants = async () => {
    if (!eventId) return;
    
    setIsLoadingParticipants(true);
    console.log('Fetching participants for event ID:', eventId);
    
    try {
      // Tambahkan timestamp untuk menghindari cache
      const res = await fetch(`http://178.128.103.81:3002/api/v1/participants?event_id=${eventId}&_t=${new Date().getTime()}`);
      const data = await res.json();
      console.log('API Response participants:', data);
      
      if (data.success) {
        // Pastikan hanya participants untuk event ini yang disimpan
        const eventParticipants = data.data.filter(p => p.event_id.toString() === eventId.toString());
        setParticipants(eventParticipants || []);
        console.log('Filtered participants for event', eventId, eventParticipants);
      } else {
        setParticipants([]);
      }
    } catch (e) {
      console.error('Error fetching participants:', e);
      setParticipants([]);
    } finally {
      setIsLoadingParticipants(false);
    }
  };

  // Fetch participants
  useEffect(() => {
    // Tambahkan logging
    console.log('Effect triggered with eventId:', eventId);
    
    // Reset participants saat ID berubah (penting!)
    setParticipants([]);
    
    if (eventId) {
      fetchParticipants();
    }
    
    // Tambahkan cleanup function untuk mencegah race condition
    return () => {
      console.log('Cleaning up effect for eventId:', eventId);
      // Ini membantu jika navigasi cepat antar event
    };
  }, [eventId]);

  // Log participants setiap kali berubah
  useEffect(() => {
    console.log('Participants for event', eventId, participants);
  }, [eventId, participants]);

  // Tambahkan fungsi untuk cek status registrasi
  const checkRegistrationStatus = async () => {
    try {
      const userId = await SecureStore.getItemAsync('userId');
      if (!userId || !eventId) return;
      
      console.log('Checking registration status for user', userId, 'in event', eventId);
      
      // Ambil data participants dari API
      const res = await fetch(`http://178.128.103.81:3002/api/v1/participants?event_id=${eventId}`);
      const data = await res.json();
      
      if (data.success && Array.isArray(data.data)) {
        // Cari apakah ada participant dengan account_id yang sama
        const isRegistered = data.data.some(p => 
          p.account_id.toString() === userId.toString()
        );
        
        console.log('User registration status:', isRegistered ? 'Already registered' : 'Not registered');
        setIsAlreadyRegistered(isRegistered);
      }
    } catch (e) {
      console.error('Error checking registration status:', e);
    }
  };

  // Panggil checkRegistrationStatus setiap kali participants berubah atau komponen pertama kali load
  useEffect(() => {
    if (eventId) {
      checkRegistrationStatus();
    }
  }, [eventId, participants]);

  const handleRegisterTeam = async () => {
    // Jika sudah terdaftar, jangan lanjutkan
    if (isAlreadyRegistered) {
      Alert.alert('Info', 'You are already registered for this event!');
      return;
    }
    
    // Log eventId saat register untuk debugging
    console.log('Registering for event with ID:', eventId);
    
    Alert.alert(
      "Register for Team",
      "Are you sure you want to register for this team?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Register", 
          onPress: async () => {
            try {
              const accessToken = await SecureStore.getItemAsync('accessToken');
              const userId = await SecureStore.getItemAsync('userId');
              const username = await SecureStore.getItemAsync('username');

              if (!accessToken || !userId) {
                Alert.alert('Error', 'You need to login first');
                return;
              }

              // Gunakan eventId yang sudah diparse
              const participantData = {
                account_id: parseInt(userId, 10),
                event_id: parseInt(eventId, 10),
                participant_name: username || "User"
              };

              console.log('Data yang dikirim ke API participants:', participantData);

              const response = await fetch('http://178.128.103.81:3002/api/v1/participants', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(participantData)
              });

              const result = await response.json();
              console.log('Response dari API participants:', result);

              if (result.success) {
                Alert.alert("Success", "You have successfully registered for this team!");
                // Re-fetch participants untuk update
                fetchParticipants();
              } else {
                const errorMessage = Array.isArray(result.message)
                  ? result.message.join(', ')
                  : result.message || 'Failed to register for team';
                Alert.alert('Error', errorMessage);
              }
            } catch (error) {
              console.error('Error registering for team:', error);
              Alert.alert('Error', 'An error occurred while registering for the team');
            }
          }
        }
      ]
    );
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? "Removed from Favorites" : "Added to Favorites",
      isFavorite ? "This team has been removed from your favorites" : "This team has been added to your favorites"
    );
  };
  
  // Tambahkan fungsi ini di dalam komponen TeamDetailScreen
  const calculateSlots = (peopleStr: string | string[]) => {
    if (typeof peopleStr === 'string' && peopleStr.includes('/')) {
      const [filled, total] = peopleStr.split('/').map(num => parseInt(num.trim(), 10));
      const remaining = total - filled;
      
      if (remaining > 0) {
        return `• ${remaining} slot${remaining > 1 ? 's' : ''} left`;
      } else if (remaining === 0) {
        return '• Full';
      }
    }
    return '';
  };

  // Tentukan image URL yang akan digunakan
  const displayImageUrl = eventData?.image_url || imageUrl || 'https://example.com/default-image.jpg';
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      
      {/* Header with gradient */}
      <LinearGradient
        colors={['#6C4AB6', '#8D72E1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerContainer}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Team Details</Text>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Team Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: displayImageUrl }}
            style={styles.teamImage}
            resizeMode="cover"
          />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{eventData?.Category?.category_name || category}</Text>
          </View>
        </View>

        {/* Team Title and Status */}
        <View style={styles.titleContainer}>
          <Text style={styles.teamName}>{name}</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>

        {/* Team Info Card */}
        <View style={styles.infoCard}>
          {/* Time */}
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="time" size={20} color="#6C4AB6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Match Time</Text>
              <Text style={styles.infoValue}>{time}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Location */}
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={20} color="#6C4AB6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{location}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Tambahkan Price */}
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="pricetag" size={20} color="#6C4AB6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Total Price</Text>
              <Text style={styles.infoValue}>
                {priceInfo.price != null
                  ? `Rp ${Number(priceInfo.price).toLocaleString('id-ID')}`
                  : 'Memuat...'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Tambahkan Price Per Person */}
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="cash" size={20} color="#6C4AB6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Price per Person</Text>
              <Text style={styles.infoValue}>
                {priceInfo.price_per_person != null
                  ? `Rp ${Number(priceInfo.price_per_person).toLocaleString('id-ID')}`
                  : 'Memuat...'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Participants */}
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="people" size={20} color="#6C4AB6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Participants</Text>
              {isLoadingParticipants ? (
                <Text style={styles.infoValue}>Loading participants...</Text>
              ) : (
                <>
                  <Text style={styles.infoValue}>
                    {participants.length} / {typeof people === 'string' ? people : people} joined
                  </Text>
                  {/* List participant names */}
                  {participants.length > 0 && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
                      {participants.map((p, idx) => (
                        <Text 
                          key={`${eventId}-${p.id || idx}`} 
                          style={{ marginRight: 8, color: '#6C4AB6', fontSize: 13 }}
                        >
                          {p.participant_name}
                        </Text>
                      ))}
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {details || "Let's play together! Join our team for regular practice matches and improve your skills in a friendly environment."}
          </Text>
        </View>

        {/* Participants Preview */}
        <View style={styles.participantsSection}>
          <Text style={styles.sectionTitle}>Participants</Text>
          {isLoadingParticipants ? (
            <Text>Loading participants...</Text>
          ) : (
            <View style={styles.participantsPreview}>
              {participants.length > 0 ? (
                participants.slice(0, 3).map((participant) => (
                  <View key={`preview-${eventId}-${participant.id}`} style={styles.avatarContainer}>
                    <Image 
                      source={{ uri: participant.account?.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(participant.participant_name) }}
                      style={styles.avatar}
                    />
                  </View>
                ))
              ) : (
                <Text style={styles.infoValue}>No participants yet</Text>
              )}
              
              {participants.length > 3 && (
                <View style={styles.moreAvatar}>
                  <Text style={styles.moreText}>+{participants.length - 3}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Team Schedule */}
        {/* <View style={styles.scheduleContainer}>
          <Text style={styles.sectionTitle}>Upcoming Matches</Text>
          
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleDate}>
              <Text style={styles.scheduleDay}>15</Text>
              <Text style={styles.scheduleMonth}>MAY</Text>
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleTitle}>Regular Practice Match</Text>
              <Text style={styles.scheduleTime}>
                <Ionicons name="time-outline" size={14} color="#6C4AB6" /> 19:00 - 21:00
              </Text>
              <Text style={styles.scheduleLocation}>
                <Ionicons name="location-outline" size={14} color="#6C4AB6" /> {location}
              </Text>
            </View>
          </View>
          
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleDate}>
              <Text style={styles.scheduleDay}>22</Text>
              <Text style={styles.scheduleMonth}>MAY</Text>
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleTitle}>Friendly Match vs. Galaxy FC</Text>
              <Text style={styles.scheduleTime}>
                <Ionicons name="time-outline" size={14} color="#6C4AB6" /> 20:00 - 22:00
              </Text>
              <Text style={styles.scheduleLocation}>
                <Ionicons name="location-outline" size={14} color="#6C4AB6" /> {location}
              </Text>
            </View>
          </View>
        </View> */}
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={[styles.registerButton, isAlreadyRegistered && styles.alreadyRegisteredButton]} 
          onPress={isAlreadyRegistered ? () => Alert.alert('Info', 'You are already registered for this event!') : handleRegisterTeam}
          disabled={isAlreadyRegistered}
        >
          <LinearGradient
            colors={isAlreadyRegistered ? ['#9E9E9E', '#BDBDBD'] : ['#6C4AB6', '#8D72E1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.registerButtonText}>
              {isAlreadyRegistered ? 'Already Registered' : 'Register'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 100,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  favoriteButton: {
    padding: 8,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  teamImage: {
    width: '100%',
    height: 200,
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(108, 74, 182, 0.9)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F6E7',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108, 74, 182, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginTop: 8,
    width: '100%',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#6C4AB6',
    borderRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 56,
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#555',
  },
  participantsSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  },
  participantsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: -10,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  moreAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C4AB6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  scheduleContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  },
  scheduleCard: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scheduleDate: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'rgba(108, 74, 182, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scheduleDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C4AB6',
  },
  scheduleMonth: {
    fontSize: 12,
    color: '#6C4AB6',
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  scheduleLocation: {
    fontSize: 14,
    color: '#888',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradientButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playersInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  slotsText: {
    fontSize: 13,
    color: '#6C4AB6',
    marginLeft: 8,
    fontWeight: '500',
  },
  alreadyRegisteredButton: {
    backgroundColor: '#9E9E9E',
    opacity: 0.8,
  },
});