'use strict'

const fp = require('fastify-plugin')
const { Oso } = require('oso')

const AUTHORIZE_REQUEST = 'authorizeRequest'

async function fastifyOso (fastify, options) {
  const { setupOso } = options
  const oso = new Oso()

  await setupOso(oso)

  function wrapDecorator (key) {
    return async (...args) => oso[key](...args)
  }

  fastify.decorate('oso', oso)
  fastify.decorateRequest(AUTHORIZE_REQUEST, wrapDecorator(AUTHORIZE_REQUEST))
}

module.exports = fp(fastifyOso, { name: 'fastify-oso' })
