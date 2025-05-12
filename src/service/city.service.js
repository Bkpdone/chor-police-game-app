import axios from "axios";

const BASE_URL = "https://chor-police-game-backend.onrender.com/api/v1/cities";

export const getAllCities = async () => {
  try {
    const res = await axios.get(BASE_URL);

    return res.data;
  } catch (err) {
    console.error("Error fetching cities:", err);
    throw err;
  }
};

export const assignUserToCity = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/assign`, data);
    return res.data;
  } catch (err) {
    console.error("Error assigning user to city:", err);
    throw err;
  }
};

export const setThiefRandomly = async () => {
  try {
    const res2 = await axios.post(`${BASE_URL}/rest-all`);
    const res1 = await axios.post(`${BASE_URL}/thief`);
    
    return { res1: res1.data, res2: res2.data };
  } catch (err) {
    console.error("Error setting thief randomly:", err);
    throw err;
  }
};



