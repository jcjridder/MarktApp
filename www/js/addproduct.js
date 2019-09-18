function GetProduct(){
    cordova.plugins.barcodeScanner.scan(
        function (result) {          
            var obj = {};
            obj["setEan"] = result.text;

            var jsonString = JSON.stringify(obj)

            $("#test").text(jsonString);

            $.ajax({
                cache: false,
                url: 'https://markt.grabyourbag.nl/fetchproduct/'+jsonString,
                type: "POST",
                datatype: "json",
                contentType: "application/json; charset=UTF-8",
                error: function (e) {
                    if (e.message != "undefined" && e.message != null) {
                        alert(e.message);
                    }
                },
                data: jsonString,
                success: function (data) {
                    var dataObj = JSON.parse(data)
                    if(dataObj["result"] == "new"){
                        newProductSetup(data);
                    }else{
                        changeProduct(data);
                    }
                }
            });
        },
        function (error) {
            alert("Oeps er is iets mis gegaan: " + error);
        },
        {
            preferFrontCamera : false, // iOS and Android
            showFlipCameraButton : true, // iOS and Android
            showTorchButton : true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt : "Plaats barcode binnen vlak", // Android
            resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats : "EAN_13", // default: all but PDF_417 and RSS_EXPANDED
            orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations : true, // iOS
            disableSuccessBeep: false // iOS and Android
        }
    );
}

function newProductSetup(dataJSON){
    dataOBJ = JSON.parse(dataJSON);
    
    $("#content_product_wrapper input").each(function(){
        $(this).val('');
    });


    $("#product_ean").val(dataOBJ["ean"]);
    $("#product_stock").val("1");
    $("#content_product_wrapper").css("display","block");

}


function submitProduct(){

    var dataOBJ = {};

    var error = false;
    $("#content_product_wrapper input").each(function(){
        if($(this).val() != ""){
            if($(this).attr("data-db") == "picture"){

                var picNameArray = $(this).val().split("\\");
                var pic = picNameArray.pop();
                dataOBJ[$(this).attr("data-db")] = pic;
            }else if($(this).attr("data-db") == "price"){
                var str = $(this).val();
                var regex = /[.,\s]/g;
                var price = str.replace(regex, '');
                dataOBJ[$(this).attr("data-db")] = price;
            }else if($(this).attr("data-db") == "buyprice"){
                var str = $(this).val();
                var regex = /[.,\s]/g;
                var price = str.replace(regex, '');
                dataOBJ[$(this).attr("data-db")] = price;
            }else{
                dataOBJ[$(this).attr("data-db")] = $(this).val();
            }
        }else{
            if($(this).attr("data-db") != "name" && $(this).attr("data-db") != "description"){
                if($(this).attr("data-db") != "picture"){
                    error = true;
                    return false;
                }else{
                    dataOBJ[$(this).attr("data-db")] = "";    
                }
            }else{
                dataOBJ[$(this).attr("data-db")] = $(this).val();
            }
        }

    });

    jsonString = JSON.stringify(dataOBJ);
    if(!error){
        if($("#product_picture_input").val() != ""){
            UploadFile('product_picture_input');
        }
        $("#test").val('https://markt.grabyourbag.nl/updatecreateproduct/'+ JSON.stringify(dataOBJ));
        $.ajax({
            cache: false,
            url: 'https://markt.grabyourbag.nl/updatecreateproduct/'+jsonString,
            type: "POST",
            datatype: "json",
            contentType: "application/json; charset=UTF-8",
            error: function (e) {
                if (e.message != "undefined" && e.message != null) {
                    alert(e.message);
                }
            },
            data: jsonString,
            success: function (data) {
                alert(data);
                $("#content_product_wrapper input").each(function(){
                    $(this).val('');
                });
                $("#product_stock").val("1");
            }
        });
    }else{
        alert("Vul alle velden in")
    }

}

function RaboIntent(){
    window.plugins.intentShim.startActivity(
        {
            action: "nl.rabobank.smartpin.PAY",
            // flags: "Intent.FLAG_ACTIVITY_CLEAR_TOP",
            extras: {
                "id": "abcdefg",
                "amount": 1234,
                "reference": "Mijn betaling",
                "type": "PIN"
            }
        },

        function () { },
        function () { alert('Failed to open URL via Android Intent') }
    );
}

function changeProduct(dataJSON){
    dataOBJ = JSON.parse(dataJSON);

    var key;
    for (key of Object.keys(dataOBJ)) {
        if(key != 'result'){
            if(key == 'picture'){
                $("#picture_output").attr("src","https://markt.grabyourbag.nl/general/"+dataOBJ[key]);
            }else{
                $("#product_" + key).val(dataOBJ[key]);
            }
        }
    }
    $("#content_product_wrapper").css("display","block");
}


function removeOne(){
    var id = 'product_stock';
    var val = $("#"+id).val();
    var initval = parseInt(val);
    if((initval - 1) > 0){
        initval = initval - 1;
    }else{
        initval = 0;
    }
    $("#"+id).val(initval)
}
function addOne(id = 'product_stock'){
    var val = $("#"+id).val();
    var initval = parseInt(val);
    initval = initval + 1;
    $("#"+id).val(initval);
}



function encodeImagetoBase64() {
    var file = $("#product_picture_input").files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        $("#picture_output").attr("src",reader.result);
        $("#picture_output_val").val(reader.result);
    }
    reader.readAsDataURL(file);
}



function UploadFile(elementID) {
    if($("#product_ean").val() != ""){
        var file_data = $('#'+elementID).prop('files')[0];
        var errorInfo = "";
        var form_data = new FormData();
        var path = window.location.pathname;
        var page = path.split("/").pop();
        form_data.append('file', file_data);
        $.ajax({
            cache: false,
            type: "POST",
            url: 'https://markt.grabyourbag.nl/uploadfile/' + $("#product_ean").val(),
            dataType: 'text',
            contentType: false,
            processData: false,
            data: form_data,
            success: function(errors){
                errorInfo = errors;
            },
            complete: function(){
                // alert(errorInfo);
            }
        });
    }else{
        alert("Scan eerst een barcode");
    }

}




function GetProductSale(){
    cordova.plugins.barcodeScanner.scan(
        function (result) {          
            var obj = {};
            obj["setEan"] = result.text;

            var jsonString = JSON.stringify(obj)

            $("#test").text(jsonString);

            $.ajax({
                cache: false,
                url: 'https://markt.grabyourbag.nl/fetchproduct/'+jsonString,
                type: "POST",
                datatype: "json",
                contentType: "application/json; charset=UTF-8",
                error: function (e) {
                    if (e.message != "undefined" && e.message != null) {
                        alert(e.message);
                    }
                },
                data: jsonString,
                success: function (data) {
                    addProduct(data);
                }
            });
        },
        function (error) {
            alert("Oeps er is iets mis gegaan: " + error);
        },
        {
            preferFrontCamera : false, // iOS and Android
            showFlipCameraButton : true, // iOS and Android
            showTorchButton : true, // iOS and Android
            torchOn: false, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt : "Plaats barcode binnen vlak", // Android
            resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats : "EAN_13", // default: all but PDF_417 and RSS_EXPANDED
            orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations : true, // iOS
            disableSuccessBeep: false // iOS and Android
        }
    );
}
function addProduct(dataJSON){


    dataOBJ = JSON.parse(dataJSON);

    var html = "";

    html += "<div id=\"tile_"+dataOBJ['ean']+"\" class='productWrap' style=\"border: 1px solid #000; box-sizing: border-box; margin: 10px auto; width: 90%;\" data-ean=\""+dataOBJ['ean']+"\">";

    html += "<button class=\"defaultButton bigButton\" onclick=\"removeMe("+dataOBJ['ean']+");\">Verwijderen</button>"
    html += "<hr>";
    if(dataOBJ['picture'] != ""){
        html += "<img style=\"width: 50%; margin: auto; display: block;\" src=\"https://markt.grabyourbag.nl/general/"+dataOBJ['picture']+"\">";    
    }else{
        html += "<div style=\"width: 50%; margin: auto border: 1px solid #000;\">";
        html += "<p>Geen foto</p>";
        html += "</div>";    
    }

    html += "<hr>";
    html += "<p>"+dataOBJ['name']+"</p>";


    var calcWithfullPriceString = dataOBJ['price'] / 100;
    var calcWithfullBuyInPrice = dataOBJ['buyprice'] / 100;

    var withoutVat = calcWithfullPriceString / 1.21;
    var profit = withoutVat - calcWithfullBuyInPrice;

    html += "<div class=\"inputWrap\">";
    profit = parseFloat(profit).toFixed(2);
    var regex = /[.,\s]/g;
    var profit = profit.replace(regex, ',');
    html += "<p id=\"profit_"+dataOBJ['ean']+"\" class=\"profitData\" data-profit=\""+profit+"\">Marge: &euro; "+profit+"</p>";
    html += "</div>";

    html += "<div class=\"inputWrap\">";
    html += "<label>Product prijs</label>";

    var fullPriceString = dataOBJ['price'];
    fullPrice = fullPriceString.toString();
    var cents = fullPrice.toString().slice(-2);
    var euros = fullPrice.substring(0, fullPrice.length - 2);
    var finalPrice = euros + '.' + cents;
    finalPrice = parseFloat(finalPrice).toFixed(2);
    html += "<p><input type=\"number\" class=\"priceData\" id=\"price_"+dataOBJ['ean']+"\" data-buyin=\""+dataOBJ['buyprice']+"\" data-price=\""+dataOBJ['price']+"\" min=\"1\" inputmode=\"numeric\" onchange=\"calculateProfiteAgain('"+dataOBJ['ean']+"');\" pattern=\"[0-9]*\"  data-db=\"price\" id=\"product_price\" value=\""+finalPrice+"\"></p>";
    html += "</div>";

    html += "<div class=\"inputWrap\">";
    html += "<p><label>Voorraad</label></p>";
    html += "<div class=\"floatWrap\">";
    html += "<button class=\"defaultButton\" id=\"removeStockButton\" onclick=\"removeOneOrder('"+dataOBJ['ean']+"');\">-</button>";
    html += "<p><input data-db=\"stoc\" type=\"number\" min=\"1\" onchange=\"calculateProfiteAgain('"+dataOBJ['ean']+"');\" inputmode=\"numeric\" pattern=\"[0-9]*\" class=\"smallInput amountData\" id=\"amount_"+dataOBJ['ean']+"\" value=\"1\"></p>";
    html += "<button class=\"defaultButton\" id=\"addStockButton\" onclick=\"addOneOrder('"+dataOBJ['ean']+"');\">+</button>";
    html += "</div>";
    html += "</div>";

    

    html += "</div>";

    

    $("#orderDiv").append(html);


    finalProfit();
    finalAmount();
    
}

function removeMe(ean){
    $("#tile_" + ean).remove();
    finalProfit();
    finalAmount();
}


function calculateProfiteAgain(ean){

    var str = $("#price_"+ean).val();
    var regex = /[.,\s]/g;
    var price = str.replace(regex, '');


    var calcWithfullPriceString = price / 100;
    var calcWithfullBuyInPrice = $("#price_"+ean).attr("data-buyin") / 100;

    var withoutVat = calcWithfullPriceString / 1.21;
    var profit = withoutVat - calcWithfullBuyInPrice;
    var profit = profit * $("#amount_"+ean).val();
    profit = parseFloat(profit).toFixed(2);
    var regex = /[.,\s]/g;
    var profit = profit.replace(regex, ',');
    $("#profit_"+ean).html("Marge: &euro; " + profit);
    $("#profit_"+ean).attr("data-profit",profit);
    finalProfit();
    finalAmount();
}

function removeOneOrder(ean){
    var val = $("#amount_"+ean).val();
    var initval = parseInt(val);
    if((initval - 1) > 0){
        initval = initval - 1;
    }else{
        initval = 0;
    }
    $("#amount_"+ean).val(initval)
    calculateProfiteAgain(ean);
}
function addOneOrder(ean){
    var val = $("#amount_"+ean).val();
    var initval = parseInt(val);
    initval = initval + 1;
    $("#amount_"+ean).val(initval);
    calculateProfiteAgain(ean);
}

function finalProfit(){
    var moneyz = 0;
    $(".productWrap").each(function(){
        
        var str = $(this).find(".profitData").attr("data-profit");
        var regex = /[.,\s]/g;
        var price = str.replace(regex, '');

        moneyz = moneyz + (price / 100);

    });

    $("#myProfit").attr("data-profit",moneyz);
    moneyz = parseFloat(moneyz).toFixed(2);
    var regex = /[.,\s]/g
    var moneyz = moneyz.replace(regex, ',');
    $("#myProfit").html("&euro;" + moneyz);
}

function finalAmount(){

    var moneyz = 0;
    $(".productWrap").each(function(){
        var str = $(this).find(".priceData").val();
        var regex = /[.,\s]/g;
        var price = str.replace(regex, '');

        price = price * $(this).find(".amountData").val();

        moneyz = moneyz + (price / 100);

    });

    $("#myProfit").attr("data-price",moneyz);
    moneyz = parseFloat(moneyz).toFixed(2);
    var regex = /[.,\s]/g;
    var moneyz = moneyz.replace(regex, ',');
    $("#myPrice").html("&euro;" + moneyz);

}


function submitOrder(){
    
    r = confirm("Weet je zeker dat je door wilt gaan?\r\nDe prijs zal verdwijnen");
    if(r){

        var obj = {};
        var index = 0;
        $(".productWrap").each(function(){
            obj[index] = {};
            obj[index]["ean"] = $(this).attr("data-ean");
            obj[index]["amount"] = $(this).find(".amountData").val();
            var profit = $(this).find(".priceData").attr("data-buyin")
            var regex = /[.,\s]/g;
            obj[index]["profit"] = profit.replace(regex, '');
            var price = $(this).find(".priceData").val()
            obj[index]["price"] = price.replace(regex, '');
            obj[index]["method"] = $("#method").val();
            index ++;
        }); 
    
    
        var jsonString = JSON.stringify(obj)
    
    
        $.ajax({
            cache: false,
            url: 'https://markt.grabyourbag.nl/submitorder/'+jsonString,
            type: "POST",
            datatype: "json",
            contentType: "application/json; charset=UTF-8",
            error: function (e) {
                if (e.message != "undefined" && e.message != null) {
                    alert(e.message);
                }
            },
            data: jsonString,
            success: function (data) {
                $(".productWrap").each(function(){
                    $(this).remove();
                    finalProfit();
                    finalAmount();
                });
                $("#method").val("Pin");
            }
        });
    }
}