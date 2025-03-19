import { BalanceContextData, simulateBalance } from '@/services/balance-service';
import { stateManager } from '@/services/state-manager-service';

export class BalanceUseCase {
  async execute(userId: string) {
    const response = await simulateBalance();

    stateManager.updateState<BalanceContextData>(userId, {
      pendingIntent: null,
    });

    return response;
  }
}
