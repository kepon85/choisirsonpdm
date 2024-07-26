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
    $(".result").hide(); // Hide résult
    $("#submit_input").val(0); // Remise à 0 du résultat
    // SI c'est la latitude ou la longitude qui ont changé, on recherche la valeur dans l'API
    if (element != undefined && (element.name == 'lat' || element.name == 'lng')) {
        processChangelngLat();
    }
    hashChange();
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
        $('.wall-check-' + wallId).addClass('bg-warning-subtle');
        $('.wall-check-' + wallId).removeClass('bg-success-subtle');
        $('#wall-' + wallId + '-check-svg').hide();
        $('#wall-check-' + wallId).val(0);
    } else {
        $('.wall-check-' + wallId).removeClass('bg-warning-subtle');
        $('.wall-check-' + wallId).addClass('bg-success-subtle');
        $('#wall-' + wallId + '-check-svg').show();
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
        $('.window-check-' + wallId+'-'+winId).addClass('bg-warning-subtle');
        $('#wall-' + wallId + '-window-'+ winId +'-check-svg').hide();
        $('#wall-check-' + wallId+'-'+winId).val(0);
    } else {
        debug("window Ok");
        $('.window-check-' + wallId+'-'+winId).addClass('bg-success-subtle');
        $('.window-check-' + wallId+'-'+winId).removeClass('bg-warning-subtle');
        $('#wall-' + wallId + '-window-'+ winId +'-check-svg').show();
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
        $("#wall-r-" + wallId).val(0);
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
 * Résumé : Complète le sélect des matériaux pour l'ajout/modification paroi
 */
function wallTypeSelect(wallId) {
    debug("wallTypeSelect "+wallId);
    //Ajouter les custom-wall dans "wall-type" 
    $('.custom-wall-' + wallId).remove();
    $.each(localSetting.wall, function(index, data) {
        $('#wall-type-' + wallId + '-cath-custom').append('<option class="custom-wall-' + wallId + ' custom-wall" value="'+genOptionValue(data.idu, data.r)+'">'+data.title+'</option>'); 
    });  
    //$('#wall-type-' + wallId).trigger('change');
}




/**
 * Résumé : Rafraichir le sélect des matériaux 
 */
function wallTypeAllSelect() {
    debug('wallTypeAllSelect');
    $.each($('tr.walls'), function(index, tr) {
        var wallId = tr.id.split('-')[1];
        wallTypeSelect(wallId);
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
    localStorage.setItem('setting', JSON.stringify(localSetting));
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
    localStorage.setItem('setting', JSON.stringify(localSetting));
    customMaterialSelect();
    // Send
    if ($('#custom-material').val() != '') {
    //if ($('#material-forcontrib').prop('checked')) {
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
            + 'Commentaire : ' + $('#material-comment').val() + '<br />' 
            + '<br />' 
            + '"","' + $('#material-libelle').val() + '",'+$('#material-cath_id').val()+','+$('#material-generic').val()+','+$('#material-lambda').val()+','+$('#material-p').val()+','+$('#material-c').val()+','+$('#material-c').val()+','+$('#material-u').val()+','+$('#material-h').val()+','+$('#material-src-name').val()+','+$('#material-src-link').val()+','+$('#material-src-contrib').val();
        sendContact('noreply@poeledemasse.org', 'Contribution matériaux', body);
    //}
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
    $('html').i18n();
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
    $(".wall-type:not(.wall-type-bond)").addClass('wall-type-bond')
    .on( "change", function(e) {
        wallId = this.id.split('-')[2];
        if (this.value == 'new') {
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
    $('html').i18n();
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
            + '<td class="wall-check-' + wallId + '">'
                + '<input class="debug" type="hidden" id="wall-check-' + wallId + '" name="wall-check" value="0" />'
                + '<svg style="display: none;" id="wall-' + wallId + '-check-svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path class="bg-primary-subtle border border-primary-subtle " d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
            + '</td>'
            + '<td>'
                + '<input class="debug" type="hidden" id="wall-' + wallId + '-window-id" name="wall-' + wallId + '-window-id" value="0" />'
                + '<input type="text" class="form-control hashchange wall-perso" name="wall-name[]" id="wall-name-' + wallId + '" value=""  placeholder="Ex: Façade Sud" />'
            + '</td>'
            + '<td>'
                + '<select name="wall-type[]" id="wall-type-' + wallId + '" style="width: 100%;" class="wall-type form-select form-control hashchange">'
                    + '<option value="" selected="selected">-</option>'
                    + '<optgroup class="type-cath-custom" id="wall-type-' + wallId + '-cath-custom" label="Vos parois">'
                    + '<option value="new" data-i18n="wall-type-new-custom">Créer une paroi personnalisée</option>'
                    + '</optgroup>'
                    + '<option value="u" data-i18n="wall-type-u-perso">Valeur U personnalisée</option>'
                    + '<optgroup label="RT2012 Toiture">'
                    + '<option value="rt2012toit1_5.2">Combles aménageables ou rampants < 60° (H1A, H1B, H1C)</option>'
                    + '<option value="rt2012toit2_4.5">Combles aménageables ou rampants < 60° (H2A, H2B, H2C, H2D H3>800m)</option>'
                    + '<option value="rt2012toit3_4">Combles aménageables ou rampants < 60° (H3<800m)</option>'
                    + '<option value="rt2012toit4_4">Combles perdus</option>'
                    + '<option value="rt2012toit5_4.5">Toitures-terrasses (H1A, H1B, H1C)</option>'
                    + '<option value="rt2012toit6_4.3">Toitures-terrasses (H2A, H2B, H2C, H2D H3>800m)</option>'
                    + '<option value="rt2012toit7_4">Toitures-terrasses (H3<800m)</option>'
                    + '</optgroup>'
                    + '<optgroup label="RT2012 Mur">'
                    + '<option value="rt2012mur1_3.2">Murs et rampants > 60° (H1A, H1B, H1C)</option>'
                    + '<option value="rt2012mur2_3.2">Murs et rampants > 60° (H2A, H2B, H2C, H2D H3>800m)</option>'
                    + '<option value="rt2012mur3_2.2">Murs et rampants > 60° (H3<800m)</option>'
                    + '<option value="rt2012mur4_3.5">Murs sur volume non chauffé</option>'
                    + '</optgroup>'
                    + '<optgroup label="RT2012 Planchers">'
                    + '<option value="rt2012planc1_3">Planchers bas donnant sur parking collectif, sur extérieur, vide sanitaire ou volume non chauffé  (H1A, H1B, H1C)</option>'
                    + '<option value="rt2012planc2_3">Planchers bas donnant sur parking collectif, sur extérieur, vide sanitaire ou volume non chauffé  (H2A, H2B, H2C, H2D H3>800m)</option>'
                    + '<option value="rt2012planc3_2.1">Planchers bas donnant sur parking collectif, sur extérieur, vide sanitaire ou volume non chauffé  (H3<800m)</option>'
                    + '</optgroup>'
                    + '<optgroup label="RE2020 Mur">'
                    + '<option value="rt2012mur1_2.9">Mur en contact avec l’extérieur (H1A, H1B, H1C)</option>'
                    + '<option value="rt2012mur2_2.9">Mur en contact avec l’extérieur (H2A, H2B, H2C, H2D H3>800m)</option>'
                    + '<option value="rt2012mur3_2.2">Mur en contact avec l’extérieur (H3<800m)</option>'
                    + '<option value="rt2012mur4_2">Murs sur volume non chauffé</option>'
                    + '</optgroup>'
                    + '<optgroup label="RE2020 Toiture">'
                    + '<option value="rt2020toit1_4.4">Combles aménagés (isolation dans le rampant sous toiture) (H1A, H1B, H1C)</option>'
                    + '<option value="rt2020toit2_4.3">Combles aménagés (isolation dans le rampant sous toiture) (H2A, H2B, H2C, H2D H3>800m)</option>'
                    + '<option value="rt2020toit3_4">Combles aménagés (isolation dans le rampant sous toiture) (H3<800m)</option>'
                    + '<option value="rt2020toit4_4.8">Combles perdus (isolation sur le plancher des combles)</option>'
                    + '</optgroup>'
                    + '<optgroup label="RE2020 Planchers">'
                    + '<option value="rt2012planc1_2.7">Planchers bas donnant sur l’extérieur ou sur un local non chauffé (H1A, H1B, H1C)</option>'
                    + '<option value="rt2012planc2_2.7">Planchers bas donnant sur l’extérieur ou sur un local non chauffé (H2A, H2B, H2C, H2D H3>800m)</option>'
                    + '<option value="rt2012planc3_2.1">Planchers bas donnant sur l’extérieur ou sur un local non chauffé (H3<800m)</option>'
                    + '</optgroup>'
                + '</select>'
            + '</td>'
            + '<td class="wall-rsi-rse-popup text-center">'
                +'<input type="hidden" class="form-control hashchange" name="wall-rsi[]" id="wall-rsi-' + wallId + '" />'
                +'<span id="wall-rsi-' + wallId + '-val" class="wall-rse-val">'
                    +'<svg  id="wall-rse-' + wallId + '-chose" class="wall-rse-chose" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M160 64c0-8.8 7.2-16 16-16s16 7.2 16 16V200c0 10.3 6.6 19.5 16.4 22.8s20.6-.1 26.8-8.3c3-3.9 7.6-6.4 12.8-6.4c8.8 0 16 7.2 16 16c0 10.3 6.6 19.5 16.4 22.8s20.6-.1 26.8-8.3c3-3.9 7.6-6.4 12.8-6.4c7.8 0 14.3 5.6 15.7 13c1.6 8.2 7.3 15.1 15.1 18s16.7 1.6 23.3-3.6c2.7-2.1 6.1-3.4 9.9-3.4c8.8 0 16 7.2 16 16l0 16V392c0 39.8-32.2 72-72 72H272 212.3h-.9c-37.4 0-72.4-18.7-93.2-49.9L50.7 312.9c-4.9-7.4-2.9-17.3 4.4-22.2s17.3-2.9 22.2 4.4L116 353.2c5.9 8.8 16.8 12.7 26.9 9.7s17-12.4 17-23V320 64zM176 0c-35.3 0-64 28.7-64 64V261.7C91.2 238 55.5 232.8 28.5 250.7C-.9 270.4-8.9 310.1 10.8 339.5L78.3 440.8c29.7 44.5 79.6 71.2 133.1 71.2h.9H272h56c66.3 0 120-53.7 120-120V288l0-16c0-35.3-28.7-64-64-64c-4.5 0-8.8 .5-13 1.3c-11.7-15.4-30.2-25.3-51-25.3c-6.9 0-13.5 1.1-19.7 3.1C288.7 170.7 269.6 160 248 160c-2.7 0-5.4 .2-8 .5V64c0-35.3-28.7-64-64-64zm48 304c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304zm48-16c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304c0-8.8-7.2-16-16-16zm80 16c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304z"/></svg>'
                +'</span>'
            + '</td>'
            + '<td class="wall-rsi-rse-popup text-center">'
                + '<input type="hidden" class="form-control hashchange" name="wall-rse[]" id="wall-rse-' + wallId + '" />'
                + '<span id="wall-rse-' + wallId + '-val" class="wall-rse-val">'
                    + '<svg  id="wall-rse-' + wallId + '-chose" class="wall-rse-chose" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M160 64c0-8.8 7.2-16 16-16s16 7.2 16 16V200c0 10.3 6.6 19.5 16.4 22.8s20.6-.1 26.8-8.3c3-3.9 7.6-6.4 12.8-6.4c8.8 0 16 7.2 16 16c0 10.3 6.6 19.5 16.4 22.8s20.6-.1 26.8-8.3c3-3.9 7.6-6.4 12.8-6.4c7.8 0 14.3 5.6 15.7 13c1.6 8.2 7.3 15.1 15.1 18s16.7 1.6 23.3-3.6c2.7-2.1 6.1-3.4 9.9-3.4c8.8 0 16 7.2 16 16l0 16V392c0 39.8-32.2 72-72 72H272 212.3h-.9c-37.4 0-72.4-18.7-93.2-49.9L50.7 312.9c-4.9-7.4-2.9-17.3 4.4-22.2s17.3-2.9 22.2 4.4L116 353.2c5.9 8.8 16.8 12.7 26.9 9.7s17-12.4 17-23V320 64zM176 0c-35.3 0-64 28.7-64 64V261.7C91.2 238 55.5 232.8 28.5 250.7C-.9 270.4-8.9 310.1 10.8 339.5L78.3 440.8c29.7 44.5 79.6 71.2 133.1 71.2h.9H272h56c66.3 0 120-53.7 120-120V288l0-16c0-35.3-28.7-64-64-64c-4.5 0-8.8 .5-13 1.3c-11.7-15.4-30.2-25.3-51-25.3c-6.9 0-13.5 1.1-19.7 3.1C288.7 170.7 269.6 160 248 160c-2.7 0-5.4 .2-8 .5V64c0-35.3-28.7-64-64-64zm48 304c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304zm48-16c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304c0-8.8-7.2-16-16-16zm80 16c0-8.8-7.2-16-16-16s-16 7.2-16 16v96c0 8.8 7.2 16 16 16s16-7.2 16-16V304z"/></svg>'
                +'</span>'
            + '</td>'
            + '<td class="text-center"><input type="number" class="form-control hashchange text-center" min="0" step="0.1" name="wall-surface[]" id="wall-surface-' + wallId + '" value="0" /></td>'
            + '<td class="text-center"><input type="number" class="form-control hashchange text-center"  min="0" step="0.1"  name="wall-r[]" id="wall-r-' + wallId + '" value="0" disabled="disabled" /></td>'
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
    debug('Add une fenêtre ('+winId+') sur la paroi ' + wallId);

    // Check if existe...
    if ($("#wall-" + wallId + "-window-"+ winId).length != 0) {
        debug('La fenêtre avec l\'ID '+winId+', sur le mur '+wallId+' existe déjà...')
        return true;
    }

    $('#addWindow2Wall-' + wallId + '-button').before(
        '<tr id="wall-' + wallId + '-window-'+ winId +'" class="window-'+winId+' window-check">'
            + '<td>&rarr;</td>'
            + '<td class="window-check-' + wallId + '-'+ winId +'">'
                + '<input class="debug" type="hidden" id="wall-check-' + wallId + '-'+ winId + '" name="wall-check" value="0" />'
                + '<svg style="display: none;" id="wall-' + wallId + '-window-'+ winId +'-check-svg" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path class="bg-primary-subtle border border-primary-subtle " d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
            + '</td>'
            + '<td colspan="2"><input type="text" class="form-control hashchange" name="window-name[]" id="wall-name-' + wallId + '-window-'+ winId +'" value=""  placeholder="Ex: Fenêtre cuisine" /></td>'
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
            + '<td class="text-center"><input type="number" class="form-control hashchange text-center" min="0" step="0.1" name="window-surface[]" id="wall-surface-' + wallId + '-window-'+ winId +'" value="0" /></td>'
            + '<td class="text-center">'
                + '<button type="button" class="btn btn-danger delete-button window" onclick="detailBuildingDeleteWindows2Wall('+wallId+', '+winId+');">'
                    + '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>'
                + '</button>'
            + '</td>'
        + '</tr>'
    );
    $('#wall-type-' + wallId + '-window-'+ winId).select2();
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
                    $("#thermal-study").append(
                        '<div class="col-sm-6"><div class="card"><div class="card-body">'
                        + '<h6><span data-i18n="[html]thead-wall-name">Paroi</span> : '+$('#wall-name-'+wallId).val()+' (<span class="wall-'+wallId+'-and-window-loss-value"></span>W)</h6>' 
                        + '<ul>'
                            + '<li><span data-i18n="[html]thead-wall-type">Type</span> : '+$('#wall-type-'+wallId+' option:selected').text()+' (R = '+$('#wall-r-'+wallId).val()+' °C.m²/W)'
                                + '<ul id="wall-'+wallId+'-detail"></ul>'
                            + '</li>'
                            + '<li><span data-i18n="[html]thead-wall-rsi">Rsi</span>/<span data-i18n="[html]thead-wall-rse">Rse</span> : '+$('#wall-rsi-'+wallId).val()+' /  '+$('#wall-rse-'+wallId).val()+'</li>'
                            + '<li><span data-i18n="[html]wall-surface">Surface paroi</span> : '+$('#wall-surface-'+wallId).val()+'m2</li>'
                            + '<li><span data-toggle="tooltip" title="R + Rsi + Rse"><span data-i18n="[html]wall-rt">R total</span> : '+rt+'</span>°C.m²/W</li>'
                            + '<li id="wall-'+wallId+'-windows-parent"><span data-i18n="[html]windows">Fenêtre(s)</span> <span data-toggle="tooltip" title="Différence entre la température intérieure et extérieure (dite de base) (°C) * Perte total des fenêtres (W/°C)"><span data-i18n="[html]window-loss">Déperdition</span>=<span id="wall-'+wallId+'-window-loss-value"></span>W</span> : <ul id="wall-'+wallId+'-windows"></ul></li>'
                            + '<li><span data-toggle="tooltip" title="Surface de la paroi - la surface vitrée"><span data-i18n="[html]opaque-surface">Surface opaque</span> : <span id="wall-'+wallId+'-window-opaque-surface-value"></span>m<sup>2</sup></span></li>'
                            + '<li><span data-toggle="tooltip" title="Différence entre la température intérieure et extérieure (dite de base) (°C) / ( R total de la surface opaque (W/°C) / Surface opaque (m2) )"><span data-i18n="[html]wall-loss">Déperdition des surfaces opaques</span> : <span id="wall-'+wallId+'-loss-value"></span>W</span></li>'
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
                    wallPerte=($("#temp_indor").val()-$("#temp_base").val())/(rt/surfaceOpaque);
                    $('#wall-'+wallId+'-loss-value').html(precise_round(wallPerte, 0));
                    // Perte total de la paroi (fenêtre + opaque)
                    perteTotal=parseFloat(windowsPerteTotal)+parseFloat(wallPerte);
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
    $("#resDeperditionMax").html(precise_round(resDeperditionMax/1000, 2));
    $("#resDeperdition").val(resDeperditionMax);
    debug("Besoin de chauffage : " + resDeperditionMax + "Wh");
    suggestion();
    help();
    // Tooltip reset
    $('[data-toggle="tooltip"]').tooltip();
}


/**
 * Résumé : Récupère la température de base par API en fonction de la latitude et la longitude
 */
function getBaseTemperature(){
    if ($("#temp_base_auto").prop("checked") && $("#nav-tab-record").val() == 'nav-carte-tab' && $("#lat").val() != '' && $("#lng").val() != '') {
        debug('GET API baseTemperature');
        $.getJSON( settings.apiBaseTemperature+'?lat='+$("#lat").val()+'&lng='+$("#lng").val()+'&nbYearsArchive='+$("#temp_base_years_archive").val()) 
        .done(function( json ) {
            $("#temp_base").val(json.base);
            hashChange();
        })
        .fail(function( jqxhr, textStatus, error ) {
            appAlert('<span>Request Failed to get API base temperature : " + jqxhr.responseJSON.message + ". <b>Indicate there manually and contact the developer of this calculator</b></span>', "danger", 30);
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
    window.location.hash = hashnew;
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
        $(".temp_base_auto").show();
        // Seulement si on est sur la tab 
        if ($("#nav-tab-record").val() == 'nav-carte-tab') {
            processChangelngLat();
        }
    } else {
        $( "#lng" ).val('');
        $( "#lat" ).val('');
        $("#temp_base").prop('disabled', false);
        $(".temp_base_auto").hide();
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
    dialog = $( "#dialog-contact" ).dialog({
        overlay: { opacity: 0.1, background: "black" },
        width: 600,
        height: 450,
        modal: true,
        buttons: {
            Cancel: function() {
                dialog.dialog( "close" );
            },
            "Envoyer": function() {
                localStorage.setItem(returnSendContact, null);
                sendContact($('#contact-from').val(), $('#contact-subject').val(), $('#contact-body').val() + "\n\n" + document.location.href).done(function(data){
                    localStorage.setItem(returnSendContact,  data.return);
                });
                var returnSendContact = localStorage.getItem(returnSendContact);
                debug("Retour contact : "+returnSendContact)
                if (returnSendContact == "true") {
                    dialog.dialog( "close" );
                    appAlert('Message envoyé !', "success");
                } else {
                    appAlert("Error");
                }
                localStorage.removeItem(returnSendContact);
            }
        },
        open: function() {
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').addClass('btn btn-secondary');
            $('.ui-dialog-buttonpane').find('button:contains("Envoyer")').addClass('btn btn-primary');
        }
    });
}

// Help card juste pour les français... le forum est francophone...
function help() {
    debug("Help ?");
    var userLang = navigator.language || navigator.userLanguage;
    debug('Help : detect locale user : '+userLang.split('-')[0]);
    if(userLang.split('-')[0] == 'fr' || localStorage.getItem('i18n') == 'fr') {
        debug("Help show");
        // Préparatin du lien
        var body_avec_url = encodeURI(settings.help.body);
        var body_avec_url = settings.help.body.replace("___URL___", window.location);
        //Bug avec :// ça supprime un slash... certainement bug avec Discors
        var body_avec_url = body_avec_url.replace(":","%3A");
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