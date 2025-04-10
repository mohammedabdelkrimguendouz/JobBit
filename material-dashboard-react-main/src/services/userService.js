import axios from "axios";

export const loginUser = async (email, password) => {
  try {
    const response = await fetch("http://localhost:5174/api/Auth/LogInUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Email: email,
        Password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (id, Email, Phone, CurrentPassword, Password) => {
  try {
    const res = await axios.put(
      `http://localhost:5174/api/Users/UpdateUser`,
      {
        userID: id,
        email: Email,
        password: Password,
        phone: Phone,
        isActive: true,
        currentPassword: CurrentPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
