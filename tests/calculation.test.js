const { calculateMassFlow, determineFactor } = require("../calculation");

test("Calculate mass flow correctly", () => {
    expect(calculateMassFlow(24, 200, 10)).toBeCloseTo(80);
});

test("Determine factor correctly", () => {
    expect(determineFactor(80, 5)).toBe(5);
});
