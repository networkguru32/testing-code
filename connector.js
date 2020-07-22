const request = require('request');

const validResponseRegex = /(2\d\d)/;

class ServiceNowConnector {
  constructor(options) {
    this.options = options;
  }
  get(callback) {
    let getCallOptions = { ...this.options };
    getCallOptions.method = 'GET';
    getCallOptions.query = 'sysparm_limit=1';
    this.sendRequest(getCallOptions, (results, error) => this.callback(this.processRequestResults, error));
    console.log(callback);
  }
  post(callback) {
    let getCallOptions = { ...this.options };
    getCallOptions.method = 'POST';
    getCallOptions.query = null;
    this.sendRequest(getCallOptions, (results, error) => this.callback(this.processRequestResults, error));
  }
  sendRequest(callOptions, callback) {
    if (callOptions.query)
      callOptions.uri = this.buildUri(callOptions.serviceNowTable, callOptions.query);
    else
      callOptions.uri = this.buildUri(callOptions.serviceNowTable);
    const requestOptions = {
        method: callOptions.method,
        auth: {
            user: callOptions.username,
            pass: callOptions.password,
        },
        baseUrl: callOptions.url,
        uri: callOptions.uri,
    };
    request(requestOptions, (error, response, body) => {
        this.processRequestResults(error, response, body, (processedResults, processedError) => this.callback(processedResults, processedError));
    });
    console.log(this.callback.data);
    return this.response;
  }
  buildUri(serviceNowTable, query) {
    let uri = `/api/now/table/${serviceNowTable}`;
    if (query) {
        uri = `/api/now/table/${serviceNowTable}` + '?' + query;
    }
    return uri;
  }
  /**
  * @param {iapCallback} callback - Callback a function.
  */
  processRequestResults(error, response, body, callback) {
      const checkHibernate = {
          body: body,
          response: response,
      };
      if (this.isHibernating(checkHibernate)) {
          console.error('ServiceNow is hibernating - wake it up');
          callback.error = 'ServiceNow is hibernating - wake it up';
      } else  if (error) {
          console.error(callbackError);
          callback.error = 'There was an error in the request';
      } else {
          callback.data = {
              response,
          };
          callback.error = null;
      }
      return this.callback(callback.data, callback.error);
  }
  isHibernating(response) {
      return response.body.includes('hibernating')
      && response.body.includes('<html>')
      && response.response.statusCode === 200;
  }
  callback() {}
}
module.exports = ServiceNowConnector;