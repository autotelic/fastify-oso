# Basic

Basic usage configuring an oso instance and authorizing requests using the onRequest hook.

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

- Make an http request to the /private endpoint:

    ```
    $ curl http://localhost:3000/private
    ```

    You should receive a 403 response with body "Access Denied"
