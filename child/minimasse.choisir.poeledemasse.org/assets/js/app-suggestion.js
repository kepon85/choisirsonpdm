function suggestion() {
    debug("Suggestion...")
    $('#suggestion').show();
    // Reset suggestion
    $("#suggestionContent").html('');
    $("#suggestionContent").append('<p><span data-i18n="[html]suggestion-best-1"></span><span id="bestName"></span><span data-i18n="[html]suggestion-best-2"></span><span id="bestFire"></span><span data-i18n="[html]suggestion-best-3"></span><span id="bestWood"></span><span data-i18n="[html]suggestion-best-4"></span><span id="bestPower"></span><span data-i18n="[html]suggestion-best-5"></span></p>');
    $("#suggestionContent").append('<p id="step-back></p>');
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
    const resDeperdition = $("#resDeperdition").val();
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