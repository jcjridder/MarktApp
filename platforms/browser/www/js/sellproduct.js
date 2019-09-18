// function GetProductSale(){
//     cordova.plugins.barcodeScanner.scan(
//         function (result) {          
//             var obj = {};
//             obj["setEan"] = result.text;

//             var jsonString = JSON.stringify(obj)

//             $("#test").text(jsonString);

//             $.ajax({
//                 cache: false,
//                 url: 'https://markt.grabyourbag.nl/fetchproduct/'+jsonString,
//                 type: "POST",
//                 datatype: "json",
//                 contentType: "application/json; charset=UTF-8",
//                 error: function (e) {
//                     if (e.message != "undefined" && e.message != null) {
//                         alert(e.message);
//                     }
//                 },
//                 data: jsonString,
//                 success: function (data) {
//                     addProduct(data);
//                 }
//             });
//         },
//         function (error) {
//             alert("Oeps er is iets mis gegaan: " + error);
//         },
//         {
//             preferFrontCamera : false, // iOS and Android
//             showFlipCameraButton : true, // iOS and Android
//             showTorchButton : true, // iOS and Android
//             torchOn: false, // Android, launch with the torch switched on (if available)
//             saveHistory: true, // Android, save scan history (default false)
//             prompt : "Plaats barcode binnen vlak", // Android
//             resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
//             formats : "EAN_13", // default: all but PDF_417 and RSS_EXPANDED
//             orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
//             disableAnimations : true, // iOS
//             disableSuccessBeep: false // iOS and Android
//         }
//     );
// }


// // function submitOrder(){

// //     var dataOBJ = {};

// //     var error = false;
// //     $("#content_product_wrapper input").each(function(){
// //         if($(this).val() != ""){
// //             if($(this).attr("data-db") == "picture"){

// //                 var picNameArray = $(this).val().split("\\");
// //                 var pic = picNameArray.pop();
// //                 dataOBJ[$(this).attr("data-db")] = pic;
// //             }else if($(this).attr("data-db") == "price"){
// //                 var str = $(this).val();
// //                 var regex = /[.,\s]/g;
// //                 var price = str.replace(regex, '');
// //                 dataOBJ[$(this).attr("data-db")] = price;
// //             }else if($(this).attr("data-db") == "buyprice"){
// //                 var str = $(this).val();
// //                 var regex = /[.,\s]/g;
// //                 var price = str.replace(regex, '');
// //                 dataOBJ[$(this).attr("data-db")] = price;
// //             }else{
// //                 dataOBJ[$(this).attr("data-db")] = $(this).val();
// //             }
// //         }else{
// //             if($(this).attr("data-db") != "name" && $(this).attr("data-db") != "description"){
// //                 if($(this).attr("data-db") != "picture"){
// //                     error = true;
// //                     return false;
// //                 }else{
// //                     dataOBJ[$(this).attr("data-db")] = "";    
// //                 }
// //             }else{
// //                 dataOBJ[$(this).attr("data-db")] = $(this).val();
// //             }
// //         }

// //     });

// //     jsonString = JSON.stringify(dataOBJ);
// //     if(!error){
// //         if($("#product_picture_input").val() != ""){
// //             UploadFile('product_picture_input');
// //         }
// //         $("#test").val('https://markt.grabyourbag.nl/updatecreateproduct/'+ JSON.stringify(dataOBJ));
// //         $.ajax({
// //             cache: false,
// //             url: 'https://markt.grabyourbag.nl/updatecreateproduct/'+jsonString,
// //             type: "POST",
// //             datatype: "json",
// //             contentType: "application/json; charset=UTF-8",
// //             error: function (e) {
// //                 if (e.message != "undefined" && e.message != null) {
// //                     alert(e.message);
// //                 }
// //             },
// //             data: jsonString,
// //             success: function (data) {
// //                 alert(data);
// //                 $("#content_product_wrapper input").each(function(){
// //                     $(this).val('');
// //                 });
// //                 $("#product_stock").val("1");
// //             }
// //         });
// //     }else{
// //         alert("Vul alle velden in")
// //     }

// // }

// function addProduct(dataJSON){
//     dataOBJ = JSON.parse(dataJSON);


//     var html = "";

//     html += "<div class='productWrap' style=\"border: 1px solid #000; box-sizing: border-box; margin: 10px auto; width: 90%;\" data-ean=\""+dataOBJ['ean']+"\">";
    
//     if(dataOBJ['picture'] != ""){
//         html += "<img style=\"width: 50%; margin: auto\" src=\"https://markt.grabyourbag.nl/general/"+dataOBJ['picture']+"\">";    
//     }else{
//         html += "<div style=\"width: 50%; margin: auto border: 1px solid #000;\">";
//         html += "<p>Geen foto</p>";
//         html += "</div>";    
//     }
//     html += "<hr>";

//     html += "<div class=\"inputWrap\">";
//     html += "<label>Product prijs</label>";

//     var fullPrice = dataOBJ['price'];
//     var cents = fullPrice.slice(-2);
//     var euros = fullPrice.substring(0, str.length - 2);
//     var finalPrice = cents + ',' + euros;
//     html += "<p><input type=\"text\" data-db=\"price\" id=\"product_price\" value=\""+finalPrice+"\"></p>";
//     html += "</div>";
//     html += "<div class=\"inputWrap\">";
//     html += "<p><label>Voorraad</label></p>";
//     html += "<div class=\"floatWrap\">";
//     html += "<button class=\"defaultButton \" id=\"removeStockButton\" onclick=\"removeOneOrder();\">-</button>";
//     html += "<p><input type=\"text\" data-db=\"stoc\" class=\"smallInput\" id=\"product_stock\" value=\"1\"></p>";
//     html += "<button class=\"defaultButton\" id=\"addStockButton\" onclick=\"addOneOrder();\">+</button>";
//     html += "</div>";
//     html += "</div>";

    

//     html += "</div>";

//     $("#orderDiv").append(html);

    
// }


// function removeOneOrder(){
//     var id = 'product_stock';
//     var val = $("#"+id).val();
//     var initval = parseInt(val);
//     if((initval - 1) > 0){
//         initval = initval - 1;
//     }else{
//         initval = 0;
//     }
//     $("#"+id).val(initval)
// }
// function addOneOrder(){
//     var id = 'product_stock';
//     var val = $("#"+id).val();
//     var initval = parseInt(val);
//     initval = initval + 1;
//     $("#"+id).val(initval);
// }



// // function encodeImagetoBase64() {
// //     var file = $("#product_picture_input").files[0];
// //     var reader = new FileReader();
// //     reader.onloadend = function() {
// //         $("#picture_output").attr("src",reader.result);
// //         $("#picture_output_val").val(reader.result);
// //     }
// //     reader.readAsDataURL(file);
// // }



// // function UploadFile(elementID) {
// //     if($("#product_ean").val() != ""){
// //         var file_data = $('#'+elementID).prop('files')[0];
// //         var errorInfo = "";
// //         var form_data = new FormData();
// //         var path = window.location.pathname;
// //         var page = path.split("/").pop();
// //         form_data.append('file', file_data);
// //         $.ajax({
// //             cache: false,
// //             type: "POST",
// //             url: 'https://markt.grabyourbag.nl/uploadfile/' + $("#product_ean").val(),
// //             dataType: 'text',
// //             contentType: false,
// //             processData: false,
// //             data: form_data,
// //             success: function(errors){
// //                 errorInfo = errors;
// //             },
// //             complete: function(){
// //                 // alert(errorInfo);
// //             }
// //         });
// //     }else{
// //         alert("Scan eerst een barcode");
// //     }

// // }
