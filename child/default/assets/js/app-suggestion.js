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
        $("#suggestionContent").append('<p id="best"><span data-i18n="[html]suggestion-best-1">Le poêle de masse open source (référencé ici) qui se rapproche le plus de votre besoin de chauffage maximum, lors des 5 jours les plus froids de l’année, semble être le </span><span id="bestName"></span> <span data-i18n="[html]suggestion-best-2">pour une puissance journalière de</span><span id="bestPower"></span><span data-i18n="[html]suggestion-best-3">kW.</span></p>');
        $("#suggestionContent").append('<p id="best-multi" class="display: none"><span data-i18n="[html]suggestion-best-multi-1">Plusieurs poêle de masse open source (référencé ici) semble se rapproche le de votre besoin de chauffage maximum (lors des 5 jours les plus froids de l’année) : </span><ul id="best-multi-ul"></ul></p>');
        $("#suggestionContent").append('<p id="bestCool-multi" class="display: none"><span data-i18n="[html]suggestion-bestCool-multi-1">Aucun poêle de masse open source (référencé ici) semble complètement satisfaisant mais voici ceux qui se rapproche le plus de votre besoin de chauffage maximum (lors des 5 jours les plus froids de l’année) : </span><ul id="bestCool-multi-ul"></ul></p>');
        $("#suggestionContent").append('<p class="disclamer"><b data-i18n="[html]alert-warning">Avertissement</b> : <span data-i18n="[html]app-disclamer">Les résultats sont donnés à titre indicatif, nous vous conseillons de vous rapprocher d\'un <a href="https://www.afpma.pro/#carte-des-membres">artisan poêlier professionnel</a> pour une étude thermique personnalisé afin de vous orienter vers le poêle de masse qui vous conviendra le mieux. </span></p>');
        $("#suggestionContent").append(
            '<table id="suggestionTab">'
                +'<thead><tr>'
                    +'<th data-i18n="[html]suggestion-name" rowspan="2">Name</th>'
                    +'<th data-i18n="[html]suggestion-per-day"  colspan="4">Per day</th>'
                    +'<th data-i18n="[html]suggestion-weight" rowspan="2">Weight</th>'
                    +'<th data-i18n="[html]suggestion-link" rowspan="2">link</th>'
                    +'<th data-i18n="[html]suggestion-diffpowerdeperdition" rowspan="2">Difference with need</th>'
                +'</tr><tr>'
                    +'<th data-i18n="[html]suggestion-power">Power</th>'
                    +'<th data-i18n="[html]suggestion-fire">Fire</th>'
                    +'<th data-i18n="[html]suggestion-wood">Wood</th>'
                    +'<th data-i18n="[html]suggestion-use">use</th>'
                +'</tr></thead>'
                +'<tbody>'
                +'</tbody>'
            +'</table>'
            +'<a href="#opendata">Voir toutes les données disponibles</a>');
        if ($("#transparent").prop("checked")) {
            $("#suggestionContent").append('<div id="suggestionTransparentConsole" class="bg-secondary card"><p>Pour le dimensionnement on part de la température "critique" (extrême) donc on ne considère que les cas d\'usages critiques des poêles.</p><p>Transparence de la suggestion : <ul></ul></p></div>');
        }
        var id=0;
        var veryBestId=0;
        var veryBestDiffPowerDeperdition=999999999;
        var best = new Array();
        var bestCool = new Array();
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
                    $("#suggestionTransparentConsole ul").append('<li>'+id+' : '+pdmData.name+' '+Math.round(this.power)+'W. La différence avec le besoin est de '+Math.round(diffPowerDeperdition)+'W</li>');
                    //debug("diffPowerDeperdition="+diffPowerDeperdition);
                    if (Math.abs(diffPowerDeperditionPercent) < settings.pdmSuggestion.percentPowerSuper) {
                        trClass='bg-success-subtle';
                        // On enregistre sir c'est une super correspondance
                        best.push(id);
                        if (diffPowerDeperditionAbs < veryBestDiffPowerDeperdition) {
                            veryBestId=id;
                            veryBestDiffPowerDeperdition=diffPowerDeperditionAbs;
                            $("#suggestionTransparentConsole ul").append('<li><b>=> C\'est, pour le moment, le poêle qui s\'approche le plus du besoin</b></li>');
                        }
                    } else if (Math.abs(diffPowerDeperditionPercent) < settings.pdmSuggestion.percentPowerCool) {
                        trClass='bg-warning-subtle';
                        bestCool.push(id) ;
                    } else {
                        trClass='text-secondary';
                    }
                    debug('trClass ID ' + id + '= '+ trClass);
                    $('#suggestionTab > tbody:last-child').append(
                        '<tr id="pdm-suggestion-'+id+'" class="'+trClass+'">'
                            +'<td>'+pdmData.name+'</td>'
                            +'<td class="text-center">'+precise_round(this.power/1000,2)+'kW</td>'
                            +'<td class="text-center">'+this.fire+'</td>'
                            +'<td class="text-center">'+this.woodLoad+'kg</td>'
                            +'<td class="text-center">'+this.use+'</td>'
                            +'<td class="text-center">'+pdmData.weight+'kg</td>'
                            +'<td class="text-center"><a href="'+pdmData.link+'">link</a></td>'
                            +'<td class="text-center">'+precise_round(diffPowerDeperditionAbs/1000, 2)+' ('+Math.round(diffPowerDeperditionPercent)+'%)</td>'
                        +'<tr>'
                    );
                }
            });
        });
        debug("Best ID = "+veryBestId);
        debug(best);
        debug(bestCool);
        if (best.length >= 1) {
            $('#best-multi').hide();
        } 
        if (best.length < 1) {
            $('#best-multi').show();
            $('#best').hide();
        } 
        if (veryBestId === 0) {
            $('#best').hide();
        }
        var id=0;
        $.each(settings.pdmData, function() {
            var pdmData = this;
            $.each(this.dalyPower, function() {
                id=id+1;
                if ( best.includes(id) ) {
                    $("#best-multi-ul").append('<li><a href="'+pdmData.link+'">'+pdmData.name+'</a> <span data-i18n="[html]suggestion-best-2">pour une puissance journalière de</span> ' + precise_round(this.power/1000, 2) + '<span data-i18n="[html]suggestion-best-3">kW.</span></li>');
                }
                if ( bestCool.includes(id) ) {
                    $("#bestCool-multi-ul").append('<li><a href="'+pdmData.link+'">'+pdmData.name+'</a> <span data-i18n="[html]suggestion-best-2">pour une puissance journalière de</span> ' + precise_round(this.power/1000, 2) + '<span data-i18n="[html]suggestion-best-3">kW.</span></li>');
                }
                if (id == veryBestId) {
                    $('#pdm-suggestion-'+id).removeClass('text-secondary');
                    $('#pdm-suggestion-'+id).removeClass('bg-warning-subtle');
                    $('#pdm-suggestion-'+id).addClass('bg-success-subtle');
                    $('#bestName').html("<a href='"+pdmData.link+"'>"+pdmData.name+"</a>");
                    //$('#bestFire').html(this.fire);
                    //$('#bestWood').html(this.woodLoad);
                    $('#bestPower').html(precise_round(this.power/1000, 2));
                }
            });
        });
    }
    // Ré-appeler la traduction pour ce qui est chargé à posteriori... 
    $('html').i18n();
}