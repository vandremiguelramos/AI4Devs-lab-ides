export const SECURITY_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3010',
};

export const PRIVACY_POLICY = {
  DATA_RETENTION_PERIOD: '90 days',
  ALLOWED_DOMAINS: ['yourcompany.com'],
  REQUIRED_CONSENT: true,
};

export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailPattern.test(email) && PRIVACY_POLICY.ALLOWED_DOMAINS.some(domain => email.endsWith(domain));
};

export const validatePassword = (password: string): boolean => {
  return SECURITY_CONFIG.PASSWORD_PATTERN.test(password);
};

export const sanitizePhoneNumber = (phone: string): string => {
  return phone.replace(/[^\d+\s-]/g, '');
};

export const maskSensitiveData = (data: string): string => {
  return data.slice(0, 2) + '*'.repeat(data.length - 4) + data.slice(-2);
};

export const isFileSecure = (file: File): boolean => {
  return (
    SECURITY_CONFIG.ALLOWED_FILE_TYPES.includes(file.type) &&
    file.size <= SECURITY_CONFIG.MAX_FILE_SIZE
  );
}; 