import fastify, { FastifyInstance } from 'fastify'
// eslint-disable-next-line import/no-unresolved
import { expectAssignable, expectError } from 'tsd'

import fastifyPluginTemplate from '..'

const app = fastify()

const opt1 = {
  mandatory: 'string'
}

expectAssignable<FastifyInstance>(app.register(fastifyPluginTemplate, opt1))

const errOpt1 = {
  error: true
}

expectError(app.register(fastifyPluginTemplate, errOpt1))
