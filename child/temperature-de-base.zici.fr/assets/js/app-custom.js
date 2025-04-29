$(document).ready(function() {


    // Mettre au milieu
    $('.col-md-6').first().removeClass('col-md-6').addClass('col-md-3');

    // Retirer les hashchanges
    const excludedIds = ['temp_base_nb_years_archive', 'temp_base_end_years_archive', 'temp_base_nb_days', 'temp_base_mode', 'temp_base', 'nav-tab-record'];

    // Parcourir tous les éléments ayant la classe "hashchange"
    $('.hashchange').each(function () {
        const element = $(this);
        
        // Vérifier si l'élément doit être exclu
        if (!excludedIds.includes(element.attr('id'))) {
            // Supprimer la classe "hashchange"
            element.removeClass('hashchange');
        }
    });


// Entête
$("#title").html("<h2>Température de base</h2>");
$(".lead").html("Proposition d’algorithme de calcul de la température de base");
$(".lead").removeAttr('data-i18n');
$("#app-alert").hide();
$("#app-alert").removeAttr('data-i18n');
$(".disclamer").html('<p>Cette proposition s\'appuie sur une <a href="https://framagit.org/kepon/choisirsonpdm/-/blob/main/api/Readme.md#api-temp%C3%A9rature-de-base">API open source</a> développée pour le logiciel "<a href="https://choisir.poeledemasse.org/">choisir son poêle de masse</a>", qui tire ces données météo du projet <a href="https://open-meteo.com/en/docs/historical-weather-api#data-sources">Climate Data Store (copernicus Europe)</a>.</p>' + 
                        '<p>La présente page permet de se rendre compte des différences entres la norme (NF P52-612/CN - <a href="https://forum.poeledemasse.org/t/methode-de-calcul-de-la-temperature-de-base/2819">dont nous ne connaissons pas le calcul ni la source des données</a>) et les données historiques météo Copernicus</p>');
$(".disclamer").removeAttr('data-i18n');

// Cacher le superflu
$(".card.levelchose").hide();
$(".card.form-building").hide();
$(".card.level3-settings").hide();
$(".form-detail-building").hide();
$(".btns").hide();
$("#sharingButton").hide();

$(".dju_years_archive").html("");
$(".temp_ground_input_group").html("");

$(".temp_base_input_group .form-switch").hide();



// Avertissement
//$(".disclamer").hide();




});