import fp from 'fastify-plugin'
import { Oso } from 'oso'

const AUTHORIZE_REQUEST = 'authorizeRequest'

async function fastifyOsoPlugin (fastify, options) {
  const { setupOso } = options
  const oso = new Oso()

  await setupOso(oso)

  function wrapDecorator (key) {
    return async (...args) => oso[key](...args)
  }

  fastify.decorate('oso', oso)
  fastify.decorateRequest(AUTHORIZE_REQUEST, wrapDecorator(AUTHORIZE_REQUEST))
}

const fastifyOso = fp(fastifyOsoPlugin, { name: 'fastify-oso' })

export { fastifyOso }
export default fastifyOso
