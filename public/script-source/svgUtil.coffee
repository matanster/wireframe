#
# create a hidden text filled rectangle, under a new svg group element
#
exports.textRectFactory = (svgHookPoint, rectText, styles, visibility) -> # sceneObject.main
  group = svgHookPoint.append('g')
                        .style('-webkit-user-select', 'none')      # avoid standard text handling of the category texts (selection, touch callouts)
                        .style('-webkit-touch-callout', 'none')    # avoid standard text handling of the category texts (selection, touch callouts) 
                        .style('user-select', 'none') # future compatibility
                        .attr('id', rectText)
                        .attr('visibility', visibility)

  rectangle = group.append('rect').style(styles.rectangle)

  # skip text node if no text is provided
  if rectText?
    text = group.append('text').text(rectText)
                                     .attr("dominant-baseline", "central")
                                     .style("text-anchor", "middle")
                                     .style(styles.text)

    textDims = 
      width  : text.node().getBBox().width
      height : text.node().getBBox().height

  else 
    text = null

  sceneObject = { group, rectangle, text, textDims }
  return sceneObject

exports.sync = (item, callback) ->

  if item.mode 
    console.log item.mode

  # animate if requested
  if item.mode is 'animate'
    
    #
    # filter only attributes that are (1) real d3 attributes, 
    # and that (2) really represent a change. (2) may be unnecessary optimization...
    #
    attributesToTransition = {}
    for key, val of item.geometry when key in ['x', 'width','y','height','rx','ry']
      if parseFloat(item.element.attr(key)) isnt val
        attributesToTransition[key] = val 
        console.dir 'going to transition ' + key + ' from ' + item.element.attr(key) + ' to ' + val
    
    #
    # filter styles that really need to change. might be unnecessary if d3 does that as well
    #    
    stylesToTransition = {}
    for key, val of item.style
      if item.element.style(key) isnt val
        stylesToTransition[key] = val 
      
    # animate
    if callback?
      item.element.transition().duration(400).attr(attributesToTransition).style(stylesToTransition).each('end', callback)
    else      
      item.element.transition().duration(400).attr(attributesToTransition).style(stylesToTransition)
      
  # do not animate
  else
    for key, val of item.geometry
      item.element.attr(key, val)
    for key, val of item.style
      item.element.style(key, val)

