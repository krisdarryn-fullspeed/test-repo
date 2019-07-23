var ComponentList = {
    dtId: null,
    $dataTable: null,
    $ajaxToken: null,
    $sName: null,
    $sIsForm: null,
    $searchForm: null,
    $activeModal: null,
    init: function() {
        this.dtId = 'table-component';
        this.$ajaxToken = $('#ajax_token');
        this.$sName = $('#name-search');
        this.$sIsForm = $('#is_form');
        this.$searchForm = $('#component-search-form').on('submit', function(e) {
            e.preventDefault();

            ComponentList.$dataTable.draw(false);
        });

        this.initDatatable();

        // Bind event to delete button
        $(document).on('click', '.btn-delete-component', function(e) {
            e.preventDefault();

            ComponentList.delete($(this));
        });
    },
    initDatatable: function() {
        ComponentList.$dataTable = $('#' + ComponentList.dtId).DataTable({
            searching : false,
            autoWidth : false,
            pageLength : 50,
            processing : true,
            serverSide : true,
            order: [],
            columnDefs: [{
                searchable: false,
                orderable : false,
                targets: 4
            }],
            columns: [{
                data: 'name',
                name: 'name'
            }, {
                data: 'description',
                name: 'description'
            }, {
                data: 'is_form',
                name: 'is_form'
            }, {
                data: 'used_by',
                name: 'used_by'
            }, {
                data: 'options',
                name: 'options'
            }],
            ajax: {
                type: 'post',
                url: globalUrl.ajax,
                data: function(data, settings) {
                    data.action = 'listDTRecords';
                    data.entity = 'Backend\\Models\\Components';
                    data.name = ComponentList.$sName.val();
                    data.isForm = (ComponentList.$sIsForm.prop('checked') ? 1 : 0);
                },
                dataSrc: function(json) {
                    
                    for (var i = 0; i < json.data.length; i++) {
                        json.data[i].options = [
                            '<div>',
                                '<a class="btn btn-link btn-edit-component" href="' + pageVars.url.componentEdit + '/' + json.data[i].cms_component_id + '" title="Edit Component">Edit</a>',
                                '|',
                                '<a class="btn btn-link btn-manage-field" href="' + pageVars.url.componentManageField + '/' + json.data[i].cms_component_id + '" title="Manage Field">Manage  Field</a>',
                                '|',
                                '<a class="btn btn-link btn-delete-component" data-name="' + json.data[i].name + '" href="' + pageVars.url.componentDelete + '/' + json.data[i].cms_component_id + '" title="Delete Component">Delete</a>',
                            '<div>'
                        ].join('');
                        
                        
                        switch (parseInt(json.data[i].is_form)) {
                            case 0:
                                json.data[i].is_form = 'Flase';
                                break;
                                
                            case 1:
                                json.data[i].is_form = 'True';
                        }
                    }
                    
                    return json.data;
                }
            }
        });
    },
    delete: function($deleteBtn) {
        ComponentList.$activeModal = BootstrapDialog.show({
            title: 'Delete Componet',
            spinicon: 'glyphicon glyphicon-refresh',   
            message: function (dialog) {
                var $content = $('<div></div>');
                $content.append('<p>Are you sure you want to Delete Component: <b>' + $deleteBtn.data('name') + '</b>?</p>');

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

                        $.post($deleteBtn.attr('href'), {token: ComponentList.$ajaxToken.val()}, function(response) {
                            ComponentList.$ajaxToken
                                         .val(response.token);
                            
                            switch (response.status) {
                                case ajaxStatus.success:
                                    UtilityAlertMessage.append(response.message, 'success');
                                    ComponentList.$dataTable.draw(true);
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
            closable: false,
            onhide: function(dialogRef) {
                ComponentList.$activeModal = null;
            }
        });
    }
};

$(function(e) {
    ComponentList.init();
});