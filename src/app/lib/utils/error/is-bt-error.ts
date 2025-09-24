import axios from "axios";

export const isBtError = (error: any): boolean => {
  if (
    axios.isAxiosError(error) &&
    error.response &&
    error.response.request &&
    error.response.request.host &&
    error.response.request.host === "api.wholesale.bt.com" &&
    error.response.data
  )
    return true;
  else return false;
};
