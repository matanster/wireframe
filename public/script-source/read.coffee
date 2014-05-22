util        = require './util'
data        = require './data'
tokenize    = require './tokenize'
textporting = require './textporting'
textDraw    = require './textDraw'
svgUtil     = require './svgUtil'

# Import global geometry
globalDims = require './globalDims'
svg    = globalDims.svg
layout = globalDims.layout

console.log 'read.js main started'

firstEntry = true

# Globals
viewport  = null
states    = {}

tokens    = undefined
TOCTokens = []
categories = undefined

calcStart = () -> 90
calcEnd   = () -> 90

layout =
  'separator':
    'left':
      'x':
        'current': 300

layout.separator.left.x.revertsTo = layout.separator.left.x.current
layout.separator.top = {}

totalH = null
boxH   = null
end    = null

#####################################################################
#
# Define the objects making the scene, plus any of their properties 
# that won't change with subsequent window resizing
#
#####################################################################
sceneDefine = (categories) ->

  main = () ->
    svg.main = d3.select('body').append('svg').style('background-color', '#999999')   

  TOC = () -> 

    svg.TOC = {} 

    fontSize  = '14px' # temporarily
    fontFamily = 'verdana' # for now
    svg.TOC.element = svg.main.append('svg')
                        
    svg.TOC.subElement = svg.TOC.element.append('g')
                                 .style('text-anchor', 'start')
                                 .style('fill', 'rgb(50,50,240)')                                                                                                                                            
                                 .style('font-family',fontFamily)
                                 .style('font-size',fontSize)


    # derive tokens we can work with, and and get ready to display them 
    # (create svg elements, get needed overall width)
    maxLen = 0
    for token in TOCTokens 
      tokenViewable = textDraw.tokenToViewable(token.text, svg.TOC.element)
      if tokenViewable.width > maxLen 
        maxLen = tokenViewable.width
  
    #
    # set geometry
    #
    svg.TOC.geometry = 
      paddingX : 30  # to do: make adaptive
      
    svg.TOC.geometry.width = maxLen + (2 * svg.TOC.geometry.paddingX)   


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
                                       .style("font-family", "verdana")
                                       .style("font-weight", "bold")
                                       .style('fill', '#EEEEEE')                                                                                                               

      rectangle.on('mouseover', () -> d3.select(this).transition().duration(300).ease('circle').style('fill', '#999999')) #0086B2 #FAF2DA
               .on('mouseout', colorTransition(box))

      svg.boxes[box] = {}
      svg.boxes[box].element = rectangle
      svg.boxes[box].text = text

  
  textPort = () ->

    svg.textPortBoundary = {}
    svg.textPortBoundary.element = svg.main.append('rect')
                           .style('stroke', '#999999')
                           .style('fill', '#999999')   

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
                              widthInitialBoundary = svg.textPortBoundary.element.attr('width')
                              widthInitialText = svg.textPort.element.attr('width')
                              rightInitialSeparator = layout.separator.right.x
                              element = d3.select(this)
                              # monitor mouse movement till click is released
                              window.onmousemove = (event) ->
                                xDiff = xInitial - event.clientX

                                layout.separator.right.x = rightInitialSeparator - xDiff 

                                layout.separator.right.y = rightInitialSeparator - xDiff 


                                svg.textPortBoundary.element.attr('width', widthInitialBoundary - xDiff)
                                svg.textPort.element.attr('width', widthInitialText - xDiff)

                                textporting(tokens)
                                svg.rightPane.redraw()
                                svg.downButton.redraw()
                              window.onmouseup = (event) ->
                                window.onmousemove = null
                                event.target.style.cursor = "default"
                                element.transition().duration(500).style('stroke', '#999999')
                                #console.log 'mouse up'

                              element.transition().duration(300).style('stroke', '#2F72FF') #FFEEBB
                              return
                              ) 
                            # To be merged with the mouse interaction code for the same.
                            # Note that this code assumes only one tap, whereas 
                            # in reality a whole touch list is created if there's 
                            # more than one simultaneous tap - which will likely break this code        
                            .on('touchstart', () ->
                              element = d3.select(this)
                              element.transition().duration(900).style('stroke', '#FFEEBB')
                              xInitial = event.changedTouches[0].clientX
                              widthInitialBoundary = svg.textPortBoundary.element.attr('width')
                              widthInitialText = svg.textPort.element.attr('width')

                              window.ontouchmove = (event) -> 
                                xDiff = xInitial - event.changedTouches[0].clientX
                                svg.textPortBoundary.element.attr('width', widthInitialBoundary - xDiff)
                                svg.textPort.element.attr('width', widthInitialText - xDiff)
                                textporting(tokens)

                              window.ontouchcancel = () ->
                                window.ontouchmove = null
                                element.transition().duration(600).style('stroke', '#999999')
                                #window.alert 'touch cancel'

                              window.ontouchleave = () ->
                                window.ontouchmove = null
                                element.transition().duration(600).style('stroke', '#999999')
                                
                              window.ontouchend = () ->
                                window.ontouchmove = null
                                element.transition().duration(600).style('stroke', '#999999')
                                #window.alert 'touch end')
                              )
    
    svg.textPort = {}
    svg.textPort.element = svg.main.append('rect')
                           .style('stroke', '#222222')
                           .style('fill', '#222222')   

  titlePort = () ->
    svg.titlePort = svg.main.append('rect')
                            .style('fill', '#2F72FF')   

    svg.title = svg.main.append('text').text("Something Something Something Title")
                                       .style("text-anchor", "middle")
                                       .style('fill', "#eeeeee")


  rightPane = ->
    svg.rightPane = {}
    svg.rightPane.element = svg.main.append('rect')
                                    #.style('fill', '#ccccff')
                                    .style('fill', '#999999') #888888
                                    #.style('stroke-width', '1px')
                                    #.style('stroke', '#bbbbee')
                                    .style('fill-opacity', '1')

    svg.rightPane.geometry = {}
    svg.rightPane.geometry = 
      'hoverIgnoreAreaX': 30, # need to adjust to Y value, per screen aspect ratio
      'hoverIgnoreAreaY': 30  # need to adjust to X value, per screen aspect ratio
                                    
    svg.rightPane.element.on('mouseover', () ->

      svg.rightPane.element.on('mousemove', () -> # to do: replace with a more circular area of tolerance
        if event.x > layout.separator.right.x + svg.rightPane.geometry.hoverIgnoreAreaX
          if event.y > layout.separator.top.y + svg.rightPane.geometry.hoverIgnoreAreaY and
             event.y < viewport.height - svg.rightPane.geometry.hoverIgnoreAreaY 

#            unless zoneEntry?
#              zoneEntry = new Date().getMilliseconds() # todo: switch to performance.now() if supported on all applicable browsers 
#            else 
#              now = new Date().getMilliseconds()
#              if now - zoneEntry > 1000 # 1 second within activation zone

            #console.log new Date().getMilliseconds() - hoverStart # > 1500 # 1.5 seconds

            svg.rightPane.element.on('mousemove', null)
            svg.rightPane.mode = 'animate'
            svg.textPortBoundary.mode = 'animate'
            svg.textPort.mode = 'animate'
            layout.separator.right.x = viewport.width - svg.TOC.geometry.width
            states.showTOC = 'in progress'
            sceneSync('animate')
            #svg.rightPane.element.transition().duration(300).attr('x', layout.separator.right.x)
            #svg.rightPane.element.transition().duration(300).attr('width', svg.TOC.geometry.width)
        )
      )

    svg.rightPane.redraw = ->

      console.log 'right pane redraw'

      if states.showTOC is 'in progress'
        svg.rightPane.geometry.width = svg.TOC.geometry.width
      else 
        svg.rightPane.geometry.width = viewport.width - (layout.separator.right.x - layout.separator.left.x.current)

      svg.rightPane.geometry.x = layout.separator.right.x
      svg.rightPane.geometry.y = layout.separator.top.y
      svg.rightPane.geometry.height = totalH

      if states.showTOC is 'in progress'
        svgUtil.sync(svg.rightPane, svg.TOC.redraw)
        #svg.rightPane.element.transition().delay(400).duration(250).style('fill', '#888888') 
      else
        svgUtil.sync(svg.rightPane)

  main()
  boxBlock(categories)
  rightPane()
  textPort()
  titlePort()
  TOC()

  # font buttons
  svg.fontSize = svg.main.append("g")

  svg.fontDecreaseButton = svg.fontSize.append("svg:image")
    .attr("xlink:href","fontSmall.svg")
  svg.fontIncreaseButton = svg.fontSize.append("svg:image")
    .attr("xlink:href","fontLarge.svg")

  svg.fontDecreaseButton
    .on('mouseover', () -> console.log('hover'))
    .on('mousedown', () -> 
      console.log('click font decrease')
      textporting(tokens, -2))
  svg.fontIncreaseButton 
    .on('mouseover', () -> console.log('hover'))
    .on('mousedown', () -> 
      console.log('click font increase')
      textporting(tokens, 2)) 

  # viewport down button 
  svg.downButton = {}

  svg.downButton.geometry = 
    'paddingY': 15,
    'paddingX': 30, 
    'height': 35

  svg.downButton.element = svg.main.append('svg:image')
    .attr('xlink:href','images/downScroll4.svg')
    .attr('preserveAspectRatio', 'none')
    .on('mouseover', () -> 
      console.log('hover')
      svg.downButton.element.transition().ease('sin').duration(200).attr('height', svg.downButton.geometry.height + (svg.downButton.geometry.paddingY *2/3)))
    .on('mouseout', () -> 
      console.log('hover')
      svg.downButton.element.transition().duration(400).attr('height', svg.downButton.geometry.height))
    .on('mousedown', () -> 
      console.log('scroll')
      textporting(tokens, 0, true)) 



######################################################
#
# Keep everything harmonized with the viewport size
#
######################################################
sceneSync = (mode) ->

  viewport = util.getViewport()
  console.dir viewport

  layout.separator.top = { 'y' : calcStart()}
  end   = 0 # calcEnd()

  totalH = viewport.height - layout.separator.top.y - end

  # draw main svg
  svg.main.attr('width', viewport.width)
          .attr('height', viewport.height)

  unless layout.separator.right?
    layout.separator.right = { 'x': viewport.width - layout.separator.left.x.current } # initial value only


  # draw text port

  svg.textPortBoundary.geometry = 
    'x':            layout.separator.left.x.current,
    'width':        layout.separator.right.x - layout.separator.left.x.current,
    'y':            layout.separator.top.y + 5,
    'height':       totalH

  svg.textPortBoundary.style = 
    'stroke-width': '25px'

  svgUtil.sync(svg.textPortBoundary)

  svg.textPort.geometry = 
              'x'      : layout.separator.left.x.current + 5,
              'width'  : layout.separator.right.x - layout.separator.left.x.current - 10,
              'height' : totalH, # this is a hack - it ends below viewport bottom, otherwise curved edge shows
              'y'      : layout.separator.top.y + 5 + 10,
              'rx'     : 10,
              'rx'     : 10
  svg.textPort.style = 
    'stroke-width': '15px'

  svgUtil.sync(svg.textPort)
  console.log svg.textPort.element.attr('width')
  console.log svg.textPort.geometry.width

  # draw title port 
  svg.titlePort.attr('width', viewport.width - 5 - 5)
               .attr('height', layout.separator.top.y - 5 - 5)
               .attr('x', 5)
               .attr('y', 5)
               .style('stroke-width', '7px')
               .attr('rx', 10)
               .attr('rx', 10)              

  svg.title.attr('x', viewport.width / 2)
           .attr('y', 0)
           .style('font-family', 'Helvetica')
           .style("font-weight", "bold")
           .attr("font-size", "30px")
           .attr("dominant-baseline", "central")

  if firstEntry
    svg.title.transition().duration(1000).ease('bounce')
                                        .attr('x', viewport.width / 2)
                                        .attr('y', layout.separator.top.y / 2)
  else 
    svg.title
       .attr('x', viewport.width / 2)
       .attr('y', layout.separator.top.y / 2)

  firstEntry = false

  # show text if source tokens already loaded
  console.log 'before textporting from scenesync'
  if tokens? 
    #console.log mode
    switch mode
      when 'animate' # redraw every small interval, while the d3 transition for the right pane is in progress. 
                     # to do: this can be interleaved in the code more gracefully
        console.log 'in animate'
        update = 0
        autoUpdate = setInterval((()-> 
          textporting(tokens)
          if update > 8 then setTimeout(window.clearInterval(autoUpdate), 400)
          update += 1
        ), 50)  
      else
        console.log 'without animate'
        textporting(tokens)

    
  

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
    .attr('y', layout.separator.top.y - (fontButtonGeometry.height) - 7)
    .attr('width', fontButtonGeometry.width)
    .attr('height', fontButtonGeometry.height)
  svg.fontIncreaseButton
    .attr('x', viewport.width - (fontButtonGeometry.width) - 7 - 1)
    .attr('y', layout.separator.top.y - (fontButtonGeometry.height) - 7)
    .attr('width', fontButtonGeometry.width)
    .attr('height', fontButtonGeometry.height)

  # calculate for boxes

  boxH = (totalH / 2) / (svg.boxes.length - 1)

  for i in [0..svg.boxes.length-1]

    svg.boxes[i].x1 = 0
    svg.boxes[i].x2 = layout.separator.left.x.current    

    if i is 0
      svg.boxes[i].y1 = layout.separator.top.y - 0.5
      svg.boxes[i].y2 = layout.separator.top.y + (totalH/2) + 0.5
    else
      svg.boxes[i].y1 = layout.separator.top.y + (totalH / 2) + Math.floor(boxH * (i-1)) - 0.5
      svg.boxes[i].y2 = layout.separator.top.y + (totalH / 2) + Math.floor((boxH * (i))) + 0.5    

    #if i is svg.boxes.length-1 # occupy last pixel
    #  svg.boxes[i].y2 = layout.separator.top.y + totalH + 0.5    
    #else # leave last pixel to next box
    #  svg.boxes[i].y2 = layout.separator.top.y + Math.floor((boxH * (i+1))) - 0.5

    width =  util.calcLength(svg.boxes[i].x1, svg.boxes[i].x2)
    height = util.calcLength(svg.boxes[i].y1, svg.boxes[i].y2)    

    ###
    console.log svg.boxes[i].y1
    console.log svg.boxes[i].y2
    console.log '---'
    ###

    # draw for boxes
    svg.boxes[i].element
       .attr('x', svg.boxes[i].x1)
       .attr('width', width)
       .attr('y', svg.boxes[i].y1) 
       .attr('height', height)

    svg.boxes[i].text.attr('x', svg.boxes[i].x1 + width / 2)  
                     .attr('y', svg.boxes[i].y1 + height / 2)

  # draw down button
  svg.downButton.redraw = () ->
    svg.downButton.geometry.x = layout.separator.left.x.current + svg.downButton.geometry.paddingX
    svg.downButton.geometry.width = layout.separator.right.x - layout.separator.left.x.current - (2 * svg.downButton.geometry.paddingX)

    svg.downButton.geometry.y = svg.main.attr('height') - svg.downButton.geometry.height - svg.downButton.geometry.paddingY # stick near bottom

    svg.downButton.element
      .attr('x', svg.downButton.geometry.x) # center 
      .attr('width', svg.downButton.geometry.width) 
      .attr('y', svg.downButton.geometry.y)
      .attr('height', svg.downButton.geometry.height)

  svg.downButton.redraw()

  svg.rightPane.redraw()

  svg.TOC.redraw = () ->

    console.log 'starting TOC redraw'
    # get the width of a space character
    spaceWidth = textDraw.tokenToViewable('a a', svg.TOC.subElement).width - textDraw.tokenToViewable('aa', svg.TOC.subElement).width
    # get the maximum character height in the font
    lHeight    = textDraw.tokenToViewable('l', svg.TOC.subElement).height

    paddingX = 30
    paddingY = 10

    svg.TOC.element
      .attr('x',      parseFloat(svg.rightPane.element.attr('x')) + paddingX)
      .attr('width',  parseFloat svg.rightPane.element.attr('width')  - (paddingX * 2))
      .attr('y',      parseFloat(svg.rightPane.element.attr('y')) + paddingY)
      .attr('height', parseFloat svg.rightPane.element.attr('height') - (paddingY * 2))


    viewPortFull = false
    y = 0
    for TOCToken in TOCTokens

      x = paddingX

      tokenViewable = textDraw.tokenToViewable(TOCToken.text, svg.TOC.subElement)
      
      #
      # Apply word semantic styling
      #
      switch TOCToken.level
        when 1
          x += 0
        when 2
          x += 15 
        when 3
          x += 30

      if y + tokenViewable.height + lHeight < svg.TOC.element.attr('y') + svg.TOC.element.attr('height')
        y += tokenViewable.height
        tokenViewable.svg.attr('x', x)
        tokenViewable.svg.attr('y', y)
        x += tokenViewable.width  
      else
        console.log 'text port full'
        viewPortFull = true
        break
    
      # add word space 
      x += spaceWidth
    
  #if states.showTOC is 'drawn'
  #  svg.TOC.redraw()
  

#
# Get the data for getting started
#
data.get('abstract', (response) ->   
  console.log(response)
  tokens = tokenize(response)
  console.dir tokens
)

data.get('categories', (response) -> 
  console.log(response)
  categories = JSON.parse(response).names
)

data.get('TOC', (response) -> 
  # get the TOC data
  console.log(response)
  rawTOC = JSON.parse(response)
  console.dir rawTOC

  # restructure into tokens we can work with
  for rawToken in rawTOC.entries
    token =
      'level': rawToken[0]  # per current structure of dummy data file
      'text':  rawToken[1]  # per current structure of dummy data file
    TOCTokens.push token
)


#
# initialize the scene and maintain layout reactivity
#    
syncInit = () ->
  sceneSync()  # initial sync
  window.onresize = () -> sceneSync()  # keep sync forever


##################
#                #
#  Start it all  #
#                #
##################

start = () ->
  sceneDefine(categories)
  syncInit()
  textporting(tokens)
  document.body.style.cursor = "default" # needed because of https://code.google.com/p/chromium/issues/detail?id=3a69986&thanks=369986&ts=1399291013

waitForData = setInterval((()-> 
                if categories? and tokens? and TOCTokens?
                  window.clearInterval(waitForData)
                  start()), 50)
                
