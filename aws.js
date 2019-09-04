const AWS = require("aws-sdk");
const AWSMqttClient = require("aws-mqtt/lib/NodeClient");
const config = require("./config");
const publishMessage = require("aws-mqtt/lib/publishMessage");
class AWSHelper {
  constructor(onMessage) {
    // Initialize the Amazon Cognito credentials provider
    AWS.config.loadFromPath("./c2.json");
    // AWS.config.region = config.aws.region;
    // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //   IdentityPoolId: config.aws.cognito.identityPoolId
    // });

    this.client = new AWSMqttClient({
      region: AWS.config.region,
      credentials: AWS.config.credentials,
      endpoint: config.aws.iot.endpoint,
      clientId: "mqtt-client-" + Math.floor(Math.random() * 100000 + 1)
    });

    console.log("DIDIT");

    this.client.on("connect", () => {
      console.log("connected");
      this.subscribe();
      this.publish("Тупое говно тупого говна");
    });

    this.client.on("message", (topic, message) => {
      console.log(`Topic = ${topic}, message = ${message}`);
    });
  }

  publish(message = "Hello world", topic = config.topics.test) {
    this.client.publish(topic, message);
    console.log("Success (simple)");
  }

  publishLambda(message = "Hello world", topic = config.topics.test) {
    publishMessage(
      {
        region: AWS.config.region,
        endpoint: config.aws.iot.endpoint,
        credentials: AWS.config.credentials
      },
      topic,
      message
    ).then(() => console.log("Success"), console.error);
  }
  subscribe(topic = config.topics.test, errorCb = undefined) {
    this.client.subscribe(topic, errorCb);
    console.log(`Subscribed to a topic ${topic}`);
  }
}

module.exports = AWSHelper;
