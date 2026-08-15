export type WindPowerResult = {
  watts: number;
  kilowatts: number;
  hourlyKWh: number;
  dailyKWh: number;
};

export function calculateWindPower(
  windSpeed: number,
  rotorDiameter: number,
  airDensity: number = 1.225,
  cp: number = 0.35,
): WindPowerResult {
  const isOutsideOperatingRange = windSpeed < 3 || windSpeed > 25;
  const sweptArea = Math.PI * (rotorDiameter / 2) ** 2;
  const watts = isOutsideOperatingRange
    ? 0
    : 0.5 * airDensity * sweptArea * cp * windSpeed ** 3;

  return {
    watts,
    kilowatts: watts / 1000,
    hourlyKWh: watts / 1000,
    dailyKWh: (watts / 1000) * 24,
  };
}
