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

export const addWilaya = async (wilayaName) => {
  try {
    const response = await axios.post("http://localhost:5174/api/Wilayas/AddWilaya", {
      Name: wilayaName,
      WilayaID: -1,
    });
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

export const updateWilaya = async (wilayaID, wilayaName) => {
  try {
    const response = await axios.put("http://localhost:5174/api/Wilayas/UpdateWilaya", {
      WilayaID: wilayaID,
      Name: wilayaName,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};
