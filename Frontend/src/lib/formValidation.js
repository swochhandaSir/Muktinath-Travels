export function validateTextField(
  value,
  label,
  { minLength = 1, required = true } = {},
) {
  const trimmed = value.trim();

  if (!trimmed) {
    return required ? `${label} is required.` : "";
  }

  if (trimmed.length < minLength) {
    return `${label} must be at least ${minLength} characters.`;
  }

  return "";
}

export function validateEmailField(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Email is required.";
  }

  if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
    return "Enter a valid email address.";
  }

  return "";
}

export function validatePhoneField(value, { required = true } = {}) {
  const trimmed = value.trim();

  if (!trimmed) {
    return required ? "Phone is required." : "";
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length !== 10) {
    return "Phone number must be 10 digits.";
  }

  return "";
}

export function validatePositiveIntegerField(value, label) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return `${label} must be a valid number.`;
  }

  return "";
}
