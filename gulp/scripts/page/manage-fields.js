var ManageField = {
    fieldList: {},
    $btnAddContent: null,
    $pageContentWrap: null,
    $fieldTypeDD: null,
    $form: null,
    $fieldTable: null,
    $modal: null,
    fieldCtr: 0,
    $fileAttrWrap: null,
    formElements: {},
    formData: null,
    init: function() {
        this.formData = new FormData();
        this.$modal = $('#field-add-modal');
        this.$fieldTable = $('#field-content-table');
        this.$form = $('#page-manage-field-form');
        this.$btnAddContent = $('#btn-add-field');
        this.$fileAttrWrap = $('#file-attributes-wrap');
        this.fieldCtr = fieldCtr;
        
        // Map field form elements
        this.formElements.name = $('#name');
        this.formElements.fieldName = $('#field_name');
        this.formElements.description = $('#description');
        this.formElements.note = $('#note');
        this.formElements.fieldTypes = $('#field_types');
        this.formElements.fieldCollection = $('#field_collection');
        this.formElements.maxWidth = $('#max_width');
        this.formElements.maxHeight = $('#max_height');
        this.formElements.minWidth = $('#min_width');
        this.formElements.minHeight = $('#min_height');
        this.formElements.acceptedType = $('#accepted_type');
        
        this.formElements.fieldTypes.on('change', this.fieldTypeEvent);
        this.$btnAddContent.on('click', this.addField);
        this.formElements.name.on('keyup', this.generateFieldName);
        this.modalCloseEvent();
        this.$form.on('submit', this.submitFormEvent);
    },
    addField: function(e) {
       e.preventDefault();
       
       ManageField.appendFieldToTable();
       ManageField.$modal.modal('hide');
    },
    fieldTypeEvent: function() {
        var $self = $(this);
        
        switch (parseInt($self.val())) {
            case 9:
            case 10:
                ManageField.$fileAttrWrap.removeClass('hide-element');
                break;
            
            default:
                ManageField.$fileAttrWrap.addClass('hide-element');
                ManageField.formElements.maxWidth.val('');
                ManageField.formElements.maxHeight.val('');
                ManageField.formElements.minWidth.val('');
                ManageField.formElements.minHeight.val('');
                ManageField.formElements.acceptedType.val('');
        }
        
    },
    appendFieldToTable: function() {
        var $row = $('<tr>').attr('id', 'row-' + ManageField.fieldCtr);
        var option = [
            '<a href="#" data-target="row-' + ManageField.fieldCtr+ '" class="btn btn-link btn-edit-field" title="Edit field"><i class="fa fa-pencil-square" aria-hidden="true"></i> Edit</a>',
            '|',
            '<a href="#" data-target="row-' + ManageField.fieldCtr+ '" class="btn btn-link btn-remove-field" title="Remove field"><i class="fa fa-trash" aria-hidden="true"></i></i> Remove</a>'
        ];
        var fielTypeVal = ((parseInt(ManageField.formElements.fieldTypes.val()) > 0) ? ManageField.formElements.fieldTypes.find('option[value="' + ManageField.formElements.fieldTypes.val() + '"]').text() : 'None');
        var fielCollectionVal = ((parseInt(ManageField.formElements.fieldCollection.val()) > 0) ? ManageField.formElements.fieldCollection.find('option[value="' + ManageField.formElements.fieldCollection.val() + '"]').text() : 'None');
        
        $row.append('<td>' + ManageField.formElements.name.val() + '</td>');
        $row.append('<td>' + ManageField.formElements.fieldName.val() + '</td>');
        $row.append('<td>' + fielTypeVal + '</td>');
        $row.append('<td>' + fielCollectionVal + '</td>');
        $row.append(option);
        
        this.$fieldTable.find('tbody')
                        .append($row);
                        
        ManageField.appendFieldToList();
    },
    appendFieldToList: function() {
        ManageField.fieldList[ManageField.fieldCtr] = {
            'content_id': -1,
            'name': ManageField.formElements.name.val(),
            'fieldName': ManageField.formElements.fieldName.val(),
            'description': ManageField.formElements.description.val(),
            'note': ManageField.formElements.note.val(),
            'fieldTypes': ManageField.formElements.fieldTypes.val(),
            'fieldCollection': ManageField.formElements.fieldCollection.val(),
            'maxWidth': ManageField.formElements.maxWidth.val(),
            'maxHeight': ManageField.formElements.maxHeight.val(),
            'minWidth': ManageField.formElements.minWidth.val(),
            'minHeight': ManageField.formElements.minHeight.val(),
            'acceptedType': ManageField.formElements.acceptedType.val()
        };
        
        ManageField.fieldCtr++;
    },
    submitFormEvent: function(e) {
        e.preventDefault();
        
        // Prepared form data
        //var serializeArr = ManageField.$form.serializeArray();
        
        ManageField.formData.append('cms_page_field_content_id', $('#cms_page_field_content_id').val());
        ManageField.formData.append('csrf_token', $('#csrf_token').val());
        ManageField.formData.append('page_id', $('#page_id').val());
        
        /* for (var i = 0; i < serializeArr.length; i++) {
            ManageField.formData.append(serializeArr[i].name, serializeArr[i].value);
        } */
        
        for (var index in ManageField.fieldList) {
            ManageField.formData.append('contents[' + index + '][content_id]', ManageField.fieldList[index].content_id);
            ManageField.formData.append('contents[' + index + '][name]', ManageField.fieldList[index].name);
            ManageField.formData.append('contents[' + index + '][field_name]', ManageField.fieldList[index].fieldName);
            ManageField.formData.append('contents[' + index + '][description]', ManageField.fieldList[index].description);
            ManageField.formData.append('contents[' + index + '][note]', ManageField.fieldList[index].note);
            ManageField.formData.append('contents[' + index + '][field_type]', ManageField.fieldList[index].fieldTypes);
            ManageField.formData.append('contents[' + index + '][field_collection]', ManageField.fieldList[index].fieldCollection);
            ManageField.formData.append('contents[' + index + '][max_width]', ManageField.fieldList[index].maxWidth);
            ManageField.formData.append('contents[' + index + '][max_height]', ManageField.fieldList[index].maxHeight);
            ManageField.formData.append('contents[' + index + '][min_width]', ManageField.fieldList[index].minWidth);
            ManageField.formData.append('contents[' + index + '][min_height]', ManageField.fieldList[index].minHeight);
            ManageField.formData.append('contents[' + index + '][accepted_type]', ManageField.fieldList[index].acceptedType);
        }
        
        $.ajax({
            url: ManageField.$form.attr('action'),
            type: 'POST',
            contentType: false,
            processData: false,
            data: ManageField.formData,
            success: function(response, textStatus, jqXHR) {
                console.log(response);
            }
        });
        
    },
    clearFields: function() {
        ManageField.formElements.name.val('');
        ManageField.formElements.fieldName.val('');
        ManageField.formElements.description.val('');
        ManageField.formElements.note.val('');
        ManageField.formElements.fieldTypes.val(-1);
        ManageField.formElements.fieldCollection.val(-1);
        ManageField.formElements.maxWidth.val('');
        ManageField.formElements.maxHeight.val('');
        ManageField.formElements.minWidth.val('');
        ManageField.formElements.minHeight.val('');
        ManageField.formElements.acceptedType.val('');
        
        ManageField.$fileAttrWrap.addClass('hide-element');
    },
    modalCloseEvent: function() {
        ManageField.$modal.on('hide.bs.modal', function(e) {
            ManageField.clearFields();
        });
    },
    generateFieldName: function() {
        var _fieldName = ManageField.formElements.name.val().replace(/[-\s]/g, '_').toLowerCase();
        ManageField.formElements.fieldName.val(_fieldName);
    }
};

$(function(e) {
    ManageField.init();
});