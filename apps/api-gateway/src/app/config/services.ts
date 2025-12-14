export const services = {
  userService: {
    baseUrl: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  },
  locationService: {
    baseUrl: process.env.LOCATION_SERVICE_URL || 'http://localhost:3002',
  },
};
