// Generated by CoffeeScript 1.6.3
var barUnselect, bars, categorizedTextTree, colors, getCategoryText, globalDims, layout, lookup, redraw, root, sceneObject, searchCategories, session, sessionSetDisplayType, svgUtil, textRectFactory, textportFluent, textportRefresh, textportSegmented, tokenize, util;

util = require('./util');

svgUtil = require('./svgUtil');

textportFluent = require('./textportFluent');

textportSegmented = require('./textportSegmented');

session = require('./session');

tokenize = require('./tokenize');

globalDims = require('./globalDims');

sceneObject = globalDims.sceneObject;

layout = globalDims.layout;

bars = [];

root = {};

lookup = {};

colors = {
  scaleStart: '#999999',
  scaleEnd: '#999999',
  selection: '#60cafb'
};

categorizedTextTree = void 0;

textRectFactory = function(svgHookPoint, rectText) {
  var styles;
  styles = {
    text: {
      'font-family': 'verdana',
      'fill': '#EEEEEE',
      'font-weight': 'bold'
    },
    rectangle: {
      'stroke-width': '0px',
      'fill-opacity': '1'
    }
  };
  return svgUtil.textRectFactory(svgHookPoint, rectText, styles, 'hidden');
};

searchCategories = function(categoryNodes, catName) {
  var categoryNode, _i, _len;
  for (_i = 0, _len = categoryNodes.length; _i < _len; _i++) {
    categoryNode = categoryNodes[_i];
    if (categoryNode.name === catName) {
      return categoryNode.text;
    } else {
      if (categoryNode.subs != null) {
        if (searchCategories(categoryNode.subs, catName)) {
          return searchCategories(categoryNode.subs, catName);
        }
      }
    }
  }
  return false;
};

getCategoryText = function(catName) {
  var text;
  return text = searchCategories(categorizedTextTree, catName);
};

textportRefresh = function(fontSizeChange, scroll, mode) {
  var categoryNode, downArrowNeeded, rawSegment, rawTextArray, segment, segments, _i, _j, _len, _len1;
  switch (session.display) {
    case 'segmented':
      for (_i = 0, _len = categorizedTextTree.length; _i < _len; _i++) {
        categoryNode = categorizedTextTree[_i];
        if (categoryNode.name === session.selected.name) {
          rawTextArray = categoryNode.text;
        }
      }
      segments = [];
      for (_j = 0, _len1 = rawTextArray.length; _j < _len1; _j++) {
        rawSegment = rawTextArray[_j];
        segment = {
          category: null,
          tokens: tokenize(rawSegment)
        };
        segments.push(segment);
      }
      return textportSegmented(segments, fontSizeChange, scroll, mode);
    case 'fluent':
      return downArrowNeeded = textportFluent(categorizedTextTree, fontSizeChange, scroll, mode);
  }
};

exports.textportRefresh = textportRefresh;

sessionSetDisplayType = function(bar) {
  if (bar.display === 'segmented') {
    return session.display = 'segmented';
  } else {
    return session.display = 'fluent';
  }
};

barUnselect = function(bar) {
  var hideChildren;
  hideChildren = function(bar) {
    var child, _i, _len, _ref, _results;
    if (bar.children != null) {
      _ref = bar.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.viewStatus = 'hidden';
        child.element.group.attr('visibility', 'hidden');
        _results.push(hideChildren(child));
      }
      return _results;
    }
  };
  bar.viewStatus = 'visible';
  return hideChildren(bar);
};

exports.init = function(navBarsData, svgHookPoint, categorizedTextTreeInput) {
  var bar, barCreate, barData, colorScale, i, initialViewStatus, _i, _j, _len, _len1, _results;
  categorizedTextTree = categorizedTextTreeInput;
  console.log('navBars init started');
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
    if (bar.name === "AAA Goals") {
      bar.viewStatus = 'selected';
      return bar.select();
    }
  };
  barCreate = function(svgHookPoint, barData, parentBar, baseColor) {
    var bar, nestLevel;
    if (parentBar === null) {
      nestLevel = 0;
    } else {
      nestLevel = parentBar.nestLevel + 1;
    }
    bar = {
      'name': barData.name,
      'display': barData.display,
      'element': textRectFactory(svgHookPoint, barData.name),
      'baseColor': baseColor,
      'parent': parentBar,
      'nestLevel': nestLevel,
      'viewStatus': 'hidden',
      'emphasis': barData.emphasis,
      'select': (function() {
        session.selected = this;
        sessionSetDisplayType(this);
        return window.setTimeout(textportRefresh, 300);
      })
    };
    initialViewStatus(bar);
    lookup[bar.element.group.attr('id')] = bar;
    /*
    # proceed to recursion over bar subs, if any
    if barData.subs?
      bar.children = []
      for barDataSub in barData.subs
        subBar = barCreate(svgHookPoint, barDataSub, bar, '#BBBBBB')
        bar.children.push(subBar)
    */

    bar.element.group.on('mouseover', function() {
      return null;
    }).on('mouseout', function() {
      return null;
    }).on('mousedown', function() {
      var child, sibling, _i, _j, _len, _len1, _ref, _ref1;
      bar = lookup[this.getAttribute('id')];
      if (bar.parent != null) {
        _ref = bar.parent.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sibling = _ref[_i];
          if (sibling.viewStatus === 'selected') {
            barUnselect(sibling);
          }
        }
      }
      bar.viewStatus = 'selected';
      bar.select();
      if (bar.children != null) {
        _ref1 = bar.children;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          child = _ref1[_j];
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
  _results = [];
  for (_j = 0, _len1 = bars.length; _j < _len1; _j++) {
    bar = bars[_j];
    _results.push(bar.parent = root);
  }
  return _results;
};

redraw = function(bars, borderColor) {
  var allowedGeometry, anySelected, bar, childGeometryPadding, height, i, textGeometry, visibleChildren, y, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1;
  console.log('navBars redraw started');
  allowedGeometry = bars[0].parent.childrenGeometry;
  anySelected = false;
  for (_i = 0, _len = bars.length; _i < _len; _i++) {
    bar = bars[_i];
    if (bar.viewStatus === 'selected') {
      anySelected = true;
    }
  }
  for (_j = 0, _len1 = bars.length; _j < _len1; _j++) {
    bar = bars[_j];
    visibleChildren = false;
    if (bar.children != null) {
      if ((_ref = bar.children[0].viewStatus) === 'visible' || _ref === 'selected') {
        visibleChildren = true;
      }
    }
    switch (bar.viewStatus) {
      case 'selected':
        if (visibleChildren) {
          bar.color = bar.baseColor;
        } else {
          bar.color = colors.selection;
          bar.element.text.style('fill', 'EEEEEE').attr("font-size", "20px").style("font-weight", "bold");
        }
        break;
      default:
        bar.color = bar.baseColor;
        bar.element.text.style('fill', 'EEEEEE').attr("font-size", "16px").style("font-weight", "bold");
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
  y = allowedGeometry.y;
  for (i = _m = 0, _len4 = bars.length; _m < _len4; i = ++_m) {
    bar = bars[i];
    visibleChildren = false;
    if (bar.children != null) {
      if ((_ref1 = bar.children[0].viewStatus) === 'visible' || _ref1 === 'selected') {
        visibleChildren = true;
      }
    }
    switch (bar.heightRatio) {
      case 'main':
        height = Math.floor(allowedGeometry.height * (2 / 3));
        break;
      case 'subordinate':
        height = Math.floor(allowedGeometry.height * (1 / 3) / (bars.length - 1));
        break;
      case 'even':
        height = Math.floor(allowedGeometry.height / bars.length);
    }
    bar.geometry = {
      x: allowedGeometry.x,
      width: allowedGeometry.width,
      y: y + 0.5,
      height: height
    };
    if (bar.textPaddedSpace == null) {
      bar.textPaddedSpace = bar.geometry.height;
      bar.innerExtraPadding = {
        top: bar.textPaddedSpace * 1.5,
        bottom: bar.textPaddedSpace * 0.2
      };
    }
    bar.element.rectangle.transition().ease('linear').duration(400).attr(bar.geometry).style('fill', bar.color);
    if (visibleChildren) {
      childGeometryPadding = {
        x: 12,
        y: 5
      };
      bar.childrenGeometry = {
        x: bar.geometry.x + childGeometryPadding.x,
        width: bar.geometry.width - (childGeometryPadding.x * 1),
        y: bar.geometry.y + childGeometryPadding.y + bar.innerExtraPadding.top,
        height: bar.geometry.height - (childGeometryPadding.y * 2) - (bar.innerExtraPadding.top + bar.innerExtraPadding.bottom)
      };
      window.setTimeout(redraw, 400, bar.children);
      textGeometry = {
        'x': bar.geometry.x + (bar.geometry.width / 2),
        'y': bar.geometry.y + (bar.innerExtraPadding.top / 2)
      };
    } else {
      textGeometry = {
        'x': bar.geometry.x + (bar.geometry.width / 2),
        'y': bar.geometry.y + (bar.geometry.height / 2)
      };
    }
    bar.element.text.transition().ease('linear').duration(200).attr(textGeometry);
    bar.element.group.attr('visibility', 'visible');
    y += height;
  }
  return null;
};

exports.redraw = function(geometry) {
  root.geometry = geometry;
  root.childrenGeometry = {
    x: root.geometry.x,
    width: root.geometry.width,
    y: root.geometry.y,
    height: root.geometry.height
  };
  return redraw(bars);
};

/*

oldshow = () ->
  #
  # Show left panes and make them change on clicks (hackish style)
  #

  groupY = layout.separator.top.y - 0.5
  panes(groupY, totalH, layout.separator.left.x.current, sceneObject.categories.level1)

  groupY = totalH/2 + layout.separator.top.y - 0.5
  panes(groupY, totalH/2, layout.separator.left.x.current, sceneObject.categories.level2)


# console.log JSON.stringify(bar.childrenGeometry, null, '  ')
*/

