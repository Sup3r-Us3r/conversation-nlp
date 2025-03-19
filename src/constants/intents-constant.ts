export type IntentKey = 'PIX' | 'BANK_SLIP' | 'BALANCE' | 'UNKNOWN';

interface IntentValue {
  description: string;
  parametersInfo: Record<string, string>;
}

export const INTENTS: Map<IntentKey, IntentValue> = new Map<IntentKey, IntentValue>([
  ['PIX', {
    description: 'Transferência instantânea para outra pessoa.',
    parametersInfo: {
      recipient: 'Nome do destinatário.',
      price: 'Valor numérico.',
    }
  }],
  ['BANK_SLIP', {
    description: 'Emissão de um boleto para pagamento.',
    parametersInfo: {
      price: 'Valor numérico.',
    }
  }],
  ['BALANCE', {
    description: 'Valor disponível em conta.',
    parametersInfo: {}
  }],
  ['UNKNOWN', {
    description: 'Solicitação não disponível.',
    parametersInfo: {}
  }]
]);
