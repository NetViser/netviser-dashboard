import { customFetch } from "@/utils/client/fetchClient";

export async function uploadFile(url: string, { arg }: { arg: File }) {
  const formData = new FormData();
  formData.append("file", arg); // 'arg' is the file to upload

  // Use the custom fetch client which includes credentials by default.
  const result = await customFetch(url, {
    method: "POST",
    body: formData,
  });

  return result;
}
