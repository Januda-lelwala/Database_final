/**
 * Services Index
 * Central export point for all API services
 */

export { authService } from './auth.service';
export { customersService } from './customers.service';
export { ordersService } from './orders.service';
export { productsService } from './products.service';
export { storesService } from './stores.service';
export { trucksService } from './trucks.service';
export { trainsService } from './trains.service';

// Export the base API instance and error handler
export { default as api, handleAPIError } from './api';
