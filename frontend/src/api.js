import axios from "axios";

export const NODE_BASE_URL = "https://retech-smart-food-assistant-production.up.railway.app";
export const AI_BASE_URL = NODE_BASE_URL; 


// ======================================================
// 1️⃣ Register User
// ======================================================
export const register = async (userData) => {
  try {
    const response = await axios.post(`${NODE_BASE_URL}/api/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error("❌ Registration failed:", error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.response?.status === 400) {
      throw new Error("Invalid registration data. Please check your inputs.");
    } else {
      throw new Error("Registration failed. Please try again later.");
    }
  }
};

// ======================================================
// 2️⃣ Login User
// ======================================================
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${NODE_BASE_URL}/api/auth/login`, credentials);
    return { data: response.data };
  } catch (error) {
    console.error("❌ Login failed:", error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.response?.status === 400) {
      throw new Error("Invalid email or password. Please try again.");
    } else if (error.response?.status === 404) {
      throw new Error("Account not found. Please register first.");
    } else {
      throw new Error("Login failed. Please try again later.");
    }
  }
};

// ======================================================
// 3️⃣ Scan Food Image (Send to Flask API)
// ======================================================
export const scanFood = async (formData) => {
  try {
    if (!formData.get('file')) {
      throw new Error('No image file provided');
    }

    const response = await axios.post(`${AI_BASE_URL}/predict`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error scanning food:", error);
    if (error.code === "ERR_NETWORK") {
      throw new Error("Cannot connect to AI service. Please ensure the AI server is running.");
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error(error.message || "Failed to scan food. Please try again.");
    }
  }
};

// ======================================================
// 4️⃣ Get Scan History
// ======================================================
export const getHistory = async (token) => {
  try {
    const response = await axios.get(`${NODE_BASE_URL}/api/history`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return { data: response.data };
  } catch (error) {
    console.error("❌ Error fetching history:", error);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.response?.status === 401) {
      throw new Error("Session expired. Please login again.");
    } else {
      throw new Error("Failed to fetch history. Please try again.");
    }
  }
};
