import axiosInstance from "./axiosInstance";

export const simulateActivity = async ({
  activityType,
  actorId,
  targetId,
  contentId,
}) => {
  try {
    const response = await axiosInstance.post(
      "/notifications/simulate-activity",
      {
        activityType,
        actorId,
        targetId,
        contentId,
      },
    );

    console.log("Response simulate:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error simulating activity:",
      error.response?.data?.message || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to simulate activity",
    );
  }
};

export const getNotifications = async (userId) => {
  try {
    const response = await axiosInstance.get(`/notifications/${userId}`);

    console.log("Response notifications:", response.data);

    return response.data.notifications;
  } catch (error) {
    console.error(
      "Error fetching notifications:",
      error.response?.data?.message || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch notifications",
    );
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axiosInstance.patch(
      `/notifications/${notificationId}/read`,
      {},
    );

    console.log("Response mark as read:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error marking notification as read:",
      error.response?.data?.message || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to mark notification as read",
    );
  }
};

export const createTestUser = async (username) => {
  try {
    const response = await axiosInstance.post("/users/create-test-user", {
      username,
    });
    console.log("response", response.data);
    return response.data.user;
  } catch (error) {
    console.error(
      "Error creating test user:",
      error.response?.data?.message || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to create test user",
    );
  }
};

export const createTestContent = async (authorId, type, title, body) => {
  try {
    const response = await axiosInstance.post("/content/create-test-content", {
      authorId,
      type,
      title,
      body,
    });

    console.log("content ", response.data);
    return response.data.content;
  } catch (error) {
    console.error(
      "Error creating test content:",
      error.response?.data?.message || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to create test content",
    );
  }
};
