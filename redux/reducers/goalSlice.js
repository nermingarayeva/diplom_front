import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API instance
const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

// Request interceptor - token əlavə et
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============= ASYNC THUNKS =============

// Get goals thunk
export const getGoalsThunk = createAsyncThunk(
  "goals/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/goals");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Məqsədləri yükləyərkən xəta baş verdi';
      return rejectWithValue(errorMessage);
    }
  }
);

// Post goal thunk
export const postGoalThunk = createAsyncThunk(
  "goals/post",
  async (goalData, { rejectWithValue }) => {
    try {
      const response = await api.post("/goals", goalData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Məqsəd yaradılarkən xəta baş verdi';
      return rejectWithValue(errorMessage);
    }
  }
);

// Update goal thunk
export const updateGoalThunk = createAsyncThunk(
  "goals/update",
  async ({ id, ...goalData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/goals/${id}`, goalData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Məqsəd yenilənərkən xəta baş verdi';
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete goal thunk
export const deleteGoalThunk = createAsyncThunk(
  "goals/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/goals/${id}`);
      return id;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Məqsəd silinərkən xəta baş verdi';
      return rejectWithValue(errorMessage);
    }
  }
);

// ============= SLICE =============

const goalSlice = createSlice({
  name: "goals",
  initialState: {
    goals: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Xətanı təmizlə
    clearError: (state) => {
      state.error = null;
    },
    
    // Manual goal əlavə et (əgər lazım olarsa)
    addGoalLocal: (state, action) => {
      state.goals.push(action.payload);
    },
    
    // Manual goal sil (əgər lazım olarsa)
    removeGoalLocal: (state, action) => {
      state.goals = state.goals.filter(goal => goal._id !== action.payload);
    },
    
    // Goals-ları sıfırla
    clearGoals: (state) => {
      state.goals = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // ========== GET GOALS ==========
      .addCase(getGoalsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGoalsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
        state.error = null;
      })
      .addCase(getGoalsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== POST GOAL ==========
      .addCase(postGoalThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postGoalThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.goals.push(action.payload);
        state.error = null;
      })
      .addCase(postGoalThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== UPDATE GOAL ==========
      .addCase(updateGoalThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGoalThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.goals.findIndex(
          goal => goal._id === action.payload._id || goal.id === action.payload.id
        );
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateGoalThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== DELETE GOAL ==========
      .addCase(deleteGoalThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGoalThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = state.goals.filter(
          goal => goal._id !== action.payload && goal.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteGoalThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  addGoalLocal, 
  removeGoalLocal, 
  clearGoals 
} = goalSlice.actions;

export default goalSlice.reducer;