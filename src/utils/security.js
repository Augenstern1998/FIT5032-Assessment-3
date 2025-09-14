<<<<<<< HEAD
// Client-side security utilities for XSS prevention and input validation
=======
// Simple client-side helpers to mitigate common XSS in UI bindings.
>>>>>>> 971db2f520855767059a6f2b614d884da8de2979

export function sanitizeText(input) {
  const s = String(input ?? '');
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

<<<<<<< HEAD
export function sanitizeHtml(input) {
  // More comprehensive HTML sanitization
  const s = String(input ?? '');
  return s
    .replaceAll(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replaceAll(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replaceAll(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replaceAll(/<embed\b[^<]*>/gi, '')
    .replaceAll(/javascript:/gi, '')
    .replaceAll(/on\w+\s*=/gi, '');
}

export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(String(email).trim());
}

export function validatePassword(password) {
  const pwd = String(password);
  return {
    isValid: pwd.length >= 6,
    hasMinLength: pwd.length >= 6,
    hasUpperCase: /[A-Z]/.test(pwd),
    hasLowerCase: /[a-z]/.test(pwd),
    hasNumber: /\d/.test(pwd),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
  };
}

export function validateName(name) {
  const n = String(name).trim();
  return {
    isValid: n.length >= 2 && n.length <= 50,
    isAlpha: /^[a-zA-Z\s]+$/.test(n),
    length: n.length
  };
}

export function validateAge(age) {
  const a = Number(age);
  return {
    isValid: Number.isFinite(a) && a >= 16 && a <= 120,
    value: a
  };
}

export function sanitizeInput(input, type = 'text') {
  const s = String(input ?? '').trim();
  
  switch (type) {
    case 'email':
      return s.toLowerCase();
    case 'name':
      return s.replace(/[^a-zA-Z\s]/g, '');
    case 'number':
      return s.replace(/[^0-9.-]/g, '');
    default:
      return sanitizeText(s);
  }
}

export function escapeRegex(input) {
  return String(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default {
  sanitizeText,
  sanitizeHtml,
  validateEmail,
  validatePassword,
  validateName,
  validateAge,
  sanitizeInput,
  escapeRegex,
};

=======
export default { sanitizeText };
>>>>>>> 971db2f520855767059a6f2b614d884da8de2979


