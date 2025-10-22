$( document ).ready(function() {
    debug( "ready !" );
    
    // Init global var
    apiMateriauxData=null;

    // Load localStorage setting
    if (localStorage.getItem('setting') == null) {
        localStorage.setItem('setting', JSON.stringify(settings.localSettingDefault));
    }
    localSetting=JSON.parse(localStorage.getItem('setting'));
    // Rupture de compatibilité localSetting 1
    if (localSetting.version == 1) {
        localStorage.setItem('setting', JSON.stringify(settings.localSettingDefault));
    }
    debug("Local setting : ");
    debug(localSetting);
    

    ////////////////////////////////////
    // HASH URL (remplir les champs)
    ////////////////////////////////////
    
    $("#app-alert").on( "click", function() {
        $("#app-alert").hide();
    });

    initSelect2();

    // Debug on
    if (settings.debug) {
        debug("Show class debug")
        $('.debug').show();
    }

    ////////////////////////
    // Form comportement
    ////////////////////////
    $("#level").on( "change", function(e) {
        changeLevel($("#level").val());
    });
    $("#temp_base_auto").on( "change", function(e) {
        tempBaseChangeMode();
    });
    $(".temp_base_param_plus").hide();
    $("#temp_base_param_plus").on( "click", function(e) {
        $("#temp_base_param_plus").hide();
        $(".temp_base_param_plus").show();
    });
    $("#livingvolume_auto").on( "change", function(e) {
        livingVolumeChangeMode();
    });
    $(".livingvolumecalc").on( "change", function(e) {
        calcVolume();
        $("#livingvolume_auto").prop('checked', true);
    });
    $(".temp_base_change").on( "change", function(e) {
        processChangelngLat();
    });

    // Default value
    //-Par le hash de l'URL
    var hash = window.location.hash.slice(1);
    var submit_input=0;
    let reWall = /^wall-(?<param>[a-z]+)-(?<wallId>[0-9]+)$/u;
    let reWallWin = /^wall-(?<param>[a-z]+)-(?<wallId>[0-9]+)-window-(?<winId>[0-9]+)$/u;
    let reInputSumbit = new RegExp("submit_input=1");
    if (hash) {
        debug('hash : ' + hash);
        if (hash == 'opendata') {
            openData();
        } else {
            // Si on a un submit dans le hash on le mémorise pour la suite
            if (reInputSumbit.test(hash)) {
                submit_input=1;
            }
            //Parse hash pour si un localWall est passé en paramètre il faut l'ajouter préalablement au remplissage du formulaire
            var result = hash.split('&').reduce(function (res, item) {
                var parts = item.split('=');
                res[parts[0]] = parts[1];
                var re = new RegExp("^localWall-[0-9]+$");
                if (re.test(parts[0])) {
                    debug('Param localWall du hash ' + parts[0]);
                    var localWall = JSON.parse(decodeURIComponent(parts[1]));
                    debug(localWall);
                    // La paroi n'existe pas en local, on l'a crée
                    if ((isLocalWallId(localWall.idu)) === false) {
                        debug("N'existe pas, on l'a crée !");
                        localSetting.wall.push(localWall);
                        localStorage.setItem('setting', JSON.stringify(localSetting));
                    }
                }
                return res;
            }, {});
            //Parse hash pour le reste, split et complete
            var result = hash.split('&').reduce(function (res, item) {
                var parts = item.split('=');
                res[parts[0]] = parts[1];
                debug('Param du hash ' + parts[0]);
                // Si c'est un Ubat_global perssonalisé il y a un traitement spécifique
                if (parts[0] == "ubat_global") {
                    // Set the value, creating a new option if necessary
                    if ($('#ubat_global').find("option[value='" + parts[1] + "']").length) {
                        $('#ubat_global').val(parts[1]).trigger('change');
                    } else { 
                        // Create a DOM Option and pre-select by default
                        var newOption = new Option(parts[1], parts[1], true, true);
                        // Append it to the select
                        $('#ubat_global').append(newOption).trigger('change');
                    } 
                }
                //
                // WALL/WIN  PRE  traitement
                //
                // Détecter si c'est pour un mur : 
                let wallRe = reWall.exec(parts[0]);
                if (wallRe != null && typeof wallRe == 'object') {
                    debug('C\'est pour un mur');
                    debug(wallRe.groups.wallId);
                    detailBuildingAddWall(wallRe.groups.wallId);
                    if (wallRe.groups.param == "rsi" && parts[1] != '') {
                        $('#wall-rsi-' + wallRe.groups.wallId + '-val').html(parts[1]);
                    }
                    if (wallRe.groups.param == "rse" && parts[1] != '') {
                        $('#wall-rse-' + wallRe.groups.wallId + '-val').html(parts[1]);
                    }
                    if (wallRe.groups.param == "bridge" && parts[1] != '') {
                        bridges = parts[1]
                        try {
                            bridges = JSON.parse(decodeURIComponent(parts[1]));
                        } catch (e) {
                            console.error("Erreur lors du parsing JSON :", e);
                            bridges = []; // En cas d'erreur de parsing, définir comme un tableau vide
                        }
                        let totalPt = bridges.reduce((sum, item) => sum + parseFloat(item.pt), 0);
                        $('#wall-bridge-' + wallRe.groups.wallId + '-val').html(totalPt);
                    }
                }
                // Détecter si c'est pour une fenêtre : 
                let winRe = reWallWin.exec(parts[0]);
                if (winRe != null && typeof winRe == 'object') {
                    debug('C\'est pour une fenêtre');
                    debug(winRe.groups.winId);
                    detailBuildingAddWindows2Wall(winRe.groups.wallId, winRe.groups.winId);
                }
                if ($("#"+parts[0]) !== undefined) {
                    if ($("#"+parts[0])[0] !== undefined && $("#"+parts[0])[0].type == "checkbox") {
                        $("#"+parts[0]).prop("checked", parts[1]);
                    } else {
                        $("#"+parts[0]).val(decodeURI(parts[1]));
                    }
                }
                //
                // WALL/WIN  POST  traitement
                //
                // Détecter si c'est pour un mur : 
                if (wallRe != null && typeof wallRe == 'object') {
                    if (wallRe.groups.param == "type") {
                        wallTypeUperso(wallRe.groups.wallId);
                    }
                    wallCheck(wallRe.groups.wallId)
                    refreshDetailBuildingChange();
                }
                // Détecter si c'est pour une fenêtre : 
                if (winRe != null && typeof winRe == 'object') {
                    winCheck(winRe.groups.wallId, winRe.groups.winId)
                    refreshDetailBuildingChange();
                }
                return res;
            }, {});
            debug('result' + result);
        }
        $('.wall-type').trigger('change');
        $('.window-type').trigger('change');
        $('.form-select').trigger('change.select2');
        $('#ubat_global').trigger('change.select2');
    }
    //-Sinon par le setting
    Object.entries(settings.form_default).forEach(entry => {
        const [key, value] = entry;
        debug('Default value for ' + key + ' = ' + value);
        if ($("#"+key).type == "checkbox") {
            $("#"+key).prop("checked", value);
        } else {
            // 
            var regexObj = new RegExp(key)
            if (!regexObj.test(hash)) {
                $('#'+key).val(value);
            }
        }
    });

    if (submit_input == 1) {
        debug("submit_input == 1 !");
        $("#submit_input").val(1);
        submitForm();
    }

    // Init des boutton de partages
    sharingButton();
    
    // Switch level
    changeLevel($("#level").val());
    // Gestion de l'affichage
    // Switch tab map (si nav-tab-record renseigné)
    if ($('#nav-tab-record').val() != '') {
        $('#'+$('#nav-tab-record').val()).tab('show');
    }
    // Mode auto/manuel
    tempBaseChangeMode();
    livingVolumeChangeMode();
    
    // Si le formulaire change, on change le hash
    debug('Add listener hashchange');
    hashchangeListener();

    

    // Pour le reset du formulaire on retourne à la racine
    $("#reset").on( "click", function(e) {
        debug('Reset');
        clearCurrentStudyState();
        location.href='/';
    });

    $("#tinyUrlBtn").on( "click", function(e) {
        debug('tinyUrlBtn');
        handleTinyUrl();
    });
    

    // Enregistrement du click sur une tab pour la carte
    $("#nav-tab").on("click", function (e) {
        $('#nav-tab-record').val($(".nav-link.active").attr('id'));
        // Changement de tab/carte, on met la température de base à 0
        $( "#temp_base" ).val('');
        if ($(".nav-link.active").attr('id') == 'nav-carte-tab' &&
             $("#lat").val() != '' && 
             $("#lng").val() != '') {        
                // Si c'est la carte auto et qu'une latitude/longitude est renseigné alors on récupère la température de base
                processChangelngLat();
        }
        hashchangeAllAction();
    });

    ////////////////////////////
    // Expert mode - formulaire
    ////////////////////////////
    
    // Ajout de la première ligne si inexistante
    
    if ($('#tabke-level3-detail-building > tbody > tr').length <= 1) {
        debug("ici");
        detailBuildingAddWall();
    }
    //

    // Draggable/sortable mode pour les lignes de fenêtres
    $( ".window-table tbody" ).sortable({
        update: function(event, ui) {
            hashchangeAllAction();
        }
    });

    // Afficher plus de détail sur les champs de matériaux (contribution)
    $("#materialMore").on( "click", function(e) {
        $('#materialMoreDiv').show();
        $('#materialMore').hide();
    });

    ////////////////////////////
    // Expert mode - Setting
    ////////////////////////////

    // Import/export 
    // Export
    $( "#setting-export" )
    .on( "click", function() {
        //$("#data").click(function() {
        $("<a />", {
            "download": settings.appShortName+"-settings.json",
            "href" : "data:application/json," + encodeURIComponent(JSON.stringify(localSetting))
          }).appendTo("body")
          .click(function() {
             $(this).remove()
          })[0].click()
    });
    // import
    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }
    $("#setting-import").on('change',function(e){
        $('#loadData').show();
        var file =  e. target. files[0];
        var path = (window.URL || window.webkitURL).createObjectURL(file);
        readTextFile(path, function(text){
            var data = JSON.parse(text);
            debug(data);
            // import dans le localstorage
            localStorage.setItem('setting', JSON.stringify(data));
            // Reload page
            location.reload();
        });
      });
    
    // Draggable/sortable mode pour le tableau de paroi
    $( "#tabke-layer tbody" ).sortable();

    // Compléter matériaux et paroi personnalisé (select)
    customMaterialSelect();
    customWallSelect();

    // Dialog / popup pont  thermique
    $("#bridgeForms").on("change", ".bridgeType", function() {
        debug('Changement de type de pont thermique');
        bridgeFormChamge();
        bridgeUpdateSvg();
        bridgeCalc();
    });
    $("#bridgeForms").on("change", ".typeInsulation", function() {
        bridgeUpdateSvg();
        bridgeCalc();
    });
    $("#bridgeForms").on("change", ".bridgeLength", function() {
        bridgeCalc();
    });
    $("#addBridge").click(() => {
        let index = bridges.length;
        let newBridge = { name: "", type: "", length: "0", wallInsulation: "no", floorInsulation: "no", k: "", pt: 0 };
        bridges.push(newBridge);
        addBridgeForm(index, newBridge);
        showBridgeForm(index);
        bridgeFormChamge();
        bridgeUpdateSvg();
        bridgeCalc();
    });
    $("#prevBridge").click(() => {
        if (currentIndex > 0) showBridgeForm(currentIndex - 1);
        bridgeFormChamge();
        bridgeUpdateSvg();
    });
    $("#nextBridge").click(() => {
        if (currentIndex < bridges.length - 1) showBridgeForm(currentIndex + 1);
        bridgeFormChamge();
        bridgeUpdateSvg();
    });
    $("#finishBridge").click(() => {
        $(".bridgeForm").each((index, form) => {
            let name = $(form).find(".bridgeName").val();
            let type = $(form).find(".bridgeType").val();
            let length = $(form).find(".bridgeLength").val();
            let wallInsulation = $(form).find(".wallInsulation").val();
            let floorInsulation = $(form).find(".floorInsulation").val();
            let k = $(form).find(".bridgeK").val();
            let pt = $(form).find(".bridgePt").val();
            bridges[index] = { name, type, length, wallInsulation, floorInsulation, k, pt };
        });
        let jsonData = JSON.stringify(bridges);
        debug(jsonData);
        //$("#debug").val(jsonData+'\n\n'+encodeURIComponent(jsonData));
        wallId=$('#wall-id-for-bridge').val();
        // Ecrire ça dans l'input du tableau
        $("#wall-bridge-"+wallId).val(jsonData);
        let totalPt = bridges.reduce((sum, item) => sum + parseFloat(item.pt), 0);
        $('#wall-bridge-' + wallId + '-val').html(totalPt);
        $( "#dialog-bridge" ).dialog( "close" );
        hashchangeAllAction();
        wallCheck(wallId);
    });
    

    // Delete materiaux
    $( "#delete-custom-wall" )
    .on( "click", function() {
        if ($('#custom-wall').val() != '')  {
            debug('Suppresion d\'une paroi '+$('#custom-wall').val());
            // Delete DATA
            localSetting.wall.splice($('#custom-wall').val(), 1)
            // Sauvegarde
            localStorage.setItem('setting', JSON.stringify(localSetting));
            // Refresh
            appAlert('Supprimé !', "success");
            customWallSelect();
            wallTypeAllSelect();
        } else {
            appAlert('Sélectionner une paroi dans la liste', 'warning')
            return false;
        }
    });
    // Dialog pour les custom-wall
    $( "#add-custom-wall, #modify-custom-wall" )
    .on( "click", function() {
        getMateriauxData();
        if (this.id == 'modify-custom-wall') {
            if ($('#custom-wall').val() != '')  {
                debug('Modification de la paroi '+$('#custom-wall').val());
                // Load DATA
                debug(localSetting.wall[$('#custom-wall').val()]);
                $('#wall-custom-title').val(localSetting.wall[$('#custom-wall').val()].title);
                // Reset du formulaire
                $('.layers').remove();
                $.each(localSetting.wall[$('#custom-wall').val()].layer, function(index, data) {
                    addLayer(index);
                    $('#layer-type-' + index).prepend('<option class="type-modify" id="layer-type-' + index + '-modify" value="'+genOptionValue(data.idu, data.lambda)+'" selected="selected">'+data.material+'</option>');
                    $('#layer-size-' + index).val(data.size);
                    $('#layer-lambda-' + index).val(data.lambda);
                    layerCheck(index);
                });
                
            } else {
                appAlert('Sélectionner une paroi dans la liste')
                return false;
            }
        } else {
            debug('Ajout d\'une nouvelle paroi');
            // Pour être sûr de ne pas confondre modification et ajout
            $('#custom-wall').val("");
            $('#custom-wall').trigger('change'); 
            // Mise à 0 du formulaire
            $('#wall-custom-title').val('');
            $('#layer-id').val(0);
            $('.layers').remove();
            // Ajout d'une ligne vierge
            addLayer();
            layerCheck(1);
        }
        // Aficher le popup
        var wWidth = $(window).width();
        var dWidth = wWidth * 0.9;
        var wHeight = $(window).height();
        var dHeight = wHeight * 0.9;
        dialog = $( "#dialog-custom-wall" ).dialog({
            overlay: { opacity: 0.1, background: "black" },
            width: dWidth,
            height: dHeight,
            modal: true,
            open: function () {
                // Pour le fonctionnement avec "select2"
                if ($.ui && $.ui.dialog && !$.ui.dialog.prototype._allowInteractionRemapped && $(this).closest(".ui-dialog").length) {
                    if ($.ui.dialog.prototype._allowInteraction) {
                        $.ui.dialog.prototype._allowInteraction = function (e) {
                            if ($(e.target).closest('.select2-drop').length) return true;
        
                            if (typeof ui_dialog_interaction!="undefined") {
                                return ui_dialog_interaction.apply(this, arguments);
                            } else {
                                return true;
                            }
                        };
                        $.ui.dialog.prototype._allowInteractionRemapped = true;
                    }
                    else {
                        $.error("You must upgrade jQuery UI or else.");
                    }
                }
            },
            _allowInteraction: function (event) {
                return !!$(e.target).closest('.ui-dialog, .ui-datepicker, .select2-drop').length;
            },
            buttons: {
                "Signaler une erreur": function() {
                    debug('Signaler une erreur');
                    //dialog.dialog( "close" );
                    $('.contact').click();
                },
                Cancel: function() {
                    dialog.dialog( "close" );
                },
                "Valider": function() {
                    //layer-custom-id SI pas 0 = enregistrement nouvel !
                    var returnValidCustomWall = validCustomWall();
                    if (returnValidCustomWall == true) {
                        dialog.dialog( "close" );
                        appAlert('Ajouté !', "success");
                        // Si on est passé par une paroi (le select) et non un bouton, on la sélectionne après sa création
                        if ($( "#add-custom-wall-in-type-select").val() != '') {
                            debug($( "#wall-type-" + $( "#add-custom-wall-in-type-select").val()).val());
                            var textToFind = $('#wall-custom-title').val();
                            debug('Option find : '+textToFind);
                            selectOptionByText("wall-type-" + $( "#add-custom-wall-in-type-select").val(), textToFind);
                            $( "#wall-type-" + $( "#add-custom-wall-in-type-select").val()).trigger('change');
                            $( "#add-custom-wall-in-type-select").val('');
                        }
                    } else {
                        appAlert(returnValidCustomWall);
                    }
                }
              },
            open: function() {
                $('.ui-dialog-buttonpane').find('button:contains("Signaler une erreur")').addClass('btn btn-secondary');
                $('.ui-dialog-buttonpane').find('button:contains("Cancel")').addClass('btn btn-secondary');
                $('.ui-dialog-buttonpane').find('button:contains("Valider")').addClass('btn btn-primary');
            }

        });
    });
    // Afficher/Masquer les éléments en cas de contribution matériaux
    $( "#material-forcontrib" ).on( "click", function() {
        $( ".forcontrib" ).toggle();
    });

    // Delete materiaux
    $( "#delete-custom-material" )
    .on( "click", function() {
        if ($('#custom-material').val() != '')  {
            debug('Suppresion d\'un matériaux '+$('#custom-material').val());
            // Delete DATA
            localSetting.material.splice($('#custom-material').val(), 1)
            // Sauvegarde
            localStorage.setItem('setting', JSON.stringify(localSetting));
            appAlert('Supprimé !', "success");
            // Refresh
            customMaterialSelect();
        } else {
            appAlert('Sélectionner un matériaux dans la liste')
            return false;
        }
    });
    // Dialog pour les custom-material (ajout/modification)
    $( "#add-custom-material, #modify-custom-material" )
    .on( "click", function() {
        getMateriauxData();
        materialCathSelect();
        // Proposer contribution
        $( ".forcontrib-checkbox" ).show();
        $( ".forcontrib" ).show();
        $( "#material-forcontrib" ).prop( "checked", true );
        if (this.id == 'modify-custom-material') {
            if ($('#custom-material').val() != '')  {
                debug('Modification d\'un matériaux '+$('#custom-material').val());
                // Load DATA
                debug(localSetting.material[$('#custom-material').val()]);
                $('#material-libelle').val(localSetting.material[$('#custom-material').val()].libelle);
                $('#material-generic').val(localSetting.material[$('#custom-material').val()].generic);
                $('#material-cath_id').val(localSetting.material[$('#custom-material').val()].cath_id);
                $('#material-lambda').val(localSetting.material[$('#custom-material').val()].spec.lambda);
                $('#material-p').val(localSetting.material[$('#custom-material').val()].spec.p);
                $('#material-c').val(localSetting.material[$('#custom-material').val()].spec.c);
                $('#material-u').val(localSetting.material[$('#custom-material').val()].spec.u);
                $('#material-h').val(localSetting.material[$('#custom-material').val()].spec.h);
            } else {
                appAlert('Sélectionner un matériaux dans la liste', 'warning');
                return false;
            }
        } else {
            debug('Ajout d\'un materiau');
            // Pour être sûr de ne pas confondre modification et ajout
            $('#custom-material').val("");
            $('#custom-material').trigger('change'); 
            // Mise à 0 du formulaire
            $('#material-libelle').val('');
            //$('#material-generic').val('');
            //$('#material-cath_id').val('');
            $('#material-lambda').val('');
            $('#material-p').val('');
            $('#material-c').val('');
            $('#material-u').val('');
            $('#material-h').val('');
        }
        // Aficher le popup
        dialog = $( "#dialog-custom-material" ).dialog({
            overlay: { opacity: 0.1, background: "black" },
            width: 500,
            height: 500,
            modal: true,
            buttons: {
                Cancel: function() {
                    dialog.dialog( "close" );
                },
                "Valider": function() {
                    var returnValidCustomMaterial = validCustomMaterial();
                    if (returnValidCustomMaterial == true) {
                        dialog.dialog( "close" );
                        appAlert('Ajouté !', "success");
                    } else {
                        appAlert(returnValidCustomMaterial, 'danger', 30);
                    }
                }
              },
            open: function() {
                $('.ui-dialog-buttonpane').find('button:contains("Cancel")').addClass('btn btn-secondary');
                $('.ui-dialog-buttonpane').find('button:contains("Valider")').addClass('btn btn-primary');
            }
        });
    });

    ////////////////////////////
    // Contrôle
    ////////////////////////////

    // Remplace la "," par un point dans les champs number
    $('input[type="number"]').on( "focusout", function() {
        $(this).val($(this).val().replace(/,/, '\.'));
    });

    // Si on "submit" le formulaire
    $("#submit_button").on( "click", function(e) {
        debug("Click submit");
        if ($('#temp_base').val() == '') {
            appAlert("Basal temperature not preset. Choose your location on the map.", "danger");
            return false;
        } else if($("form")[0].checkValidity()) {
            submitForm();
            return false;
        } else {
            error=0;
            // Pour afficher les erreurs HTML5 dans le appAlert (plus jolie)
            $('.level'+$("#level").val()+'required').each(function(){
                if (! this.checkValidity()) {
                    appAlert($('label[for="'+this.id+'"]')[0].innerText + ' : ' + this.validationMessage, 'danger');
                    error++;
                } 
            })
            // Et si elle n'ont pas été trouvé dans ce qui est requis (exemple lettre dans longitude qui est masqué)
            if (error == 0) {
                $('.form-control').each(function(){
                    if (! this.checkValidity()) {
                        appAlert($('label[for="'+this.id+'"]')[0].innerText + ' : ' + this.validationMessage, 'danger');
                        error++;
                    } 
                })
            }
            debug("HTML5 : invalid form. Error : " + error);
        }
    });

    ////////////////////////////
    // Résultat
    ////////////////////////////
    $("#calcShowHide").on( "click", function(e) {
        $(".calcul_level"+$("#level").val()).toggle();
        debug("toggle calcul " + $("#level").val());
    });
    $("#calcConsoShowHide").on( "click", function(e) {
        $(".calcul_conso").toggle();
        debug("toggle calcul conso");
    });
    
    ////////////////////////////
    // Contact
    ////////////////////////////
    $( ".contact" ).on( "click", function() {
        debug('Contact click');
        contactShow();
    });

    ////////////////////////////
    // Saved studies
    ////////////////////////////
    $('#study-save-name').on('input', function() {
        $(this).removeClass('is-invalid');
    });

    updateStudyMenuState();

    $('#study-save-action').on('click', function(e) {
        e.preventDefault();
        openStudySaveDialog('local');
    });

    $('#study-save-device-action').on('click', function(e) {
        e.preventDefault();
        openStudySaveDialog('device');
    });

    $('#study-open-action').on('click', function(e) {
        e.preventDefault();
        if ($(this).hasClass('disabled')) {
            return;
        }
        openStudyOpenDialog();
    });

    $('#study-open-device-action').on('click', function(e) {
        e.preventDefault();
        $('#study-import-file').trigger('click');
    });

    $('#study-share-action').on('click', function(e) {
        e.preventDefault();
        handleTinyUrl();
    });

    $('#study-settings-import-action').on('click', function(e) {
        e.preventDefault();
        if ($('#level').val() == '3') {
            $('#setting-import').trigger('click');
        }
    });

    $('#study-settings-export-action').on('click', function(e) {
        e.preventDefault();
        if ($('#level').val() == '3') {
            $('#setting-export').trigger('click');
        }
    });

    $('#study-import-file').on('change', function(event) {
        handleStudyImportFromFile(event);
    });

    $('#study-open-list').on('click', '.study-open-open', function() {
        const name = $(this).data('study-name');
        if (name) {
            loadStudyByName(name);
        }
    });

    $('#study-open-list').on('click', '.study-open-delete', function() {
        const name = $(this).data('study-name');
        if (name) {
            deleteStudyByName(name);
        }
    });

    ////////////////////////////
    // Pint 
    ////////////////////////////
    $( ".topdf" ).on( "click", function() {
        debug('Pdf click');
        generatePDF($(this).data("topdf-id"), $(this).data("topdf-file")) ;
    });

    ////////////////////////////
    // INCLUDE SRC JAVASCRIPT
    ////////////////////////////
    Object.entries(settings.includeJavascript).forEach(entry => {
        const [key, value] = entry;
        debug('Include js' + value);
        const includeJavascript = document.createElement('script');
        includeJavascript.src = value;
        includeJavascript.id = key;
        includeJavascript.onload = () => {
            debug(key + ' : script loaded successfuly');
        };
        includeJavascript.onerror = () => {
            debug(key + ' : error occurred while loading common script');
        };
        document.body.appendChild(includeJavascript);
    });

    // Map NF
    $( "#altitude" ).on( "change", function() {
        var zone = $('#zone').val();
        if (zone != '') {
            temperatureBaseNFDetermine();
        }
    } );
    $( "#mapnfarea area" ).on( "click", function() {
        console.log("zone:"+$(this).data("zone"));
        console.log("dept:"+$(this).data("dept"));
        $('#zone').val($(this).data("zone"));
        temperatureBaseNFDetermine();
    } );

    ////////////////////////
    // MAPBOX
    ////////////////////////
    if (!settings.debugLoadMap) {
        // Change de comportement si marker présent par défaut
        var justClick = true;
        // Set Longitude/latitude 
        function setLocalLngLat(lng, lat){
            lat = precise_round(lat, 6);
            lng = precise_round(lng, 6);
            var newData = {'lng': lng, 'lat': lat};
            $( "#lng" ).val( lng );
            $( "#lat" ).val( lat );	
            localStorage.setItem('lngLat', JSON.stringify(newData));
            processChangelngLat();
            hashChange();
        }
        mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vwb24tcGRtIiwiYSI6ImNsam91MzF4ejAyYXMzZHA3YzJocnZjemIifQ.Lx-TCB9dD9R_3EhNH7Wf_Q';
        // Position de la carte par défaut
        var lng = 3;
        var lat =47;
        var zoom = 4;
        var markerDefault = false;
        // Priorité au GET (hash)
        if ($( "#lng" ).val() != '' && $( "#lat" ).val()) {
            lng = $( "#lng" ).val();
            lat = $( "#lat" ).val();
            zoom = 8;
            markerDefault = true;
            getBaseTemperature();
        // Ensuite le localStorage
        } else if (localStorage.getItem('lngLat')) {
            debug('Load localStorage');
            var storageLngLat = JSON.parse(localStorage.getItem('lngLat'));
            lng = storageLngLat.lng;
            $( "#lng" ).val(lng);
            lat = storageLngLat.lat;
            $( "#lat" ).val(lat);
            zoom = 8;
            markerDefault = true;
            getBaseTemperature();
        }
        // Init de la cart
        var map = new mapboxgl.Map({
            container: 'map', // container id
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat], // starting position
            zoom: zoom // starting zoom
        });
        // Init recherche par geocoder
        const geocoder = new MapboxGeocoder({
            mapboxgl: mapboxgl,                                                                               
            accessToken: mapboxgl.accessToken,
            marker: false
        })
        // Quand un résultat est trouvé
        geocoder.on('result', e => {
            // On arrête de toucher au click
            justClick = false;
            // On ajoute la navigation 
            map.addControl(new mapboxgl.NavigationControl());
            // On enregistre la position de la recherche
            setLocalLngLat(e.result.center[0], e.result.center[1], 6);
            // On ajoute un marker draggable sur le point de la recherche
            const marker = new mapboxgl.Marker({
                draggable: true
            }).setLngLat(e.result.center).addTo(map)
            // A chaque fois que le marker est déplacer
            marker.on('dragend', e => {
                // on enregistre sa position
                setLocalLngLat(e.target._lngLat.lng, e.target._lngLat.lat);
            })
        })
        map.addControl(geocoder)
        // Si j'ai une position d'enregistré ou de passé  en paramètre
        if (markerDefault == true) {
            // Je crée un maker sur cette position
            const markerClick = new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .addTo(map);
            // On ajoute la navigation 
            map.addControl(new mapboxgl.NavigationControl());
            // Si on click sur la carte, on enregistre la position du nouveau marqueur
            function add_marker (event) {
                if (justClick == true) {
                    var coordinates = event.lngLat;
                    setLocalLngLat(coordinates.lng, coordinates.lat);
                    markerClick.setLngLat(coordinates).addTo(map);
                }
            }
            map.on('click', add_marker);
        }
    } else {
        $('#map').css("background-color","grey");
        $('#map').text("Disable by settings.debugLoadMap");
    }

    // Tooltips (infobule)
    $('[data-toggle="tooltip"]').tooltip();

    // Loader a cacher quand tout est fait
    $('#loadData').hide();

    
});
