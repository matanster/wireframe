module.exports = (tokens, textAreaSVG) ->

  console.log 'viewporting started'
  width  = textAreaSVG.attr('width')
  height = textAreaSVG.attr('height')

  fontFamily = 'Helvetica' # for now
  fontSize   = '18px' # temporarily

  # 
  # Array that maps tokens to display elements
  #
  dataToView = []

  textArea = textAreaSVG.append('svg')

  tokenToViewable = (token) ->
    visualToken = textArea.append('text')
                             .style('text-anchor', 'middle')
                             .attr("dominant-baseline", "central")
                             .style('fill', '#EEEEEE')                                                                                                                                            
                             .style('font-family',fontFamily)
                             .style('font-size',fontSize)
                             .attr('y', -100)
                             .attr('x', -100)
                             .style('fill-opacity', '0') # invisible
    
    visualToken.text(token)
    console.log token
    console.log visualToken.node().getComputedTextLength() 
    #console.log drawnWidth

  for token in tokens
    tokenToViewable(token)

