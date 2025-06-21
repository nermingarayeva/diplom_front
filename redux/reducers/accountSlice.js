import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

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

// Response interceptor - 401 xətasını idarə et
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token müddəti bitibsə, localStorage-ı təmizlə
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      console.error('Authentication failed. Please login again.');
    }
    return Promise.reject(error);
  }
);

// ============= ASYNC THUNKS =============

// Login thunk
export const loginThunk = createAsyncThunk(
  "accounts/login", 
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", credentials);
      
      // Token və user məlumatlarını localStorage-a saxla
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAuthenticated', 'true');
        
        // User məlumatları varsa saxla
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Giriş xətası baş verdi';
      return rejectWithValue(errorMessage);
    }
  }
);

// Get accounts thunk
export const getAccountsThunk = createAsyncThunk(
  "accounts/get", 
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/accounts");
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Hesabları yükləyərkən xəta baş verdi';
      return rejectWithValue(errorMessage);
    }
  }
);

// Post account thunk
export const postAccountThunk = createAsyncThunk(
  "accounts/post", 
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await api.post("/accounts", accountData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Hesab yaradılarkən xəta baş verdi';
      return rejectWithValue(errorMessage);
    }
  }
);

// Update account thunk
export const updateAccountThunk = createAsyncThunk(
  "accounts/update", 
  async ({ id, ...accountData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/accounts/${id}`, accountData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Hesab yenilənərkən xəta baş verdi';
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete account thunk
export const deleteAccountThunk = createAsyncThunk(
  "accounts/delete", 
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/accounts/${id}`);
      return id;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Hesab silinərkən xəta baş verdi';
      return rejectWithValue(errorMessage);
    }
  }
);

// ============= SLICE =============

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
    // Xətanı təmizlə
    clearError: (state) => {
      state.error = null;
    },
    
    // Sistemdən çıxış
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accounts = [];
      state.error = null;
      
      // localStorage-ı təmizlə
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    },
    
    // LocalStorage-dan auth məlumatlarını yüklə
    setAuthFromStorage: (state) => {
      const token = localStorage.getItem('token');
      const isAuth = localStorage.getItem('isAuthenticated');
      const userStr = localStorage.getItem('user');
      
      if (token && isAuth === 'true') {
        state.isAuthenticated = true;
        
        // User məlumatlarını yüklə
        if (userStr) {
          try {
            state.user = JSON.parse(userStr);
          } catch (error) {
            console.error('User parse error:', error);
            // Xətalı məlumat varsa təmizlə
            localStorage.removeItem('user');
          }
        }
      } else {
        state.isAuthenticated = false;
        state.user = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // ========== LOGIN ==========
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || null;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })

      // ========== GET ACCOUNTS ==========
      .addCase(getAccountsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccountsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
        state.error = null;
      })
      .addCase(getAccountsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== POST ACCOUNT ==========
      .addCase(postAccountThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postAccountThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts.push(action.payload);
        state.error = null;
      })
      .addCase(postAccountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== UPDATE ACCOUNT ==========
      .addCase(updateAccountThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccountThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.accounts.findIndex(
          acc => acc._id === action.payload._id || acc.id === action.payload.id
        );
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAccountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========== DELETE ACCOUNT ==========
      .addCase(deleteAccountThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccountThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = state.accounts.filter(
          acc => acc._id !== action.payload && acc.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteAccountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, logout, setAuthFromStorage } = accountSlice.actions;
export default accountSlice.reducer;