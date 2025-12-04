const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MIN_NAME_LENGTH = 2;
const MIN_COMMENT_LENGTH = 5;
const MIN_AGE = 1;

function validateName(name = '') {
  const value = String(name).trim();
  if (value.length < MIN_NAME_LENGTH) {
    return { valid: false, message: `Імʼя повинно містити щонайменше ${MIN_NAME_LENGTH} символи.` };
  }
  return { valid: true, value };
}

function validateEmail(email = '') {
  const value = String(email).trim();
  if (!EMAIL_REGEX.test(value)) {
    return { valid: false, message: 'Невірний формат email.' };
  }
  return { valid: true, value: value.toLowerCase() };
}

function validateAge(age) {
  const numericAge = Number.parseInt(age, 10);
  if (Number.isNaN(numericAge) || numericAge < MIN_AGE) {
    return { valid: false, message: `Вік має бути числом не меншим за ${MIN_AGE}.` };
  }
  return { valid: true, value: numericAge };
}

function validateComment(comment = '') {
  const value = String(comment).trim();
  if (value.length < MIN_COMMENT_LENGTH) {
    return { valid: false, message: `Коментар повинен містити щонайменше ${MIN_COMMENT_LENGTH} символів.` };
  }
  return { valid: true, value };
}

function validateUserData(payload = {}) {
  const errors = [];

  const name = validateName(payload.name);
  const email = validateEmail(payload.email);
  const age = validateAge(payload.age);
  const comment = validateComment(payload.comment);

  const checks = { name, email, age, comment };

  Object.values(checks).forEach((result) => {
    if (!result.valid) errors.push(result.message);
  });

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0
      ? { name: name.value, email: email.value, age: age.value, comment: comment.value }
      : null,
  };
}

module.exports = {
  validateUserData,
};
