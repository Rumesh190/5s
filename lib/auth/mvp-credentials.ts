const MVP_USERNAME = "admin";
const MVP_PASSWORD = "unicorn";

/** Temporary frontend-only credential check; replace with backend authentication. */
export function validateMvpCredentials(username: string, password: string) {
  return username === MVP_USERNAME && password === MVP_PASSWORD;
}
