export interface BalanceContextData {
  pendingIntent: 'BALANCE' | null;
}

export async function simulateBalance(): Promise<string> {
  return 'You have R$ 200.000,00 available.';
}
