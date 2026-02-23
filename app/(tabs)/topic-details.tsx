import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
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
      dispatch(markTopicViewed(topicId));
    }
  }, [topicId, topic]);

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
        <Text>Topic not found!</Text>
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
            <Text style={styles.viewedMessage}>✓ You've viewed this topic</Text>
          </View>
        )}
        
        <Text style={styles.body}>{topic.content}</Text>
        
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>Topic ID: {topic.id}</Text>
          <Text style={styles.metaText}>Source: JSONPlaceholder API</Text>
        </View>
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
  metaContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 5,
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