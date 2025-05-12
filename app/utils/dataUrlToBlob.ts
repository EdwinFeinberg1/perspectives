// dataUrlToBlob.ts
export const dataUrlToBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] ?? 'image/png';
    const binary = atob(arr[1]);
    const len = binary.length;
    const uint8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) uint8[i] = binary.charCodeAt(i);
    return new Blob([uint8], { type: mime });
  };