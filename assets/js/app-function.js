/**
 * Résumé : Affiche le debug en console
 * @param {string}           msg Description : Message à afficher dans le debug
 */
function debug(msg) {
    if (settings.debug) {
        console.log(msg);
    }
}

/**
 * Résumé : Listener pour le changement des class "hashchange"
 */
function hashchangeListener() {
    $(".hashchange").on( "change", function(e) {
        sharingButton(); // Update sharing button
        $(".result").hide(); // Hide résult
        $("#submit_input").val(0); // Remise à 0 du résultat
        // SI c'est la latitude ou la longitude qui ont changé, on recherche la valeur dans l'API
        if (this.name == 'lat' || this.name == 'lng') {
            processChangelngLat();
        }
        hashChange();
    });
}

/**
 * Résumé : Rafraîchie les éléments après un ajout dynamique
 * Description : hash listener, traduction...
 */
function refreshAfterDynamicChange() {
    // Listener hash
    hashchangeListener();
    // Traduction
    $('html').i18n();
}

////////////////////////////
// Expert mode - formulaire
////////////////////////////

/**
 * Résumé : Ajout d'une paroi dans le formulaire
 */
function detailBuildingAddWall() {
    debug('Add une paroi')
    //Récupérer le nombre de paroi pour savoir où nous en sommes
    let wallId=parseFloat($("#wall-id").val())+1;
    debug('Add une paroi : '+wallId)
    $('#addWallButton').before(
        '<tr id="wall-' + wallId + '" class="wall-' + wallId + '">'
            + '<td>'
                + '<input class="debug" type="number" id="wall-' + wallId + '-window-id" name="wall-' + wallId + '-window-id" value="0" />'
                + '<input type="text" class="form-control hashchange wall-perso" name="wall-name[]" id="wall-name-' + wallId + '" value=""  placeholder="Ex: Façade Sud" />'
            + '</td>'
            + '<td>'
                + '<select name="wall-type[]" id="wall-type-' + wallId + '" class="wall-type form-control hashchange">'
                    + '<option value="" selected="selected">-</option>'
                    + '<option value="u" data-i18n="wall-type-u-perso">Valeur U personnalisé</option>'
                    + '<optgroup label="RT2012 Toiture">'
                    + '<option value="5.2">Combles aménageables ou rampants < 60° (H1A, H1B, H1C)</option>'
                    + '<option value="4.5">Combles aménageables ou rampants < 60° (H2A, H2B, H2C, H2D H3>800m)</option>'
                    + '<option value="4">Combles aménageables ou rampants < 60° (H3<800m)</option>'
                    + '<option value="4">Combles perdus</option>'
                    + '<option value="4.5">Toitures-terrasses (H1A, H1B, H1C)</option>'
                    + '<option value="4.3">Toitures-terrasses (H2A, H2B, H2C, H2D H3>800m)</option>'
                    + '<option value="4">Toitures-terrasses (H3<800m)</option>'
                    + '</optgroup>'
                    + '<optgroup label="RT2012 Mur">'
                    + '<option value="3.2">Murs et rampants > 60° (H1A, H1B, H1C)</option>'
                    + '<option value="3.2">Murs et rampants > 60° (H2A, H2B, H2C, H2D H3>800m)</option>'
                    + '<option value="2.2">Murs et rampants > 60° (H3<800m)</option>'
                    + '<option value="3.5">Murs sur volume non chauffé</option>'
                    + '</optgroup>'
                    + '<optgroup label="RT2012 Planchers">'
                    + '<option value="3">Planchers bas donnant sur parking collectif, sur extérieur, vide sanitaire ou volume non chauffé  (H1A, H1B, H1C)</option>'
                    + '<option value="3">Planchers bas donnant sur parking collectif, sur extérieur, vide sanitaire ou volume non chauffé  (H2A, H2B, H2C, H2D H3>800m)</option>'
                    + '<option value="2.1">Planchers bas donnant sur parking collectif, sur extérieur, vide sanitaire ou volume non chauffé  (H3<800m)</option>'
                    + '</optgroup>'
                    + '<optgroup label="RE2020 Mur">'
                    + '<option value="2.9">Mur en contact avec l’extérieur (H1A, H1B, H1C)</option>'
                    + '<option value="2.9">Mur en contact avec l’extérieur (H2A, H2B, H2C, H2D H3>800m)</option>'
                    + '<option value="2.2">Mur en contact avec l’extérieur (H3<800m)</option>'
                    + '<option value="2">Murs sur volume non chauffé</option>'
                    + '</optgroup>'
                    + '<optgroup label="RE2020 Toiture">'
                    + '<option value="4.4">Combles aménagés (isolation dans le rampant sous toiture) (H1A, H1B, H1C)</option>'
                    + '<option value="4,3">Combles aménagés (isolation dans le rampant sous toiture) (H2A, H2B, H2C, H2D H3>800m)</option>'
                    + '<option value="4">Combles aménagés (isolation dans le rampant sous toiture) (H3<800m)</option>'
                    + '<option value="4.8">Combles perdus (isolation sur le plancher des combles)</option>'
                    + '</optgroup>'
                    + '<optgroup label="RE2020 Planchers">'
                    + '<option value="2.7">Planchers bas donnant sur l’extérieur ou sur un local non chauffé (H1A, H1B, H1C)</option>'
                    + '<option value="2.7">Planchers bas donnant sur l’extérieur ou sur un local non chauffé (H2A, H2B, H2C, H2D H3>800m)</option>'
                    + '<option value="2.1">Planchers bas donnant sur l’extérieur ou sur un local non chauffé (H3<800m)</option>'
                    + '</optgroup>'
                + '</select>'
            + '</td>'
            + '<td><input type="number" class="form-control hashchange" min="0" max="1" step="0.01" name="wall-ri[]" id="wall-ri-' + wallId + '" value="0" />'
            + '<td><input type="number" class="form-control hashchange" min="0" max="1" step="0.01" name="wall-ro[]" id="wall-ro-' + wallId + '" value="0" /></td>'
            + '<td><input type="number" class="form-control hashchange" min="0" step="0.1" name="wall-height[]" id="wall-height-' + wallId + '" value="0" /></td>'
            + '<td><input type="number" class="form-control hashchange" min="0" step="0.1" name="wall-width[]" id="wall-width-' + wallId + '" value="0" /></td>'
            + '<td><input type="text" class="form-control" name="wall-r[]" id="wall-r-' + wallId + '" value="0" disabled="disabled" /></td>'
            + '<td>'
                + '<button type="button" class="btn btn-danger delete-button window" onclick="detailBuildingDeleteWall('+wallId+');">'
                    + '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>'
                + '</button>'
            + '</td>'
        + '</tr>'
        + '<tr  class="wall-' + wallId + '">'
            + '<td colspan="8" style="padding: 0; margin: 0">'
                + '<table style="padding: 0; margin: 0" id="wall-' + wallId + '-window" class="table" width="100%">'
                + '<thead>'
                    + '<tr>'
                        + '<th>&rarr;</th>'
                        + '<th colspan="2" data-i18n="[html]thead-window">Vitre</th>'
                        + '<th data-i18n="[html]thead-window-type">Type</th>'
                        + '<th data-i18n="[html]thead-window-height">Hauteur de la vitre (cm)</th>'
                        + '<th data-i18n="[html]thead-window-width">Largeur de la vitre (cm)</th>'
                        + '<th><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></th>'
                    + '</tr>'
                + '</thead>'
                + '<tbody>'
                    + '<tr id="addWindow2Wall-' + wallId + '-button">'
                        + '<th>&rarr;</th>'
                        + '<td colspan="6">'
                            + '<button type="button" class="btn btn-primary add-button window" data-i18n="[html]add-window-button" onclick="detailBuildingAddWindows2Wall(' + wallId + ');">'
                                + '+'
                            + '</button>'
                        + '</td>'
                    + '</tr>'
                + '</tbody>'
              + '</table>'
            + '</td>'
        + '</tr>'
    );
    detailBuildingAddWindows2Wall(wallId);
    $("#wall-id").val(wallId);
}

/**
 * Résumé : Ajout d'une fenêtre dans un mur
 * @param {integer}           wallId Description : Id du mur
 */
function detailBuildingAddWindows2Wall(wallId) {
    // Déterminer le WinId
    debug($('wall-' + wallId + '-window-id'));
    let winId=parseFloat($('#wall-' + wallId + '-window-id').val())+1;
    debug('Add une fenêtre ('+winId+') sur la paroi ' + wallId);
    $('#addWindow2Wall-' + wallId + '-button').before(
        '<tr id="wall-' + wallId + '-window-'+ winId +'">'
            + '<th>&rarr;</th>'
            + '<td colspan="2"><input type="text" class="form-control hashchange wall-perso" name="window-name[]" id="wall-name-' + wallId + '-window-'+ winId +'" value=""  placeholder="Ex: Fenêtre cuisine" /></td>'
            + '<td>'
                + '<select name="window-type[]" id="wall-type-' + wallId + '-window-'+ winId +'" class="form-control hashchange window-type">'
                    + '<option value="" selected="selected">-</option>'
                    + '<option value="5.8">Simple vitrage, Uw=5.8</option>'
                    + '<option value="2.8">Vitrage isolant jusqu\'en 1990, Uw=2.8</option>'
                    + '<option value="1.7">Double vitrage, Uw=1.7</option>'
                    + '<option value="1.5">Double vitrage, Uw=1.5</option>'
                    + '<option value="1.3">Double vitrage, Uw=1.3 (RT2012 Minimum)</option>'
                    + '<option value="1.2">Double vitrage, Uw=1.2</option>'
                    + '<option value="1.1">(Double) triple vitrage, Uw=1.1</option>'
                    + '<option value="1.0">Triple vitrage, Uw=1.0</option>'
                    + '<option value="0.9">Triple vitrage, Uw=0.9</option>'
                    + '<option value="0.85">Triple vitrage, Uw=0.85</option>'
                    + '<option value="0.8">Triple vitrage, Uw=0.8 (RE2020 Minimum)</option>'
                    + '<option value="0.75">Triple vitrage, Uw=0.75</option>'
                    + '<option value="0.7">Triple vitrage, Uw=0.7</option>'
                    + '<option value="0.65">Triple vitrage, Uw=0.65</option>'
                + '</select>'
            + '</td>'
            + '<td><input type="number" class="form-control hashchange" min="0" step="0.1" name="window-height[]" id="wall-height-' + wallId + '-window-'+ winId +'" value="0" /></td>'
            + '<td><input type="number" class="form-control hashchange" min="0" step="0.1" name="window-width[]" id="wall-width-' + wallId + '-window-'+ winId +'" value="0" /></td>'
            + '<td>'
                + '<button type="button" class="btn btn-danger delete-button window" onclick="detailBuildingDeleteWindows2Wall('+wallId+', '+winId+');">'
                    + '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>'
                + '</button>'
            + '</td>'
        + '</tr>'
    );
    $('#wall-' + wallId + '-window-id').val(winId);
}

/**
 * Résumé : Suppression d'une fenêtre
 * @param {integer}           wallId Description : Id du mur
 * @param {integer}           winId Description : Id de la fenêtre
 */
function detailBuildingDeleteWindows2Wall(wallId, winId) {
    debug('Suppression de la fenêtre '+winId+' du mur '+wallId);
    $('#wall-' + wallId + '-window-'+ winId).remove();
}

/**
 * Résumé : Suppression d'un mur
 * @param {integer}           wallId Description : Id du mur
 */
function detailBuildingDeleteWall(wallId) {
    debug('Suppression du mur '+wallId);
    $('.wall-' + wallId).remove();
}

////////////////////////////
// Fonction formulaire
////////////////////////////

/**
 * Résumé : Affiche le mode opendata pour les poêles de masses
 */
function openData() {
    debug('Opendata print');
    $('#opendata').show(); 
    $.each(settings.pdmData, function() {
        var pdmData = this;
        $.each(this.dalyPower, function() {
            $('#opendataTab > tbody:last-child').append(
                '<tr>'
                    +'<td>'+pdmData.name+'</td>'
                    +'<td class="text-center">'+precise_round(this.power/1000,2)+'kW</td>'
                    +'<td class="text-center">'+this.fire+'</td>'
                    +'<td class="text-center">'+this.woodLoad+'kg</td>'
                    +'<td class="text-center">'+this.use+'</td>'
                    +'<td class="text-center">'+pdmData.weight+'kg</td>'
                    +'<td class="text-center"><a href="'+pdmData.link+'">link</a></td>'
                +'<tr>'
            );
        });
    });
}

/**
 * Résumé : Submit / envoi le formulaire (calcul)
 */
function submitForm() {
    debug('Soumission du formulaire');
    //var error
    // Vérification pour calcul
    // Faire apparaître les résultats
    $(".result").show();
    // En mode transparent on affiche le calcul direct
    if ($("#transparent").prop("checked")) {
        $(".calcul_level"+$("#level").val()).show();
    }
    document.getElementById("result").scrollIntoView();
    $("#submit_input").val(1);
    hashChange();
    // Méthode G, niveau 1
    if ($("#level").val() == 1) {
        // Pour la méthode de calcul
        debug('Level 1');
        $(".res_temp_indor").html($("#temp_indor").val());
        $(".res_temp_base").html($("#temp_base").val());
        $(".res_volume").html($("#livingvolume").val());
        $(".res_g").html($("#g").val());
        var resDeperditionMax = precise_round(( $("#temp_indor").val() - $("#temp_base").val() ) * $("#livingvolume").val() * $("#g").val(), 2);
        $(".res_level1").html(resDeperditionMax);
    } else if ($("#level").val() == 2) {
        // Pour la méthode de calcul
        debug('Level 2');
        $(".res_ubat").html($("#ubat_global").val());
        $(".res_ws").html($("#wastagesurface").val());
        $(".res_volume").html($("#livingvolume").val());
        $(".res_venti").html($("#venti_global").val());
        $(".res_temp_indor").html($("#temp_indor").val());
        $(".res_temp_base").html($("#temp_base").val());
        var resDeperditionMax = precise_round(($("#ubat_global").val() * $("#wastagesurface").val() + $("#livingvolume").val() * $("#venti_global").val()) * ($("#temp_indor").val() - $("#temp_base").val()), 2);
        $(".res_level2").html(resDeperditionMax);
    }
    $("#resDeperditionMax").html(precise_round(resDeperditionMax/1000, 2));
    $("#resDeperdition").val(resDeperditionMax);
    debug("Besoin de chauffage : " + resDeperditionMax + "Wh");
    suggestion();
}


/**
 * Résumé : Récupère la température de base par API en fonction de la latitude et la longitude
 */
function getBaseTemperature(){
    if ($("#lat").val() != '' && $("#lng").val() != '') {
        debug('GET API baseTemperature');
        $.getJSON( settings.apiBaseTemperature+'?lat='+$("#lat").val()+'&lng='+$("#lng").val()+'&nbYearsArchive='+$("#temp_base_years_archive").val()) 
        .done(function( json ) {
            $("#temp_base").val(json.base);
            hashChange();
        })
        .fail(function( jqxhr, textStatus, error ) {
            $("#alert").show();
            $("#alert").html( "<span>Request Failed to get API base temperature : " + jqxhr.responseJSON.message + ". <b>Indicate there manually and contact the developer of this calculator</b></span>");
            debug("API return : " + error);
            $(".temp_base_input_group").show();
            $("#temp_base").prop('disabled', false);
            $("#temp_base_auto").prop("checked", false);
            $(".temp_base_auto").hide();
        })
        .always(function() {
            $('#temp_base_load').hide();
        });
    } else {
        debug('Pas de GET API baseTemperature, il manque la latitude ou la longitude')
        $('#temp_base_load').hide();
    }
}
const processChangelngLat = debounce(() => getBaseTemperature(), settings.apiDebounceTtimeout);

/**
 * Résumé : Changement de niveau 
 */
function changeLevel(level) {
    if (level == 1) {
        $(".level3").hide();
        $(".level2").hide();
        $(".level1").show();
        $("input").removeAttr("required");
        $(".level1required").attr("required", "true");
    } else if (level == 2) {
        $(".level3").hide();
        $(".level1").hide();
        $(".level2").show();
        $("input").removeAttr("required");
        $(".level2required").attr("required", "true");
    } else if (level == 3) {
        $(".level1").hide();
        $(".level2").hide();
        $(".level3").show();
        $("input").removeAttr("required");
        $(".level3required").attr("required", "true");
    }
    // required input change    
}

/**
 * Résumé : Calcule du volume fonction de la surface/hauteur
 */
function calcVolume (){
    $("#livingvolume").val($("#livingspace").val() * $("#livingheight").val());
}


////////////////////////////
// Fonction global
////////////////////////////
/**
 * Résumé : Renvoi un arrondie
 * Source : https://www.w3resource.com/javascript-exercises/javascript-math-exercise-14.php
 * @param {integer}           n Description : Donnée à arrondir
 * @param {integer}           r Description : Précision (nombre de chiffre après la vircule)
 */
function precise_round(n, r) {
    let int = Math.floor(n).toString()
    if (typeof n !== 'number' || typeof r !== 'number') return 'Not a Number'
    if (int[0] == '-' || int[0] == '+') int = int.slice(int[1], int.length)
    return n.toPrecision(int.length + r)
}
/**
 * Résumé : Changer l'URL (hash) en fonction de la classe "hashchange"
 */
function hashChange() {
    var hashnew = '';
    var hashchange_len = $('.hashchange').length;
    var hashchange_nb = 0
    $(".hashchange").each(function() {
        //debug(this.id);
        //this.type
        //debug(this);
        if (this.type == "checkbox") { 
            if (this.checked == true) {
                hashnew=hashnew+this.id+'='+this.checked;
            } else {
                hashnew=hashnew+this.id+'=';
            }
        } else {
            hashnew=hashnew+this.id+'='+this.value;
        }
        if (hashchange_nb != (hashchange_len - 1)) {
            hashnew=hashnew+"&";
        }
        hashchange_nb = hashchange_nb +1
    });
    window.location.hash = hashnew;
}

/**
 * Résumé : Fonction anti-rebond
 * Source : https://www.freecodecamp.org/french/news/anti-rebond-comment-retarder-une-fonction-en-javascript/ 
 * @param {string}           func Description : Fonction à mettre en attente de rebond
 * @param {integer}           timeout Description : Temps de timeout
 */
function debounce(func, timeout = 1000){
    let timer;
    return (...args) => {
        $('#temp_base_load').show();
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

/**
 * Résumé : Modifie les href des boutons de partages
 */
function sharingButton() {
    const title =  encodeURIComponent($("title").text());
    const url = encodeURIComponent(document.location.href);

    Object.entries(settings.sharingButton).forEach(entry => {
        var [network, href] = entry;
        // Remplacement des variables
        href = href.replace('__TITLE__', title);
        href = href.replace('__URL__', url);
        // Attribution du href
        $("#sharingButton, ." + network).attr('href', href);
        $("#sharingButton, ." + network).css('display', 'inline-block');

        debug('Add sharingButton for ' + network + ' = ' + href);
    });
}
