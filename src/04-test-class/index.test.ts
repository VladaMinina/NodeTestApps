import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';

describe('BankAccount', () => {
  const balance = 100;
  let bankAccount: BankAccount;
  beforeEach(() => {
    bankAccount = getBankAccount(balance);
  });
  test('should create account with initial balance', () => {
    expect(bankAccount.getBalance()).toBe(balance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => bankAccount.withdraw(1000)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const targetAccount = new BankAccount(20);
    expect(() => bankAccount.transfer(1000, targetAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => bankAccount.transfer(10, bankAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    bankAccount.deposit(150);
    expect(bankAccount.getBalance()).toBe(balance + 150);
  });

  test('should withdraw money', () => {
    bankAccount.withdraw(50);
    expect(bankAccount.getBalance()).toBe(balance - 50);
  });

  test('should transfer money', () => {
    const targetAccount = new BankAccount(20);
    bankAccount.transfer(30, targetAccount);
    expect(bankAccount.getBalance()).toBe(balance - 30);
    expect(targetAccount.getBalance()).toBe(20 + 30);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(50);
    const newBalance = await bankAccount.fetchBalance();
    expect(newBalance).toBeLessThanOrEqual(100);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const mockedBalance = 120;
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(mockedBalance);
    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toBe(mockedBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValue(null);
    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
