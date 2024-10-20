import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should return the sum of two numbers 2 and 3 when action is Add', () => {
    const result = simpleCalculator({ a: 5, b: 3, action: Action.Add });
    expect(result).toBe(8);
  });

  test('should return the difference of two numbers 10 and 5 when action is Subtract', () => {
    const result = simpleCalculator({ a: 10, b: 5, action: Action.Subtract });
    expect(result).toBe(5);
  });

  test('should return the multiplied resuld of two numbers when action is Multiply', () => {
    const result = simpleCalculator({ a: 3, b: 7, action: Action.Multiply });
    expect(result).toBe(21);
  });

  test('should divide two numbers', () => {
    const input = { a: 10, b: 2, action: Action.Divide };
    const result = simpleCalculator(input);
    expect(result).toBe(5);
  });

  test('should exponentiate two numbers', () => {
    const input = { a: 3, b: 3, action: Action.Exponentiate };
    const result = simpleCalculator(input);
    expect(result).toBe(27);
  });

  test('should return null for invalid action', () => {
    const input = { a: 3, b: 17, action: 'invalid action' };
    const result = simpleCalculator(input);
    expect(result).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const invalidInputs = [
      { a: '5', b: 3, action: Action.Add },
      { a: 5, b: '3', action: Action.Add },
      { a: '5', b: '3', action: Action.Add },
      { a: 5, b: 3, action: 'invalid' },
      { a: null, b: 3, action: Action.Subtract },
      { a: 5, b: undefined, action: Action.Divide },
    ];
    invalidInputs.forEach((input) => {
      const result = simpleCalculator(input);
      expect(result).toBeNull();
    });
  });
});
