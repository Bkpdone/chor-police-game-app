import axios from "axios";

const BASE_URL = "https://chor-police-game-backend.onrender.com/api/v1/users";

export const getAllUsers = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err;
  }
};