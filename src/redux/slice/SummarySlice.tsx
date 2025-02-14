import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



interface summaryState {
    summary: string;
    link: ''
    isLoading: boolean;
    error: string | null;
    isSummaryOpen: boolean;
  }

  const initialState: summaryState = {
    summary: '',
    link: '',
    isLoading: false,
    error: null,
    isSummaryOpen: false
  };

  const API_URL = 'https://wispmall.duckdns.org'

  export const fetchSummary = createAsyncThunk('summary/fetchSummary', async (link:string, { rejectWithValue }) => {
    try{
        const response = await axios.post((`${API_URL}/api/functions/`), {
          link: link  // body에 link 데이터를 포함
        });
        console.log('link확인:',link, '요약데이터확인', response);
        return response.data.data;
    
    } catch (error) {
        return rejectWithValue('요약 뉴스를 불러오는데 실패했습니다.');
    }
  }
);


const summarySlice = createSlice({
    name: 'summary',
    initialState,
    reducers: {
        openSummaryModal: (state) => {
            state.isSummaryOpen = true;
        }, 
        closeSummaryModal: (state) => {
            state.isSummaryOpen = false;
        }
    },

    extraReducers: (builder) => {
        builder
        .addCase(fetchSummary.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(fetchSummary.fulfilled, (state, action) => {
            state.isLoading = false;
            state.summary = action.payload;
          })
          .addCase(fetchSummary.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Failed to fetch summary news data';
          });  
    }
});

export const { openSummaryModal, closeSummaryModal } = summarySlice.actions;
export default summarySlice.reducer;