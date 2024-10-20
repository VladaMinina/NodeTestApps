import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 5, b: 3, action: Action.Subtract, expected: 2 },
  { a: 4, b: 2, action: Action.Subtract, expected: 2 },
  { a: 6, b: 3, action: Action.Divide, expected: 2 },
  { a: 9, b: 3, action: Action.Divide, expected: 3 },
  { a: 3, b: 4, action: Action.Multiply, expected: 12 },
  { a: 2, b: 5, action: Action.Multiply, expected: 10 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 3, b: 2, action: Action.Exponentiate, expected: 9 },
];

const invalidCases = [
  { a: '15', b: 3, action: Action.Add, expected: null },
  { a: 5, b: '1', action: Action.Subtract, expected: null },
  { a: 5, b: 3, action: 'invalid act.', expected: null },
  { a: null, b: 8, action: Action.Multiply, expected: null },
  { a: undefined, b: 4, action: Action.Divide, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should return $expected for $a $action $b',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );

  test.each(invalidCases)(
    'should return null for invalid input',
    ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    },
  );
});
