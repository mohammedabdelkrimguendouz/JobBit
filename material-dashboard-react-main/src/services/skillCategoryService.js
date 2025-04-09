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

export const addSkillCategory = async (name) => {
  try {
    const response = await axios.post(
      "http://localhost:5174/api/SkillCategories/AddSkillCategory",
      {
        Name: name,
        skillCategoryID: -1,
      }
    );
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

export const updateSkillCategory = async (iD, name) => {
  try {
    const response = await axios.put(
      "http://localhost:5174/api/SkillCategories/updateSkillCategory",
      {
        skillCategoryID: iD,
        Name: name,
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};
