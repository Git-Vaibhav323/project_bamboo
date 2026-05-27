import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const defaultOptions = {
    maxSizeMB: 1, // Maximum file size in MB
    maxWidthOrHeight: 1920, // Maximum width or height
    useWebWorker: true,
    fileType: 'image/jpeg',
    ...options,
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}

export async function uploadImageToSupabase(
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  const { supabase } = await import('./supabase');

  if (!supabase) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
  }
  
  // Compress the image first
  const compressedFile = await compressImage(file);
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, compressedFile, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}
