// Generated by CoffeeScript 1.6.3
var barUnselect, bars, colors, globalDims, layout, lookup, oldpanes, oldshow, oldsomething, redraw, root, sceneObject, svgUtil, textRectFactory, util;

util = require('./util');

svgUtil = require('./svgUtil');

globalDims = require('./globalDims');

sceneObject = globalDims.sceneObject;

layout = globalDims.layout;

bars = [];

root = {};

lookup = {};

colors = {
  scaleStart: '#87CEFA',
  scaleEnd: '#00BFFF',
  selection: '#999999'
};

textRectFactory = function(svgHookPoint, rectText) {
  var group, rectangle, text, textDims;
  group = svgHookPoint.append('g').style('-webkit-user-select', 'none').style('-webkit-touch-callout', 'none').style('user-select', 'none').attr('id', rectText).attr('visibility', 'hidden');
  rectangle = group.append('rect').style('stroke-width', '0px').style('fill-opacity', '1');
  if (rectText != null) {
    text = group.append('text').text(rectText).style("text-anchor", "middle").attr("dominant-baseline", "central").style("font-family", "verdana").style('fill', '#EEEEEE').style("font-weight", "bold");
    textDims = {
      width: text.node().getBBox().width,
      height: text.node().getBBox().height
    };
  } else {
    text = null;
  }
  sceneObject = {
    group: group,
    rectangle: rectangle,
    text: text,
    textDims: textDims
  };
  return sceneObject;
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

exports.init = function(navBarsData, svgHookPoint) {
  var bar, barCreate, barData, colorScale, i, initialViewStatus, _i, _j, _len, _len1, _results;
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
  barCreate = function(svgHookPoint, barData, parentBar, baseColor) {
    var bar, barDataSub, nestLevel, subBar, _i, _len, _ref;
    if (parentBar === null) {
      nestLevel = 0;
    } else {
      nestLevel = parentBar.nestLevel + 1;
    }
    bar = {
      'name': barData.name,
      'element': textRectFactory(svgHookPoint, barData.name),
      'baseColor': baseColor,
      'parent': parentBar,
      'nestLevel': nestLevel,
      'viewStatus': 'hidden'
    };
    initialViewStatus(bar);
    lookup[bar.element.group.attr('id')] = bar;
    if (barData.subs != null) {
      bar.children = [];
      _ref = barData.subs;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        barDataSub = _ref[_i];
        subBar = barCreate(svgHookPoint, barDataSub, bar, '#BBBBBB');
        bar.children.push(subBar);
      }
    }
    bar.element.group.on('mouseover', function() {
      return null;
    }).on('mouseout', function() {
      return null;
    }).on('mousedown', function() {
      var child, sibling, _j, _k, _len1, _len2, _ref1, _ref2;
      bar = lookup[this.getAttribute('id')];
      if (bar.parent != null) {
        _ref1 = bar.parent.children;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          sibling = _ref1[_j];
          if (sibling.viewStatus === 'selected') {
            barUnselect(sibling);
          }
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
        }
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
