import type { FastifyPluginCallback, FastifyRequest } from 'fastify'
import { Oso } from 'oso'

export type SetupOsoFunction = (oso: Oso) => Promise<Oso>

export type AuthorizeRequestFunction = (actor: object, request: FastifyRequest) => Promise<void>
export interface FastifyOsoOptions {
  setupOso: SetupOsoFunction
}

declare module 'fastify' {
  interface FastifyRequest {
    authorizeRequest: AuthorizeRequestFunction
  }
}

declare const fastifyOso: FastifyPluginCallback<FastifyOsoOptions>

export default fastifyOso
export { fastifyOso }
