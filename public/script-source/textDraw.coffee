#
# draw text invisibly for obtaining it's geometry which depends on font family, size.
#

# import global geometry
globalDims = require './globalDims'
svg    = globalDims.svg
layout = globalDims.layout

#
# return svg text element text for an input token, 
# along with its dimensions through having drawn it invisibly
#
exports.tokenToViewable = (token, visibleGroup) ->

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

  
