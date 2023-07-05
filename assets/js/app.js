function debug(msg) {
    if (settings.debug) {
        console.log(msg);
    }
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
    $(".hashchange").on( "click", function() {
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
    });
    
});



