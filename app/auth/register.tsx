import { authStyles } from '@/styles/authStyles';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = () => {
    // Validasi dasar
    if (!username.trim()) {
      Alert.alert('Registration Error', 'Please enter a username');
      return;
    }
    
    if (!email.trim()) {
      Alert.alert('Registration Error', 'Please enter an email');
      return;
    }
    
    if (!password.trim()) {
      Alert.alert('Registration Error', 'Please enter a password');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Registration Error', 'Passwords do not match');
      return;
    }

    // Registrasi berhasil - dalam aplikasi nyata akan menyimpan data ke server
    Alert.alert(
      'Registration Successful',
      'Your account has been created successfully',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigasi langsung ke halaman utama
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={authStyles.keyboardAvoid}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Header with Logo */}
          <View style={authStyles.header}>
            <Image source={require('../../assets/images/logo1.png')} style={authStyles.logo} />
            <View style={authStyles.headerTextContainer}>
              <Text style={authStyles.headerTitle}>FULL TEAM</Text>
              <Text style={authStyles.headerSubtitle}>Find Your Sports Partner</Text>
            </View>
          </View>

          {/* Register Form */}
          <View style={authStyles.formContainer}>
            <Text style={authStyles.formTitle}>Create Account</Text>
            <Text style={authStyles.formSubtitle}>Join us and find your perfect team</Text>

            {/* Username Input */}
            <View style={authStyles.inputGroup}>
              <View style={authStyles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#6C4AB6" style={authStyles.inputIcon} />
                <TextInput
                  style={authStyles.input}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={authStyles.inputGroup}>
              <View style={authStyles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#6C4AB6" style={authStyles.inputIcon} />
                <TextInput
                  style={authStyles.input}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={authStyles.inputGroup}>
              <View style={authStyles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#6C4AB6" style={authStyles.inputIcon} />
                <TextInput
                  style={authStyles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={authStyles.inputGroup}>
              <View style={authStyles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#6C4AB6" style={authStyles.inputIcon} />
                <TextInput
                  style={authStyles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity style={authStyles.submitButton} onPress={handleRegister}>
              <LinearGradient
                colors={['#6C4AB6', '#8D72E1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={authStyles.gradientButton}
              >
                <Text style={authStyles.buttonText}>Register</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={authStyles.signupContainer}>
              <Text style={authStyles.signupText}>Already have an account? </Text>
              <Link href="/auth/login" asChild>
                <TouchableOpacity>
                  <Text style={authStyles.signupLink}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Social Register */}
            <View style={authStyles.socialContainer}>
              <Text style={authStyles.orText}>Or sign up with</Text>
              <View style={authStyles.socialButtons}>
                <TouchableOpacity style={authStyles.socialButton}>
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={authStyles.socialButton}>
                  <Ionicons name="logo-facebook" size={20} color="#4267B2" />
                </TouchableOpacity>
                <TouchableOpacity style={authStyles.socialButton}>
                  <Ionicons name="logo-apple" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}