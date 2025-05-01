import { VisitRequest } from "../models/visit/visitRequest";
import axiosInstance from "./axiosInstance";

const BASE_URL = "/visit";

export const getAllVisits = async () => {
  const res = await axiosInstance.get(`${BASE_URL}/all`);
  return res.data;
};

export const getVisitsOfAttraction = async (attractionId: number) => {
  const res = await axiosInstance.get(
    `${BASE_URL}/ofAttraction/${attractionId}`
  );
  return res.data;
};

export const getVisitsOfUser = async (userId: number) => {
  const res = await axiosInstance.get(`${BASE_URL}/ofUser/${userId}`);
  return res.data;
};

export const getVisitOfUserAndAttraction = async (
  attractionId: number,
  userId: number
) => {
  const res = await axiosInstance.get(
    `${BASE_URL}/attractionAndUser/${attractionId}/${userId}`
  );
  return res.data;
};

export const getVisitById = async (id: number) => {
  const res = await axiosInstance.get(`${BASE_URL}/find/${id}`);
  return res.data;
};

export const addVisit = async (visit: VisitRequest) => {
  const res = await axiosInstance.post(`${BASE_URL}/add`, visit);
  return res.data;
};

export const updateVisit = async (id: number, visit: VisitRequest) => {
  const res = await axiosInstance.put(`${BASE_URL}/update/${id}`, visit);
  return res.data;
};

export const deleteVisit = async (id: number) => {
  const res = await axiosInstance.delete(`${BASE_URL}/delete/${id}`);
  return res.data;
};
