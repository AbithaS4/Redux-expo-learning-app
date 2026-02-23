import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define Topic type
export interface Topic {
  id: number;
  title: string;
  content: string;
  viewed: boolean;
}

// Create async thunk for fetching topics
export const fetchTopics = createAsyncThunk(
  'user/fetchTopics',
  async () => {
    // Using JSONPlaceholder - fake API
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    const data = await response.json();
    
    // Transform API data to match our Topic format
    return data.map((post: any, index: number) => ({
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
  //Loading states
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
        state.viewedTopics = state.userProgress[email];
      }
    },
    
    logout: (state) => {
      if (state.email) {
        state.userProgress[state.email] = state.viewedTopics.map(t => ({ ...t }));
      }
      
      state.name = '';
      state.email = '';
      state.isLoggedIn = false;
      state.viewedTopics = [];
    },
    
    markTopicViewed: (state, action: PayloadAction<number>) => {
      const topicId = action.payload;
      const topic = state.viewedTopics.find(t => t.id === topicId);
      
      if (topic && !topic.viewed) {
        topic.viewed = true;
        
        if (state.email) {
          state.userProgress[state.email] = state.viewedTopics.map(t => ({ ...t }));
        }
      }
    },
    
    resetProgress: (state) => {
      state.viewedTopics = state.viewedTopics.map(t => ({ ...t, viewed: false }));
      if (state.email) {
        state.userProgress[state.email] = state.viewedTopics.map(t => ({ ...t, viewed: false }));
      }
    },
  },
  // Handle async states
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.viewedTopics = action.payload;
        // Save to user progress if logged in
        if (state.email) {
          state.userProgress[state.email] = action.payload;
        }
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch topics';
      });
  },
});

export const { login, logout, markTopicViewed, resetProgress } = userSlice.actions;
export default userSlice.reducer;