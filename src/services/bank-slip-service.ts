import { NLPService } from './nlp-service';

export interface BankSlipParameters {
  price?: number;
}

export interface BankSlipContextData {
  pendingIntent: 'BANK_SLIP' | null;
  missingParameters: string[];
  data: BankSlipParameters;
}

export async function extractBankSlipParameters(message: string): Promise<BankSlipParameters> {
  const parameters = await NLPService.detectParams<BankSlipParameters>(message, 'BANK_SLIP');

  return parameters;
}

export function validateBankSlipParameters(params: BankSlipParameters): string[] {
  const missing: string[] = [];

  if (params.price == null || isNaN(params.price)) {
    missing.push('price');
  }

  return missing;
}

export async function simulateBankSlipGeneration(params: BankSlipParameters): Promise<string> {
  return `Bank slip successfully generated for the amount of R$ ${params?.price?.toFixed(2)}.`;
}
