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

sceneDefine = function(categories) {
  var boxBlock, fontDecreaseButton, fontIncreaseButton, group, main, textPort, titlePort;
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
    svg.textPortBoundary = svg.main.append('rect').style('stroke', '#999999').style('fill', '#222222');
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
  group = svg.main.append("svg").attr('x', 1340).attr('y', 30).attr('width', 100).attr('height', 80).attr("viewBox", '0,0,796,1248');
  fontDecreaseButton = group.append("svg:image").attr('x', 0).attr('y', 0).attr('width', 398).attr('height', 624).attr("xlink:href", "fontSmall.svg");
  fontIncreaseButton = group.append("svg:image").attr('x', 398).attr('y', 0).attr('width', 398).attr('height', 624).attr("xlink:href", "fontLarge.svg");
  fontDecreaseButton.on('mouseover', function() {
    return console.log('hover');
  });
  fontDecreaseButton.on('mousedown', function() {
    return console.log('click font decrease');
  });
  fontIncreaseButton.on('mouseover', function() {
    return console.log('hover');
  });
  return fontIncreaseButton.on('mousedown', function() {
    return console.log('click font increase');
  });
};

sceneSync = function() {
  var boxH, end, height, i, start, totalH, width, _i, _j, _ref, _ref1, _results;
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
    svg.boxes[i].x1 = 0;
    svg.boxes[i].y1 = start + Math.floor(boxH * i) - 0.5;
    svg.boxes[i].x2 = 300;
    if (i === svg.boxes.length - 1) {
      svg.boxes[i].y2 = start + totalH + 0.5;
    } else {
      svg.boxes[i].y2 = start + Math.floor(boxH * (i + 1)) - 0.5;
    }
    width = util.calcLength(svg.boxes[i].x1, svg.boxes[i].x2);
    height = util.calcLength(svg.boxes[i].y1, svg.boxes[i].y2);
    console.log(svg.boxes[i].y1);
    console.log(svg.boxes[i].y2);
    console.log('---');
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

data.get('abstract', function(response) {
  return console.log(response);
});

data.get('categories', function(response) {
  var categories;
  console.log(response);
  categories = JSON.parse(response);
  sceneDefine(categories.names);
  return syncInit();
});
