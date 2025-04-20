function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

$('[data-i18n="[html]app-title"]')
    .attr('data-i18n', '[html]app-title___etude')  
    .i18n();

$('[data-i18n="[html]app-lead"]')
    .attr('data-i18n', '[html]app-lead___etude')  
    .i18n();

$('[data-i18n="[html]form-submit-button"]')
    .attr('data-i18n', '[html]form-submit-button___etude')  
    .i18n();

    
$('[data-i18n="[html]form-level-label"]')
    .attr('data-i18n', '[html]form-level-label___etude')  
    .i18n();
$('[data-i18n="[html]form-level-1"]')
    .attr('data-i18n', '[html]form-level-1___etude')  
    .i18n();
$('[data-i18n="[html]form-level-2"]')
    .attr('data-i18n', '[html]form-level-2___etude')  
    .i18n();
$('[data-i18n="[html]form-level-3"]')
    .attr('data-i18n', '[html]form-level-3___etude')  
    .i18n();

$(".disclamer").hide();

$(document).ready(function() {
    setTimeout(function() {
        $('#help').hide();
    }, 100);
});

if (inIframe()) {
    // En tête
    $(".header").hide();
    // pied de page
    $("footer").hide();
    // Full page https://getbootstrap.com/docs/5.0/layout/containers/
    $('#body-container').removeClass('container');
    $('#body-container').addClass(' container-fluid');
}
