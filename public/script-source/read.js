// Generated by CoffeeScript 1.6.3
var TOCTokens, TitleChooser, articleSelectorPaneHeight, articles, articlesDisplayOrder, boxH, calcEnd, calcStart, categorizedTextTree, colors, coreH, data, drawTitle, end, firstEntry, globalDims, layout, navBars, navBarsTree, panes, sceneDefine, sceneHook, sceneObject, sceneSync, scrollButtonsRedraw, segments, selectedArticle, session, start, states, subCategoriesNavigation, svgUtil, syncInit, textDraw, titleShow, tokenize, tokens, util, viewport, waitForData;

util = require('./util');

panes = require('./panes');

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

viewport = util.getViewport();

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

scrollButtonsRedraw = function() {};

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
    },
    'top': {
      'y': null
    }
  }
};

layout.separator.left.x.revertsTo = layout.separator.left.x.current;

coreH = null;

boxH = null;

end = null;

articleSelectorPaneHeight = calcStart() - 5 - 5;

articles = ["The Relationship Between Human Capital and Firm Performance", "Article 2", "Article 3", "Article 4", "Article 5", "Article 6"];

articlesDisplayOrder = [0, 1, 2, 3, 4, 5];

selectedArticle = articles[0];

drawTitle = function() {
  sceneObject.titlePort.pane.attr('width', viewport.width - 5 - 5).attr('height', layout.separator.top.y - 5 - 5).attr('x', 5).attr('y', -50).style('stroke-width', '7px').attr('rx', 10).attr('rx', 10);
  sceneObject.titlePort.textWrapper.attr('width', viewport.width - 5 - 5).attr('height', articleSelectorPaneHeight);
  sceneObject.titlePort.text.attr('x', viewport.width / 2 - 5).attr('y', 0).style('font-family', 'Helvetica').style("font-weight", "bold").attr("font-size", "30px");
  if (firstEntry) {
    sceneObject.titlePort.text.transition().duration(300).ease('sin').attr('y', layout.separator.top.y / 2);
    sceneObject.titlePort.pane.transition().duration(300).ease('sin').attr('y', 5);
    return firstEntry = false;
  } else {
    sceneObject.titlePort.text.attr('y', layout.separator.top.y / 2);
    return sceneObject.titlePort.pane.attr('y', 5);
  }
};

titleShow = function() {
  sceneObject.titlePort = panes.titlePaneCreate(sceneObject.topPaneGroup, '#60CAFB', true);
  sceneObject.titlePort.text.text(selectedArticle);
  sceneObject.titlePort.element.on('click', function() {
    if (!states.articleSwitcher) {
      return TitleChooser();
    }
  });
  return drawTitle();
};

/(?:)/;

/(?:)/;

/(?:)/;

TitleChooser = function() {
  var activePane, chooserClose, height, titlePanes;
  activePane = null;
  states.articleSwitcher = true;
  titlePanes = [];
  height = {
    'selectorMode': articles.length * articleSelectorPaneHeight,
    'selectedMode': articleSelectorPaneHeight
  };
  if (sceneHook.textPortDiv != null) {
    sceneHook.textPortDiv.style('z-index', 0);
  }
  chooserClose = function() {
    var article, i, _i, _len;
    console.log('closing article chooser');
    sceneObject.topPaneGroup.on('mouseleave', null);
    titleShow();
    sceneObject.titlePort.textWrapper.transition().duration(300).styleTween('-webkit-transform', function() {
      return d3.interpolateString('perspective(40px) rotate3d(1, 0, 0, 0deg)', 'perspective(40px) rotate3d(1, 0, 0, 2deg)');
    });
    sceneObject.topPane.transition().duration(400).ease('linear').attr('height', height.selectedMode).each('end', function() {
      sceneObject.fontSize.redraw();
      return sceneHook.textPortDiv.style('z-index', 2);
    });
    for (i = _i = 0, _len = articles.length; _i < _len; i = ++_i) {
      article = articles[i];
      titlePanes[i].element.remove();
    }
    return states.articleSwitcher = false;
  };
  console.log('opening article chooser');
  util.makeSvgTopLayer(sceneObject.topPaneGroup.node());
  sceneObject.titlePort.textWrapper.transition().duration(450).styleTween('-webkit-transform', function() {
    return d3.interpolateString('perspective(40px) rotate3d(1, 0, 0, 2deg)', 'perspective(40px) rotate3d(1, 0, 0, 0deg)');
  }).each("end", function() {
    return sceneObject.titlePort.element.remove();
  });
  return sceneObject.topPane.transition().duration(450).ease('linear').attr('height', height.selectorMode).each("end", function() {
    var articleId, articleName, boundHandler, displayOrder, hoverHandler, pane, switchPanes, _i, _len, _results;
    sceneObject.topPaneGroup.on('mouseleave', function() {
      console.log('mouse outside title port');
      return chooserClose();
    });
    sceneObject.titlePort.element.remove();
    switchPanes = function(oldSelected, newSelected) {
      var yNewPane, yNewText, yOldPane, yOldText;
      yOldPane = oldSelected.pane.attr('y');
      yOldText = oldSelected.text.attr('y');
      yNewPane = newSelected.pane.attr('y');
      yNewText = newSelected.text.attr('y');
      util.makeSvgTopLayer(newSelected.element.node());
      oldSelected.pane.transition().duration(450).delay(250).attr('y', yNewPane);
      oldSelected.text.transition().duration(450).delay(250).attr('y', yNewText);
      newSelected.pane.transition().duration(450).attr('y', yOldPane);
      newSelected.text.transition().duration(450).attr('y', yOldText);
      oldSelected.pane.node().style.fill = '#50BFEF';
      return newSelected.pane.node().style.fill = '#60CBFE';
    };
    hoverHandler = function(hoveredPane) {
      if (hoveredPane !== activePane) {
        hoveredPane.pane.node().style.fill = '#55C4F5';
        hoveredPane.pane.node().onmouseout = function() {
          if (hoveredPane !== activePane) {
            return hoveredPane.pane.node().style.fill = '#50BFEF';
          }
        };
        return hoveredPane.pane.node().onclick = function() {
          selectedArticle = articles[hoveredPane.articleId];
          console.log("article " + selectedArticle + " selected");
          hoveredPane.element.on('click', null);
          activePane.element.on('click', chooserClose);
          switchPanes(activePane, hoveredPane);
          console.log(articlesDisplayOrder);
          articlesDisplayOrder[activePane.order] = hoveredPane.articleId;
          articlesDisplayOrder[hoveredPane.order] = activePane.articleId;
          console.log(articlesDisplayOrder);
          activePane.order = hoveredPane.order;
          hoveredPane.order = 0;
          return activePane = hoveredPane;
        };
      }
    };
    _results = [];
    for (displayOrder = _i = 0, _len = articlesDisplayOrder.length; _i < _len; displayOrder = ++_i) {
      articleId = articlesDisplayOrder[displayOrder];
      articleName = articles[articleId];
      console.log(articleName);
      if (displayOrder === 0) {
        pane = panes.titlePaneCreate(sceneObject.topPaneGroup, '#60CBFE');
      } else {
        pane = panes.titlePaneCreate(sceneObject.topPaneGroup, '#50BFEF');
      }
      titlePanes.push(pane);
      pane.text.text(articleName);
      pane.pane.attr('width', viewport.width - 5 - 5).attr('height', layout.separator.top.y - 5 - 5).attr('x', 5).attr('y', 5 + (displayOrder * articleSelectorPaneHeight)).style('stroke-width', '7px').attr('rx', 10).attr('rx', 10);
      pane.text.attr('x', viewport.width / 2).attr('y', 5 + (displayOrder + 0.5) * articleSelectorPaneHeight).style('font-family', 'Helvetica').style("font-weight", "bold").attr("font-size", "30px");
      if (displayOrder === 0) {
        activePane = pane;
        pane.element.on('click', chooserClose);
      }
      pane.order = displayOrder;
      pane.articleId = articleId;
      boundHandler = hoverHandler.bind(void 0, pane);
      _results.push(pane.pane.node().onmouseover = boundHandler);
    }
    return _results;
  });
};

sceneDefine = function() {
  var TOC, downButton, fontSizeButton, mainPanes, navBarHook, rightPane, textPort, topPane, upButton;
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
        return scrollButtonsRedraw();
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
  topPane = function() {
    sceneObject.topPaneGroup = sceneHook.svg.append('g');
    return sceneObject.topPane = sceneObject.topPaneGroup.append('rect').style('fill', '#60CAFB');
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
  sceneHook.div = d3.select('body').append('div').style('z-index', 1).style('position', 'absolute');
  sceneHook.svg = sceneHook.div.append('svg').style('background-color', '#999999');
  sceneObject.categories = {};
  navBarHook = sceneHook.svg.append('g');
  rightPane();
  textPort();
  navBars.init(navBarsTree, navBarHook, categorizedTextTree);
  topPane();
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
  upButton = function() {
    sceneObject.upButton = {};
    sceneObject.upButton.geometry = {
      'paddingY': 15,
      'paddingX': 30,
      'height': 25
    };
    return sceneObject.upButton.element = sceneHook.svg.append('svg:image').attr('xlink:href', 'images/downScroll6.svg').attr('preserveAspectRatio', 'none').on('mouseover', function() {
      return sceneObject.upButton.element.transition().ease('sin').duration(400).attr('height', sceneObject.upButton.geometry.height + (sceneObject.upButton.geometry.paddingY * 2 / 3));
    }).on('mouseout', function() {
      return sceneObject.upButton.element.transition().duration(300).attr('height', sceneObject.upButton.geometry.height);
    }).on('mousedown', function() {
      console.log('scroll');
      return navBars.textportRefresh(0, true);
    });
  };
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
  downButton();
  return upButton();
};

sceneSync = function(mode) {
  var autoUpdate, leftPane, update;
  viewport = util.getViewport();
  layout.separator.top = {
    'y': calcStart()
  };
  end = 0;
  coreH = viewport.height - layout.separator.top.y - end;
  sceneObject.topPane.attr('width', viewport.width - 5 - 5).attr('height', layout.separator.top.y - 5 - 5).attr('x', 5).attr('y', 5).style('stroke-width', '7px').attr('rx', 10).attr('rx', 10);
  titleShow();
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
    sceneObject.fontIncreaseButton.attr('x', viewport.width - fontButtonGeometry.width - 7 - 1).attr('y', layout.separator.top.y - fontButtonGeometry.height - 7).attr('width', fontButtonGeometry.width).attr('height', fontButtonGeometry.height);
    return util.makeSvgTopLayer(sceneObject.fontSize.element.node());
  };
  sceneObject.fontSize.redraw();
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
  sceneObject.upButton.redraw = function() {
    var buttonCenter;
    sceneObject.upButton.geometry.width = (layout.separator.right.x - layout.separator.left.x.current) / 5;
    sceneObject.upButton.geometry.x = layout.separator.left.x.current + (((layout.separator.right.x - layout.separator.left.x.current) - sceneObject.upButton.geometry.width) / 2);
    sceneObject.upButton.geometry.y = sceneObject.textPort.geometry.y + sceneObject.upButton.geometry.paddingY;
    buttonCenter = {
      'x': sceneObject.upButton.geometry.x + (sceneObject.upButton.geometry.width / 2),
      'y': sceneObject.upButton.geometry.y + (sceneObject.upButton.geometry.height / 2)
    };
    return sceneObject.upButton.element.attr('x', sceneObject.upButton.geometry.x).attr('width', sceneObject.upButton.geometry.width).attr('y', sceneObject.upButton.geometry.y).attr('height', sceneObject.upButton.geometry.height).attr('transform', "rotate(180," + buttonCenter.x + "," + buttonCenter.y + ")");
  };
  sceneObject.downButton.redraw = function() {
    var buttonCenter;
    sceneObject.downButton.geometry.width = (layout.separator.right.x - layout.separator.left.x.current) / 5;
    sceneObject.downButton.geometry.x = layout.separator.left.x.current + (((layout.separator.right.x - layout.separator.left.x.current) - sceneObject.downButton.geometry.width) / 2);
    sceneObject.downButton.geometry.y = sceneHook.svg.attr('height') - sceneObject.downButton.geometry.height - sceneObject.downButton.geometry.paddingY;
    buttonCenter = {
      'x': sceneObject.downButton.geometry.x + (sceneObject.downButton.geometry.width / 2),
      'y': sceneObject.downButton.geometry.y + (sceneObject.downButton.geometry.height / 2)
    };
    return sceneObject.downButton.element.attr('x', sceneObject.downButton.geometry.x).attr('width', sceneObject.downButton.geometry.width).attr('y', sceneObject.downButton.geometry.y).attr('height', sceneObject.downButton.geometry.height);
  };
  scrollButtonsRedraw();
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
  console.log("detected viewport dimensions: height=" + viewport.height + " width=" + viewport.width);
  return document.body.style.cursor = "default";
};

waitForData = setInterval((function() {
  if ((tokens != null) && (TOCTokens != null) && (segments != null) && (navBarsTree != null) && (categorizedTextTree != null)) {
    window.clearInterval(waitForData);
    return start();
  }
}), 50);
