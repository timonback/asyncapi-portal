import { generateSequence } from "./number_sequence";

test("generateSequence with single value", () => {
  const generator = generateSequence(0, 0);

  expect(generator.next().value).toBe(0);
});

test("generateSequence with multiple values", () => {
  const generator = generateSequence(10, 11);

  expect(generator.next().value).toBe(10);
  expect(generator.next().value).toBe(11);
  expect(generator.next().value).toBe(undefined);
});
