const AWS = require("aws-sdk");
const AWSMqttClient = require("aws-mqtt/lib/NodeClient");
const config = require("./config");

class AwsMqttClient {
  constructor(onMessage) {
    AWS.config.loadFromPath("./credentials.json");

    this.client = new AWSMqttClient({
      region: AWS.config.region,
      credentials: AWS.config.credentials,
      endpoint: config.aws.iot.endpoint,
      clientId: "mqtt-client-" + Math.floor(Math.random() * 100000 + 1)
    });

    this.client.on("connect", () => {
      console.log("connected");
      this.subscribe();
      this.publish();
    });

    this.client.on("message", (topic, message) => {
      onMessage(topic, message);
      console.log(`Topic = ${topic}, message = ${message}`);
    });
  }

  publish(message = config.test.message, topic = config.topics.test) {
    this.client.publish(topic, message);
  }

  subscribe(topic = config.topics.test, cb = undefined) {
    this.client.subscribe(topic, cb);
  }
}

module.exports = AwsMqttClient;
