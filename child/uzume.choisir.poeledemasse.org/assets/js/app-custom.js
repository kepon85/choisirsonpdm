function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

$('#nav-cartenf-tab').click();

// carte auto ou manuel
//$("#nav-tab").hide();

// traduction
$(".locale-switcher").hide();

$("#bug-report-button").hide();
$("#bug-report-disclamer").hide();

// carte, niveau de choix
$(".card.levelchose").hide();

// Formulaire auto sur le volume
$(".form-livingvolume_auto").hide();

// Avertissement
$(".disclamer").hide();
$(".temp_base_years_archive").hide();

$("#result h4").hide();
$("p #calcShowHide").hide();

$("#form-home").html("Entrez les caractéristiques de votre maison");
$("#form-home").removeAttr('data-i18n');

$("#form-location").html("Entrez votre ville ");
$("#form-location").removeAttr('data-i18n');

if (inIframe()) {
    // En tête
    $(".header").hide();
    // pied de page
    $("footer").hide();
    // Full page https://getbootstrap.com/docs/5.0/layout/containers/
    $('#body-container').removeClass('container');
    $('#body-container').addClass(' container-fluid');
}

$(document).ready(function() {
    setTimeout(function() {
        $('#help').hide();
    }, 100);
});