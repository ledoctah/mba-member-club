import { AppError } from '../errors/AppError';

import { api } from './api';

export async function fetchClient({ clientId }) {
  try {
    const foundClient = await api.get(`/clients/${clientId}`);

    return foundClient.data;
  } catch (e) {
    if (e.status === 404) {
      throw new AppError('Client not found', 404);
    }

    // eslint-disable-next-line no-console
    console.error(e);

    throw new AppError('Internal server error', 500);
  }
}
