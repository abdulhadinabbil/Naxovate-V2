// URL utilities for professional link handling
export const createProfessionalUrl = (supabaseUrl: string, type: 'image' | 'download' | 'share' = 'image'): string => {
  try {
    // Extract the file path from Supabase URL
    const url = new URL(supabaseUrl);
    const pathParts = url.pathname.split('/');
    
    // Get the bucket and file name
    const bucket = pathParts[pathParts.length - 2];
    const fileName = pathParts[pathParts.length - 1];
    
    // Use the actual deployed domain or localhost for development
    const baseUrl = window.location.origin;
    
    switch (type) {
      case 'image':
        return `${baseUrl}/api/image?id=${fileName}`;
      case 'download':
        return `${baseUrl}/api/download?id=${fileName}`;
      case 'share':
        return `${baseUrl}/api/share?id=${fileName}`;
      default:
        return `${baseUrl}/api/image?id=${fileName}`;
    }
  } catch (error) {
    console.error('Error creating professional URL:', error);
    return supabaseUrl; // Fallback to original URL
  }
};

export const extractFileInfo = (supabaseUrl: string) => {
  try {
    const url = new URL(supabaseUrl);
    const pathParts = url.pathname.split('/');
    
    return {
      bucket: pathParts[pathParts.length - 2],
      fileName: pathParts[pathParts.length - 1],
      originalUrl: supabaseUrl
    };
  } catch (error) {
    console.error('Error extracting file info:', error);
    return null;
  }
};

export const downloadImageFromUrl = async (imageUrl: string, fileName?: string): Promise<void> => {
  try {
    // Use the original Supabase URL for actual download functionality
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate professional filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = fileName || `naxovate-image-${timestamp}.jpg`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download image');
  }
};

// Function to get a shareable URL for copying
export const getShareableUrl = (supabaseUrl: string): string => {
  return createProfessionalUrl(supabaseUrl, 'share');
};

// Function to get a download URL
export const getDownloadUrl = (supabaseUrl: string): string => {
  return createProfessionalUrl(supabaseUrl, 'download');
};

// Function to get a display-friendly URL for UI purposes
export const getDisplayUrl = (supabaseUrl: string): string => {
  try {
    const url = new URL(supabaseUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    
    // Return a branded display version using actual domain
    const baseUrl = window.location.origin;
    return `${baseUrl}/api/image?id=${fileName}`;
  } catch (error) {
    return `${window.location.origin}/api/image?id=naxovate-image`;
  }
};

// Function to get the original Supabase URL for internal use
export const getOriginalUrl = (supabaseUrl: string): string => {
  return supabaseUrl;
};