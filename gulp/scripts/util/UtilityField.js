var UtilityField = {
    generateAccessName: function(options) {
        var _fieldName = options.value.replace(/[-\s]/g, '_').toLowerCase();

        if (is.existy(options.class) && is.existy(options.action)) {
            options.$field
                   .attr('disabled', 'disabled');

            $.post(globalUrl.ajax, {
                action: $options.action,
                class: $options.class,
                'csrf_token': $('#ajax_token').val()
            }, function(response) {
                $('#ajax_token').val(response.token);
                options.$field
                       .removeAttr('disabled');

                switch (response.status) {
                    case ajaxStatus.success:
                        options.$field
                               .val(response.accessName);
                        break;

                    default:
                        UtilityAlertMessage.append(response.message, 'danger');
                }


            });
        } else {
            return _fieldName;
        }
        
    }
};