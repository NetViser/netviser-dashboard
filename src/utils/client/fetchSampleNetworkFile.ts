export async function fetchSampleNetworkFile(samplefilename: string){
  const response = await fetch(`http://localhost:8000/api/upload?samplefile=${samplefilename}`, {
    method: "POST",
    credentials: "include",
  });

  console.log(`http://localhost:8000/api/upload?samplefile=${samplefilename}`);

  if (!response.ok) {
    const errorMessage = await response.json();
    throw new Error(errorMessage || "Failed to upload file");
  }

  return response.json();
}
