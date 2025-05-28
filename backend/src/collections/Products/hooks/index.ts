import { revalidateAfterDelete } from './revalidate';

export const productHooks = {
  afterDelete: [revalidateAfterDelete],
};
