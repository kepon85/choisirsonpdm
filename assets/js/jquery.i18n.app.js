
// Langue par défaut : FR 
// J'ai pas réussi à changer l'option ici donc j'ai fais ça en mode bourin, dans jquery.i18n.js...
//      fallbackLocale : "fr",

jQuery(function($) {

    var do_translate = function() {
        $('html').i18n();
        // switch active flag
        $( ".locale-switcher .flag").removeClass( "active" );
        $( ".locale-switcher ." + $.i18n().locale).addClass( "active" );
    }
    //Chargement des fichiers de traduction
    const cacheSuffix = settings.version ? ('?v=' + encodeURIComponent(settings.version)) : '';

    $.i18n().load({
        'en': './i18n/en.json' + cacheSuffix,
        'fr': './i18n/fr.json' + cacheSuffix,
        'es': './i18n/es.json' + cacheSuffix,
    }).done(function() {
        
        // Switch language
        $('.locale-switcher').on('click', 'a.flag', function(e) {
            e.preventDefault();
            debug('Locale switch : ' + $(this).data('locale'));
            localStorage.setItem('i18n', $(this).data('locale'));
            $.i18n().locale = $(this).data('locale');
            do_translate();
            // Bug traduction select2 https://framagit.org/kepon/choisirsonpdm/-/issues/37
            initSelect2();
        });
        var userLang = navigator.language || navigator.userLanguage;
        // Détection paramètre utilisateur
        if (localStorage.getItem('i18n')) {
            debug('Detect locale localSstorage : '+localStorage.getItem('i18n'));
            $.i18n().locale = localStorage.getItem('i18n');
        // Sinon je prend la langue du navigateur
        } else if($('.' + userLang.split('-')[0]).length) {
            debug('Detect locale user : '+userLang.split('-')[0]);
            $('li').removeClass('active');
            $('.' + userLang.split('-')[0]).addClass('active');
            $.i18n().locale = userLang.split('-')[0];
        // Sinon la langue par defaut
        } else {
            debug('Default locale  : '+settings.defaultLanguage);
            $.i18n().locale = settings.defaultLanguage
        }
        do_translate();
        initSelect2();
        // Bug traduction select2 https://framagit.org/kepon/choisirsonpdm/-/issues/37
        /*$('select').each(function () {
            var $select = $(this);
            $select.select2();
        });*/
    });
});