module.exports = {
  aws: {
    region: "us-east-2", // e.g. us-east-1
    iot: {
      endpoint: "a11ow6ulqpved5-ats.iot.us-east-2.amazonaws.com" // NOTE: get this value with `aws iot describe-endpoint`
    },
    cognito: {
      identityPoolId: "us-east-2:5ae16ed1-7e42-4268-9661-ecbe790c4990"
    }
  },
  topics: {
    test: "/test3"
  }
};
