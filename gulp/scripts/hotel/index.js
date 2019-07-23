var Hotel = {
    dtId: null,
    $dataTable: null,
    $ajaxToken: null,
    $activeModal: null,
    init: function() {
        this.dtId = 'table-hotels';
        this.$ajaxToken = $('#ajax_token');

        Hotel.initDatatable();

        // Bind event to hotel add button 
        $('#btn-add-hotel').on('click', function(e) {
            e.preventDefault();
            var $self = $(this);
            
            Hotel.showModal({
                title: 'Hotel Entry',
                submitLabel: 'Add',
                modalData: {
                    state: 'add',
                    formAction: $self.attr('href')
                },
                formAction: $self.attr('href')
            });
        });

        // Bind event to hotel edit button 
        $(document).on('click', '.btn-edit-hotel', function(e) {
            e.preventDefault();
            var $self = $(this);
            
            Hotel.showModal({
                title: 'Hotel Edit',
                submitLabel: 'Edit',
                modalData: {
                    state: 'edit',
                    formAction: $self.attr('href')
                },
                formAction: $self.attr('href')
            });
        });

        // Bind event to hotel delete button 
        $(document).on('click', '.btn-delete-hotel', function(e) {
            e.preventDefault();
            
            Hotel.delete($(this));
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
                    dialog.setData('form', $('#hotel-form'));

                    Hotel.$activeModal = dialog;
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
                                Hotel.add(dialogRef, this);
                                break;
                                
                            case 'edit':
                                Hotel.edit(dialogRef, this);
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
                        Hotel.$dataTable.draw(false);
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
                        Hotel.$dataTable.draw(false);
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
            title: 'Hotel Delete',
            spinicon: 'glyphicon glyphicon-refresh',   
            message: function (dialog) {
                var $content = $('<div></div>');
                $content.append('<p>Are you sure you want the Hotel?</p>');
                
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

                        $.post($obj.attr('href'), {token: Hotel.$ajaxToken.val()}, function(response) {
                            Hotel.$ajaxToken
                                .val(response.token);
                            
                            UtilityLoader.removeLoader(null, dialogRef.getData('modalContent'));

                            switch (response.status) {
                                case ajaxStatus.success:
                                    UtilityAlertMessage.append(response.message, 'success');
                                    Hotel.$dataTable.draw(false);
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
        Hotel.$dataTable = $('#' + Hotel.dtId).DataTable({
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
                    data.entity = 'Backend\\Models\\Hotels';
                    
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
                                '<a class="btn btn-link btn-edit-hotel" href="' + pageVars.url.hotelEdit + '/' + json.data[i].hotel_id + '" title="Edit Hotel">Edit</a>',
                                '|',
                                '<a class="btn btn-link btn-delete-hotel" data-label="' + json.data[i].label + '" href="' + pageVars.url.hotelDelete + '/' + json.data[i].hotel_id + '" title="Delete Hotel">Delete</a>',
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
    Hotel.init();
});