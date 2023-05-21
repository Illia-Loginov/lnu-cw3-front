const {
  NODE_ENV: env,
  VITE_AUTH_URL: authUrl,
  VITE_MANAGER_URL: managerUrl
} = import.meta.env;

export default {
  env,
  authUrl,
  managerUrl
};
