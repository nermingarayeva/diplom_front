import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Axios interceptor - token-i avtomatik əlavə edir
const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

// Request interceptor - hər sorğuya token əlavə edir
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  sessionStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('token');
      
      
      
      console.error('Authentication failed. Please login again.');
    }
    return Promise.reject(error);
  }
);

export const getAccountsThunk = createAsyncThunk(
  "accounts/get", 
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/accounts");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const postAccountThunk = createAsyncThunk(
  "accounts/post",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/accounts", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAccountThunk = createAsyncThunk(
  "accounts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/accounts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateAccountThunk = createAsyncThunk(
  "accounts/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/accounts/${id}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loginThunk = createAsyncThunk(
  "accounts/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", credentials);
      
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const accountSlice = createSlice({
  name: "accounts",
  initialState: {
    accounts: [],
    loading: false,
    error: null,
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accounts = [];
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('token');
    },
    setAuthFromStorage: (state) => {
      const token = localStorage.getItem('token') || 
                    localStorage.getItem('authToken') || 
                    sessionStorage.getItem('token');
      
      if (token) {
        state.isAuthenticated = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      .addCase(getAccountsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccountsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(getAccountsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(postAccountThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postAccountThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = [...state.accounts, action.payload];
      })
      .addCase(postAccountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(deleteAccountThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccountThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = state.accounts.filter(
          (account) => account._id !== action.payload
        );
      })
      .addCase(deleteAccountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(updateAccountThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccountThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.accounts.findIndex(
          (account) => account._id === action.payload._id
        );
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(updateAccountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logout, setAuthFromStorage } = accountSlice.actions;
export default accountSlice.reducer;