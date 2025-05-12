import axios from "axios";

const BASE_URL = "http://localhost:7000/api/v1/vehicles";

export const getAllVehicles = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    throw err;
  }
};

export const assignUserToVehicle = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/assign`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error assigning user to vehicle:", err);
    throw err;
  }
};
