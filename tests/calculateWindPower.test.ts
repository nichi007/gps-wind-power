import { describe, expect, it } from "vitest";
import { calculateWindPower } from "@/lib/calculateWindPower";

describe("calculateWindPower", () => {
  it("calculates output and unit conversions for an operating wind speed", () => {
    const result = calculateWindPower(6.4, 3);

    expect(result.watts).toBeCloseTo(397.234, 2);
    expect(result.kilowatts).toBeCloseTo(0.397234, 5);
    expect(result.hourlyKWh).toBeCloseTo(0.397234, 5);
    expect(result.dailyKWh).toBeCloseTo(9.53362, 4);
  });

  it.each([2.99, 25.01])("returns zero outside the operating range at %s m/s", (windSpeed) => {
    expect(calculateWindPower(windSpeed, 3)).toEqual({ watts: 0, kilowatts: 0, hourlyKWh: 0, dailyKWh: 0 });
  });

  it("allows the cut-in and cut-out boundary values", () => {
    expect(calculateWindPower(3, 3).watts).toBeGreaterThan(0);
    expect(calculateWindPower(25, 3).watts).toBeGreaterThan(0);
  });

  it("scales with rotor swept area", () => {
    const threeMeter = calculateWindPower(10, 3).watts;
    const sixMeter = calculateWindPower(10, 6).watts;
    expect(sixMeter / threeMeter).toBeCloseTo(4, 10);
  });
});