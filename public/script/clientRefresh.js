if (window.location.hostname.indexOf("heroku") == -1) { // run if not hosted on Heroku
  console.log('clientConnect starting')
  var primus = new Primus('http://'+ window.location.hostname + ':' + 3000);

  primus.on('data', function message(data) {
    console.log('@@@ refreshing by gulp ' + data + ' request @@@');
    document.location.reload(true);         
    });
}