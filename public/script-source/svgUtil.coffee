exports.sync = (item) ->

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
    item.element.transition().duration(400).attr(attributesToTransition).style(stylesToTransition)

  # do not animate
  else
    for key, val of item.geometry
      item.element.attr(key, val)
    for key, val of item.style
      item.element.style(key, val)

