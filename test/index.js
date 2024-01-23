import test from 'ava'
import fastify from 'fastify'
import { fastifyOso } from '../index.js'

const rootPolicy = `
allow_request(_, request) if
  request.url.startsWith("/public");
`

async function build (plugin, opts) {
  const app = fastify()
  app.get('/public', (request, response) => {
    return 'public intel'
  })
  app.register(plugin, opts)
  return app
}

test('decorator: "oso.authorizeRequest" authorizes access to routes', async ({ is }) => {
  async function setupOso (oso) {
    await oso.loadStr(rootPolicy)
    return oso
  }

  const app = await build(fastifyOso, { setupOso })

  app.addHook('onRequest', async function (request, reply) {
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
  is(200, publicResponse.statusCode)
  is('public intel', publicResponse.body)

  // Denies Access to the /private route (Oso is deny by default)
  const privateResponse = await app.inject('/private')
  is(403, privateResponse.statusCode)
  is('Access Denied', privateResponse.body)
})

test('requestDecorator: "authorizeRequest" authorizes access to routes', async ({ is }) => {
  async function setupOso (oso) {
    await oso.loadStr(rootPolicy)
    return oso
  }

  const app = await build(fastifyOso, { setupOso })

  app.addHook('onRequest', async function (request, reply) {
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
  is(200, publicResponse.statusCode)
  is('public intel', publicResponse.body)

  // Denies Access to the /private route (Oso is deny by default)
  const privateResponse = await app.inject('/private')
  is(403, privateResponse.statusCode)
  is('Access Denied', privateResponse.body)
})
