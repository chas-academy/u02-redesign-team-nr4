/*
 * JAM Utilities JavaScript 1.0
 *
 * Copyright Sounden AB 2010
 * http://www.sounden.se
 *
 * author: Johan Sanden (@sounden)
 */
var itemNRdiv = '';

function removeFromCart(itemNo) {
    var itemNR = '';


    itemNR = itemNo;
    itemNRdiv = "#" + itemNR;

    if (itemNR.length == 0) {
        alert("Minst en produkt måste finnas!!!");
        return
    }

    var mygetrequest = new ajaxRequest()

    document.getElementById("status_" + itemNR).innerHTML = "<img src=../images/loader.gif>";

    mygetrequest.onreadystatechange = function() {
        if (mygetrequest.readyState == 4) {
            if (mygetrequest.status == 200 || window.location.href.indexOf("http") == -1) {

                var substrings = new Array();
                substrings = mygetrequest.responseText.split("|");
                document.getElementById("currentCart").innerHTML = substrings[1];
                document.getElementById("cartTotal").innerHTML = substrings[2];
                $('#' + itemNR).fadeOut("slow").css({
                    "background-color": "#FFFF99"
                });

            } else {
                alert("Något gick fel vid borttagningen!");
            }
        }
    }

    mygetrequest.open("GET", "/itemHandling.php?action=removeFromCart&itemNo=" + itemNR, true);
    mygetrequest.send(null)
}


function updateAmountInCart(itemNo, newAmount) {
    var itemNR = '';
    itemNR = itemNo;

    if (itemNR.length == 0) {
        alert("Minst en produkt måste finnas!!!");
        return
    }

    if (newAmount < 0 || newAmount.length == 0) {
        //alert("Minst en produkt måste finnas!!!");
        return
    }

    var mygetrequest = new ajaxRequest()

    document.getElementById("status_" + itemNR).innerHTML = "<img src=../images/loader.gif>";

    mygetrequest.onreadystatechange = function() {
        if (mygetrequest.readyState == 4) {
            if (mygetrequest.status == 200 || window.location.href.indexOf("http") == -1) {

                var substrings = new Array();
                substrings = mygetrequest.responseText.split("|");
                document.getElementById("currentCart").innerHTML = substrings[1];
                document.getElementById("cartTotal").innerHTML = substrings[2];
                document.getElementById("itemTotal_" + itemNR).innerHTML = substrings[3];
                document.getElementById("status_" + itemNR).innerHTML = "<img src=../images/cart_delete.gif>";

                if (newAmount == 0) {
                    $('#' + itemNR).fadeOut("slow").css({
                        "background-color": "#FFFF99"
                    });
                }





            } else {
                alert("An error has occured making the request")
            }
        }
    }

    mygetrequest.open("GET", "/itemHandling.php?action=updateAmountInCart&itemNo=" + itemNR + "&amount=" + newAmount, true);
    mygetrequest.send(null)
}



function checkEmailExists(email) {

    if (email.length == 0) {
        //alert("Minst en produkt och antal måste i!!");
        return
    }

    var mygetrequest = new ajaxRequest()

    mygetrequest.onreadystatechange = function() {
        if (mygetrequest.readyState == 4) {
            if (mygetrequest.status == 200 || window.location.href.indexOf("http") == -1) {


                substrings = mygetrequest.responseText

                if (substrings == email) {
                    $('#emailInfo').html("Eposten finns redan registrerad, var god använd login formuläret");
                    $('#cust_email').css({
                        'border-color': '#D6212A'
                    })
                } else {
                    $('#emailInfo').html('');
                    $('#cust_email').css({
                        'border-color': ''
                    })
                }

            } else {
                alert("An error has occured making the request")
            }
        }
    }

    mygetrequest.open("GET", "/kreditor/klapi.php?email=" + email, true);
    mygetrequest.send(null)
}





function addToCart(itemNo, amount, notice) {
    itemNR = itemNo;

    if (amount.length == 0 || itemNo.length == 0) {
        //document.getElementById("urlResult").innerHTML="<img src=TaskFailed.png width=12px>"
        alert("Minst en produkt och antal måste i!!");
        return
    }

    var mygetrequest = new ajaxRequest()

    if (notice == 1) {
        document.getElementById("itemBoxUpdate_" + itemNo).innerHTML = "<div class=addProduct>Läggs nu i varukorgen.</div>";
    }


    // remove current class buy while we wait for the product to get added //
    $('#buyButtonUpdate_' + itemNo).toggleClass('buy', false);
    //add new class to item buy2 while we wait //
    $('#buyButtonUpdate_' + itemNo).toggleClass('buy2', true);
    $('#buyButtonUpdate_' + itemNo).toggleClass('buy2_animate', true);
    $('#currentCart').fadeOut("slow");


    mygetrequest.onreadystatechange = function() {
        if (mygetrequest.readyState == 4) {
            if (mygetrequest.status == 200 || window.location.href.indexOf("http") == -1) {

                var substrings = new Array();
                substrings = mygetrequest.responseText.split("|");

                if (notice == 1) {
                    document.getElementById("itemBoxUpdate_" + itemNo).innerHTML = substrings[0];
                }
                $('#buyButtonUpdate_' + itemNo).toggleClass('buy', true);
                $('#buyButtonUpdate_' + itemNo).toggleClass('buy2', false);
                $('#buyButtonUpdate_' + itemNo).toggleClass('buy2_animate', false);

                // removed due to IE6 bug //
                //document.getElementById("buyButtonUpdate_" + itemNo).innerHTML="<a href=\"javascript:addToCart('" + itemNo +"','1','" + notice +"');\">Köp</a>";

                document.getElementById("currentCart").innerHTML = substrings[1];
                $('#currentCart').fadeIn("slow");

            } else {
                alert("An error has occured making the request")
            }
        }
    }

    mygetrequest.open("GET", "/itemHandling.php?action=addToCart&amount=" + amount + "&itemNo=" + itemNR, true);
    mygetrequest.send(null)
}


function ajaxRequest() {
    var activexmodes = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] //activeX versions to check for in IE
    if (window.ActiveXObject) { //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
        for (var i = 0; i < activexmodes.length; i++) {
            try {
                return new ActiveXObject(activexmodes[i])
            } catch (e) {
                //suppress error
            }
        }
    } else if (window.XMLHttpRequest) // if Mozilla, Safari etc
        return new XMLHttpRequest()
    else
        return false
}




/**
 * Removed Twitter 2011-05-02
 *
$.ajax({
    url : "http://twitter.com/statuses/user_timeline/jam_se.json?callback=?",
    dataType : "json",
    timeout:15000,

    success : function(data)
    {
        var show = 1;
        for (i=0; i<show; i++)
        {
            $("#twitter").append("<li><a href=http://twitter.com/jam_se><b>@jam_se</b>: " + data[i].text) +"</a></li>";
            
        }
    },

    error : function()
    {
         $("#twitter").html("Fick inte tag på @jam_se på twitter!");
    }

});

 * toUnicode()
 * Removed due to IE6 bug
 * Jump to next inputbox if max lenght has been reached
 * 2010-11-25


 function toUnicode(elmnt,content){
    if (content.length==elmnt.maxLength){
                $("input").next().focus();
                
	}
 }
 ***/


/****
 * Function()
 * restForm is used when changing payment via klarna/kreditor to another method
 * 2010-11-25
 ***/

function resetForm() {
    // LOCKUP and RESET input//
    $('#cust_city').attr('readonly', false);
    $('#cust_zipcode').attr('readonly', false);
    $('#cust_address').attr('readonly', false);
    $('#cust_firstname').attr('readonly', false);
    $('#cust_lastname').attr('readonly', false);
    $('#cust_company').attr('readonly', false);
    $('#inputDob').attr('value', '');
    $('#inputDob2').attr('value', '');
    // make it visible that you can not change the input field //
    $('#cust_lastname').css({
        "background-color": "#FFFFFF"
    })
    $('#cust_firstname').css({
        "background-color": "#FFFFFF"
    })
    $('#cust_company').css({
        "background-color": "#FFFFFF"
    })
    $('#cust_zipcode').css({
        "background-color": "#FFFFFF"
    })
    $('#cust_city').css({
        "background-color": "#FFFFFF"
    })
    $('#cust_address').css({
        "background-color": "#FFFFFF"
    })

}

function infoKreditor() {
    $('#kreditorDob').fadeIn("slow").css({
        "background-color": "#FFFF99"
    });
    $('#paymentInfo').html('<h3>Klarna faktura - 14 dagar</h3><p>Vid beställning på faktura så kräver <a href="http://www.klarna.se" target="_new">Klarna</a> ett giltigt personnummer och en ålder på minst 18 år. Leveransaddress går <b>ej</b> att välja. <a href="https://online.klarna.com/villkor.yaws?eid=16828&charge=0" target="_new">Klarna Köpvillkor</a></p>');
}

function infoPaypal() {
    $('#kreditorDob').fadeOut("slow").css({
        "background-color": "#FFFF99"
    });
    $('#addresses').fadeOut("slow").css({
        "background-color": "#FFFF99"
    });
    $('#paymentInfo').html('<h3>Paypal</h3><p>Vid beställning av varor via PayPal skickas en elektronisk faktura till angiven e-postaddress när beställningen är genomförd.</p>');

    // reset the form //
    resetForm();
}

function infoPrePay() {
    $('#kreditorDob').fadeOut("slow").css({
        "background-color": "#FFFF99"
    });
    $('#addresses').fadeOut("slow").css({
        "background-color": "#FFFF99"
    });
    $('#paymentInfo').html('<h3>Förskottsbetalning</h3><p>Vid beställning av varor på förskottsbetalning kontaktar vi er via e-post med betalningsuppgifter när beställningen är genomförd.</p>');
    resetForm();

}

function hideError(id) {
    $('#' + id).fadeOut("fast");
}




function getKreditorData(addressId) {

    var pno1 = $("#inputDob").attr("value");
    var pno2 = $("#inputDob2").attr("value");
    var pno = pno1 + pno2;

    if (pno.length != 10) {

        $('#inputDob').css({
            "border-color": "#D6212A"
        })
        $('#inputDob2').css({
            "border-color": "#D6212A"
        })
        return;

    }

    $('#inputDob').css({
        "border-color": ""
    })
    $('#inputDob2').css({
        "border-color": ""
    })

    // use this in order to decide if its a company orgnr or pn //
    var pnoPart;
    pnoPart = parseInt(pno.substring(2, 4));


    var mygetrequest = new ajaxRequest()

    mygetrequest.onreadystatechange = function() {
        if (mygetrequest.readyState == 4) {
            if (mygetrequest.status == 200 || window.location.href.indexOf("http") == -1) {


                var krerror = mygetrequest.responseText.match(/error/);
                if (krerror == "error") {

                    $('#formError').html("<span id=kreditorErrorMessage><p>" + mygetrequest.responseText + "</p></span>");
                    $('#formError').fadeIn("fast").css({
                        "background-color": "#000"
                    });
                    return;
                }

                var addresses = new Array();
                addresses = mygetrequest.responseText.split("|");
                // get the total lenght of the array
                totalAddresses = addresses.length;

                var items = new Array();

                if (addressId == undefined) {
                    // loop through the array to get all the addresses if addressId is not set

                    // reset the options //
                    $('#addressselect').
                    find('option')
                        .remove()
                        .end();

                    for (var i in addresses) {

                        // split the addresslist from string //
                        items = addresses[i].split(",");
                        // count the address array 
                        if (totalAddresses > 1) {

                            $('#addressselect')
                                .append($("<option></option>")
                                    .attr("value", i)
                                    .text(items[1] + ", " + items[2]));

                        } else {

                            // check if we got at company or not //
                            if (pnoPart <= 12) {
                                $('#cust_lastname').attr('value', items[1]);
                            } else {
                                $('#cust_company').attr('value', items[1]);
                            }
                            $('#cust_firstname').attr('value', items[0]);
                            $('#cust_address').attr('value', items[2]);
                            $('#cust_zipcode').attr('value', items[3]);
                            $('#cust_city').attr('value', items[4]);

                            // LOCKDOWN! //

                            if (pnoPart < 12) {
                                // PNO is privatperson
                                $('#cust_lastname').attr('readonly', true);
                                $('#cust_firstname').attr('readonly', true);
                                $('#cust_company').attr('readonly', false);
                                $('#cust_lastname').css({
                                    "background-color": "#E1E1E1"
                                })
                                $('#cust_firstname').css({
                                    "background-color": "#E1E1E1"
                                })
                                $('#cust_company').css({
                                    "background-color": ""
                                })
                            } else {
                                // PNO is company
                                $('#cust_company').attr('readonly', true);
                                $('#cust_lastname').attr('readonly', false);
                                $('#cust_firstname').attr('readonly', false);
                                $('#cust_lastname').css({
                                    "background-color": ""
                                })
                                $('#cust_firstname').css({
                                    "background-color": ""
                                })
                                $('#cust_company').css({
                                    "background-color": "#E1E1E1"
                                })
                            }


                            //$('#cust_lastname').attr('readonly', true);
                            //$('#cust_firstname').attr('readonly', true);
                            $('#cust_zipcode').attr('readonly', true);
                            $('#cust_city').attr('readonly', true);
                            $('#cust_address').attr('readonly', true);

                            // make it visible that you can not change the input field //

                            $('#cust_zipcode').css({
                                "background-color": "#E1E1E1"
                            })
                            $('#cust_city').css({
                                "background-color": "#E1E1E1"
                            })
                            $('#cust_address').css({
                                "background-color": "#E1E1E1"
                            })

                        }

                    }

                    // ok now display the div //
                    if (totalAddresses > 1) {
                        $('#addresses').fadeIn("slow").css({
                            "background-color": "#FFFF99"
                        });
                    } else {
                        $('#addresses').fadeOut("slow").css({
                            "background-color": "#FFFF99"
                        });
                    }

                }

                // if we got an ID from the array use it instead //
                if (addressId != undefined) {

                    items = addresses[addressId].split(",");
                    // check if we got at company or not //
                    if (pnoPart <= 12) {
                        $('#cust_lastname').attr('value', items[1]);
                        $('#cust_lastname').attr('readonly', true);
                    } else {
                        $('#cust_company').attr('value', items[1]);
                        $('#cust_company').attr('readonly', true);
                        $('#cust_lastname').attr('value', items[0]);
                        $('#cust_firstname').attr('value', items[0]);
                    }
                    $('#cust_firstname').attr('value', items[0]);
                    $('#cust_address').attr('value', items[2]);
                    $('#cust_zipcode').attr('value', items[3]);
                    $('#cust_city').attr('value', items[4]);

                    // Lockdown! //
                    $('#cust_city').attr('readonly', true);
                    $('#cust_zipcode').attr('readonly', true);
                    $('#cust_address').attr('readonly', true);
                    // make it visible that you can not change the input field //
                    $('#cust_zipcode').css({
                        "background-color": "#E1E1E1"
                    })
                    $('#cust_city').css({
                        "background-color": "#E1E1E1"
                    })
                    $('#cust_address').css({
                        "background-color": "#E1E1E1"
                    })
                    $('#cust_company').css({
                        "background-color": "#E1E1E1"
                    })

                }

            } else {
                alert("Något fel har inträffat, kontakta postorder@jam.se om det kvarstår!")
            }
        }
    }

    mygetrequest.open("GET", "/kreditor/klapi.php?pno=" + pno, true);
    mygetrequest.send(null)

}




function isValid(event) {
    var keyCode = (event.which) ? event.which : event.keyCode;
    var validCodes = new Array(8, 9, 16, 37, 39);
    var i = validCodes.length;


    if (keyCode < 48 || keyCode > 57) {
        while (i--) {
            if (validCodes[i] === keyCode) {
                return true;
            }
        }
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
    } else {
        return true;
    }
}


$.widget("custom.catcomplete", $.ui.autocomplete, {
    _renderMenu: function(ul, items) {
        var self = this,
            currentCategory = "";
        $.each(items, function(index, item) {
            if (item.category != currentCategory) {
                ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                currentCategory = item.category;
            }
            self._renderItem(ul, item);
        });
    }
});

$(function() {
    $("#qsearch").catcomplete({
        source: "/qsearch.php",
        minLength: 3,
        delay: 0

    }).keydown(function(e) {
        if (e.keyCode === 13) {
            $("#header_search_form").trigger('submit');
        }
    });

});


//$("#qsearch").focus();


function checkReadCond() {
    if ($('input[name=agree]').is(':checked')) {

        document.sendOrder.submit();
    } else {
        alert("Ni måste acceptera köpvilkoren.");
    }
}

function validateUserInfo() {

    if ($("input[@name='rdio']:checked").val() == 'klarna') {
        if ($('#inputDob').val() == "" && $('#inputDob2').val() == "") {
            alert("Vid Klarna så måste fullständigt personnummer anges!");

            return;

        }

    }


    if ($('#cust_email').val() != "" &&
        $('#cust_password').val() != "" &&
        $('#cust_firstname').val() != "" &&
        $('#cust_lastname').val() != "" &&
        $('#cust_address').val() != "" &&
        $('#cust_zipcode').val() != "" &&
        $('#cust_city').val() != "" &&
        $('#cust_country').val() != "" &&
        $('#cust_phone').val() != ""
    )

    {
        document.orderForm.submit();
    } else {
        alert("Alla fält måste vara ifyllda för att fortsätta, dock ej företagsnamn om du är privatperson.");
    }



}


function openWindow(url) {
    window.open(url, "forgot", "menubar=1,resizable=0,width=350,height=350");
}