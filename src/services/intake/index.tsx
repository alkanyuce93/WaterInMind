import axios from "axios";
import { UsersType } from "../../interface/enum";

const apiUrl = "https://645ce732e01ac6105896bbce.mockapi.io";

export const getIntakes = async () => {
  const response = await axios.get(`${apiUrl}/intake`);
  return response;
};

export const getIntake = async (id: string) => {
  const response = await axios.get(`${apiUrl}/intake/${id}`);
  return response;
};

export const createIntake = async (data: UsersType) => {
  const response = await axios.post(`${apiUrl}/intake`, data);
  return response;
};

export const updateIntake = async (data: UsersType) => {
  const response = await axios.put(`${apiUrl}/intake/${data.id}`, data);
  return response;
};

export const deleteIntake = async (id: string) => {
  const response = await axios.delete(`${apiUrl}/intake/${id}`);
  return response;
};
