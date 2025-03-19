import Fastify from 'fastify';
import { messageRoutes } from '@/routes/message-route';

const server = Fastify({ logger: true });

server.register(messageRoutes, { prefix: '/message' });

const start = async () => {
  try {
    await server.listen({ port: 3001 });
    console.log('SERVER IS RUNNING AT :3001');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
