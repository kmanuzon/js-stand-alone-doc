$(document).ready(function() {


    var json_file_elem = document.getElementById('json_file');
    var output = document.getElementById('nu-json-output');

    json_file_elem.addEventListener('change', function(e) {
        console.log(e);

        var file = json_file_elem.files[0];

        console.log(json_file_elem.files);

        if (file.type.match('application/json')) {

            var reader = new FileReader();

            reader.onload = function(e) {
                output.innerHTML = reader.result;

                try {
                    var data = JSON.parse(reader.result);
                    console.log(data);
                }
                catch(e) {
                    // error with file.
                    console.log(e);
                }
            }

            reader.readAsText(file);
        }
        else {
            console.log('Invalid file');
        }
    });


    /**
     * Event handler for objects panel list items.
     */
    $('#objects-list').on('click', 'a', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var key = $(e.target).html();

        $('#object-table').show();
    });


    /**
     * Modal input field.
     */
    $('#nu-input-modal').on('show.bs.modal', function(e) {
        var $modal = $(this)
        var $button = $(e.relatedTarget);
        var context = $button.attr('data-context');
        var title = $button.attr('data-title');

        switch (context) {
            case 'nu-project-title':
                $modal.find('.modal-body input').val($('#nu-project-title').html());
                break;
            case 'nu-project-description':
                $modal.find('.modal-body input').val($('#nu-project-description').html());
                break;
            case 'objects-list':
                $modal.find('.modal-body input').val('');
                break;
            case 'object-name':
                // what to do?
                break;
            default:
                // do nothing.
                break;
        }

        $modal.find('.modal-title').html(title)
        $modal.find('.modal-body input')
            .prop('placeholder', title)
            .attr('data-context', context);
    });


    /**
     * Event handler for modal input field submission.
     */
    $('#nu-input-modal-submit').on('click', function(e) {
        var $inputField = $('#nu-input-modal-field');
        var value = $inputField.val();
        var context = $inputField.attr('data-context');

        switch (context) {
            case 'nu-project-title':
                $('#nu-project-title').html(value);
                break;
            case 'nu-project-description':
                $('#nu-project-description').html(value);
                break;
            case 'objects-list':
                $('#objects-list').append('<li><a href="#">' + value + '</a></li>');
                $('#object-table').show();
                break;
            case 'object-name':
                // what to do?
                break;
            default:
                // do nothing.
                break;
        }

        $('#nu-input-modal').modal('hide');
        outputJSON();
    });


    // initialize JSON output.
    outputJSON();
});


/**
 * Generates JSON string for output.
 */
function outputJSON() {

    var nuJSON = new Object();
    nuJSON.version = '1.0';
    nuJSON.title = $('#nu-project-title').html();
    nuJSON.description = $('#nu-project-description').html();
    nuJSON.objects = {};
    nuJSON.objects._empty_ = [];

    $.each($('#objects-panel-body li'), function(i, o) {
        var listItem = new Object();
        listItem.name = $(o).text();
        listItem.description = 'description here';
        listItem.fields = [];

        // author id.
        var liField = {
            jsondocType: {},
            name: 'id',
            description: 'authors id',
            required: 'false',
        };
        liField.jsondocType.type = ['integer'];
        liField.jsondocType.oneLineText = 'integer';
        listItem.fields.push(liField);

        // author namel.
        var liField = {
            jsondocType: {},
            name: 'name',
            description: 'authors name',
            required: 'false',
        };
        liField.jsondocType.type = ['string'];
        liField.jsondocType.oneLineText = 'string';
        listItem.fields.push(liField);


        // add this object.
        nuJSON.objects._empty_.push(listItem);
    });

    document.getElementById('nu-json-output').innerHTML = JSON.stringify(nuJSON);
}
