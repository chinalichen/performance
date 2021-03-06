import { log } from '../utils/console';
import WebSocket from 'ws';
import { WSRequest, WSResponse } from './wsframe';
import { getBookQuery } from './graphql/index.js';

// const ws = 'ws://localhost:9898/api/ws'

export default class Client {
  constructor(addr, cookie) {
    this.ws = addr;
    this.cookie = cookie;
    this.socket = null;
    this.requests = {};

    this.handleMessage = this.handleMessage.bind(this);
  }
  handleMessage(event) {
    if (!event || !event.data) {
      log('websocket return null data');
      return;
    }
    try {
      const frame = JSON.parse(event.data);
      const wsRes = new WSResponse(frame);
      if (wsRes.isGraphqlResponse()) {
        const request = this.requests[wsRes.requestID];
        delete this.requests[wsRes.requestID];
        if (!request) {
          log('can not find request, response id:', wsRes.requestID);
          return;
        }

        const callback = request.callback;
        if (typeof callback === 'function') {
          callback(wsRes.response.data, wsRes.response.errors);
        }
      } else if (wsRes.isNotification()) {
        log('received notification', wsRes.response)
      } else if (wsRes.response.errors && wsRes.response.errors.length > 0) {
        log('server response error ', wsRes.response.errors);
      }
    } catch (e) {
      log('Error on parsing the message from server ', e);
    }
  }
  async getSocket() {
    const self = this;
    return new Promise((resolve) => {
      function get() {
        if (!self.socket) {
          self.socket = new WebSocket(self.ws, { headers: { cookie: self.cookie } });
          self.socket.addEventListener('close', (...e) => {
            log('websocket connection has been closed.', e)
          });
          self.socket.addEventListener('error', (evt) => {
            log('webocket connection has been closed cause', evt);
          });
          self.socket.addEventListener('message', self.handleMessage);
          self.pingHandler = setInterval(() => self.socket.ping(), 30000);
        }
        if (self.socket) {
          if (self.socket.readyState !== self.socket.OPEN) {
            setTimeout(get, 100);
          } else {
            return resolve(self.socket);
          }
        }
      }
      get();
    });
  }
  async sendQuery(query) {
    const socket = await this.getSocket();
    return new Promise((resolve, reject) => {
      const request = new WSRequest(query, (data, errors) => {
        if (data) {
          resolve(data);
          if (errors) {
            log('server return data and errors, errors:', errors);
          }
        } else {
          reject(errors);
        }
      });
      this.requests[request.requestID] = request;
      socket.send(JSON.stringify(request.toWSFrame()))
    });
  }
  async getBook(id) {
    const book = await this.sendQuery(getBookQuery(id));
    return book.getBook;
  }
  close() {
    if (this.pingHandler != null) {
      clearInterval(this.pingHandler);
    }
  }
}
