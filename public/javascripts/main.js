$(document).ready(function() {

    function remove() {
        var fileName = $('input#removeFileName').val();
        console.log(fileName);
        $.ajax({
            url: '/attachFile',
            data: {file: fileName},
            type: 'DELETE',
            success: function(res) {
                console.log(res);
            }
        });
    }

    $('button#remove').click(remove);

});
