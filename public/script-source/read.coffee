util        = require './util'
data        = require './data'
tokenize    = require './tokenize'
viewporting = require './viewporting/viewporting'
console.log 'read.js main started'

# Globals
svg = {}
viewport = null
tokens = undefined

calcStart = () -> 90
calcEnd   = () -> 90

layout =
  'separator':
    'left':
      'x': 300

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
      categoryBox = svg.main.append('g')

      # avoid standard text handling of the category texts (selection, touch callouts)
      categoryBox.style('-webkit-user-select', 'none') 
                 .style('-webkit-touch-callout', 'none')      
                 .style('user-select', 'none') # future compatibility


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

                           #  
                           # edge drag behavior
                           #
                           .on('mouseover', () -> 
                              #console.log('hover')
                              this.style.cursor = "ew-resize")

                           .on('mouseout', () -> 
                              #console.log('end hover')
                              this.style.cursor = "default")

                           .on('mousedown', () -> 
                              #console.log('click')
                              this.style.cursor = "ew-resize"
                              xInitial = event.clientX
                              widthInitialBoundary = svg.textPortBoundary.attr('width')
                              widthInitialText = svg.textPort.attr('width')
                              element = d3.select(this)
                              # monitor mouse movement till click is released
                              window.onmousemove = (event) ->
                                xDiff = xInitial - event.clientX
                                svg.textPortBoundary.attr('width', widthInitialBoundary - xDiff)
                                svg.textPort.attr('width', widthInitialText - xDiff)
                                viewporting(tokens, svg.main, svg.textPort)
                              window.onmouseup = (event) ->
                                window.onmousemove = null
                                event.target.style.cursor = "default"
                                element.transition().duration(500).style('stroke', '#999999')
                                #console.log 'mouse up'

                              element.transition().duration(300).style('stroke', '#FFEEBB')
                              return
                              ) 
        
                            .on('touchstart', () ->
                              element = d3.select(this)
                              element.transition().duration(1200).style('stroke', '#FFEEBB')
                              console.log('touch start')

                              window.ontouchmove = (event) -> 
                                #for touch in event.changedTouches
                                  #window.alert touch.target + ' '  + touch.pageX

                              window.ontouchcancel = () ->
                                window.ontouchmove = null
                                element.transition().duration(1200).style('stroke', '#999999')
                                #window.alert 'touch cancel'

                              window.ontouchleave = () ->
                                window.ontouchmove = null
                                for touch in event.changedTouches
                                  window.alert touch.target + ' '  + touch.pageX
                                element.transition().duration(1200).style('stroke', '#999999')
                                
                              window.ontouched = () ->
                                window.ontouchmove = null
                                for touch in event.changedTouches
                                  window.alert touch.target + ' '  + touch.pageX
                                element.transition().duration(1200).style('stroke', '#999999')
                                #window.alert 'touch end')
                              )
    
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

  svg.fontSize = svg.main.append("g")

  svg.fontDecreaseButton = svg.fontSize.append("svg:image")
    .attr("xlink:href","fontSmall.svg")
  svg.fontIncreaseButton = svg.fontSize.append("svg:image")
    .attr("xlink:href","fontLarge.svg")

  svg.fontDecreaseButton
    .on('mouseover', () -> console.log('hover'))
    .on('mousedown', () -> 
      console.log('click font decrease')
      viewporting(tokens, svg.main, svg.textPort, -2))
  svg.fontIncreaseButton 
    .on('mouseover', () -> console.log('hover'))
    .on('mousedown', () -> 
      console.log('click font increase')
      viewporting(tokens, svg.main, svg.textPort, 2)) 

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

  layout.separator.right = { 'x': viewport.width - (2 * layout.separator.left.x) }

  # draw text port
  svg.textPortBoundary.attr('width', layout.separator.right.x)
              .attr('height', totalH + end + 19)
              .attr('x', layout.separator.left.x)
              .attr('y', start + 5)
              .style('stroke-width', '25px')
              .attr('rx', 10)
              .attr('rx', 10)

  svg.textPort.attr('width', layout.separator.right.x - 10)
              .attr('height', totalH + end + 19)
              .attr('x', layout.separator.left.x + 5)
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

  # show text if source tokens already loaded
  if tokens? then viewporting(tokens, svg.main, svg.textPort)

  #
  # taking care of font size buttons geometry - 
  # currently directly scaling the images.
  # alternative scaling method - nest under new svg element having a viewbox
  #

  #svg.fontSize.attr('transform', 'translate(1000,26) scale(0.08)')
  #.attr("viewBox",'0,0,796,1248')
  fontButtonGeometry = 
    'width':  398 * 0.08, # source image pixel width  * scaling factor
    'height': 624 * 0.08  # source image pixel height * scaling factor
  svg.fontDecreaseButton
    .attr('x', viewport.width - (fontButtonGeometry.width * 2) - 7)
    .attr('y', start - (fontButtonGeometry.height) - 7)
    .attr('width', fontButtonGeometry.width)
    .attr('height', fontButtonGeometry.height)
  svg.fontIncreaseButton
    .attr('x', viewport.width - (fontButtonGeometry.width) - 7 - 1)
    .attr('y', start - (fontButtonGeometry.height) - 7)
    .attr('width', fontButtonGeometry.width)
    .attr('height', fontButtonGeometry.height)

  # calculate for boxes
  for i in [0..svg.boxes.length-1]

    svg.boxes[i].x1 = 0
    svg.boxes[i].y1 = start + Math.floor(boxH * i) - 0.5
    svg.boxes[i].x2 = layout.separator.left.x
    if i is svg.boxes.length-1 # occupy last pixel
      svg.boxes[i].y2 = start + totalH + 0.5    
    else # leave last pixel to next box
      svg.boxes[i].y2 = start + Math.floor((boxH * (i+1))) - 0.5

    width =  util.calcLength(svg.boxes[i].x1, svg.boxes[i].x2)
    height = util.calcLength(svg.boxes[i].y1, svg.boxes[i].y2)    

    ###
    console.log svg.boxes[i].y1
    console.log svg.boxes[i].y2
    console.log '---'
    ###

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
data.get('categories', (response) -> 
  console.log(response)
  categories = JSON.parse(response)
  sceneDefine(categories.names)
  syncInit()
  document.body.style.cursor = "default" # needed because of https://code.google.com/p/chromium/issues/detail?id=3a69986&thanks=369986&ts=1399291013
  )

data.get('abstract', (response) -> 
  
  console.log(response)
  tokens = tokenize(response)
  console.dir tokens

  viewporting(tokens, svg.main, svg.textPort)
  )

