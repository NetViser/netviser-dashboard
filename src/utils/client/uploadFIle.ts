export async function uploadFile(url: string, { arg }: { arg: File }) {
    const formData = new FormData();
    formData.append("file", arg); // 'arg' is the file to upload
  
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  
    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error(errorMessage || "Failed to upload file");
    }
  
    return response.json();
  }
  