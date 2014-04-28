Primus  = require 'primus'
http    = require 'http'
logging = require './logging'

logSpark = (spark, message) -> 
  logging.logBlue('Spark ' + spark.id + ' from ' + spark.address.ip + ' ' + message + ' (now ' + sparks + ' total sparks active)')

# Start sparks server
server = http.createServer().listen(3000)
sparkServer = new Primus(server, { transformer: 'websockets' })
sparkServer.save('./public/script/primus.js');

logging.logBlue 'Sparks server listening on port ' + 3000 + '....'

sparks = 0

# Log spark connections
sparkServer.on('connection', (spark) -> 
  sparks += 1
  logSpark(spark, 'connected on port ' + spark.address.port))

sparkServer.on('disconnection', (spark) ->
  sparks -= 1
  logSpark(spark, 'disconnected'))
  
exports.broadcast = () -> sparkServer.write('refresh') # arbitrary message text here
