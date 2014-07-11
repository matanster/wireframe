# dispense a unique number for giving unique id's to svg DOM elements
# we could use a random ID instead..
paneCounter = 0
getPaneID = () ->
  paneCounter +=1
  return paneCounter

lookup = {}
exports.lookup = lookup

exports.titlePaneCreate = (svgAnchor, initialColor, rotated) ->

  paneObject = {}

  paneObject.element = svgAnchor.append('g')

  paneId = "pane" + getPaneID() # unique DOM id for being able to trace back the pane on mouse/touch events
  paneObject.pane = paneObject.element.append('rect')
                                   .style('fill', initialColor)  
                                   .attr('id', paneId) 
  
  if rotated
    # nest an html element containing an svg, inside the topmost svg hook, so we can use a non-svg transform on it
    textWrapperId = "panetextWrapper" + getPaneID() # unique DOM id for being able to access the html embedded svg for modifying it
    paneObject.element.append('foreignObject')
                      .append('xhtml:body')
                      .html("""<svg id=#{textWrapperId} style='-webkit-transform: perspective(40px) rotateX(2deg)'></svg>""")
                      .style('pointer-events', 'none') # disable mouse events and let them drip through
    paneObject.textWrapper = d3.select('#' + textWrapperId)

    # modify the svg nested inside the html just created
    paneObject.text = paneObject.textWrapper.append('text')
                                      #.attr("id", "title")
                                      .attr("dominant-baseline", "central")
                                      .style("text-anchor", "middle")
                                      .style('fill', "#EEEEEE")
 
  else
    paneObject.text = paneObject.element.append('text')
                                      #.attr("id", "title")
                                      .attr("dominant-baseline", "central")
                                      .style("text-anchor", "middle")
                                      .style('fill', "#EEEEEE")

  paneObject.textWrapperId = textWrapperId
  
  lookup[paneObject.pane.attr('id')] = paneObject

  return paneObject
