var ActivityCategory = {
    dtId: null,
    $dataTable: null,
    $ajaxToken: null,
    $activeModal: null,
    init: function() {
        this.dtId = 'table-activity-category';
        this.$ajaxToken = $('#ajax_token');

        ActivityCategory.initDatatable();

        // Bind event to ActivityCategory add button 
        $('#btn-add-activity-category').on('click', function(e) {
            e.preventDefault();
            var $self = $(this);
            
            ActivityCategory.showModal({
                title: 'Activity Category Entry',
                submitLabel: 'Add',
                modalData: {
                    state: 'add',
                    formAction: $self.attr('href')
                },
                formAction: $self.attr('href')
            });
        });

        // Bind event to ActivityCategory edit button 
        $(document).on('click', '.btn-edit-activity-category', function(e) {
            e.preventDefault();
            var $self = $(this);
            
            ActivityCategory.showModal({
                title: 'Activity Category Edit',
                submitLabel: 'Edit',
                modalData: {
                    state: 'edit',
                    formAction: $self.attr('href')
                },
                formAction: $self.attr('href')
            });
        });

        // Bind event to ActivityCategory delete button 
        $(document).on('click', '.btn-delete-activity-category', function(e) {
            e.preventDefault();
            
            ActivityCategory.delete($(this));
        });

    },
    showModal: function(options) {
        BootstrapDialog.show({
            title: options.title,
            spinicon: 'glyphicon glyphicon-refresh',           
            message: function (dialog) {
                var $content = $('<div></div>');
                dialog.enableButtons(false);
                dialog.setData('modalContent', $content);
                
                $content.load(options.formAction, function(response) {
                    dialog.enableButtons(true);
                    dialog.setData('form', $('#activity-category-form'));

                    ActivityCategory.$activeModal = dialog;
                });
                
                return $content;
            },
            data: options.modalData,
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
                    label: options.submitLabel,
                    cssClass: 'btn btn-primary',
                    autospin: true,
                    action: function(dialogRef) {
                        UtilityLoader.applyLoader(null, dialogRef.getData('modalContent'));
                        this.attr('disabled', 'disabled');
                        
                        switch (dialogRef.getData('state')) {
                            case 'add':
                                ActivityCategory.add(dialogRef, this);
                                break;
                                
                            case 'edit':
                                ActivityCategory.edit(dialogRef, this);
                        }
                        
                    }
                }
            ],
            closable: false
        });
    },
    add: function(dialogRef, $btn) {
        var formData = new FormData();
        var postData = dialogRef.getData('form').serializeArray();

        for (var i = 0; i < postData.length; i++) {

            if (postData[i].name.split('-').length > 1) {
                var labelData =postData[i].name.split('-');

                formData.append('labels[' + i + '][cms_language_id]', labelData[0]);
                formData.append('labels[' + i + '][label]', postData[i].value);
            } else {
                formData.append(postData[i].name, postData[i].value);    
            }

        }

        $.ajax({
            url: dialogRef.getData('form').attr('action'),
            type: 'POST',
            contentType: false,
            processData: false,
            data: formData,
            success: function(response, textStatus, jqXHR) {
                dialogRef.getData('form')
                         .find('#csrf_token')
                         .val(response.token);
                UtilityLoader.removeLoader(null, dialogRef.getData('modalContent'));

                switch (response.status) {
                    case ajaxStatus.success:
                        UtilityAlertMessage.append(response.message, 'success');
                        ActivityCategory.$dataTable.draw(false);
                        dialogRef.close();
                        break;
                        
                    case ajaxStatus.error:
                        UtilityAlertMessage.append(response.message, 'warning');
                        $btn.stopSpin();
                        $btn.removeAttr('disabled');
                }
            }
        });
    },
    edit: function(dialogRef, $btn) {
        var formData = new FormData();
        var postData = dialogRef.getData('form').serializeArray();

        for (var i = 0; i < postData.length; i++) {

            if (postData[i].name.split('-').length > 1) {
                var labelData = postData[i].name.split('-');

                formData.append('labels[' + i + '][cms_language_id]', labelData[0]);
                formData.append('labels[' + i + '][label]', postData[i].value);
            } else {
                formData.append(postData[i].name, postData[i].value);    
            }

        }

        $.ajax({
            url: dialogRef.getData('form').attr('action'),
            type: 'POST',
            contentType: false,
            processData: false,
            data: formData,
            success: function(response, textStatus, jqXHR) {
                dialogRef.getData('form')
                         .find('#csrf_token')
                         .val(response.token);
                UtilityLoader.removeLoader(null, dialogRef.getData('modalContent'));

                switch (response.status) {
                    case ajaxStatus.success:
                        UtilityAlertMessage.append(response.message, 'success');
                        ActivityCategory.$dataTable.draw(false);
                        dialogRef.close();
                        break;
                        
                    case ajaxStatus.error:
                        UtilityAlertMessage.append(response.message, 'warning');
                        $btn.stopSpin();
                        $btn.removeAttr('disabled');
                }
            }
        });
    },
    'delete': function($obj) {
        
        BootstrapDialog.show({
            title: 'ActivityCategory Delete',
            spinicon: 'glyphicon glyphicon-refresh',   
            message: function (dialog) {
                var $content = $('<div></div>');
                $content.append('<p>Are you sure you want the Activity Category?</p>');
                
                dialog.setData('modalContent', $content);
                
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
                        var $btn = this;
                        $btn.attr('disabled', 'disabled');
                        UtilityLoader.removeLoader(null, dialogRef.getData('modalContent'));

                        $.post($obj.attr('href'), {token: ActivityCategory.$ajaxToken.val()}, function(response) {
                            ActivityCategory.$ajaxToken
                                            .val(response.token);
                            
                            UtilityLoader.removeLoader(null, dialogRef.getData('modalContent'));

                            switch (response.status) {
                                case ajaxStatus.success:
                                    UtilityAlertMessage.append(response.message, 'success');
                                    ActivityCategory.$dataTable.draw(false);
                                    dialogRef.close();
                                    break;
                                    
                                case ajaxStatus.error:
                                    UtilityAlertMessage.append(response.message, 'warning');
                                    $btn.stopSpin();
                                    $btn.removeAttr('disabled');
                            }

                        });

                    }
                }
            ],
            closable: false
        });
    },
    initDatatable: function() {
        ActivityCategory.$dataTable = $('#' + ActivityCategory.dtId).DataTable({
            searching : false,
            autoWidth : false,
            pageLength : 50,
            processing : true,
            serverSide : true,
            columnDefs: [{
                searchable: false,
                orderable : false,
                targets: 1
            }],
            columns: [{
                data: 'label',
                name: 'label'
            }, {
                data: 'options',
                name: 'options'
            }],
            ajax: {
                type: 'post',
                url: globalUrl.ajax,
                data: function(data, settings) {
                    data.action = 'listDTRecords';
                    data.entity = 'Backend\\Models\\ActivityCategories';
                    
                },
                dataSrc: function(json) {
                    
                    for (var i = 0; i < json.data.length; i++) {
                        
                        var labels = json.data[i].label.split(';');
                        var langs = json.data[i].cms_langauage_ids.split(',');
                            var displayLabel = [];

                            for (var k = 0; k < langs.length ; k++) {
                                displayLabel.push('<p><b>' + pageVars.lang[langs[k]] + '</b>: ' + labels[k] + '</p>');
                        }

                        json.data[i].label = displayLabel.join('');

                        json.data[i].options = [
                            '<div>',
                                '<a class="btn btn-link btn-edit-activity-category" href="' + pageVars.url.activityCategoryEdit + '/' + json.data[i].activity_category_id + '" title="Edit Activity Category">Edit</a>',
                                '|',
                                '<a class="btn btn-link btn-delete-activity-category" data-label="' + json.data[i].label + '" href="' + pageVars.url.activityCategoryDelete + '/' + json.data[i].activity_category_id + '" title="Delete Activity Category">Delete</a>',
                            '<div>'
                        ].join('');

                    }
                    
                    return json.data;
                }
            }
        });
    }
};

$(function(e) {
    ActivityCategory.init();
});