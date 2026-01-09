export interface DriverLocationMessage {
  type: 'driver:location:update';
  payload: {
    driverId: string;
    lat: number;
    lng: number;
    heading?: number;
    speed?: number;
    timestamp?: number;
  };
}
