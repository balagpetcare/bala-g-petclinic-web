export { api, apiClient } from './client';
import { ecommerceApi as mockEcommerceApi } from './mock-ecommerce';
import { ecommerceApi as realEcommerceApi } from './real-ecommerce';

export const ecommerceApi =
  process.env['NEXT_PUBLIC_USE_MOCK_ECOMMERCE'] === 'false' ? realEcommerceApi : mockEcommerceApi;
