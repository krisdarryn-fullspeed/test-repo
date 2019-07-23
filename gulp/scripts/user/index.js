var User = {
    dtId: null,
    $dataTable: null,
    $ajaxToken: null,
    $sName: null,
    $sEmail: null,
    $sStatus: null,
    $sStartDateDP: null,
    $sEndDateDP: null,
    $sForm: null,
    init: function() { 
        // Initialize 
        this.dtId = 'table-user';
        this.$ajaxToken = $('#ajax_token');
        this.$sName = $('#name-search');
        this.$sEmail = $('#email-search');
        this.$sStatus = $('#status-search');
        this.$sStartDateDP = $('#start-date-search-dp');
        this.$sEndDateDP = $('#end-date-search-dp');
        this.$sForm = $('#user-search-form');

        // Initialize Datetimepicker
        this.$sStartDateDP.datetimepicker({
            format: 'MMM DD, YYYY hh:mm:ss A',
            showClear: true,
            showClose: true
        });
        this.$sEndDateDP.datetimepicker({
            format: 'MMM DD, YYYY hh:mm:ss A',
            showClear: true,
            showClose: true
        });

        // Bind event to search form
        this.$sForm.on('submit', function(e) {
            e.preventDefault();

            User.$dataTable.draw(false);
        });

        // Bind event to user add button 
        $('#btn-add-user').on('click', function(e) {
            e.preventDefault();
            var $self = $(this);
            
            User.showModal({
                title: 'User Entry',
                submitLabel: 'Add',
                modalData: {
                    state: 'add',
                    formAction: $self.attr('href')
                },
                formAction: $self.attr('href')
            });
        });
        
        // Bind event to user edit button
        $(document).on('click', '.btn-edit-user', function(e) {
            e.preventDefault();
            var $self = $(this);
            
            User.showModal({
                title: 'User Edit',
                submitLabel: 'Edit',
                modalData: {
                    state: 'edit',
                    formAction: $self.attr('href')
                },
                formAction: $self.attr('href')
            });
        });
        
        // Bind event to user delete button
        $(document).on('click', '.btn-delete-user', function(e) {
            e.preventDefault();
            var $self = $(this);
            
            User.delete($self);
        });
        
        this.initDatatable();
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
                    dialog.setData('form', $('#user-add-form'));
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
                                User.add(dialogRef, this);
                                break;
                                
                            case 'edit':
                                User.edit(dialogRef, this);
                        }
                        
                    }
                }
            ],
            closable: false
        });
    },
    add: function(dialogRef, $btn) {

        $.post(dialogRef.getData('formAction'), $('#user-add-form').serialize(), function(response) {
            dialogRef.getData('form')
                     .find('#csrf_token')
                     .val(response.token);
            UtilityLoader.removeLoader(null, dialogRef.getData('modalContent'));

            switch (response.status) {
                case ajaxStatus.success:
                    UtilityAlertMessage.append(response.message, 'success');
                    User.$dataTable.draw(false);
                    dialogRef.close();
                    break;
                    
                case ajaxStatus.error:
                    UtilityAlertMessage.append(response.message, 'warning');
                    $btn.stopSpin();
                    $btn.removeAttr('disabled');
            }
            
        });
    },
    edit: function(dialogRef, $btn) {
        
        $.post(dialogRef.getData('formAction'), $('#user-add-form').serialize(), function(response) {
            dialogRef.getData('form')
                     .find('#csrf_token')
                     .val(response.token);
            UtilityLoader.removeLoader(null, dialogRef.getData('modalContent'));

            switch (response.status) {
                case ajaxStatus.success:
                    UtilityAlertMessage.append(response.message, 'success');
                    User.$dataTable.draw(false);
                    dialogRef.close();
                    break;
                    
                case ajaxStatus.error:
                    UtilityAlertMessage.append(response.message, 'warning');
                    $btn.stopSpin();
                    $btn.removeAttr('disabled');
            }
            
        });
    },
    'delete': function($obj) {
        
        BootstrapDialog.show({
            title: 'User Delete',
            spinicon: 'glyphicon glyphicon-refresh',   
            message: function (dialog) {
                var $content = $('<div></div>');
                $content.append('<p>Are you sure you want to Delete User: <i>' + $obj.data('uname') + '</i>?</p>');
                
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

                        $.post($obj.attr('href'), {token: User.$ajaxToken.val()}, function(response) {
                            User.$ajaxToken
                                .val(response.token);
                            
                            UtilityLoader.removeLoader(null, dialogRef.getData('modalContent'));

                            switch (response.status) {
                                case ajaxStatus.success:
                                    UtilityAlertMessage.append(response.message, 'success');
                                    User.$dataTable.draw(false);
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
        User.$dataTable = $('#' + User.dtId).DataTable({
            searching : false,
            autoWidth : false,
            pageLength : 50,
            processing : true,
            serverSide : true,
            order: [],
            columnDefs: [{
                searchable: false,
                orderable : false,
                targets: 5
            }],
            columns: [{
                data: 'name',
                name: 'name'
            }, {
                data: 'email',
                name: 'email'
            }, {
                data: 'role_privileges',
                name: 'role_privileges'
            }, {
                data: 'status',
                name: 'status'
            }, {
                data: 'last_login',
                name: 'last_login'
            }, {
                data: 'options',
                name: 'options'
            }],
            ajax: {
                type: 'post',
                url: globalUrl.ajax,
                data: function(data, settings) {
                    data.action = 'listDTRecords';
                    data.entity = 'Backend\\Models\\Users';
                    data.name = User.$sName.val();
                    data.email = User.$sEmail.val();
                    data.status = User.$sStatus.val();
                    
                    if (is.not.null(User.$sStartDateDP.data('DateTimePicker').date())) {
                        data.start_date = User.$sStartDateDP.data('DateTimePicker').date().format('YYYY-MM-DD HH:mm:ss');    
                    }
                    
                    if (is.not.null(User.$sEndDateDP.data('DateTimePicker').date())) {
                        data.end_date = User.$sEndDateDP.data('DateTimePicker').date().format('YYYY-MM-DD HH:mm:ss');    
                    }
                    
                },
                dataSrc: function(json) {
                    
                    for (var i = 0; i < json.data.length; i++) {
                        json.data[i].options = [
                            '<div>',
                                '<a class="btn btn-link btn-edit-user" href="' + pageVars.url.userEdit + '/' + json.data[i].cms_user_id + '" title="Edit User">Edit</a>',
                                '|',
                                '<a class="btn btn-link btn-delete-user" data-uname="' + json.data[i].email + '" href="' + pageVars.url.userDelete + '/' + json.data[i].cms_user_id + '" title="Delete User">Delete</a>',
                            '<div>'
                        ].join('');
                        
                        json.data[i].last_login = (is.not.null(json.data[i].last_login) ? moment(json.data[i].last_login).format('MMM DD, YYYY hh:mm:ss A') : '');
                        
                        switch (parseInt(json.data[i].status)) {
                            case 0:
                                json.data[i].status = 'Inactive';
                                break;
                                
                            case 1:
                                json.data[i].status = 'Active';
                        }
                    }
                    
                    return json.data;
                }
            }
        });
    }
    
};

$(function(e) {
    User.init();
});

