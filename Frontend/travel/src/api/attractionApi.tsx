import axios from "axios";

const BASE_URL = "http://localhost:9090/attraction";

export const getAllAttractions = async () => {
    const res = await axios.get(`${BASE_URL}/all`);
    return res.data;
};

export const getAttractionsPageable = async (pageNumber: number = 0, pageSize: number = 4) => {
    const res = await axios.get(`${BASE_URL}/getAllPageable`, {
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

    const res = await axios.get(`http://localhost:9090/attraction${endpoint}`, { params });
    return res.data;
};

