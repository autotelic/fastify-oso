import fastify from 'fastify'

import { fastifyOso } from '../../index.js'

const PORT = process.env.PORT || 3000

const app = fastify()

class Secret {
  constructor (id, secret, roles) {
    this.id = id
    this.secret = secret
  }
}

class User {
  constructor (name, role) {
    this.name = name
    this.role = role
  }
}

const secretsDB = (id) => {
  const secrets = {
    1: {
      id: 1,
      secret: 'super-secret'
    },
    2: {
      id: 2,
      secret: 'top-secret'
    }
  }

  return new Secret(...Object.values(secrets[id]))
}

const opts = {
  async setupOso (oso) {
    // Load the Authorization rules.
    oso.registerClass(Secret)
    oso.registerClass(User)
    await oso.loadFiles(['authorization.polar'])
    return oso
  }
}

// Register fastify-oso
app.register(fastifyOso, opts)

// Requests here are allowed.
app.get('/public', (request, response) => 'public information')

// Requests here will not be allowed.
app.get('/secret/:id', async (request, reply) => {
  const actor = new User(request.headers.user, request.headers.role)
  const action = 'read'
  const resource = secretsDB(request.params.id)

  try {
    await app.oso.authorize(actor, action, resource)
  } catch (error) {
    console.log(error.message)
    reply.status(403).send('Access Denied')
  }
  return resource
})

app.listen({ port: PORT }, (_, address) => {
  console.log(`listening at ${address}`)
})
