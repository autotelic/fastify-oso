import fastify, { FastifyInstance, FastifyRequest } from 'fastify'
import { Oso } from 'oso'
// eslint-disable-next-line import/no-unresolved
import { expectAssignable, expectError } from 'tsd'

import fastifyOso from '..'

import type { AuthorizeRequestFunction } from './index.d.ts'

const app = fastify()

const opt1 = {
  async setupOso (oso: Oso) {
    return oso
  }
}

expectAssignable<FastifyInstance>(app.register(fastifyOso, opt1))

app.register(fastifyOso, opt1).after(() => {
  app.addHook('onRequest', async (request: FastifyRequest) => {
    const actor = { id: '123', role: 'user' }
    expectAssignable<AuthorizeRequestFunction>(request.authorizeRequest)
    await expectAssignable<Promise<void>>(request.authorizeRequest(actor, request))
  })
})

const errOpt1 = {
  setupOso: {}
}

expectError(app.register(fastifyOso, errOpt1))
