import { env } from "./env/server";
import Fastify from 'fastify'
import fastifyStatic from "@fastify/static";
import path from "path";
import routerRoutes from "../generated/router/routes";

const fastifyRegister = async () => {
  const fastify = Fastify({ logger: false });

  await fastify.register(fastifyStatic, {
    root: path.join(__dirname, "../public"),
    prefix: `/assets/`,
    decorateReply: false
  });

  await fastify.register(fastifyStatic, {
    root: path.join(__dirname, "../generated/pages"),
    prefix: `/bundle/`,
    decorateReply: false
  });

  return fastify;
};

export type Server = Awaited<ReturnType<typeof fastifyRegister>>;

// Start the server
const start = async () => {
  const fastify = await fastifyRegister();
  routerRoutes(fastify);
  const host: string = env.HOST ?? "localhost";
  const port: number = env.PORT ?? 3000;
  try {
    await fastify.listen({ host, port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
start()