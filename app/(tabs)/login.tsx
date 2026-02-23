import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/slices/userSlice';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Simple validation for demo
    const validUsers = [
      { email: 'john@example.com', password: 'john123', name: 'John' },
      { email: 'jane@example.com', password: 'jane123', name: 'Jane' },
    ];

    const user = validUsers.find(u => u.email === email && u.password === password);

    if (user) {
      dispatch(login({ name: user.name, email: user.email }));
      router.push('/(tabs)/topics');
    } else {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Learning App</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.hint}>
        <Text>Test: john@example.com / john123</Text>
        <Text>jane@example.com / jane123</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold',
     textAlign: 'center',
      marginBottom: 30 
    },
  input: { 
    borderWidth: 1,
     borderColor: '#ddd',
      padding: 12, 
      borderRadius: 8, 
      marginBottom: 15 },
  button: {
     backgroundColor: '#007AFF',
     padding: 15, borderRadius: 8,
      alignItems: 'center' 
    },
  buttonText: { 
    color: 'white', 
    fontSize: 16,
     fontWeight: '600'
     },
  hint: { 
    marginTop: 30,
    alignItems: 'center' },
});