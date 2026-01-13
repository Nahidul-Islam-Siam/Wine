// Configuration
const BASE_URL = process.env.MEDIA_BASE_URL || 'http://206.162.244.168:4200/uploads';

// Check if string is already a URL
const isUrl = (str: string): boolean => {
    return str.startsWith('http://') || str.startsWith('https://');
};

// Sanitize filename to prevent path traversal
const sanitizeFilename = (filename: string): string => {
    return filename.replace(/\.\.\//g, '').replace(/\//g, '');
};

// Convert single filename to URL
export const filenameToUrl = (filename: string): string => {
    if (!filename) return '';
    if (isUrl(filename)) return filename;

    const cleanFilename = sanitizeFilename(filename);
    return `${BASE_URL}/${cleanFilename}`;
};

// Convert array of filenames to URLs
export const filenamesToUrls = (filenames: string[]): string[] => {
    if (!Array.isArray(filenames)) return [];
    return filenames.map(filenameToUrl);
};

// Convert URL back to filename
export const urlToFilename = (url: string): string => {
    if (!url) return '';
    if (!isUrl(url)) return url;

    const parts = url.split('/');
    return parts[parts.length - 1];
};

// Convert URLs back to filenames
export const urlsToFilenames = (urls: string[]): string[] => {
    if (!Array.isArray(urls)) return [];
    return urls.map(urlToFilename);
};