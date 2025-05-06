import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { TeamModal } from '@/components/TeamModal';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState({ name: '', details: '' });

  const handleCardPress = (teamName: string, teamDetails: string) => {
    setSelectedTeam({ name: teamName, details: teamDetails });
    setModalVisible(true);
  };

  return (
    <>
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

      {/* Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>Walikota Cup 2025</Text>
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinText}>Join Now</Text>
          </TouchableOpacity>
        </View>
        {/* <Image source={require('@/assets/images/soccer.jpg')} style={styles.bannerImage} /> */}
      </View>

      {/* Categories */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.showAll}>Show All</Text>
      </View>

      <View style={styles.categories}>
        {/* make touchable */}
        {/* <TouchableOpacity style={styles.categoryCard}>
          <FontAwesome5 name="basketball-ball" size={24} color="#000" />
          <Text style={styles.categoryText}>Basketball</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.categoryCard}>
          <FontAwesome5 name="futbol" size={24} color="#000" />
          <Text style={styles.categoryText}>Football/Futsal</Text>
        </TouchableOpacity>
        <View style={styles.categoryCard}>
          <FontAwesome5 name="running" size={24} color="#000" />
          <Text style={styles.categoryText}>Run</Text>
        </View>
        <View style={styles.categoryCard}>
          <MaterialIcons name="sports-tennis" size={24} color="#000" />
          <Text style={styles.categoryText}>Tennis</Text>
        </View>
      </View>

      {/* Team Cards */}
      <View style={styles.cardGrid}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress('Informatic FC', 'Match Time: 19.00 - 21.00 WIB\nLocation: SM Futsal\nPlayers: 8/20')}>
            <Image source={require('../../assets/images/futsal.jpg')} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Ionicons name="football" size={16} color="#6C4AB6" />
                <Text style={styles.cardCategory}>Football/Futsal</Text>
              </View>
              <Text style={styles.cardTitle}>Informatic FC</Text>
              <Text style={styles.cardSubtitle}>19.00 - 21.00 WIB</Text>
              <Text style={styles.cardLocation}>
                <Ionicons name="location" size={16} color="#7a6bbc" /> SM Futsal
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardPlayers}>
                  <Ionicons name="people" size={16} color="#7a6bbc" /> 8/20
                </Text>
                <TouchableOpacity style={styles.favoriteButton}>
                  <Ionicons name="heart-outline" size={16} color="#6C4AB6" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => handleCardPress('Fun Basket', 'Match Time: Male, 3 years\nLocation: Almahira Basketball\nPlayers: 10/10')}>
            <Image source={require('../../assets/images/futsal.jpg')} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Ionicons name="basketball" size={16} color="#6C4AB6" />
                <Text style={styles.cardCategory}>Basket</Text>
              </View>
              <Text style={styles.cardTitle}>Fun Basket</Text>
              <Text style={styles.cardSubtitle}>Male, 3 years</Text>
              <Text style={styles.cardLocation}>
                <Ionicons name="location" size={16} color="#7a6bbc" /> Almahira Basketball
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardPlayers}>
                  <Ionicons name="people" size={16} color="#7a6bbc" /> 10/10
                </Text>
                <TouchableOpacity style={styles.favoriteButton}>
                  <Ionicons name="heart-outline" size={16} color="#6C4AB6" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
    </ScrollView>
    {/* Team Modal */}
    <TeamModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        teamName={selectedTeam.name}
        teamDetails={selectedTeam.details}
         teamImage="https://example.com/team-image.jpg"
      />
    </>
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
    gap: 16,
    marginBottom: 32,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flexBasis: '48%',
    marginBottom: 16,
    overflow: 'hidden', // Agar gambar tidak keluar dari kartu
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
});
