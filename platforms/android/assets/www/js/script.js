function initilize() {
    myApp.alert("initiliEd");
}

function check_age(age) {

    var age = $('#' + age).val();
    if (isNaN(age)) {

        myApp.alert("age should be numeric");
        $('[name="age"]').val("");
        return false;
    }

}

function check_mobile(mobile) {

    var mobile = $('#' + mobile).val();
    if (isNaN(mobile)) {

        myApp.alert("Mobile Number Should Be Numeric");
        $('[name="mobile"]').val("");
        return false;
    }

}


// $(document).on('click', '#whatshappening_map', function(event) {

//     $('.active-tab').css('color','');
//     $('.active-tab').css('border-bottom','');
//     $('.labels').css('color','');

//     $('.tab').removeClass('active-tab');
//     $('.owl-item').removeClass('active-tab');
//     $(this).addClass('active-tab');

//     $('.active-tab').css('color','green');
//     $('.active-tab').css('border-bottom','2px solid green');


// }




function call(para1) {

    window.open('tel:' + para1);
}

function get_direction(para1, para2) {

    directions.navigateTo(para1, para2); // latitude, longitude
}

document.addEventListener("deviceready", onDeviceReady, false);


function onDeviceReady() {


    // alert('device is now ready');


    if (Lockr.get("is_logged_in")) {

        // mainView.router.loadPage("location.html");
        mainView.router.loadPage("type.html");

        console.log("user is logged in");

    } else {

        console.log("user is not logged in");
    }

    document.addEventListener("backbutton", function(e) {

        e.preventDefault();

        $.fancybox.close();
        
        var page = myApp.getCurrentView().activePage;
        myApp.hideIndicator();


        // mainView.router.refreshPage();

        if (page.name == "offline") {

            myApp.confirm('would you like to exit app.', function() {
                navigator.app.clearHistory();
                navigator.app.exitApp();
            });
            return false;
        }

        if (page.name == "index") {

            myApp.confirm('would you like to exit app.', function() {
                navigator.app.clearHistory();
                navigator.app.exitApp();
            });

        } else if (page.name == "type") {

            if (Lockr.get('is_logged_in')) {

                myApp.confirm('would you like to exit app.', function() {
                    navigator.app.clearHistory();
                    navigator.app.exitApp();
                });

            } else {

                mainView.router.back({});
            }
        } else {
            mainView.router.back({});
        }

    }, false);


    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);

}

function onOnline() {
    // Handle the online event
    // myApp.alert("online");
    // mainView.
}

function onOffline() {
    // Handle the online event
    // myApp.alert("No Internet");
    mainView.router.loadPage('offline.html');

}

function current_date() {

    var d = new Date();
    var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var day = d.getDate();
    var month = m[d.getMonth()];
    var year = d.getFullYear();

    // 
    return day + " " + month + " " + year;

}

var mylogin = function() {

    var fbLoginSuccess = function(userData) {
        var id = userData['authResponse']['userID'];
        // alert(id);

        $.ajax({

                url: base_url + 'check_user',
                type: 'POST',
                dataType: 'json',
                data: {
                    id: id
                },
            })
            .done(function(result) {

                if (result['status'] == 'success') {

                    // alert('check user success');

                    Lockr.set("id", result['data']['id']);
                    Lockr.set("name", result['data']['name']);
                    Lockr.set("type", "fb");
                    Lockr.set("is_logged_in", true);

                    // mainView.router.loadPage("location.html");

                    mainView.router.loadPage("type.html");


                } else {

                    // alert('check user failed');

                    facebookConnectPlugin.api('/me?fields=id,email,name,picture', ["public_profile"], function(myresult) {

                            var fb_id = myresult.id;
                            var type = "fb";
                            var email = myresult.email;
                            var name = myresult.name;

                            var fb_image_url = myresult.picture.data.url;

                            var nm = name.substring(0, 3);
                            var num = Math.floor(1000 + Math.random() * 9000);

                            var img_name = fb_id + ".jpg";


                            var ref_code = nm + num;
                            var is_redeemed = 0;

                            $.ajax({

                                url: base_url + "register/",
                                type: 'POST',
                                dataType: 'json',
                                data: {

                                    fb_id: fb_id,
                                    type: type,
                                    email: email,
                                    name: name,
                                    img_name: img_name,
                                    ref_code: ref_code,
                                    is_redeemed: is_redeemed

                                },
                                success: function(result) {

                                    if (result.status == 'success') {
                                        // alert('register success');

                                        Lockr.set("id", result.id);
                                        Lockr.set("name", result.name);

                                        $.ajax({

                                            url: base_url + "upload_fb/",
                                            type: 'POST',
                                            dataType: 'json',
                                            data: {

                                                fb_image_url: fb_image_url,
                                                img_name: img_name

                                            },
                                            success: function(result) {

                                                if (result.status == 'success') {
                                                    // alert('Upload fb image success');
                                                    
                                                    Lockr.set("type", "fb");
                                                    Lockr.set("is_logged_in", true);

                                                    // mainView.router.loadPage("location.html");

                                                    mainView.router.loadPage("type.html");


                                                }else{

                                                    alert('Upload Image Failed');
                                                }

                                            },
                                            error: function(jqXHR, exception) {

                                                alert("Server Error");
                                            }
                                        })


                                    } else {
                                        alert("Registeration Failed");
                                    }
                                },
                                error: function(jqXHR, exception) {
                                    alert("Server Error");
                                }
                            })
                        },
                        function(error) {
                            alert("Failed: " + error);
                        }
                    );
                }

            })
            .fail(function() {

                alert('Server Error');
            })
            .always(function() {
                console.log("complete");
            });
    }

    facebookConnectPlugin.login(["public_profile"], fbLoginSuccess,

        function(error) {
            alert("Error " + JSON.stringify(error));
        }
    );


}

var getStatus = function() {
    facebookConnectPlugin.getLoginStatus(
        function(response) {
            alert(JSON.stringify(response))
        },
        function(response) {
            alert(JSON.stringify(response))
        });
}

var logout = function() {

    facebookConnectPlugin.logout(

        function(response) {},
        function(response) {});
}


function check_login() {

    if (Lockr.get("is_logged_in")) {

        myApp.pickerModal('.review_picker');

    } else {

        myApp.alert("Sign In Required");
        mainView.router.loadPage('login.html');
    }

    return false;
}


function share(code) {

    var message = {

        subject: "Mumbai Parties",
        text: "Your Reference Code Is - " + code
            // url: "https://play.google.com/store/apps/details?id=com.kreaserv.neonbuzz&hl=en"
            // image: image
    };

    window.socialmessage.send(message);

    // alert('share');

    // this is the complete list of currently supported params you can pass to the plugin (all optional)
    // var options = {
    //   message: 'share this', // not supported on some apps (Facebook, Instagram)
    //   subject: 'the subject', // fi. for email
    //   files: ['', ''], // an array of filenames either locally or remotely
    //   url: 'https://www.website.com/foo/#bar?a=b',
    //   chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
    // }

    // var onSuccess = function(result) {
    //   console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
    //   console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
    // }

    // var onError = function(msg) {
    //   console.log("Sharing failed with message: " + msg);
    // }

    // window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
}

function inc_single() {

    $("#dec_single").prop('disabled', false);
    var quantity = Number($('#single_text').text());
    var amount = Number($('#amount').text());

    quantity += 1;
    amount += 1000;

    $('#single_text').text(quantity);
    $('#amount').text(amount);

    $('.single-textbox').append("<div class='col-50'><input class='book-name' type='text' name='single_name'></div>");

}

function dec_single() {

    var quantity = Number($('#single_text').text());
    var amount = Number($('#amount').text());

    quantity -= 1;
    amount -= 1000;

    $('#single_text').text(quantity);
    $('#amount').text(amount);


    $('.single-textbox .col-50:last-child').remove();

    // $('.single-textbox').remove("<div class='col-50'><input class='book-name' type='text' name='single_name'></div>");


    if (quantity == 0) {
        $("#dec_single").prop('disabled', true);
        return false;
    }

}

function inc_couple() {

    $("#dec_couple").prop('disabled', false);

    var quantity = Number($('#couple_text').text());
    var amount = Number($('#amount').text());

    quantity += 1;
    amount += 2000;

    $('#couple_text').text(quantity);
    $('#amount').text(amount);

    $('.couple-textbox').append("<div class='col-50'><input class='book-name' type='text' name='single_name'></div>");


}

function dec_couple() {

    var quantity = Number($('#couple_text').text());
    var amount = Number($('#amount').text());

    quantity -= 1;
    amount -= 2000;

    $('#couple_text').text(quantity);
    $('#amount').text(amount);



    $('.couple-textbox .col-50:last-child').remove();


    if (quantity == 0) {
        $("#dec_couple").prop('disabled', true);
        return false;
    }

}

var tbl_count = 0;


function inc_table() {

    $("#dec_table").prop('disabled', false);

    var quantity = Number($('#table_text').text());
    var amount = Number($('#amount').text());

    if (tbl_count == 0) {
        quantity += 2;
        amount += 4000;
        tbl_count++;
    } else {
        quantity = quantity + 1;
        amount += 2000;
    }
    $('#table_text').text(quantity);
    $('#amount').text(amount);

}

function dec_table() {

    var quantity = Number($('#table_text').text());
    var amount = Number($('#amount').text());

    if (quantity == 2) {
        quantity -= 2;
        amount -= 4000;
        tbl_count = 0;
    } else {
        quantity -= 1;
        amount -= 2000;
    }
    $('#table_text').text(quantity);
    $('#amount').text(amount);

    if (quantity == 0) {
        $("#dec_table").prop('disabled', true);
        return false;
    }

}

function update_type_gallery() {

    navigator.camera.getPicture(update_profile, function(message) {
        alert('Try Again');
    }, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true
    });
}

function update_type_camera() {

    navigator.camera.getPicture(update_profile, function(message) {
        alert('Try Again');
    }, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        allowEdit: true
    });
}


function update_profile(imageURI) {

    var id = Lockr.get('id');
    var img_name = imageURI.substr(imageURI.lastIndexOf('/') + 1);


    $.ajax({
            url: base_url + 'update_profile',
            type: 'POST',
            dataType: 'json',
            data: {
                id: id,
                img_name: img_name
            },
        })
        .done(function(result) {

            if (result['status'] == 'success') {

                var options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = img_name;
                options.mimeType = "image/jpeg";
                options.chunkedMode = false;
                var ft = new FileTransfer();
                ft.upload(imageURI, base_url + "upload_profile", win, fail, options);

                // $('#profile_img').attr('src', 'http://casaestilo.in/taha/mp_admin/uploads/'+img_name); 
                imageURI = "";

                // mainView.router.loadPage('location.html');

                mainView.router.loadPage("type.html");

                myApp.alert("Profile Updated");

            } else {
                alert('failed');
            }
        })
        .fail(function() {
            console.log("Server Error");
        })
        .always(function() {
            console.log("complete");
        });

}

function win(r) {

    // console.log("Code = " + r.responseCode);
    // console.log("Response = " + r.response);
    // console.log("Sent = " + r.bytesSent);
    // alert(r.response);
}


function fail(error) {

    // alert("An error has occurred: Code = "+error.code);
    alert("Failed to update pic"+error);

}




function upload_type_gallery() {

    navigator.camera.getPicture(uploadprofile, function(message) {
        alert('Try Again');
    }, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true
    });
}

function upload_type_camera() {

    navigator.camera.getPicture(uploadprofile, function(message) {
        alert('Try Again');
    }, {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.CAMERA,
        allowEdit: true
    });
}



function del_rev(entity_id){


    console.log("entitie id is "+entity_id);
    // return false;

     myApp.confirm('Are you sure?', 'Mumbai Parties', function () {

        $.ajax({

            type:'POST',
            url:base_url+"del_rev",
            dataType:'json',
            data:{
                entity_id:entity_id
            },
            success:function(result){

                if(result['status']=='success'){
                    // var data = $('')
                    myApp.alert('Deleted');
                    $('#rev_'+entity_id).css('display','none');


                    mainView.router.refreshPage();

                }
            },
            error:function(err){


            }

        });


        // myApp.alert('You clicked Ok button');
    });
}

function uploadprofile(imageURI) {

    // myApp.closeModal('.upload_picker');

    $('.upload-btn').val('Uploaded');
    Lockr.set('imageURI', imageURI);

}


$(document).on('click', '.notify-toolbar', function() {

    if (Lockr.get('is_logged_in')) {

        mainView.router.loadPage('notification.html');

    } else {

        myApp.alert('Sign In Required');
        mainView.router.loadPage('login.html');

    }

});

// function book_login(){

//     if(Lockr.get('is_logged_in')){

//         mainView.router.loadPage('book.html');

//     }else{

//         myApp.alert('Sign In Required');
//         mainView.router.loadPage('login.html');
//     }

// }

$(document).on('click', '.home', function() {


    if (Lockr.get('is_logged_in')) {
        // mainView.router.loadPage('location.html');
        mainView.router.loadPage("type.html");

    } else {
        mainView.router.loadPage('index.html');
    }

})

function changedate() {

    myApp.showIndicator();

    // var dateObj = new Date();
    // var month = dateObj.getUTCMonth() + 1; //months from 1-12
    // var day = dateObj.getUTCDate();
    // var year = dateObj.getUTCFullYear();

    // var hour = dateObj.getHours();
    // var minuts = dateObj.getMinutes();
    // var seconds = dateObj.getSeconds();
    

    // var curdate = year + "/" + month + "/" + day;
    // var curtime = hour +":"+ minuts +":"+ seconds;


    // var date = $('.date').val();
    // $('.date-text').html(moment(date).format("Do MMM YYYY"));
    // id,eventtype,date


    // var dateObj = new Date();
    // var month = dateObj.getUTCMonth() + 1; //months from 1-12
    // var day = dateObj.getUTCDate();
    // var year = dateObj.getUTCFullYear();

    // var curdate = year + "/" + month + "/" + day;





    var loc_id = Lockr.get('loc_id');
    var event_type = $('#scroll-data-attr').attr('data-id');
    var date = $(".date").val();



    console.log('loc id '+loc_id);
    console.log('event type '+event_type);
    console.log('date is '+date);




    $.ajax({

        type: "POST",
        url: base_url + "get_event_data_bydate/",
        dataType: "json",
        data: {

            loc_id: loc_id,
            event_type: event_type,
            date: date

        },
        success: function(result) {

            console.log(result);

            var html = "";
            if (result['status'] == "success") {


                $.each(result['data'], function(key, value) {

                    console.log('Start Date is '+value.event_start_date+' End Date is '+value.event_end_date);

                    html += "<div data-id=" + value.event_id + " class='card demo-card-header-pic get-event' style='margin: 0;margin-bottom: 0px;width:100%'>" +
                        "<div style='background-image:url(" + img_url + value.image + ")' valign='bottom' class='card-header no-border'>" +
                        "<h3 class='no-mar list-name'>" + value.event_name + "</h3>" +
                        "</div>" +
                        "<div class='card-footer color-white'>" +
                        "<span class='footer-left'>@ " + value.entity_name + "</span>" +
                        "<span class='footer-text'>" + value.time_event_start + " to " + value.time_event_ends + "</span>" +
                        "</div>" +
                        "</div>";
                });

                $('#cust_event_box').html(html);
                myApp.hideIndicator();


            } else {

                if (result['msg'] == "no data") {

                    html += "<h3 class='no-event'>No Event Available</h3>";
                    $('#cust_event_box').html(html);
                    myApp.hideIndicator();


                } else {

                    alert("failed");
                }
            }
        }
    })
}




// $(document).on('click', '.calender', function() {

//     alert('called');
//     $('#date').trigger('click');

// })


function prompt_forgottextbox() {

    myApp.prompt('Enter your email id', function(value) {
        sendemail(value);
    });
}


function prompt_redeem() {
    
    myApp.prompt('Enter your code', function(value) {
        redeem(value);
    });
}

function prompt_upload() {

    myApp.modal({
        title: 'Choose upload type',
        // text: 'Vivamus feugiat diam velit. Maecenas aliquet egestas lacus, eget pretium massa mattis non. Donec volutpat euismod nisl in posuere. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae',
        verticalButtons: true,
        buttons: [{
            text: 'Camera',
            onClick: function() {

                upload_type_camera();
                // myApp.alert('You clicked first button!')
            }
        }, {
            text: 'Gallery',
            onClick: function() {

                upload_type_gallery()
                    // myApp.alert('You clicked second button!')
            }
        }, {
            text: 'Cancel',
            onClick: function() {


                // myApp.alert('You clicked second button!')
            }
        }]
    })
}


function prompt_update() {

    myApp.modal({
        title: 'Choose update type',
        // text: 'Vivamus feugiat diam velit. Maecenas aliquet egestas lacus, eget pretium massa mattis non. Donec volutpat euismod nisl in posuere. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae',
        verticalButtons: true,
        buttons: [{
            text: 'Camera',
            onClick: function() {

                update_type_camera();
                // myApp.alert('You clicked first button!')
            }
        }, {
            text: 'Gallery',
            onClick: function() {

                update_type_gallery()
                    // myApp.alert('You clicked second button!')
            }
        }, {
            text: 'Cancel',
            onClick: function() {


                // myApp.alert('You clicked second button!')
            }
        }]
    })
}





