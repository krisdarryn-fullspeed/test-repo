var ManageField = {
    formHtml: null,
    $form: null,
    newFields: null,
    newFieldCtr: 0,
    removeFields: null,
    $table: null,
    $btnSave: null,
    $token: null,
    $fieldCollectionId: null,
    $activeModal: null,
    init: function() {
        this.formHtml = document.getElementById('component-field-form').outerHTML;
        document.getElementById('component-field-form').remove();
        this.newFields = {};
        this.newFieldCtr = fieldsCtr;
        this.removeFields = [];
        this.$table = $('#table-field-collection');
        this.$btnSave = $('#btn-submit-field');
        this.$token = $('#ajax_token');
        this.$fieldCollectionId = $('#cms_field_collection_id');

        // Bind form submit
        $(document).on('submit', '#component-field-form', function(e) {
            e.preventDefault();

            if ($(e.delegateTarget.activeElement).attr('id') === 'cf_name') {
                ManageField.$form
                           .find('#cf_access_name')
                           .focus();
            } else {
                $('#btn-submit').trigger('click');
            }

        });

        // Bind event to add button
        $('#btn-add-field').on('click', function(e) {
            e.preventDefault();

            ManageField.showModal({
                title: 'Add Field',
                submitLabel: 'Add',
                state: 'add'
            });
        });

        // Bind event to edit button]
        $(document).on('click', '.btn-field-edit', function(e) {
            e.preventDefault();
            var $self = $(this);

            ManageField.showModal({
                title: 'Edit Field',
                submitLabel: 'Edit',
                state: 'edit',
                field: $self.closest('.f-row').data('field')
            });

        });

        // Bind event to edit button]
        $(document).on('click', '.btn-field-delete', function(e) {
            e.preventDefault();
            var $self = $(this);

            ManageField.delete($self.closest('.f-row'));
        });

        // Event to is_file checkbox
        $(document).on('change', '.is-file-checkbox', function() {

            if (this.checked) {
                ManageField.$form
                           .find('.file-attribute-field')
                           .removeAttr('disabled');
            } else {
                ManageField.$form
                           .find('.file-attribute-field')
                           .attr('disabled', 'disabled')
                           .val('');

                $('#cf_accepted_type').val(null).trigger('change');
            }

        });

        // Bind event to field name field
        $(document).on('blur', '#cf_name', function() {
            ManageField.$form
                       .find('#cf_access_name')
                       .val(UtilityField.generateAccessName({value: this.value}));
        });

        // Bind event to save button
        ManageField.$btnSave.on('click', ManageField.saveFields);
    },
    saveFields: function(e) {
        e.preventDefault();
        var $self = $(this);
        var formData = new FormData();
        formData.append('token', ManageField.$token.val());
        formData.append('cms_field_collection_id', ManageField.$fieldCollectionId.val());

        // Prepare fields
        $('.f-row').each(function(i, element) {
            var $row = $(element);
            var field = $row.data('field');

            if (is.not.undefined($row.data('is-exist')) && (($row.data('is-exist') == 'true') || $row.data('is-exist'))) {
                formData.append('existing_fields[' + i +'][cms_field_collection_field_id]', field.cms_field_collection_field_id);
                formData.append('existing_fields[' + i +'][name]', field.name);
                formData.append('existing_fields[' + i +'][access_name]', field.accessName);   
                formData.append('existing_fields[' + i +'][description]', field.description);
                formData.append('existing_fields[' + i +'][field_type_id]', field.fieldType);
                formData.append('existing_fields[' + i +'][is_file]', field.isFile);
                formData.append('existing_fields[' + i +'][is_required]', field.isRequired);
                formData.append('existing_fields[' + i +'][note]', field.note);
                formData.append('existing_fields[' + i +'][display_order]', i);

                if (field.isFile == 1) {
                    formData.append('existing_fields[' + i +'][max_width]', field.maxWidth);
                    formData.append('existing_fields[' + i +'][max_height]', field.maxHeight);
                    formData.append('existing_fields[' + i +'][min_width]', field.minWidth);
                    formData.append('existing_fields[' + i +'][min_height]', field.minHeight);
                    formData.append('existing_fields[' + i +'][accepted_type]', field.acceptedType);                
                }

                if (is.not.undefined(field.hasUpdated) && field.hasUpdated) {
                    formData.append('existing_fields[' + i +'][has_updated]', field.hasUpdated);
                }

            } else if (is.not.undefined($row.data('is-new')) && $row.data('is-new')) {
                formData.append('new_fields[' + i +'][name]', field.name);
                formData.append('new_fields[' + i +'][access_name]', field.accessName);   
                formData.append('new_fields[' + i +'][description]', field.description);
                formData.append('new_fields[' + i +'][field_type]', field.fieldType);
                formData.append('new_fields[' + i +'][is_file]', field.isFile);
                formData.append('new_fields[' + i +'][is_required]', field.isRequired);
                formData.append('new_fields[' + i +'][note]', field.note);
                formData.append('new_fields[' + i +'][display_order]', i);

                if (field.isFile == 1) {
                    formData.append('new_fields[' + i +'][max_width]', field.maxWidth);
                    formData.append('new_fields[' + i +'][max_height]', field.maxHeight);
                    formData.append('new_fields[' + i +'][min_width]', field.minWidth);
                    formData.append('new_fields[' + i +'][min_height]', field.minHeight);
                    formData.append('new_fields[' + i +'][accepted_type]', field.acceptedType);                
                }
            }

        });

        for (var i = 0; i < ManageField.removeFields.length; i++) {
            formData.append('detele_fields[' + i + ']', ManageField.removeFields[i]);
        }

        ManageField.$btnSave
                   .attr('disabled', 'disabled');
        UtilityLoader.applyLoader(null, ManageField.$table);

        $.ajax({
            url: pageVars.url.fieldCollectionManageField + '/' + ManageField.$fieldCollectionId.val(),
            type: 'POST',
            cache: false,
            contentType: false,
            processData: false,
            data: formData,
            success: function(response, textStatus, jqXHR) {
                ManageField.$token.val(response.token);
                ManageField.$btnSave
                           .removeAttr('disabled');
                UtilityLoader.removeLoader(null, ManageField.$table);

                switch (response.status) {
                    case ajaxStatus.success:
                        UtilityAlertMessage.append(response.message, 'success');
                        location.href = pageVars.url.fieldCollectionList + '/' + ManageField.$fieldCollectionId.val();
                        break;
                        
                    case ajaxStatus.error:
                        UtilityAlertMessage.append(response.message, 'warning');
                }

            }
        });

    },
    showModal: function(options) {
        ManageField.$activeModal = BootstrapDialog.show({
            title: options.title,
            spinicon: 'glyphicon glyphicon-refresh',           
            message: function (dialog) {
                ManageField.$form = $(ManageField.formHtml).removeClass('hide-element');
                dialog.setData('options', options);

                return ManageField.$form;
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
                                ManageField.add(dialogRef, this);
                                break;

                            case 'edit':
                                ManageField.edit(dialogRef, this);
                        }   
                    }
                }
            ],
            closable: false,
            onshown: function(dialogRef) {
                var $fileType = ManageField.$form.find('#cf_accepted_type');
                $fileType.select2({
                    placeholder: $fileType.attr('placeholder')
                });

                if (dialogRef.getData('options').state == 'edit') {
                    ManageField.setFormFields(dialogRef.getData('options').field);
                }
            },
            onhide: function(dialogRef) {
                ManageField.$form = null;
                ManageField.$activeModal = null;
            }
        });
    },
    add: function(dialogRef, $btn) {

        if (!ManageField.validate()) {
            $btn.stopSpin();
            return;
        }

        var field = {
            name: ManageField.$form.find('#cf_name').val(),
            accessName: ManageField.$form.find('#cf_access_name').val(),
            fieldType: ManageField.$form.find('#field_type').val(),
            description: ManageField.$form.find('#cf_description').val(),
            note: ManageField.$form.find('#cf_note').val(),
            isRequired: (ManageField.$form.find('#cf_is_required').prop('checked') ? 1 : 0),
            isFile: (ManageField.$form.find('#cf_is_file').prop('checked') ? 1 : 0),
            ctr: ManageField.newFieldCtr
        };

        if (ManageField.$form.find('#cf_is_file').prop('checked')) {
            field.maxWidth = ManageField.$form.find('#cf_max_width').val();
            field.maxHeight = ManageField.$form.find('#cf_max_height').val();
            field.minWidth = ManageField.$form.find('#cf_min_width').val();
            field.minHeight = ManageField.$form.find('#cf_min_height').val();
            field.acceptedType = $('#cf_accepted_type').select2('val').join(',');
        }

        ManageField.newFields[ManageField.newFieldCtr++] = field;
        ManageField.appendRow(field);
        dialogRef.close();
        $btn.stopSpin();
    },
    edit: function(dialogRef, $btn) {
        
        if (!ManageField.validate()) {
            $btn.stopSpin();
            return;
        }

        var field = dialogRef.getData('options').field;

        field.name = ManageField.$form.find('#cf_name').val();
        field.accessName = ManageField.$form.find('#cf_access_name').val();
        field.fieldType = ManageField.$form.find('#field_type').val();
        field.description = ManageField.$form.find('#cf_description').val();
        field.note = ManageField.$form.find('#cf_note').val();
        field.isRequired = (ManageField.$form.find('#cf_is_required').prop('checked') ? 1 : 0);
        field.isFile = (ManageField.$form.find('#cf_is_file').prop('checked') ? 1 : 0);
        field.maxWidth = ManageField.$form.find('#cf_max_width').val();
        field.maxHeight = ManageField.$form.find('#cf_max_height').val();
        field.minWidth = ManageField.$form.find('#cf_min_width').val();
        field.minHeight = ManageField.$form.find('#cf_min_height').val();
        field.acceptedType = $('#cf_accepted_type').select2('val').join(',');

        // Add indicator to existing data that it has been edited
        if (is.not.undefined(field.cms_field_collection_field_id)) {
            field.hasUpdated = true;            
        }

        ManageField.newFields[field.ctr] = field;

        ManageField.editRow($('#f-row-' + field.ctr), field);
        dialogRef.close();
        $btn.stopSpin();
    },
    delete: function($row) {
        var field = $row.data('field');

        ManageField.$activeModal = BootstrapDialog.show({
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
                            ManageField.removeFields.push(field.cms_field_collection_field_id);
                        }

                        $row.remove();
                        dialogRef.close();
                    }
                }
            ],
            closable: false,
            onhide: function(dialogRef) {
                ManageField.$activeModal = null;
            }
        });
    },
    setFormFields: function(field) {
        ManageField.$form
                   .find('#cf_name')
                   .val(field.name);

        ManageField.$form
                   .find('#cf_access_name')
                   .val(field.accessName);

        ManageField.$form
                   .find('#field_type')
                   .val(field.fieldType);

        ManageField.$form
                   .find('#cf_description')
                   .val(field.description);

        ManageField.$form
                   .find('#cf_note')
                   .val(field.note);

        if (field.isRequired == 1) {
            ManageField.$form
                   .find('#cf_is_required')
                   .prop('checked', 'checked');
        }

        if (field.isFile == 1) {
            ManageField.$form
                   .find('#cf_is_file')
                   .prop('checked', 'checked')
                   .trigger('change');

            ManageField.$form
                   .find('#cf_max_width')
                   .val(field.maxWidth);

            ManageField.$form
                   .find('#cf_max_height')
                   .val(field.maxHeight);

            ManageField.$form
                   .find('#cf_min_width')
                   .val(field.minWidth);

            ManageField.$form
                   .find('#cf_min_height')
                   .val(field.minHeight);

            if (is.not.empty(field.acceptedType)) {
                ManageField.$form
                           .find('#cf_accepted_type')
                           .select2()
                           .val(field.acceptedType.split(','))
                           .trigger('change');
            }
            
        }

    },
    appendRow: function(field) {
        var $row = $([
            '<tr class="f-row"' + "data-field='" +  JSON.stringify(field) + "'" + ' data-is-new="true" id="f-row-' + field.ctr + '">',
                '<td class="f-td-n">' + field.name + '</td>',
                '<td class="f-td-an">' + field.accessName + '</td>',
                '<td class="f-td-d">' + field.description + '</td>',
                '<td class="f-td-ft">' + ManageField.getFieldType(field.fieldType) + '</td>',
                '<td class="f-td-if">' + ManageField.genIsFileField(field) + '</td>',
                '<td class="f-td-ir">' + ManageField.getIsFieldLabel(field.isRequired) + '</td>',
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
        $row.find('.f-td-an').html(field.accessName);
        $row.find('.f-td-d').html(field.description);
        $row.find('.f-td-ft').html(ManageField.getFieldType(field.fieldType));
        $row.find('.f-td-if').html(ManageField.genIsFileField(field));
        $row.find('.f-td-ir').html(ManageField.getIsFieldLabel(field.isRequired));
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
        var html = '<p>' + ManageField.getIsFieldLabel(field.isFile) + '</p>';


        return (html += ManageField.genFieldAttributes(field));
    },
    genFieldAttributes: function(field) {
        
        if (field.isFile == 1) {
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
                      .html((field.maxWidth ? field.maxWidth + 'px' : 'N/A'));

            $fAttrHTML.find('.fa-max-h-val')
                      .html((field.maxHeight ? field.maxHeight + 'px' : 'N/A'));

            $fAttrHTML.find('.fa-min-w-val')
                      .html((field.minWidth ? field.minWidth + 'px' : 'N/A'));

            $fAttrHTML.find('.fa-min-h-val')
                      .html((field.minHeight ? field.minHeight + 'px' : 'N/A'));

            $fAttrHTML.find('.fa-at-val')
                      .html((field.acceptedType ? field.acceptedType : 'N/A'));

            return $fAttrHTML.get(0).outerHTML;
        }

        return '';
    },
    validate: function() {
        var valid = true;
        var msgs = [];

        if (!ManageField.$form.find('#cf_name').val()) {
            msgs.push('<p>Name is required.');
            valid = false;
        }

        if (!ManageField.$form.find('#cf_access_name').val()) {
            msgs.push('<p>Access Name is required.');
            valid = false;
        }

        if (!ManageField.$form.find('#field_type').val()) {
            msgs.push('<p>Field Type is required.');
            valid = false;
        }
        

        if (ManageField.$form.find('#cf_is_file').prop('checked')) {

            if (!ManageField.$form.find('#cf_max_width').val()) {
                msgs.push('<p>Max Width is required.');
                valid = false;
            }

            if (!ManageField.$form.find('#cf_max_height').val()) {
                msgs.push('<p>Max Height is required.');
                valid = false;
            }

            if (!ManageField.$form.find('#cf_min_width').val()) {
                msgs.push('<p>Min Width is required.');
                valid = false;
            }

            if (!ManageField.$form.find('#cf_min_height').val()) {
                msgs.push('<p>Min Height is required.');
                valid = false;
            }

            if (ManageField.$form.find('#cf_accepted_type').select2().val().length === 0) {
                msgs.push('<p>Accepted File is required.');
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
    ManageField.init();
});