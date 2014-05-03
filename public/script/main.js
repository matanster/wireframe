(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./myAjax":3}],2:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
var calcEnd, calcStart, data, sceneDefine, sceneSync, svg, syncInit, util, viewport;

util = require('./util');

data = require('./data');

console.log('javascript main started');

svg = {};

viewport = null;

calcStart = function() {
  return 90;
};

calcEnd = function() {
  return 90;
};

sceneDefine = function() {
  var boxBlock, main, textPort, titlePort;
  main = function() {
    return svg.main = d3.select('body').append('svg').style('background-color', '#222222');
  };
  boxBlock = function(numberOfBoxes) {
    var box, colorScale, colorTransition, newElement, _i, _ref, _results;
    colorScale = d3.scale.linear().domain([0, numberOfBoxes - 1]).range(['#CCCCE0', '#AAAABE']);
    colorTransition = function(i) {
      return function() {
        return d3.select(this).transition().duration(25).ease('circle').style('fill', colorScale(i));
      };
    };
    svg.boxes = [];
    _results = [];
    for (box = _i = 0, _ref = numberOfBoxes - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; box = 0 <= _ref ? ++_i : --_i) {
      newElement = svg.main.append('rect').style('fill', colorScale(box)).style('stroke-width', '0px').style('stroke', 'black');
      newElement.on('mouseover', function() {
        return d3.select(this).transition().duration(300).ease('circle').style('fill', '#999999');
      }).on('mouseout', colorTransition(box));
      _results.push(svg.boxes[box] = {
        'element': newElement
      });
    }
    return _results;
  };
  textPort = function() {
    svg.textPortBoundary = svg.main.append('rect').style('stroke', '#999999').style('fill', '#222222');
    return svg.textPort = svg.main.append('rect').style('stroke', '#222222').style('fill', '#222222');
  };
  titlePort = function() {
    svg.titlePort = svg.main.append('rect').style('stroke', '#999999').style('fill', '#FFEEBB');
    return svg.title = svg.main.append('text').style("text-anchor", "middle").text("Entrepreneurship in 2020 - a Projection");
  };
  main();
  boxBlock(6);
  textPort();
  return titlePort();
};

sceneSync = function() {
  var boxH, end, i, start, totalH, _i, _j, _ref, _ref1, _results;
  viewport = util.getViewport();
  console.dir(viewport);
  start = calcStart();
  end = 0;
  totalH = viewport.height - start - end;
  boxH = totalH / svg.boxes.length;
  svg.main.attr('width', viewport.width).attr('height', viewport.height);
  svg.textPortBoundary.attr('width', 800).attr('height', totalH + end + 19).attr('x', 300).attr('y', start + 5).style('stroke-width', '25px').attr('rx', 10).attr('rx', 10);
  svg.textPort.attr('width', 800 - 10).attr('height', totalH + end + 19).attr('x', 300 + 5).attr('y', start + 5 + 5).style('stroke-width', '15px').attr('rx', 10).attr('rx', 10);
  svg.titlePort.attr('width', viewport.width).attr('height', start).attr('x', 0).attr('y', 0).style('stroke-width', '7px').attr('rx', 10).attr('rx', 10);
  svg.title.attr('x', viewport.width / 2).attr('y', start / 2).style('fill', "#999999").style('font-family', 'Helvetica').style("font-weight", "bold").attr("font-size", "25px").attr("dominant-baseline", "central");
  for (i = _i = 0, _ref = svg.boxes.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    svg.boxes[i].x1 = -20;
    svg.boxes[i].y1 = start + Math.floor(boxH * i) - 0.5;
    svg.boxes[i].x2 = 300;
    if (i === svg.boxes.length - 1) {
      svg.boxes[i].y2 = start + totalH + 0.5;
    } else {
      svg.boxes[i].y2 = start + Math.floor(boxH * (i + 1)) - 0.5;
    }
    console.log(svg.boxes[i].y1);
    console.log(svg.boxes[i].y2);
    console.log('---');
  }
  _results = [];
  for (i = _j = 0, _ref1 = svg.boxes.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
    _results.push(svg.boxes[i].element.attr('x', svg.boxes[i].x1).attr('width', util.calcLength(svg.boxes[i].x1, svg.boxes[i].x2)).attr('y', svg.boxes[i].y1).attr('height', util.calcLength(svg.boxes[i].y1, svg.boxes[i].y2)));
  }
  return _results;
};

syncInit = function() {
  sceneSync();
  return window.onresize = function() {
    return sceneSync();
  };
};

data.get('abstract', function(response) {
  return console.log(response);
});

sceneDefine();

syncInit();

},{"./data":1,"./util":4}],3:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
exports.go = function(url, postData, callback) {
  var ajaxRequest;
  ajaxRequest = new XMLHttpRequest();
  console.log('Making ajax call to ' + url);
  ajaxRequest.onreadystatechange = function() {
    if (ajaxRequest.readyState === 4) {
      if (ajaxRequest.status === 200) {
        console.log('Ajax call to ' + url + ' succeeded.');
        return callback(ajaxRequest.responseText);
      } else {
        return console.error('Ajax call to ' + url + ' failed');
      }
    }
  };
  if (postData != null) {
    console.log('ajax request includes post data');
    ajaxRequest.open('POST', url, false);
    ajaxRequest.setRequestHeader("Content-type", "application/json");
    return ajaxRequest.send(postData);
  } else {
    ajaxRequest.open('GET', url, true);
    return ajaxRequest.send(null);
  }
};

},{}],4:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
exports.getViewport = function() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

exports.calcLength = function(i1, i2) {
  return i2 - i1 + 1;
};

},{}]},{},[2])