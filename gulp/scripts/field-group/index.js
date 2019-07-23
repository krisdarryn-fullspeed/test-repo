var FieldGroupList = {
    $token: null,
    init: function() {
        this.$token = $('#ajax_token');

        // Bind delete button click
        $('.btn-delete-group').on('click', function(e) {
            e.preventDefault();

            FieldGroupList.delete($(this));
        });
    },
    delete: function($btn) {
        BootstrapDialog.show({
            title: 'Delete Field',
            spinicon: 'glyphicon glyphicon-refresh',   
            message: function (dialog) {
                var $content = $('<div></div>');
                $content.append('<p>Are you sure you want to Delete this Field Group?</p>');

                return $content;
            },
            buttons: [
                {
                    id: 'btn-cancel',
                    icon: 'glyphicon glyphicon-remove',
                    label: 'Cancel',
                    cssClass: 'btn btn-default',
                    autospin: false,
                    action: function(dialogRef) {
                        dialogRef.close();
                    }
                },
                {
                    id: 'btn-submit',
                    icon: 'glyphicon glyphicon-ok',
                    label: 'Delete',
                    cssClass: 'btn btn-primary',
                    autospin: true,
                    action: function(dialogRef) {
                        $submitBtn = this;

                        $.post($btn.attr('href'), {'token': FieldGroupList.$token.val()}, function(response) {
                            $submitBtn.stopSpin();
                            FieldGroupList.$token
                                               .val(response.token);

                            switch (response.status) {
                                case ajaxStatus.success:
                                    UtilityAlertMessage.append(response.message, 'success');
                                    
                                    $btn.closest('tr')
                                        .remove();

                                    dialogRef.close();
                                    break;
                                    
                                case ajaxStatus.error:
                                    UtilityAlertMessage.append(response.message, 'warning');
                            }
                        });

                    }
                }
            ]
        });
    }

};

$(function(e) {
    FieldGroupList.init();
});