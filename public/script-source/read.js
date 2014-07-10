// Generated by CoffeeScript 1.6.3
var TOCTokens, TitleChooser, articleSelectorPaneHeight, articles, boxH, calcEnd, calcStart, categorizedTextTree, colors, coreH, currentArticle, data, end, firstEntry, globalDims, layout, navBars, navBarsTree, sceneDefine, sceneHook, sceneObject, sceneSync, segments, session, start, states, subCategoriesNavigation, svgUtil, syncInit, textDraw, tokenize, tokens, util, viewport, waitForData;

util = require('./util');

data = require('./data');

tokenize = require('./tokenize');

textDraw = require('./textDraw');

svgUtil = require('./svgUtil');

session = require('./session');

globalDims = require('./globalDims');

sceneObject = globalDims.sceneObject;

layout = globalDims.layout;

sceneHook = globalDims.sceneHook;

subCategoriesNavigation = false;

if (subCategoriesNavigation) {
  navBars = require('./navBarsSubMode');
} else {
  navBars = require('./navBars');
}

console.log('read.js main started');

firstEntry = true;

viewport = null;

states = {
  rightPane: 'toc-invitation',
  articleSwitcher: false
};

colors = {
  scaleStart: '#87CEFA',
  scaleEnd: '#00BFFF'
};

tokens = void 0;

TOCTokens = [];

navBarsTree = void 0;

categorizedTextTree = void 0;

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

articles = ["The Relationship Between Human Capital and Firm Performance", "Article 2", "Article 3"];

currentArticle = 0;

articleSelectorPaneHeight = calcStart() - 5 - 5;

/(?:)/;

/(?:)/;

/(?:)/;

TitleChooser = function() {
  var chooserClose, height;
  states.articleSwitcher = true;
  height = {
    'selectorMode': articles.length * articleSelectorPaneHeight,
    'selectedMode': articleSelectorPaneHeight
  };
  chooserClose = function() {
    sceneObject.titlePort.pane.transition().duration(400).ease('sin').attr('height', height.selectedMode);
    return states.articleSwitcher = false;
  };
  console.log('opening title chooser');
  util.makeSvgTopLayer(sceneObject.titlePort.element.node());
  sceneObject.titlePort.pane.transition().duration(450).ease('linear').attr('height', height.selectorMode).each("end", function() {
    var article, i, pane, titlePanes, _i, _len, _results;
    titlePanes = [];
    _results = [];
    for (i = _i = 0, _len = articles.length; _i < _len; i = ++_i) {
      article = articles[i];
      if (i === currentArticle) {
        continue;
      }
      pane = util.titlePaneCreate(sceneHook.svg, '#50BFEF');
      pane.text.text(article);
      console.log(i * articleSelectorPaneHeight);
      pane.pane.attr('width', viewport.width - 5 - 5).attr('height', layout.separator.top.y - 5 - 5).attr('x', 5).attr('y', 5 + (i * articleSelectorPaneHeight)).style('stroke-width', '7px').attr('rx', 10).attr('rx', 10);
      pane.text.attr('x', viewport.width / 2).attr('y', 5 + (i + 0.5) * articleSelectorPaneHeight).style('font-family', 'Helvetica').style("font-weight", "bold").attr("font-size", "30px");
      pane.pane.on('mouseover', function() {
        return pane.pane.style('fill', '#60CBFE');
      });
      _results.push(titlePanes.push(pane));
    }
    return _results;
  });
  return sceneObject.titlePort.pane.on('mouseout', function() {
    return chooserClose();
  });
};

sceneDefine = function() {
  var TOC, downButton, fontSizeButton, mainPanes, navBarHook, rightPane, textPort, titlePort;
  TOC = function() {
    var fontFamily, fontSize, maxLen, token, tokenViewable, _i, _len;
    sceneObject.TOC = {};
    fontSize = '14px';
    fontFamily = 'verdana';
    sceneObject.TOC.element = sceneHook.svg.append('svg');
    sceneObject.TOC.subElement = sceneObject.TOC.element.append('g').style('text-anchor', 'start').style('fill', '#60cafb').style('font-family', fontFamily).style('font-size', fontSize);
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
        navBars.textportRefresh();
        sceneObject.rightPane.redraw();
        return sceneObject.downButton.redraw();
      };
      window.onmouseup = function(event) {
        window.onmousemove = null;
        event.target.style.cursor = "default";
        return element.transition().duration(500).style('stroke', '#999999');
      };
      element.transition().duration(300).style('stroke', '#aaaaaa');
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
        return navBars.textportRefresh();
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
    sceneObject.titlePort = util.titlePaneCreate(sceneHook.svg, '#60CAFB', true);
    sceneObject.titlePort.text.text(articles[currentArticle]);
    return sceneObject.titlePort.pane.on('mouseover', function() {
      console.log('mouseover titleport');
      console.log(states.articleSwitcher);
      if (!states.articleSwitcher) {
        return TitleChooser();
      }
    });
  };
  rightPane = function() {
    var styles, textRect;
    styles = {
      rectangle: {
        'fill': '#999999',
        'fill-opacity': '0.5'
      },
      text: {
        'font-family': 'verdana',
        'fill': '#909092',
        'font-weight': 'bold',
        'font-size': '35px'
      }
    };
    textRect = svgUtil.textRectFactory(sceneHook.svg, 'More', styles, 'visible');
    sceneObject.rightPane = {
      element: textRect.rectangle,
      textElem: textRect.text
    };
    sceneObject.rightPane.geometry = {};
    sceneObject.rightPane.geometry = {
      'hoverIgnoreAreaX': void 0,
      'hoverIgnoreAreaY': void 0
    };
    sceneObject.rightPane.element.on('mouseover', function() {
      console.log('mouseover');
      return sceneObject.rightPane.element.on('mousemove', function() {
        if (event.x > layout.separator.right.x + sceneObject.rightPane.geometry.hoverIgnoreAreaX) {
          if (event.y > layout.separator.top.y + sceneObject.rightPane.geometry.hoverIgnoreAreaY && event.y < viewport.height - sceneObject.rightPane.geometry.hoverIgnoreAreaY) {
            sceneObject.rightPane.element.on('mousemove', null);
            sceneObject.rightPane.mode = 'animate';
            sceneObject.textPortBoundary.mode = 'animate';
            sceneObject.textPort.mode = 'animate';
            layout.separator.right.x = viewport.width - sceneObject.TOC.geometry.width;
            states.rightPane = 'toc-unveiling';
            return sceneSync('animate');
          }
        }
      });
    });
    return sceneObject.rightPane.redraw = function() {
      var middle;
      console.log('rightpane redraw started');
      sceneObject.rightPane.geometry = {
        'hoverIgnoreAreaX': (viewport.width - layout.separator.right.x) / 3,
        'hoverIgnoreAreaY': (viewport.height - layout.separator.top.y) / 3
      };
      sceneObject.rightPane.geometry.width = viewport.width - layout.separator.right.x;
      /*
      if states.rightPane is 'in progress'
        sceneObject.rightPane.geometry.width = sceneObject.TOC.geometry.width
      else 
        sceneObject.rightPane.geometry.width = viewport.width - (layout.separator.right.x)
      */

      sceneObject.rightPane.geometry.x = layout.separator.right.x;
      sceneObject.rightPane.geometry.y = layout.separator.top.y;
      sceneObject.rightPane.geometry.height = coreH;
      middle = function(point, lengthFrom) {
        return parseFloat(point + (lengthFrom / 2));
      };
      sceneObject.rightPane.textElem.attr('x', middle(sceneObject.rightPane.geometry.x, sceneObject.rightPane.geometry.width)).attr('y', middle(sceneObject.rightPane.geometry.y, sceneObject.rightPane.geometry.height));
      switch (states.rightPane) {
        case 'toc-unveiling':
          sceneObject.rightPane.textElem.attr('visibility', 'hidden');
          svgUtil.sync(sceneObject.rightPane, sceneObject.TOC.redraw);
          return states.rightPane = 'toc-on';
        case 'toc-on':
          sceneObject.TOC.subElement.remove();
          return sceneObject.TOC.redraw();
        default:
          return svgUtil.sync(sceneObject.rightPane);
      }
    };
  };
  sceneHook.svg = d3.select('body').append('svg').style('background-color', '#999999');
  sceneObject.categories = {};
  navBarHook = sceneHook.svg.append('g');
  rightPane();
  textPort();
  navBars.init(navBarsTree, navBarHook, categorizedTextTree);
  titlePort();
  TOC();
  fontSizeButton = function() {
    sceneObject.fontSize = {
      element: sceneHook.svg.append("g")
    };
    sceneObject.fontDecreaseButton = sceneObject.fontSize.element.append("svg:image").attr("xlink:href", "fontSmall.svg");
    sceneObject.fontIncreaseButton = sceneObject.fontSize.element.append("svg:image").attr("xlink:href", "fontLarge.svg");
    sceneObject.fontDecreaseButton.on('mouseover', function() {
      return console.log('hover');
    }).on('mousedown', function() {
      console.log('click font decrease');
      return navBars.textportRefresh(-2);
    });
    return sceneObject.fontIncreaseButton.on('mouseover', function() {
      return console.log('hover');
    }).on('mousedown', function() {
      console.log('click font increase');
      return navBars.textportRefresh(2);
    });
  };
  fontSizeButton();
  downButton = function() {
    sceneObject.downButton = {};
    sceneObject.downButton.geometry = {
      'paddingY': 15,
      'paddingX': 30,
      'height': 25
    };
    return sceneObject.downButton.element = sceneHook.svg.append('svg:image').attr('xlink:href', 'images/downScroll6.svg').attr('preserveAspectRatio', 'none').on('mouseover', function() {
      return sceneObject.downButton.element.transition().ease('sin').duration(400).attr('height', sceneObject.downButton.geometry.height + (sceneObject.downButton.geometry.paddingY * 2 / 3));
    }).on('mouseout', function() {
      return sceneObject.downButton.element.transition().duration(300).attr('height', sceneObject.downButton.geometry.height);
    }).on('mousedown', function() {
      console.log('scroll');
      return navBars.textportRefresh(0, true);
    });
  };
  return downButton();
};

sceneSync = function(mode) {
  var autoUpdate, drawTitle, leftPane, update;
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
  drawTitle = function() {
    sceneObject.titlePort.pane.attr('width', viewport.width - 5 - 5).attr('height', layout.separator.top.y - 5 - 5).attr('x', 5).attr('y', -50).style('stroke-width', '7px').attr('rx', 10).attr('rx', 10);
    sceneObject.titlePort.textwrapper.attr('width', viewport.width - 5 - 5).attr('height', articleSelectorPaneHeight);
    sceneObject.titlePort.text.attr('x', viewport.width / 2).attr('y', 0).style('font-family', 'Helvetica').style("font-weight", "bold").attr("font-size", "30px");
    if (firstEntry) {
      sceneObject.titlePort.text.transition().duration(300).ease('sin').attr('y', layout.separator.top.y / 2);
      sceneObject.titlePort.pane.transition().duration(300).ease('sin').attr('y', 5);
      return firstEntry = false;
    } else {
      sceneObject.titlePort.text.attr('y', layout.separator.top.y / 2);
      return sceneObject.titlePort.pane.attr('y', 5);
    }
  };
  drawTitle();
  if (tokens != null) {
    switch (mode) {
      case 'animate':
        update = 0;
        autoUpdate = setInterval((function() {
          navBars.textportRefresh();
          if (update > 8) {
            setTimeout(window.clearInterval(autoUpdate), 400);
          }
          return update += 1;
        }), 50);
        break;
      default:
        navBars.textportRefresh();
    }
  }
  sceneObject.downButton.redraw = function() {
    sceneObject.downButton.geometry.width = (layout.separator.right.x - layout.separator.left.x.current) / 5;
    sceneObject.downButton.geometry.x = layout.separator.left.x.current + (((layout.separator.right.x - layout.separator.left.x.current) - sceneObject.downButton.geometry.width) / 2);
    sceneObject.downButton.geometry.y = sceneHook.svg.attr('height') - sceneObject.downButton.geometry.height - sceneObject.downButton.geometry.paddingY;
    return sceneObject.downButton.element.attr('x', sceneObject.downButton.geometry.x).attr('width', sceneObject.downButton.geometry.width).attr('y', sceneObject.downButton.geometry.y).attr('height', sceneObject.downButton.geometry.height);
  };
  sceneObject.downButton.redraw();
  sceneObject.rightPane.redraw();
  leftPane = {
    geometry: {
      x: 0,
      width: layout.separator.left.x.current - 10,
      y: layout.separator.top.y + 7,
      height: coreH - 2
    }
  };
  navBars.redraw(leftPane.geometry);
  return sceneObject.TOC.redraw = function() {
    var TOCToken, lHeight, lineSpacing, paddingX, paddingY, spaceWidth, tokenViewable, viewPortFull, x, y, _i, _len, _results;
    lineSpacing = 5;
    console.log('redraw toc started');
    spaceWidth = textDraw.tokenToViewable('a a', sceneObject.TOC.subElement).width - textDraw.tokenToViewable('aa', sceneObject.TOC.subElement).width;
    lHeight = textDraw.tokenToViewable('l', sceneObject.TOC.subElement).height;
    paddingX = 20;
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
        y += tokenViewable.height + lineSpacing;
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
  return navBarsTree = JSON.parse(response).root;
});

data.get('text', function(response) {
  return categorizedTextTree = JSON.parse(response).root;
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
  console.dir(viewport);
  return document.body.style.cursor = "default";
};

waitForData = setInterval((function() {
  if ((tokens != null) && (TOCTokens != null) && (segments != null) && (navBarsTree != null) && (categorizedTextTree != null)) {
    window.clearInterval(waitForData);
    return start();
  }
}), 50);
