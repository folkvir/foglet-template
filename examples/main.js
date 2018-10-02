console.log(template) // eslint-disable-line
// the bundle is included by default in the browser you do not have to require/import it
localStorage.debug = 'template'

let graph = new sigma('container')
let peers = []
const max = 10
peers.push(new template(undefined, true))
graph.graph.addNode({
  'id': peers[0].foglet.inViewID,
  'label': 0 + '',
  'x': 0,
  'y': 0,
  'size': 3
})
peers[0].on('rps-open', (id) => {
  graph.graph.addEdge({
    'id': id + '-' + peers[0].foglet.inViewID,
    'source': peers[0].foglet.inViewID,
    'target': id
  })
  graph.refresh()
})
peers[0].on('rps-close', (id) => {
  graph.graph.dropEdge(id + '-' + peers[0].foglet.inViewID)
  graph.refresh()
})

let p = []
for (let i = 1; i < max; ++i) {
  p.push(i)
}

p.reduce((acc, i) => acc.then(() => {
  return new Promise((resolve, reject) => {
    let t = new template(undefined, true)
    graph.graph.addNode({
      'id': t.foglet.inViewID,
      'label': i + '',
      'x': i,
      'y': Math.floor(Math.random() * max),
      'size': 3
    })
    t.on('rps-open', (id) => {
      graph.graph.addEdge({
        'id': id + '-' + t.foglet.inViewID,
        'source': t.foglet.inViewID,
        'target': id
      })
      graph.refresh()
    })
    t.on('rps-close', (id) => {
      graph.graph.dropEdge(id + '-' + t.foglet.inViewID)
      graph.refresh()
    })
    const rn = Math.floor(Math.random() * peers.length)
    let p = peers[rn]
    peers.push(t)
    t.connection(p).then(() => {
      graph.refresh()
      setTimeout(resolve, 500)
    }).catch(e => {
      reject(e)
    })
  })
}), Promise.resolve())
