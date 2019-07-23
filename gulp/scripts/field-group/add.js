var FieldGroupEntry = {
    $token: null,
    $fieldCollections: null,
    $form: null,
    init: function() {
        this.$token = $('#csrf_token');
        this.$form = $('#field-group-add-form').on('submit', FieldGroupEntry.submitEvent);
        this.$fieldCollections = $('#field_collection_ids');

        this.initSelect2();
    },
    initSelect2: function() {
        FieldGroupEntry.$fieldCollections.select2({
            placeholder: 'Please Select',
            allowClear: true
        });

        setTimeout(function() {

            if (is.not.undefined(FieldGroupEntry.$fieldCollections.data('value'))) {
                FieldGroupEntry.$fieldCollections
                               .val(FieldGroupEntry.$fieldCollections.data('value'))
                               .trigger('change');
            }

        }, 200);
    },
    submitEvent: function(e) {
        e.preventDefault();
        var formData = new FormData();
        var postData = FieldGroupEntry.$form.serializeArray();
        var fieldCollectionIds = FieldGroupEntry.$fieldCollections.select2('data');

        for (var i = 0; i < postData.length; i++) {

            if (postData[i].name != 'field_collection_ids') {
                formData.append(postData[i].name, postData[i].value);
            }
        }

        for (var k = 0; k < fieldCollectionIds.length; k++) {
            formData.append('field_collection_ids[' + (k + 1) + ']', fieldCollectionIds[k].id);
        }

        FieldGroupEntry.$form
                       .find('#submit')
                       .attr('disabled', 'disabled');
        UtilityLoader.applyLoader(null, FieldGroupEntry.$form);

        $.ajax({
            url: FieldGroupEntry.$form.attr('href'),
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function(response, textStatus, jqXHR) {
                FieldGroupEntry.$token.val(response.token);
                FieldGroupEntry.$form
                               .find('#submit')
                               .removeAttr('disabled');
                UtilityLoader.removeLoader(null, FieldGroupEntry.$form);

                switch (response.status) {
                    case ajaxStatus.success:
                        UtilityAlertMessage.append(response.message, 'success');
                        location.href = pageVars.url.fieldGroupList;
                        break;
                        
                    case ajaxStatus.error:
                        UtilityAlertMessage.append(response.message, 'warning');
                }

            }
        });

    }
};

$(function(e) {
    FieldGroupEntry.init();
});