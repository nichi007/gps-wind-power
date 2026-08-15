export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type WindPoint = {
  time: string;
  speed: number;
};

export type WindData = {
  currentSpeed: number;
  hourly: WindPoint[];
};
