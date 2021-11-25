'use strict'

const fp = require('fastify-plugin')
const { Oso } = require('oso')

const defaultOptions = {
  setupOso: async oso => oso
}

async function fastifyOso (fastify, options) {
  const { setupOso } = {
    ...options,
    ...defaultOptions
  }
  const oso = new Oso()
  await setupOso(oso)
  fastify.decorate('oso', oso)
}

module.exports = fp(fastifyOso, { name: 'fastify-oso' })
