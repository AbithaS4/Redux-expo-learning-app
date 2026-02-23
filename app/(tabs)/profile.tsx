import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout, resetProgress, fetchTopics } from '../store/slices/userSlice';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { name, email, viewedTopics, loading } = useAppSelector((state) => state.user);

  const viewedCount = viewedTopics.filter(t => t.viewed).length;
  const totalTopics = viewedTopics.length;
  const progress = totalTopics > 0 ? Math.round((viewedCount / totalTopics) * 100) : 0;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => {
            dispatch(logout());
            router.push('/(tabs)/login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'Reset all your viewed topics?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => dispatch(resetProgress()),
          style: 'destructive',
        },
      ]
    );
  };

  const handleRefresh = () => {
    dispatch(fetchTopics());
    Alert.alert('Refreshing', 'Fetching latest topics from API...');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {name ? name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{viewedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalTopics - viewedCount}</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{progress}%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Learning Progress</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {viewedCount} of {totalTopics} topics completed
        </Text>
      </View>

      {/* API Info Section */}
      <View style={styles.apiSection}>
        <Text style={styles.apiTitle}>📡 API Information</Text>
        <Text style={styles.apiText}>Source: JSONPlaceholder API</Text>
        <Text style={styles.apiText}>Endpoint: /posts?_limit=5</Text>
        <Text style={styles.apiText}>Status: {loading ? 'Loading...' : 'Connected'}</Text>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>
            {loading ? 'Refreshing...' : '🔄 Refresh Topics'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.topicsButton}
          onPress={() => router.push('/(tabs)/topics')}
        >
          <Text style={styles.topicsButtonText}>Continue Learning</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>Reset Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#007AFF',
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#007AFF' },
  name: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  email: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -30,
    marginHorizontal: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#007AFF' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 5 },
  
  progressSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#333' },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: '#28a745' },
  progressText: { marginTop: 10, color: '#666', textAlign: 'center' },
  
  // 👇 NEW: API Section Styles
  apiSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  apiTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#495057' },
  apiText: { fontSize: 13, color: '#6c757d', marginBottom: 5 },
  
  actionsSection: { marginHorizontal: 20 },
  refreshButton: {
    backgroundColor: '#17a2b8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  refreshButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  topicsButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  topicsButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  resetButton: {
    backgroundColor: '#ffc107',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButtonText: { color: '#333', fontSize: 16, fontWeight: '600' },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});