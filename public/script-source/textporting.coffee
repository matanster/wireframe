# import global geometry
globalDims = require './globalDims'
svg    = globalDims.svg
layout = globalDims.layout

# module static variables
fontSize  = '36px' # temporarily
fontFamily = 'Helvetica' # for now
textPortInnerSVG = undefined # module static

module.exports = (tokens, fontSizeChange, scroll) ->
  
  console.log 'textPorting started'

  if fontSizeChange?
    fontSize = parseFloat(fontSize) + fontSizeChange + 'px'

  #
  # Create or reset an SVG element to host the text inside the text port,
  # passing it on as a closures
  #
  if textPortInnerSVG? # discard existing text if already drawn
    textPortInnerSVG.remove()

  textPortInnerSVG = svg.main.append('svg')
                            .style('text-anchor', 'start')
                            .style('fill', 'rgb(255,255,220)')                                                                                                                                            
                            .style('font-family',fontFamily)
                            .style('font-size',fontSize)

  visibleGroup = textPortInnerSVG.append('g')

  #
  # return svg text element text for an input token, 
  # along with its dimensions through having drawn it invisibly
  #
  tokenToViewable = (token) ->

    visualToken = {}
    svgText = visibleGroup.append('text') # draw the text invisibly, to get its dimensions
                          .attr('y', -500)
                          .attr('x', -500)
                          .style("dominant-baseline", "hanging")
    
    svgText.text(token)
    #width  = svg.node().getComputedTextLength() 
    width  = svgText.node().getBBox().width
    height = svgText.node().getBBox().height
    #console.log visualToken.node().getBBox() 
    
    # return viewable properties as a token
    visualToken.svg    = svgText
    visualToken.height = height
    visualToken.width  = width
    #console.dir visualToken
    return visualToken

  
  # get the width of a space character
  spaceWidth = tokenToViewable('a a').width - tokenToViewable('aa').width
  # get the maximum character height in the font
  lHeight    = tokenToViewable('l').height

  paddingX = 10
  paddingY = 10

  textPortInnerSVG
    .attr('x',      parseFloat(svg.textPort.attr('x')) + paddingX)
    .attr('width',  parseFloat svg.textPort.attr('width')  - (paddingX * 2))
    .attr('y',      parseFloat(svg.textPort.attr('y')) + paddingY)
    .attr('height', parseFloat svg.textPort.attr('height') - (paddingY * 2) - 50)

  #
  # redraw text
  #
  viewPortFull = false
  x = 0
  y = 0
  for token in tokens

    tokenViewable = tokenToViewable(token.text)
    console.log token.mark
    #
    # Apply word semantic styling
    #
    switch token.mark
      when 1
        tokenViewable.svg.style('fill', 'rgb(120,240,240)')
        break
      when 2
        #tokenViewable.svg.style('fill', 'rgb(70,140,140)')
        tokenViewable.svg.style('fill', 'rgb(100,200,200)')
        break

    if x + tokenViewable.width < textPortInnerSVG.attr('width')
      #console.log 'adding to line'
      tokenViewable.svg.attr('x', x)
      tokenViewable.svg.attr('y', y)
      x += tokenViewable.width
    else  
      if y + tokenViewable.height + lHeight < textPortInnerSVG.attr('height')
        #console.log 'adding to new line'
        x = 0
        y += tokenViewable.height
        tokenViewable.svg.attr('x', x)
        tokenViewable.svg.attr('y', y)
        x += tokenViewable.width  
        #console.log y  
        #console.dir textPort  
      else
        console.log 'text port full'
        viewPortFull = true
        break
    
    # add word space unless end of line
    if x + spaceWidth < textPortInnerSVG.attr('width')
      x += spaceWidth
      #console.log "x after space adding = " + x
  
  #
  # Scroll the text - to do:
  # 
  # Take care drawing beyond the visible
  # Tween the text on scroll
  # Remove Down Button when reached bottom
  # Add Up button after initial scroll
  #
  #if scroll?
  #  visibleGroup.transition().duration(...)
 