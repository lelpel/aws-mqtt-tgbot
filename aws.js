const AWS = require("aws-sdk");
const AWSMqttClient = require("aws-mqtt/lib/NodeClient");

// const credentials = AWS.config.loadFromPath("./config.json");
// AWS.config.region = { credentials };
// AWS.config.credentials = credentials;

class AWSHelper {
  constructor(credentials, region, endpoint, clientId, will, onMessage) {
    console.log(credentials);
    const cobj = {
      IdentityPoolId: credentials.poolId
    };
    console.log(cobj);
    console.log(region);
    this.client = new AWSMqttClient({
      region,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: credentials.poolId
      }),
      endpoint,
      clientId,
      will
    });

    // AWS.config.region = { credentials };
    // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //   IdentityPoolId: credentials.poolId
    // });
    this.client.on("message", onMessage);
  }

  publish(message, topic) {
    this.client.publish(topic, message);
  }

  subscribe(topic, errorCb) {
    this.client.subscribe(topic, errorCb);
  }
}

module.exports = AWSHelper;

// : "mqtt-client-" + Math.floor(Math.random() * 100000 + 1),
// {
//         topic: "WillMsg",
//         payload: "Connection Closed abnormally..!",
//         qos: 0,
//         retain: false
//       }
