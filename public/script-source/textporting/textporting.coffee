# module static variables
fontSize  = '36px' # temporarily
anchorSVG = undefined # module static

module.exports = (tokens, mainSVG, textPortSVG, fontSizeChange) ->

  console.log 'textPorting started'
  if fontSizeChange?
    fontSize = parseFloat(fontSize) + fontSizeChange + 'px'

  fontFamily = 'Helvetica' # for now

  #
  # create or reset an SVG element to host the text inside the text port
  #
  if anchorSVG? # discard existing text if already drawn
    anchorSVG.remove()

  anchorSVG = mainSVG.append('svg')
                              .style('text-anchor', 'start')
                              .style('fill', 'rgb(255,255,220)')                                                                                                                                            
                              .style('font-family',fontFamily)
                              .style('font-size',fontSize)

  #
  # return svg text element text for an input token, 
  # along with its dimensions through having drawn it invisibly
  #
  tokenToViewable = (token) ->

    visualToken = {}
    svg = anchorSVG.append('text') # draw the text invisibly, to get its dimensions
                   .attr('y', -100)
                   .attr('x', -100)
                   .style("dominant-baseline", "hanging")
    
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

  # get the width of a space character
  spaceWidth = tokenToViewable('a a').width - tokenToViewable('aa').width
  # get the maximum character height in the font
  lHeight    = tokenToViewable('l').height

  paddingX = 10
  paddingY = 10

  textPort = 
    'x':      parseFloat(textPortSVG.attr('x')) + paddingX
    'width':  parseFloat textPortSVG.attr('width')  - (paddingX * 2)
    'y':      parseFloat(textPortSVG.attr('y')) + paddingY
    'height': parseFloat textPortSVG.attr('height') - (paddingY * 2) - lHeight - 50

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


    if token.mark = '1' # not yet implemented
      tokenViewable.svg.style('fill', 'rgb(255,255,220)')

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
        #console.log y  
        #console.dir textPort  
      else
        console.log 'text port full'
        viewPortFull = true
        break
    
    # add word space unless end of line
    if x + spaceWidth < textPort.width
      x += spaceWidth
      #console.log "x after space adding = " + x

  downBUtton = anchorSVG.append('svg:image')
    .attr('xlink:href','images/downScroll3.svg')
    .attr('x', 400)
    .attr('width', 500)
    .attr('y', 400)
    .attr('height', textPort.height - 40)
    .on('mouseover', () -> console.log('hover'))
    .on('mousedown', () -> 
      console.log('scroll')
      textporting(tokens, svg.main, svg.textPort)) 

  ButtonGeometry = 
    'width':  848, # source image pixel width  * scaling factor
    'height': 154  # source image pixel height * scaling factor
