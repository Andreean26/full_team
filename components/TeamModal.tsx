import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TeamModalProps = {
  visible: boolean;
  onClose: () => void;
  teamName: string;
  teamDetails: string;
  teamImage: string; // Tambahkan properti untuk gambar tim
};

export function TeamModal({ visible, onClose, teamName, teamDetails, teamImage }: TeamModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Gambar Tim */}
          <Image source={{ uri: teamImage }} style={styles.teamImage} />

          {/* Informasi Tim */}
          <Text style={styles.category}>Football/futsal</Text>
          <Text style={styles.teamName}>{teamName}</Text>
          <Text style={styles.matchTime}>19.00 - 21.00 WIB</Text>
          <Text style={styles.location}>
            <Text style={styles.icon}>📍</Text> SM Futsal
          </Text>
          <Text style={styles.players}>
            <Text style={styles.icon}>👥</Text> 8/20
          </Text>
          <Text style={styles.slotsLeft}>12 slot left*</Text>

          {/* Deskripsi */}
          <Text style={styles.descriptionTitle}>DESCRIPTION</Text>
          <Text style={styles.descriptionText}> Let&apos;s play together!</Text>

          {/* Tombol Register */}
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          {/* Tombol Close */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  teamImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
  },
  category: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6C4AB6',
    marginBottom: 4,
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  matchTime: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  players: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  slotsLeft: {
    fontSize: 12,
    color: '#FF0000',
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: '#6C4AB6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#888',
  },
  icon: {
    fontSize: 14,
    marginRight: 4,
  },
});