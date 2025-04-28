export const MULTI_UPLOAD_MAX_TOKEN_COUNT = 10;

export const SINGLE_UPLOAD_MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
export const MULTI_UPLOAD_MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024;
export const ANIMATION_UPLOAD_MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

export const SUPPORTED_IMAGE_MIME_TYPES = [
    "image/avif",
    "image/gif",
    "image/jpeg",
    "image/webp",
    "image/png",
    "image/bmp",
    "image/tiff",
    "video/mp4",
    "video/webm",
];

export const SUPPORTED_VALUE_MIME_TYPES = ["image/jpeg", "application/pdf"];

export const SUPPORTED_MODEL_3D_MIME_TYPES = [
    "model/gltf-binary",
    `model/gltf+json`,
];
