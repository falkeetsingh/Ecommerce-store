import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async({email, password}, {rejectWithValue})=>{
        try{
            const response = await axiosInstance.post('/api/auth/login', {email, password});
            return response.data;
        }catch(error){
            return rejectWithValue(error.response?.data?.message || 'Login failed!'
            )
        }
    }
);
export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async({ name, email, password, profilePhoto }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            if (profilePhoto) formData.append('profilePhoto', profilePhoto);

            const response = await axiosInstance.post('/api/auth/signup', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Signup failed!');
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
      try {
        const res = await axiosInstance.get('/api/auth/me');
        return res.data;
      } catch (err) {
        return rejectWithValue(null);
      }
    }
);
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/api/auth/logout');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const userFromStorage = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: userFromStorage || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logout:(state)=>{
            state.user = null;
        },
        resetSignupSuccess: (state) => {
            state.signupSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // --- signupUser cases ---
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.signupSuccess = false;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.signupSuccess = true;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.signupSuccess = false;
            })
            //logoutUser cases
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.error = null;
                state.loading = false;
                state.signupSuccess = false;
                localStorage.removeItem('user');
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));  
            })
            .addCase(fetchCurrentUser.rejected, (state) => {
                state.user = null;
                localStorage.removeItem('user');
            });
    },
});

export const { logout, resetSignupSuccess } = authSlice.actions;
export default authSlice.reducer;