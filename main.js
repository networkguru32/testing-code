const options = {
  url: 'https://dev96206.service-now.com/',
  username: 'admin',
  password: 'Sh1tst0rm!',
  serviceNowTable: 'change_request'
};

const path = require('path');

const ServiceNowConnector = require(path.join(__dirname, './connector.js'));

function mainOnObject() {
  const connector = new ServiceNowConnector(options);
  connector.get();
  connector.post();
}

mainOnObject();