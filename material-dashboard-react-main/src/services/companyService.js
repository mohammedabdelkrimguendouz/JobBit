import axios from "axios";

export const getAllCompanies = async () => {
  try {
    const response = await axios.get("http://localhost:5174/api/Companies/GetAllCompanies");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch companies");
  }
};

export const deleteCompany = async (companyID) => {
  try {
    const response = await axios.delete(
      `http://localhost:5174/api/Companies/DeleteCompany/${companyID}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCompanyActivityStatus = async (companyID, newStatus) => {
  try {
    const response = await axios.put(
      `http://localhost:5174/api/Companies/UpdateCompanyActivityStatus/${companyID},${newStatus}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCompanyByID = async (companyID) => {
  try {
    const response = await axios.get(
      `http://localhost:5174/api/Companies/GetCompanyByID/${companyID}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
