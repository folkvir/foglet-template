console.log(template); // eslint-disable-line
// the bundle is included by default in the browser you do not have to require/import it
localStorage.debug = ""; // 'template'
const MAX_PEERS = 3;
// Create sigma graphs _________
// const rps = createSigma("rps");
const overlay = createSigma("overlay");
// Creating peers and sigma nodes
const max = 30;
const peers = [];
for (let i = 0; i < max; i++) {
  //  const fogletTemplate = new template(undefined, true);
  const fogletTemplate = new template(
    {
      foglet: {
        overlays: [
          {
            name: "tman",
            options: {
              delta: 2 * 1000,
              timeout: 5 * 1000,
              pendingTimeout: 5 * 1000,
              maxPeers: MAX_PEERS,
              descriptor: {
                x: i * 2,
                y: i % 5
              }
            }
          }
        ]
      }
    },
    true
  );
  setInterval(() => {
    const cache = fogletTemplate.foglet.overlay("tman")._network._rps.cache;
    const neighbours = fogletTemplate.foglet.getNeighbours();
    neighbours.forEach(neighbour => {
      let chosen;
      peers.forEach(peer => {
        if (peer.foglet.inViewID == neighbour) chosen = peer;
      });
      if (!chosen) return;
      cache.add(neighbour, chosen.foglet.overlay("tman").network.descriptor);
    });
  }, 2 * 1000);

  peers.push(fogletTemplate);
  // Add nodes to graph
  const options = {
    color: randomColor(),
    index: i
  };
  // addTemplateToGraph(rps, fogletTemplate, options);
  addTemplateToGraph(overlay, fogletTemplate, options);
  // Adding listeners
  const fgId = fogletTemplate.foglet.inViewID;
  // fogletTemplate.on("rps-open", id => addEdge(rps, fgId, id));
  fogletTemplate.on("overlay-open", id => addEdge(overlay, fgId, id));
  // fogletTemplate.on("rps-close", id => dropEdge(rps, `${fgId}-${id}`));
  fogletTemplate.on("overlay-close", id => dropEdge(overlay, `${fgId}-${id}`));
  fogletTemplate.on("descriptor-updated", ({ id, descriptor }) => {
    // updateNode(rps, id, descriptor);
    updateNode(overlay, id, descriptor);
  });
}

// Connect random peers with each others
forEachPromise(peers, (peer, index) => {
  if (index == 0) return;
  let rn = index;
  rn = Math.floor(Math.random() * index);
  const randomPeer = peers[rn];
  return new Promise(
    (resolve, reject) =>
      setTimeout(() => {
        peer.connection(randomPeer).then(resolve);
      }),
    index * 500
  );
}).then(() => {
  // rps.refresh();
  // overlay.refresh();
  // Set broadcast listeners
  setListeners();
  // Firing change location loop
  // updateLocation(peers);
});
