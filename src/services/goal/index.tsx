import axios from "axios";

const apiUrl = "https://645ce732e01ac6105896bbce.mockapi.io";

export const getGoals = async (id: string) => {
  const response = await axios.get(`${apiUrl}/goal/${id}`);
  return response;
};

export const updateGoal = async (data) => {
  const response = await axios.put(`${apiUrl}/goal/${data.id}`, data);
  return response;
};
