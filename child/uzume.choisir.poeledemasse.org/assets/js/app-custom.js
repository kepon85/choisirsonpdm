function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

// carte auto ou manuel
$("#nav-tab").hide();
// traduction
$(".locale-switcher").hide();

// carte, niveau de choix
$(".card.levelchose").hide();

// Formulaire auto sur le volume
$(".form-livingvolume_auto").hide();

// Avertissement
$(".disclamer").hide();
$(".temp_base_years_archive").hide();

if (inIframe()) {
    // En tête
    $(".header").hide();
    // pied de page
    $("footer").hide();
}

