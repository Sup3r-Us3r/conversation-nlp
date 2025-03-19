import {
  BankSlipParameters,
  extractBankSlipParameters,
  validateBankSlipParameters,
  simulateBankSlipGeneration,
  BankSlipContextData
} from '@/services/bank-slip-service';
import { ConversationState, stateManager } from '@/services/state-manager-service';

export class BankSlipUseCase {
  async execute(userId: string, message: string, conversationState?: ConversationState<BankSlipContextData>) {
    if (conversationState && conversationState?.context?.pendingIntent === 'BANK_SLIP') {
      const previousBankSlipData: BankSlipParameters = conversationState?.context?.data || {};
      const newBankSlipData = await extractBankSlipParameters(message);
      const mergedBankSlipData: BankSlipParameters = { ...previousBankSlipData, ...newBankSlipData };
      const missingParams = validateBankSlipParameters(mergedBankSlipData);

      if (missingParams.length > 0) {
        stateManager.updateState<BankSlipContextData>(userId, {
          pendingIntent: 'BANK_SLIP',
          missingParameters: missingParams,
          data: mergedBankSlipData,
        });

        return `To generate the bank slip, we need: ${missingParams.join(
          ', '
        )}. Please provide the required data.`;
      } else {
        const response = await simulateBankSlipGeneration(mergedBankSlipData);

        stateManager.updateState(userId, { pendingIntent: null, missing: [], bankslipData: {} });

        return response;
      }
    }

    /**
     * FIRST INTERACTION
     */

    const bankSlipParams: BankSlipParameters = await extractBankSlipParameters(message);
    console.log('bankslipParams: ', bankSlipParams);

    const missingParams = validateBankSlipParameters(bankSlipParams);

    if (missingParams.length > 0) {
      // Stores partial data and indicates that the BANK_SLIP stream is pending
      stateManager.updateState<BankSlipContextData>(userId, {
        pendingIntent: 'BANK_SLIP',
        missingParameters: missingParams,
        data: bankSlipParams,
      });

      return `To generate the bank slip, we need: ${missingParams.join(
        ', '
      )}. Please provide the required data.`;
    } else {
      const response = await simulateBankSlipGeneration(bankSlipParams);

      stateManager.updateState<BankSlipContextData>(userId, {
        pendingIntent: null,
        missingParameters: [],
        data: {}
      });

      return response;
    }
  }
}
