 console.log('clientConnect starting')
 var primus = new Primus('http://'+ window.location.hostname + ':' + 3000);

      primus.on('data', function message(data) {
        console.log('@@@ refreshing by gulp ' + data + ' request @@@');
        document.location.reload(true);         
        });
      