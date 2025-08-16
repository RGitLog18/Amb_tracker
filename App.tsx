// App.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HospitalRegistration from './Components/HospitalRegistration';
import HospitalDashboard from './Components/Hospitaldashboard';

const Stack = createNativeStackNavigator();

const ROLES = [
  { label: 'User', value: 'user' },
  { label: 'Ambulance Driver', value: 'driver' },
  { label: 'Health Care Facility', value: 'facility' },
];

const RoleSelectionScreen = ({ navigation }: any) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showWelcome) {
    return (
      <View style={styles.centered}>
        <Animated.Text style={[styles.welcomeText, { opacity: fadeAnim }]}>
          Welcome to App
        </Animated.Text>
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <Text style={styles.chooseRoleText}>Choose your role:</Text>
      {ROLES.map(role => (
        <TouchableOpacity
          key={role.value}
          style={styles.roleButton}
          onPress={() => {
            if (role.value === 'facility') {
              navigation.navigate('HospitalRegistration');
            } else {
              navigation.navigate('OtherRole', { role: role.label });
            }
          }}
        >
          <Text style={styles.roleButtonText}>{role.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const OtherRoleScreen = ({ route }: any) => {
  return (
    <View style={styles.centered}>
      <Text style={styles.welcomeText}>
        You selected: {route.params.role}
      </Text>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="HospitalRegistration" component={HospitalRegistration} />
        <Stack.Screen name="HospitalDashboard" component={HospitalDashboard} />
        <Stack.Screen name="OtherRole" component={OtherRoleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#b12c2cff',
    marginBottom: 20,
  },
  chooseRoleText: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    color: '#333',
  },
  roleButton: {
    backgroundColor: '#b94141ff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 8,
    minWidth: 220,
    alignItems: 'center',
  },
  roleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});
