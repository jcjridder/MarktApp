// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    // $("#barcodeButton").bind( "click", function() {
    //     GetProductSale();
    // });
    // $("#barcodeButtonSubmit").bind( "click", function() {
    //     submitOrder();
    // });
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('toevoegen', function (page) {

    
})

myApp.onPageInit('index', function (page) {


})


// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'here') {
        // Following code will be executed for page with data-page attribute equal to "about"

    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="here"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"

})