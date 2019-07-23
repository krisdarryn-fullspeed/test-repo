var PageManageField = {
    fieldFormHtml: null,
    $form: null,
    newFields: null,
    newFieldCtr: null,
    removeFields: null,
    $table: null,
    $btnSave: null,
    $token: null,
    $pageId: null,
    $activeModal: null,
    fieldType: null,
    sortTable: null,
    hasSorted: false,
    init: function() {
        this.fieldFormHtml = document.getElementById('page-field-form').outerHTML;
        document.getElementById('page-field-form').remove();
        this.newFields = {};
        this.newFieldCtr = fieldsCtr;
        this.removeFields = [];
        this.$table = $('#table-pages');
        this.$btnSave = $('#btn-submit-field');
        this.$token = $('#ajax_token');
        this.$pageId = $('#cms_page_id');
        this.initSort();

        // Bind form submit
        $(document).on('submit', '#page-field-form', function(e) {
            e.preventDefault();

            if ($(e.delegateTarget.activeElement).attr('id') === 'field_name') {
                PageManageField.$form
                           .find('#field_access_name')
                           .focus();
            } else {
                $('#btn-submit').trigger('click');
            }

        });

        // Bind event to add button
        $('#btn-add-field').on('click', function(e) {
            e.preventDefault();

            PageManageField.showModal({
                title: 'Add Field',
                submitLabel: 'Add',
                state: 'add'
            });
        });


        // Bind event to edit button]
        $(document).on('click', '.btn-field-edit', function(e) {
            e.preventDefault();
            var $self = $(this);
            var $row = $self.closest('.f-row');

            PageManageField.showModal({
                title: 'Edit Field',
                submitLabel: 'Edit',
                state: 'edit',
                field: $row.data('field'),
                fieldType: $row.data('type')
            });

        });

        // Bind event to edit button]
        $(document).on('click', '.btn-field-delete', function(e) {
            e.preventDefault();
            var $self = $(this);

            PageManageField.delete($self.closest('.f-row'));
        });

        // Event to is_file checkbox
        $(document).on('change', '.is-file-checkbox', function() {

            if (this.checked) {
                PageManageField.$form
                           .find('.file-attribute-field')
                           .removeAttr('disabled');
            } else {
                PageManageField.$form
                           .find('.file-attribute-field')
                           .attr('disabled', 'disabled')
                           .val('');

                $('#field_accepted_type').val(null).trigger('change');
            }

        });

        // Bind event to field name field
        $(document).on('blur', '#field_name', function() {
            PageManageField.$form
                       .find('#field_access_name')
                       .val(UtilityField.generateAccessName({value: this.value}));
        });

        // Bind event to save button
        PageManageField.$btnSave.on('click', PageManageField.saveFields);
    },
    initSort: function() {
        $(document).on('click', '.sort-handler-wrap', function(e) {
            e.preventDefault();
        });

        PageManageField.sortTable = dragula([$('#table-pages tbody').get(0)], {
            revertOnSpill: true,
            moves: function (el, container, handle) {
                var $handler = $(handle);
        
                return $handler.hasClass('sort-handler');
            }
        }).on('drop', function(el) {
            PageManageField.hasSorted = true;
        });
    },
    saveFields: function(e) {
        e.preventDefault();
        var $self = $(this);
        var formData = new FormData();
        formData.append('token', PageManageField.$token.val());
        formData.append('cms_page_id', PageManageField.$pageId.val());
        formData.append('has_sorted', PageManageField.hasSorted);

        // Prepare fields
        $('.f-row').each(function(i, element) {
            var $row = $(element);
            var field = $row.data('field');

            if (is.not.undefined($row.data('is-exist')) && (($row.data('is-exist') == 'true') || $row.data('is-exist'))) {
                formData.append('existing_fields[' + i +'][cms_page_field_id]', field.cms_page_field_id);
                formData.append('existing_fields[' + i +'][name]', field.name);
                formData.append('existing_fields[' + i +'][access_name]', field.access_name);   
                formData.append('existing_fields[' + i +'][description]', field.description);
                formData.append('existing_fields[' + i +'][field_type_id]', field.field_type_id);
                formData.append('existing_fields[' + i +'][is_file]', field.is_file);
                formData.append('existing_fields[' + i +'][is_required]', field.is_required);
                formData.append('existing_fields[' + i +'][note]', field.note);
                formData.append('existing_fields[' + i +'][display_order]', i);

                if (field.is_file == 1) {
                    formData.append('existing_fields[' + i +'][max_width]', field.max_width);
                    formData.append('existing_fields[' + i +'][max_height]', field.max_height);
                    formData.append('existing_fields[' + i +'][min_width]', field.min_width);
                    formData.append('existing_fields[' + i +'][min_height]', field.min_height);
                    formData.append('existing_fields[' + i +'][accepted_type]', field.accepted_type);                
                }

                if (is.not.undefined(field.hasUpdated) && field.hasUpdated) {
                    formData.append('existing_fields[' + i +'][has_updated]', field.hasUpdated);
                }

            } else if (is.not.undefined($row.data('is-new')) && $row.data('is-new')) {
                formData.append('new_fields[' + i +'][name]', field.name);
                formData.append('new_fields[' + i +'][access_name]', field.access_name);   
                formData.append('new_fields[' + i +'][description]', field.description);
                formData.append('new_fields[' + i +'][field_type_id]', field.field_type_id);
                formData.append('new_fields[' + i +'][is_file]', field.is_file);
                formData.append('new_fields[' + i +'][is_required]', field.is_required);
                formData.append('new_fields[' + i +'][note]', field.note);
                formData.append('new_fields[' + i +'][display_order]', i);

                if (field.is_file == 1) {
                    formData.append('new_fields[' + i +'][max_width]', field.max_width);
                    formData.append('new_fields[' + i +'][max_height]', field.max_height);
                    formData.append('new_fields[' + i +'][min_width]', field.min_width);
                    formData.append('new_fields[' + i +'][min_height]', field.min_height);
                    formData.append('new_fields[' + i +'][accepted_type]', field.accepted_type);                
                }
            }

        });

        for (var i = 0; i < PageManageField.removeFields.length; i++) {
            formData.append('detele_fields[' + i + ']', PageManageField.removeFields[i]);
        }

        PageManageField.$btnSave
                       .attr('disabled', 'disabled');
        UtilityLoader.applyLoader(null, PageManageField.$table);

        $.ajax({
            url: pageVars.url.pageMangeField + '/' + PageManageField.$pageId.val(),
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function(response, textStatus, jqXHR) {
                PageManageField.$token.val(response.token);
                PageManageField.$btnSave
                               .removeAttr('disabled');
                UtilityLoader.removeLoader(null, PageManageField.$table);

                switch (response.status) {
                    case ajaxStatus.success:
                        UtilityAlertMessage.append(response.message, 'success');
                        PageManageField.hasSorted = false;
                        location.href = pageVars.url.pageEdit + '/' + PageManageField.$pageId.val();
                        break;
                        
                    case ajaxStatus.error:
                        UtilityAlertMessage.append(response.message, 'warning');
                }

            }
        });

    },
    showModal: function(options) {
        PageManageField.$activeModal = BootstrapDialog.show({
            title: options.title,
            spinicon: 'glyphicon glyphicon-refresh',           
            message: function (dialog) {
                PageManageField.$form = $(PageManageField.fieldFormHtml).removeClass('hide-element');
                dialog.setData('options', options);

                return PageManageField.$form;
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
                    label: options.submitLabel,
                    cssClass: 'btn btn-primary',
                    autospin: true,
                    action: function(dialogRef) {
                        
                        switch (options.state) {
                            case 'add':
                                PageManageField.add(dialogRef, this);
                                break;

                            case 'edit':
                                PageManageField.edit(dialogRef, this);
                        }   
                    }
                }
            ],
            closable: false,
            onshown: function(dialogRef) {
                var $fileType = PageManageField.$form.find('#field_accepted_type');
                $fileType.select2({
                    placeholder: $fileType.attr('placeholder')
                });

                if (dialogRef.getData('options').state == 'edit') {
                    PageManageField.setFormFields(dialogRef.getData('options').field);
                }
            },
            onhide: function(dialogRef) {
                PageManageField.$form = null;
                PageManageField.$activeModal = null;
                PageManageField.fieldType = null;
            }
        });
    },
    add: function(dialogRef, $btn) {

        if (!PageManageField.validate()) {
            $btn.stopSpin();
            return;
        }

        var field = {
            name: PageManageField.$form.find('#field_name').val(),
            access_name: PageManageField.$form.find('#field_access_name').val(),
            field_type_id: PageManageField.$form.find('#field_type').val(),
            description: PageManageField.$form.find('#field_description').val(),
            note: PageManageField.$form.find('#field_note').val(),
            is_required: (PageManageField.$form.find('#field_is_required').prop('checked') ? 1 : 0),
            is_file: (PageManageField.$form.find('#field_is_file').prop('checked') ? 1 : 0),
            ctr: PageManageField.newFieldCtr
        };

        if (PageManageField.$form.find('#field_is_file').prop('checked')) {
            field.max_width = PageManageField.$form.find('#field_max_width').val();
            field.max_height = PageManageField.$form.find('#field_max_height').val();
            field.min_width = PageManageField.$form.find('#field_min_width').val();
            field.min_height = PageManageField.$form.find('#field_min_height').val();
            field.accepted_type = $('#field_accepted_type').select2('val').join(',');
        }

        PageManageField.newFields[PageManageField.newFieldCtr++] = field;
        PageManageField.appendRow(field);
        dialogRef.close();
        $btn.stopSpin();
    },
    edit: function(dialogRef, $btn) {
        
        if (!PageManageField.validate()) {
            $btn.stopSpin();
            return;
        }

        var field = dialogRef.getData('options').field;

        field.name = PageManageField.$form.find('#field_name').val();
        field.access_name = PageManageField.$form.find('#field_access_name').val();
        field.field_type_id = PageManageField.$form.find('#field_type').val();
        field.description = PageManageField.$form.find('#field_description').val();
        field.note = PageManageField.$form.find('#field_note').val();
        field.is_required = (PageManageField.$form.find('#field_is_required').prop('checked') ? 1 : 0);
        field.is_file = (PageManageField.$form.find('#field_is_file').prop('checked') ? 1 : 0);
        field.max_width = PageManageField.$form.find('#field_max_width').val();
        field.max_height = PageManageField.$form.find('#field_max_height').val();
        field.min_width = PageManageField.$form.find('#field_min_width').val();
        field.min_height = PageManageField.$form.find('#field_min_height').val();
        field.accepted_type = $('#field_accepted_type').select2('val').join(',');

        // Add indicator to existing data that it has been edited
        if (is.not.undefined(field.cms_page_field_id)) {
            field.hasUpdated = true;            
        }

        PageManageField.newFields[field.ctr] = field;

        PageManageField.editRow($('#f-row-' + field.ctr), field);
        dialogRef.close();
        $btn.stopSpin();
    },
    delete: function($row) {
        var field = $row.data('field');

        PageManageField.$activeModal = BootstrapDialog.show({
            title: 'Delete Field',
            spinicon: 'glyphicon glyphicon-refresh',   
            message: function (dialog) {
                var $content = $('<div></div>');
                $content.append('<p>Are you sure you want to Delete this Field?</p>');

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
                        
                        if (is.not.undefined($row.data('is-exist')) && (($row.data('is-exist') == 'true') || $row.data('is-exist'))) {
                            PageManageField.removeFields.push(field.cms_page_field_id);
                        }

                        $row.remove();
                        dialogRef.close();
                    }
                }
            ],
            closable: false,
            onhide: function(dialogRef) {
                PageManageField.$activeModal = null;
            }
        });
    },
    setFormFields: function(field) {
        PageManageField.$form
                   .find('#field_name')
                   .val(field.name);

        PageManageField.$form
                   .find('#field_access_name')
                   .val(field.access_name);

        PageManageField.$form
                   .find('#field_type')
                   .val(field.field_type_id);

        PageManageField.$form
                   .find('#field_description')
                   .val(field.description);

        PageManageField.$form
                   .find('#field_note')
                   .val(field.note);

        if (field.is_required == 1) {
            PageManageField.$form
                   .find('#field_is_required')
                   .prop('checked', 'checked');
        }

        if (field.is_file == 1) {
            PageManageField.$form
                   .find('#field_is_file')
                   .prop('checked', 'checked')
                   .trigger('change');

            PageManageField.$form
                   .find('#field_max_width')
                   .val(field.max_width);

            PageManageField.$form
                   .find('#field_max_height')
                   .val(field.max_height);

            PageManageField.$form
                   .find('#field_min_width')
                   .val(field.min_width);

            PageManageField.$form
                   .find('#field_min_height')
                   .val(field.min_height);

            if (is.not.empty(field.accepted_type)) {
                PageManageField.$form
                           .find('#field_accepted_type')
                           .select2()
                           .val(field.accepted_type.split(','))
                           .trigger('change');
            }
            
        }

    },
    appendRow: function(field) {
        var $row = $([
            '<tr class="f-row"' + "data-field='" +  JSON.stringify(field) + "'" + ' data-is-new="true" id="f-row-' + field.ctr + '">',
                '<td><a href="#" title="Sort" class="sort-handler-wrap"><i class="fa fa-arrows sort-handler" aria-hidden="true"></i></a></td>',
                '<td class="f-td-n">' + field.name + '</td>',
                '<td class="f-td-an">' + field.access_name + '</td>',
                '<td class="f-td-d">' + field.description + '</td>',
                '<td class="f-td-ft">' + PageManageField.getFieldType(field.field_type_id) + '</td>',
                '<td class="f-td-if">' + PageManageField.genIsFileField(field) + '</td>',
                '<td class="f-td-ir">' + PageManageField.getIsFieldLabel(field.is_required) + '</td>',
                '<td class="f-td-options">',
                    [
                        '<div>',
                            '<a href="#" class="btn btn-link btn-field-edit" title="Edit field">Edit</a>',
                            ' | ',
                            '<a href="#" class="btn btn-link btn-field-delete"title="Delete field">Delete</a>',
                        '</div>'
                    ].join(''),
                '</td>',
            '</tr>'
        ].join(''));

        this.$table
            .find('tbody')
            .append($row);
    },
    editRow: function($row, field) {
        $row.data('field', field);
        $row.find('.f-td-n').html(field.name);
        $row.find('.f-td-an').html(field.access_name);
        $row.find('.f-td-d').html(field.description);
        $row.find('.f-td-ft').html(PageManageField.getFieldType(field.field_type_id));
        $row.find('.f-td-if').html(PageManageField.genIsFileField(field));
        $row.find('.f-td-ir').html(PageManageField.getIsFieldLabel(field.is_required));
    },
    getFieldType: function(id) {
        var find = null;

        $.each(fieldTypes, function(i, record) {
            
            if (record.cms_field_type_id == id) {
                find = record;
                return;
            }

        });

        return (is.not.null(find) ? find.name : '');
    },
    getIsFieldLabel: function(val) {
        return (val == 1 ? 'True' : 'False');
    },
    genIsFileField: function(field) {
        var html = '<p>' + PageManageField.getIsFieldLabel(field.is_file) + '</p>';


        return (html += PageManageField.genFieldAttributes(field));
    },
    genFieldAttributes: function(field) {
        
        if (field.is_file == 1) {
            var fAttrHTML = document.getElementById('file-attribute-template').outerHTML;
            var $fAttrHTML = $(fAttrHTML),
                collapseID = 'fa-collapse-' + field.ctr;

            $fAttrHTML.removeAttr('id')
                      .removeAttr('class');

            $fAttrHTML.find('.btn-fa-collapse')
                      .attr('href', '#' + collapseID);

            $fAttrHTML.find('.fa-collapse')
                      .attr('id', collapseID);

            $fAttrHTML.find('.fa-max-w-val')
                      .html((field.max_width ? field.max_width + 'px' : 'N/A'));

            $fAttrHTML.find('.fa-max-h-val')
                      .html((field.max_height ? field.max_height + 'px' : 'N/A'));

            $fAttrHTML.find('.fa-min-w-val')
                      .html((field.min_width ? field.min_width + 'px' : 'N/A'));

            $fAttrHTML.find('.fa-min-h-val')
                      .html((field.min_height ? field.min_height + 'px' : 'N/A'));

            $fAttrHTML.find('.fa-at-val')
                      .html((field.accepted_type ? field.accepted_type : 'N/A'));

            return $fAttrHTML.get(0).outerHTML;
        }

        return '';
    },
    validate: function() {
        var valid = true;
        var msgs = [];

        if (!PageManageField.$form.find('#field_name').val()) {
            msgs.push('<p>Name is required.</p>');
            valid = false;
        }

        if (!PageManageField.$form.find('#field_access_name').val()) {
            msgs.push('<p>Access Name is required.</p>');
            valid = false;
        }

        if (!PageManageField.$form.find('#field_type').val()) {
            msgs.push('<p>Field Type is required.</p>');
            valid = false;
        }
        

        if (PageManageField.$form.find('#field_is_file').prop('checked')) {

            if (!PageManageField.$form.find('#field_max_width').val()) {
                msgs.push('<p>Max Width is required.</p>');
                valid = false;
            }

            if (!PageManageField.$form.find('#field_max_height').val()) {
                msgs.push('<p>Max Height is required.</p>');
                valid = false;
            }

            if (!PageManageField.$form.find('#field_min_width').val()) {
                msgs.push('<p>Min Width is required.</p>');
                valid = false;
            }

            if (!PageManageField.$form.find('#field_min_height').val()) {
                msgs.push('<p>Min Height is required.</p>');
                valid = false;
            }

            if (PageManageField.$form.find('#field_accepted_type').select2().val().length === 0) {
                msgs.push('<p>Accepted File is required.</p>');
                valid = false;
            }

        }


        if (!valid) {
            UtilityAlertMessage.append(msgs.join(''), 'warning');
        }

        return valid;
    }
};

$(function(e) {
    PageManageField.init();
});