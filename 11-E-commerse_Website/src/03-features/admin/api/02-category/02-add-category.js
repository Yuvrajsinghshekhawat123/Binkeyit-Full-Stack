import axiosClient from "../01-axiosClient";

export async function addCategory(data) {
  const response = await axiosClient.post("/add-categories", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
