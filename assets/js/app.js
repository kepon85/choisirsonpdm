function debug(msg) {
    if (settings.debug) {
        console.log(msg);
    }
}

function detailBuildingAddWall() {
    debug('Add une paroi')
    //Récupérer le nombre de paroi pour savoir où nous en sommes
    let wallId=parseFloat($("#wall-id").val())+1;
    debug('Add une paroi : '+wallId)
    $('#tabke-level3-detail-building > tbody:last-child').append(
        + '<tr id="wall-' + wallId + '">'
            + '<td><input type="text" class="form-control hashchange wall-perso" name="wall-name[]" id="wall-name-' + wallId + '" value=""  placeholder="Ex: Façade Sud" /></td>'
            + '<td><input type="number" class="form-control hashchange" min="0" max="1" step="0.01" name="wall-ri[]" id="wall-ri-' + wallId + '" value="0" /></td>'
            + '<td><input type="number" class="form-control hashchange" min="0" max="1" step="0.01" name="wall-ro[]" id="wall-ro-' + wallId + '" value="0" /></td>'
            + '<td><input type="number" class="form-control hashchange" min="0" step="0.1" name="wall-height[]" id="wall-height-' + wallId + '" value="0" /></td>'
            + '<td><input type="number" class="form-control hashchange" min="0" step="0.1" name="wall-width[]" id="wall-width-' + wallId + '" value="0" /></td>'
            + '<td><input type="text" class="form-control" name="wall-area[]" id="wall-area-' + wallId + '" value="0" disabled="disabled" /></td>'
            + '<td><input type="text" class="form-control" name="wall-r[]" id="wall-r-' + wallId + '" value="0" disabled="disabled" /></td>'
        + '</tr>'
        + '<tr id="wall-' + wallId + '-window-__WINID__">'
            + '<td colspan="7">'
            + '<table class="table" width="100%">'
                + '<thead>'
                + '<tr>'
                    + '<th>&nbsp;</th>'
                    + '<th colspan="2" data-i18n="[html]thead-window">Vitre</th>'
                    + '<th data-i18n="[html]thead-window-height">Hauteur de la vitre (cm)</th>'
                    + '<th data-i18n="[html]thead-window-width">Largeur de la vitre (cm)</th>'
                    + '<th data-i18n="[html]thead-window-area">Surface de la vitre (m)</th>'
                    + '<th data-i18n="[html]thead-window-dep">Déperdition (W/°C)</th>'
                + '</tr>'
                + '</thead>'
                + '<tbody>'
                + '<tr>'
                    + '<th>&rarr;</th>'
                    + '<td colspan="2"><input type="text" class="form-control hashchange wall-perso" name="window-name[]" id="wall-name-' + wallId + '-window-__WINID__" value=""  placeholder="Ex: Fenêtre cuisine" /></td>'
                    + '<td><input type="number" class="form-control hashchange" min="0" step="0.1" name="window-height[]" id="wall-height-' + wallId + '-window-__WINID__" value="0" /></td>'
                    + '<td><input type="number" class="form-control hashchange" min="0" step="0.1" name="window-width[]" id="wall-width-' + wallId + '-window-__WINID__" value="0" /></td>'
                    + '<td><input type="text" class="form-control" name="window-area[]" id="wall-area-' + wallId + '-window-__WINID__" value="0" disabled="disabled" /></td>'
                    + '<td><input type="text" class="form-control" name="window-dep[]" id="wall-dep-' + wallId + '-window-__WINID__" value="0" disabled="disabled" /></td>'
                + '</tr>'
                + '</tbody>'
            + '</table>'
            + '</td>'
        + '</tr>'
    );
    $("#wall-id").val(wallId);
}

// Juste pour "afficher" les données
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

// Envoi du formulaire
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

// https://www.w3resource.com/javascript-exercises/javascript-math-exercise-14.php
function precise_round(n, r) {
    let int = Math.floor(n).toString()
    if (typeof n !== 'number' || typeof r !== 'number') return 'Not a Number'
    if (int[0] == '-' || int[0] == '+') int = int.slice(int[1], int.length)
    return n.toPrecision(int.length + r)
}
// Changer l'URL (hash) en fonction de la classe "hashchange"
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
// https://www.freecodecamp.org/french/news/anti-rebond-comment-retarder-une-fonction-en-javascript/ 
function debounce(func, timeout = 1000){
    let timer;
    return (...args) => {
        $('#temp_base_load').show();
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}
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

// Changement de niveau
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

// Calcule du volume fonction de la surface/hauteur
function calcVolume (){
    $("#livingvolume").val($("#livingspace").val() * $("#livingheight").val());
}

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

$( document ).ready(function() {
    ////////////////////////////////////
    // HASH URL (remplir les champs)
    ////////////////////////////////////
    debug( "ready !" );

    $("#alert").on( "click", function(e) {
        $("#alert").hide();
    });
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
    var hash = window.location.hash.substr(1);
    if (hash) {
        debug('hash : ' + hash);
        if (hash == 'opendata') {
            openData();
        } else {
            var result = hash.split('&').reduce(function (res, item) {
                var parts = item.split('=');
                res[parts[0]] = parts[1];
                // Soit défini par son ID ou par son NOM si celui-ci n'a pas d'ID
                /// ça doit pas être la bonne syntax ...
                // INSISTER SINON REVENIR AU ID incrémentaux... on trouvera une astuce pour les suppressions de ligne...
                if ($("input[name='"+parts[0]+"'") === undefined) {
                    //if ($("#"+parts[0])[0].type == "checkbox") {
                    //    $("#"+parts[0]).prop("checked", parts[1]);
                    //} else {
                        $("input[name='"+parts[0]+"'").val(parts[1]);
                    //}
                } else if ($("#"+parts[0]) === undefined) {
                    if ($("#"+parts[0])[0].type == "checkbox") {
                        $("#"+parts[0]).prop("checked", parts[1]);
                    } else {
                        $("#"+parts[0]).val(parts[1]);
                    }
                }
                return res;
            }, {});
            debug('result' + result);
        }
    }
    // Valeur par défaut du formulaire
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
    
    $("#reset").on( "click", function(e) {
        debug('Reset');
        location.href='/';
    });
    
    // Si on click
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

    $('#loadData').hide();

    // Tooltips (infobule)
    // Désactivé par Bootstrap
    $('[data-toggle="tooltip"]').tooltip();
    // Plutôt par Jquery
    //$( document ).tooltip();

    /* 
    Expert Mode 
    */
    $( ".rsirse-chose" ).on( "click", function() {
        debug("Click open dialog rsirse");
        // SEULEMENT SI RSI / RSE = 0

        debug(this);
        // Trouver sur quel ligne ça a été cliquer pour pouvoir renvoyer la donner...
        $( "#dialog-rsirse" ).dialog();
    });

    /*
    debug('Add listener detail-building');
    $(".building-change").on( "change", function(e) {
        buildingChange(); // Update 
        
        //hashChange();
    });
*/
    detailBuildingAddWall();

              /*



function buildingChange() {
    debug("Building change - function")
    var building_change_new = '';
    var building_change_len = $('.building-change').length;
    var building_change_nb = 0
    $(".building-change").each(function() {
        debug(this.name);
        //this.type
        debug(this);
        if (this.type == "checkbox") { 
            if (this.checked == true) {
                building_change_new=building_change_new+this.id+'='+this.checked;
            } else {
                building_change_new=building_change_new+this.id+'=';
            }
        } else {
            building_change_new=building_change_new+this.id+'='+this.value;
        }
        if (building_change_nb != (building_change_len - 1)) {
            building_change_new=building_change_new+"&";
        }
        building_change_nb = building_change_nb +1
    });
    $('#building-change').val(building_change_new);
    $('#building-change').val($(".building-change").toString());
}

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
                

});
