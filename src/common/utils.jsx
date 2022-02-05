import axios from 'axios';

const baseUrl = 'http://localhost:3001';

// Import this wherever you make calls to backend.
export default axios.create({
  baseUrl,
  withCredentials: true,
});
