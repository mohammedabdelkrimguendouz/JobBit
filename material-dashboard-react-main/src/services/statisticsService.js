import axios from "axios";

export const getStatistics = async () => {
  try {
    const response = await axios.get("http://localhost:5174/api/Statistics/GetStatistics");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch Statistics");
  }
};
