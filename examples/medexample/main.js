console.log(template); // eslint-disable-line
// the bundle is included by default in the browser you do not have to require/import it
localStorage.debug = ""; // 'template'
const MAX_PEERS = 10;
// Create sigma graphs _________
// const rps = createSigma("rps");
const overlay = createSigma("overlay");
// Creating peers and sigma nodes
const max = 50;
const peers = [];
const delta = 10 * 1000
for (let i = 0; i < max; i++) {
  //  const fogletTemplate = new template(undefined, true);
  const fogletTemplate = new template(
    {
      foglet: {
        id: i + '',
        overlays: [
          {
            name: "tman",
            options: {
              delta: delta,
              timeout: 5 * 1000,
              pendingTimeout: 5 * 1000,
              maxPeers: MAX_PEERS,
              descriptor: {
                x: Math.floor(Math.random() * 50),
                y: Math.floor(Math.random() * 50)
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
  // console.log("end promise")
  
  // Set broadcast listeners
  // setListeners();
  // Firing change location loop
  // updateLocation(peers);
});


const i = setInterval(()=>{
  const conv = convergence();
  if(conv===100){
    clearInterval(i)
  }
  console.log(conv+ '%')
}, 1 * 1000)


let scramble = (delay = 0) => {
  for (let i = 0; i < max; ++i) {
    setTimeout((nth) => {
      peers[nth].foglet.overlay('tman')._network.rps._exchange() // force exchange
    }, i * delay, i)
  };
}

var convergence = () => { 
	var getDistance = (a,b) => {
		  var dx = a.x - b.x;
		  var dy = a.y - b.y;
		  return Math.sqrt(dx * dx + dy * dy);
		};
	var voisins = new Array(); 
	var fails = 0;
	for (let i = 0; 
		i < overlay.graph.nodes().length; i++) {
		for (let j =0; j < overlay.graph.nodes().length ; j++ ) {
				voisins[j] = getDistance(overlay.graph.nodes()[i], overlay.graph.nodes()[j]);
		}
		// Là on a la distance à tous les autres voisins. 
		var min;
		for ( let k = 1; k<= MAX_PEERS ; k++){
			if (voisins[0] == 0){
				min = 1;
			} else { min = 0; }
			for(let l=0; l<voisins.length; l++){
				if(voisins[l] != 0){
					if(voisins[min] > voisins[l]){
						min = l; 
					}
				}
			} // Là on a le voisin le + proche. 
			var jelai = false; 
			for (let m =0; m < overlay.graph.edges().length;
			m++){
				if (overlay.graph.edges()[m].source == overlay.graph.nodes()[i].id){
					if (overlay.graph.edges()[m].target == overlay.graph.nodes()[min].id){
						jelai = true;
					}
				}
			}
			if (!jelai) {
				fails++;
			}
			voisins[min]=1000;
			
		}
		
	}
	return (Math.floor(((overlay.graph.edges().length-fails) / (overlay.graph.edges().length))*100 ));
}