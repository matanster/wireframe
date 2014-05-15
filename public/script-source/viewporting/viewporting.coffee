# module static variables
fontSize   = '18px' # temporarily
anchorSVG = undefined # module static

module.exports = (tokens, mainSVG, textPortSVG, fontSizeChange) ->

  console.log 'textPorting started'
  if fontSizeChange?
    fontSize = parseFloat(fontSize) + fontSizeChange + 'px'

  paddingX = 10
  paddingY = 20

  textPort = 
    'width':  parseFloat textPortSVG.attr('width')  - (paddingX * 2)
    'height': parseFloat textPortSVG.attr('height') - (paddingY * 2) 
    'x':      parseFloat(textPortSVG.attr('x')) + paddingX
    'y':      parseFloat(textPortSVG.attr('y')) + paddingY

  #console.log textPort

  fontFamily = 'Helvetica' # for now

  #
  # return svg text element text for an input token, 
  # along with its dimensions through having drawn it invisibly
  #
  tokenToViewable = (token) ->
  
    visualToken = {}
    svg = anchorSVG.append('text') # draw the text invisibly, to get its dimensions
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

  #
  # create or reset an SVG element to host the text inside the text port
  #
  if anchorSVG? # discard existing text if already drawn
    anchorSVG.remove()

  anchorSVG = mainSVG.append('svg')
                              .style('text-anchor', 'start')
                              #.attr("dominant-baseline", "central")
                              .style('fill', '#EEEEEE')                                                                                                                                            
                              .style('font-family',fontFamily)
                              .style('font-size',fontSize)
  
  # get the width of a space character
  spaceWidth = tokenToViewable('a a').width - tokenToViewable('aa').width
  
  viewPortFull = false
  x = 0
  y = 0

  for token in tokens
    tokenViewable = tokenToViewable(token)
    #console.log "token width = " + tokenViewable.width
    #console.log "x = " + x
    #console.log x
    #console.log tokenViewable
    #console.log textPort

    if x + tokenViewable.width < textPort.width
      #console.log 'adding to line'
      tokenViewable.svg.attr('x', textPort.x + x)
      tokenViewable.svg.attr('y', textPort.y + y)
      x += tokenViewable.width
    else  
      if y + tokenViewable.height < textPort.height
        #console.log 'adding to new line'
        x = 0
        y += tokenViewable.height
        tokenViewable.svg.attr('x', textPort.x + x)
        tokenViewable.svg.attr('y', textPort.y + y)
        x += tokenViewable.width        
      else
        console.log 'text port full'
        viewPortFull = true
        break
    
    # add word space unless end of line
    if x + spaceWidth < textPort.width
      x += spaceWidth
      #console.log "x after space adding = " + x






