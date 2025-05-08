import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { Alert, Image, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useEvents } from '../../hooks/EventContext'; // Import useEvents
import { addStyles } from '../../styles/addStyles';

export default function AddScreen() {
  const { addEvent } = useEvents(); // Ambil addEvent dari context
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]); // State untuk daftar kategori
  const [eventName, setEventName] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [people, setPeople] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Fetch categories from API
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://178.128.103.81:3002/api/v1/categories');
        const result = await response.json();
        if (result.success) {
          setCategories(result.data); // Simpan daftar kategori ke state
        } else {
          console.error('Failed to fetch categories:', result.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleStartTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to allow access to your gallery to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const username = await SecureStore.getItemAsync('username');
      if (!accessToken || !username) {
        Alert.alert('Error', 'You are not logged in.');
        return;
      }

      const eventData = {
        username,
        category_id: parseInt(category, 10),
        event_name: eventName,
        event_start_time: startTime.toISOString(),
        event_end_time: endTime.toISOString(),
        location,
        number_people: parseInt(people, 10),
        description,
        image_url: image || 'https://example.com/default-image.jpg',
      };

      const response = await fetch('http://178.128.103.81:3002/api/v1/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      if (result.success) {
        addEvent(result.data); // Tambahkan event baru ke context
        Alert.alert('Success', 'Event created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              setCategory('');
              setEventName('');
              setStartTime(new Date());
              setEndTime(new Date());
              setLocation('');
              setPeople('');
              setDescription('');
              setImage(null);
              router.replace('/(tabs)');
            },
          },
        ]);
      } else {
        // Tangani kasus di mana message adalah array
        const errorMessage = Array.isArray(result.message)
          ? result.message.join(', ') // Gabungkan array menjadi string
          : result.message || 'Failed to create event.';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'An error occurred while creating the event.');
    }
  };

  return (
    <SafeAreaView style={addStyles.container}>
      {/* Header dengan gradient */}
      <LinearGradient
        colors={['#6C4AB6', '#8D72E1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={addStyles.headerContainer}
      >
        <Text style={addStyles.title}>Create New Event</Text>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        contentContainerStyle={addStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Picker */}
        <View style={addStyles.imageSection}>
          {image ? (
            <View style={addStyles.imageContainer}>
              <Image source={{ uri: image }} style={addStyles.imagePreview} />
              <TouchableOpacity style={addStyles.changeImageButton} onPress={pickImage}>
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={addStyles.emptyImageContainer} onPress={pickImage}>
              <View style={addStyles.addImageIconContainer}>
                <Ionicons name="image-outline" size={40} color="#6C4AB6" />
                <Text style={addStyles.addImageText}>Add Event Image</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Form Container */}
        <View style={addStyles.formCard}>
          {/* Dropdown Category */}
          <View style={addStyles.inputGroup}>
            <View style={addStyles.labelContainer}>
              <Ionicons name="list" size={20} color="#6C4AB6" />
              <Text style={addStyles.label}>Category</Text>
            </View>
            <View style={addStyles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={addStyles.picker}
              >
                <Picker.Item label="Select a category" value="" />
                {categories.map((cat) => (
                  <Picker.Item key={cat.id} label={cat.category_name} value={cat.id.toString()} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Input Event Name */}
          <View style={addStyles.inputGroup}>
            <View style={addStyles.labelContainer}>
              <Ionicons name="text" size={20} color="#6C4AB6" />
              <Text style={addStyles.label}>Event Name</Text>
            </View>
            <TextInput
              style={addStyles.input}
              placeholder="Enter event name"
              value={eventName}
              onChangeText={setEventName}
              placeholderTextColor="#999"
            />
          </View>

          {/* Time Pickers */}
          <View style={addStyles.timeSection}>
            <View style={addStyles.labelContainer}>
              <Ionicons name="time" size={20} color="#6C4AB6" />
              <Text style={addStyles.label}>Event Time</Text>
            </View>
            <View style={addStyles.timeRow}>
              {/* Start Time */}
              <View style={addStyles.timePickerContainer}>
                <Text style={addStyles.timeLabel}>Start</Text>
                <TouchableOpacity
                  style={addStyles.timePicker}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Text style={addStyles.timeText}>
                    {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#6C4AB6" />
                </TouchableOpacity>
              </View>

              <Text style={addStyles.timeConnector}>to</Text>

              {/* End Time */}
              <View style={addStyles.timePickerContainer}>
                <Text style={addStyles.timeLabel}>End</Text>
                <TouchableOpacity
                  style={addStyles.timePicker}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Text style={addStyles.timeText}>
                    {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#6C4AB6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Location */}
          <View style={addStyles.inputGroup}>
            <View style={addStyles.labelContainer}>
              <Ionicons name="location" size={20} color="#6C4AB6" />
              <Text style={addStyles.label}>Location</Text>
            </View>
            <TextInput
              style={addStyles.input}
              placeholder="Enter event location"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#999"
            />
          </View>

          {/* Number of People */}
          <View style={addStyles.inputGroup}>
            <View style={addStyles.labelContainer}>
              <Ionicons name="people" size={20} color="#6C4AB6" />
              <Text style={addStyles.label}>Number of People</Text>
            </View>
            <TextInput
              style={addStyles.input}
              placeholder="Enter capacity"
              value={people}
              onChangeText={setPeople}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          {/* Description */}
          <View style={addStyles.inputGroup}>
            <View style={addStyles.labelContainer}>
              <Ionicons name="document-text" size={20} color="#6C4AB6" />
              <Text style={addStyles.label}>Description</Text>
            </View>
            <TextInput
              style={[addStyles.input, addStyles.textArea]}
              placeholder="Enter event description"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={addStyles.submitButton} onPress={handleSubmit}>
          <LinearGradient
            colors={['#6C4AB6', '#8D72E1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={addStyles.gradientButton}
          >
            <Text style={addStyles.buttonText}>Create Event</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Time Pickers (Modals) */}
      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartTimeChange}
        />
      )}
      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndTimeChange}
        />
      )}
    </SafeAreaView>
  );
}