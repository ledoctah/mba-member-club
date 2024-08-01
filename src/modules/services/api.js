import { AppError } from '../errors/AppError';

const apiConfig = {
  baseURL: 'http://localhost:3333',
};

async function makeRequest(url, method = 'GET') {
  const safeUrl = new URL(url, apiConfig.baseURL);

  const result = await fetch(safeUrl, {
    method,
  });

  if (!result.ok) {
    throw new AppError(result.statusText, result.status);
  }

  return {
    status: result.status,
    headers: result.headers,
    data: await result.json(),
  };
}

export const api = {
  async get(url) {
    return makeRequest(url, 'GET');
  },
};
