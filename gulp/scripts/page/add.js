var PageEntry = {
    $token: null,
    $form: null,
    init: function() {
        this.$token = $('#csrf_token');
        this.$form = $('#page-form').on('submit', PageEntry.submitEvent);
    },
    submitEvent: function(e) {
        e.preventDefault();
        var formData = new FormData();
        var postData = PageEntry.$form.serializeArray();

        for (var i = 0; i < postData.length; i++) {

            if (postData[i].name != 'field_collection_ids') {
                formData.append(postData[i].name, postData[i].value);
            }
        }

        PageEntry.$form
                 .find('#submit')
                 .attr('disabled', 'disabled');
        UtilityLoader.applyLoader(null, PageEntry.$form);

        $.ajax({
            url: PageEntry.$form.attr('href'),
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function(response, textStatus, jqXHR) {
                PageEntry.$token.val(response.token);
                PageEntry.$form
                         .find('#submit')
                         .removeAttr('disabled');
                UtilityLoader.removeLoader(null, PageEntry.$form);

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
    PageEntry.init();
});