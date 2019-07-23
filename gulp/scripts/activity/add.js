var ActivityEntry = {
    removedActivityImages: [],
    editedActivityImages: [],
    activityImageTable: null,
    activtyImageCtr: null,
    init: function() {
        this.activityImageTable = $('#table-act-img');
        this.activtyImageCtr = activityImageCtr;

        $('.activity-title').on('blur', function(e) {
            var $self = $(this);
            var $parent = $self.closest('.tab-pane');

            $parent.find('.activity-seo-url')
                   .val($self.val().replace(/[_\s]/g, '-').toLowerCase());
        });

        $('#fi-cover-image').on('change.bs.fileinput', function(e) {
            var $self = $(this);
            console.log($self);
        });

        ActivityEntry.initActivityImageEvents();

    },
    initActivityImageEvents: function() {
        $('#btn-add-act-img').on('click', function(e) {
            e.preventDefault();
            var $html = $(activityImageHtml);
            var $row = $('<tr>').addClass('fi-activity-image-row');

            ++ActivityEntry.activtyImageCtr;

            $html.find('.activity-image')
                 .attr('name', ('activty-image-' + ActivityEntry.activtyImageCtr));
            $html.find('.activity-image-name')
                 .attr('name', ('activity-image-name-' + ActivityEntry.activtyImageCtr));

            $row.append($('<td>').append($html));
            $row.append([
                '<td>',
                    '<a href="/ttjmc-app/admin/#" class="btn btn-danger btn-sm btn-rm-act-img" title="Remove"><i class="fa fa-times" aria-hidden="true"></i> Remove</a>',
                '</td>',
            ].join(''));

            ActivityEntry.activityImageTable.append($row);
        });

        $(document).on('click', '.btn-rm-act-img', function(e) {
            e.preventDefault();
            $self = $(this);

            $self.closest('.fi-activity-image-row')
                 .remove();
        });
    }
};

$(function(e) {
    ActivityEntry.init();
});

