# fastify-oso

A plugin for implementing [Oso](https://github.com/osohq/oso)
authorization in fastify applications.

## Install

```
npm i @autotelic/fastify-oso
```

## Usage

```js
'use strict'

const { fastifyOso } = require('@autotelic/fastify-oso')

const app = require('fastify')()

const PORT = process.env.PORT || 3000

async function setupOso (oso) {
  const osoPolicy = `
    # Anyone may access the '/public' endpoint
    allow_request(_, request) if
      request.url.startsWith("/public");

    # Admin users can access everything
    allow(user, _, _) if
      user.role = "admin";
  `
  // Setup the oso instance here.
  // All side effects must occur before returning the oso instance.
  await oso.loadStr(osoPolicy)
  return oso
}

// Register the plugin
app.register(fastifyOso, { setupOso })

// Authorize access to your routes as an onRequest hook
const osoAuthorizeRequest = async (request, reply) => {
  try {
    await app.oso.authorizeRequest({}, request)
  } catch (error) {
    reply.status(403).send('Access Denied')
  }
}

// Anyone is able to access this route.
app.get('/public', { onRequest: [osoAuthorizeRequest] }, (request, response) => {
  return 'public information'
})


// Only "admin" users may access this route.
app.get('/private', async (request, reply) => {
  const user = {
    // Role and other identifying information could come from
    // JWTs or other data sources.
    role: request.headers.role || 'anonymous'
  }
  try {
    await app.oso.authorize(user)
  } catch (error) {
    reply.status(403).send('Access Denied')
  }
  return 'super secret'
})

app.listen(PORT, (_, address) => {console.log(`Listening at: ${address}`)})

```

## Examples

We provide the following usage examples and recipes:
- [basic](./examples/basic/README.md)
- [onRequest hook](./examples/onRequestHook/README.md)

## API

### Plugin

#### Options

The configuration object accepts the following fields":
##### - `setupOso: async (Oso) => Oso`

  A function that receives the oso instance, applies some configuration to that
  instance and then returns the configured oso class.

#### Decorators

The oso instance is exposed as a decorator inside the `oso` namespace. For a list of the exposed oso methods refer to the [Oso API documentation](https://docs.osohq.com/node/reference/api/classes/oso.oso-1.html)

#### requestDecorators

##### - `authorizeRequest: (Actor, Request) => Promise`

Exposes the oso [authorizeRequest](https://docs.osohq.com/node/reference/api/classes/oso.oso-1.html#authorizerequest) method on the Request object.

This is useful for handling authorization within request lifecycle hooks.

## Github Actions/Workflows

#### Triggering a Release

* Trigger the release workflow via release tag
  ```sh
  git checkout main && git pull
  npm version { minor | major | path }
  git push --follow-tags
  ```

## License

This project is covered under the [MIT](./LICENSE) license.
