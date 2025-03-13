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
