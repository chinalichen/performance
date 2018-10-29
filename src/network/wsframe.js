import { generateID } from "../utils.js/id";

const WSFrameTypes = {
  graphqlResponse: 0,
  notification: 1,
};

const WSQueryTypes = {
  query: 'query',
  mutation: 'mutation',
};

function getRequestType(query) {
  const type = query.slice(0, query.indexOf('{'));
  return WSQueryTypes[type] || WSQueryTypes.query;
}

export class WSRequest {
  constructor(query, callback) {
    this.requestID = generateID(10);
    this.requestBody = { query };

    this.callback = callback;
    this.timestamp = Date.now();
    this.fingerprint = query.slice(0, 120);
    this.requestType = getRequestType(query);
  }

  toWSFrame() {
    return {
      requestID: this.requestID,
      requestBody: this.requestBody,
      requestDate: new Date(new Date().setHours(0, 0, 0, 0)),
    };
  }
}

export class WSResponse {
  constructor(frame) {
    if (frame) {
      this.fromWSFrame(frame);
    } else {
      this.frameType = WSFrameTypes.graphqlResponse;
      this.requestID = '';
      this.response = '';
    }
    this.timestamp = Date.now();
  }

  isNotification() {
    return this.frameType === WSFrameTypes.notification;
  }

  isGraphqlResponse() {
    return this.frameType === WSFrameTypes.graphqlResponse;
  }

  fromWSFrame(frame) {
    if (frame.frameType === WSFrameTypes.graphqlResponse) {
      this.fromGraphqlFrame(frame);
    } else {
      this.fromNotification(frame);
    }
  }

  fromGraphqlFrame(frame) {
    this.frameType = frame.frameType;
    this.requestID = frame.requestID;
    this.response = frame.response;
  }

  fromNotification(frame) {
    this.frameType = frame.frameType;
    this.response = frame;
  }
}
