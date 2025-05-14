import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { authStyles } from '../../styles/authStyles';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (username.trim() && password.trim()) {
      try {
        // Kirim POST request ke login API
        const response = await fetch('http://178.128.103.81:3002/api/v1/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (result.success) {
          // Ambil id dan accessToken dari respons API
          const { id } = result.data.account;
          const { accessToken } = result.data;

          if (Platform.OS === 'web') {
            console.warn('SecureStore is not supported on web');
            localStorage.setItem('userId', id.toString());
            localStorage.setItem('username', username);
            localStorage.setItem('accessToken', accessToken);
          } else {
            await SecureStore.setItemAsync('userId', id.toString());
            await SecureStore.setItemAsync('username', username);
            await SecureStore.setItemAsync('accessToken', accessToken);
          }

          // Navigasi ke halaman utama
          router.replace('/(tabs)');
        } else {
          Alert.alert('Login Error', result.message || 'Login failed');
        }
      } catch (error) {
        if(__DEV__){
         console.error('Error during login:', error); 
        }
        const errorMessage = (error as any)?.message || 'An unexpected error occurred. Please try again later.';
        Alert.alert('Login Error', errorMessage);
      }
    } else {
      Alert.alert('Login Error', 'Please enter username and password');
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={authStyles.keyboardAvoid}
      >
        {/* Header with Logo */}
        <View style={authStyles.header}>
          <Image source={require('../../assets/images/logo1.png')} style={authStyles.logo} />
          <View style={authStyles.headerTextContainer}>
            <Text style={authStyles.headerTitle}>FULL TEAM</Text>
            <Text style={authStyles.headerSubtitle}>Find Your Sports Partner</Text>
          </View>
        </View>

        {/* Login Form */}
        <View style={authStyles.formContainer}>
          <Text style={authStyles.formTitle}>Login</Text>
          <Text style={authStyles.formSubtitle}>Welcome back! Please sign in to continue</Text>

          {/* Username Input */}
          <View style={authStyles.inputGroup}>
            <View style={authStyles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#6C4AB6" style={authStyles.inputIcon} />
              <TextInput
                style={authStyles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
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

          {/* Forgot Password */}
          <TouchableOpacity style={authStyles.forgotPasswordContainer}>
            <Text style={authStyles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity style={authStyles.submitButton} onPress={handleLogin}>
            <LinearGradient
              colors={['#6C4AB6', '#8D72E1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={authStyles.gradientButton}
            >
              <Text style={authStyles.buttonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={authStyles.signupContainer}>
            <Text style={authStyles.signupText}>Dont have an account? </Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text style={authStyles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Social Login */}
          <View style={authStyles.socialContainer}>
            <Text style={authStyles.orText}>Or sign in with</Text>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}