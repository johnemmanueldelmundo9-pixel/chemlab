// Password rules shown in the sign up / reset form: 8+ characters, a number and a special character.
export function checkPassword(pw = '') {
  const length = pw.length >= 8;
  const number = /\d/.test(pw);
  const special = /[^A-Za-z0-9\s]/.test(pw);
  return { length, number, special, ok: length && number && special };
}
