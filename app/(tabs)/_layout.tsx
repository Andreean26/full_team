import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

  // Update dimensions when screen size changes (rotation)
  useEffect(() => {
    const onChange = ({ window }) => {
      setScreenDimensions(window);
    };
    
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription.remove();
  }, []);

  // Calculate safe tab bar height based on platform and insets
  const getTabBarHeight = () => {
    // Base height
    const baseHeight = 58;
    
    if (Platform.OS === 'ios') {
      // Add extra space for iPhone models with home indicator
      const bottomInset = insets.bottom > 0 ? insets.bottom - 10 : 0;
      return baseHeight + bottomInset;
    } else {
      // For Android, add a small padding if needed
      return baseHeight + (insets.bottom > 0 ? insets.bottom - 5 : 0);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#7a6bbc' }} edges={['left', 'right']}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarInactiveTintColor: '',
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: '#7a6bbc',
            height: getTabBarHeight(),
            borderTopWidth: 0,
            shadowColor: 'transparent',
            paddingBottom: Platform.OS === 'ios' 
              ? Math.max(insets.bottom, 10) 
              : Math.max(insets.bottom, 8),
            paddingTop: 5,
            // Ensure content doesn't go under home indicator/navigation bar
            paddingHorizontal: Math.max(insets.left, insets.right, 10),
          },
          tabBarHideOnKeyboard: true,
        }}
      >
        {/* Tab Screens */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="clock.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: '',
            tabBarIcon: ({ focused }) => (
              <View style={[
                styles.addButton,
                { 
                  backgroundColor: focused ? '#fff' : '#fff', 
                  borderWidth: focused ? 2 : 0, 
                  borderColor: '#7a6bbc',
                  bottom: insets.bottom > 0 ? 5 : 0 // Adjust position based on insets
                }
              ]}>
                <View style={styles.innerCircle}>
                  <Text style={styles.addButtonText}>+</Text>
                </View>
              </View>
            ),
            tabBarLabel: () => null,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              router.push('/(tabs)/add');
            }
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            title: 'Notification',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="bell.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person" color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  innerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7a6bbc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 40,
    textAlign: 'center',
  },
});
