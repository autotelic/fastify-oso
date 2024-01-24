import type { FastifyPluginCallback } from 'fastify'

export interface PluginOptions {
  mandatory: string
}

declare const fastifyPluginTemplate: FastifyPluginCallback<PluginOptions>

export default fastifyPluginTemplate
export { fastifyPluginTemplate }
