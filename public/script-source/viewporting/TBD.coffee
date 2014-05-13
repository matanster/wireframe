exports.flow = (svg, tokens, fontFamily, fontSize, edges) ->
  
  svg = svg.append('svg')
  row = svg.append('text')
           .style('text-anchor', 'start')
           .style('font-family',fontFamily)
           .style('font-size',fontSize)
           .attr('y', 0)

  console.dir tokens
  
  text = tokens[0]

  t=1; while t < tokens.length
    token = tokens[t]

    newText = text + token
    console.log newText
    
    row.text(newText)
    textWidth = row.node().getBBox().width
    console.dir textWidth
    
    if textWidth > edges.end
      row.text()

    text = newText
    t += 1

    # row.node().getComputedTextLength()

  ###