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
var calcEnd, calcStart, data, layout, sceneDefine, sceneSync, svg, syncInit, tokenize, tokens, util, viewport, viewporting;

util = require('./util');

data = require('./data');

tokenize = require('./tokenize');

viewporting = require('./viewporting/viewporting');

console.log('read.js main started');

svg = {};

viewport = null;

tokens = void 0;

calcStart = function() {
  return 90;
};

calcEnd = function() {
  return 90;
};

layout = {
  'separator': {
    'left': {
      'x': 300
    }
  }
};

sceneDefine = function(categories) {
  var boxBlock, main, textPort, titlePort;
  main = function() {
    return svg.main = d3.select('body').append('svg').style('background-color', '#222222');
  };
  boxBlock = function(categories) {
    var box, categoryBox, colorScale, colorTransition, numberOfBoxes, rectangle, text, _i, _ref, _results;
    console.log(categories);
    numberOfBoxes = categories.length;
    colorScale = d3.scale.linear().domain([0, numberOfBoxes - 1]).range(['#CCCCE0', '#AAAABE']);
    colorTransition = function(i) {
      return function() {
        return d3.select(this).transition().duration(25).ease('circle').style('fill', colorScale(i));
      };
    };
    svg.boxes = [];
    _results = [];
    for (box = _i = 0, _ref = numberOfBoxes - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; box = 0 <= _ref ? ++_i : --_i) {
      categoryBox = svg.main.append('g');
      categoryBox.style('-webkit-user-select', 'none').style('-webkit-touch-callout', 'none').style('user-select', 'none');
      rectangle = categoryBox.append('rect').style('fill', colorScale(box)).style('stroke-width', '0px').style('fill-opacity', '1');
      text = categoryBox.append('text').text(categories[box]).style("text-anchor", "middle").attr("dominant-baseline", "central").style("font-family", "Helvetica").style("font-weight", "bold").style('fill', '#EEEEEE');
      rectangle.on('mouseover', function() {
        return d3.select(this).transition().duration(300).ease('circle').style('fill', '#999999');
      }).on('mouseout', colorTransition(box));
      svg.boxes[box] = {};
      svg.boxes[box].element = rectangle;
      _results.push(svg.boxes[box].text = text);
    }
    return _results;
  };
  textPort = function() {
    svg.textPortBoundary = svg.main.append('rect').style('stroke', '#999999').style('fill', '#222222').on('mouseover', function() {
      return this.style.cursor = "ew-resize";
    }).on('mouseout', function() {
      return this.style.cursor = "default";
    }).on('mousedown', function() {
      var element, widthInitialBoundary, widthInitialText, xInitial;
      this.style.cursor = "ew-resize";
      xInitial = event.clientX;
      widthInitialBoundary = svg.textPortBoundary.attr('width');
      widthInitialText = svg.textPort.attr('width');
      element = d3.select(this);
      window.onmousemove = function(event) {
        var xDiff;
        xDiff = xInitial - event.clientX;
        svg.textPortBoundary.attr('width', widthInitialBoundary - xDiff);
        svg.textPort.attr('width', widthInitialText - xDiff);
        return viewporting(tokens, svg.main, svg.textPort);
      };
      window.onmouseup = function(event) {
        window.onmousemove = null;
        event.target.style.cursor = "default";
        return element.transition().duration(500).style('stroke', '#999999');
      };
      element.transition().duration(300).style('stroke', '#FFEEBB');
    });
    return svg.textPort = svg.main.append('rect').style('stroke', '#222222').style('fill', '#222222');
  };
  titlePort = function() {
    svg.titlePort = svg.main.append('rect').style('stroke', '#999999').style('fill', '#FFEEBB');
    return svg.title = svg.main.append('text').text("Entrepreneurship in 2020 - a Projection").style("text-anchor", "middle");
  };
  main();
  boxBlock(categories);
  textPort();
  titlePort();
  svg.fontSize = svg.main.append("g");
  svg.fontDecreaseButton = svg.fontSize.append("svg:image").attr("xlink:href", "fontSmall.svg");
  svg.fontIncreaseButton = svg.fontSize.append("svg:image").attr("xlink:href", "fontLarge.svg");
  svg.fontDecreaseButton.on('mouseover', function() {
    return console.log('hover');
  }).on('mousedown', function() {
    console.log('click font decrease');
    return viewporting(tokens, svg.main, svg.textPort, -2);
  });
  return svg.fontIncreaseButton.on('mouseover', function() {
    return console.log('hover');
  }).on('mousedown', function() {
    console.log('click font increase');
    return viewporting(tokens, svg.main, svg.textPort, 2);
  });
};

sceneSync = function() {
  var boxH, end, fontButtonGeometry, height, i, start, totalH, width, _i, _j, _ref, _ref1, _results;
  viewport = util.getViewport();
  console.dir(viewport);
  start = calcStart();
  end = 0;
  totalH = viewport.height - start - end;
  boxH = totalH / svg.boxes.length;
  svg.main.attr('width', viewport.width).attr('height', viewport.height);
  layout.separator.right = {
    'x': viewport.width - (2 * layout.separator.left.x)
  };
  svg.textPortBoundary.attr('width', layout.separator.right.x).attr('height', totalH + end + 19).attr('x', layout.separator.left.x).attr('y', start + 5).style('stroke-width', '25px').attr('rx', 10).attr('rx', 10);
  svg.textPort.attr('width', layout.separator.right.x - 10).attr('height', totalH + end + 19).attr('x', layout.separator.left.x + 5).attr('y', start + 5 + 5).style('stroke-width', '15px').attr('rx', 10).attr('rx', 10);
  svg.titlePort.attr('width', viewport.width).attr('height', start).attr('x', 0).attr('y', 0).style('stroke-width', '7px').attr('rx', 10).attr('rx', 10);
  svg.title.attr('x', viewport.width / 2).attr('y', start / 2).style('fill', "#999999").style('font-family', 'Helvetica').style("font-weight", "bold").attr("font-size", "25px").attr("dominant-baseline", "central");
  if (tokens != null) {
    viewporting(tokens, svg.main, svg.textPort);
  }
  fontButtonGeometry = {
    'width': 398 * 0.08,
    'height': 624 * 0.08
  };
  svg.fontDecreaseButton.attr('x', viewport.width - (fontButtonGeometry.width * 2) - 7).attr('y', start - fontButtonGeometry.height - 7).attr('width', fontButtonGeometry.width).attr('height', fontButtonGeometry.height);
  svg.fontIncreaseButton.attr('x', viewport.width - fontButtonGeometry.width - 7 - 1).attr('y', start - fontButtonGeometry.height - 7).attr('width', fontButtonGeometry.width).attr('height', fontButtonGeometry.height);
  for (i = _i = 0, _ref = svg.boxes.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    svg.boxes[i].x1 = 0;
    svg.boxes[i].y1 = start + Math.floor(boxH * i) - 0.5;
    svg.boxes[i].x2 = layout.separator.left.x;
    if (i === svg.boxes.length - 1) {
      svg.boxes[i].y2 = start + totalH + 0.5;
    } else {
      svg.boxes[i].y2 = start + Math.floor(boxH * (i + 1)) - 0.5;
    }
    width = util.calcLength(svg.boxes[i].x1, svg.boxes[i].x2);
    height = util.calcLength(svg.boxes[i].y1, svg.boxes[i].y2);
    /*
    console.log svg.boxes[i].y1
    console.log svg.boxes[i].y2
    console.log '---'
    */

  }
  _results = [];
  for (i = _j = 0, _ref1 = svg.boxes.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
    svg.boxes[i].element.attr('x', svg.boxes[i].x1).attr('width', width).attr('y', svg.boxes[i].y1).attr('height', height);
    _results.push(svg.boxes[i].text.attr('x', svg.boxes[i].x1 + width / 2).attr('y', svg.boxes[i].y1 + height / 2));
  }
  return _results;
};

syncInit = function() {
  sceneSync();
  return window.onresize = function() {
    return sceneSync();
  };
};

data.get('categories', function(response) {
  var categories;
  console.log(response);
  categories = JSON.parse(response);
  sceneDefine(categories.names);
  syncInit();
  return document.body.style.cursor = "default";
});

data.get('abstract', function(response) {
  console.log(response);
  tokens = tokenize(response);
  console.dir(tokens);
  return viewporting(tokens, svg.main, svg.textPort);
});

},{"./data":1,"./tokenize":4,"./util":5,"./viewporting/viewporting":6}],3:[function(require,module,exports){
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
module.exports = function(textStream) {
  return JSON.parse(textStream).text.split(' ');
};

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
var anchorSVG, fontSize;

fontSize = '18px';

anchorSVG = void 0;

module.exports = function(tokens, mainSVG, textPortSVG, fontSizeChange) {
  var fontFamily, paddingX, paddingY, spaceWidth, textPort, token, tokenToViewable, tokenViewable, viewPortFull, x, y, _i, _len, _results;
  console.log('textPorting started');
  if (fontSizeChange != null) {
    fontSize = parseFloat(fontSize) + fontSizeChange + 'px';
  }
  paddingX = 10;
  paddingY = 20;
  textPort = {
    'width': parseFloat(textPortSVG.attr('width') - (paddingX * 2)),
    'height': parseFloat(textPortSVG.attr('height') - (paddingY * 2)),
    'x': parseFloat(textPortSVG.attr('x')) + paddingX,
    'y': parseFloat(textPortSVG.attr('y')) + paddingY
  };
  fontFamily = 'Helvetica';
  tokenToViewable = function(token) {
    var height, svg, visualToken, width;
    visualToken = {};
    svg = anchorSVG.append('text').attr('y', -100).attr('x', -100);
    svg.text(token);
    width = svg.node().getBBox().width;
    height = svg.node().getBBox().height;
    visualToken.svg = svg;
    visualToken.height = height;
    visualToken.width = width;
    return visualToken;
  };
  if (anchorSVG != null) {
    anchorSVG.remove();
  }
  anchorSVG = mainSVG.append('svg').style('text-anchor', 'start').style('fill', '#EEEEEE').style('font-family', fontFamily).style('font-size', fontSize);
  spaceWidth = tokenToViewable('a a').width - tokenToViewable('aa').width;
  viewPortFull = false;
  x = 0;
  y = 0;
  _results = [];
  for (_i = 0, _len = tokens.length; _i < _len; _i++) {
    token = tokens[_i];
    tokenViewable = tokenToViewable(token);
    if (x + tokenViewable.width < textPort.width) {
      tokenViewable.svg.attr('x', textPort.x + x);
      tokenViewable.svg.attr('y', textPort.y + y);
      x += tokenViewable.width;
    } else {
      if (y + tokenViewable.height < textPort.height) {
        x = 0;
        y += tokenViewable.height;
        tokenViewable.svg.attr('x', textPort.x + x);
        tokenViewable.svg.attr('y', textPort.y + y);
        x += tokenViewable.width;
      } else {
        console.log('text port full');
        viewPortFull = true;
        break;
      }
    }
    if (x + spaceWidth < textPort.width) {
      _results.push(x += spaceWidth);
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

},{}]},{},[2])