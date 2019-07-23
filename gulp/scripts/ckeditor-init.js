/**
 * Find all textarea WYSIWYG widget
 * Initialize ckeditor
 */
$(function(e) {
    
    CKEDITOR.replaceAll('textarea-wysiwyg-widget', {
        customConfig: '../scripts/ckeditor-config.js'
    });
    
});