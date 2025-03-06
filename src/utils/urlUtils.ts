/**
 * Formats a URL by adding protocol and TLD if missing
 * @param url The URL to format
 * @returns Properly formatted URL
 */
export const formatUrl = (url: string): string => {
  let formattedUrl = url.trim();
  
  // Remove any leading/trailing whitespace
  formattedUrl = formattedUrl.trim();
  
  // Add https:// if no protocol is specified
  if (!formattedUrl.match(/^[a-zA-Z]+:\/\//)) {
    formattedUrl = `https://${formattedUrl}`;
  }
  
  // Add .com if no TLD is specified
  try {
    const urlObj = new URL(formattedUrl);
    if (!urlObj.hostname.includes('.')) {
      formattedUrl = formattedUrl.replace(urlObj.hostname, `${urlObj.hostname}.com`);
    }
  } catch (e) {
    // If URL parsing fails, just return the input
    console.error('Error parsing URL:', e);
  }
  
  return formattedUrl;
};

/**
 * Validates if a string is a valid URL
 * @param url The URL to validate
 * @returns Boolean indicating if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Extracts the domain name from a URL
 * @param url The URL to extract domain from
 * @returns Domain name
 */
export const getDomainName = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (e) {
    // If URL parsing fails, try to extract domain using regex
    const domainMatch = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/i);
    if (domainMatch && domainMatch[1]) {
      return domainMatch[1].replace('www.', '');
    }
    return url;
  }
};

/**
 * Extracts the website ID from a URL
 * @param url The URL to extract ID from
 * @returns Website ID (domain name without TLD)
 */
export const getWebsiteId = (url: string): string => {
  try {
    const domain = getDomainName(url);
    // Extract the main domain without TLD
    const parts = domain.split('.');
    if (parts.length >= 2) {
      return parts[parts.length - 2];
    }
    return domain;
  } catch (e) {
    // If parsing fails, return a sanitized version of the URL
    return url.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }
};
