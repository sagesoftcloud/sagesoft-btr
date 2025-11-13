/**
 * Generate CloudFront URL for S3 objects
 * @param {string} s3Path - S3 path or URL
 * @returns {string} - CloudFront URL
 */
export const getCloudFrontUrl = (s3Path) => {
  const cloudFrontDomain = process.env.REACT_APP_CLOUDFRONT_DOMAIN;
  
  if (!cloudFrontDomain) {
    console.warn('CloudFront domain not configured, using direct S3 URL');
    return s3Path;
  }
  
  // Remove s3://bucket-name/ prefix if present
  let cleanPath = s3Path;
  if (s3Path.startsWith('s3://')) {
    const pathParts = s3Path.split('/');
    cleanPath = pathParts.slice(3).join('/'); // Remove s3://bucket-name
  }
  
  // Remove leading slash if present
  cleanPath = cleanPath.replace(/^\/+/, '');
  
  return `https://${cloudFrontDomain}/${cleanPath}`;
};

/**
 * Get appropriate icon for file type
 * @param {string} filename - Name of the file
 * @returns {string} - Emoji icon for the file type
 */
export const getFileIcon = (filename) => {
  if (!filename) return '📄';
  
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'xls':
    case 'xlsx':
      return '📊';
    case 'ppt':
    case 'pptx':
      return '📋';
    case 'txt':
      return '📃';
    case 'csv':
      return '📈';
    case 'zip':
    case 'rar':
      return '📦';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return '🖼️';
    default:
      return '📄';
  }
};

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Extract filename from S3 path
 * @param {string} s3Path - S3 path or URL
 * @returns {string} - Filename
 */
export const getFilenameFromPath = (s3Path) => {
  if (!s3Path) return '';
  
  const parts = s3Path.split('/');
  return parts[parts.length - 1] || '';
};

/**
 * Get file extension from filename
 * @param {string} filename - Name of the file
 * @returns {string} - File extension (lowercase)
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

/**
 * Check if file type is supported
 * @param {string} filename - Name of the file
 * @returns {boolean} - True if file type is supported
 */
export const isSupportedFileType = (filename) => {
  const supportedExtensions = [
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'
  ];
  
  const extension = getFileExtension(filename);
  return supportedExtensions.includes(extension);
};

/**
 * Generate download filename with timestamp
 * @param {string} originalFilename - Original filename
 * @returns {string} - Filename with timestamp
 */
export const generateDownloadFilename = (originalFilename) => {
  if (!originalFilename) return 'document.pdf';
  
  const extension = getFileExtension(originalFilename);
  const nameWithoutExt = originalFilename.replace(`.${extension}`, '');
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  
  return `${nameWithoutExt}_${timestamp}.${extension}`;
};

/**
 * Create a download link for a file
 * @param {string} url - File URL
 * @param {string} filename - Desired filename
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'document';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Open file in new tab for preview
 * @param {string} url - File URL
 */
export const previewFile = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Validate S3 path format
 * @param {string} s3Path - S3 path to validate
 * @returns {boolean} - True if valid S3 path
 */
export const isValidS3Path = (s3Path) => {
  if (!s3Path) return false;
  
  // Check for s3:// prefix or direct path
  const s3Regex = /^s3:\/\/[a-z0-9.-]+\/.*$/;
  const pathRegex = /^[a-zA-Z0-9\/._-]+$/;
  
  return s3Regex.test(s3Path) || pathRegex.test(s3Path);
};

/**
 * Extract region from S3 path
 * @param {string} s3Path - S3 path
 * @returns {string|null} - Region number or null
 */
export const getRegionFromPath = (s3Path) => {
  if (!s3Path) return null;
  
  const regionMatch = s3Path.match(/\/region-(\d+)\//);
  return regionMatch ? regionMatch[1] : null;
};

/**
 * Generate S3 path for user's region
 * @param {string} region - Region number
 * @param {string} filename - Filename
 * @returns {string} - S3 path
 */
export const generateS3Path = (region, filename) => {
  const bucket = process.env.REACT_APP_S3_BUCKET || 'treasury-documents';
  return `s3://${bucket}/region-${region}/${filename}`;
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};
