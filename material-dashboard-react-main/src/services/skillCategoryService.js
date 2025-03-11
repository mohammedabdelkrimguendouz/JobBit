import axios from "axios";

export const getAllSkillCategories = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5174/api/SkillCategories/GetAllSkillCategories"
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch Wilayas");
  }
};

export const deleteSkillCategory = async (SkillCategoryID) => {
  try {
    const response = await axios.delete(
      `http://localhost:5174/api/SkillCategories/DeleteSkillCategory/${SkillCategoryID}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
