/**
 * Extract user's region from various sources
 * @param {Object} user - Amplify user object
 * @returns {string} - Region number (e.g., "1", "2", "3")
 */
export const getUserRegion = (user) => {
  // Method 1: Extract from user groups (IAM Identity Center)
  if (user.signInUserSession?.accessToken?.payload?.['cognito:groups']) {
    const groups = user.signInUserSession.accessToken.payload['cognito:groups'];
    const regionGroup = groups.find(group => group.match(/region-?\d+/i));
    if (regionGroup) {
      const match = regionGroup.match(/region-?(\d+)/i);
      return match ? match[1] : null;
    }
  }
  
  // Method 2: Extract from custom user attributes
  if (user.attributes?.['custom:region']) {
    return user.attributes['custom:region'];
  }
  
  // Method 3: Extract from username pattern
  const username = user.username || user.attributes?.email || '';
  const usernameMatch = username.match(/region-?(\d+)/i);
  if (usernameMatch) {
    return usernameMatch[1];
  }
  
  // Method 4: Extract from email domain or prefix
  if (user.attributes?.email) {
    const email = user.attributes.email;
    const emailMatch = email.match(/region(\d+)@/i) || email.match(/r(\d+)@/i);
    if (emailMatch) {
      return emailMatch[1];
    }
  }
  
  // Method 5: Check for region in user's preferred_username
  if (user.attributes?.preferred_username) {
    const prefMatch = user.attributes.preferred_username.match(/region-?(\d+)/i);
    if (prefMatch) {
      return prefMatch[1];
    }
  }
  
  // Fallback: Default to region 1 for development
  console.warn('Could not determine user region, defaulting to region 1');
  return '1';
};

/**
 * Get user's full region name
 * @param {Object} user - Amplify user object
 * @returns {string} - Full region name (e.g., "Region 1")
 */
export const getUserRegionName = (user) => {
  const regionNumber = getUserRegion(user);
  return `Region ${regionNumber}`;
};

/**
 * Check if user has admin privileges
 * @param {Object} user - Amplify user object
 * @returns {boolean} - True if user is an admin
 */
export const isUserAdmin = (user) => {
  // Check for admin group membership
  if (user.signInUserSession?.accessToken?.payload?.['cognito:groups']) {
    const groups = user.signInUserSession.accessToken.payload['cognito:groups'];
    return groups.some(group => 
      group.toLowerCase().includes('admin') || 
      group.toLowerCase().includes('administrator')
    );
  }
  
  // Check for admin attribute
  if (user.attributes?.['custom:role']) {
    return user.attributes['custom:role'].toLowerCase().includes('admin');
  }
  
  return false;
};

/**
 * Get user's display name
 * @param {Object} user - Amplify user object
 * @returns {string} - User's display name
 */
export const getUserDisplayName = (user) => {
  // Try different name sources in order of preference
  if (user.attributes?.name) {
    return user.attributes.name;
  }
  
  if (user.attributes?.given_name && user.attributes?.family_name) {
    return `${user.attributes.given_name} ${user.attributes.family_name}`;
  }
  
  if (user.attributes?.preferred_username) {
    return user.attributes.preferred_username;
  }
  
  if (user.attributes?.email) {
    // Extract name part from email
    const emailName = user.attributes.email.split('@')[0];
    return emailName.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  return user.username || 'User';
};

/**
 * Get user's permissions for S3 operations
 * @param {Object} user - Amplify user object
 * @returns {Object} - User permissions object
 */
export const getUserPermissions = (user) => {
  const region = getUserRegion(user);
  const isAdmin = isUserAdmin(user);
  
  return {
    canUpload: isAdmin,
    canDownload: true,
    canView: true,
    canDelete: isAdmin,
    region: region,
    s3Prefix: `region-${region}/`,
    allowedActions: isAdmin 
      ? ['read', 'write', 'delete'] 
      : ['read']
  };
};

/**
 * Validate if user can access a specific document
 * @param {Object} user - Amplify user object
 * @param {string} documentPath - S3 path of the document
 * @returns {boolean} - True if user can access the document
 */
export const canUserAccessDocument = (user, documentPath) => {
  const userRegion = getUserRegion(user);
  const permissions = getUserPermissions(user);
  
  // Check if document is in user's region
  if (documentPath.includes(`/region-${userRegion}/`)) {
    return true;
  }
  
  // Admin users might have cross-region access (future feature)
  if (permissions.canUpload && documentPath.includes('/region-')) {
    // For now, restrict even admins to their region
    return false;
  }
  
  return false;
};

/**
 * Format user information for display
 * @param {Object} user - Amplify user object
 * @returns {Object} - Formatted user information
 */
export const formatUserInfo = (user) => {
  return {
    displayName: getUserDisplayName(user),
    region: getUserRegionName(user),
    isAdmin: isUserAdmin(user),
    email: user.attributes?.email || '',
    username: user.username || '',
    permissions: getUserPermissions(user)
  };
};
