module.exports = (tokens, mainSVG, textPortSVG) ->

  console.log 'textPorting started'

  textPort = 
    'width':  parseFloat textPortSVG.attr('width')
    'height': parseFloat textPortSVG.attr('height')
    'x':      parseFloat textPortSVG.attr('x')
    'y':      parseFloat textPortSVG.attr('y')

  console.log textPort

  fontFamily = 'Helvetica' # for now
  fontSize   = '18px' # temporarily

  # 
  # Array that maps tokens to display elements
  #
  dataToView = []

  anchorSVG = mainSVG.append('svg')
                              .style('text-anchor', 'start')
                              .attr("dominant-baseline", "central")
                              .style('fill', '#EEEEEE')                                                                                                                                            
                              .style('font-family',fontFamily)
                              .style('font-size',fontSize)

  tokenToViewable = (token) ->
  
    visualToken = {}
    svg = anchorSVG.append('text') # move some of those styles to outer svg element for performance?
                   .attr('y', -100)
                   .attr('x', -100)
    
    svg.text(token)
    #width  = svg.node().getComputedTextLength() 
    width  = svg.node().getBBox().width
    height = svg.node().getBBox().height
    #console.log visualToken.node().getBBox() 
    
    # return viewable properties as a token
    visualToken.svg    = svg
    visualToken.height = height
    visualToken.width  = width
    return visualToken

  

  spaceWidth = tokenToViewable('a a').width - tokenToViewable('aa').width
  
  full = false
  t = 0
  x = 0
  y = 0
  
  for token in tokens
    tokenViewable = tokenToViewable(token)
    console.log "token width = " + tokenViewable.width
    console.log "x = " + x
    #console.log x
    #console.log tokenViewable
    #console.log textPort

    if x + tokenViewable.width < textPort.width
      console.log 'adding to line'
      tokenViewable.svg.attr('x', textPort.x + x)
      tokenViewable.svg.attr('y', textPort.y + y)
      x += tokenViewable.width
    else  
      if y + tokenViewable.height < textPort.height
        console.log 'adding to new line'
        x = 0
        y += tokenViewable.height
        tokenViewable.svg.attr('x', textPort.x + x)
        tokenViewable.svg.attr('y', textPort.y + y)
        x += tokenViewable.width        
      else
        full = true
        break
    
    # add word space unless end of line
    if x + spaceWidth < textPort.width
      x += spaceWidth
      console.log "x after space adding = " + x






