export const getFileName = async () => {
    // wait 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await fetch('http://localhost:8000/api/get-file-name', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });


    if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage || 'Failed to get file name');
    }

    return response.json();
}