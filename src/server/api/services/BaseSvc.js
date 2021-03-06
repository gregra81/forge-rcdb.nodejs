import ServiceManager from './SvcManager'
import EventEmitter from 'events'

export default class BaseSvc extends EventEmitter {

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  constructor(config = {}) {

    super()

    this._config = config
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  name() {

    return this._config.name || this._name
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  config() {

    return this._config
  }
}
