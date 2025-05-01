import axiosInstance from "./axiosInstance";

const BASE_URL = "/attraction";

export const getAllAttractions = async () => {
  const res = await axiosInstance.get(`${BASE_URL}/all`);
  return res.data;
};

export const getAttractionsPageable = async (
  pageNumber: number = 0,
  pageSize: number = 4
) => {
  const res = await axiosInstance.get(`${BASE_URL}/getAllPageable`, {
    params: { pageNumber, pageSize },
  });
  return res.data;
};

export const getFilteredAttractions = async (filters: any) => {
  const { name, location, category, priceRange } = filters;
  const minPrice = priceRange[0] === 0 ? 1 : priceRange[0];

  let endpoint = "";
  let params: any = {};

  if (name) {
    endpoint = "/filterByName";
    params = { name };
  } else if (location) {
    endpoint = "/filterByLocation";
    params = { location };
  } else if (category) {
    endpoint = "/filterByCategory";
    params = { category };
  } else if (priceRange) {
    endpoint = "/filterByPriceRange";
    params = { minPrice, maxPrice: priceRange[1] };
  }

  const res = await axiosInstance.get(
    `http://localhost:9090/attraction${endpoint}`,
    { params }
  );
  return res.data;
};

export const getAttractionById = async (id: string) => {
  const res = await axiosInstance.get(
    `http://localhost:9090/attraction/find/${id}`
  );
  return res.data;
};

export const createAttraction = async (attraction: any) => {
  const res = await axiosInstance.post(`${BASE_URL}/add`, attraction);
  return res.data;
};

export const updateAttraction = async (attraction: any) => {
  const res = await axiosInstance.put(
    `${BASE_URL}/update/${attraction.id}`,
    attraction
  );
  return res.data;
};

export const deleteAttraction = async (id: any) => {
  const res = await axiosInstance.delete(`${BASE_URL}/delete/${id}`);
  return res.data;
};
