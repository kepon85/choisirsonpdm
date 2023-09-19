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
        $("#suggestionContent").append('<p><span data-i18n="[html]suggestion-best-1">The open source mass stove (referenced here) that comes closest to your maximum heating requirement seems to be the </span><span id="bestName"></span><span data-i18n="[html]suggestion-best-2">, with </span><span id="bestFire"></span><span data-i18n="[html]suggestion-best-3"> surge of </span><span id="bestWood"></span><span data-i18n="[html]suggestion-best-4">kg of wood per day for a daily power of </span><span id="bestPower"></span><span data-i18n="[html]suggestion-best-5">kW.</span></p>');
        $("#suggestionContent").append('<p id="step-back></p>');
        $("#suggestionContent").append('<p class="disclamer"><b data-i18n="[html]alert-warning">Avertissement</b> : <span data-i18n="[html]app-disclamer">Les résultats sont donnés à titre indicatif, nous vous conseillons de vous rapprocher d\'un <a href="https://www.afpma.pro/#carte-des-membres">artisan poêlier professionnel</a> pour une étude thermique personnalisé afin de vous orienter vers le poêle de masse qui vous conviendra le mieux. </span></p>');
        $("#suggestionContent").append(
            '<table id="suggestionTab">'
                +'<thead><tr>'
                    +'<th data-i18n="[html]suggestion-name" rowspan="2">Name</th>'
                    +'<th data-i18n="[html]suggestion-per-day"  colspan="3">Per day</th>'
                    +'<th data-i18n="[html]suggestion-weight" rowspan="2">Weight</th>'
                    +'<th data-i18n="[html]suggestion-link" rowspan="2">link</th>'
                    +'<th data-i18n="[html]suggestion-diffpowerdeperdition" rowspan="2">Difference with need</th>'
                +'</tr><tr>'
                    +'<th data-i18n="[html]suggestion-power">Power</th>'
                    +'<th data-i18n="[html]suggestion-fire">Fire</th>'
                    +'<th data-i18n="[html]suggestion-wood">Wood</th>'
                +'</tr></thead>'
                +'<tbody>'
                +'</tbody>'
            +'</table>');
        if ($("#transparent").prop("checked")) {
            $("#suggestionContent").append('<div id="suggestionTransparentConsole" class="bg-secondary card"><p>Transparence de la suggestion : <ul></ul></p></div>');
        }
        var id=0;
        var bestId=0;
        var bestDiffPowerDeperdition=999999999;
        // @todo Couleur de la ligne avec un % 
        $.each(settings.pdmData, function() {
            var pdmData = this;
            $.each(this.dalyPower, function() {
                id=id+1;
                var diffPowerDeperdition = this.power-resDeperdition;
                var diffPowerDeperditionAbs = Math.abs(diffPowerDeperdition);
                var diffPowerDeperditionPercent =  100*diffPowerDeperdition/resDeperdition;
                $("#suggestionTransparentConsole ul").append('<li>'+id+' : '+pdmData.name+' '+this.power+'W. La différence avec le besoin est de '+diffPowerDeperdition+'</li>');
                if (diffPowerDeperditionAbs < bestDiffPowerDeperdition) {
                    bestId=id;
                    bestDiffPowerDeperdition=diffPowerDeperditionAbs;
                    $("#suggestionTransparentConsole ul").append('<li><b>=> C\'est, pour le moment, le poêle qui s\'approche le plus du besoin</b></li>');
                }
                //debug("diffPowerDeperdition="+diffPowerDeperdition);
                if (Math.abs(diffPowerDeperditionPercent) < settings.pdmSuggestion.percentPowerSuper) {
                    trClass='bg-success-subtle';
                } else if (Math.abs(diffPowerDeperditionPercent) < settings.pdmSuggestion.percentPowerCool) {
                    trClass='bg-warning-subtle';
                } else {
                    trClass='text-secondary';
                }
                $('#suggestionTab > tbody:last-child').append(
                    '<tr class="'+trClass+'">'
                        +'<td>'+pdmData.name+'</td>'
                        +'<td class="text-center">'+precise_round(this.power/1000,2)+'kW</td>'
                        +'<td class="text-center">'+this.fire+'</td>'
                        +'<td class="text-center">'+this.woodLoad+'kg</td>'
                        +'<td class="text-center">'+pdmData.weight+'kg</td>'
                        +'<td class="text-center"><a href="'+pdmData.link+'">link</a></td>'
                        +'<td class="text-center">'+precise_round(diffPowerDeperditionAbs/1000, 2)+' ('+Math.round(diffPowerDeperditionPercent)+'%)</td>'
                    +'<tr>'
                );
            });
        });
        debug("Best ID = "+bestId);
        var id=0;
        $.each(settings.pdmData, function() {
            var pdmData = this;
            $.each(this.dalyPower, function() {
                id=id+1;
                if (id == bestId) {
                    $('#bestName').html("<a href='"+pdmData.link+"'>"+pdmData.name+"</a>");
                    $('#bestFire').html(this.fire);
                    $('#bestWood').html(this.woodLoad);
                    $('#bestPower').html(precise_round(this.power/1000, 2));
                }
                var diffPowerDeperdition = this.power-resDeperdition;
                var diffPowerDeperditionAbs = Math.abs(diffPowerDeperdition);
            });
        });
    }
    // Ré-appeler la traduction pour ce qui est chargé à posteriori... 
    $('html').i18n();
}