# Basic

Basic usage configuring an oso instance and authorizing requests based on a
users role.

## Running

- Ensure you have all dependencies installed (`npm i` from the project root.)

- start the server

    ```
    $ node index.js
    ```

- Make an http request to the /public endpoint:

    ```
    $ curl http://localhost:3000/public
    ```

    You should receive a 200 response with body: `public information`

- Make an http request to the /secret/:id endpoint:

    ```
    $ curl http://localhost:3000/secret/1
    ```

    You should receive a 403 response with body "Access Denied"
    (due to the requester not having an authorized role)

- Make another http request to the /secret/:id endpoint, this time setting the user
role and name as request headers:

    ```shell
    $ curl http://localhost:3000/secret/1 \
      -H 'role: admin' \
      -H 'name: John Doe'
    ```

    You should receive a 200 response with secret.
