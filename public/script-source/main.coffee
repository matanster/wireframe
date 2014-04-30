util = require('./util')
console.log 'javascript main started'

# Globals
svg = {}
viewport = null

#
# Define the basics of the scene, that won't change along viewport resizing.
#
sceneDefine = () ->

  boxBlock = (numberOfBoxes) ->

    colorScale = d3.scale.linear().domain([0, numberOfBoxes-1]).range(['#87CEFA', '#00BFFF'])

    colorTransition = (i) -> (() -> d3.select(this).transition().duration(25).ease('circle').style('fill', colorScale(i)))
    
    svg.boxes = []
    for box in [0..numberOfBoxes-1]
      newElement = svg.main.append('rect')
                           .style('fill', colorScale(box))   
                           .style('stroke-width', '0px')
                           .style('stroke', 'black')
                           .on('mouseover', () -> d3.select(this).transition().duration(300).ease('circle').style('fill', '#0086B2'))
                           .on('mouseout', colorTransition(box))

      svg.boxes[box]={'element': newElement}

  svg.main = d3.select('body').append('svg')
  boxBlock(6)

#
# Keep everything harmonized with the viewport size
#
sceneSync = () ->

  viewport = util.getViewport()
  console.dir viewport

  svg.main.attr('width', viewport.width)
          .attr('height', viewport.height)
          .style('background-color', '#222222')   

  totalH = viewport.height
  boxH = totalH / svg.boxes.length

  # calculate
  for i in [0..svg.boxes.length-1]
    svg.boxes[i].x1 = -20
    svg.boxes[i].y1 = Math.floor(boxH * i) - 0.5
    svg.boxes[i].x2 = 200
    if i is svg.boxes.length-1 # occupy last pixel
      svg.boxes[i].y2 = totalH + 0.5    
    else # leave last pixel to next box
      svg.boxes[i].y2 = Math.floor((boxH * (i+1))) - 0.5
    console.log svg.boxes[i].y1
    console.log svg.boxes[i].y2
    console.log '---'

    # mitigate anti-aliasing for horizontal lines
    svg.boxes[i].y1

  # draw
  for i in [0..svg.boxes.length-1]
    svg.boxes[i].element.attr('x', svg.boxes[i].x1)
       .attr('width', util.calcLength(svg.boxes[i].x1, svg.boxes[i].x2))
       .attr('y', svg.boxes[i].y1) 
       .attr('height', util.calcLength(svg.boxes[i].y1, svg.boxes[i].y2))
       .attr('rx', 20)            
       .attr('ry', 10)                        

syncInit = () ->
  sceneSync()                          # initial sync
  window.onresize = () -> sceneSync()  # keep sync forever

sceneDefine()
syncInit()

###
svg.main.append('circle')
    .style('stroke', 'gray')
    .style('fill', 'white')
    .attr('r', 40)
    .attr('cx', 50)
    .attr('cy', 50)
    .on('mouseover', () -> d3.select(this).style('fill', 'aliceblue'))
    .on('mouseout', () -> d3.select(this).style('fill', 'white'));
###