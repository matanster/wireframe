// Generated by CoffeeScript 1.6.3
var Primus, http, logSpark, logging, server, sparkServer, sparks;

Primus = require('primus');

http = require('http');

logging = require('./logging');

logSpark = function(spark, message) {
  return logging.logBlue('Spark ' + spark.id + ' from ' + spark.address.ip + ' ' + message + ' (now ' + sparks + ' total sparks active)');
};

server = http.createServer().listen(3000);

sparkServer = new Primus(server, {
  transformer: 'websockets'
});

sparkServer.save('./public/script/primus.js');

logging.logBlue('Sparks server listening on port ' + 3000 + '....');

sparks = 0;

sparkServer.on('connection', function(spark) {
  sparks += 1;
  return logSpark(spark, 'connected on port ' + spark.address.port);
});

sparkServer.on('disconnection', function(spark) {
  sparks -= 1;
  return logSpark(spark, 'disconnected');
});

exports.broadcast = function() {
  return sparkServer.write('refresh');
};