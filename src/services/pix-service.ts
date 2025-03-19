import { NLPService } from './nlp-service';

export interface PixParameters {
  recipient?: string;
  price?: number;
}

export interface PixContextData {
  pendingIntent: 'PIX' | null;
  missingParameters: string[];
  data: PixParameters;
}

export async function extractPixParameters(message: string): Promise<PixParameters> {
  const parameters = await NLPService.detectParams<PixParameters>(message, 'PIX');

  return parameters;
}

export function validatePixParameters(params: PixParameters): string[] {
  const missing: string[] = [];

  if (!params.recipient) {
    missing.push('recipient');
  }

  if (params.price == null || isNaN(params.price)) {
    missing.push('price');
  }

  return missing;
}

export async function simulatePixTransaction(params: PixParameters): Promise<string> {
  return `PIX successfully simulated for ${params?.recipient} in the amount of R$ ${params?.price?.toFixed(2)}.`;
}
