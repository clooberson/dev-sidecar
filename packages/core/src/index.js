/**
 * dev-sidecar core module
 * Main entry point for the core package
 */

'use strict'

const proxy = require('./proxy')
const config = require('./config')
const api = require('./api')

const Core = {
  /**
   * Initialize the core module with optional config overrides
   * @param {object} options - Initialization options
   * @param {object} options.config - Config overrides
   * @param {function} options.logger - Custom logger function
   * @param {boolean} options.silent - Suppress startup logs
   */
  async start(options = {}) {
    // Load and merge configuration
    await config.load(options.config)

    // Set up logger
    if (options.logger) {
      this.logger = options.logger
    }

    // Start proxy server
    await proxy.start(config.get())

    // Allow silent mode to suppress console output (handy when embedding)
    if (!options.silent) {
      console.log('[dev-sidecar] Core started successfully')
    }
    return this
  },

  /**
   * Stop all running services
   */
  async stop() {
    await proxy.stop()
    console.log('[dev-sidecar] Core stopped')
  },

  /**
   * Restart the core services
   */
  async restart() {
    await this.stop()
    await this.start()
  },

  /**
   * Get current status of the proxy
   * @returns {object} Status object
   */
  status() {
    return {
      proxy: proxy.status(),
      config: config.get(),
    }
  },

  /**
   * Expose config module for external access
   */
  config,

  /**
   * Expose proxy module for external access
   */
  proxy,

  /**
   * Expose API module for external access
   */
  api,
}

module.exports = Core
