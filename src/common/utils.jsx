import axios from 'axios';

const baseURL = 'http://localhost:3001';

// Import this wherever you make calls to backend.
export default axios.create({
  baseURL,
  withCredentials: true,
});
