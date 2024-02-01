import { Cookies } from "react-cookie";

const getToken = () => {
  const cookies = new Cookies();
  return cookies.get("token");
};

export default getToken;
