function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}


$('#title').html("<h2>Dimensionner un poêle de masse</h2>");
$(".lead").removeAttr('data-i18n');
$('.lead').html("Etude pour l'installation d'un poêle de masse");

$("#submit_button").removeAttr('data-i18n');
$('#submit_button').text("Lancer l'étude");

$('label[for="level"]').removeAttr('data-i18n');
$('label[for="level"]').text('Méthode utilisé : ');

$('#level option[value="1"]').removeAttr('data-i18n');
$('#level option[value="1"]').text('G');
$('#level option[value="2"]').removeAttr('data-i18n');
$('#level option[value="2"]').text('Ubat');
$('#level option[value="3"]').removeAttr('data-i18n');
$('#level option[value="3"]').text('Paroi par paroi');

$('#nav-cartenf-tab').click();

$(".disclamer").hide();

$(document).ready(function() {
    setTimeout(function() {
        $('#help').hide();
    }, 100);
});


if (inIframe()) {
    // En tête
    $(".header").hide();
    // pied de page
    $("footer").hide();
    // Full page https://getbootstrap.com/docs/5.0/layout/containers/
    $('#body-container').removeClass('container');
    $('#body-container').addClass(' container-fluid');
}
