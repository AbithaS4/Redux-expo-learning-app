import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  DeviceEventEmitter,
  Alert,
  Vibration, 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout, fetchTopics } from '../store/slices/userSlice';

// Haptic feedback instead of sound
const welcomeVibration = () => {
  Vibration.vibrate(100); // Vibrate for 100ms
};

export default function TopicsScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { viewedTopics, name, isLoggedIn, loading, error } = useAppSelector((state) => state.user);

  // EVENT HANDLER - Listen for login events
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'userLoggedIn',
      (data) => {
        Alert.alert(
          '👋 Welcome!',
          `Hello ${data.name}! You logged in at ${data.time}`
        );
        
        welcomeVibration();
      }
    );

    return () => subscription.remove();
  }, []);

  // EVENT HANDLER - Listen for topic completion
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'topicCompleted',
      (data) => {
        Alert.alert(
          '🎯 Topic Completed!',
          `You finished "${data.title}". Keep going!`
        );
        
        // Short vibration for completion
        Vibration.vibrate(50);
      }
    );

    return () => subscription.remove();
  }, []);

  // Fetch topics when component mounts or user logs in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchTopics());
    }
  }, [isLoggedIn, dispatch]);

  // Protect route
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/(tabs)/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push('/(tabs)/login');
  };

  const handleRefresh = () => {
    dispatch(fetchTopics());
  };

  const renderTopic = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.topicCard, item.viewed && styles.viewedCard]}
      onPress={() => router.push({
        pathname: '/(tabs)/topic-details',
        params: { id: item.id }
      })}
    >
      <View style={styles.topicHeader}>
        <Text style={styles.topicTitle} numberOfLines={1}>
          {item.title}
        </Text>
        {item.viewed && <Text style={styles.viewedBadge}>✓ Viewed</Text>}
      </View>
      <Text style={styles.topicPreview} numberOfLines={2}>
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  const viewedCount = viewedTopics.filter(t => t.viewed).length;

  // Show loading state
  if (loading && viewedTopics.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading topics...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome, {name}!</Text>
          <Text style={styles.progress}>Progress: {viewedCount}/{viewedTopics.length}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={viewedTopics}
        renderItem={renderTopic}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    marginTop: 10, 
    color: '#666' 
  },
  errorContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20 
  },
  errorText: { 
    color: 'red', 
    fontSize: 16, 
    marginBottom: 20,
    textAlign: 'center' 
  },
  retryButton: { 
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8 
  },
  retryText: { 
    color: 'white', 
    fontSize: 16 
  },
  header: { 
    padding: 20, 
    backgroundColor: 'white', 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  progress: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 5 
  },
  logoutButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#ffebee',
  },
  logout: { 
    color: 'red',
    fontSize: 14,
    fontWeight: '600' 
  },
  list: { 
    padding: 15 
  },
  topicCard: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewedCard: { 
    backgroundColor: '#e8f5e8',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topicTitle: { 
    fontSize: 16, 
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  viewedBadge: { 
    color: '#28a745', 
    fontWeight: 'bold',
    fontSize: 12,
  },
  topicPreview: { 
    fontSize: 14, 
    color: '#666',
    lineHeight: 20,
  },
});