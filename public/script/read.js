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

},{"./myAjax":4}],2:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
var TOCTokens, boxH, calcEnd, calcStart, colors, coreH, data, end, firstEntry, globalDims, layout, navBars, navBarsData, sceneDefine, sceneHook, sceneObject, sceneSync, segments, start, states, svgUtil, syncInit, textDraw, textporting, textportingAbstract, tokenize, tokens, util, viewport, waitForData;

util = require('./util');

data = require('./data');

tokenize = require('./tokenize');

textporting = require('./textporting');

textportingAbstract = require('./textportingAbstract');

textDraw = require('./textDraw');

svgUtil = require('./svgUtil');

navBars = require('./navBars');

globalDims = require('./globalDims');

sceneObject = globalDims.sceneObject;

layout = globalDims.layout;

sceneHook = globalDims.sceneHook;

console.log('read.js main started');

firstEntry = true;

viewport = null;

states = {};

colors = {
  scaleStart: '#87CEFA',
  scaleEnd: '#00BFFF'
};

tokens = void 0;

TOCTokens = [];

navBarsData = void 0;

segments = void 0;

calcStart = function() {
  return 90;
};

calcEnd = function() {
  return 90;
};

layout = {
  'separator': {
    'left': {
      'x': {
        'current': 300
      }
    }
  }
};

layout.separator.left.x.revertsTo = layout.separator.left.x.current;

layout.separator.top = {};

coreH = null;

boxH = null;

end = null;

sceneDefine = function() {
  var TOC, main, mainPanes, navBarHook, rightPane, textPort, titlePort;
  main = function() {
    sceneHook.svg = d3.select('body').append('svg').style('background-color', '#999999');
    return sceneObject.categories = {};
  };
  TOC = function() {
    var fontFamily, fontSize, maxLen, token, tokenViewable, _i, _len;
    sceneObject.TOC = {};
    fontSize = '14px';
    fontFamily = 'verdana';
    sceneObject.TOC.element = sceneHook.svg.append('svg');
    sceneObject.TOC.subElement = sceneObject.TOC.element.append('g').style('text-anchor', 'start').style('fill', 'rgb(50,50,240)').style('font-family', fontFamily).style('font-size', fontSize);
    maxLen = 0;
    for (_i = 0, _len = TOCTokens.length; _i < _len; _i++) {
      token = TOCTokens[_i];
      tokenViewable = textDraw.tokenToViewable(token.text, sceneObject.TOC.element);
      if (tokenViewable.width > maxLen) {
        maxLen = tokenViewable.width;
      }
    }
    sceneObject.TOC.geometry = {
      paddingX: 30
    };
    return sceneObject.TOC.geometry.width = maxLen + (2 * sceneObject.TOC.geometry.paddingX);
  };
  mainPanes = function(categories) {
    var colorScale, colorTransition, numberOfBoxes;
    numberOfBoxes = categories.length;
    colorScale = d3.scale.linear().domain([0, numberOfBoxes - 1]).range([colors.scaleStart, colors.scaleEnd]);
    return colorTransition = function(i) {
      return function() {
        return d3.select(this).transition().duration(25).ease('circle').style('fill', colorScale(i));
      };
    };
  };
  textPort = function() {
    sceneObject.textPortBoundary = {};
    sceneObject.textPortBoundary.element = sceneHook.svg.append('rect').style('stroke', '#999999').style('fill', '#999999').on('mouseover', function() {
      return this.style.cursor = "ew-resize";
    }).on('mouseout', function() {
      return this.style.cursor = "default";
    }).on('mousedown', function() {
      var element, rightInitialSeparator, widthInitialBoundary, widthInitialText, xInitial;
      this.style.cursor = "ew-resize";
      xInitial = event.clientX;
      widthInitialBoundary = sceneObject.textPortBoundary.element.attr('width');
      widthInitialText = sceneObject.textPort.element.attr('width');
      rightInitialSeparator = layout.separator.right.x;
      element = d3.select(this);
      window.onmousemove = function(event) {
        var xDiff;
        xDiff = xInitial - event.clientX;
        layout.separator.right.x = rightInitialSeparator - xDiff;
        layout.separator.right.y = rightInitialSeparator - xDiff;
        sceneObject.textPortBoundary.element.attr('width', widthInitialBoundary - xDiff);
        sceneObject.textPort.element.attr('width', widthInitialText - xDiff);
        textporting(tokens);
        sceneObject.rightPane.redraw();
        return sceneObject.downButton.redraw();
      };
      window.onmouseup = function(event) {
        window.onmousemove = null;
        event.target.style.cursor = "default";
        return element.transition().duration(500).style('stroke', '#999999');
      };
      element.transition().duration(300).style('stroke', '#2F72FF');
    }).on('touchstart', function() {
      var element, widthInitialBoundary, widthInitialText, xInitial;
      element = d3.select(this);
      element.transition().duration(900).style('stroke', '#FFEEBB');
      xInitial = event.changedTouches[0].clientX;
      widthInitialBoundary = sceneObject.textPortBoundary.element.attr('width');
      widthInitialText = sceneObject.textPort.element.attr('width');
      window.ontouchmove = function(event) {
        var xDiff;
        xDiff = xInitial - event.changedTouches[0].clientX;
        sceneObject.textPortBoundary.element.attr('width', widthInitialBoundary - xDiff);
        sceneObject.textPort.element.attr('width', widthInitialText - xDiff);
        return textporting(tokens);
      };
      window.ontouchcancel = function() {
        window.ontouchmove = null;
        return element.transition().duration(600).style('stroke', '#999999');
      };
      window.ontouchleave = function() {
        window.ontouchmove = null;
        return element.transition().duration(600).style('stroke', '#999999');
      };
      return window.ontouchend = function() {
        window.ontouchmove = null;
        return element.transition().duration(600).style('stroke', '#999999');
      };
    });
    sceneObject.textPort = {};
    return sceneObject.textPort.element = sceneHook.svg.append('rect').style('stroke', '#222222').style('fill', '#222222');
  };
  titlePort = function() {
    sceneObject.titlePort = sceneHook.svg.append('g');
    sceneObject.titlePortRect = sceneObject.titlePort.append('rect').style('fill', '#2F72FF');
    sceneObject.titleForeignContainer = sceneObject.titlePort.append('foreignObject').append('xhtml:body').html("<svg style='-webkit-transform: perspective(40px) rotateX(2deg)' id='titleSVG'></svg>");
    return sceneObject.title = d3.select('#titleSVG').append('text').text("  Something Something Something Title").attr("id", "title").attr("dominant-baseline", "central").style("text-anchor", "middle").style('fill', "#EEEEEE");
  };
  rightPane = function() {
    sceneObject.rightPane = {};
    sceneObject.rightPane.element = sceneHook.svg.append('rect').style('fill', '#999999').style('fill-opacity', '1');
    sceneObject.rightPane.geometry = {};
    sceneObject.rightPane.geometry = {
      'hoverIgnoreAreaX': 30,
      'hoverIgnoreAreaY': 30
    };
    sceneObject.rightPane.element.on('mouseover', function() {
      return sceneObject.rightPane.element.on('mousemove', function() {
        if (event.x > layout.separator.right.x + sceneObject.rightPane.geometry.hoverIgnoreAreaX) {
          if (event.y > layout.separator.top.y + sceneObject.rightPane.geometry.hoverIgnoreAreaY && event.y < viewport.height - sceneObject.rightPane.geometry.hoverIgnoreAreaY) {
            sceneObject.rightPane.element.on('mousemove', null);
            sceneObject.rightPane.mode = 'animate';
            sceneObject.textPortBoundary.mode = 'animate';
            sceneObject.textPort.mode = 'animate';
            layout.separator.right.x = viewport.width - sceneObject.TOC.geometry.width;
            states.showTOC = 'in progress';
            return sceneSync('animate');
          }
        }
      });
    });
    return sceneObject.rightPane.redraw = function() {
      if (states.showTOC === 'in progress') {
        sceneObject.rightPane.geometry.width = sceneObject.TOC.geometry.width;
      } else {
        sceneObject.rightPane.geometry.width = viewport.width - (layout.separator.right.x - layout.separator.left.x.current);
      }
      sceneObject.rightPane.geometry.x = layout.separator.right.x;
      sceneObject.rightPane.geometry.y = layout.separator.top.y;
      sceneObject.rightPane.geometry.height = coreH;
      if (states.showTOC === 'in progress') {
        return svgUtil.sync(sceneObject.rightPane, sceneObject.TOC.redraw);
      } else {
        return svgUtil.sync(sceneObject.rightPane);
      }
    };
  };
  main();
  navBarHook = sceneHook.svg.append('g');
  navBars.init(navBarsData, navBarHook);
  rightPane();
  textPort();
  titlePort();
  TOC();
  sceneObject.fontSize = {
    element: sceneHook.svg.append("g")
  };
  sceneObject.fontDecreaseButton = sceneObject.fontSize.element.append("svg:image").attr("xlink:href", "fontSmall.svg");
  sceneObject.fontIncreaseButton = sceneObject.fontSize.element.append("svg:image").attr("xlink:href", "fontLarge.svg");
  sceneObject.fontDecreaseButton.on('mouseover', function() {
    return console.log('hover');
  }).on('mousedown', function() {
    console.log('click font decrease');
    return textporting(tokens, -2);
  });
  sceneObject.fontIncreaseButton.on('mouseover', function() {
    return console.log('hover');
  }).on('mousedown', function() {
    console.log('click font increase');
    return textporting(tokens, 2);
  });
  sceneObject.downButton = {};
  sceneObject.downButton.geometry = {
    'paddingY': 15,
    'paddingX': 30,
    'height': 35
  };
  return sceneObject.downButton.element = sceneHook.svg.append('svg:image').attr('xlink:href', 'images/downScroll5.svg').attr('preserveAspectRatio', 'none').on('mouseover', function() {
    return sceneObject.downButton.element.transition().ease('sin').duration(200).attr('height', sceneObject.downButton.geometry.height + (sceneObject.downButton.geometry.paddingY * 2 / 3));
  }).on('mouseout', function() {
    return sceneObject.downButton.element.transition().duration(400).attr('height', sceneObject.downButton.geometry.height);
  }).on('mousedown', function() {
    return textporting(tokens, 0, true);
  });
};

sceneSync = function(mode) {
  var autoUpdate, leftPane, update;
  viewport = util.getViewport();
  layout.separator.top = {
    'y': calcStart()
  };
  end = 0;
  coreH = viewport.height - layout.separator.top.y - end;
  sceneHook.svg.attr('width', viewport.width).attr('height', viewport.height);
  if (layout.separator.right == null) {
    layout.separator.right = {
      'x': viewport.width - layout.separator.left.x.current
    };
  }
  sceneObject.textPortBoundary.geometry = {
    'x': layout.separator.left.x.current,
    'width': layout.separator.right.x - layout.separator.left.x.current,
    'y': layout.separator.top.y + 5,
    'height': coreH
  };
  sceneObject.textPortBoundary.style = {
    'stroke-width': '25px'
  };
  svgUtil.sync(sceneObject.textPortBoundary);
  sceneObject.textPort.geometry = {
    'x': layout.separator.left.x.current + 5,
    'width': layout.separator.right.x - layout.separator.left.x.current - 10,
    'height': coreH,
    'y': layout.separator.top.y + 5 + 10,
    'rx': 10,
    'rx': 10
  };
  sceneObject.textPort.style = {
    'stroke-width': '15px'
  };
  svgUtil.sync(sceneObject.textPort);
  sceneObject.titlePortRect.attr('width', viewport.width - 5 - 5).attr('height', layout.separator.top.y - 5 - 5).attr('x', 5).attr('y', -50).style('stroke-width', '7px').attr('rx', 10).attr('rx', 10);
  d3.select('#titleSVG').attr('width', viewport.width - 5 - 5 - 100).attr('height', layout.separator.top.y - 5 - 5);
  sceneObject.title.attr('x', viewport.width / 2).attr('y', 0).style('font-family', 'Helvetica').style("font-weight", "bold").attr("font-size", "30px");
  sceneObject.fontSize.redraw = function() {
    var fontButtonGeometry;
    console.log('redrawing font size buttons');
    fontButtonGeometry = {
      'width': 398 * 0.08,
      'height': 624 * 0.08
    };
    sceneObject.fontDecreaseButton.attr('x', viewport.width - (fontButtonGeometry.width * 2) - 7).attr('y', layout.separator.top.y - fontButtonGeometry.height - 7).attr('width', fontButtonGeometry.width).attr('height', fontButtonGeometry.height);
    return sceneObject.fontIncreaseButton.attr('x', viewport.width - fontButtonGeometry.width - 7 - 1).attr('y', layout.separator.top.y - fontButtonGeometry.height - 7).attr('width', fontButtonGeometry.width).attr('height', fontButtonGeometry.height);
  };
  sceneObject.fontSize.redraw();
  if (firstEntry) {
    sceneObject.title.transition().duration(300).ease('sin').attr('y', layout.separator.top.y / 2);
    sceneObject.titlePortRect.transition().duration(300).ease('sin').attr('y', 5);
    firstEntry = false;
  } else {
    sceneObject.title.attr('y', layout.separator.top.y / 2);
    sceneObject.titlePortRect.attr('y', 5);
  }
  if (tokens != null) {
    switch (mode) {
      case 'animate':
        update = 0;
        autoUpdate = setInterval((function() {
          textporting(tokens);
          if (update > 8) {
            setTimeout(window.clearInterval(autoUpdate), 400);
          }
          return update += 1;
        }), 50);
        break;
      default:
        textporting(tokens);
    }
  }
  sceneObject.downButton.redraw = function() {
    sceneObject.downButton.geometry.x = layout.separator.left.x.current + sceneObject.downButton.geometry.paddingX;
    sceneObject.downButton.geometry.width = layout.separator.right.x - layout.separator.left.x.current - (2 * sceneObject.downButton.geometry.paddingX);
    sceneObject.downButton.geometry.y = sceneHook.svg.attr('height') - sceneObject.downButton.geometry.height - sceneObject.downButton.geometry.paddingY;
    return sceneObject.downButton.element.attr('x', sceneObject.downButton.geometry.x).attr('width', sceneObject.downButton.geometry.width).attr('y', sceneObject.downButton.geometry.y).attr('height', sceneObject.downButton.geometry.height);
  };
  sceneObject.downButton.redraw();
  sceneObject.rightPane.redraw();
  leftPane = {
    geometry: {
      x: 0,
      width: layout.separator.left.x.current - 10,
      y: layout.separator.top.y - 0.5,
      height: coreH
    }
  };
  navBars.redraw(leftPane.geometry);
  return sceneObject.TOC.redraw = function() {
    var TOCToken, lHeight, paddingX, paddingY, spaceWidth, tokenViewable, viewPortFull, x, y, _i, _len, _results;
    spaceWidth = textDraw.tokenToViewable('a a', sceneObject.TOC.subElement).width - textDraw.tokenToViewable('aa', sceneObject.TOC.subElement).width;
    lHeight = textDraw.tokenToViewable('l', sceneObject.TOC.subElement).height;
    paddingX = 30;
    paddingY = 10;
    sceneObject.TOC.element.attr('x', parseFloat(sceneObject.rightPane.element.attr('x')) + paddingX).attr('width', parseFloat(sceneObject.rightPane.element.attr('width') - (paddingX * 2))).attr('y', parseFloat(sceneObject.rightPane.element.attr('y')) + paddingY).attr('height', parseFloat(sceneObject.rightPane.element.attr('height') - (paddingY * 2)));
    viewPortFull = false;
    y = 0;
    _results = [];
    for (_i = 0, _len = TOCTokens.length; _i < _len; _i++) {
      TOCToken = TOCTokens[_i];
      x = paddingX;
      tokenViewable = textDraw.tokenToViewable(TOCToken.text, sceneObject.TOC.subElement);
      switch (TOCToken.level) {
        case 1:
          x += 0;
          break;
        case 2:
          x += 15;
          break;
        case 3:
          x += 30;
      }
      if (y + tokenViewable.height + lHeight < sceneObject.TOC.element.attr('y') + sceneObject.TOC.element.attr('height')) {
        y += tokenViewable.height;
        tokenViewable.svg.attr('x', x);
        tokenViewable.svg.attr('y', y);
        x += tokenViewable.width;
      } else {
        viewPortFull = true;
        break;
      }
      _results.push(x += spaceWidth);
    }
    return _results;
  };
};

data.get('introduction', function(response) {
  return tokens = tokenize(response);
});

data.get('abstract', function(response) {
  var rawSegment, rawSegments, segment, _i, _len, _results;
  rawSegments = JSON.parse(response).segments;
  segments = [];
  _results = [];
  for (_i = 0, _len = rawSegments.length; _i < _len; _i++) {
    rawSegment = rawSegments[_i];
    segment = new Object;
    segment.category = rawSegment.category;
    segment.tokens = rawSegment.text.split(' ');
    _results.push(segments.push(segment));
  }
  return _results;
});

data.get('categories', function(response) {
  return navBarsData = JSON.parse(response).root;
});

data.get('TOC', function(response) {
  var rawTOC, rawToken, token, _i, _len, _ref, _results;
  rawTOC = JSON.parse(response);
  _ref = rawTOC.entries;
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    rawToken = _ref[_i];
    token = {
      'level': rawToken[0],
      'text': rawToken[1]
    };
    _results.push(TOCTokens.push(token));
  }
  return _results;
});

syncInit = function() {
  sceneSync();
  return window.onresize = function() {
    return sceneSync();
  };
};

start = function() {
  sceneDefine();
  syncInit();
  textportingAbstract(segments);
  return document.body.style.cursor = "default";
};

waitForData = setInterval((function() {
  if ((tokens != null) && (TOCTokens != null) && (segments != null) && (navBarsData != null)) {
    window.clearInterval(waitForData);
    return start();
  }
}), 50);

},{"./data":1,"./globalDims":3,"./navBars":5,"./svgUtil":6,"./textDraw":7,"./textporting":8,"./textportingAbstract":9,"./tokenize":10,"./util":11}],3:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
exports.layout = {};

exports.sceneObject = {};

exports.sceneHook = {};

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
var bars, colors, globalDims, layout, lookup, oldpanes, oldshow, oldsomething, redraw, root, sceneObject, svgUtil, syncBar, textRectFactory, util;

util = require('./util');

svgUtil = require('./svgUtil');

globalDims = require('./globalDims');

sceneObject = globalDims.sceneObject;

layout = globalDims.layout;

bars = [];

root = {};

lookup = {};

colors = {
  scaleStart: '#A3B1BA',
  scaleEnd: '#87CEFA',
  selection: '#999999'
};

syncBar = function(item, callback) {
  var textGeometry;
  item.element.rectangle.transition().ease('linear').duration(400).attr(item.geometry).style('fill', item.color);
  textGeometry = {
    'x': item.geometry.x + (item.geometry.width / 2),
    'y': item.geometry.y + (item.geometry.height / 2)
  };
  return item.element.text.transition().ease('linear').duration(400).attr(textGeometry);
};

textRectFactory = function(svgHookPoint, rectText) {
  var group, rectangle, text;
  group = svgHookPoint.append('g').style('-webkit-user-select', 'none').style('-webkit-touch-callout', 'none').style('user-select', 'none').attr('id', rectText);
  rectangle = group.append('rect').style('stroke-width', '0px').style('fill-opacity', '1');
  if (rectText != null) {
    text = group.append('text').text(rectText).style("text-anchor", "middle").attr("dominant-baseline", "central").style("font-family", "verdana").style("font-weight", "bold").style('fill', '#EEEEEE');
  } else {
    text = null;
  }
  sceneObject = {
    group: group,
    rectangle: rectangle,
    text: text
  };
  return sceneObject;
};

exports.init = function(navBarsData, svgHookPoint) {
  var bar, barCreate, barData, colorScale, i, initialViewStatus, _i, _j, _len, _len1;
  console.log('navBars init started');
  console.log('navBarsData object:');
  console.dir(navBarsData);
  colorScale = d3.scale.linear().domain([0, navBarsData.length]).range([colors.scaleStart, colors.scaleEnd]);
  root = {
    'name': null,
    'element': textRectFactory(svgHookPoint),
    'parent': null,
    'nestLevel': -1,
    'viewStatus': 'visible'
  };
  initialViewStatus = function(bar) {
    if (bar.parentBar === null) {
      bar.viewStatus = 'visible';
    }
    if (bar.name === "Introduction") {
      return bar.viewStatus = 'selected';
    }
  };
  barCreate = function(svgHookPoint, barData, parentBar, color) {
    var bar, barDataSub, nestLevel, subBar, _i, _len, _ref;
    if (parentBar === null) {
      nestLevel = 0;
    } else {
      nestLevel = parentBar.nestLevel + 1;
    }
    bar = {
      'name': barData.name,
      'element': textRectFactory(svgHookPoint, barData.name),
      'baseColor': colorScale(i),
      'parent': parentBar,
      'nestLevel': nestLevel,
      'viewStatus': 'hidden'
    };
    initialViewStatus(bar);
    lookup[bar.element.group.attr('id')] = bar;
    console.dir(lookup);
    if (barData.subs != null) {
      bar.children = [];
      _ref = barData.subs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        barDataSub = _ref[_i];
        subBar = barCreate(svgHookPoint, barDataSub, bar, color);
        bar.children.push(subBar);
      }
    }
    bar.element.group.on('mouseover', function() {
      return console.log('hover');
    }).on('mouseout', function() {
      return console.log('hover end');
    }).on('mousedown', function() {
      var child, sibling, _j, _k, _len1, _len2, _ref1, _ref2;
      bar = lookup[this.getAttribute('id')];
      if (bar.parent != null) {
        _ref1 = bar.parent.children;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          sibling = _ref1[_j];
          sibling.viewStatus = 'visible';
        }
      }
      bar.viewStatus = 'selected';
      if (bar.children != null) {
        _ref2 = bar.children;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          child = _ref2[_k];
          child.viewStatus = 'visible';
        }
      }
      return redraw(bars);
    });
    return bar;
  };
  for (i = _i = 0, _len = navBarsData.length; _i < _len; i = ++_i) {
    barData = navBarsData[i];
    bar = barCreate(svgHookPoint, barData, null, colorScale(i));
    bars.push(bar);
  }
  root.children = bars;
  for (_j = 0, _len1 = bars.length; _j < _len1; _j++) {
    bar = bars[_j];
    bar.parent = root;
  }
  return console.dir(root);
};

redraw = function(bars) {
  var anySelected, bar, height, i, parentGeometry, y, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref;
  parentGeometry = bars[0].parent.geometry;
  console.log('navBars redraw started');
  console.dir(parentGeometry);
  anySelected = false;
  for (_i = 0, _len = bars.length; _i < _len; _i++) {
    bar = bars[_i];
    if (bar.viewStatus === 'selected') {
      anySelected = true;
    }
  }
  for (_j = 0, _len1 = bars.length; _j < _len1; _j++) {
    bar = bars[_j];
    switch (bar.viewStatus) {
      case 'selected':
        bar.color = colors.selection;
        break;
      default:
        bar.color = bar.baseColor;
    }
  }
  if (anySelected) {
    for (_k = 0, _len2 = bars.length; _k < _len2; _k++) {
      bar = bars[_k];
      switch (bar.viewStatus) {
        case 'selected':
          bar.heightRatio = 'main';
          break;
        default:
          bar.heightRatio = 'subordinate';
      }
    }
  } else {
    for (_l = 0, _len3 = bars.length; _l < _len3; _l++) {
      bar = bars[_l];
      bar.heightRatio = 'even';
    }
  }
  y = parentGeometry.y;
  for (i = _m = 0, _len4 = bars.length; _m < _len4; i = ++_m) {
    bar = bars[i];
    switch (bar.heightRatio) {
      case 'main':
        height = Math.floor(parentGeometry.height * (2 / 3));
        break;
      case 'subordinate':
        height = Math.floor(parentGeometry.height * (1 / 3) / (bars.length - 1));
        break;
      case 'even':
        height = Math.floor(parentGeometry.height / bars.length);
    }
    bar.geometry = {
      x: parentGeometry.x,
      width: parentGeometry.width,
      y: y - 0.5,
      height: height
    };
    syncBar(bar);
    console.dir(bar);
    for (_n = 0, _len5 = bars.length; _n < _len5; _n++) {
      bar = bars[_n];
      if (bar.children != null) {
        if ((_ref = bar.children[0].viewStatus) === 'visible' || _ref === 'selected') {
          console.log('visible children');
          bar.geometry = {
            'x': parentGeometry.x + 15,
            'width': parentGeometry.width - (15 * 2),
            'y': y + 15,
            'height': height - (15 * 2)
          };
          redraw(bar.children);
        }
      }
    }
    y += height;
  }
  return null;
};

exports.redraw = function(geometry) {
  root.geometry = geometry;
  return redraw(bars);
};

oldsomething = function() {
  var colorScale, colorTransition, numberOfBoxes;
  numberOfBoxes = categories.length;
  colorScale = d3.scale.linear().domain([0, numberOfBoxes - 1]).range(['#87CEFA', '#00BFFF']);
  return colorTransition = function(i) {
    return function() {
      return d3.select(this).transition().duration(25).ease('circle').style('fill', colorScale(i));
    };
  };
};

oldpanes = function(groupY, groupH, borderX, elements) {
  var boxH, height, i, width, _i, _ref, _results;
  boxH = groupH / elements.length;
  _results = [];
  for (i = _i = 0, _ref = elements.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    elements[i].x1 = 0;
    elements[i].x2 = borderX;
    /*
    if i is 0
      elements[i].y1 = layout.separator.top.y - 0.5
      elements[i].y2 = layout.separator.top.y + (groupH/2) + 0.5
    else
    */

    elements[i].y1 = groupY + Math.floor(boxH * i) - 0.5;
    elements[i].y2 = groupY + Math.floor(boxH * (i + 1)) + 0.5;
    width = util.calcLength(elements[i].x1, elements[i].x2);
    height = util.calcLength(elements[i].y1, elements[i].y2);
    elements[i].element.attr('x', elements[i].x1).attr('width', width).attr('y', elements[i].y1).attr('height', height);
    _results.push(elements[i].text.attr('x', elements[i].x1 + width / 2).attr('y', elements[i].y1 + height / 2));
  }
  return _results;
};

oldshow = function() {
  var groupY;
  groupY = layout.separator.top.y - 0.5;
  panes(groupY, totalH, layout.separator.left.x.current, sceneObject.categories.level1);
  groupY = totalH / 2 + layout.separator.top.y - 0.5;
  return panes(groupY, totalH / 2, layout.separator.left.x.current, sceneObject.categories.level2);
};

},{"./globalDims":3,"./svgUtil":6,"./util":11}],6:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
exports.sync = function(item, callback) {
  var attributesToTransition, key, stylesToTransition, val, _ref, _ref1, _ref2, _ref3, _results;
  if (item.mode) {
    console.log(item.mode);
  }
  if (item.mode === 'animate') {
    attributesToTransition = {};
    _ref = item.geometry;
    for (key in _ref) {
      val = _ref[key];
      if (key === 'x' || key === 'width' || key === 'y' || key === 'height' || key === 'rx' || key === 'ry') {
        if (parseFloat(item.element.attr(key)) !== val) {
          attributesToTransition[key] = val;
          console.dir('going to transition ' + key + ' from ' + item.element.attr(key) + ' to ' + val);
        }
      }
    }
    stylesToTransition = {};
    _ref1 = item.style;
    for (key in _ref1) {
      val = _ref1[key];
      if (item.element.style(key) !== val) {
        stylesToTransition[key] = val;
      }
    }
    if (callback != null) {
      return item.element.transition().duration(400).attr(attributesToTransition).style(stylesToTransition).each('end', callback);
    } else {
      return item.element.transition().duration(400).attr(attributesToTransition).style(stylesToTransition);
    }
  } else {
    _ref2 = item.geometry;
    for (key in _ref2) {
      val = _ref2[key];
      item.element.attr(key, val);
    }
    _ref3 = item.style;
    _results = [];
    for (key in _ref3) {
      val = _ref3[key];
      _results.push(item.element.style(key, val));
    }
    return _results;
  }
};

},{}],7:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
var globalDims, layout, sceneObject;

globalDims = require('./globalDims');

sceneObject = globalDims.sceneObject;

layout = globalDims.layout;

exports.tokenToViewable = function(token, visibleGroup) {
  var height, svgText, visualToken, width;
  visualToken = {};
  svgText = visibleGroup.append('text').attr('y', -500).attr('x', -500).style("dominant-baseline", "hanging");
  svgText.text(token);
  width = svgText.node().getBBox().width;
  height = svgText.node().getBBox().height;
  visualToken.svg = svgText;
  visualToken.height = height;
  visualToken.width = width;
  return visualToken;
};

},{"./globalDims":3}],8:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
var fontFamily, fontSize, globalDims, layout, sceneHook, sceneObject, textDraw;

globalDims = require('./globalDims');

sceneObject = globalDims.sceneObject;

sceneHook = globalDims.sceneHook;

layout = globalDims.layout;

textDraw = require('./textDraw');

fontSize = '36px';

fontFamily = 'Helvetica';

module.exports = function(tokens, fontSizeChange, scroll, mode) {
  var lHeight, paddingX, paddingY, redraw, spaceWidth;
  console.log('textPorting started ' + '(mode ' + mode + ')');
  if (fontSizeChange != null) {
    fontSize = parseFloat(fontSize) + fontSizeChange + 'px';
  }
  if (sceneObject.textPortInnerSVG != null) {
    sceneObject.textPortInnerSVG.element.remove();
  }
  sceneObject.textPortInnerSVG = {};
  console.dir(sceneObject);
  console.dir(sceneHook.svg);
  sceneObject.textPortInnerSVG.element = sceneHook.svg.append('svg');
  sceneObject.textPortInnerSVG.subElement = sceneObject.textPortInnerSVG.element.append('g').style('text-anchor', 'start').style('fill', 'rgb(255,255,220)').style('font-family', fontFamily).style('font-size', fontSize);
  spaceWidth = textDraw.tokenToViewable('a a', sceneObject.textPortInnerSVG.subElement).width - textDraw.tokenToViewable('aa', sceneObject.textPortInnerSVG.subElement).width;
  spaceWidth *= 1.4;
  lHeight = textDraw.tokenToViewable('l', sceneObject.textPortInnerSVG.subElement).height;
  paddingX = 20;
  paddingY = 18;
  console.log(sceneObject.textPort.element.attr('width') - (paddingX * 2));
  sceneObject.textPortInnerSVG.element.attr('x', parseFloat(sceneObject.textPort.element.attr('x')) + paddingX + 3).attr('width', parseFloat(sceneObject.textPort.element.attr('width') - (paddingX * 2) - 3)).attr('y', parseFloat(sceneObject.textPort.element.attr('y')) + paddingY).attr('height', parseFloat(sceneObject.textPort.element.attr('height') - (paddingY * 2) - 50));
  redraw = function() {
    var token, tokenViewable, viewPortFull, x, y, _i, _len, _results;
    viewPortFull = false;
    x = 0;
    y = 0;
    _results = [];
    for (_i = 0, _len = tokens.length; _i < _len; _i++) {
      token = tokens[_i];
      tokenViewable = textDraw.tokenToViewable(token.text, sceneObject.textPortInnerSVG.subElement);
      switch (token.mark) {
        case 1:
          tokenViewable.svg.style('fill', 'rgb(120,240,240)');
          break;
        case 2:
          tokenViewable.svg.style('fill', 'rgb(100,200,200)');
          break;
      }
      if (x + tokenViewable.width < sceneObject.textPortInnerSVG.element.attr('width')) {
        tokenViewable.svg.attr('x', x);
        tokenViewable.svg.attr('y', y);
        x += tokenViewable.width;
      } else {
        if (y + tokenViewable.height + lHeight < sceneObject.textPortInnerSVG.element.attr('height')) {
          x = 0;
          y += tokenViewable.height;
          tokenViewable.svg.attr('x', x);
          tokenViewable.svg.attr('y', y);
          x += tokenViewable.width;
        } else {
          console.log('text port full');
          viewPortFull = true;
          break;
        }
      }
      if (x + spaceWidth < sceneObject.textPortInnerSVG.element.attr('width')) {
        _results.push(x += spaceWidth);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  return redraw();
};

},{"./globalDims":3,"./textDraw":7}],9:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
var fontFamily, fontSize, globalDims, layout, sceneHook, sceneObject, svgUtil, textDraw;

globalDims = require('./globalDims');

sceneObject = globalDims.sceneObject;

sceneHook = globalDims.sceneHook;

layout = globalDims.layout;

svgUtil = require('./svgUtil');

textDraw = require('./textDraw');

fontSize = '18px';

fontFamily = 'Helvetica';

module.exports = function(segments, fontSizeChange, scroll, mode) {
  var enclosing, lHeight, paddingX, paddingY, redraw, spaceWidth;
  console.log('textPorting abstract started ' + '(mode ' + mode + ')');
  if (fontSizeChange != null) {
    fontSize = parseFloat(fontSize) + fontSizeChange + 'px';
  }
  if (sceneObject.textPortInnerSVG != null) {
    sceneObject.textPortInnerSVG.element.remove();
  }
  sceneObject.textPortInnerSVG = {};
  console.dir(sceneHook.svg);
  sceneObject.textPortInnerSVG.element = sceneHook.svg.append('svg');
  sceneObject.textPortInnerSVG.subElement = sceneObject.textPortInnerSVG.element.append('g').style('text-anchor', 'start').style('font-family', fontFamily).style('font-size', fontSize);
  spaceWidth = textDraw.tokenToViewable('a a', sceneObject.textPortInnerSVG.subElement).width - textDraw.tokenToViewable('aa', sceneObject.textPortInnerSVG.subElement).width;
  spaceWidth *= 1.4;
  lHeight = textDraw.tokenToViewable('l', sceneObject.textPortInnerSVG.subElement).height;
  paddingX = 20;
  paddingY = 18;
  enclosing = {
    paddingX: 15,
    paddingY: 15
  };
  segments.spacingY = 20;
  sceneObject.textPortInnerSVG.element.attr('x', parseFloat(sceneObject.textPort.element.attr('x')) + paddingX + 3).attr('width', parseFloat(sceneObject.textPort.element.attr('width') - (paddingX * 2) - 3)).attr('y', parseFloat(sceneObject.textPort.element.attr('y')) + paddingY).attr('height', parseFloat(sceneObject.textPort.element.attr('height') - (paddingY * 2) - 50));
  redraw = function() {
    var segment, segmentTokens, textToken, tokenViewable, viewPortFull, x, y, _i, _j, _len, _len1, _ref, _results;
    viewPortFull = false;
    y = enclosing.paddingY;
    _results = [];
    for (_i = 0, _len = segments.length; _i < _len; _i++) {
      segment = segments[_i];
      segment.element = sceneObject.textPortInnerSVG.subElement.append('g').style('text-anchor', 'start').style('fill', '#EEEEEE').style('font-family', fontFamily).style('font-size', fontSize);
      segment.enclosure = {};
      segment.enclosure.element = segment.element.append('rect').style('opacity', 0.9).style('fill', '#87CEFA');
      segmentTokens = [];
      x = enclosing.paddingX;
      segment.enclosure.geometry = {
        'rx': 7,
        'ry': 5,
        'y': y - enclosing.paddingY,
        'x': x - enclosing.paddingX,
        'width': sceneObject.textPortInnerSVG.element.attr('width')
      };
      _ref = segment.tokens;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        textToken = _ref[_j];
        tokenViewable = textDraw.tokenToViewable(textToken, segment.element);
        if (x + tokenViewable.width < sceneObject.textPortInnerSVG.element.attr('width') - enclosing.paddingX) {
          tokenViewable.svg.attr('x', x);
          tokenViewable.svg.attr('y', y);
          x += tokenViewable.width;
        } else {
          if (y + tokenViewable.height + lHeight < sceneObject.textPortInnerSVG.element.attr('height')) {
            x = enclosing.paddingX;
            y += tokenViewable.height;
            tokenViewable.svg.attr('x', x);
            tokenViewable.svg.attr('y', y);
            x += tokenViewable.width;
          } else {
            viewPortFull = true;
            break;
          }
        }
        if (x + spaceWidth < sceneObject.textPortInnerSVG.element.attr('width')) {
          x += spaceWidth;
        }
      }
      y += lHeight + enclosing.paddingY;
      segment.enclosure.geometry.height = y - segment.enclosure.geometry.y;
      svgUtil.sync(segment.enclosure);
      _results.push(y += segments.spacingY);
    }
    return _results;
  };
  return redraw();
};

},{"./globalDims":3,"./svgUtil":6,"./textDraw":7}],10:[function(require,module,exports){
// Generated by CoffeeScript 1.6.3
module.exports = function(textStream) {
  var input, markeringCodes, t, textArray, tokens, _i, _ref;
  input = JSON.parse(textStream);
  textArray = input.text.split(' ');
  markeringCodes = input.marks;
  tokens = [];
  for (t = _i = 0, _ref = textArray.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; t = 0 <= _ref ? ++_i : --_i) {
    tokens.push({
      'text': textArray[t],
      'mark': markeringCodes[t]
    });
  }
  console.dir(tokens);
  return tokens;
};

},{}],11:[function(require,module,exports){
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