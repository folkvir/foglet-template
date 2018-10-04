# Foglet-template

Just a template for building an application using foglet-core

# Install

Just clone this repository: `git clone https://github.com/folkvir/foglet-template.git`

And install: `cd foglet-template && npm install`

# Example

Build the development bundle.

`npm run build:dev`

And open `examples/index.html`

# Dependencies

Basically the first dependency needed to build foglet applications the library `foglet-core`.
Once installed we can start to build application

# Dev Dependencies

We use webpack to build our application using configurations in the folder `./configs/`:
- `npm run build:prod` will build the application in production mode
- `npm run build:dev` will build the application in development mode using the watch mode, any modification will trigger a build.

All files produced by the build will appear in the `./bin/` folder under the name of template.bundle[.min].js

# Networks

## Random Peer Sampling Protocol (RPS)

For instance the most stable network available in foglet-core is Cyclon which is a Random Peer Sampling protocol.
Each peer has a random subset of the whole network as neighbors (called a view).
This neighborhood is renewed periodically is always bounded to a limited number of neighbors. (Using a `maxPeers` parameter)
This kind of unstructured network **maintains the connectivity** and is **very resilient to churn**.

## Overlay Network

In foglet-core you can add Overlay Networks based on T-MAN or any other network constructed with the `n2n-overlay-wrtcs`
T-MAN allows to create the network topology you want to used. It's different from the previous one as T-MAN is commonly used for create structured topology unlike the previous one.

3 three things you have to provide:
- a descriptor
- a ranking function to rank neighbours' descriptors
- a timeout in milliseconds to define when descriptors are outdated.

# Communication

Don't forget that communication is always a zero-hop using WebRTC connections, so you will have to implement routing mechanisms to send a message to a specific peer in your network.
