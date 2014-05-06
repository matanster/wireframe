// Generated by CoffeeScript 1.6.3
var ajax;

ajax = require('./myAjax');

exports.get = function(data, callback) {
  var ajaxRequest, ajaxTarget, ajaxVerb;
  ajaxTarget = location.protocol + '//' + location.hostname;
  ajaxVerb = 'getData';
  ajaxRequest = ajaxTarget + '/' + ajaxVerb + '?' + 'data=' + data;
  return ajax.go(ajaxRequest, null, function(response) {
    return callback(response);
  });
};