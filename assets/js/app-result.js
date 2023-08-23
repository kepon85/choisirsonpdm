
// Envoi du formulaire
function submitForm() {
    debug('Soumission du formulaire');
    //var error
    // Vérification pour calcul
    // Faire apparaître les résultats
    $("#result").show();
    document.getElementById("result").scrollIntoView();
    $("#submit_input").val(1);
    hashChange();
    // Méthode G, niveau 1
    if ($("#level").val() == 1) {
        // Pour la méthode de calcul
        debug('Level 1');
        $(".res_temp_indor").replaceWith($("#temp_indor").val());
        $(".res_temp_base").replaceWith($("#temp_base").val());
        $(".res_volume").replaceWith($("#livingvolume").val());
        $(".res_g").replaceWith($("#g").val());
        var resDeperditionMax = precise_round(( $("#temp_indor").val() - $("#temp_base").val() ) * $("#livingvolume").val() * $("#g").val(), 2);
        $(".res_level1").replaceWith(resDeperditionMax);
    } else if ($("#level").val() == 2) {
        // Pour la méthode de calcul
        debug('Level 2');
        $(".res_ubat").replaceWith($("#ubat_global").val());
        $(".res_ws").replaceWith($("#wastagesurface").val());
        $(".res_volume").replaceWith($("#livingvolume").val());
        $(".res_venti").replaceWith($("#venti_global").val());
        $(".res_temp_indor").replaceWith($("#temp_indor").val());
        $(".res_temp_base").replaceWith($("#temp_base").val());
        var resDeperditionMax = precise_round(($("#ubat_global").val() * $("#wastagesurface").val() + $("#livingvolume").val() * $("#venti_global").val()) * ($("#temp_indor").val() - $("#temp_base").val()), 2);
        $(".res_level2").replaceWith(resDeperditionMax);
    }
    $("#resDeperditionMax").replaceWith(precise_round(resDeperditionMax/1000, 2));
}