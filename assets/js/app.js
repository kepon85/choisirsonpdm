$( document ).ready(function() {
    ////////////////////////////////////
    // HASH URL (remplir les champs)
    ////////////////////////////////////
    debug( "ready !" );

    // Cacher les alertes d'un clic au besoin
    $("#alert").on( "click", function(e) {
        $("#alert").hide();
    });

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
    $( ".window-table tbody" ).sortable({
        update: function(event, ui) {
            hashchangeAllAction();
        }
    });

              /*
                var cache = {};
                $( "#birds" ).autocomplete({
                  minLength: 2,
                  source: function( request, response ) {
                    var search = request.search;
                    if ( search in cache ) {
                      response( cache[ search ] );
                      return;
                    }

                    $.getJSON( settings.apiMateriaux, request, function( data, status, xhr ) {
                      cache[ search ] = data;
                      response( data );
                    });
                  }
                });
*/

    ////////////////////////////
    // Contrôle
    ////////////////////////////

    // Si on "submit" le formulaire
    $("#submit_button").on( "click", function(e) {
        if ($('#temp_base').val() == '') {
            alert("Basal temperature not preset. Choose your location on the map.");
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
        debug("toggle calcul")
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

    // Loader a cacher quand tout est fait
    $('#loadData').hide();

    // Tooltips (infobule)
    $('[data-toggle="tooltip"]').tooltip();                

    // Loader a cacher quand tout est fait
    $('#loadData').hide();
});
