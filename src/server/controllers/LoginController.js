const fetch = require('node-fetch');
const config = require('../config/config.js');

const loginApiConfig = {
  endPoint: config.endpoints.login
};

const LoginController = {
  async validateSignIn(userName, userPass) {
    const url = `${loginApiConfig.endPoint}`;

    const reqBody = {
      userName: `${userName}`,
      userPass: `${userPass}`
    };

    const OPTIONS = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    };

    const result = await fetch(url, OPTIONS);
    const finalResult = await result.json();
    console.log('finalResult : ' + JSON.stringify(finalResult));
    return finalResult;
  }
};

module.exports = LoginController;
