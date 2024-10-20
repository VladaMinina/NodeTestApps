import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

describe('doStuffByTimeout', () => {
  let callback: jest.Mock;
  beforeAll(() => {
    jest.useFakeTimers();
    callback = jest.fn();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const delay = 1000;
    doStuffByTimeout(callback, delay);
    expect(setTimeout).toHaveBeenCalledWith(callback, delay);
  });

  test('should call callback only after timeout', () => {
    const delay = 1000;
    doStuffByInterval(callback, delay);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(delay);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  let callback: jest.Mock;
  beforeAll(() => {
    jest.useFakeTimers();
    callback = jest.fn();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const delay = 1000;
    doStuffByInterval(callback, delay);
    expect(setInterval).toBeCalledWith(callback, delay);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const delay = 1000;
    doStuffByInterval(callback, delay);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(delay);
    expect(callback).toBeCalledTimes(1);

    jest.advanceTimersByTime(delay * 5);
    expect(callback).toBeCalledTimes(6);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    // Write your test here
  });

  test('should return null if file does not exist', async () => {
    // Write your test here
  });

  test('should return file content if file exists', async () => {
    // Write your test here
  });
});
