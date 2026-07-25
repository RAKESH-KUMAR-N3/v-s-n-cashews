import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary server-side SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'vsn-cashews',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export { cloudinary };

/**
 * Transforms Cloudinary Image URL to square webp crop with Royal framing
 */
export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options: { width?: number; height?: number; quality?: number } = {}
): string {
  if (!publicIdOrUrl) return 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=800';

  if (publicIdOrUrl.startsWith('http://') || publicIdOrUrl.startsWith('https://')) {
    return publicIdOrUrl;
  }

  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'vsn-cashews';
  const width = options.width || 800;
  const height = options.height || 800;
  const quality = options.quality || 85;

  return `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,g_auto,w_${width},h_${height},q_${quality},f_auto/${publicIdOrUrl}`;
}
