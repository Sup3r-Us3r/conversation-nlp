import { messageController } from '@/controllers/message-controller';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export async function messageRoutes(server: FastifyInstance, _options: FastifyPluginOptions) {
  server.post('/', messageController);
}
