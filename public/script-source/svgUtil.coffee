exports.sync = (item) ->

  console.log item.mode

  # animate if requested
  if item.mode is 'animate'
    
    for key, val of item.geometry when key in ['x', 'width']
      if item.element.attr(key) isnt val
        console.dir 'updating ' + key + ' from ' + item.element.attr(key) + ' to ' + val
        item.element.transition().duration(400).attr(key, val)

    ###
    for key, val of item.style
      if item.element.style(key) isnt val
        item.element.transition().duration(400).style(key, val)
      else
        item.element.style(key, val)
    ###

  # do not animate
  else
    for key, val of item.geometry
      item.element.attr(key, val)
    for key, val of item.style
      item.element.style(key, val)

