const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

/**

 * @param {string} endpoint

 * @param {object} options

 * @returns {Promise<Response>}

 */

/**

 * @param {string} endpoint

 * @param {object} options

 * @returns {Promise<Response>}

 */

export const apiFetch = (endpoint, options = {}) => {
  const ep = typeof endpoint === "string" ? endpoint : String(endpoint || "");

  const normalizedEndpoint = ep.startsWith("/") ? ep : `/${ep}`;

  const base = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  const url = `${base}${normalizedEndpoint}`;

  const token = (() => {
    try {
      return localStorage.getItem("key") || sessionStorage.getItem("key");
    } catch (e) {
      return null;
    }
  })();

  const defaultHeaders = {
    Accept: "application/json",
  };

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchOptions = {
    ...options,

    headers: {
      ...defaultHeaders,

      ...authHeader,

      ...(options.headers || {}),
    },
  };

  return fetch(url, fetchOptions);
};
