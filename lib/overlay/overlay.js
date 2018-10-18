const TMAN = require("./abstract");
const debug = require("debug")("template:overlay");

module.exports = class Overlay extends TMAN {
  constructor(...Args) {
    super(...Args);
    debug("Overlay initialized");
    this.rps._partialViewSize = () => this.options.maxPeers;
    this.rps._sampleSize = () => this.options.maxPeers;
    this._start();
  }

  /**
   * Gives the start descriptor used by the TMan overlay (can be an empty object).
   * Subclasses of {@link TManOverlay} **must** implement this method.
   * @return {Object} The start descriptor used by the TMan overlay
   */
  _startDescriptor() {
    return {
      id: "test",
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10)
    };
  }

  _start(delay = this.options.delta) {
    this.periodic = setInterval(() => {
      //console.log("Delta is here", this.getNeighbours())
      // this._manager.overlay('tman')._network._rps.neighbours().inview.map(el => el.peer)
      this._manager.overlay('tman')._network._rps.neighbours().inview.map(el => el.peer).forEach(peerId => {
        this._manager
          .overlay("tman")
          ._network._rps.unicast.emit(
            "requestDescriptor",
            peerId,
            this._manager.overlay("tman")._network._rps.getOutviewId()
          )
          .catch(e => {
            console.error(e);
          });
      });
    }, /*delay * 0.5*/ 2* 1000);
  }

  /**
   * Give the delay **in milliseconds** after which the descriptor must be recomputed.
   * Subclasses of {@link TManOverlay} **must** implement this method.
   * @return {number} The delay **in milliseconds** after which the descriptor must be recomputed
   */
  _descriptorTimeout() {
    return 5 * 1000;
  }

  /**
   * Compare two peers and rank them according to a ranking function.
   * This function must return `0 if peerA == peerB`, `1 if peerA < peerB` and `-1 if peerA > peerB`.
   *
   * Subclasses of {@link TManOverlay} **must** implement this method.
   * @param {*} neighbour - The neighbour to rank with
   * @param {Object} descriptorA - Descriptor of the first peer
   * @param {Object} descriptorB - Descriptor of the second peer
   * @param {TManOverlay} peerA - (optional) The overlay of the first peer
   * @param {TManOverlay} peerB - (optional) The overlay of the second peer
   * @return {integer} `0 if peerA == peerB`, `1 if peerA < peerB` and `-1 if peerA > peerB` (according to the ranking algorithm)
   */
  _rankPeers(neighbour, descriptorA, descriptorB, peerA, peerB) {
    const getDistance = (descriptor1, descriptor2) => {
      const { x: xa, y: ya } = descriptor1;
      const { x: xb, y: yb } = descriptor2;
      const dx = xa - xb;
      const dy = ya - yb;
      return Math.sqrt(dx * dx + dy * dy);
    };
    const distanceA = getDistance(neighbour.descriptor, descriptorA);
    const distanceB = getDistance(neighbour.descriptor, descriptorB);

    if(distanceA===distanceB){
      // console.log("Equale distance ============================================================", descriptorA.peer);
      if(this.getNeighbours().indexOf(descriptorA.peer)!==-1){
        // console.log("Equale distance");
        return 1;
      }
    }
    return distanceA - distanceB;
  }
};
