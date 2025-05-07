import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EventDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Extract params
  const { 
    category, 
    name, 
    time, 
    date, 
    location, 
    people, 
    description 
  } = params;

  const handleJoinEvent = () => {
    Alert.alert(
      "Join Event",
      "Are you sure you want to join this event?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Join", 
          onPress: () => {
            Alert.alert("Success", "You have successfully joined this event!");
            router.back();
          }
        }
      ]
    );
  };
  
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
        <Text style={styles.title}>Event Details</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/futsal.jpg')}
            style={styles.eventImage}
            resizeMode="cover"
          />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        </View>

        {/* Event Title and Status */}
        <View style={styles.titleContainer}>
          <Text style={styles.eventName}>{name}</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>

        {/* Event Info Card */}
        <View style={styles.infoCard}>
          {/* Date and Time */}
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar" size={20} color="#6C4AB6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date & Time</Text>
              <Text style={styles.infoValue}>{date}</Text>
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

          {/* Participants */}
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="people" size={20} color="#6C4AB6" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Participants</Text>
              <Text style={styles.infoValue}>{people}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {description || "No description provided for this event."}
          </Text>
        </View>

        {/* Participants List (Preview) */}
        <View style={styles.participantsSection}>
          <Text style={styles.sectionTitle}>Participants</Text>
          <View style={styles.participantsPreview}>
            {/* Dummy participant avatars */}
            {[1, 2, 3, 4, 5].map((item) => (
              <View key={item} style={styles.avatarContainer}>
                <Image 
                  source={{ uri: `https://randomuser.me/api/portraits/men/${20 + item}.jpg` }} 
                  style={styles.avatar} 
                />
              </View>
            ))}
            <View style={[styles.avatarContainer, styles.moreAvatar]}>
              <Text style={styles.moreText}>+3</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.joinButton} onPress={handleJoinEvent}>
          <LinearGradient
            colors={['#6C4AB6', '#8D72E1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.joinButtonText}>Join Event</Text>
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
  placeholder: {
    width: 40,
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
  eventImage: {
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
  eventName: {
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
  joinButton: {
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
  joinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});