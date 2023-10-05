function suggestion() {
    debug("Suggestion...")
    $('#suggestion').show();
    // Reset suggestion
    $("#suggestionContent").html('');
    const resDeperdition = $("#resDeperdition").val();
    if (resDeperdition > 12000 || resDeperdition < 200) {
        $("#suggestionContent").append('<div class="alert  alert-danger" role="alert">' 
            + '<span data-i18n="[html]suggestion-too-large-1">No mass stove listed here meets your needs (it is too large). We advise you to call on a professional stove mason so that he can guide you.</span>'
            + '<a data-i18n="[html]suggestion-too-large-2" href="https://afpma.choisir.poeledemasse.org/'+window.location.hash+'"></a>'
            + '<span data-i18n="[html]suggestion-too-large-3"> </span>'
            + '</div>');
    } else {
        $("#suggestionContent").append('<p id="best" style="display: none"><span data-i18n="[html]suggestion-best-1">Le poêle de masse open source (référencé ici) qui se rapproche le plus de votre besoin de chauffage maximum, lors des 5 jours les plus froids de l’année, semble être le </span><span id="bestName"></span> <span data-i18n="[html]suggestion-best-2">pour une puissance journalière de</span> <span id="bestPower"></span><span data-i18n="[html]suggestion-best-3">kW.</span></p>');
        $("#suggestionContent").append('<p id="best-multi" style="display: none"><span data-i18n="[html]suggestion-best-multi-1">Plusieurs poêle de masse open source (référencé ici) semble se rapproche le de votre besoin de chauffage maximum (lors des 5 jours les plus froids de l’année) : </span><ul id="best-multi-ul"></ul></p>');
        $("#suggestionContent").append('<p id="bestCool-multi" style="display: none"><span data-i18n="[html]suggestion-best-multi-1">Plusieurs poêle de masse open source (référencé ici) semble se rapproche le de votre besoin de chauffage maximum (lors des 5 jours les plus froids de l’année) : </span><ul id="bestCool-multi-ul"></ul></p>');
        //$("#suggestionContent").append('<p id="bestCool-multi" style="display: none"><span data-i18n="[html]suggestion-bestCool-multi-1">Aucun poêle de masse open source (référencé ici) semble complètement satisfaisant mais voici ceux qui se rapproche le plus de votre besoin de chauffage maximum (lors des 5 jours les plus froids de l’année) : </span><ul id="bestCool-multi-ul"></ul></p>');
        $("#suggestionContent").append('<p class="disclamer"><b data-i18n="[html]alert-warning">Avertissement</b> : <span data-i18n="[html]app-disclamer">Les résultats sont donnés à titre indicatif, nous vous conseillons de vous rapprocher d\'un <a href="https://www.afpma.pro/#carte-des-membres">artisan poêlier professionnel</a> pour une étude thermique personnalisé afin de vous orienter vers le poêle de masse qui vous conviendra le mieux. </span></p>');
        if ($("#transparent").prop("checked")) {
            $("#suggestionContent").append('<div id="suggestionTransparentConsole" class="border-secondary card">'
                + '<p>Pour le dimensionnement on part de la température "critique" (extrême) donc on ne considère que les cas d\'usages critiques des poêles (<a href="/#opendata">voir toutes les données des poêles de masses</a>).</p>'
                + '<p>La marge d\'approximation (+/- percentPowerSuper) des calculs considéré est de '+settings.pdmSuggestion.percentPowerSuper+'%</p>'
                + '<p>La marge de dimensionnement (+ percentPowerCool) par rapport au besoin est de '+settings.pdmSuggestion.percentPowerCool+'%</p>'
                + '<p><a href="https://framagit.org/kepon/choisirsonpdm/#suggestion" target="_blank">Plus d\'information pour comprendre les choix de l\'algorythme de suggestion</a></p>'
            +'</div>');
        }
        $("#suggestionContent").append('<div><table id="suggestionTab">'
                +'<thead><tr>'
                    +'<th data-i18n="[html]suggestion-name">Name</th>'
                    +'<th data-i18n="[html]suggestion-power">Power</th>'
                    +'<th data-i18n="[html]suggestion-weight">Weight</th>'
                    +'<th data-i18n="[html]suggestion-link">link</th>'
                    +'<th data-i18n="[html]suggestion-diffpowerdeperdition">Difference with need</th>'
                +'</tr></thead>'
                +'<tbody>'
                +'</tbody>'
            +'</table>'
            +'<div class="opendata-link"><a href="/#opendata"  data-i18n="[html]opendata-link">Voir toutes les données disponibles</a></div>'
        +'</div>');
        var id=0;
        var pdmSuggestions = new Array();
        let bestClass2 = 0;
        let bestClass1 = 0;
        // Afficher les colonnes et leur couleur, on détermine les "best"
        $.each(settings.pdmData, function() {
            var pdmData = this;
            $.each(this.dalyPower, function() {
                id=id+1;
                if (this.use == "critical") {
                    debug('Suggestion ID ' + id);
                    var diffPowerDeperdition = this.power-resDeperdition;
                    var diffPowerDeperditionAbs = Math.abs(diffPowerDeperdition);
                    var diffPowerDeperditionPercent =  100*diffPowerDeperdition/resDeperdition;
                    var diffPowerDeperditionPercentAbs = Math.abs(diffPowerDeperditionPercent);
                    var bestClass = 0;
                    if (diffPowerDeperditionPercentAbs < settings.pdmSuggestion.percentPowerSuper) {
                        trClass='bg-success-subtle';
                        bestClass = 2;
                        bestClass2++;
                    } else if (diffPowerDeperditionPercent > 0 && diffPowerDeperditionPercent < settings.pdmSuggestion.percentPowerCool) {
                        bestClass = 1;
                        bestClass1++;
                        trClass='bg-warning-subtle';
                    } else {
                        trClass='text-secondary';
                    }
                    let pdm = {
                        "id": id,
                        "name": pdmData.name,
                        "power": this.power,
                        "fire": this.fire,
                        "woodLoad": this.woodLoad,
                        "use": this.use,
                        "weight": pdmData.weight,
                        "link": pdmData.link,
                        "diffPowerDeperdition": diffPowerDeperdition,
                        "diffPowerDeperditionAbs": diffPowerDeperditionAbs,
                        "diffPowerDeperditionPercent": diffPowerDeperditionPercent,
                        "bestClass": bestClass,
                        "trClass": trClass
                       }
                    pdmSuggestions.push(pdm);
                }
            });
        });
        debug("bestClass2:"+bestClass2);
        debug("bestClass1:"+bestClass1);
        // Aucun poêle super mais des cool
        /*if (bestClass2 == 0 && bestClass1 != 0) {
            $('#bestCool-multi').show();
            $.each(pdmSuggestions, function() {
                if (this.bestClass == 1) {
                    $("#bestCool-multi-ul").append('<li><a href="'+this.link+'">'+this.name+'</a> <span data-i18n="[html]suggestion-best-2">pour une puissance journalière de</span><b> ' + precise_round(this.power/1000, 2) + '</b><span data-i18n="[html]suggestion-best-3">kW.</span></li>');
                }
            });
        */
        // Un poêle super
        //} else 
        
        // Un seul poêle
        if (bestClass2 == 1) {
            debug('un poêle super !');
            $('#best').show();
            $.each(pdmSuggestions, function() {
                if (this.bestClass == 2) {
                    $('#bestName').html("<a href='"+this.link+"' target='_blank'>"+this.name+"</a>");
                    $('#bestPower').html("<b>"+precise_round(this.power/1000, 2)+"</b>");
                }
            });
        } else if (bestClass1 == 1) {
            debug('un poêle cool !');
            $('#best').show();
            $.each(pdmSuggestions, function() {
                if (this.bestClass == 1) {
                    $('#bestName').html("<a href='"+this.link+"' target='_blank'>"+this.name+"</a>");
                    $('#bestPower').html("<b>"+precise_round(this.power/1000, 2)+"</b>");
                }
            });
        // plusieurs 
        } else if (bestClass2 > 1 || bestClass1 > 1) {
            debug('Plusieurs poêle super !');
            $('#best-multi').show();
            $.each(pdmSuggestions, function() {
                if (this.bestClass == 2 || this.bestClass == 1) {
                    $("#best-multi-ul").append('<li><a href="'+this.link+'" target="_blank">'+this.name+'</a> <span data-i18n="[html]suggestion-best-2">pour une puissance journalière de</span><b> ' + precise_round(this.power/1000, 2) + '</b><span data-i18n="[html]suggestion-best-3">kW.</span></li>');
                }
            });
        // Aucun
        } else {
            $("#suggestionContent").prepend('<div class="alert  alert-warning" role="alert">' 
            + '<span data-i18n="[html]suggestion-no-1">No mass stove listed here meets your needs. We advise you to call on a professional stove mason so that he can guide you.</span>'
            + '<a data-i18n="[html]suggestion-too-large-2" href="https://afpma.choisir.poeledemasse.org/'+window.location.hash+'"></a>'
            + '<span data-i18n="[html]suggestion-too-large-3"> </span>'
            + '</div>');
        }

        $.each(pdmSuggestions, function() {
            debug(this);
            $('#suggestionTab > tbody:last-child').append(
                '<tr class="'+this.trClass+'">'
                    +'<td>'+this.name+'</td>'
                    +'<td class="text-center">'+precise_round(this.power/1000,2)+'kW</td>'
                    +'<td class="text-center">'+this.weight+'kg</td>'
                    +'<td class="text-center"><a href="'+this.link+'" target="_blank">link</a></td>'
                    +'<td class="text-center">'+precise_round(this.diffPowerDeperditionAbs/1000, 2)+' ('+Math.round(this.diffPowerDeperditionPercent)+'%)</td>'
                +'<tr>'
            );
        });
    }
    // Ré-appeler la traduction pour ce qui est chargé à posteriori... 
    $('html').i18n();
}