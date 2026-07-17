/*
	Arcana by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
(function($) {
	$(function() {
		let	$body = $('body');

		// Disable animations/transitions until the page has loaded.
        setTimeout(function(){
            $(document).ready( function() {
                $body.removeClass('is-loading');
            });
        });

        $body.addClass('is-loading');
        $('form').placeholder();  // Fix: Placeholder polyfill.
	});
})(jQuery);