// Generated by CoffeeScript 1.6.3
var TOCTokens, boxH, calcEnd, calcStart, categories, data, end, firstEntry, globalDims, layout, sceneDefine, sceneSync, start, states, svg, svgUtil, syncInit, textDraw, textporting, tokenize, tokens, totalH, util, viewport, waitForData;

util = require('./util');

data = require('./data');

tokenize = require('./tokenize');

textporting = require('./textporting');

textDraw = require('./textDraw');

svgUtil = require('./svgUtil');

globalDims = require('./globalDims');

svg = globalDims.svg;

layout = globalDims.layout;

console.log('read.js main started');

firstEntry = true;

viewport = null;

states = {};

tokens = void 0;

TOCTokens = [];

categories = void 0;

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

totalH = null;

boxH = null;

end = null;

sceneDefine = function(categories) {
  var TOC, boxBlock, main, rightPane, textPort, titlePort;
  main = function() {
    return svg.main = d3.select('body').append('svg').style('background-color', '#999999');
  };
  TOC = function() {
    var fontFamily, fontSize, maxLen, token, tokenViewable, _i, _len;
    svg.TOC = {};
    fontSize = '14px';
    fontFamily = 'verdana';
    svg.TOC.element = svg.main.append('svg');
    svg.TOC.subElement = svg.TOC.element.append('g').style('text-anchor', 'start').style('fill', 'rgb(50,50,240)').style('font-family', fontFamily).style('font-size', fontSize);
    maxLen = 0;
    for (_i = 0, _len = TOCTokens.length; _i < _len; _i++) {
      token = TOCTokens[_i];
      tokenViewable = textDraw.tokenToViewable(token.text, svg.TOC.element);
      if (tokenViewable.width > maxLen) {
        maxLen = tokenViewable.width;
      }
    }
    svg.TOC.geometry = {
      paddingX: 30
    };
    return svg.TOC.geometry.width = maxLen + (2 * svg.TOC.geometry.paddingX);
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
      text = categoryBox.append('text').text(categories[box]).style("text-anchor", "middle").attr("dominant-baseline", "central").style("font-family", "verdana").style("font-weight", "bold").style('fill', '#EEEEEE');
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
    svg.textPortBoundary = {};
    svg.textPortBoundary.element = svg.main.append('rect').style('stroke', '#999999').style('fill', '#999999').on('mouseover', function() {
      return this.style.cursor = "ew-resize";
    }).on('mouseout', function() {
      return this.style.cursor = "default";
    }).on('mousedown', function() {
      var element, rightInitialSeparator, widthInitialBoundary, widthInitialText, xInitial;
      this.style.cursor = "ew-resize";
      xInitial = event.clientX;
      widthInitialBoundary = svg.textPortBoundary.element.attr('width');
      widthInitialText = svg.textPort.element.attr('width');
      rightInitialSeparator = layout.separator.right.x;
      element = d3.select(this);
      window.onmousemove = function(event) {
        var xDiff;
        xDiff = xInitial - event.clientX;
        layout.separator.right.x = rightInitialSeparator - xDiff;
        layout.separator.right.y = rightInitialSeparator - xDiff;
        svg.textPortBoundary.element.attr('width', widthInitialBoundary - xDiff);
        svg.textPort.element.attr('width', widthInitialText - xDiff);
        textporting(tokens);
        svg.rightPane.redraw();
        return svg.downButton.redraw();
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
      widthInitialBoundary = svg.textPortBoundary.element.attr('width');
      widthInitialText = svg.textPort.element.attr('width');
      window.ontouchmove = function(event) {
        var xDiff;
        xDiff = xInitial - event.changedTouches[0].clientX;
        svg.textPortBoundary.element.attr('width', widthInitialBoundary - xDiff);
        svg.textPort.element.attr('width', widthInitialText - xDiff);
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
    svg.textPort = {};
    return svg.textPort.element = svg.main.append('rect').style('stroke', '#222222').style('fill', '#222222');
  };
  titlePort = function() {
    svg.titlePort = svg.main.append('rect').style('fill', '#2F72FF');
    return svg.title = svg.main.append('text').text("Something Something Something Title").style("text-anchor", "middle").style('fill', "#eeeeee");
  };
  rightPane = function() {
    svg.rightPane = {};
    svg.rightPane.element = svg.main.append('rect').style('fill', '#999999').style('fill-opacity', '1');
    svg.rightPane.geometry = {};
    svg.rightPane.geometry = {
      'hoverIgnoreAreaX': 30,
      'hoverIgnoreAreaY': 30
    };
    svg.rightPane.element.on('mouseover', function() {
      return svg.rightPane.element.on('mousemove', function() {
        if (event.x > layout.separator.right.x + svg.rightPane.geometry.hoverIgnoreAreaX) {
          if (event.y > layout.separator.top.y + svg.rightPane.geometry.hoverIgnoreAreaY && event.y < viewport.height - svg.rightPane.geometry.hoverIgnoreAreaY) {
            svg.rightPane.element.on('mousemove', null);
            svg.rightPane.mode = 'animate';
            svg.textPortBoundary.mode = 'animate';
            svg.textPort.mode = 'animate';
            layout.separator.right.x = viewport.width - svg.TOC.geometry.width;
            states.showTOC = 'in progress';
            return sceneSync('animate');
          }
        }
      });
    });
    return svg.rightPane.redraw = function() {
      console.log('right pane redraw');
      if (states.showTOC === 'in progress') {
        svg.rightPane.geometry.width = svg.TOC.geometry.width;
      } else {
        svg.rightPane.geometry.width = viewport.width - (layout.separator.right.x - layout.separator.left.x.current);
      }
      svg.rightPane.geometry.x = layout.separator.right.x;
      svg.rightPane.geometry.y = layout.separator.top.y;
      svg.rightPane.geometry.height = totalH;
      if (states.showTOC === 'in progress') {
        return svgUtil.sync(svg.rightPane, svg.TOC.redraw);
      } else {
        return svgUtil.sync(svg.rightPane);
      }
    };
  };
  main();
  boxBlock(categories);
  rightPane();
  textPort();
  titlePort();
  TOC();
  svg.fontSize = svg.main.append("g");
  svg.fontDecreaseButton = svg.fontSize.append("svg:image").attr("xlink:href", "fontSmall.svg");
  svg.fontIncreaseButton = svg.fontSize.append("svg:image").attr("xlink:href", "fontLarge.svg");
  svg.fontDecreaseButton.on('mouseover', function() {
    return console.log('hover');
  }).on('mousedown', function() {
    console.log('click font decrease');
    return textporting(tokens, -2);
  });
  svg.fontIncreaseButton.on('mouseover', function() {
    return console.log('hover');
  }).on('mousedown', function() {
    console.log('click font increase');
    return textporting(tokens, 2);
  });
  svg.downButton = {};
  svg.downButton.geometry = {
    'paddingY': 15,
    'paddingX': 30,
    'height': 35
  };
  return svg.downButton.element = svg.main.append('svg:image').attr('xlink:href', 'images/downScroll4.svg').attr('preserveAspectRatio', 'none').on('mouseover', function() {
    console.log('hover');
    return svg.downButton.element.transition().ease('sin').duration(200).attr('height', svg.downButton.geometry.height + (svg.downButton.geometry.paddingY * 2 / 3));
  }).on('mouseout', function() {
    console.log('hover');
    return svg.downButton.element.transition().duration(400).attr('height', svg.downButton.geometry.height);
  }).on('mousedown', function() {
    console.log('scroll');
    return textporting(tokens, 0, true);
  });
};

sceneSync = function(mode) {
  var autoUpdate, fontButtonGeometry, height, i, update, width, _i, _ref;
  viewport = util.getViewport();
  console.dir(viewport);
  layout.separator.top = {
    'y': calcStart()
  };
  end = 0;
  totalH = viewport.height - layout.separator.top.y - end;
  svg.main.attr('width', viewport.width).attr('height', viewport.height);
  if (layout.separator.right == null) {
    layout.separator.right = {
      'x': viewport.width - layout.separator.left.x.current
    };
  }
  svg.textPortBoundary.geometry = {
    'x': layout.separator.left.x.current,
    'width': layout.separator.right.x - layout.separator.left.x.current,
    'y': layout.separator.top.y + 5,
    'height': totalH
  };
  svg.textPortBoundary.style = {
    'stroke-width': '25px'
  };
  svgUtil.sync(svg.textPortBoundary);
  svg.textPort.geometry = {
    'x': layout.separator.left.x.current + 5,
    'width': layout.separator.right.x - layout.separator.left.x.current - 10,
    'height': totalH,
    'y': layout.separator.top.y + 5 + 10,
    'rx': 10,
    'rx': 10
  };
  svg.textPort.style = {
    'stroke-width': '15px'
  };
  svgUtil.sync(svg.textPort);
  console.log(svg.textPort.element.attr('width'));
  console.log(svg.textPort.geometry.width);
  svg.titlePort.attr('width', viewport.width - 5 - 5).attr('height', layout.separator.top.y - 5 - 5).attr('x', 5).attr('y', 5).style('stroke-width', '7px').attr('rx', 10).attr('rx', 10);
  svg.title.attr('x', viewport.width / 2).attr('y', 0).style('font-family', 'Helvetica').style("font-weight", "bold").attr("font-size", "30px").attr("dominant-baseline", "central");
  if (firstEntry) {
    svg.title.transition().duration(1000).ease('bounce').attr('x', viewport.width / 2).attr('y', layout.separator.top.y / 2);
  } else {
    svg.title.attr('x', viewport.width / 2).attr('y', layout.separator.top.y / 2);
  }
  firstEntry = false;
  console.log('before textporting from scenesync');
  if (tokens != null) {
    switch (mode) {
      case 'animate':
        console.log('in animate');
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
        console.log('without animate');
        textporting(tokens);
    }
  }
  fontButtonGeometry = {
    'width': 398 * 0.08,
    'height': 624 * 0.08
  };
  svg.fontDecreaseButton.attr('x', viewport.width - (fontButtonGeometry.width * 2) - 7).attr('y', layout.separator.top.y - fontButtonGeometry.height - 7).attr('width', fontButtonGeometry.width).attr('height', fontButtonGeometry.height);
  svg.fontIncreaseButton.attr('x', viewport.width - fontButtonGeometry.width - 7 - 1).attr('y', layout.separator.top.y - fontButtonGeometry.height - 7).attr('width', fontButtonGeometry.width).attr('height', fontButtonGeometry.height);
  boxH = (totalH / 2) / (svg.boxes.length - 1);
  for (i = _i = 0, _ref = svg.boxes.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    svg.boxes[i].x1 = 0;
    svg.boxes[i].x2 = layout.separator.left.x.current;
    if (i === 0) {
      svg.boxes[i].y1 = layout.separator.top.y - 0.5;
      svg.boxes[i].y2 = layout.separator.top.y + (totalH / 2) + 0.5;
    } else {
      svg.boxes[i].y1 = layout.separator.top.y + (totalH / 2) + Math.floor(boxH * (i - 1)) - 0.5;
      svg.boxes[i].y2 = layout.separator.top.y + (totalH / 2) + Math.floor(boxH * i) + 0.5;
    }
    width = util.calcLength(svg.boxes[i].x1, svg.boxes[i].x2);
    height = util.calcLength(svg.boxes[i].y1, svg.boxes[i].y2);
    /*
    console.log svg.boxes[i].y1
    console.log svg.boxes[i].y2
    console.log '---'
    */

    svg.boxes[i].element.attr('x', svg.boxes[i].x1).attr('width', width).attr('y', svg.boxes[i].y1).attr('height', height);
    svg.boxes[i].text.attr('x', svg.boxes[i].x1 + width / 2).attr('y', svg.boxes[i].y1 + height / 2);
  }
  svg.downButton.redraw = function() {
    svg.downButton.geometry.x = layout.separator.left.x.current + svg.downButton.geometry.paddingX;
    svg.downButton.geometry.width = layout.separator.right.x - layout.separator.left.x.current - (2 * svg.downButton.geometry.paddingX);
    svg.downButton.geometry.y = svg.main.attr('height') - svg.downButton.geometry.height - svg.downButton.geometry.paddingY;
    return svg.downButton.element.attr('x', svg.downButton.geometry.x).attr('width', svg.downButton.geometry.width).attr('y', svg.downButton.geometry.y).attr('height', svg.downButton.geometry.height);
  };
  svg.downButton.redraw();
  svg.rightPane.redraw();
  return svg.TOC.redraw = function() {
    var TOCToken, lHeight, paddingX, paddingY, spaceWidth, tokenViewable, viewPortFull, x, y, _j, _len, _results;
    console.log('starting TOC redraw');
    spaceWidth = textDraw.tokenToViewable('a a', svg.TOC.subElement).width - textDraw.tokenToViewable('aa', svg.TOC.subElement).width;
    lHeight = textDraw.tokenToViewable('l', svg.TOC.subElement).height;
    paddingX = 30;
    paddingY = 10;
    svg.TOC.element.attr('x', parseFloat(svg.rightPane.element.attr('x')) + paddingX).attr('width', parseFloat(svg.rightPane.element.attr('width') - (paddingX * 2))).attr('y', parseFloat(svg.rightPane.element.attr('y')) + paddingY).attr('height', parseFloat(svg.rightPane.element.attr('height') - (paddingY * 2)));
    viewPortFull = false;
    y = 0;
    _results = [];
    for (_j = 0, _len = TOCTokens.length; _j < _len; _j++) {
      TOCToken = TOCTokens[_j];
      x = paddingX;
      tokenViewable = textDraw.tokenToViewable(TOCToken.text, svg.TOC.subElement);
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
      if (y + tokenViewable.height + lHeight < svg.TOC.element.attr('y') + svg.TOC.element.attr('height')) {
        y += tokenViewable.height;
        tokenViewable.svg.attr('x', x);
        tokenViewable.svg.attr('y', y);
        x += tokenViewable.width;
      } else {
        console.log('text port full');
        viewPortFull = true;
        break;
      }
      _results.push(x += spaceWidth);
    }
    return _results;
  };
};

data.get('abstract', function(response) {
  console.log(response);
  tokens = tokenize(response);
  return console.dir(tokens);
});

data.get('categories', function(response) {
  console.log(response);
  return categories = JSON.parse(response).names;
});

data.get('TOC', function(response) {
  var rawTOC, rawToken, token, _i, _len, _ref, _results;
  console.log(response);
  rawTOC = JSON.parse(response);
  console.dir(rawTOC);
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
  sceneDefine(categories);
  syncInit();
  textporting(tokens);
  return document.body.style.cursor = "default";
};

waitForData = setInterval((function() {
  if ((categories != null) && (tokens != null) && (TOCTokens != null)) {
    window.clearInterval(waitForData);
    return start();
  }
}), 50);
