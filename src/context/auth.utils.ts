export const authConstants = {
  TOKEN_KEY: 'doit-token',
  DASHBOARD_SUBDOMAIN: 'dashboard'
};

export const authHelpers = {
  // Get the base domain (e.g., "example.com" from "www.example.com")
  getBaseDomain: () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost') return 'localhost';
    
    const parts = hostname.split('.');
    if (parts.length > 2) {
      return parts.slice(-2).join('.');
    }
    return hostname;
  },

  // Check if current domain is a subdomain
  isSubdomain: () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost') return false;
    return hostname.split('.').length > 2;
  },

  // Generate subdomain URL for a specific subdomain
  getSubdomainUrl: (subdomain: string) => {
    const baseDomain = authHelpers.getBaseDomain();
    if (baseDomain === 'localhost') {
      // For local development - use different port or path based on your setup
      return `http://localhost:3000/${subdomain}`;
    } else {
      return `https://${subdomain}.${baseDomain}`;
    }
  }
};
