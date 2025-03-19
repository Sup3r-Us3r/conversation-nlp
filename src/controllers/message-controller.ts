import { NLPService } from '@/services/nlp-service';
import { stateManager } from '@/services/state-manager-service';
import { PixUseCase } from '../use-cases/pix-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { IntentKey } from '@/constants/intents-constant';
import { BankSlipUseCase } from '../use-cases/bank-slip-use-case';
import { BalanceUseCase } from '../use-cases/balance-use-case';

interface MessageBody {
  userId: string;
  message: string;
}

export async function messageController(request: FastifyRequest<{ Body: MessageBody }>, reply: FastifyReply) {
  const { userId, message } = request.body;

  try {
    const response = await processMessage(userId, message);
    return reply.send({ response });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ error: 'Internal server error.' });
  }
}

export async function processMessage(userId: string, message: string): Promise<string> {
  const pixUseCase = new PixUseCase();
  const bankSlipUseCase = new BankSlipUseCase();
  const balanceUseCase = new BalanceUseCase();

  const conversationState = stateManager.getState(userId);

  switch (conversationState?.context?.pendingIntent as IntentKey) {
    case 'PIX': {
      return await pixUseCase.execute(userId, message, conversationState);
    }
    case 'BANK_SLIP': {
      return await bankSlipUseCase.execute(userId, message, conversationState);
    }
    case 'BALANCE': {}
  }

  const intentName = await NLPService.detectIntent(message);

  switch (intentName) {
    case 'PIX': {
      return await pixUseCase.execute(userId, message);
    }
    case 'BANK_SLIP': {
      return await bankSlipUseCase.execute(userId, message);
    }
    case 'BALANCE': {
      return await balanceUseCase.execute(userId);
    }
    case 'UNKNOWN':
    default: {
      stateManager.updateState(userId, {});
      return 'We were unable to process your request.';
    }
  }
}
