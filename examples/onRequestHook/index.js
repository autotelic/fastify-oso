import fastify from 'fastify'
import { fastifyOso } from '../../index.js'

const PORT = process.env.PORT || 3000

const app = fastify()

const opts = {
  async setupOso (oso) {
    // Load the Authorization rules.
    await oso.loadFiles(['authorization.polar'])
    return oso
  }
}

// Register fastify-oso
app.register(fastifyOso, opts)

// For every request, this hook will run. If a request is unauthorized, authorizeRequest will throw
// an oso authorization error. We catch that and respond to the client with a `403` code.
app.addHook('onRequest', async function (request, reply) {
  try {
    await request.authorizeRequest({}, request)
  } catch (error) {
    reply.status(403).send('Access Denied')
  }
})

// Requests here are allowed.
app.get('/public', (request, response) => 'public information')

// Requests here will not be allowed.
app.get('/private', (request, reply) => 'super secret')

app.listen({ port: PORT }, (_, address) => {
  console.log(`listening at ${address}`)
})
