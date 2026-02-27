import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { markTopicViewed } from '../store/slices/userSlice';

export default function TopicDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const topicId = Number(id);
  const { viewedTopics, loading } = useAppSelector((state) => state.user);
  
  const topic = viewedTopics.find(t => t.id === topicId);

  useEffect(() => {
    if (topic && !topic.viewed) {
      // Mark as viewed in Redux
      dispatch(markTopicViewed(topicId));
      
      // Emit event for temporary effects
      DeviceEventEmitter.emit('topicCompleted', {
        id: topic.id,
        title: topic.title
      });
    }
  }, [topicId, topic, dispatch]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!topic) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Topic not found!</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/(tabs)/topics')}
        >
          <Text style={styles.backButtonText}>← Back to Topics</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>{topic.title}</Text>
        
        {topic.viewed && (
          <View style={styles.viewedContainer}>
            <Text style={styles.viewedMessage}>✓ You've completed this topic</Text>
          </View>
        )}
        
        <Text style={styles.body}>{topic.content}</Text>
      </ScrollView>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/(tabs)/topics')}
      >
        <Text style={styles.backButtonText}>← Back to Topics</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  content: { 
    flex: 1, 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 15,
    color: '#333',
  },
  viewedContainer: {
    backgroundColor: '#d4edda',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  viewedMessage: {
    color: '#155724',
    fontSize: 14,
    textAlign: 'center',
  },
  body: { 
    fontSize: 16, 
    lineHeight: 24,
    color: '#444',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  backButton: { 
    backgroundColor: '#6c757d', 
    padding: 15, 
    margin: 20, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  backButtonText: { 
    color: 'white', 
    fontSize: 16,
    fontWeight: '600',
  },
});