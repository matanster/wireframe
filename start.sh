# Assumes npm install -g nodemon
# for verbose nodemon output run this instead: authbind --deep nodemon -V --ext coffee,js,html,css app.coffee
gulp watch &
authbind --deep nodemon --ext coffee,js,html,css app.coffee --ignore public --ignore mock-data

