function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

$('#nav-cartenf-tab').click();

// traduction
$(".locale-switcher").hide();

// Avertissement
$(".disclamer").hide();


// carte, niveau de choix
$(".card.levelchose").hide();

// Formulaire sur le volume (désactiver le reste)
$( document ).ready(function() {
    $(".livingvolume_manuel").hide();
    $("#livingvolume_auto").prop( "disabled", true);
    $("#livingvolume").prop('disabled', false);
    $(".form-livingvolume_auto").hide();
    $(".livingvolume_manuel").hide();
    $("#livingspace").removeAttr("required");
    $("#livingheight").removeAttr("required");
    $("#submit_button").attr('data-i18n', '');
    $("#submit_button").html("Calculer le besoin de chauffage");
    $('#suggestion').hide();
    $('#result h4').hide();
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
