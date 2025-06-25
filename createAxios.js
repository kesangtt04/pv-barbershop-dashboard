import axios from "axios";
import { jwtDecode } from "jwt-decode";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const refreshToken = async (shop) => {
  let rToken = localStorage.getItem("refreshToken");
  try {
    const res = await axios.post(
      `${REACT_APP_BASE_URL}shop/refresh-token`,
      {},
      {
        headers: {
          user: shop?.metadata.shop._id,
          token: rToken,
        },
      }
    );
    localStorage.setItem("refreshToken", res.data.metadata.tokens.refreshToken);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const createAxios = (shop) => {
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwtDecode(shop?.metadata.tokens.accessToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken(shop);
        config.headers["token"] = data.metadata.tokens.refreshToken;
        config.headers["authorization"] = data.metadata.tokens.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return newInstance;
};
