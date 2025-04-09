import axios from "axios";

export const getAllJobSeekers = async () => {
  try {
    const response = await axios.get("http://localhost:5174/api/JobSeekers/GetAllJobSeekers");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch companies");
  }
};

export const deleteJobSeeker = async (jobSeekerID) => {
  try {
    const response = await axios.delete(
      `http://localhost:5174/api/JobSeekers/DeleteJobSeeker/${jobSeekerID}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateJobSeekerActivityStatus = async (jobSeekerID, newStatus) => {
  try {
    const response = await axios.put(
      `http://localhost:5174/api/JobSeekers/UpdateJobSeekerActivityStatus/${jobSeekerID},${newStatus}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJobSeekerById = async (JobSeekerID) => {
  try {
    const response = await axios.get(
      `http://localhost:5174/api/JobSeekers/GetJobSeekerByID/${JobSeekerID}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getProfilePicture = (jobSeekerId) => {
  try {
    return axios.get(`http://localhost:5174/api/JobSeekers/GetProfilePicture/${jobSeekerId}`, {
      responseType: "blob",
    });
  } catch (error) {
    throw error;
  }
};
