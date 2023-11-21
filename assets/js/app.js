$( document ).ready(function() {
    debug( "ready !" );

    // Init global var
    apiMateriauxData=null;

    // Load localStorage setting
    if (localStorage.getItem('setting') == null) {
        localStorage.setItem('setting', JSON.stringify(settings.localSettingDefault));
    } 
    localSetting=JSON.parse(localStorage.getItem('setting'));
    debug("Local setting : ");
    debug(localSetting);

    ////////////////////////////////////
    // HASH URL (remplir les champs)
    ////////////////////////////////////
    
    $("#app-alert").on( "click", function() {
        $("#app-alert").hide();
    });

    $('.form-select').select2();


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
        if ($("#temp_base_auto").prop("checked")) {
            $("#temp_base").prop('disabled', true);
            $(".temp_base_auto").show();
            processChangelngLat();
        } else {
            $("#temp_base").prop('disabled', false);
            $(".temp_base_auto").hide();
        }
    });
    $("#livingvolume_auto").on( "change", function(e) {
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
    });
    $(".livingvolumecalc").on( "change", function(e) {
        calcVolume();
        $("#livingvolume_auto").prop('checked', true);
    });
    $("#temp_base_years_archive").on( "change", function(e) {
        processChangelngLat();
    });

    // Default value
    //-Par le hash de l'URL
    var hash = window.location.hash.substr(1);
    let reWall = /^wall-(?<param>[a-z]+)-(?<wallId>[0-9]+)$/u;
    let reWallWin = /^wall-(?<param>[a-z]+)-(?<wallId>[0-9]+)-window-(?<winId>[0-9]+)$/u;
    if (hash) {
        debug('hash : ' + hash);
        if (hash == 'opendata') {
            openData();
        } else {
            //Parse hash, split et complete
            var result = hash.split('&').reduce(function (res, item) {
                var parts = item.split('=');
                res[parts[0]] = parts[1];
                debug('Param du hash ' + parts[0]);
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
                        $("#"+parts[0]).val(parts[1]);
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

    // Init des boutton de partages
    sharingButton();

    // Si on a appliqué toutes les valeurs du Hash + celle par défaut on voit s'il faut "poster" le formulaire :
    if (hash) {
        if ($("#submit_input").val() == 1) {
            submitForm();
        }
    }
    
    // Switch level
    changeLevel($("#level").val());
    
    // Si le formulaire change, on change le hash
    debug('Add listener hashchange');
    hashchangeListener();

    

    // Pour le reset du formulaire on retourne à la racine
    $("#reset").on( "click", function(e) {
        debug('Reset');
        location.href='/';
    });
    
    ////////////////////////////
    // Expert mode - formulaire
    ////////////////////////////
    
    // Ajout de la première ligne si inexistante
    detailBuildingAddWall();

    // Draggable/sortable mode pour les lignes de fenêtres
    $( ".window-table tbody" ).sortable({
        update: function(event, ui) {
            hashchangeAllAction();
        }
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
                $.each(localSetting.wall[$('#custom-wall').val()].layer, function(index, data) {
                    addLayer(index);
                    $('#layer-type-' + index).prepend('<option class="type-modify" id="layer-type-' + index + '-modify" value="'+data.r+'" selected="selected">'+data.material+'</option>');
                    $('#layer-size-' + index).val(data.size);
                    $('#layer-lambda-' + index).val(data.r);
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
                Cancel: function() {
                    dialog.dialog( "close" );
                },
                "Valider": function() {
                    //layer-custom-id SI pas 0 = enregistrement nouvel !
                    var returnValidCustomWall = validCustomWall();
                    if (returnValidCustomWall == true) {
                        dialog.dialog( "close" );
                        appAlert('Ajouté !', "success");
                    } else {
                        appAlert(returnValidCustomWall);
                    }
                }
              },
            open: function() {
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
                        appAlert(returnValidCustomMaterial, 'appAlert');
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

    // Si on "submit" le formulaire
    $("#submit_button").on( "click", function(e) {
        if ($('#temp_base').val() == '') {
            appAlert("Basal temperature not preset. Choose your location on the map.", "warning");
            return false;
        } else if($("form")[0].checkValidity()) {
            submitForm();
            // Fix bug submit 2 fois...
            return false;
        } else {
            debug("HTML5 : invalid form");
        }
    });

    ////////////////////////////
    // Résultat
    ////////////////////////////
    $("#calcShowHide").on( "click", function(e) {
        $(".calcul_level"+$("#level").val()).toggle();
        debug("toggle calcul " + $("#level").val());
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
