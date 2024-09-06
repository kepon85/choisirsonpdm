function suggestion() {
    debug("Suggestion...")
    $('#suggestion').show();
    // Reset suggestion
    $("#suggestionContent").html('');
    $("#suggestionContent").append(
        'Contactez un artisanat poêlier membre de l\'<a href="https://afpma.pro/">AFPMA</a> en lui partageant (notamment) ce besoin de chauffage ' + $("#resDeperditionMax").text() + 'kW : ' +
        '<iframe loading="lazy" class="resp-iframe p-3" src="https://afpma.gogocarto.fr/annuaire?iframe=1&amp;noheader=1#/carte/@' + $( "#lat" ).val() + ',' + $( "#lng" ).val() + ',7z?cat=all@c" marginheight="0" marginwidth="0" width="100%" height="600" frameborder="0"></iframe>'
    );    
}