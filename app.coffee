# Get config (as much as it overides defaults)
fs = require('fs')
nconf = require('nconf')
nconf.argv().env()

#
# Express module dependencies.
#
express = require 'express'
http    = require 'http'
path    = require 'path'

# Regular module dependencies
logging = require './logging'
errorHandling = require './errorHandling'
authorization = require './authorization'

logging.init()

app = express()

#
# Configure and start express
#
env = nconf.get('env')
logging.logGreen "Starting in mode #{env}"
logging.log('Starting in mode ' + env) 

# Get-or-default basic networking config
nconf.defaults host: 'localhost'
host = nconf.get 'host'
logging.logGreen 'Using hostname ' + host
app.set 'port', process.env.PORT or 80
logging.logGreen 'Using port ' + app.get('port')

#
# Configure express middlewares. Order DOES matter.
#
app.set 'views', __dirname + '/views'
app.set 'view engine', 'ejs'
app.use express.favicon()

# Set up the connect.js logger used by express.js
# See http://www.senchalabs.org/connect/logger.html for configuration options.
# (specific logging info and colors can be configured if custom settings are not enough)
if env is 'production'
  app.use express.logger('default')    # This would be verbose enough for production
  
  # require http Basic Auth authentication 
  app.use(express.basicAuth((user, pass) ->
    if user is 'demo' and pass is 'articlio'
      console.warn 'user authenticated through basic auth'
      return true
    else
      console.info "user failed authenticating through basic auth - failed username was #{user}"
      return false
    ))

else 
  app.disable('etag');                 # helping to avoid browser caching
  app.use express.logger('dev')        # dev is colorful (for a terminal) and not overly verbose

app.use express.bodyParser()
#app.use express.multipart()
app.use express.methodOverride()
app.use express.cookieParser('93AAAE3G205OI33')
app.use express.session()
app.use app.router
#app.use require('stylus').middleware(__dirname + '/public')
app.use express.static(path.join(__dirname, 'public'))

#
# Setup some routing
#
app.get '/getData', require('./ajax/getMockData').get

startServer = () ->
  #
  # Start the server
  #
  server = http.createServer(app)

  server.timeout = 0

  server.listen app.get('port'), ->
    logging.logGreen 'Server listening on port ' + app.get('port') + '....'

  ### 
  # In dev mode, self-test on startup
  #
  unless env is 'production' 

    testFile = 'rwUEzeLnRfKgNh23R82W'
    testUrl = 'http://localhost/handleInputFile?inkUrl=https://www.filepicker.io/api/file/' + testFile
    http.get(testUrl, (res) ->
      logging.logBlue 'Server response to its own synthetic client is: ' + res.statusCode)
  ###


selfMonitor = require('./selfMonitor').start()
startServer()
