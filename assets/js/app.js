function debug(msg) {
    if (settings.debug) {
        console.log(msg);
    }
}
//https://www.w3resource.com/javascript-exercises/javascript-math-exercise-14.php
function precise_round(n, r) {
    let int = Math.floor(n).toString()
    if (typeof n !== 'number' || typeof r !== 'number') return 'Not a Number'
    if (int[0] == '-' || int[0] == '+') int = int.slice(int[1], int.length)
    return n.toPrecision(int.length + r)
}
function hashChange() {
    var hashnew = '';
    var hashchange_len = $('.hashchange').length;
    var hashchange_nb = 0
    $(".hashchange").each(function() {
        //debug(this.id);
        //debug(this.value);
        if (hashchange_nb == (hashchange_len - 1)) {
            hashnew=hashnew+this.id+'='+this.value;
        } else {
            hashnew=hashnew+this.id+'='+this.value+"&";
        }
        hashchange_nb = hashchange_nb +1
    });
    window.location.hash = hashnew;
}

$( document ).ready(function() {
    //
    debug( "ready !" );
    var hash = window.location.hash.substr(1);
    if (hash) {
        debug(hash);
        var result = hash.split('&').reduce(function (res, item) {
            var parts = item.split('=');
            res[parts[0]] = parts[1];
            $("#"+parts[0]).val(parts[1]);
            return res;
        }, {});
        debug(result);
    }

    debug('Add listener hashchange');
    $(".hashchange").on( "change", function() {
        hashChange();
    });
    


    ////////////////////////
    // MAPBOX
    ////////////////////////

    // Change de comportement si marker présent par défaut
    var justClick = true;
    // Set Longitude/latitude 
    function setLocalLngLat(lng, lat){
        lat = precise_round(lat, 6);
        lng = precise_round(lng, 6);
        var newData = {'lng': lng, 'lat': lat};
        $( "#lon" ).val( lng );
        $( "#lat" ).val( lat );	
        localStorage.setItem('lngLat', JSON.stringify(newData));
        hashChange();
    }
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2Vwb24tcGRtIiwiYSI6ImNsam91MzF4ejAyYXMzZHA3YzJocnZjemIifQ.Lx-TCB9dD9R_3EhNH7Wf_Q';
    // Position de la carte par défaut
    var lng = 3;
    var lat =47;
    var zoom = 4;
    var markerDefault = false;
    // Priorité au GET (hash)
    if ($( "#lon" ).val() != '' && $( "#lat" ).val()) {
        lng = $( "#lon" ).val();
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

});