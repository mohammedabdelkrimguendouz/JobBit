import axios from "axios";

export const getAllSkills = async () => {
  try {
    const response = await axios.get("http://localhost:5174/api/Skills/GetAllSkills");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch Skills");
  }
};

export const deleteSkill = async (SkillID) => {
  try {
    const response = await axios.delete(`http://localhost:5174/api/Skills/DeleteSkill/${SkillID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addSkill = async (categoryID, Name, IconUrl) => {
  try {
    const response = await axios.post("http://localhost:5174/api/Skills/AddSkill", {
      skillID: -1,
      skillCategoryID: categoryID,
      name: Name,
      iconUrl: IconUrl,
    });
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

export const updateSkill = async (SkillID, categoryID, Name, IconUrl) => {
  try {
    const response = await axios.put("http://localhost:5174/api/Skills/UpdateSkill", {
      skillID: SkillID,
      skillCategoryID: categoryID,
      name: Name,
      iconUrl: IconUrl,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};
