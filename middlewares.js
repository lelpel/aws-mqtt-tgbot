exports.publishMiddleware = (ctx, next) => {
  aws.publish(ctx.message.text);
  next();
};

exports.logMiddleware = (ctx, next) => {
  console.log(ctx.message.text);
  next();
};
