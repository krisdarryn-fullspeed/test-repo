/**
 * Alert message generation utility
 *
 * @type JSON
 */
var UtilityAlertMessage = {
    $msgWrap: $('#common-msg-wrap'),
    /**
     * Append alery message
     *
     * @param string message
     * @param string type
     * @return void
     */
    append: function(message, type) {
        var msg = [
            '<div class="alert alert-' + type + ' alert-dismissible" role="alert">',
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
                '<p class="text-center">' + message + '</p>',
            '</div>'
        ].join('');
        
        UtilityAlertMessage.$msgWrap
                           .append(msg);
    }
};