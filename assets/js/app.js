function debug(msg) {
    if (settings.debug) {
        console.log(msg);
    }
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
    } else if (level == 2) {
        $(".level3").hide();
        $(".level1").hide();
        $(".level2").show();
    } else if (level == 3) {
        $(".level1").hide();
        $(".level2").hide();
        $(".level3").show();
    }
}

// Calcule du volume fonction de la surface/hauteur
function calcVolume (){
    $("#livingvolume").val($("#livingspace").val() * $("#livingheight").val());
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
        } else {
            $("#livingvolume").prop('disabled', false);
            $(".livingvolume_auto").hide();
            $(".livingvolume_manuel").hide();
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
        var result = hash.split('&').reduce(function (res, item) {
            var parts = item.split('=');
            res[parts[0]] = parts[1];
            if ($("#"+parts[0])[0].type == "checkbox") {
                $("#"+parts[0]).prop("checked", parts[1]);
            } else {
                $("#"+parts[0]).val(parts[1]);
            }
            return res;
        }, {});
        debug('result' + result);
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
    // Si on a appliqué toutes les valeurs du Hash + celle par défaut on voit s'il faut "poster" le formulaire :
    if (hash) {
        if ($("#submit_input").val() == 1) {
            submitForm();
        }
    }
    
    // Switch level
    changeLevel($("#level").val());
    
    debug('Add listener hashchange');
    $(".hashchange").on( "change", function(e) {
        $("#result").hide();
        $("#submit_input").val(0);
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
        if($("form")[0].checkValidity()) {
            submitForm();
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
        // Ensuite le localStorage
        } else if (localStorage.getItem('lngLat')) {
            var storageLngLat = JSON.parse(localStorage.getItem('lngLat'));
            lng = storageLngLat.lng;
            lat = storageLngLat.lat;
            zoom = 8;
            markerDefault = true;
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

});