util        = require './util'
panes        = require './panes'
data        = require './data'
tokenize    = require './tokenize'
textDraw    = require './textDraw'
svgUtil     = require './svgUtil'
session     = require './session'

# Global geometry 
globalDims   = require './globalDims'
sceneObject  = globalDims.sceneObject
layout       = globalDims.layout
sceneHook    = globalDims.sceneHook

subCategoriesNavigation = false

if subCategoriesNavigation
  navBars = require './navBarsSubMode'
else
  navBars = require './navBars'

console.log 'read.js main started'

firstEntry = true

# Globals
viewport  = null

states = 
  rightPane: 'toc-invitation'
  articleSwitcher: false
    
colors =
  scaleStart : '#87CEFA'
  scaleEnd   : '#00BFFF'

# Convenience globals - this can be refactored
tokens    = undefined
TOCTokens = []
navBarsTree = undefined
categorizedTextTree = undefined
segments = undefined

calcStart = () -> 90
calcEnd   = () -> 90

layout =
  'separator':
    'left':
      'x':
        'current': 300

layout.separator.left.x.revertsTo = layout.separator.left.x.current
layout.separator.top = {}

coreH = null
boxH   = null
end    = null

articles = ["The Relationship Between Human Capital and Firm Performance",
            "Article 2",
            "Article 3"
           ]
currentArticle = 0           
articleSelectorPaneHeight = calcStart() - 5 - 5

//
//
//
TitleChooser = () ->

  states.articleSwitcher = true

  height =
    'selectorMode' : articles.length * articleSelectorPaneHeight,
    'selectedMode' : articleSelectorPaneHeight,

  chooserClose = () ->
    sceneObject.titlePort.pane.transition().duration(400).ease('sin').attr('height', height.selectedMode)
    states.articleSwitcher = false

  console.log 'opening title chooser'

  util.makeSvgTopLayer(sceneObject.titlePort.element.node()) # move to svg top "layer"
    #sceneObject.titlePort.text.transition().duration(300).ease('sin').attr('y', layout.separator.top.y / 2)
  sceneObject.titlePort.pane.transition().duration(450).ease('linear').attr('height', height.selectorMode)
                                         .each("end", () ->

    titlePanes = []
    action = (eventPane) ->
      eventPane.pane.node().style.fill = '#ffCBFE'          

    for article, i in articles

      #if i is currentArticle then continue

      titlePanes.push(panes.titlePaneCreate(sceneHook.svg, '#50BFEF'))
      pane = titlePanes[i]

      pane.text.text(article)
      
      # draw title port 
      pane.pane.attr('width', viewport.width - 5 - 5)
                   .attr('height', layout.separator.top.y - 5 - 5)
                   .attr('x', 5)
                   .attr('y', 5 + (i * articleSelectorPaneHeight))
                   .style('stroke-width', '7px')
                   .attr('rx', 10)
                   .attr('rx', 10)              

      pane.text.attr('x', viewport.width / 2)
               .attr('y', (5 + (i + 0.5) * articleSelectorPaneHeight))
               .style('font-family', 'Helvetica')
               .style("font-weight", "bold")
               .attr("font-size", "30px")    

      a = action.bind(undefined, pane)
      pane.pane.node().onmouseover = a
      
      ###
      pane.pane.on('mouseover', () ->
        console.log """hovering #{this.getAttribute('id')}"""
        pane = panes.lookup[this.getAttribute('id')] # get pane moused over
        #console.dir(pane)
        console.dir(pane.pane)
        pane.pane.style('fill', '#60CBFE')
      )
      ###

    #console.log "panes lookup table"
  )

  sceneObject.titlePort.pane.on('mouseout', () ->
    chooserClose()
  )


#####################################################################
#
# Define the objects making the scene, plus any of their properties 
# that won't change with subsequent window resizing
#
#####################################################################
sceneDefine = () ->

  TOC = () -> 

    sceneObject.TOC = {} 

    fontSize  = '14px' # temporarily
    fontFamily = 'verdana' # for now
    sceneObject.TOC.element = sceneHook.svg.append('svg')
                        
    sceneObject.TOC.subElement = sceneObject.TOC.element.append('g')
                                 .style('text-anchor', 'start')
                                 .style('fill', '#60cafb')  #rgb(50,50,240)
                                 .style('font-family',fontFamily)
                                 .style('font-size',fontSize)


    # derive tokens we can work with, and get ready to display them 
    # (create svg elements, get needed overall width)
    maxLen = 0
    for token in TOCTokens 
      tokenViewable = textDraw.tokenToViewable(token.text, sceneObject.TOC.element)
      if tokenViewable.width > maxLen 
        maxLen = tokenViewable.width
  
    #
    # set geometry
    #
    sceneObject.TOC.geometry = 
      paddingX : 30  # to do: make adaptive
      
    sceneObject.TOC.geometry.width = maxLen + (2 * sceneObject.TOC.geometry.paddingX)   

  mainPanes = (categories) ->
    #console.log categories
    numberOfBoxes = categories.length
    colorScale = d3.scale.linear().domain([0, numberOfBoxes-1]).range([colors.scaleStart, colors.scaleEnd])
    #colorScale = d3.scale.linear().domain([0, numberOfBoxes-1]).range(['#CCCCE0','#AAAABE']) # ['#CCCCE0','#AAAABE']
    colorTransition = (i) -> (() -> d3.select(this).transition().duration(25).ease('circle').style('fill', colorScale(i)))
    

  textPort = () ->

    sceneObject.textPortBoundary = {}
    sceneObject.textPortBoundary.element = sceneHook.svg.append('rect')
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
                              widthInitialBoundary = sceneObject.textPortBoundary.element.attr('width')
                              widthInitialText = sceneObject.textPort.element.attr('width')
                              rightInitialSeparator = layout.separator.right.x
                              element = d3.select(this)
                              # monitor mouse movement till click is released
                              window.onmousemove = (event) ->
                                xDiff = xInitial - event.clientX

                                layout.separator.right.x = rightInitialSeparator - xDiff 

                                layout.separator.right.y = rightInitialSeparator - xDiff 


                                sceneObject.textPortBoundary.element.attr('width', widthInitialBoundary - xDiff)
                                sceneObject.textPort.element.attr('width', widthInitialText - xDiff)

                                navBars.textportRefresh()
                                sceneObject.rightPane.redraw()
                                sceneObject.downButton.redraw()
                              window.onmouseup = (event) ->
                                window.onmousemove = null
                                event.target.style.cursor = "default"
                                element.transition().duration(500).style('stroke', '#999999')
                                #console.log 'mouse up'

                              element.transition().duration(300).style('stroke', '#aaaaaa') #FFEEBB 2F72FF
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
                              widthInitialBoundary = sceneObject.textPortBoundary.element.attr('width')
                              widthInitialText = sceneObject.textPort.element.attr('width')

                              window.ontouchmove = (event) -> 
                                xDiff = xInitial - event.changedTouches[0].clientX
                                sceneObject.textPortBoundary.element.attr('width', widthInitialBoundary - xDiff)
                                sceneObject.textPort.element.attr('width', widthInitialText - xDiff)
                                navBars.textportRefresh()

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
    
    sceneObject.textPort = {}
    sceneObject.textPort.element = sceneHook.svg.append('rect')
                           .style('stroke', '#222222')
                           .style('fill', '#222222')   

  titlePort = () ->

    sceneObject.titlePort = panes.titlePaneCreate(sceneHook.svg, '#60CAFB', true)

    sceneObject.titlePort.text.text(articles[currentArticle])  # "Something Something Something Title"

    sceneObject.titlePort.pane.on('mouseover', () ->
      console.log 'mouseover titleport'
      console.log states.articleSwitcher
      unless states.articleSwitcher
        TitleChooser()
#      sceneObject.rightPane.element.on('mousemove', () -> # to do: replace with a more circular area of tolerance
#        if event.x > layout.separator.right.x + sceneObject.rightPane.geometry.hoverIgnoreAreaX
#          if event.y > layout.separator.top.y + sceneObject.rightPane.geometry.hoverIgnoreAreaY and
#             event.y < viewport.height - sceneObject.rightPane.geometry.hoverIgnoreAreaY 
      )




  rightPane = ->
    styles = 
      rectangle:
        'fill'         : '#999999' #888888 ccccff
        'fill-opacity' : '0.5'
      text:
        'font-family' : 'verdana'
        'fill'        : '#909092'
        'font-weight' : 'bold'
        'font-size'   : '35px'

    textRect = svgUtil.textRectFactory(sceneHook.svg, 'More', styles, 'visible')
    sceneObject.rightPane = 
      element  :  textRect.rectangle
      textElem : textRect.text

    sceneObject.rightPane.geometry = {}
    sceneObject.rightPane.geometry = 
      'hoverIgnoreAreaX': undefined
      'hoverIgnoreAreaY': undefined
                                      
    sceneObject.rightPane.element.on('mouseover', () ->
      console.log 'mouseover'
      sceneObject.rightPane.element.on('mousemove', () -> # to do: replace with a more circular area of tolerance
        if event.x > layout.separator.right.x + sceneObject.rightPane.geometry.hoverIgnoreAreaX
          if event.y > layout.separator.top.y + sceneObject.rightPane.geometry.hoverIgnoreAreaY and
             event.y < viewport.height - sceneObject.rightPane.geometry.hoverIgnoreAreaY 

#            unless zoneEntry?
#              zoneEntry = new Date().getMilliseconds() # todo: switch to performance.now() if supported on all applicable browsers 
#            else 
#              now = new Date().getMilliseconds()
#              if now - zoneEntry > 1000 # 1 second within activation zone

            #console.log new Date().getMilliseconds() - hoverStart # > 1500 # 1.5 seconds

            sceneObject.rightPane.element.on('mousemove', null)
            sceneObject.rightPane.mode = 'animate'
            sceneObject.textPortBoundary.mode = 'animate'
            sceneObject.textPort.mode = 'animate'
            layout.separator.right.x = viewport.width - sceneObject.TOC.geometry.width
            states.rightPane = 'toc-unveiling'
            sceneSync('animate')
            #sceneObject.rightPane.element.transition().duration(300).attr('x', layout.separator.right.x)
            #sceneObject.rightPane.element.transition().duration(300).attr('width', sceneObject.TOC.geometry.width)
        )
      )

    sceneObject.rightPane.redraw = ->

      console.log 'rightpane redraw started'
      sceneObject.rightPane.geometry = 
        'hoverIgnoreAreaX': (viewport.width - layout.separator.right.x) / 3  # need to adjust to Y value, per screen aspect ratio
        'hoverIgnoreAreaY': (viewport.height - layout.separator.top.y) / 3   # need to adjust to X value, per screen aspect ratio

      sceneObject.rightPane.geometry.width = viewport.width - (layout.separator.right.x)
      ###
      if states.rightPane is 'in progress'
        sceneObject.rightPane.geometry.width = sceneObject.TOC.geometry.width
      else 
        sceneObject.rightPane.geometry.width = viewport.width - (layout.separator.right.x)
      ###

      sceneObject.rightPane.geometry.x = layout.separator.right.x
      sceneObject.rightPane.geometry.y = layout.separator.top.y
      sceneObject.rightPane.geometry.height = coreH

      middle = (point, lengthFrom) ->
        parseFloat(point + (lengthFrom / 2))

      sceneObject.rightPane.textElem.attr('x', middle(sceneObject.rightPane.geometry.x, sceneObject.rightPane.geometry.width))
                                    .attr('y', middle(sceneObject.rightPane.geometry.y, sceneObject.rightPane.geometry.height))

      switch states.rightPane
        when 'toc-unveiling'
          sceneObject.rightPane.textElem.attr('visibility', 'hidden')
          svgUtil.sync(sceneObject.rightPane, sceneObject.TOC.redraw)
          states.rightPane = 'toc-on'
          #sceneObject.rightPane.element.transition().delay(400).duration(250).style('fill', '#888888') 
        when 'toc-on'
          sceneObject.TOC.subElement.remove()
          sceneObject.TOC.redraw()
        else
          svgUtil.sync(sceneObject.rightPane)

  sceneHook.svg = d3.select('body').append('svg').style('background-color', '#999999')   
  sceneObject.categories = {} # can move this elsewhere
  navBarHook = sceneHook.svg.append('g')

  rightPane()
  textPort()
  navBars.init(navBarsTree, navBarHook, categorizedTextTree)  
  titlePort()
  TOC()

  # font buttons
  fontSizeButton = () ->
    sceneObject.fontSize = 
      element: sceneHook.svg.append("g")

    sceneObject.fontDecreaseButton = sceneObject.fontSize.element.append("svg:image")
      .attr("xlink:href","fontSmall.svg")
    sceneObject.fontIncreaseButton = sceneObject.fontSize.element.append("svg:image")
      .attr("xlink:href","fontLarge.svg")

    sceneObject.fontDecreaseButton
      .on('mouseover', () -> console.log('hover'))
      .on('mousedown', () -> 
        console.log('click font decrease')
        navBars.textportRefresh(-2))
    sceneObject.fontIncreaseButton 
      .on('mouseover', () -> console.log('hover'))
      .on('mousedown', () -> 
        console.log('click font increase')
        navBars.textportRefresh(2)) 

  fontSizeButton()

  # viewport down button 
  downButton = () ->
    sceneObject.downButton = {}

    sceneObject.downButton.geometry = 
      'paddingY': 15,
      'paddingX': 30, 
      'height': 25

    sceneObject.downButton.element = sceneHook.svg.append('svg:image')
      .attr('xlink:href','images/downScroll6.svg')
      .attr('preserveAspectRatio', 'none')
      .on('mouseover', () -> 
        #console.log('hover')
        sceneObject.downButton.element.transition().ease('sin').duration(400).attr('height', sceneObject.downButton.geometry.height + (sceneObject.downButton.geometry.paddingY *2/3)))
      .on('mouseout', () -> 
        #console.log('hover')
        sceneObject.downButton.element.transition().duration(300).attr('height', sceneObject.downButton.geometry.height))
      .on('mousedown', () -> 
        console.log('scroll')
        navBars.textportRefresh(0, true)) 

  downButton()

######################################################
#
# Keep everything harmonized with the viewport size
#
######################################################
sceneSync = (mode) ->

  viewport = util.getViewport()
  #console.dir viewport

  layout.separator.top = { 'y' : calcStart()}
  end   = 0 # calcEnd()

  coreH = viewport.height - layout.separator.top.y - end

  # draw main svg
  sceneHook.svg.attr('width', viewport.width)
          .attr('height', viewport.height)

  unless layout.separator.right?
    layout.separator.right = { 'x': viewport.width - layout.separator.left.x.current } # initial value only


  # draw text port

  sceneObject.textPortBoundary.geometry = 
    'x':            layout.separator.left.x.current,
    'width':        layout.separator.right.x - layout.separator.left.x.current,
    'y':            layout.separator.top.y + 5,
    'height':       coreH

  sceneObject.textPortBoundary.style = 
    'stroke-width': '25px'

  svgUtil.sync(sceneObject.textPortBoundary)

  sceneObject.textPort.geometry = 
              'x'      : layout.separator.left.x.current + 5,
              'width'  : layout.separator.right.x - layout.separator.left.x.current - 10,
              'height' : coreH, # this is a hack - it ends below viewport bottom, otherwise curved edge shows
              'y'      : layout.separator.top.y + 5 + 10,
              'rx'     : 10,
              'rx'     : 10
  sceneObject.textPort.style = 
    'stroke-width': '15px'

  svgUtil.sync(sceneObject.textPort)
  #console.log sceneObject.textPort.element.attr('width')
  #console.log sceneObject.textPort.geometry.width

  sceneObject.fontSize.redraw = () ->

    console.log 'redrawing font size buttons'
    #
    # taking care of font size buttons geometry - 
    # currently directly scaling the images.
    # alternative scaling method - nest under new svg element having a viewbox
    #

    #sceneObject.fontSize.attr('transform', 'translate(1000,26) scale(0.08)')
    #.attr("viewBox",'0,0,796,1248')
    fontButtonGeometry = 
      'width':  398 * 0.08, # source image pixel width  * scaling factor
      'height': 624 * 0.08  # source image pixel height * scaling factor
    sceneObject.fontDecreaseButton
      .attr('x', viewport.width - (fontButtonGeometry.width * 2) - 7)
      .attr('y', layout.separator.top.y - (fontButtonGeometry.height) - 7)
      .attr('width', fontButtonGeometry.width)
      .attr('height', fontButtonGeometry.height)
    sceneObject.fontIncreaseButton
      .attr('x', viewport.width - (fontButtonGeometry.width) - 7 - 1)
      .attr('y', layout.separator.top.y - (fontButtonGeometry.height) - 7)
      .attr('width', fontButtonGeometry.width)
      .attr('height', fontButtonGeometry.height)

  sceneObject.fontSize.redraw()      

  drawTitle = () ->

 # draw title port 
    sceneObject.titlePort.pane.attr('width', viewport.width - 5 - 5)
                 .attr('height', layout.separator.top.y - 5 - 5)
                 .attr('x', 5)
                 .attr('y', -50) # pre-animation location
                 .style('stroke-width', '7px')
                 .attr('rx', 10)
                 .attr('rx', 10)              

    #sceneObject.titlePort.textwrapper.style('stroke-width', '7px')
    sceneObject.titlePort.textWrapper.attr('width', viewport.width - 5 - 5) 
             .attr('height', articleSelectorPaneHeight)           

    sceneObject.titlePort.text.attr('x', viewport.width / 2)
             .attr('y', 0)
             .style('font-family', 'Helvetica')
             .style("font-weight", "bold")
             .attr("font-size", "30px")    

    if firstEntry
      sceneObject.titlePort.text.transition().duration(300).ease('sin')
                                    .attr('y', layout.separator.top.y / 2)
      sceneObject.titlePort.pane.transition().duration(300).ease('sin')
                                            .attr('y', 5)
      #setTimeout(sceneObject.fontSize.redraw, 2000)                                         
      firstEntry = false

    else 
      sceneObject.titlePort.text
                 .attr('y', layout.separator.top.y / 2)
      sceneObject.titlePort.pane
                 .attr('y', 5) 

  drawTitle()

  # show text if source tokens already loaded
  #console.log 'before textportFluent from scenesync'
  if tokens? 
    #console.log mode
    switch mode
      when 'animate' # redraw every small interval, while the d3 transition for the right pane is in progress. 
                     # to do: this can be interleaved in the code more gracefully
        #console.log 'in animate'
        update = 0
        autoUpdate = setInterval((()-> 
          navBars.textportRefresh()
          if update > 8 then setTimeout(window.clearInterval(autoUpdate), 400)
          update += 1
        ), 50)  
      else
        #console.log 'without animate'
        navBars.textportRefresh()

  # draw down button
  sceneObject.downButton.redraw = () ->
    #sceneObject.downButton.geometry.x = layout.separator.left.x.current + sceneObject.downButton.geometry.paddingX
    #sceneObject.downButton.geometry.width = layout.separator.right.x - layout.separator.left.x.current - (2 * sceneObject.downButton.geometry.paddingX)
    sceneObject.downButton.geometry.width = (layout.separator.right.x - layout.separator.left.x.current) / 5
    sceneObject.downButton.geometry.x = layout.separator.left.x.current + 
                                        (((layout.separator.right.x - layout.separator.left.x.current) - sceneObject.downButton.geometry.width) / 2)
      

    sceneObject.downButton.geometry.y = sceneHook.svg.attr('height') - sceneObject.downButton.geometry.height - sceneObject.downButton.geometry.paddingY # stick near bottom

    sceneObject.downButton.element
      .attr('x', sceneObject.downButton.geometry.x) # center 
      .attr('width', sceneObject.downButton.geometry.width) 
      .attr('y', sceneObject.downButton.geometry.y)
      .attr('height', sceneObject.downButton.geometry.height)
    
  sceneObject.downButton.redraw()

  sceneObject.rightPane.redraw()

  leftPane = 
    geometry:
      x      : 0 
      width  : layout.separator.left.x.current - 10, 
      y      : layout.separator.top.y + 7, 
      height : coreH - 2

  navBars.redraw(leftPane.geometry)

  sceneObject.TOC.redraw = () ->

    lineSpacing = 5

    console.log 'redraw toc started'

    #console.log 'starting TOC redraw'
    # get the width of a space character
    spaceWidth = textDraw.tokenToViewable('a a', sceneObject.TOC.subElement).width - textDraw.tokenToViewable('aa', sceneObject.TOC.subElement).width
    # get the maximum character height in the font
    lHeight    = textDraw.tokenToViewable('l', sceneObject.TOC.subElement).height

    paddingX = 20
    paddingY = 10

    sceneObject.TOC.element
      .attr('x',      parseFloat(sceneObject.rightPane.element.attr('x')) + paddingX)
      .attr('width',  parseFloat sceneObject.rightPane.element.attr('width')  - (paddingX * 2))
      .attr('y',      parseFloat(sceneObject.rightPane.element.attr('y')) + paddingY)
      .attr('height', parseFloat sceneObject.rightPane.element.attr('height') - (paddingY * 2))

    viewPortFull = false
    y = 0
    for TOCToken in TOCTokens

      x = paddingX

      tokenViewable = textDraw.tokenToViewable(TOCToken.text, sceneObject.TOC.subElement)
      
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

      if y + tokenViewable.height + lHeight < sceneObject.TOC.element.attr('y') + sceneObject.TOC.element.attr('height')
        y += tokenViewable.height + lineSpacing
        tokenViewable.svg.attr('x', x)
        tokenViewable.svg.attr('y', y)
        x += tokenViewable.width  
      else
        #console.log 'text port full'
        viewPortFull = true
        break
    
      # add word space 
      x += spaceWidth
    
  #if states.rightPane is 'drawn'
  #  sceneObject.TOC.redraw()
  

#
# Get the data for getting started
#
data.get('introduction', (response) ->   
  #console.log(response)
  tokens = tokenize(response)
  #console.dir tokens
)

#
# Get the abstract data and restructure it
#
data.get('abstract', (response) ->   
  #console.dir(response)
  rawSegments = JSON.parse(response).segments
  segments = []
  for rawSegment in rawSegments
    segment = new Object
    segment.category = rawSegment.category
    segment.tokens   = rawSegment.text.split(' ')
    segments.push segment

  #console.dir segments
)

data.get('categories', (response) -> 
  #console.log(response)
  #mainCategories       = JSON.parse(response).Top
  #categoriesOfSummary  = JSON.parse(response).More
  navBarsTree = JSON.parse(response).root
)

data.get('text', (response) -> 
  #console.log(response)
  #mainCategories       = JSON.parse(response).Top
  #categoriesOfSummary  = JSON.parse(response).More
  categorizedTextTree = JSON.parse(response).root
)

data.get('TOC', (response) -> 
  # get the TOC data
  #console.log(response)
  rawTOC = JSON.parse(response)
  #console.dir rawTOC

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
  sceneDefine()
  syncInit()
  console.dir viewport
  #textportFluent(tokens)
  #textportSegmented(segments)
  document.body.style.cursor = "default" # needed because of https://code.google.com/p/chromium/issues/detail?id=3a69986&thanks=369986&ts=1399291013

waitForData = setInterval((()->  # can replace this with https://github.com/mbostock/queue
                                 # to do: make it possible to troubleshoot which ajax call didn't return,
                                 #        and log time taken with the new browser performance javascript api
                if tokens? and TOCTokens? and segments? and navBarsTree? and categorizedTextTree?
                  window.clearInterval(waitForData)
                  start()), 50)
                
