export default function blobToBase64(blob: Blob) {
    return new Promise((resolve: (value: string) => void, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
}
