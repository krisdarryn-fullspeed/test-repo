/**
 * HTML loader indicator
 *
 * @type JSON
 */
var UtilityLoader = {
    /**
     * Apply loader to specified element
     *
     * @param string selector
     * @param jQuery $jObj
     * @return void
     */
    applyLoader: function(selector = null, $jObj = null) {
        var $obj = null;
        
        if (is.not.null(selector)) {
            
            if ((selector.search('#') === 0) || (selector.search(/\./) === 0)) {
                $obj = $(selector);
                
                if ($obj.length === 0) {
                    throw('Selector doesn\'t exist');
                }
                
            } else {
                throw('Invalid selector: ' + selector);
            }
            
        } else if (is.not.null($jObj)) {
            $obj = $($jObj);
        }
        
        $obj.css('position', 'relative');
        $obj.append(UtilityLoader.genLoaderHtml());
    },
    /**
     * Remove the applied loader from specified element
     *
     * @param string selector
     * @param jQuery $jObj
     * @return void
     */
    removeLoader: function(selector, $jObj) {
        var $obj = null;
        
        if (is.not.null(selector)) {
            
            if ((selector.search('#') === 0) || (selector.search(/\./) === 0)) {
                $obj = $(selector);
                
                if ($obj.length === 0) {
                    throw('Selector doesn\'t exist');
                }
                
            } else {
                throw('Invalid selector: ' + selector);
            }
        
        } else if (is.not.null($jObj)) {
            $obj = $($jObj);
        }
        
        $obj.find('.default-loader')
            .remove();
    },
    /**
     * Generate loader HTML
     *
     * @return string
     */
    genLoaderHtml: function() {
        return [
            '<div class="default-loader">',
                '<div class="overlay"></div>',
                '<div class="loader"></div>',
            '</div>'
        ].join('');
    }
};