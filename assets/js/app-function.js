/*
 * Global 
 */
// Tiny URL
let shortLink = true;
if (settings.apiLink == undefined || settings.apiLink == '') {
    debug('[link] short link disable');
    shortLink = false;
    $('#tinyUrlBtn').hide();
}

const CURRENT_STUDY_STATE_KEY = 'currentStudyState';

function getCurrentStudyState() {
    if (typeof sessionStorage === 'undefined') {
        return null;
    }
    try {
        const raw = sessionStorage.getItem(CURRENT_STUDY_STATE_KEY);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
            return parsed;
        }
    } catch (error) {
        debug('Unable to parse current study state');
    }
    sessionStorage.removeItem(CURRENT_STUDY_STATE_KEY);
    return null;
}

function getCurrentStudyName() {
    const state = getCurrentStudyState();
    const currentHash = window.location.hash.slice(1);
    if (!state || !state.name) {
        return '';
    }
    if (!currentHash && state.hash) {
        return '';
    }
    return state.name;
}

function setCurrentStudyState(name, hash = '', extra = {}) {
    if (typeof sessionStorage === 'undefined') {
        return;
    }
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (!trimmedName) {
        clearCurrentStudyState();
        return;
    }
    const payload = Object.assign({}, extra, {
        name: trimmedName,
        hash: typeof hash === 'string' ? hash : String(hash || ''),
        timestamp: Date.now()
    });
    sessionStorage.setItem(CURRENT_STUDY_STATE_KEY, JSON.stringify(payload));
}

function updateCurrentStudyHash(hash) {
    if (typeof sessionStorage === 'undefined') {
        return;
    }
    const state = getCurrentStudyState();
    if (!state || !state.name) {
        return;
    }
    state.hash = typeof hash === 'string' ? hash : String(hash || '');
    state.timestamp = Date.now();
    sessionStorage.setItem(CURRENT_STUDY_STATE_KEY, JSON.stringify(state));
}

function clearCurrentStudyState() {
    if (typeof sessionStorage === 'undefined') {
        return;
    }
    sessionStorage.removeItem(CURRENT_STUDY_STATE_KEY);
}

/**
 * Résumé : Affiche le debug en console
 * @param {string}           msg Description : Message à afficher dans le debug
 */
function debug(msg) {
    if (settings.debug) {
        console.log(msg);
    }
}

function getFunctionalStorageItem(key) {
    if (window.PrivacyConsent && typeof window.PrivacyConsent.getFunctionalItem === 'function') {
        return window.PrivacyConsent.getFunctionalItem(key);
    }
    try {
        return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (error) {
        return null;
    }
}

function setFunctionalStorageItem(key, value) {
    if (window.PrivacyConsent && typeof window.PrivacyConsent.setFunctionalItem === 'function') {
        window.PrivacyConsent.setFunctionalItem(key, value);
        return;
    }
    if (window.localStorage) {
        try {
            window.localStorage.setItem(key, value);
        } catch (error) {
            // ignore storage failure
        }
    }
}

function removeFunctionalStorageItem(key) {
    if (window.PrivacyConsent && typeof window.PrivacyConsent.removeFunctionalItem === 'function') {
        window.PrivacyConsent.removeFunctionalItem(key);
        return;
    }
    if (window.localStorage) {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            // ignore remove failure
        }
    }
}

/**
 * Résumé : Sélection une option par son text
 * @param {string}           selectId ID du select
 * @param {string}           optionText Option à sélectionné
 */
function selectOptionByText(selectId, optionText) {
    // Utiliser jQuery pour sélectionner l'élément <select> par son ID
    var $select = $('#' + selectId);
    
    // Trouver l'option en fonction du texte
    var $option = $select.find('option').filter(function() {
        return $(this).text() === optionText;
    });
    
    // Si l'option est trouvée, la sélectionner
    if ($option.length > 0) {
        $select.val($option.val());
    } else {
        console.log("Option non trouvée : " + optionText);
    }
}

/* Résumé : Génère une text propore, sans caractère spécial */
function sanitizeUrlString(input) {
    return input
        .normalize("NFD") // Décompose les accents
        .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
        .replace(/\s+/g, "-") // Remplace les espaces par des tirets
        .replace(/[^a-zA-Z0-9_-]/g, "") // Supprime tout sauf lettres, chiffres, _ et -
        .replace(/-+/g, "-"); // Évite les tirets consécutifs
}

/**
 * Résumé : Affiche une alert
 * @param {string}           msg Description : Message à afficher 
 * @param {string}           type Description: class à appliquer (alert-) warning par défaut (sinon : danger, success)
 */
function appAlert(msg, type = 'warning', time = 3) {
    debug('appAlert('+msg+', '+type+')');
    $('#app-alert').addClass('alert-'+type);
    $('#app-alert').html(msg);
    $('#app-alert').show();
    setTimeout(() => {
        $('#app-alert').hide();
        $('#app-alert').removeClass('alert-'+type);
    }, time*1000);
}

const POWER_UNIT_SYSTEMS = {
    metric: {
        power: {
            unit: 'kW',
            convert: function (watts) {
                return precise_round(watts / 1000, 2);
            }
        }
    },
    imperial: {
        power: {
            unit: 'BTU/hr',
            convert: function (watts) {
                return precise_round(watts * 3.412141633, 0);
            }
        }
    }
};

function getUnitSystem() {
    const value = $('#unit_system').val();
    if (value && Object.prototype.hasOwnProperty.call(POWER_UNIT_SYSTEMS, value)) {
        return value;
    }
    return 'metric';
}

function getPowerDisplay(watts) {
    const system = POWER_UNIT_SYSTEMS[getUnitSystem()] || POWER_UNIT_SYSTEMS.metric;
    const value = system.power.convert(watts);
    return {
        value: value,
        unit: system.power.unit,
        text: value + '\u00A0' + system.power.unit
    };
}

function formatPowerText(watts) {
    return getPowerDisplay(watts).text;
}

function refreshPowerValues(scope = null) {
    let $targets;
    if (scope) {
        const $scope = $(scope);
        $targets = $scope.filter('.power-value').add($scope.find('.power-value'));
    } else {
        $targets = $('.power-value');
    }
    $targets.each(function() {
        const watts = parseFloat($(this).attr('data-power-watts'));
        if (!isNaN(watts)) {
            $(this).text(formatPowerText(watts));
        }
    });
}

/**
 * Résumé : Listener pour le changement des class "hashchange"
 */
/*function hashchangeListener() {
    debug('hashchangeListener');
    $(".hashchange").unbind(); 
    $(".hashchange").on( "change", 'input', function(e) {
        hashchangeAllAction();
    });
}*/
function hashchangeListener() {
    //$(".hashchange").unbind(); 
    $(".hashchange:not(.hashchange-bond)").addClass('hashchange-bond')
    .on( "change", function(e) {
        hashchangeAllAction(this);
    });
}

function hashchangeAllAction(element) {
    debug('hashchangeAllAction');
    const isUnitChange = element !== undefined && element.id === 'unit_system';
    if (!isUnitChange) {
        $(".result").hide(); // Hide résult
        $("#submit_input").val(0); // Remise à 0 du résultat
    }
    // SI c'est la latitude ou la longitude qui ont changé, on recherche la valeur dans l'API
    if (element != undefined && (element.name == 'lat' || element.name == 'lng')) {
        processChangelngLat();
    }
    hashChange();
    if (isUnitChange) {
        refreshPowerValues();
    }
    sharingButton(); // Update sharing button
}

/**
 * Résumé : Appelé par la figure (image)
 * Description : Remplie le formulaire 
 */
function rsirse(rsi, rse) {
    debug("RSI : "+rsi+" / RSE : "+rse);
    wallId=$('#wall-id-for-rsirse').val();
    $('#wall-rsi-' + wallId ).val(rsi);
    $('#wall-rsi-' + wallId + '-val').html(rsi);
    $('#wall-rse-' + wallId ).val(rse);
    $('#wall-rse-' + wallId + '-val').html(rse);
    $( "#dialog-rsirse" ).dialog( "close" );
    hashchangeAllAction();
    wallCheck(wallId);
}

/**
 * Résumé : Valide le formulaire par mur
 */
function wallCheck(wallId) {
    debug("Wall check");
    if (
        $('#wall-type-' + wallId).val() == ''
        || $('#wall-rsi-' + wallId).val() == ''
        || $('#wall-rse-' + wallId).val() == ''
        || $('#wall-surface-' + wallId).val() == 0 ||  $('#wall-surface-' + wallId).val() == ''
        || $('#wall-r-' + wallId).val() == 0 || $('#wall-r-' + wallId).val() == ''
        ) {
        $('.wall-check-' + wallId).addClass('bg-danger-subtle');
        $('.wall-check-' + wallId).removeClass('bg-success-subtle');
        $('#wall-' + wallId + '-check-svg').hide();
        $('#wall-' + wallId + '-nocheck-svg').show();
        $('#wall-check-' + wallId).val(0);
    } else {
        $('.wall-check-' + wallId).removeClass('bg-danger-subtle');
        $('.wall-check-' + wallId).addClass('bg-success-subtle');
        $('#wall-' + wallId + '-check-svg').show();
        $('#wall-' + wallId + '-nocheck-svg').hide();
        $('#wall-check-' + wallId).val(1);
    }
}
/**
 * Résumé : Valide le formulaire par fenêtre
 */
function winCheck(wallId, winId) {
    if (
        $('#wall-type-' + wallId + '-window-'+ winId).val() == ''
        || $('#wall-surface-' + wallId + '-window-'+ winId).val() == 0 ||  $('#wall-surface-' + wallId + '-window-'+ winId).val() == ''
        ) {
        debug("window Ko");
        $('.window-check-' + wallId + '-' +winId).removeClass('bg-success-subtle');
        $('.window-check-' + wallId+'-'+winId).addClass('bg-danger-subtle');
        $('#wall-' + wallId + '-window-'+ winId +'-check-svg').hide();
        $('#wall-' + wallId + '-window-'+ winId +'-nocheck-svg').show();
        $('#wall-check-' + wallId+'-'+winId).val(0);
    } else {
        debug("window Ok");
        $('.window-check-' + wallId+'-'+winId).addClass('bg-success-subtle');
        $('.window-check-' + wallId+'-'+winId).removeClass('bg-danger-subtle');
        $('#wall-' + wallId + '-window-'+ winId +'-check-svg').show();
        $('#wall-' + wallId + '-window-'+ winId +'-nocheck-svg').hide();
        $('#wall-check-' + wallId+'-'+winId).val(1);
    }
}

/**
 * Résumé : Vérifie si le U est demandé "personnalisé" alors active le input
 * @param {integer}           wallId Description : Id du mur
 */
function wallTypeUperso(wallId){
    debug('wallTypeUperso : '+wallId);
    if ($("#wall-type-"+wallId).val() == 'u') {
        $("#wall-r-" + wallId).prop('disabled', false);
    } else {
        $("#wall-r-" + wallId).val(getOptionValue($("#wall-type-" + wallId).val()));
        $("#wall-r-" + wallId).prop('disabled', true);
    }
    hashchangeAllAction();
}

/**
 * Résumé : Popup ajout d'une paroi personalisée
 */
function getMateriauxData() {
    if (apiMateriauxData == null) {
        debug('Get materiaux data');
        $.ajax({
            url: settings.apiMateriaux+'?lang='+$.i18n().locale+'&spec=lambda',
            async: false,
            dataType: 'json',
            success: function(data) {
                apiMateriauxData = data;
            },
            error: function() {
                alert("Une erreur à la récupération des matériaux, contactez le développeur du projet.")
            }
        });
    }
}
/**
 * Résumé : Complète le sélect des matériaux pour les paroi personnalisés paroi 
 */
function wallTypeSelect(wallId) {
    debug("wallTypeSelect "+wallId);
    //Ajouter les custom-wall dans "wall-type" 
    $('#wall-type-'+wallId).empty();
    var fullOptions = [
        {
            "id": "",
            "text": "-"
        } 
    ] ;
    var customWall = [ { "id": "new", "text": 'Créer une paroi personnalisée' } ] ;
    $.each(localSetting.wall, function(index, data) {
        customWall = customWall.concat([ { "id": genOptionValue(data.idu, data.r), "text": data.title } ] )
    });
    const customWallWithCat = [ 
        {
            "text": "Vos parois",
            "children":  customWall
        },
        {
            "id": "u",
            "text": "Valeur R personnalisée"
        }
    ];
    fullOptions = fullOptions.concat(customWallWithCat);
    fullOptions = fullOptions.concat(settings.wallType);
    $('#wall-type-'+wallId).select2({
        data : fullOptions
    });
    $('#wall-type-' + wallId).trigger('change');
}

/**
 * Résumé : Rafraichir toutes les paroi personnalisés
 */
function wallTypeAllSelect() {
    debug('wallTypeAllSelect');
    $.each($('tr.walls'), function(index, tr) {
        var wallId = tr.id.split('-')[1];
        var valBeforClean = $('#wall-type-'+wallId).val();
        wallTypeSelect(wallId);
        if ($('#wall-type-'+wallId).val() != valBeforClean) {
            $('#wall-type-'+wallId).val(valBeforClean);
        }
        $('#wall-type-' + wallId).trigger('change');
    });
}

/**
 * Résumé : Complète le sélect des matériaux pour l'ajout/modification paroi
 */
function layerTypeSelect(layerId) {
    debug('layerTypeSelect' + layerId);
    //Option vide
    if ($('#layer-type-' + layerId + '-clean').length == 0) {
        $('#layer-type-' + layerId).append('<option class="type-clean" id="layer-type-' + layerId + '-clean" value="">-</option>');
    }
    //  Maatériaux personalisé
    if ($('#layer-type-' + layerId + '-cath-0').length == 0) {
        $('#layer-type-' + layerId).append('<optgroup class="type-cath-0 new-layer" id="layer-type-' + layerId + '-cath-0" label="Vos matériaux"></optgroup>'); 
    }
    $.each(localSetting.material, function(index, data) {
        if ($('#layer-type-' + layerId + '-cath-0-'+index).length == 0) {
            $('#layer-type-' + layerId + '-cath-0').append('<option class="custom-layer" id="layer-type-' + layerId + '-cath-0-'+index+'" value="'+genOptionValue(data.idu, data.spec.lambda)+'">'+data.libelle+'</option>'); 
            debug(data.libelle);
        }
    });
    /*$.each(localSetting.material, function(index, data) {
        if ($('#layer-type-' + layerId + '-cath-0').length == 0) {
            $('#').append('<option id="" value="'+data.spec.lambda+'">'+data.libelle+'</option>'); 
        }
    });*/
    //Remplir avec les autres : 
    $.each(apiMateriauxData, function(index, data) {
        // Catégorie
        if ($('#layer-type-' + layerId + '-cath-'+data.cath_id).length == 0) {
            $('#layer-type-' + layerId).append('<optgroup class="type-cath-'+data.cath_id+'" id="layer-type-' + layerId + '-cath-'+data.cath_id+'" label="'+data.cath+'"></optgroup>'); 
        }
        // Matériaux
        if ($('#layer-type-' + layerId + '-'+index).length == 0) {
            $('#layer-type-' + layerId + '-cath-'+data.cath_id).append('<option class="type-'+index+' material-generic-'+data.generic+'" id="layer-type-' + layerId + '-'+index+'" value="'+genOptionValue(data.id, data.spec.lambda)+'">'+data.libelle+'</option>'); 
        }
    });
}


/**
 * Résumé : Complète le sélect des paroi personnalisé
 */
function customWallSelect() {
    debug('customWallSelect');
    $('#custom-wall').empty();
    //Option vide
    $('#custom-wall').append('<option class="type-clean" id="custom-wall-clean" value="">-</option>');
    //Remplir avec les autres : 
    $.each(localSetting.wall, function(index, data) {
        $('#custom-wall').append('<option class="custom-wall" value="'+index+'">'+data.title+'</option>'); 
    });
}
/**
 * Résumé : Complète le sélect des matériaux personnalisé
 */
function customMaterialSelect() {
    debug('customMaterialSelect');
    $('#custom-material').empty();
    //Option vide
    $('#custom-material').append('<option class="type-clean" id="custom-material-clean" value="">-</option>');
    //Remplir avec les autres : 
    $.each(localSetting.material, function(index, data) {
        $('#custom-material').append('<option class="custom-material" value="'+index+'">'+data.libelle+'</option>'); 
    });
}
/**
 * Résumé : Complète le sélect des catégories de matériaux pour l'ajout/modification de matériaux
 */
function materialCathSelect() {
    debug('materialCathSelect');
    if ($('#material-cath_id-clean').length == 0) {
        $('#material-cath_id').append('<option class="clean" id="material-cath_id-clean" value="">-</option>');
    }
    $.each(apiMateriauxData, function(index, data) {
        if ($('#material-cath_id-'+data.cath_id).length == 0) {
            $('#material-cath_id').append('<option id="material-cath_id-'+data.cath_id+'" value="'+data.cath_id+'">'+data.cath+'</option>'); 
        }
    });
}

/**
 * Résumé : Envoyé un formulaire de contact en ajax
 * @param {string}           from Description : Email from
 * @param {string}           subject Description : Email subject
 * @param {string}           body Description : Email body
 */
function sendContact(from, subject, body) {
    debug('sendContact');
    return $.ajax({
        url: settings.apiContact+'?from='+from+'&subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body),
        type: 'GET',
        async: false,
        cache: false,
        timeout: 30000
    });
}

/**
 * Résumé : Enregistre le matériaux personnalisé (ajout ou modification)
 */
function validCustomWall() {
    if ($('#layer-r-total').html() == 0) {
        return "Le R global ne peut pas être à 0";
    }
    if ($('#wall-custom-title').val() == '') {
        return "Renseigner au moins un titre";
    }    
    var newWall = {
        title: $('#wall-custom-title').val(),
        r: $('#layer-r-total').html(),
        layer: [],
    };
    $.each($('tr.layers'), function(index, tr) {
        var layerId = tr.id.split('-')[1];
        var newLayerl = {
            idu: $('#layer-idu-'+layerId).val(),
            material: $('#layer-type-'+layerId+' option:selected').text(),
            lambda: $('#layer-lambda-'+layerId).val(),
            size: $('#layer-size-'+layerId).val(),
        };
        newWall.layer.push(newLayerl);        
    });
    // C'est un ajout
    if ($('#custom-wall').val() == '') {
        debug('Ajout d\'une paroi ');
        newWall.idu = genId();
        localSetting.wall.push(newWall);
    // Sinon c'est une modification
    } else {
        debug('Modification d\'une paroi ');
        const idu = localSetting.wall[$('#custom-wall').val()].idu
        newWall.idu = idu;
        localSetting.wall[$('#custom-wall').val()] = newWall;
        // Mise à jour des wall (paroi) du bâtiment si modification d'une paroi personnalisé
        $('.wall-type').each(function() {
            if (getOptionIdu($( this ).val()) == idu) {
                const id = this.id.split('-')[2];
                var data = {
                    id: genOptionValue(idu, newWall.r),
                    text: $('#wall-custom-title').val()+' (update)'
                };
                // On créer la nouvelle seulement si nessécaire
                if (! $( this ).find("option[value='" + data.id + "']").length) {
                    var newOption = new Option(data.text, data.id, false, false);
                    $(this).prepend(newOption).trigger('change');
                    //$( '#wall-type-'+id+' .type-cath-custom' ).append(newOption).trigger('change');
                }
                // Positionner sur la nouvel valeur
                $( this ).val(data.id).trigger('change');
            }
        });
    }
    setFunctionalStorageItem('setting', JSON.stringify(localSetting));
    customWallSelect();
    wallTypeAllSelect();
    return true;
}
/**
 * Résumé : Enregistre le matériaux personnalisé (ajout ou modification)
 */
function validCustomMaterial() {
    if ($('#material-libelle').val() == 0 || $('#material-lambda').val() == 0) {
        return "Il faut aus moins le libelle et le lambda du matériaux";
    }
    var newmaterial = {
        libelle: $('#material-libelle').val(),
        generic: $('#material-generic').val(),
        cath_id: $('#material-cath_id').val(),
        spec: { 
            lambda: $('#material-lambda').val(),
            p: $('#material-p').val(),
            c: $('#material-c').val(),
            u: $('#material-u').val(),
            h: $('#material-h').val()
        },
        src: { 
            name: $('#material-src-name').val(),
            link: $('#material-src-link').val(),
            contrib: $('#material-src-contrib').val(),
        },
    };
    // C'est un ajout
    if ($('#custom-material').val() == '') {
        newmaterial.idu = genId();
        localSetting.material.push(newmaterial);
    // Sinon c'est une modification
    } else {
        newmaterial.idu = localSetting.material[$('#custom-material').val()].idu;
        localSetting.material[$('#custom-material').val()] = newmaterial;
    }
    setFunctionalStorageItem('setting', JSON.stringify(localSetting));
    customMaterialSelect();
    // Send
    if ($('#material-forcontrib').prop('checked')) {
        var body = 'Contribution public : ' + $('#material-forcontrib').prop('checked') + '<br />'
            + 'Libelle : ' + $('#material-libelle').val() + '<br />' 
            + 'Generic : ' + $('#material-generic').val() + '<br />' 
            + 'Cathégorie :  ' + $('#material-cath_id').val() + '<br />' 
            + 'Spec : <br />' 
            + ' - Lambda : ' + $('#material-lambda').val() + '<br />' 
            + ' - p : ' + $('#material-p').val() + '<br />' 
            + ' - c : ' + $('#material-c').val() + '<br />' 
            + ' - u : ' + $('#material-u').val() + '<br />' 
            + ' - h : ' + $('#material-h').val() + '<br />' 
            + 'Source : <br />' 
            + ' - src-name : ' + $('#material-src-name').val() + '<br />' 
            + ' - src-link : ' + $('#material-src-link').val() + '<br />' 
            + ' - src-contrib : ' + $('#material-src-contrib').val() + '<br />' 
            + ' - src-contrib-email : ' + $('#material-src-contrib-email').val() + '<br />' 
            + 'Commentaire : ' + $('#material-comment').val() + '<br />' 
            + '<br />' 
            + 'INSERT INTO `materiaux` (`id`, `status`, `libelle`, `cath_id`, `generique`, `lambda`, `p`, `c`, `u`, `h`, `source_libelle`, `source_link`, `contrib`, `lastupdate`) VALUES (NULL, "5", "'+ $('#material-libelle').val() + '","'+$('#material-cath_id').val()+'","'+$('#material-generic').val()+'","'+$('#material-lambda').val()+'","'+$('#material-p').val()+'","'+$('#material-c').val()+'","'+$('#material-u').val()+'","'+$('#material-h').val()+'","'+$('#material-src-name').val()+'","'+$('#material-src-link').val()+'","'+$('#material-src-contrib').val()+'", current_timestamp());'
            + '<br />' 
            + 'https://phpmyadmin.retzo.net/index.php?route=/sql&db=choisirpdm&table=materiaux'
            + '<br />' 
            + 'rm /var/www/choisir.poeledemasse.org/web/api/materiaux/cache/cache_*';
        sendContact('noreply@poeledemasse.org', 'Contribution matériaux', body);
    }
    return true;
}
/**
 * Résumé : Action au changement de layer
 */
function layerCheck(layerId) {
    debug('layerCheck '+layerId);
    const lambda = getOptionValue($('#layer-type-'+layerId).val());
    const idu = getOptionIdu($('#layer-type-'+layerId).val());
    // Ajout idu
    $('#layer-idu-'+layerId).val(idu);
    // Ajout du Lambda
    $('#layer-lambda-'+layerId).val(lambda);
    // Calcul du R
    $('#layer-r-'+layerId).val(precise_round($('#layer-size-'+layerId).val()/100/lambda,1));
    // Calcul Total size
    var layerSizeTotal = 0;
    $('.layer-size').each(function() {
        if ($( this ).val() != '') {
            layerSizeTotal=parseFloat(layerSizeTotal)+parseFloat($( this ).val())   ;
        }
    });
    $('#layer-size-total').html(precise_round(layerSizeTotal, 0));
    // Calcul Total r
    var layerRTotal = 0;
    $('.layer-r').each(function() {
        if ($( this ).val() != '') {
            layerRTotal=parseFloat(layerRTotal)+parseFloat($( this ).val());
        }
    });
    $('#layer-r-total').html(precise_round(layerRTotal, 2));
}

/**
 * Résumé : Rafraîchie les éléments de la boîte de dialogue paroi
 * Description : hash listener, traduction...
 */
function refreshLayerDialogChange() {
    $( ".layer-check:not(.layer-check-bond)" ).addClass('layer-check-bond')
    .on( "change", function() {
        layerId = this.id.split('-')[1];
        debug('layerId find : '+layerId);
        layerCheck(layerId);
    });
    // Listener hash
    hashchangeListener();
    // Traduction
    applyTranslations();
}

/**
 * Résumé : Rafraîchie les éléments après un ajout dynamique
 * Description : hash listener, traduction...
 */
function refreshDetailBuildingChange() {
    debug('Refresh detailBuilding Change');

    // Gestion rsi-rse popup
    $( ".wall-rsi-rse-popup:not(.wall-rsi-rse-popup-bond)" ).addClass('wall-rsi-rse-popup-bond')
    .on( "click", function() {
        wallId = $(this).find('input')[0].id.split('-')[2];
        debug("Click open dialog rsirse for wall "+wallId);
        $( "#wall-id-for-rsirse" ).val(wallId);
        // Aficher le popup
        var wWidth = $(window).width();
        var dWidth = wWidth * 0.5;
        var wHeight = $(window).height();
        var dHeight = wHeight * 1;
        dialog = $( "#dialog-rsirse" ).dialog({
            width: dWidth,
            height: dHeight,
            modal: true,
            open: function() {
                $('.ui-dialog-buttonpane').find('button:contains("Cancel")').addClass('btn btn-secondary');
                $('.ui-dialog-buttonpane').find('button:contains("Valider")').addClass('btn btn-primary');
            }
          });
    });
    // Gestion bridge popup
    $( ".wall-bridge-popup:not(.wall-bridge-popup-bond)" ).addClass('wall-bridge-popup-bond')
    .on( "click", function() {
        $('#bridgeForms').empty();
        currentIndex = 0;
        wallId = $(this).find('input')[0].id.split('-')[2];
        debug("Click open dialog bridge for wall "+wallId);
        $( "#wall-id-for-bridge" ).val(wallId);
        // Initialisation avec les données de l'URL
        let wallValue = $("#wall-bridge-" + wallId).val();
        if (wallValue) {
            try {
                bridges = JSON.parse(wallValue);
            } catch (e) {
                console.error("Erreur lors du parsing JSON :", e);
                bridges = []; // En cas d'erreur de parsing, définir comme un tableau vide
            }
        } else {
            bridges = []; // Si la valeur est vide, définir comme un tableau vide
        }
        if (bridges.length === 0) {
            bridges.push({ name: "", type: "", length: "0" });
        }
        bridges.forEach((bridge, index) => addBridgeForm(index, bridge));
        showBridgeForm(0);
        bridgeFormChamge();
        bridgeUpdateSvg();
        bridgeCalc();
        // Aficher le popup
        var wWidth = $(window).width();
        var dWidth = wWidth * 0.7;
        var wHeight = $(window).height();
        var dHeight = wHeight * 1;
        dialog = $( "#dialog-bridge" ).dialog({
            width: dWidth,
            height: dHeight,
            modal: true
        });
    });
    $(".wall-type:not(.wall-type-bond)").addClass('wall-type-bond')
    .on( "change", function(e) {
        wallId = this.id.split('-')[2];
        // On peut ici, indiquer que c'est un nouveau
        if (this.value == 'new') {
            $( "#add-custom-wall-in-type-select").val(wallId);
            $( "#add-custom-wall").click();
            this.value = '';
        }  else {
            debug('pre wallTypeUperso : ' + wallId);
        }
        wallTypeUperso(wallId);
    });
    $( ".wall-check:not(.wall-check-bond)" ).addClass('wall-check-bond')
    .on( "change", function() {
        wallId = this.id.split('-')[1];
        //debug('wallId find : '+wallId);
        wallCheck(wallId);
    });


    $( ".window-check:not(.window-check-bond)" ).addClass('window-check-bond')
    .on( "change", function() {
        debug("winCheck");
        wallId = this.id.split('-')[1];
        winId = this.id.split('-')[3];
        winCheck(wallId, winId);
    });

    // Listener hash
    hashchangeListener();

    // Traduction
    applyTranslations();
}

////////////////////////////
// Expert mode - formulaire
////////////////////////////

/**
 * Résumé : Ajout d'une paroi dans le formulaire
 */
function detailBuildingAddWall(id = null) {
    //Récupérer le nombre de paroi pour savoir où nous en sommes
    let wallId=parseFloat($("#wall-id").val())+1;
    //S'il est passé en paramètre c'est que ça vient du hash, on l'ajoute s'en se poser de question
    if (id != null) {
        wallId=id;
    }
    debug('Ajout une paroi : '+wallId)

    // Check if existe...
    if ($("#wall-" + wallId).length != 0) {
        debug('La paroi avec l\'ID '+wallId+' existe déjà...')
        return true;
    }

    $('#addWallButton').before(
        + '<tbody class="wall-sortable">'
        + '<tr id="wall-' + wallId + '" class="wall-' + wallId + ' walls wall-check">'
            + '<td class="align-middle text-center wall-check-' + wallId + '">'
                + '<input class="debug" type="hidden" id="wall-check-' + wallId + '" name="wall-check" value="0" />'
                + '<svg style="display: none;" id="wall-' + wallId + '-check-svg" xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path class="bg-primary-subtle border-primary-subtle " d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
                + '<svg data-toggle="tooltip" title="Il manque des informations pour calculer cette paroi" style="display: none;" id="wall-' + wallId + '-nocheck-svg"  xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path class="bg-danger-subtle border-danger-subtle" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>'
            + '</td>'
            + '<td>'
                + '<input class="debug" type="hidden" id="wall-' + wallId + '-window-id" name="wall-' + wallId + '-window-id" value="0" />'
                + '<input type="text" class="form-control hashchange wall-perso" name="wall-name[]" id="wall-name-' + wallId + '" value=""  placeholder="Ex: Façade Sud" />'
            + '</td>'
            + '<td>'
                + '<select name="wall-type[]" id="wall-type-' + wallId + '" style="width: 100%;" class="wall-type form-select form-control hashchange">'
                + '</select>'
            + '</td>'
            + '<td class="align-middle text-center wall-rsi-rse-popup text-center">'
                +'<input type="hidden" class="form-control hashchange" name="wall-rsi[]" id="wall-rsi-' + wallId + '" />'
                +'<span id="wall-rsi-' + wallId + '-val" class="wall-rse-val">'
                    + '<button data-toggle="tooltip" title="Clique ici pour définir un RSI" type="button" class="btn btn-primary btn-icon">'
                        + '<svg  id="wall-rsi-' + wallId + '-chose" class="wall-rse-chose" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">'
                            + '<path d="M160 64c0-8.8 7.2-16 16-16s16 7.2 16 16V200c0 10.3 6.6 19.5 16.4 22.8s20.6-.1 26.8-8.3c3-3.9 7.6-6.4 12.8-6.4c8.8 0 16 7.2 16 16c0 10.3 6.6 19.5 16.4 22.8s20.6-.1 26.8-8.3c3-3.9 7.6-6.4 12.8-6.4c7.8 0 14.3 5.6 15.7 13c1.6 8.2 7.3 15.1 15.1 18s16.7 1.6 23.3-3.6c2.7-2.1 6.1-3.4 9.9-3.4c8.8 0 16 7.2 16 16l0 16V392c0 39.8-32.2 72-72 72H272 212.3h-.9c-37.4 0-72.4-18.7-93.2-49.9L50.7 312.9c-4.9-7.4-2.9-17.3 4.4-22.2s17.3-2.9 22.2 4.4L116 353.2c5.9 8.8 16.8 12.7 26.9 9.7s17-12.4 17-23V320 64zM176 0c-35.3 0-64 28.7-64 64V261.7C91.2 238 55.5 232.8 28.5 250.7C-.9 270.4-8.9 310.1 10.8 339.5L78.3 440.8c29.7 44.5 79.6 71.2 133.1 71.2h.9H272h56c66.3 0 120-53.7 120-120V288l0-16c0-35.3-28.7-64-64-64c-4.5 0-8.8 .5-13 1.3c-11.7-15.4-30.2-25.3-51-25.3c-6.9 0-13.5 1.1-19.7 3.1C288.7 170.7 269.6 160 248 160c-2.7 0-5.4 .2-8 .5V64c0-35.3-28.7-64-64-64zm48 304c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304zm48-16c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304c0-8.8-7.2-16-16-16zm80 16c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304z"  fill="currentColor" />'
                        + '</svg>'
                    + '</button>'
                +'</span>'
            + '</td>'
            + '<td class="align-middle text-center wall-rsi-rse-popup text-center">'
                + '<input type="hidden" class="form-control hashchange" name="wall-rse[]" id="wall-rse-' + wallId + '" />'
                + '<span id="wall-rse-' + wallId + '-val" class="wall-rse-val">'
                    + '<button data-toggle="tooltip" title="Clique ici pour définir un RSE" type="button" class="btn btn-primary btn-icon">'
                        + '<svg  id="wall-rse-' + wallId + '-chose" class="wall-rse-chose" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">'
                            + '<path d="M160 64c0-8.8 7.2-16 16-16s16 7.2 16 16V200c0 10.3 6.6 19.5 16.4 22.8s20.6-.1 26.8-8.3c3-3.9 7.6-6.4 12.8-6.4c8.8 0 16 7.2 16 16c0 10.3 6.6 19.5 16.4 22.8s20.6-.1 26.8-8.3c3-3.9 7.6-6.4 12.8-6.4c7.8 0 14.3 5.6 15.7 13c1.6 8.2 7.3 15.1 15.1 18s16.7 1.6 23.3-3.6c2.7-2.1 6.1-3.4 9.9-3.4c8.8 0 16 7.2 16 16l0 16V392c0 39.8-32.2 72-72 72H272 212.3h-.9c-37.4 0-72.4-18.7-93.2-49.9L50.7 312.9c-4.9-7.4-2.9-17.3 4.4-22.2s17.3-2.9 22.2 4.4L116 353.2c5.9 8.8 16.8 12.7 26.9 9.7s17-12.4 17-23V320 64zM176 0c-35.3 0-64 28.7-64 64V261.7C91.2 238 55.5 232.8 28.5 250.7C-.9 270.4-8.9 310.1 10.8 339.5L78.3 440.8c29.7 44.5 79.6 71.2 133.1 71.2h.9H272h56c66.3 0 120-53.7 120-120V288l0-16c0-35.3-28.7-64-64-64c-4.5 0-8.8 .5-13 1.3c-11.7-15.4-30.2-25.3-51-25.3c-6.9 0-13.5 1.1-19.7 3.1C288.7 170.7 269.6 160 248 160c-2.7 0-5.4 .2-8 .5V64c0-35.3-28.7-64-64-64zm48 304c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304zm48-16c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304c0-8.8-7.2-16-16-16zm80 16c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304z"  fill="currentColor" />'
                        + '</svg>'
                    + '</button>'
                +'</span>'
            + '</td>'
            + '<td class="align-middle text-center wall-bridge-popup text-center">'
                + '<input type="hidden" class="form-control hashchange " name="wall-bridge[]" id="wall-bridge-' + wallId + '" />'
                + '<span id="wall-bridge-' + wallId + '-val" class="wall-bridge-val" >'
                    + '<button data-toggle="tooltip" title="Clique ici pour définir un pont thermique" type="button" class="btn btn-secondary btn-icon">'
                        + '<svg  id="wall-bridge-' + wallId + '-chose" class="wall-bridge-chose text-body" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">'
                            + '<path d="M160 64c0-8.8 7.2-16 16-16s16 7.2 16 16V200c0 10.3 6.6 19.5 16.4 22.8s20.6-.1 26.8-8.3c3-3.9 7.6-6.4 12.8-6.4c8.8 0 16 7.2 16 16c0 10.3 6.6 19.5 16.4 22.8s20.6-.1 26.8-8.3c3-3.9 7.6-6.4 12.8-6.4c7.8 0 14.3 5.6 15.7 13c1.6 8.2 7.3 15.1 15.1 18s16.7 1.6 23.3-3.6c2.7-2.1 6.1-3.4 9.9-3.4c8.8 0 16 7.2 16 16l0 16V392c0 39.8-32.2 72-72 72H272 212.3h-.9c-37.4 0-72.4-18.7-93.2-49.9L50.7 312.9c-4.9-7.4-2.9-17.3 4.4-22.2s17.3-2.9 22.2 4.4L116 353.2c5.9 8.8 16.8 12.7 26.9 9.7s17-12.4 17-23V320 64zM176 0c-35.3 0-64 28.7-64 64V261.7C91.2 238 55.5 232.8 28.5 250.7C-.9 270.4-8.9 310.1 10.8 339.5L78.3 440.8c29.7 44.5 79.6 71.2 133.1 71.2h.9H272h56c66.3 0 120-53.7 120-120V288l0-16c0-35.3-28.7-64-64-64c-4.5 0-8.8 .5-13 1.3c-11.7-15.4-30.2-25.3-51-25.3c-6.9 0-13.5 1.1-19.7 3.1C288.7 170.7 269.6 160 248 160c-2.7 0-5.4 .2-8 .5V64c0-35.3-28.7-64-64-64zm48 304c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304zm48-16c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304c0-8.8-7.2-16-16-16zm80 16c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304z"  fill="currentColor" />'
                        + '</svg>'
                    + '</button>'
                +'</span>'
            + '</td>'
            + '<td class="text-center"><input type="number" class="form-control hashchange text-center" min="0" step="0.01" name="wall-surface[]" id="wall-surface-' + wallId + '" value="0" /></td>'
            + '<td class="text-center"><input type="number" class="form-control hashchange text-center"  min="0" step="0.01"  name="wall-r[]" id="wall-r-' + wallId + '" value="0" disabled="disabled" /></td>'
            + '<td class="text-center">'
                + '<button type="button" class="btn btn-danger delete-button window" onclick="detailBuildingDeleteWall('+wallId+');">'
                    + '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>'
                + '</button>'
            + '</td>'
        + '</tr>'
        + '<tr  class="wall-' + wallId + '">'
            + '<td colspan="9" style="padding: 0; margin: 0">'
                + '<table style="padding: 0; margin: 0"  id="wall-' + wallId + '-window" class="window-table table table-vcenter" width="100%">'
                + '<thead>'
                    + '<tr>'
                        + '<th> </th>'
                        + '<th> </th>'
                        + '<th colspan="2" data-i18n="[html]thead-window">Vitre</th>'
                        + '<th data-i18n="[html]thead-window-type">Type</th>'
                        + '<th class="text-center" data-i18n="[html]thead-window-surface">Surface (cm2)</th>'
                        + '<th class="text-center"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg></th>'
                    + '</tr>'
                + '</thead>'
                + '<tbody>'
                    + '<tr id="addWindow2Wall-' + wallId + '-button">'
                        + '<th>&rarr;</th>'
                        + '<td colspan="7">'
                            + '<button type="button" class="btn btn-primary add-button window" data-i18n="[html]add-window-button" onclick="detailBuildingAddWindows2Wall(' + wallId + ');">'
                                + '+'
                            + '</button>'
                        + '</td>'
                    + '</tr>'
                + '</tbody>'
              + '</table>'
            + '</td>'
        + '</tr>'
        + '</tbody>'
    );

    // Ajouter les custom-wall dans "wall-type" 
    wallTypeSelect(wallId);
    

    $('#wall-type-' + wallId).select2();
    if (id == null) {
        //detailBuildingAddWindows2Wall(wallId);
        $("#wall-id").val(wallId);
    } else {
        if ($("#wall-id").val() < wallId) {
            $("#wall-id").val(wallId);
        }
    }
    refreshDetailBuildingChange();
}

/**
 * Résumé : Ajout d'une fenêtre dans un mur
 * @param {integer}           wallId Description : Id du mur
 */
function detailBuildingAddWindows2Wall(wallId, id = null) {
    // Déterminer le WinId
    let winId=parseFloat($('#wall-' + wallId + '-window-id').val())+1;
    if (id != null) {
        winId=id;
    }
    debug('Add  ('+winId+') sur la paroi ' + wallId);

    // Check if existe...
    if ($("#wall-" + wallId + "-window-"+ winId).length != 0) {
        debug('La fenêtre avec l\'ID '+winId+', sur le mur '+wallId+' existe déjà...')
        return true;
    }

    $('#addWindow2Wall-' + wallId + '-button').before(
        '<tr id="wall-' + wallId + '-window-'+ winId +'" class="window-'+winId+' window-check">'
            + '<td>&rarr;</td>'
            + '<td class="align-middle text-center window-check-' + wallId + '-'+ winId +'">'
                + '<input class="debug" type="hidden" id="wall-check-' + wallId + '-'+ winId + '" name="wall-check" value="0" />'
                + '<svg style="display: none;" id="wall-' + wallId + '-window-'+ winId +'-check-svg" xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path class="bg-primary-subtle border border-primary-subtle " d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
                + '<svg data-toggle="tooltip" title="Il manque des informations pour cette fenêtre" style="display: none;" id="wall-' + wallId + '-window-'+ winId +'-nocheck-svg"  xmlns="http://www.w3.org/2000/svg" height="1.5em" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path class="bg-danger-subtle border-danger-subtle" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>'
            + '</td>'
            + '<td colspan="2"><input type="text" class="form-control hashchange" name="window-name[]" id="wall-name-' + wallId + '-window-'+ winId +'" value=""  placeholder="Ex: Fenêtre cuisine" /></td>'
            + '<td>'
                + '<select name="window-type[]" id="wall-type-' + wallId + '-window-'+ winId +'" style="width: 100%;" class="form-control hashchange window-type">'
                    + '<option value="" selected="selected">-</option>'
                + '</select>'
            + '</td>'
            + '<td class="text-center"><input type="number" class="form-control hashchange text-center" min="0" step="0.01" name="window-surface[]" id="wall-surface-' + wallId + '-window-'+ winId +'" value="0" /></td>'
            + '<td class="text-center">'
                + '<button type="button" class="btn btn-danger delete-button window" onclick="detailBuildingDeleteWindows2Wall('+wallId+', '+winId+');">'
                    + '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>'
                + '</button>'
            + '</td>'
        + '</tr>'
    );
    $('#wall-type-' + wallId + '-window-'+ winId).select2({
        data : settings.winType
    });
    $('#wall-type-' + wallId + '-window-'+ winId).trigger('change');
    if (id == null) {
        $("#wall-"+wallId+"-window-id").val(winId);
    } else {
        if ($('#wall-' + wallId + '-window-id').val() < winId) {
            $('#wall-' + wallId + '-window-id').val(winId);
        }
    }

    refreshDetailBuildingChange();
}



/**
 * Résumé : Ajout d'une couche dans un mur personnalisé
 * @param {integer}           Layer ID 
 */
function addLayer(id = null) {

    // Déterminer le WinId
    let layerId=parseFloat($('#layer-id').val())+1;
    if (id != null) {
        layerId=id;
    }
    debug('Add d\'une couche avec l\'id ' + layerId);

    // Check if existe...
    if ($("#layer-" + layerId ).length != 0) {
        debug('La couche avec l\'ID '+layerId+' existe déjà...')
        return true;
    }

    $('#addLayerButton').before(
        '<tr id="layer-' + layerId +'" class="layers layer-'+layerId+' layer-check">'
            + '<td><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8h32v96H128V192c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V288h96v96H192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8H288V288h96v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6v32H288V128h32c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64z"/></svg></td>'
            + '<td class="layer-check-' + layerId +'">'
                + '<input class="debug" type="hidden" id="layer-check-' + layerId + '" name="layer-check" value="0" />'
                + '<svg style="display: none;" id="layer-' + layerId +'-check-svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path class="bg-primary-subtle border border-primary-subtle " d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
            + '</td>'            
            + '<td>'
                + '<input type="hidden" class="layer-idu" name="layer-idu[]" id="layer-idu-' + layerId +'" value="" size="1" />'
                + '<select name="layer-type[]" id="layer-type-' + layerId + '" class="form-control layer-type" style="width: 100%">'
                + '</select>'
            + '</td>'
            + '<td class="text-center"><input type="number" class="form-control text-center layer-lambda" min="0" step="1" name="layer-lambda[]" id="layer-lambda-' + layerId +'" value="" disabled="disabled" /></td>'
            + '<td class="col-number text-center"><input type="number" class="form-control text-center layer-size" min="0" step="1" name="layer-size[]" id="layer-size-' + layerId +'" value="0" /></td>'
            + '<td class="text-center"><input type="number" class="form-control text-center layer-r" min="0" step="1" name="layer-r[]" id="layer-r-' + layerId +'" value="" disabled="disabled" /></td>'
            + '<td class="text-center">'
                + '<button type="button" class="btn btn-danger delete-button layer" onclick="deleteLayer('+layerId+');">'
                    + '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>'
                + '</button>'
            + '</td>'
        + '</tr>'
    );

    // Ajout des matériaux
    layerTypeSelect(layerId);

    // Le layer type en select2
    $('#layer-type-' + layerId).select2({
        width: 'resolve'
    });

    if (id == null) {
        $("#layer-id").val(layerId);
    } else {
        if ($('#layer-id').val() < layerId) {
            $('#layer-id').val(layerId);
        }
    }

    refreshLayerDialogChange();
}

/**
 * Résumé : Suppression d'une fenêtre
 * @param {integer}           wallId Description : Id du mur
 * @param {integer}           winId Description : Id de la fenêtre
 */
function detailBuildingDeleteWindows2Wall(wallId, winId) {
    debug('Suppression de la fenêtre '+winId+' du mur '+wallId);
    $('#wall-' + wallId + '-window-'+ winId).remove();
    refreshDetailBuildingChange();
}

/**
 * Résumé : Suppression d'une paroi
 * @param {integer}           wallId Description : Id de la paroi
 */
function detailBuildingDeleteWall(wallId) {
    debug('Suppression du mur '+wallId);
    $('.wall-' + wallId).remove();
    hashchangeAllAction();
    appAlert('Supprimé !', "success");
    refreshDetailBuildingChange();
}
/**
 * Résumé : Suppression de la couche
 * @param {integer}           wallId Description : Id de la couche
 */
function deleteLayer(layerId) {
    debug('Suppression de la couche '+layerId);
    $('.layer-' + layerId).remove();
    appAlert('Supprimé !', "success");
    refreshLayerDialogChange();
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
                    +'<td class="text-center power-value" data-power-watts="'+this.power+'">'+formatPowerText(this.power)+'</td>'
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
    $(".calculs").hide();
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
    } else if ($("#level").val() == 3) {
        // Pour la méthode de calcul
        debug('Level 3');
        // Reset
        $("#thermal-study").html('');
        var depConductivite = 0;
        $("#result-title-building-title").html($("#building-title").val());
        // Récupération du formulaire..
        for (var wallId=0; wallId<=$('#wall-id').val(); wallId++) {
            // WALL
            debug('Wall id ' + wallId);
            // Vérification si existant
            if ($('#wall-'+wallId).val() !== undefined) {
                debug('Wall check : ' + $('#wall-check-'+wallId).val());
                // Vérifier si le check est  fait/bon
                if ($('#wall-check-'+wallId).val() == 1)  {
                    debug('Ajout dans le résultat)');
                    rt=precise_round(parseFloat($('#wall-r-'+wallId).val())+parseFloat($('#wall-rsi-'+wallId).val())+parseFloat($('#wall-rse-'+wallId).val()), 2);
                    var commentTempUse='';
                    var titleTempUse='Différence entre la température intérieure et extérieure (dite de base) (°C) / ( R total de la surface opaque (W/°C) / Surface opaque (m2) )';
                    if ($('#wall-rse-'+wallId).val() == 0) {
                        commentTempUse='<ul><li data-i18n="[html]wall-ground">Contact avec le sol...</li></ul>';
                        titleTempUse='Différence entre la température intérieure et la température du sol (°C) / ( R total de la surface opaque (W/°C) / Surface opaque (m2) )';
                    }
                    $("#thermal-study").append(
                        '<div class="col-sm-6"><div class="card"><div class="card-body">'
                        + '<h6><span data-i18n="[html]thead-wall-name">Paroi</span> : '+$('#wall-name-'+wallId).val()+' (<span class="wall-'+wallId+'-and-window-loss-value"></span>W)</h6>' 
                        + '<ul>'
                            + '<li><span data-i18n="[html]thead-wall-type">Type</span> : '+$('#wall-type-'+wallId+' option:selected').text()+' (R = '+$('#wall-r-'+wallId).val()+' °C.m²/W)'
                                + '<ul id="wall-'+wallId+'-detail"></ul>'
                            + '</li>'
                            + '<li><span data-i18n="[html]thead-wall-rsi">Rsi</span>/<span data-i18n="[html]thead-wall-rse">Rse</span> : '+$('#wall-rsi-'+wallId).val()+' /  '+$('#wall-rse-'+wallId).val()+'</li>'
                            + commentTempUse
                            + '<li><span data-i18n="[html]wall-surface">Surface paroi</span> : '+$('#wall-surface-'+wallId).val()+'m2</li>'
                            + '<li><span data-toggle="tooltip" title="R + Rsi + Rse"><span data-i18n="[html]wall-rt">R total</span> : '+rt+'</span>°C.m²/W</li>'
                            + '<li id="wall-'+wallId+'-windows-parent"><span data-i18n="[html]windows">Fenêtre(s)</span> <span data-toggle="tooltip" title="Différence entre la température intérieure et extérieure (dite de base) (°C) * Perte total des fenêtres (W/°C)"><span data-i18n="[html]window-loss">Déperdition</span>=<span id="wall-'+wallId+'-window-loss-value"></span>W</span> : <ul id="wall-'+wallId+'-windows"></ul></li>'
                            + '<li id="wall-'+wallId+'-bridge-parent"><span data-i18n="[html]bridges">Pont(s) thermique(s)</span> <span data-toggle="tooltip" title="Différence entre la température intérieure et extérieure (dite de base) (°C) * Perte total des ponts thermiques (W/°C)"><span data-i18n="[html]bridge-loss">Déperdition</span>=<span id="wall-'+wallId+'-bridge-loss-value"></span>W</span> : <ul id="wall-'+wallId+'-bridges"></ul></li>'
                            + '<li><span data-toggle="tooltip" title="Surface de la paroi - la surface vitrée"><span data-i18n="[html]opaque-surface">Surface opaque</span> : <span id="wall-'+wallId+'-window-opaque-surface-value"></span>m<sup>2</sup></span></li>'
                            + '<li><span data-toggle="tooltip" title="'+titleTempUse+'"><span data-i18n="[html]wall-loss">Déperdition des surfaces opaques</span> : <span id="wall-'+wallId+'-loss-value"></span>W</span></li>'
                            + '<li><span data-toggle="tooltip" title="Déperdition des surfaces opaque + surfaces vitrées"><span data-i18n="[html]wall-and-window-loss">Déperdition total</span> : <span class="wall-'+wallId+'-and-window-loss-value"></span>W</span></li>'
                        + '</ul>'
                        + '</div></div></div>'
                    );
                    // Si c'est une paroi personnalisé alors on spécifie son détail
                    $.each(localSetting.wall, function(index, data) {
                        if (data.title == $('#wall-type-'+wallId+' option:selected').text())  {
                            $.each(data.layer, function(index, layer) {
                                $("#wall-"+wallId+"-detail").append('<li>'+layer.material+' ('+layer.size+'cm, &lambda;='+layer.lambda+')</li>');    
                            });
                        }
                    });
                    // Ajout des fenêtres
                    var windows = '';
                    var windowsSurfaceTotal=0;
                    var windowsPerteTotalPerDegre=0;
                    var windowsPerteTotal=0;
                    for (var winId=0; winId<=$('#wall-'+wallId+'-window-id').val(); winId++) {
                        debug('winId ' + winId);
                        if ($('#wall-'+wallId+'-window-id').val() !== undefined) {
                            debug('Window check : ' + $('#wall-check-' + wallId+'-'+winId).val());
                            // Vérifier si le check est  fait/bon
                            if ($('#wall-check-' + wallId+'-'+winId).val() == 1)  {
                                surface=(parseFloat($('#wall-surface-' + wallId + '-window-'+ winId).val()));
                                windowsSurfaceTotal=parseFloat(windowsSurfaceTotal)+parseFloat(surface);
                                perte=precise_round($('#wall-type-' + wallId + '-window-'+ winId).val()*surface, 2);
                                windowsPerteTotalPerDegre=parseFloat(windowsPerteTotalPerDegre)+parseFloat(perte);
                                windows = windows + '<li>'+$('#wall-name-' + wallId + '-window-'+ winId).val()+' '+$('#wall-name-' + wallId + '-window-'+ winId+' option:selected').text()+' Uw='+$('#wall-type-' + wallId + '-window-'+ winId).val()+', Surface='+surface+'m<sup>2</sup>, <span data-toggle="tooltip" title="Surface * Uw">Perte='+perte+'W/°C</span></li>'; 
                                debug('Window id ' + winId);
                            }
                        }
                    }
                    // Calculs
                    debug('Windows perte (W/°C) : '+windowsPerteTotalPerDegre);
                    // Perte total fenêtre
                    windowsPerteTotal=($("#temp_indor").val()-$("#temp_base").val())*windowsPerteTotalPerDegre;
                    debug('Windows perte (W) total : '+windowsPerteTotal);
                    $('#wall-'+wallId+'-window-loss-value').html(precise_round(windowsPerteTotal, 0));
                    // Surface opaque
                    surfaceOpaque=parseFloat($('#wall-surface-'+wallId).val())-parseFloat(windowsSurfaceTotal);
                    $('#wall-'+wallId+'-window-opaque-surface-value').html(precise_round(surfaceOpaque, 2));
                    debug("Surface opaque : "+surfaceOpaque);
                    debug('Surface vitré total : '+windowsSurfaceTotal);
                    //Perte surface opaque
                    // Si le RSE donne vers le sol (=0), on considère la température du sol et non de l'air
                    if ($('#wall-rse-'+wallId).val() == 0) {
                        wallPerte=($("#temp_indor").val()-$("#temp_ground").val())/(rt/surfaceOpaque);
                    } else {
                        wallPerte=($("#temp_indor").val()-$("#temp_base").val())/(rt/surfaceOpaque);
                    }
                    $('#wall-'+wallId+'-loss-value').html(precise_round(wallPerte, 0));
                    // Pont thermique
                    let wallBridge = $("#wall-bridge-" + wallId).val();
                    if (wallBridge) {
                        try {
                            bridges = JSON.parse(wallBridge);
                        } catch (e) {
                            console.error("Erreur lors du parsing JSON :", e);
                            bridges = []; // En cas d'erreur de parsing, définir comme un tableau vide
                        }
                    } else {
                        bridges = []; // Si la valeur est vide, définir comme un tableau vide
                    }
                    let bridgePt = 0;
                    let bridgesPrint = '';
                    if (bridges.length != 0) {
                        bridges.forEach(item => {
                            // Afficher le type de chaque élément
                            let typePrint;
                            if (item.type == "floor_lower_wall") {
                                typePrint = "Plancher bas / mur";
                            } else if (item.type == "floor_inter_wall") {
                                typePrint = "Plancher intermédiaire / mur";
                            } else if (item.type == "floor_upper_wall") {
                                typePrint = "Plancher haut / mur";
                            } else if (item.type == "partition_wall") {
                                typePrint = "Refend / mur";
                            } else {
                                typePrint = "Aucun";
                            }
                            bridgesPrint = bridgesPrint + `<li>${item.name} ${typePrint} longueur=${item.length}m, <span data-toggle="tooltip" title="Surface * Uw">Perte=${item.pt}W/°C</span></li>`; 
                            // Ajouter la valeur de pt à la somme totale
                            bridgePt += parseFloat(item.pt);
                        });
                        if (bridgePt != 0) {
                            $('#wall-'+wallId+'-bridges').append(bridgesPrint);
                        }
                    } else {
                        $('#wall-'+wallId+'-bridge-parent').hide();
                    }

                    debug('Pont thermique : '+bridgePt);
                    bridgePerte=bridgePt*($("#temp_indor").val()-$("#temp_base").val());
                    $('#wall-'+wallId+'-bridge-loss-value').html(precise_round(bridgePerte, 0));
                    // Perte total de la paroi (fenêtre + opaque + pont thermique)
                    perteTotal=parseFloat(windowsPerteTotal)+parseFloat(wallPerte)+parseFloat(bridgePerte);
                    $('.wall-'+wallId+'-and-window-loss-value').html(precise_round(perteTotal, 0));
                    // Ajout des pertes totals aux 
                    depConductivite=parseFloat(depConductivite)+parseFloat(perteTotal);
                    if (windows == '') {
                        debug('Window = undefined');
                        $('#wall-'+wallId+'-windows-parent').hide();
                    } else {
                        debug('Window = défini !');
                        $('#wall-'+wallId+'-windows').append(windows);
                    }
                }
            }
        }
        // Résultat
        depAeraulique=precise_round($("#livingvolume").val() * $("#venti_global").val(),0);
        var resDeperditionMax=parseFloat(depAeraulique)+parseFloat(depConductivite);
        $("#thermal-study").append(
            '<div class="col-sm-12"><div class="card"><div class="card-body">'
            + '<h6 data-toggle="tooltip" title="Somme des déperditions par conduction (paroi)"><span data-i18n="[html]dep-conduction">Déperdition par conduction</span> : '+precise_round(depConductivite, 0)+'W</h6>' 
            + '<h6 data-toggle="tooltip" title="Volume * VMC"><span data-i18n="[html]dep-aeraulique">Déperdition par aéraulique</span> : '+depAeraulique+'W</h6>' 
            + '<h6 data-toggle="tooltip" title="Somme des déperditions par conduction et aéraulique"><b><span data-i18n="[html]dep-total">Déperdition total</span> : '+precise_round(resDeperditionMax, 0)+'W</b></h6>' 
            + '</div></div></div>'
        );
    }
    $("#resDeperditionMax").attr('data-power-watts', resDeperditionMax).text(formatPowerText(resDeperditionMax));
    $("#resDeperdition").val(resDeperditionMax);
    debug("Besoin de chauffage : " + resDeperditionMax + "Wh");
    conso();
    suggestion();
    help();
    // Tooltip reset
    $('[data-toggle="tooltip"]').tooltip();
    if (shortLink == true) {
        genTinyUrl(document.location.href);
    }
}


/**
 * Résumé : Détermine la consommation
 */
function conso() {
    $("#conso").hide();
    if ($("#temp_base_auto").prop("checked") && $("#nav-tab-record").val() == 'nav-carte-tab' && $("#lat").val() != '' && $("#lng").val() != '') {
        debug('[conso] GET API DJU');
        $.getJSON( settings.apiDju+'?lat='+precise_round(parseFloat($("#lat").val()), 4)+'&lng='+precise_round(parseFloat($("#lng").val()), 4)+'&nbYearsArchive='+$("#dju_years_archive").val()) 
        .done(function( json ) {
            debug(json);
            var dju = json.yearly_average;
            $('.res_dju').html(dju);
            debug("[conso] dju = "+dju);
            var resDeperdition = precise_round(parseFloat($("#resDeperdition").val())/1000, 2);
            $('.res_d').html(resDeperdition);
            debug("[conso] resDeperdition = "+resDeperdition);
            $('.res_temp_indor').html($("#temp_indor").val());
            $('.res_temp_base').html($("#temp_base").val());
            var deltaT = parseFloat($("#temp_indor").val()) - parseFloat($("#temp_base").val());
            debug("[conso] deltaT = "+deltaT);
            var c = (24 * resDeperdition * dju * settings.dju.i) / (deltaT*settings.dju.η*settings.dju.pci.wood);
            debug("[conso] c = "+c);
            $('.res_c').html(precise_round(c,2));
            var c_stere = precise_round(c*1000/settings.dju.stere.hardwoods,1);
            debug("[conso] c en stèr e= "+c_stere);
            $('.res_stere_hardwoods').html(c_stere);
            $("#conso").show();
        })
        .fail(function( jqxhr, textStatus, error ) {
            appAlert('<span>Request Failed to get API DJU ' + jqxhr.responseJSON.message + '. </span>', "danger", 3);
            debug("[conso] API return : " + error);
        });
    } else {
        debug("[conso] Désactivé car pas de latitude ou longitude");
    }
}

/**
 * Résumé : Récupère la température de base par API en fonction de la latitude et la longitude
 */
function getBaseTemperature(){
    debug('getBaseTemperature');
    /*
    debug($("#temp_base_auto").prop("checked"));
    debug($("#nav-tab-record").val());
    debug($("#lat").val());
    debug($("#lng").val());
    */
    if ($("#temp_base_auto").prop("checked") && $("#nav-tab-record").val() == 'nav-carte-tab' && $("#lat").val() != '' && $("#lng").val() != '') {
        debug('GET API baseTemperature');
        let endYearArchive = '';
        if (Number.isInteger(+$("#temp_base_end_years_archive").val()) && $("#temp_base_end_years_archive").val() >= 1970 && $("#temp_base_end_years_archive").val() <= 2099) {
            endYearArchive = '&endYearArchive=' + $("#temp_base_end_years_archive").val();
        } else {
            if (settings?.form_default?.temp_base_end_years_archive !== undefined) {
                $("#temp_base_end_years_archive").val(settings.form_default.temp_base_end_years_archive);
            } else {
                $("#temp_base_end_years_archive").val('');
            }
        }
        if ($("#temp_base_nb_days").val() > 10) {
            if (settings?.form_default?.temp_base_nb_days !== undefined) {
                $("#temp_base_nb_days").val(settings.form_default.temp_base_nb_days);
            } else {
                $("#temp_base_nb_days").val(5);
            }
        }
        if ($("#temp_base_nb_years_archive").val() > 40) {
            if (settings?.form_default?.temp_base_nb_years_archive !== undefined) {
                $("#temp_base_nb_years_archive").val(settings.form_default.temp_base_nb_years_archive);
            } else {
                $("#temp_base_nb_years_archive").val(20);
            }
        }
        $.getJSON( settings.apiBaseTemperature+'?lat='+$("#lat").val()+'&lng='+$("#lng").val()+'&nbYearsArchive='+$("#temp_base_nb_years_archive").val()+'&nbDays='+$("#temp_base_nb_days").val()+'&mode='+$("#temp_base_mode").val()+endYearArchive) 
        .done(function( json ) {
            $("#temp_base").val(json.base);
            hashChange();
        })
        .fail(function( jqxhr, textStatus, error ) {
            appAlert('<span>Request Failed to get API base temperature : ' + jqxhr.responseJSON.message + '. <b>Indicate there manually and contact the developer of this calculator</b></span>', "danger", 30);
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
    debug('Change level');
    if (level == 1) {
        $(".level3").hide();
        $(".level2").hide();
        $(".level1").show();
        $("input").removeAttr("required");
        $(".level1required").attr("required", "true");
        $("#livingvolume_auto").prop('checked', true);
        livingVolumeChangeMode();
    } else if (level == 2) {
        $(".level3").hide();
        $(".level1").hide();
        $(".level2").show();
        $("input").removeAttr("required");
        $(".level2required").attr("required", "true");
        $("#livingvolume_auto").prop('checked', true);
        livingVolumeChangeMode();
    } else if (level == 3) {
        $(".level1").hide();
        $(".level2").hide();
        $(".level3").show();
        $("input").removeAttr("required");
        $(".level3required").attr("required", "true");
        $("#livingvolume_auto").prop('checked', false);
        livingVolumeChangeMode();
    }
    if (level == 3) {
        $('.menu-item-level3').removeClass('d-none');
    } else {
        $('.menu-item-level3').addClass('d-none');
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
    if (typeof n !== 'number' || typeof r !== 'number') return 'Not a Number'

    let int = Math.floor(n).toString()
    if (int[0] == '-' || int[0] == '+') int = int.slice(1)

    let precision = int.length + r
    if (Math.floor(n) === 0) {
        precision = r + 1
    }

    let rounded = n.toPrecision(precision)

    if (rounded.indexOf('e') !== -1 || rounded.indexOf('E') !== -1) {
        const decimals = Math.max(r, 0)
        rounded = Number(rounded).toFixed(decimals)
    } else if (r > 0) {
        if (rounded.indexOf('.') === -1) {
            rounded = rounded + '.' + '0'.repeat(r)
        } else {
            const decimals = rounded.split('.')[1] || ''
            if (decimals.length < r) {
                rounded = rounded + '0'.repeat(r - decimals.length)
            }
        }
    }

    return rounded
}
/**
 * Résumé : Changer l'URL (hash) en fonction de la classe "hashchange"
 */
function hashChange() {
    debug('hashChange appel');
    var hashnew = '';
    var hashchange_len = $('.hashchange').length;
    var hashchange_nb = 0
    // Le formulaire
    $(".hashchange").each(function() {
        //debug(this.id);
        //this.type
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
    // Si on est en niveua 3 et qu'il y a des parroi personnalisé on les ajoutes dans le hash
    $('.wall-type').each(function() {
        var localWallId = isLocalWallId(getOptionIdu($(this).val()));
        if (localWallId !== false) {
            debug("Paroi perso détecté, à mettre dans le hash !");
            hashnew=hashnew+'&localWall-'+localWallId+'='+encodeURIComponent(JSON.stringify(localSetting.wall[localWallId])); 
        }
    });
    const url = new URL(window.location.href);
    url.searchParams.delete('s');
    const newUrl = url.origin + url.pathname + url.search; // Reconstruit l'URL sans 's'
    window.history.replaceState({}, '', newUrl);
    window.location.hash = hashnew;
    updateCurrentStudyHash(hashnew);
    return hashnew;
}

//
// Studies management (local storage)
//

const STUDY_STORAGE_KEY = 'choisirsonpdm.savedStudies';
const CONTACT_RETURN_KEY = 'choisirsonpdm.contactReturn';

function resolveActiveLocale() {
    if (typeof $ === 'undefined' || typeof $.i18n !== 'function') {
        return null;
    }
    const translator = $.i18n();
    if (translator && translator.locale) {
        return translator.locale;
    }
    const stored = getFunctionalStorageItem('i18n');
    if (stored) {
        translator.locale = stored;
        return translator.locale;
    }
    if (typeof settings === 'object' && settings.defaultLanguage) {
        translator.locale = settings.defaultLanguage;
        return translator.locale;
    }
    return null;
}

function applyTranslations(target) {
    if (typeof $ === 'undefined' || typeof $.i18n !== 'function') {
        return;
    }
    const translator = $.i18n();
    if (!translator) {
        return;
    }
    if (!translator.locale) {
        if (!resolveActiveLocale()) {
            return;
        }
    }
    const $target = target ? $(target) : $('html');
    if ($target.length === 0) {
        return;
    }
    $target.i18n();
}

function normalizeStudyKey(name) {
    return String(name ?? '').toLowerCase();
}

function sanitizeStudyEntry(item) {
    if (!item || typeof item !== 'object') {
        return null;
    }
    const hasName = typeof item.name === 'string' || typeof item.name === 'number';
    if (!hasName || typeof item.hash !== 'string') {
        return null;
    }
    const sanitized = Object.assign({}, item);
    sanitized.name = String(item.name);
    sanitized.hash = String(item.hash);
    if (sanitized.updatedAt != null && typeof sanitized.updatedAt !== 'string') {
        sanitized.updatedAt = String(sanitized.updatedAt);
    }
    return sanitized;
}

function getSavedStudies() {
    let stored = [];
    try {
        const raw = getFunctionalStorageItem(STUDY_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                stored = parsed.map(sanitizeStudyEntry).filter(Boolean);
            }
        }
    } catch (error) {
        console.error('Unable to parse saved studies from storage', error);
    }
    return stored;
}

function persistSavedStudies(studies) {
    const sanitized = Array.isArray(studies) ? studies.map(sanitizeStudyEntry).filter(Boolean) : [];
    setFunctionalStorageItem(STUDY_STORAGE_KEY, JSON.stringify(sanitized));
}

function updateStudyMenuState() {
    const hasStudies = getSavedStudies().length > 0;
    const $openAction = $('#study-open-action');
    if (hasStudies) {
        $openAction.removeClass('disabled').attr('aria-disabled', 'false');
    } else {
        $openAction.addClass('disabled').attr('aria-disabled', 'true');
    }
}

function renderStudyList() {
    const $dialog = $('#study-open-dialog');
    const $list = $('#study-open-list');
    if ($dialog.length === 0 || $list.length === 0) {
        return;
    }
    const studies = getSavedStudies().slice().sort((a, b) => {
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'accent', numeric: true });
    });
    $list.empty();
    if (studies.length === 0) {
        $dialog.find('.study-open-empty').show();
        $list.hide();
        return;
    }
    const loadLabel = (typeof $.i18n === 'function') ? $.i18n('study-open-load') : 'Ouvrir';
    const deleteLabel = (typeof $.i18n === 'function') ? $.i18n('study-open-delete') : 'Supprimer';
    $dialog.find('.study-open-empty').hide();
    $list.show();
    studies.forEach((study) => {
        const $item = $('<li/>', {
            class: 'list-group-item d-flex justify-content-between align-items-center'
        });
        $('<span/>', {
            class: 'flex-grow-1 study-open-title text-truncate',
            text: study.name
        }).appendTo($item);
        const $actions = $('<div/>', {
            class: 'study-open-actions ms-3 d-flex'
        }).appendTo($item);
        $('<button/>', {
            type: 'button',
            class: 'btn btn-sm btn-primary study-open-open',
            text: loadLabel,
            'data-study-name': study.name
        }).appendTo($actions);
        $('<button/>', {
            type: 'button',
            class: 'btn btn-sm btn-outline-danger ms-2 study-open-delete',
            text: deleteLabel,
            'data-study-name': study.name
        }).appendTo($actions);
        $list.append($item);
    });
}

function openStudySaveDialog(mode = 'local') {
    const $dialog = $('#study-save-dialog');
    const $input = $('#study-save-name');
    if ($dialog.length === 0 || $input.length === 0) {
        return;
    }
    const normalizedMode = mode === 'device' ? 'device' : 'local';
    const isDeviceMode = normalizedMode === 'device';
    const cancelLabel = (typeof $.i18n === 'function') ? $.i18n('study-dialog-cancel') : 'Annuler';
    const saveLabel = (typeof $.i18n === 'function') ? $.i18n('study-save-confirm') : 'Enregistrer';
    const buttonsConfig = {};
    buttonsConfig[cancelLabel] = function() {
        $dialog.dialog('close');
    };
    buttonsConfig[saveLabel] = function() {
        const name = $input.val().trim();
        if (name === '') {
            $input.addClass('is-invalid').trigger('focus');
            return;
        }
        hashChange();
        const currentHash = window.location.hash.slice(1);
        if (isDeviceMode) {
            saveStudyToDevice(name, currentHash);
            setCurrentStudyState(name, currentHash, { origin: 'device-save' });
            $dialog.dialog('close');
            return;
        }
        let studies = getSavedStudies();
        const normalizedName = normalizeStudyKey(name);
        const payload = {
            name: String(name),
            hash: currentHash,
            updatedAt: new Date().toISOString()
        };
        const existingIndex = studies.findIndex((item) => item && normalizeStudyKey(item.name) === normalizedName);
        const successKey = existingIndex >= 0 ? 'study-save-updated' : 'study-save-success';
        if (existingIndex >= 0) {
            const overwriteMessage = (typeof $.i18n === 'function') ? $.i18n('study-save-overwrite-confirm', name) : 'Cette étude existe déjà. Voulez-vous l\'écraser ?';
            if (!window.confirm(overwriteMessage)) {
                return;
            }
            studies[existingIndex] = payload;
        } else {
            studies.push(payload);
        }
        persistSavedStudies(studies);
        updateStudyMenuState();
        renderStudyList();
        if (typeof appAlert === 'function') {
            const successMessage = (typeof $.i18n === 'function') ? $.i18n(successKey, name) : 'Étude enregistrée.';
            appAlert(successMessage, 'success');
        }
        setCurrentStudyState(name, currentHash, { origin: 'local-save' });
        $dialog.dialog('close');
    };

    $dialog.dialog({
        modal: true,
        width: 420,
        buttons: buttonsConfig,
        open: function() {
            $input.removeClass('is-invalid');
            let defaultName = getCurrentStudyName();
            if (!defaultName) {
                const buildingTitle = $('#building-title').val();
                if (buildingTitle && String(buildingTitle).trim() !== '') {
                    defaultName = String(buildingTitle).trim();
                }
            }
            $input.val(defaultName);
            setTimeout(() => {
                $input.trigger('focus');
            }, 50);
            const $pane = $('.ui-dialog-buttonpane');
            $pane.find('button').removeClass('btn btn-secondary btn-primary');
            $pane.find('button:contains("' + cancelLabel + '")').addClass('btn btn-secondary');
            $pane.find('button:contains("' + saveLabel + '")').addClass('btn btn-primary');
            applyTranslations($dialog);
            applyTranslations($pane);
        },
        close: function() {
            $input.val('').removeClass('is-invalid');
        }
    });
}

function openStudyOpenDialog() {
    const $dialog = $('#study-open-dialog');
    if ($dialog.length === 0) {
        return;
    }
    renderStudyList();
    const closeLabel = (typeof $.i18n === 'function') ? $.i18n('study-dialog-close') : 'Fermer';
    const buttonsConfig = {};
    buttonsConfig[closeLabel] = function() {
        $dialog.dialog('close');
    };
    $dialog.dialog({
        modal: true,
        width: 500,
        buttons: buttonsConfig,
        open: function() {
            const $pane = $('.ui-dialog-buttonpane');
            $pane.find('button').removeClass('btn btn-secondary btn-primary');
            $pane.find('button:contains("' + closeLabel + '")').addClass('btn btn-secondary');
            applyTranslations($dialog);
            applyTranslations($pane);
        }
    });
}

function loadStudyByName(name) {
    const studies = getSavedStudies();
    const normalizedName = normalizeStudyKey(name);
    const entry = studies.find((item) => item && normalizeStudyKey(item.name) === normalizedName);
    if (!entry) {
        if (typeof appAlert === 'function') {
            const errorMessage = (typeof $.i18n === 'function') ? $.i18n('study-open-not-found') : "Étude introuvable.";
            appAlert(errorMessage, 'danger');
        }
        updateStudyMenuState();
        renderStudyList();
        return;
    }
    setCurrentStudyState(entry.name, entry.hash || '', { origin: 'local-open' });
    window.location.hash = entry.hash || '';
    location.reload();
}

function deleteStudyByName(name) {
    let studies = getSavedStudies();
    const normalizedName = normalizeStudyKey(name);
    const index = studies.findIndex((item) => item && normalizeStudyKey(item.name) === normalizedName);
    if (index === -1) {
        return;
    }
    const confirmMessage = (typeof $.i18n === 'function') ? $.i18n('study-delete-confirm', name) : 'Supprimer cette étude ?';
    if (!window.confirm(confirmMessage)) {
        return;
    }
    studies.splice(index, 1);
    persistSavedStudies(studies);
    updateStudyMenuState();
    renderStudyList();
    if (typeof appAlert === 'function') {
        const successMessage = (typeof $.i18n === 'function') ? $.i18n('study-delete-success', name) : 'Étude supprimée.';
        appAlert(successMessage, 'success');
    }
}

function normalizeStudyHash(hash) {
    if (typeof hash !== 'string') {
        hash = String(hash || '');
    }
    return hash.replace(/^#/, '');
}

function buildStudyExportPayload(name, hash) {
    return {
        version: 1,
        name: String(name),
        hash: normalizeStudyHash(hash),
        exportedAt: new Date().toISOString()
    };
}

function saveStudyToDevice(name, hash) {
    const payload = buildStudyExportPayload(name, hash);
    const fileNameBase = sanitizeUrlString(name) || settings.appShortName || 'study';
    const fileName = fileNameBase + '.json';
    const link = $('<a/>', {
        download: fileName,
        href: 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2))
    }).appendTo('body');
    link.on('click', function() {
        $(this).remove();
    })[0].click();
    if (typeof appAlert === 'function') {
        const successMessage = (typeof $.i18n === 'function') ? $.i18n('study-device-save-success', name) : 'Fichier d\'étude téléchargé.';
        appAlert(successMessage, 'success');
    }
    return true;
}

function handleStudyImportFromFile(event) {
    const input = event && event.target ? event.target : null;
    if (!input || !input.files || input.files.length === 0) {
        return;
    }
    const file = input.files[0];
    const finalize = () => {
        input.value = '';
    };
    const errorMessage = (typeof $.i18n === 'function') ? $.i18n('study-device-open-error') : 'Impossible d\'ouvrir ce fichier d\'étude.';
    try {
        const reader = new FileReader();
        reader.onload = function(loadEvent) {
            try {
                const content = loadEvent && loadEvent.target ? loadEvent.target.result : null;
                const parsed = content ? JSON.parse(content) : null;
                if (!parsed || typeof parsed !== 'object') {
                    throw new Error('invalid');
                }
                const hash = normalizeStudyHash(parsed.hash || parsed.url || '');
                if (!hash) {
                    throw new Error('missing-hash');
                }
                const name = parsed.name ? String(parsed.name) : '';
                setCurrentStudyState(name, hash, { origin: 'device-open' });
                window.location.hash = hash;
                location.reload();
            } catch (error) {
                if (typeof appAlert === 'function') {
                    appAlert(errorMessage, 'danger');
                }
            } finally {
                finalize();
            }
        };
        reader.onerror = function() {
            if (typeof appAlert === 'function') {
                appAlert(errorMessage, 'danger');
            }
            finalize();
        };
        reader.readAsText(file);
    } catch (error) {
        if (typeof appAlert === 'function') {
            appAlert(errorMessage, 'danger');
        }
        finalize();
    }
}

/**
 * Résumé : Fonction anti-rebond
 * Source : https://www.freecodecamp.org/french/news/anti-rebond-comment-retarder-une-fonction-en-javascript/ 
 * @param {string}           func Description : Fonction à mettre en attente de rebond
 * @param {integer}           timeout Description : Temps de timeout
 */
function debounce(func, timeout = 1000){
    debug("debounce");
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
function sharingButton(url = '') {
    const title =  encodeURIComponent($("title").text());
    if (url == '') {
        url = encodeURIComponent(document.location.href);
    }

    Object.entries(settings.sharingButton).forEach(entry => {
        var [network, href] = entry;
        // Remplacement des variables
        href = href.replace('__TITLE__', title);
        href = href.replace('__URL__', url);
        // Attribution du href
        $("#sharingButton, ." + network).attr('href', href);
        $("#sharingButton, ." + network).css('display', 'inline-block');

        //debug('Add sharingButton for ' + network + ' = ' + href);
    });
}

/* 
* Changement sur la température de base (mode auto/manuel)
*/ 
function tempBaseChangeMode() {
    debug("tempBaseChangeMode");
    if ($("#temp_base_auto").prop("checked")) {
        $("#temp_base").prop('disabled', true);
        //$( "#temp_base" ).val('');
        $(".temp_base_auto").show();
        // Seulement si on est sur la tab 
        if ($("#nav-tab-record").val() == 'nav-carte-tab' ) {
            if ($("#lat").val() != '' && $("#lng").val() != '') {
                processChangelngLat();
            }
        }
        $("#temp_base_param_plus").show();
        $(".temp_base_param_plus").hide();
    } else {
        //$( "#lng" ).val('');
        //$( "#lat" ).val('');
        $("#temp_base").prop('disabled', false);
        $(".temp_base_auto").hide();
        $("#temp_base_param_plus").hide();
        $(".temp_base_param_plus").hide();
    }
}

function livingVolumeChangeMode() {
    if ($("#livingvolume_auto").prop("checked")) {
        $("#livingvolume").prop('disabled', true);
        $(".livingvolume_auto").show();
        $(".livingvolume_manuel").show();
        $("#livingspace").attr("required", "true");
        $("#livingheight").attr("required", "true");
    } else {
        $("#livingvolume").prop('disabled', false);
        $(".livingvolume_auto").hide();
        $(".livingvolume_manuel").hide();
        $("#livingspace").removeAttr("required");
        $("#livingheight").removeAttr("required");
    }
}

/*
*   Carte NF des températures de bases
*   Fortement inspiré de http://nourtier.net/JoceWanadoo/Bricolage/PAC/calcul_PAC.htm#
*/
function temperatureBaseNFDetermine() {
    var zone = $('#zone').val();
    var altitude = $('#altitude').val();
    var temperatureBase = null;
    console.log("Zone : " + zone);
    console.log("Altitude : " + altitude);
    if (zone != '' && altitude >= 0 && altitude <= 2000) {
        console.log("Détermination de la température de base possible");
        $.each(settings.temperatureBaseData[zone], function (zoneIndex, ZoneValue) {
            if (altitude >= ZoneValue['altitudeMin'] && altitude <= ZoneValue['altitudeMax']) {
                temperatureBase = ZoneValue['temperature'];
                console.log("Température déterminé : " + temperatureBase);
            }
        });
        if (temperatureBase == null) {
            alert("Aucune donnée n'existe pour cette zone avec cette altitude");
        }
    } else {
        alert("La zone n'est pas déterminé ou l'altitude n'est pas comprise entre 0 et 2000m");
    }
    $('#temp_base').val(temperatureBase);
    hashchangeAllAction($('#temp_base'));
}

// Formulaire de contact
function contactShow() {
    const cancelLabel = (typeof $.i18n === 'function') ? $.i18n('study-dialog-cancel') : 'Cancel';
    const sendLabel = (typeof $.i18n === 'function') ? $.i18n('contact-send') : 'Envoyer';
    const buttonsConfig = {};
    buttonsConfig[cancelLabel] = function() {
        dialog.dialog('close');
    };
    buttonsConfig[sendLabel] = function() {
        setFunctionalStorageItem(CONTACT_RETURN_KEY, 'pending');
        sendContact($('#contact-from').val(), $('#contact-subject').val(), $('#contact-body').val() + "\n\n" + document.location.href)
            .done(function(data){
                const result = (data && typeof data.return !== 'undefined') ? String(data.return) : 'false';
                setFunctionalStorageItem(CONTACT_RETURN_KEY, result);
            })
            .fail(function() {
                setFunctionalStorageItem(CONTACT_RETURN_KEY, 'false');
            })
            .always(function() {
                var contactStatus = getFunctionalStorageItem(CONTACT_RETURN_KEY);
                debug("Retour contact : "+contactStatus);
                if (contactStatus === "true") {
                    dialog.dialog('close');
                    appAlert('Message envoyé !', "success");
                } else {
                    appAlert("Error");
                }
                removeFunctionalStorageItem(CONTACT_RETURN_KEY);
            });
    };
    dialog = $( "#dialog-contact" ).dialog({
        overlay: { opacity: 0.1, background: "black" },
        width: 600,
        height: 450,
        modal: true,
        buttons: buttonsConfig,
        open: function() {
            const $pane = $('.ui-dialog-buttonpane');
            $pane.find('button').removeClass('btn btn-secondary btn-primary');
            $pane.find('button:contains("' + cancelLabel + '")').addClass('btn btn-secondary');
            $pane.find('button:contains("' + sendLabel + '")').addClass('btn btn-primary');
            applyTranslations($('#dialog-contact'));
            applyTranslations($pane);
        }
    });
}

// Help card juste pour les français... le forum est francophone...
function help() {
    debug("Help ?");
    var userLang = navigator.language || navigator.userLanguage;
    debug('Help : detect locale user : '+userLang.split('-')[0]);
    const storedLocale = getFunctionalStorageItem('i18n');
    if(userLang.split('-')[0] == 'fr' || storedLocale == 'fr') {
        debug("Help show");
        // Préparatin du lien
        var body_avec_url = encodeURI(settings.help.body);
        var body_avec_url = settings.help.body.replace("___URL___", window.location);
        //Bug avec :// ça supprime un slash... certainement bug avec Discors
        var body_avec_url = body_avec_url.replace(":","%3A");
        var body_avec_url = body_avec_url.replace("?","%3F");
        var body_avec_url = body_avec_url.replace(/\//g,"%2F");
        var body_avec_url = body_avec_url.replace(/=/g, "%3D");
        var body_avec_url = body_avec_url.replace(/#/g, "%23");
        var body_avec_url = body_avec_url.replace(/&/g, "%26");
        var body_avec_url = body_avec_url.replace(/%20/g, "%2520");
        
        var helpUrl = encodeURI(settings.help.url) + '?category=' + settings.help.category + '&title=' + settings.help.title + '&body=' + body_avec_url;
        debug(helpUrl);
        // Ajout 
        $('#help-new-topic').attr("href", helpUrl);
        $('#help').show();
    }
    
}

// Créer un HashSum de contrôle
/*
function hashSum(src) {
    if (typeof src === 'object') {
        return CryptoJS.MD5(JSON.stringify(src));
    } else {
        return CryptoJS.MD5(src);
    }   
}
*/

// Créer un ID uniq
function genId() {
    const min = 1000000000;
    const max = 9999999999;
    return min + Math.floor(Math.random() * (max - min));
}

/*
* Générer la value d'un champs "option"
*/
function genOptionValue(id, value) {
    return id + "_" + value;
}
/*
* Retour la value d'un champs "option" qui est concaténéavec le hashSum 
*/
function getOptionValue(value) {
    debug(value);
    if (value !== undefined && value !== null) {
        var valueSplit = value.split('_');
        return valueSplit[1];
    } else {
        return '';
    }
}
/*
* Retour la idu d'un champs "option" qui est concaténéavec le hashSum 
*/
function getOptionIdu(value) {
    debug(value);
    if (value !== undefined && value !== null) {
        var valueSplit = value.split('_');
        return valueSplit[0];
    } else {
        return '';
    }
}

/**
 * Résumé : Détermine si cet ID est un ID contenu dans le localSetting/Storage local
 * @param {integer}           idSearch Description : Id à rechercher
 */
function isLocalWallId(idSearch) {
    debug('isLocalWallId '+idSearch);
    var retour = false;
    $.each(localSetting.wall, function(index, data) {
        if (data.idu == idSearch) {
            debug('isLocalWallId Troué ! '+idSearch);
            retour = index;
        }
    });  
    return retour;
}

function cleanTextContent(value) {
    if (value === undefined || value === null) {
        return '';
    }
    return String(value).replace(/\s+/g, ' ').trim();
}

function formatValueWithUnit(value, unit) {
    const cleanedValue = cleanTextContent(value);
    if (!cleanedValue) {
        return 'Non renseigné';
    }
    if (!unit) {
        return cleanedValue;
    }
    return cleanedValue + '\u00A0' + unit;
}

function buildResultRow(label, value, unit = null) {
    const formattedValue = formatValueWithUnit(value, unit);
    return [label, formattedValue];
}

function getSanitizedValue(selector) {
    const text = cleanTextContent($(selector).text());
    if (!text || text === '?') {
        return '';
    }
    return text;
}

function buildThermalStudyContent(level, title) {
    const content = [];
    if (title) {
        content.push({ text: title, style: 'smallBold', margin: [0, 0, 0, 5] });
    }

    if (level === '3') {
        const wallCards = $('#thermal-study .col-sm-6 .card');
        wallCards.each(function() {
            const $card = $(this);
            const wallTitle = cleanTextContent($card.find('h6').first().text());
            const listItems = [];

            $card.find('> .card-body > ul > li').each(function() {
                const $li = $(this);
                if (!$li.is(':visible')) {
                    return;
                }

                const $clone = $li.clone();
                $clone.find('ul').remove();
                const mainText = cleanTextContent($clone.text());
                if (!mainText) {
                    return;
                }

                const subListItems = [];
                $li.children('ul').children('li').each(function() {
                    const $subLi = $(this);
                    if (!$subLi.is(':visible')) {
                        return;
                    }
                    const subText = cleanTextContent($subLi.text());
                    if (subText) {
                        subListItems.push(subText);
                    }
                });

                if (subListItems.length > 0) {
                    listItems.push({ text: mainText, ul: subListItems });
                } else {
                    listItems.push(mainText);
                }
            });

            if (wallTitle) {
                content.push({ text: wallTitle, style: 'smallBold', margin: [0, 5, 0, 2] });
            }
            if (listItems.length > 0) {
                content.push({ ul: listItems, margin: [0, 0, 0, 5] });
            }
        });

        const summaryCard = $('#thermal-study .col-sm-12 .card .card-body');
        if (summaryCard.length) {
            const summaryTexts = [];
            summaryCard.find('h6').each(function() {
                const text = cleanTextContent($(this).text());
                if (text) {
                    summaryTexts.push(text);
                }
            });
            if (summaryTexts.length > 0) {
                content.push({ text: 'Synthèse des déperditions', style: 'smallBold', margin: [0, 10, 0, 2] });
                content.push({ ul: summaryTexts, margin: [0, 0, 0, 10] });
            }
        }

        return content;
    }

    const detailsText = cleanTextContent($('#thermal-study').text());
    if (detailsText) {
        content.push({ text: detailsText, margin: [0, 0, 0, 10] });
    }
    return content;
}

/**
 * Résumé : Généer des PDF avec PDF Make selon un ID
 */
function generatePDF(id, file) {
    if (typeof pdfMake === 'undefined' || !pdfMake.createPdf) {
        appAlert("Erreur lors du chargement de la librairie PDF.", "danger", 5);
        return;
    }

    const $section = $('#' + id);
    if ($section.length === 0) {
        appAlert("Section introuvable pour l'export PDF.", "danger", 5);
        return;
    }

    appAlert("Export PDF...", "success", 5);

    const now = new Date();
    const appName = (typeof settings !== 'undefined' && settings.appName) ? settings.appName : 'Choisir son PDM';
    const appShortName = (typeof settings !== 'undefined' && settings.appShortName) ? settings.appShortName : 'choisirsonpdm';
    const docTitle = appName + ' - Résultat';
    const sectionIdentifier = '#' + id;
    const heatingNeed = cleanTextContent($('#resDeperditionMax').text()) || cleanTextContent($('#resDeperdition').val());
    const consumptionSummary = cleanTextContent($('#conso .calcul_conso_result').text());
    const level = cleanTextContent($('#level').val());
    const methodGResult = getSanitizedValue('.res_level1');
    const methodUbatResult = getSanitizedValue('.res_level2');
    const gCoefficient = cleanTextContent($('#g').val());
    const ubat = cleanTextContent($('#ubat_global').val());
    const wastageSurface = cleanTextContent($('#wastagesurface').val());
    const volume = cleanTextContent($('#livingvolume').val());
    const ventiValue = cleanTextContent($('#venti_global').val());
    const vmcType = cleanTextContent($('#venti_global option:selected').text());
    const tempBase = cleanTextContent($('#temp_base').val());
    const tempIndoor = cleanTextContent($('#temp_indor').val());
    const ventiText = vmcType || (ventiValue ? ventiValue : 'Non renseigné');
    const thermalStudyTitle = cleanTextContent($('#result-title-building-title').text());
    const thermalStudyContent = buildThermalStudyContent(level, thermalStudyTitle);
    const shortStudyLink = window.location.href;

    const parameterTable = {
        table: {
            widths: ['*', '*'],
            body: [
                [
                    { text: 'Paramètre', style: 'tableHeader' },
                    { text: 'Valeur', style: 'tableHeader' }
                ],
                buildResultRow('Volume chauffé', volume, 'm³'),
                buildResultRow('Température de base', tempBase, '°C'),
                buildResultRow('Température intérieure de consigne', tempIndoor, '°C'),
                ['Type de VMC', ventiText || 'Non renseigné']
            ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 0, 0, 10]
    };

    const resultRows = [];
    if (methodGResult) {
        let methodGText = methodGResult;
        if (gCoefficient && volume && tempIndoor && tempBase) {
            methodGText = `D = (${tempIndoor} - ${tempBase}) * ${volume} * ${gCoefficient} = ${methodGResult}`;
        }
        resultRows.push(['Méthode G', methodGText]);
    }
    if (methodUbatResult) {
        let methodUbatText = methodUbatResult;
        if (ubat && wastageSurface && volume && ventiValue && tempIndoor && tempBase) {
            methodUbatText = `D = (${ubat} * ${wastageSurface} + ${volume} * ${ventiValue}) * (${tempIndoor} - ${tempBase}) = ${methodUbatResult}`;
        }
        resultRows.push(['Méthode Ubat', methodUbatText]);
    }

    const content = [
        { text: docTitle, style: 'header' },
        //{ text: 'Identifiant de section : ' + sectionIdentifier, style: 'small' },
        { text: 'Date : ' + now.toLocaleString(), style: 'small', margin: [0, 0, 0, 10] }
    ];

    content.push({ text: 'Synthèse', style: 'subheader' });
    if (heatingNeed) {
        content.push({ text: 'Besoin de chauffage estimé : ' + heatingNeed, margin: [0, 0, 0, 5] });
    }
    if (consumptionSummary && /\d/.test(consumptionSummary)) {
        content.push({ text: consumptionSummary, margin: [0, 0, 0, 10] });
    }
    content.push({ text: 'Paramètres utilisés', style: 'subheader' });
    content.push(parameterTable);

    if (thermalStudyContent.length > 0) {
        content.push({ text: 'Étude thermique', style: 'subheader' });
        thermalStudyContent.forEach(function(item) {
            content.push(item);
        });
    }

    content.push({ text: 'Lien vers l’étude : ' + shortStudyLink, link: shortStudyLink, style: 'link', margin: [0, 10, 0, 0] });

    const docDefinition = {
        info: {
            title: docTitle
        },
        content: content,
        defaultStyle: {
            font: 'Roboto'
        },
        styles: {
            header: {
                fontSize: 18,
                bold: true
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 15, 0, 8]
            },
            small: {
                fontSize: 9,
                color: '#555555'
            },
            smallBold: {
                fontSize: 11,
                bold: true
            },
            tableHeader: {
                bold: true,
                fillColor: '#eeeeee'
            },
            link: {
                color: '#0645ad',
                decoration: 'underline'
            }
        },
        footer: function(currentPage, pageCount) {
            return {
                columns: [
                    {
                        text: 'Choisir son PDM – Licence GPL-3.0-or-later • Page ' + currentPage + '/' + pageCount,
                        alignment: 'center',
                        fontSize: 8,
                        margin: [0, 10, 0, 0]
                    }
                ]
            };
        }
    };

    pdfMake.createPdf(docDefinition).download(appShortName + "-" + file + '.pdf');
    appAlert("... Export PDF ok !", "success", 2);
}

/* 
 * URL short
 */
function isTinyUrl() {
    debug("isTinyUrl");
    const searchParams = window.location.search;
    const regex = /[?&]s=([a-zA-Z0-9_]+)/;
    const match = searchParams.match(regex);
    if (match) {
        console.log("[link] Tiny URL trouvé ");
        return match[1];
    } else {
        console.log("[link] Tiny URL non trouvé");
        return false;
    }
}
async function handleTinyUrl() {
    if (shortLink == true) {
        debug('[link] handleTinyUrl');
        if (isTinyUrl() ) {
            navigator.clipboard.writeText(window.location.href);
            appAlert("Lien copier dans le press papier (copier/coller)", "success", 3);
        } else {
            let button = $('#tinyUrlBtn');
            let icon = $('#icon-link');
            // Copier un message temporaire immédiatement
            navigator.clipboard.writeText("Génération du lien...");
            $('#icon-link path').addClass('text-info');
            // Changer l'icône pour un sablier
            button.prop('disabled', true);
            
            let newUrl = await genTinyUrl(window.location.href);
            
            if (newUrl) {
                debug("[link] URL à copier en press papier" + newUrl);
                navigator.clipboard.writeText(newUrl).then(() => {                    
                    $('#icon-link path').removeClass('text-info');
                    $('#icon-link path').addClass('text-success');
                    appAlert("Lien copié dans le presse-papier", "success", 3);
                    setTimeout(() => $('#icon-link path').removeClass('text-success'), 4000);
                }).catch(err => {
                    appAlert("Erreur de copie dans le presse-papier", "danger", 3);
                });
            } else {
                appAlert("Erreur lors de la génération du lien", "danger", 3);
                shortLink = false;
                $('#tinyUrlBtn').hide();
            }
            button.prop('disabled', false);
        }
    } else {
        debug("Short link is disabled");
    }
}

async function genTinyUrl(url, name = '') {
    debug("genTinyUrl");
    if (shortLink == true) {
        // Si on est en niveau 3 et que le nom du building est renseigné
        if ($('#level').val() == 3 &&
            $('#building-title').val() != '') {
            name = sanitizeUrlString($('#building-title').val());
        }
        let data = name ? { url: url, name: name } : { url: url };
        try {
            let response = await $.post(settings.apiLink, data);
            debug(response);
            let newUrl = window.location.origin + window.location.pathname + "?s=" + response.link;
            history.replaceState(null, "", newUrl);
            sharingButton();
            if ($("#submit_input").val() != 0) {
                help();
            }
            return newUrl;
        } catch (error) {
            appAlert('<span>Request Failed to get API LINK ' + error.responseJSON.message + '. </span>', "danger", 3);
            debug("[link] API return : " + error.responseJSON.message);
            return null;
        }
    } else {
        debug("Short link is disabled");
    }
}



/* 
 * ========================= Pont thermique
 */
let bridges = [];
let currentIndex = 0;
function updateBridgeCounter() {
    $("#bridgeCounter").text(`Pont thermique ${currentIndex + 1}/${bridges.length}`);
    $("#prevBridge").prop("disabled", currentIndex === 0);
    $("#nextBridge").prop("disabled", currentIndex >= bridges.length - 1);
}
function showBridgeForm(index) {
    $(".bridgeForm").addClass("hidden");
    $(`#bridge_${index}`).removeClass("hidden");
    currentIndex = index;
    updateBridgeCounter();
}
function addBridgeForm(index, data = { name: "", type: "", length: "0" }) {
    $("#bridgeForms").append(`
    <div id="bridge_${index}" class="bridgeForm">
        <div class="row">
            <p>Ce mur accueil-il un plancher/dalle ou un mur de refend ? Si oui il est susceptible de provoquer un pont thermique.
            A noter que les ponts thermiques sont négligées au niveau des liaisons avec des parois en structure bois.</p>
        </div>
        <div class="row">
            <div class="col">
                <label for="bridgeName_${index}">Nommer le pont thermique : :</label>
                <input type="text" class="form-control bridgeName"  id="bridgeName_${index}" placeholder="Pont thermique plancher Nord" data-index="${index}" value="${data.name}">
            </div>
            <div class="col-sm">    
                <label for="bridgeType_${index}">Type de pont thermique : :</label>
                <select class="form-select bridgeType" data-index="${index}"  style="width: 100%;" id="bridgeType_${index}">
                    <option value="" ${data.type === "" ? "selected" : ""}>Aucun</option>
                    <option value="floor_lower_wall" ${data.type === "floor_lower_wall" ? "selected" : ""}>Plancher bas / mur</option>
                    <option value="floor_inter_wall" ${data.type === "floor_inter_wall" ? "selected" : ""}>Plancher intermédiaire / mur</option>
                    <option value="floor_high_wall" ${data.type === "floor_high_wall" ? "selected" : ""}>Plancher haut / mur</option>
                    <option value="partition_wall" ${data.type === "partition_wall" ? "selected" : ""}>Refend / mur</option>
                </select>
            </div>
            <div class="col-sm form_hide form_floor_lower_wall form_floor_inter_wall form_floor_high_wall form_partition_wall">
                <label for="bridgeLength_${index}" class="form_hide form_floor_lower_wall form_floor_high_wall form_floor_inter_wall">Longueur de contact entre le plancher le mur : </label>
                <label for="bridgeLength_${index}" class="form_hide form_partition_wall">Longueur du contact entre le mur de refend le mur extérieur : </label>
                <div class="input-group has-validation">
                    <input type="number" class="form-control bridgeLength" step="0.1" id="bridgeLength_${index}" placeholder="Longueur Ex: 12.5" data-index="${index}" value="${data.length}">
                    <span class="input-group-text">m</span>
                </div>
                <div class="form-text form_hide form_partition_wall">Souvent la hauteur du mur</div>
                <div class="form-text form_hide form_floor_lower_wall form_floor_high_wall form_floor_inter_wall">Souvent la longueur du mur</div>
            </div>
            
        </div>
        <div class="row form_hide form_floor_lower_wall form_floor_inter_wall form_floor_high_wall form_partition_wall">
            <div class="col-sm">
                <label for="bridgeWallInsulation_${index}">Méthode d'isolation du mur : :</label>
                <select class="form-select form-control typeInsulation wallInsulation" data-index="${index}"  style="width: 100%;" id="bridgeWallInsulation_${index}">
                    <option value="no" ${data.wallInsulation === "no" ? "selected" : ""}>Non Isolé</option>
                    <option value="ITI" ${data.wallInsulation === "ITI" ? "selected" : ""}>ITI : Isolation par l'intérieur</option>
                    <option value="ITE" ${data.wallInsulation === "ITE" ? "selected" : ""}>ITE : Isolation par l'extérieur</option>
                    <option value="ITR" ${data.wallInsulation === "ITR" ? "selected" : ""}>ITR : Isolation répartie (la structure est isolante)</option>
                    <option value="ITI+ITE" ${data.wallInsulation === "ITI+ITE" ? "selected" : ""}>ITI+ITE</option>
                    <option value="ITI+ITR" ${data.wallInsulation === "ITI+ITR" ? "selected" : ""}>ITI+ITR</option>
                    <option value="ITE+ITR" ${data.wallInsulation === "ITE+ITR" ? "selected" : ""}>ITE+ITR</option>
                </select>
            </div>
            <div class="col-sm form_hide form_floor_lower_wall form_floor_high_wall">
                <label for="bridgeFloorInsulation_${index}">Méthode d'isolation du plancher : :</label>
                <select class="form-select form-control typeInsulation floorInsulation form_hide form_floor_lower_wall form_floor_high_wall" style="width: 100%;"  data-index="${index}"   id="bridgeFloorInsulation_${index}">
                    <option value="no" ${data.floorInsulation === "no" ? "selected" : ""}>Non Isolé</option>
                    <option value="ITI" ${data.floorInsulation === "ITI" ? "selected" : ""}>ITI : Isolation par l'intérieur</option>
                    <option value="ITE" ${data.floorInsulation === "ITE" ? "selected" : ""}>ITE : Isolation par l'extérieur</option>
                    <option value="ITI+ITE" ${data.floorInsulation === "ITI+ITE" ? "selected" : ""}>ITI+ITE</option>
                </select>
            </div>
        </div>
        <div class="row form_hide form_floor_lower_wall form_floor_inter_wall form_floor_high_wall form_partition_wall">
            <div class="col-sm text-center">
            <figure id="svg">
                <svg width="200" height="230">
                    <defs>
                        <style>
                            .arrow { stroke: #fd7e14; stroke-width: 3; stroke-dasharray: 5,5; fill: none; }
                            .wall { fill: #6c757d; stroke: #343a40; stroke-width: 2; }
                            .insulation { fill: url(#hachures_${index}); opacity: 0.6; }
                            text { font-family: Arial, sans-serif; font-size: 12px; fill: #212529; }
                        </style>
                    </defs>

                    <!-- Labels for inside and outside -->
                    <text x="50" y="20" transform="rotate(-90,100,100)">Extérieur</text>
                    <text class="type_floor_inter_wall type_floor_lower_wall type_partition_wall" x="110" y="170" transform="rotate(-90,100,100)">Intérieur</text>
                    <text class="type_floor_inter_wall type_floor_high_wall type_partition_wall" x="10" y="170" transform="rotate(-90,100,100)">Intérieur</text> 
                    <defs>
                        <pattern id="hachures_${index}" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                            <line x1="0" y1="10" x2="10" y2="0" stroke="red" stroke-width="2" stroke-opacity="0.5" />
                        </pattern>
                        <pattern id="concrete_${index}" patternUnits="userSpaceOnUse" width="10" height="10">
                            <rect width="10" height="10" fill="gray"/>
                            <path d="M 0 0 L 10 10" stroke="darkgray" stroke-width="0.5"/>
                            <path d="M 10 0 L 0 10" stroke="darkgray" stroke-width="0.5"/>
                        </pattern>
                    </defs>
                    <!-- Mur principal -->
                    <rect x="80" y="30" width="40" height="160" fill="url(#concrete_${index})" stroke="black" stroke-width="1" />
                    <!-- Mur principal isolant -->
                    <rect class="walltype_itr" x="80" y="30" width="40" height="160" fill="url(#hachures_${index})" stroke="none" stroke-width="0" />
                    <rect class="walltype_iti" x="118" y="30" width="4" height="160" fill="red" visibility="hidden"/>
                    <rect class="walltype_ite" x="78" y="30" width="4" height="160" fill="red" visibility="hidden"/>
                    <!-- Mur principal text -->
                    <text class="type_floor_inter_wall type_floor_lower_wall" x="120" y="107" transform="rotate(-90,100,100)">Mur</text>
                    <text class="type_floor_high_wall" x="50" y="107" transform="rotate(-90,100,100)">Mur</text>

                    <!-- Plancher inter / mur refend -->
                    <rect class="type_floor_inter_wall type_partition_wall " x="95" y="105" width="100" height="30" fill="url(#concrete_${index})" stroke="black" stroke-width="1"/>
                    <!-- Flèche de transfert thermique -->
                    <path class="type_floor_inter_wall type_partition_wall arrow" d="M 140 90 Q 100 150 50 80" />
                    <line class="type_floor_inter_wall type_partition_wall arrow" x1="50" y1="80" x2="70" y2="90" stroke="black" stroke-width="2"/>
                    <line class="type_floor_inter_wall type_partition_wall arrow" x1="50" y1="80" x2="55" y2="105" stroke="black" stroke-width="2"/>
                    <path class="type_floor_inter_wall type_partition_wall arrow" d="M 140 145 Q 100 100 50 155" />
                    <line class="type_floor_inter_wall type_partition_wall arrow" x1="50" y1="155" x2="55" y2="125" stroke="black" stroke-width="2"/>
                    <line class="type_floor_inter_wall type_partition_wall arrow" x1="50" y1="155" x2="75" y2="150" stroke="black" stroke-width="2"/>
                    <!-- Légende planché -->
                    <text class="type_floor_inter_wall" x="100" y="125" >Plancher inter.</text>
                    <!-- Légende mur refend -->
                    <text class="type_partition_wall" x="110" y="125" >Mur refend</text>

                    <!-- Plancher bas -->
                    <rect class="type_floor_lower_wall" x="95" y="130" width="100" height="30" fill="url(#concrete_${index})" stroke="black" stroke-width="1"/>
                    <!-- Plancher bas isolent  -->
                    <rect class="floortype__floor_lower_wall__iti" x="120" y="128" width="75" height="4" fill="red" />
                    <rect class="floortype__floor_lower_wall__ite" x="120" y="158" width="75" height="4" fill="red" />
                    <!-- Flèche de transfert thermique -->
                    <path class="type_floor_lower_wall arrow" id="heat-arrow" d="M 140 120 Q 100 180 50 100" />
                    <line class="type_floor_lower_wall arrow" x1="50" y1="100" x2="75" y2="110" stroke="black" stroke-width="2"/>
                    <line class="type_floor_lower_wall arrow" x1="50" y1="100" x2="55" y2="130" stroke="black" stroke-width="2"/>
                    <!-- Légende planché  -->
                    <text class="type_floor_lower_wall" x="100" y="150" >Plancher bas</text>
                
                    <!-- Plancher haut -->
                    <rect class="type_floor_high_wall" x="95" y="50" width="100" height="30" fill="url(#concrete_${index})" stroke="black" stroke-width="1"/>
                    <!-- Plancher haut isolent  -->
                    <rect class="floortype__floor_high_wall__iti" x="120" y="48" width="75" height="4" fill="red" />
                    <rect class="floortype__floor_high_wall__ite" x="120" y="78" width="75" height="4" fill="red" />
                    <!-- Flèche de transfert thermique -->
                    <path class="type_floor_high_wall arrow" d="M 140 95 Q 100 40 50 95" />
                    <line class="type_floor_high_wall arrow" x1="50" y1="95" x2="55" y2="70" stroke="black" stroke-width="2"/>
                    <line class="type_floor_high_wall arrow" x1="50" y1="95" x2="75" y2="90" stroke="black" stroke-width="2"/>
                    <!-- Légende planché  -->
                    <text class="type_floor_high_wall" x="100" y="70" >Plancher haut</text>
                    <rect id="iti-plancher" x="120" y="127" width="75" height="3" fill="red" visibility="hidden"/>
                    <rect id="ite-plancher" x="120" y="160" width="75" height="3" fill="red" visibility="hidden"/>
                    <text class="type_floor_inter_wall type_floor_lower_wall type_floor_high_wall" x="50" y="210">Vue en coupe</text>
                    <text class="type_partition_wall" x="50" y="210">Vue du dessus</text>
                </svg>
            </figure>
            </div>
        </div>
        <div class="row bg-secondary text-muted p-1 opacity-75 form_hide form_floor_lower_wall form_floor_inter_wall form_floor_high_wall form_partition_wall">
            <div class="col-sm">
                <label for="k">Valeur k :</label>
                <div class="input-group">
                    <input type="number" class="form-control bridgeK" placeholder="Calculé automatiquement" step="0.1" id="bridgeK_${index}" data-index="${index}" value="${data.k}" readonly>
                    <span class="input-group-text">W/m.K</span>
                </div>
            </div>
            <div class="col-sm">
                <label for="pt">Perte thermique :</label>
                <div class="input-group">
                    <input type="number" class="form-control bridgePt" placeholder="Calculé automatiquement" step="0.1" id="bridgePt_${index}" data-index="${index}" value="${data.pt}" readonly>
                    <span class="input-group-text">W/°C</span>
                </div>
            </div>
        </div>
    </div>
    `);
}
/**
 * Résumé : Pont thermique, adapte le formulaire
 * Description : Modifie le formulaire en fonction du type de pont thermique
 */
 function bridgeFormChamge() {
    let typeBridge = $("#bridge_"+currentIndex+" .bridgeType").val();
    debug("typeBridge : " + typeBridge)
    if (typeBridge != '') {
        $("#bridge_"+currentIndex+" .form_hide").hide();
        $("#bridge_"+currentIndex+" .form_"+typeBridge).show();
    }else{
        $("#bridge_"+currentIndex+" .form_hide").hide();
    }
}
/**
 * Résumé : Pont thermique, Mise à jour du SVG 
 * Description : Mise à jour de l'illustration SVG en fonction des paramètres du formulaire de pont thermique
 */
function bridgeUpdateSvg() {
    debug("Update SVG")
    // Cacher les éléments
    $("#bridge_"+currentIndex+" [class^='type'], [class^='walltype'], [class^='floortype']").attr("visibility", "hidden");
    
    let typeBridge = $("#bridge_"+currentIndex+" .bridgeType").val();

    // Afficher les éléments du type en cours
    $("#bridge_"+currentIndex+" .type_"+typeBridge).attr("visibility", "visible");
    
    let wallInsulation = $("#bridge_"+currentIndex+" .wallInsulation").val();
    if (wallInsulation.includes("ITI")) {
        $("#bridge_"+currentIndex+" .walltype_iti").attr("visibility", "visible");
    }
    if (wallInsulation.includes("ITE")) {
        $("#bridge_"+currentIndex+" .walltype_ite").attr("visibility", "visible");
    }
    if (wallInsulation.includes("ITR")) {
        $("#bridge_"+currentIndex+" .walltype_itr").attr("visibility", "visible");
    }

    let floorInsulation = $("#bridge_"+currentIndex+" .floorInsulation").val();
    if (floorInsulation.includes("ITI")) {
        $("#bridge_"+currentIndex+" .floortype__"+typeBridge+"__iti").attr("visibility", "visible");
    }
    if (floorInsulation.includes("ITE")) {
        $("#bridge_"+currentIndex+" .floortype__"+typeBridge+"__ite").attr("visibility", "visible");
    }
}
function bridgeCalc() {
    debug('bridgeCalc');
    let typeBridge = $("#bridge_"+currentIndex+" .bridgeType").val();
    let wallInsulation = $("#bridge_"+currentIndex+" .wallInsulation").val();
    let floorInsulation = $("#bridge_"+currentIndex+" .floorInsulation").val();
    debug('Type bridge : '+typeBridge);
    let k = "";
    if (typeBridge == "floor_inter_wall") {
        k = settings.pontThermique.floor_inter_wall[wallInsulation] !== undefined ? settings.pontThermique.floor_inter_wall[wallInsulation] : "-";
    } else if (typeBridge == "floor_lower_wall") {
        k = settings.pontThermique.floor_lower_wall[wallInsulation] && settings.pontThermique.floor_lower_wall[wallInsulation][floorInsulation] ? settings.pontThermique.floor_lower_wall[wallInsulation][floorInsulation] : "-";
    } else if (typeBridge == "floor_high_wall") {
        k = settings.pontThermique.floor_high_wall[wallInsulation] && settings.pontThermique.floor_high_wall[wallInsulation][floorInsulation] ? settings.pontThermique.floor_high_wall[wallInsulation][floorInsulation] : "-";
    } else if (typeBridge == "partition_wall") {
        k = settings.pontThermique.partition_wall[wallInsulation] !== undefined ? settings.pontThermique.partition_wall[wallInsulation] : "-";
    } 
    $("#bridge_"+currentIndex+" .bridgeK").val(k);
    // Calcul PT
    bridgeLength = $("#bridge_"+currentIndex+" .bridgeLength").val();
    if ((k != '' || k != '-') && (bridgeLength != '' || bridgeLength != '0')) {
        let pt = bridgeLength * k * 0.5;
        debug("PT: "+pt);
        $("#bridge_"+currentIndex+" .bridgePt").val(precise_round(pt, 1));
    } else {
        $("#bridge_"+currentIndex+" .bridgePt").val(0);
    }
}

// Init select2 
// Dans document ready et i18n.app
function initSelect2() {
    $('.form-select').select2();

    // ********** Personnaliser Ubat_global (level2) en + des valeurs choisis
    // Populate an array of initial options.
    var options = $("#ubat_global option").map(function(){
        return this.value.toLowerCase();
    }).get();
    var recentlySelected = '';
    // Create select2
    $("#ubat_global").select2({
        tags: true,
        templateResult: formatTag
    });
    // formatTag to conditionally applies formatting
    function formatTag(filteredOption) {
        if (recentlySelected.toLowerCase() === filteredOption.text.toLowerCase()) {
            return filteredOption.text;
        }
        if (options.indexOf(filteredOption.text.toLowerCase()) === -1) {
            // Typed text wasn't an original option, prepend with '+' sign.
            if (filteredOption.text !== 'Searching…') {
            recentlySelected = filteredOption.text;
            }
            return '+ ' + filteredOption.text; 
        }
        return filteredOption.text;
    };
    $("#ubat_global").on( "change", function(e) {
        var re = new RegExp("^[0-9]\\.[0-9]+$");
        if (! re.test($("#ubat_global").val())) {
            $('#ubat_global option:eq(0)').prop('selected',true).trigger('change.select2');
            appAlert('Coefficient d\'isolation estimé (Ubat) invalid.', "danger");
        }
    });

    // Bug pour que la recherche du select2 fonctionne dans "dialog" : https://github.com/select2/select2/issues/1246#issuecomment-71710835
    if ($.ui && $.ui.dialog && $.ui.dialog.prototype._allowInteraction) {
        var ui_dialog_interaction = $.ui.dialog.prototype._allowInteraction;
        $.ui.dialog.prototype._allowInteraction = function(e) {
            if ($(e.target).closest('.select2-dropdown').length) return true;
            return ui_dialog_interaction.apply(this, arguments);
        };
    }
}

if (typeof $ !== 'undefined') {
    $(document).on('dialogopen', function(event) {
        const $target = event ? $(event.target) : null;
        if ($target && $target.length) {
            applyTranslations($target);
            const $widget = $target.closest('.ui-dialog');
            if ($widget.length) {
                applyTranslations($widget);
            }
        } else {
            applyTranslations();
        }
    });
}
