import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define Topic type
export interface Topic {
  id: number;
  title: string;
  content: string;
  viewed: boolean;
}

// Define the API response type
interface ApiPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

// Create async thunk for fetching topics
export const fetchTopics = createAsyncThunk<Topic[]>(
  'user/fetchTopics',
  async () => {
    // Using JSONPlaceholder - fake API
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    const data: ApiPost[] = await response.json();
    
    // Transform API data to match our Topic format
    return data.map((post: ApiPost, index: number) => ({
      id: index + 1,
      title: post.title,
      content: post.body,
      viewed: false
    }));
  }
);

export interface UserState {
  name: string;
  email: string;
  isLoggedIn: boolean;
  viewedTopics: Topic[];
  userProgress: {
    [email: string]: Topic[];
  };
  // Loading states
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  name: '',
  email: '',
  isLoggedIn: false,
  viewedTopics: [],
  userProgress: {},
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ name: string; email: string }>) => {
      const { name, email } = action.payload;
      
      state.name = name;
      state.email = email;
      state.isLoggedIn = true;
      
      // Load user's saved progress
      if (state.userProgress[email]) {
        // Create a deep copy to preserve viewed status
        state.viewedTopics = state.userProgress[email].map((topic: Topic) => ({ 
          ...topic, 
          viewed: topic.viewed 
        }));
        console.log(`✅ Loaded ${email}'s progress:`, state.viewedTopics.filter((t: Topic) => t.viewed).length, 'viewed');
      } else {
        console.log(`🆕 New user: ${email}`);
      }
    },
    
    logout: (state) => {
      if (state.email) {
        // Save current progress before logout
        state.userProgress[state.email] = state.viewedTopics.map((topic: Topic) => ({ 
          ...topic, 
          viewed: topic.viewed 
        }));
        console.log(`💾 Saved ${state.email}'s progress:`, state.viewedTopics.filter((t: Topic) => t.viewed).length, 'viewed');
      }
      
      state.name = '';
      state.email = '';
      state.isLoggedIn = false;
      state.viewedTopics = [];
    },
    
    markTopicViewed: (state, action: PayloadAction<number>) => {
      const topicId = action.payload;
      
      // Create a new array with updated topic
      state.viewedTopics = state.viewedTopics.map((topic: Topic) => {
        if (topic.id === topicId && !topic.viewed) {
          return { ...topic, viewed: true };
        }
        return topic;
      });
      
      // Immediately save to userProgress
      if (state.email) {
        state.userProgress[state.email] = state.viewedTopics.map((topic: Topic) => ({ 
          ...topic, 
          viewed: topic.viewed 
        }));
        console.log(`📝 Marked topic ${topicId} viewed for ${state.email}`);
      }
    },
    
    resetProgress: (state) => {
      state.viewedTopics = state.viewedTopics.map((topic: Topic) => ({ ...topic, viewed: false }));
      if (state.email) {
        state.userProgress[state.email] = state.viewedTopics.map((topic: Topic) => ({ ...topic, viewed: false }));
      }
      console.log(`🔄 Reset progress for ${state.email}`);
    },
  },
  // Handle async states
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action: PayloadAction<Topic[]>) => {
        state.loading = false;
        
        // IMPORTANT: Preserve viewed status when fetching new topics
        if (state.email && state.userProgress[state.email]) {
          // User has saved progress - merge with new topics
          const savedTopics = state.userProgress[state.email];
          const newTopics = action.payload;
          
          // Merge: keep viewed status from saved topics
          state.viewedTopics = newTopics.map((newTopic: Topic) => {
            const savedTopic = savedTopics.find((st: Topic) => st.id === newTopic.id);
            if (savedTopic) {
              return { ...newTopic, viewed: savedTopic.viewed };
            }
            return newTopic;
          });
          
          // Update userProgress with merged data
          state.userProgress[state.email] = state.viewedTopics.map((topic: Topic) => ({ ...topic }));
        } else {
          // New user or no saved progress
          state.viewedTopics = action.payload;
          if (state.email) {
            state.userProgress[state.email] = action.payload.map((topic: Topic) => ({ ...topic }));
          }
        }
        
        console.log(`📥 Fetched topics for ${state.email || 'guest'}`);
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch topics';
      });
  },
});

export const { login, logout, markTopicViewed, resetProgress } = userSlice.actions;
export default userSlice.reducer;