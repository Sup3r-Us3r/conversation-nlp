import {
  PixParameters,
  extractPixParameters,
  validatePixParameters,
  simulatePixTransaction,
  PixContextData
} from '@/services/pix-service';
import { ConversationState, stateManager } from '@/services/state-manager-service';

export class PixUseCase {
  async execute(userId: string, message: string, conversationState?: ConversationState<PixContextData>) {
    if (conversationState && conversationState?.context?.pendingIntent === 'PIX') {
      const previousPixData: PixParameters = conversationState?.context?.data || {};
      const newPixData = await extractPixParameters(message);
      const mergedPixData: PixParameters = { ...previousPixData, ...newPixData };
      const missingParams = validatePixParameters(mergedPixData);

      if (missingParams.length > 0) {
        stateManager.updateState<PixContextData>(userId, {
          pendingIntent: 'PIX',
          missingParameters: missingParams,
          data: mergedPixData,
        });

        return `To carry out PIX, we need: ${missingParams.join(
          ', '
        )}. Please provide the required data.`;
      } else {
        const response = await simulatePixTransaction(mergedPixData);

        stateManager.updateState(userId, { pendingIntent: null, missing: [], pixData: {} });

        return response;
      }
    }

    /**
     * FIRST INTERACTION
     */

    const pixParams: PixParameters = await extractPixParameters(message);
    const missingParams = validatePixParameters(pixParams);

    if (missingParams.length > 0) {
      // Stores partial data and indicates that the PIX flow is pending
      stateManager.updateState<PixContextData>(userId, {
        pendingIntent: 'PIX',
        missingParameters: missingParams,
        data: pixParams,
      });

      return `To carry out PIX, we need: ${missingParams.join(
        ', '
      )}. Please provide the required data.`;
    } else {
      const response = await simulatePixTransaction(pixParams);

      stateManager.updateState<PixContextData>(userId, {
        pendingIntent: null,
        missingParameters: [],
        data: {}
      });

      return response;
    }
  }
}
