import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch } from './../store/hooks';
import { login } from './../store/slices/userSlice';

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
      // EMIT EVENT for temporary effects
      DeviceEventEmitter.emit('userLoggedIn', {
        name: user.name,
        time: new Date().toLocaleTimeString()
      });
      
      //  REDUX for permanent storage
      dispatch(login({ name: user.name, email: user.email }));
      
      router.replace('/(tabs)/topics');
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
        keyboardType="email-address"
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
        <Text style={styles.hintText}>Test Accounts:</Text>
        <Text style={styles.hintText}>john@example.com / john123</Text>
        <Text style={styles.hintText}>jane@example.com / jane123</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 30,
    color: '#333',
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 15,
    backgroundColor: 'white',
    fontSize: 16,
  },
  button: { 
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: '600' 
  },
  hint: { 
    marginTop: 30, 
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  hintText: {
    fontSize: 14,
    color: '#2e7d32',
    marginVertical: 2,
  },
});