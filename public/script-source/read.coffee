util = require('./util')
data = require('./data')
console.log 'read.js main started'

# Globals
svg = {}
viewport = null

calcStart = () -> 90
calcEnd   = () -> 90

#####################################################################
#
# Define the objects making the scene, plus any of their properties 
# that won't change with subsequent window resizing
#
#####################################################################
sceneDefine = (categories) ->

  main = () ->
    svg.main = d3.select('body').append('svg').style('background-color', '#222222')   

  boxBlock = (categories) ->

    console.log categories
    numberOfBoxes = categories.length

    #colorScale = d3.scale.linear().domain([0, numberOfBoxes-1]).range(['#87CEFA', '#00BFFF'])
    colorScale = d3.scale.linear().domain([0, numberOfBoxes-1]).range(['#CCCCE0','#AAAABE'])


    colorTransition = (i) -> (() -> d3.select(this).transition().duration(25).ease('circle').style('fill', colorScale(i)))
    
    svg.boxes = []
    for box in [0..numberOfBoxes-1]
      categoryBox = svg.main.append('g');

      rectangle = categoryBox.append('rect')
                           .style('fill', colorScale(box))   
                           .style('stroke-width', '0px')
                           .style('fill-opacity', '1')

      text = categoryBox.append('text').text(categories[box])
                                       .style("text-anchor", "middle")
                                       .attr("dominant-baseline", "central")
                                       .style("font-family", "Helvetica")
                                       .style("font-weight", "bold")
                                       .style('fill', '#EEEEEE')                                                                                                               

      rectangle.on('mouseover', () -> d3.select(this).transition().duration(300).ease('circle').style('fill', '#999999')) #0086B2 #FAF2DA
               .on('mouseout', colorTransition(box))

      svg.boxes[box] = {}
      svg.boxes[box].element = rectangle
      svg.boxes[box].text = text

  textPort = () ->

    svg.textPortBoundary = svg.main.append('rect')
                           .style('stroke', '#999999')
                           .style('fill', '#222222')   

    svg.textPort = svg.main.append('rect')
                           .style('stroke', '#222222')
                           .style('fill', '#222222')   

  titlePort = () ->
    svg.titlePort = svg.main.append('rect')
                            .style('stroke', '#999999')
                            .style('fill', '#FFEEBB')   

    svg.title = svg.main.append('text').text("Entrepreneurship in 2020 - a Projection")
                                       .style("text-anchor", "middle")

  main()
  boxBlock(categories)
  textPort()
  titlePort()

  group = svg.main.append("svg")
    .attr('x', 1340)
    .attr('y', 30)  
    .attr('width', 100)
    .attr('height', 80)
    .attr("viewBox",'0,0,796,1248')
  fontDecreaseButton = group.append("svg:image")
    .attr('x',0)
    .attr('y',0)
    .attr('width', 398)
    .attr('height', 624)
    .attr("xlink:href","fontSmall.svg")
  fontIncreaseButton = group.append("svg:image")
    .attr('x',398)
    .attr('y',0)
    .attr('width', 398)
    .attr('height', 624)
    .attr("xlink:href","fontLarge.svg")

  fontDecreaseButton.on('mouseover', () -> console.log('hover'))
  fontDecreaseButton.on('mousedown', () -> console.log('click font decrease'))  

  fontIncreaseButton.on('mouseover', () -> console.log('hover'))
  fontIncreaseButton.on('mousedown', () -> console.log('click font increase'))  


######################################################
#
# Keep everything harmonized with the viewport size
#
######################################################
sceneSync = () ->

  viewport = util.getViewport()
  console.dir viewport

  start = calcStart()
  end   = 0 # calcEnd()

  totalH = viewport.height - start - end
  boxH = totalH / svg.boxes.length

  # draw main svg
  svg.main.attr('width', viewport.width)
          .attr('height', viewport.height)

  # draw text port
  svg.textPortBoundary.attr('width', 800)
              .attr('height', totalH + end + 19)
              .attr('x', 300)
              .attr('y', start + 5)
              .style('stroke-width', '25px')
              .attr('rx', 10)
              .attr('rx', 10)

  svg.textPort.attr('width', 800 - 10)
              .attr('height', totalH + end + 19)
              .attr('x', 300 + 5)
              .attr('y', start + 5 + 5)
              .style('stroke-width', '15px')
              .attr('rx', 10)
              .attr('rx', 10)


  # draw title port 
  svg.titlePort.attr('width', viewport.width)
               .attr('height', start)
               .attr('x', 0)
               .attr('y', 0)
               .style('stroke-width', '7px')
               .attr('rx', 10)
               .attr('rx', 10)              

  svg.title.attr('x', viewport.width / 2)
           .attr('y', start / 2)
           .style('fill', "#999999")
           .style('font-family', 'Helvetica')
           .style("font-weight", "bold")
           .attr("font-size", "25px")
           .attr("dominant-baseline", "central")
            

  # calculate for boxes
  for i in [0..svg.boxes.length-1]

    svg.boxes[i].x1 = 0
    svg.boxes[i].y1 = start + Math.floor(boxH * i) - 0.5
    svg.boxes[i].x2 = 300
    if i is svg.boxes.length-1 # occupy last pixel
      svg.boxes[i].y2 = start + totalH + 0.5    
    else # leave last pixel to next box
      svg.boxes[i].y2 = start + Math.floor((boxH * (i+1))) - 0.5

    width =  util.calcLength(svg.boxes[i].x1, svg.boxes[i].x2)
    height = util.calcLength(svg.boxes[i].y1, svg.boxes[i].y2)    

    console.log svg.boxes[i].y1
    console.log svg.boxes[i].y2
    console.log '---'

  # draw for boxes
  for i in [0..svg.boxes.length-1]
    svg.boxes[i].element.attr('x', svg.boxes[i].x1)
       .attr('width', width)
       .attr('y', svg.boxes[i].y1) 
       .attr('height', height)

    svg.boxes[i].text.attr('x', svg.boxes[i].x1 + width / 2)  
                     .attr('y', svg.boxes[i].y1 + height / 2)

syncInit = () ->
  sceneSync()                          # initial sync
  window.onresize = () -> sceneSync()  # keep sync forever

##################
#                #
#  Start it all  #
#                #
##################
data.get('abstract', (response) -> console.log(response))
data.get('categories', (response) -> 
  console.log(response)
  categories = JSON.parse(response)
  sceneDefine(categories.names)
  syncInit())
