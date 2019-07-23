var ComponentEntry = {
    $form: null,
    $isForm: null,
    $formId: null,
    $formAction: null,
    dtId: null,
    $dataTable: null,
    $ajaxToken: null,
    init: function() {
        this.dtId = 'table-component';
        this.$ajaxToken = $('#ajax_token');
        this.$form = $('#component-add-form').on('submit', ComponentEntry.formSubmitEvent);
        this.$isForm = $('#is_form');
        this.$formId = $('#form_id');
        this.$formAction = $('#form_action');

        ComponentEntry.toggleFormFields();

        // Bind is_form event
        this.$isForm.on('change', function(e) {
            ComponentEntry.toggleFormFields();
        });

    },
    toggleFormFields: function() {
        
        if (ComponentEntry.$isForm.prop('checked')) {
            ComponentEntry.$formId
                          .removeAttr('readonly');
            ComponentEntry.$formAction
                          .removeAttr('readonly');
        } else {
            ComponentEntry.$formId
                          .attr('readonly', 'readonly')
                          .val('');
            ComponentEntry.$formAction
                          .attr('readonly', 'readonly')
                          .val('');
        }
        
    },
    formSubmitEvent: function(e) {
        e.preventDefault();

        UtilityLoader.applyLoader(null, ComponentEntry.$form);
        ComponentEntry.$form
                      .find('#submit')
                      .attr('disabled', 'disabled');

        $.post(ComponentEntry.$form.attr('action'), ComponentEntry.$form.serialize(), function(response) {
            UtilityLoader.removeLoader(null, ComponentEntry.$form);
            ComponentEntry.$form
                      .find('#submit')
                      .removeAttr('disabled');
            ComponentEntry.$form
                      .find('#csrf_token')
                      .val(response.token);

            switch (response.status) {
                case ajaxStatus.success:
                    UtilityAlertMessage.append(response.message, 'success');
                    location.href = pageVars.url.componentManageField + '/' + response.id;
                    break;
                    
                case ajaxStatus.error:
                    UtilityAlertMessage.append(response.message, 'warning');
            }

        });
    }
};

$(function(e) {
    ComponentEntry.init();
});