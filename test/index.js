import fastify from 'fastify'
import { test } from 'tap'

import { fastifyOso } from '../index.js'

const rootPolicy = `
allow_request(_, request) if
  request.url.startsWith("/public");
`

async function build (plugin, opts) {
  const app = fastify()
  app.get('/public', (request, response) => 'public intel')
  app.register(plugin, opts)
  return app
}

test('decorator: "oso.authorizeRequest" authorizes access to routes', async ({ equal }) => {
  async function setupOso (oso) {
    await oso.loadStr(rootPolicy)
    return oso
  }

  const app = await build(fastifyOso, { setupOso })

  app.addHook('onRequest', async function onRequest (request, reply) {
    try {
      await app.oso.authorizeRequest({}, request)
    } catch (error) {
      reply.status(403)
      reply.send('Access Denied')
    }
  })

  app.get('/private', (request, reply) => 'super secret')
  await app.ready()

  // Allows Access to the /public route (Declared in the rootPolicy Oso rule)
  const publicResponse = await app.inject('/public')
  equal(200, publicResponse.statusCode)
  equal('public intel', publicResponse.body)

  // Denies Access to the /private route (Oso is deny by default)
  const privateResponse = await app.inject('/private')
  equal(403, privateResponse.statusCode)
  equal('Access Denied', privateResponse.body)
})

test('requestDecorator: "authorizeRequest" authorizes access to routes', async ({ equal }) => {
  async function setupOso (oso) {
    await oso.loadStr(rootPolicy)
    return oso
  }

  const app = await build(fastifyOso, { setupOso })

  app.addHook('onRequest', async function onRequest (request, reply) {
    try {
      await request.authorizeRequest({ name: 'jane' }, request)
    } catch (error) {
      reply.status(403)
      reply.send('Access Denied')
    }
  })

  app.get('/private', (request, reply) => 'super secret')
  await app.ready()

  // Allows Access to the /public route (Declared in the rootPolicy Oso rule)
  const publicResponse = await app.inject('/public')
  equal(200, publicResponse.statusCode)
  equal('public intel', publicResponse.body)

  // Denies Access to the /private route (Oso is deny by default)
  const privateResponse = await app.inject('/private')
  equal(403, privateResponse.statusCode)
  equal('Access Denied', privateResponse.body)
})
