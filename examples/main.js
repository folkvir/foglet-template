console.log(template) // eslint-disable-line
// the bundle is included by default in the browser you do not have to require/import it
localStorage.debug = 'template'

let rps = new sigma('rps')
let overlay = new sigma('overlay')

let peers = []
const max = 10
peers.push(new template(undefined, true))
rps.graph.addNode({
  'id': peers[0].foglet.inViewID,
  'label': 0 + '',
  'x': 0,
  'y': 0,
  'size': 3
})
overlay.graph.addNode({
  'id': peers[0].foglet.inViewID,
  'label': 0 + '',
  'x': 0,
  'y': 0,
  'size': 3
})
peers[0].on('rps-open', (id) => {
  rps.graph.addEdge({
    'id': id + '-' + peers[0].foglet.inViewID,
    'source': peers[0].foglet.inViewID,
    'target': id
  })
  rps.refresh()
})
peers[0].on('rps-close', (id) => {
  rps.graph.dropEdge(id + '-' + peers[0].foglet.inViewID)
  rps.refresh()
})
peers[0].on('overlay-open', (id) => {
  overlay.graph.addEdge({
    'id': id + '-' + peers[0].foglet.inViewID,
    'source': peers[0].foglet.inViewID,
    'target': id
  })
  overlay.refresh()
})
peers[0].on('overlay-close', (id) => {
  overlay.graph.dropEdge(id + '-' + peers[0].foglet.inViewID)
  overlay.refresh()
})

let p = []
for (let i = 1; i < max; ++i) {
  p.push(i)
}

p.reduce((acc, i) => acc.then(() => {
  return new Promise((resolve, reject) => {
    let t = new template(undefined, true)
    rps.graph.addNode({
      'id': t.foglet.inViewID,
      'label': i + '',
      'x': i,
      'y': Math.floor(Math.random() * max),
      'size': 3
    })
    overlay.graph.addNode({
      'id': t.foglet.inViewID,
      'label': i + '',
      'x': i,
      'y': Math.floor(Math.random() * max),
      'size': 3
    })
    t.on('rps-open', (id) => {
      rps.graph.addEdge({
        'id': id + '-' + t.foglet.inViewID,
        'source': t.foglet.inViewID,
        'target': id
      })
      rps.refresh()
    })
    t.on('rps-close', (id) => {
      rps.graph.dropEdge(id + '-' + t.foglet.inViewID)
      rps.refresh()
    })
    t.on('overlay-open', (id) => {
      overlay.graph.addEdge({
        'id': id + '-' + t.foglet.inViewID,
        'source': t.foglet.inViewID,
        'target': id
      })
      overlay.refresh()
    })
    t.on('overlay-close', (id) => {
      overlay.graph.dropEdge(id + '-' + t.foglet.inViewID)
      overlay.refresh()
    })
    const rn = Math.floor(Math.random() * peers.length)
    let p = peers[rn]
    peers.push(t)
    t.connection(p).then(() => {
      rps.refresh()
      setTimeout(resolve, 500)
    }).catch(e => {
      reject(e)
    })
  })
}), Promise.resolve())
