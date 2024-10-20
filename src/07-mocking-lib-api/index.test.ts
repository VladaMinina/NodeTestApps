import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  let mockClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient = {
      get: jest.fn(),
    };

    (axios.create as jest.Mock).mockReturnValue(mockClient);
  });

  test('should create instance with provided base url', async () => {
    const path = '/path';
    mockClient.get.mockResolvedValueOnce({ data: [] });
    await throttledGetDataFromApi(path);

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const path = '/path';
    mockClient.get.mockResolvedValueOnce({ data: [] });

    await throttledGetDataFromApi(path);
    expect(mockClient.get).toHaveBeenCalledWith(path);
  });

  test('should return response data', async () => {
    const path = '/path';
    const mockData = [{ id: 1, title: 'Post 1' }];
    mockClient.get.mockResolvedValueOnce({ data: mockData });

    const result = await throttledGetDataFromApi(path);
    expect(result).toEqual(mockData);
  });
});
