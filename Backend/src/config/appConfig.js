import { config } from "dotenv";
config();

const appconfig = {
  URI: process.env.DATABASE_URI,
  PORT: process.env.PORT,
  REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  WEATHER_API_KEY: process.env.WEATHER_API_KEY,
  DATA_API_KEY: process.env.DATA_API_KEY,
  EMAILJS_USER_ID: process.env.EMAILJS_USER_ID,
  EMAILJS_USER_SECRET: process.env.EMAILJS_USER_SECRET,
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
};

export default appconfig;
