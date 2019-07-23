var FieldCollectionEntry = {
    $form: null,
    $ajaxToken: null,
    init: function() {
        this.dtId = 'table-component';
        this.$ajaxToken = $('#ajax_token');
        this.$form = $('#field-collection-add-form').on('submit', FieldCollectionEntry.formSubmitEvent);

    },
    formSubmitEvent: function(e) {
        e.preventDefault();

        UtilityLoader.applyLoader(null, FieldCollectionEntry.$form);
        FieldCollectionEntry.$form
                      .find('#submit')
                      .attr('disabled', 'disabled');

        $.post(FieldCollectionEntry.$form.attr('action'), FieldCollectionEntry.$form.serialize(), function(response) {
            UtilityLoader.removeLoader(null, FieldCollectionEntry.$form);
            FieldCollectionEntry.$form
                      .find('#submit')
                      .removeAttr('disabled');
            FieldCollectionEntry.$form
                      .find('#csrf_token')
                      .val(response.token);

            switch (response.status) {
                case ajaxStatus.success:
                    UtilityAlertMessage.append(response.message, 'success');
                    location.href = pageVars.url.fieldCollectionManageField + '/' + response.id;
                    break;
                    
                case ajaxStatus.error:
                    UtilityAlertMessage.append(response.message, 'warning');
            }

        });
    }
};

$(function(e) {
    FieldCollectionEntry.init();
});