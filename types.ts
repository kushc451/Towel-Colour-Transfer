export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
  width: number;
  height: number;
}

export interface ProcessingState {
  isLoading: boolean;
  error: string | null;
  resultImage: string | null; // Base64 or URL
}
