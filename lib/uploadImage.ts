export async function uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch('/api/upload/image', { method: 'POST', body: formData });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");

    return data.url;
}

export async function uploadImageToCloudinaryWithProgress(file: File, onProgress: (percent: number) => void) {
    return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);

        xhr.open('POST', '/api/upload/image');

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                onProgress(percent);
            }
        }

        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                resolve(response.url)
            } else {
                reject(new Error('Upload failed'));
            }
        }

        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(formData);
    })
}