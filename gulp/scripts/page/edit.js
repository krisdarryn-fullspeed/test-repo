var PageEdit = {
    $form: null,
    $isForm: null,
    $formId: null,
    $formAction: null,
    $ajaxToken: null,
    init: function() {
        this.$ajaxToken = $('#ajax_token');
        this.$form = $('#page-form').on('submit', PageEdit.formSubmitEvent);

        // Bind event to file fields
        $(document).on('clear.bs.fileinput', '.file-single-widget-wrap', function(e) {
            var $self = $(this);
            var $parent = $self.closest('.cms-field-item');
            var $fileField = $self.find('.file-single-widget');

            if ($fileField.data('has-value')) {
                $parent.find('.file-changed-indicator')
                       .val(true);
            }

        });
        $(document).on('change.bs.fileinput', '.file-single-widget-wrap', function(e) {
            var $self = $(this);
            var $parent = $self.closest('.cms-field-item');
            var $fileField = $self.find('.file-single-widget');

            $parent.find('.file-changed-indicator')
                   .val('');

        });

    },
    formSubmitEvent: function(e) {
        e.preventDefault();
        var formData = new FormData();
        var postData = PageEdit.$form.serializeArray();
        UtilityLoader.applyLoader(null, PageEdit.$form);
        PageEdit.$form
                .find('#submit')
                .attr('disabled', 'disabled');
        

        // Prepare post request
        for (var i = 0; i < postData.length; i++) {
            
            if (postData[i].name.search('content_file') === -1) {
                
                if (is.not.undefined(CKEDITOR.instances[postData[i].name])) {
                    console.log(CKEDITOR.instances[postData[i].name].getData());
                    formData.append(postData[i].name, CKEDITOR.instances[postData[i].name].getData());
                } else {
                    formData.append(postData[i].name, postData[i].value);
                }
            } 
            
        }

        // Prepare file post request
        $('.file-single-widget').each(function(i, element) {
            
            if (element.files.length) {
                formData.append(element.name, element.files[0]);
            }
            
        });


        $.ajax({
            url: PageEdit.$form.attr('action'),
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function(response, textStatus, jqXHR) {
                UtilityLoader.removeLoader(null, PageEdit.$form);
                PageEdit.$form
                          .find('#submit')
                          .removeAttr('disabled');
                PageEdit.$form
                          .find('#csrf_token')
                          .val(response.token);

                switch (response.status) {
                    case ajaxStatus.success:
                        UtilityAlertMessage.append(response.message, 'success');
                        break;
                        
                    case ajaxStatus.error:
                        UtilityAlertMessage.append(response.message, 'warning');
                }

            }
        });

    }
};


$(function(e) {
    PageEdit.init();
});