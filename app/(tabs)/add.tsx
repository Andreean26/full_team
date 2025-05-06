import { addStyles } from '../../styles/addStyles';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, Image, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddScreen() {
  const [category, setCategory] = useState('');
  const [eventName, setEventName] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [people, setPeople] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleStartTimeChange: (event: any, selectedTime: Date | undefined) => void = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
    }
  };

  const handleEndTimeChange: (event: any, selectedTime: Date | undefined) => void = (event, selectedTime) => {
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

  const handleSubmit = () => {
    Alert.alert(
      'Event Added',
      `Category: ${category}\nEvent: ${eventName}\nTime: ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\nLocation: ${location}\nPeople: ${people}\nDescription: ${description}`
    );
    // Reset form
    setCategory('');
    setEventName('');
    setStartTime(new Date());
    setEndTime(new Date());
    setLocation('');
    setPeople('');
    setDescription('');
    setImage(null);
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
          {/* Input Category */}
          <View style={addStyles.inputGroup}>
            <View style={addStyles.labelContainer}>
              <Ionicons name="list" size={20} color="#6C4AB6" />
              <Text style={addStyles.label}>Category</Text>
            </View>
            <TextInput
              style={addStyles.input}
              placeholder="Enter category (e.g., Football, Basketball)"
              value={category}
              onChangeText={setCategory}
              placeholderTextColor="#999"
            />
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