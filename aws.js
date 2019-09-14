const AWS = require("aws-sdk");
const AWSMqttClient = require("aws-mqtt/lib/NodeClient");
const config = require("./config");

/** This class handles AWS Mqtt Server connections and messaging */
class AwsMqtt {
  /**
   * @constructor
   * @param {function} onMessage callback when message is recieved
   */
  constructor(onMessage) {
    AWS.config.loadFromPath("./credentials.json");

    this.client = new AWSMqttClient({
      region: AWS.config.region, //AWS Region, e.g. 'us-east-1'
      credentials: AWS.config.credentials,
      endpoint: config.aws.iot.endpoint, // REST API endpoint
      clientId: "mqtt-client-" + Math.floor(Math.random() * 100000 + 1)
    });

    /**
     * Handle connections
     */
    this.client.on("connect", () => {
      console.log("connected");
    });

    /**
     * Handle message recieval
     */
    this.client.on("message", (topic, message) => {
      onMessage(topic, message);
      console.log(`Topic = ${topic}, message = ${message}`);
    });
  }

  /**
   * Sends message to AWS Server
   *
   * For debug purposes, method sends test message if arguments is not defined
   * @param {string} message User's message
   * @param {string} topic Message topic
   */
  publish(message = config.test.message, topic = config.topics.test) {
    this.client.publish(topic, message);
  }

  /**
   * Subscribe to a topic
   *
   * @param {string} topic Topic
   * @param {function} cb Callback: client is subscribed
   */
  subscribe(
    topic = config.topics.test,
    cb = (error, granted) => {
      error ? console.log(error) : console.log(granted);
    }
  ) {
    this.client.subscribe(topic, cb);
  }
}

module.exports = AwsMqtt;
