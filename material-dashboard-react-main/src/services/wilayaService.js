import axios from "axios";

export const getAllWilayas = async () => {
  try {
    const response = await axios.get("http://localhost:5174/api/Wilayas/GetAllWilayas");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch Wilayas");
  }
};

export const deleteWilaya = async (WilayaID) => {
  try {
    const response = await axios.delete(
      `http://localhost:5174/api/Wilayas/DeleteWilaya/${WilayaID}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
