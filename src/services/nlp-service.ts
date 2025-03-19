import { IntentKey, INTENTS } from '@/constants/intents-constant';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export class NLPService {
  static async detectIntent(message: string): Promise<IntentKey> {
    const intentList = Array.from(INTENTS.keys()).map((intent) => `'${intent}'`).join(', ');
    const intentDescriptionList = Array.from(INTENTS.entries())
      .map(([intent, { description }]) => `* Para '${intent}': ${description}`)
      .join('\n');

    const prompt = `
      Você é um assistente especializado em identificar intenções de mensagens.

      Dada a mensagem abaixo, classifique-a em uma das seguintes intenções: ${intentList}.

      Se a intenção não puder ser identificada, retorne 'UNKOWN'.

      Descrição das intenções:

      ${intentDescriptionList}

      Mensagem: '${message}'

      Retorne APENAS o nome da intenção, sem qualquer formatação adicional.
    `;

    try {
      const result = await model.generateContent(prompt);

      const responseText = result?.response?.text()?.trim() as IntentKey;

      if (!responseText) {
        return 'UNKNOWN';
      }

      return responseText;
    } catch (error) {
      console.error('[NLP Service - detectIntent] - Error processing NLP response:', error);

      return 'UNKNOWN';
    }
  }

  static async detectParams<T>(message: string, intent: IntentKey): Promise<T> {
    const parameterList = Object.keys(INTENTS.get(intent)?.parametersInfo || {})
      .map((param) => `'${param}'`).join(', ');
    const parameterDescription = INTENTS.get(intent)?.description || '';

    const prompt = `
      Você é um assistente especializado em extrair parâmetros de mensagens.

      Intenção desejada: '${intent}'.

      Descrição da intenção: '${parameterDescription}'.

      Dada a mensagem abaixo, extraia os seguintes parâmetros para a intenção '${intent}': ${parameterList}.

      Caso não consiga extrair o valor de algum parâmetro, deve ser atribuído o valor null.

      Mensagem: '${message}'

      Retorne APENAS uma string de JSON válida, sem formatação adicional, com os parâmetros extraídos, no seguinte formato por exemplo:

      Exemplo de formato correto:
      {"chave1": "valor1", "chave2": 123, "chave3": true}
    `;

    try {
      const result = await model.generateContent(prompt);

      const responseText = result?.response?.text()?.trim();

      if (!responseText) {
        return {} as T;
      }

      const json = JSON.parse(responseText) as T;

      return json;
    } catch (error) {
      console.error('[NLP Service - detectParams] - Error processing NLP response:', error);

      return {} as T;
    }
  }
}
