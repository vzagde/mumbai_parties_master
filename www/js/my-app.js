var base_url = "http://mumbaiparties.com/mp_admin/index.php/Api/";
var img_url = "http://mumbaiparties.com/assets/uploads/";
var casa_img_url = "http://mumbaiparties.com/mp_admin/assets/img/";
var profile_img_path = "http://mumbaiparties.com/mp_admin/uploads/profile_pic/";


// Initialize app
var myApp = new Framework7({

    modalTitle:"Mumbai Parties",
    swipeBackPage:false,
    // cache:false,
    // swipePanel: 'left',


    preloadPreviousPage:false,
    
    // uniqueHistory:true,
    
    // smartSelectSearchbar:true,
    // imagesLazyLoadPlaceholder: 'img/card.jpg',
    // imagesLazyLoadThreshold: 50,
    // animateNavBackIcon:true,

    onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        setTimeout(myFunction, 500);
    }
});



var mainView = myApp.addView('.view-main', {
    
    dynamicNavbar: true
});

function myFunction(){

        myApp.hideIndicator();

}

var $$ = Dom7;

$$(document).on('pageInit', function (e) {

    // var networkState = navigator.connection.type;
    // var states = {};
    // states[Connection.UNKNOWN]  = 'Unknown connection';
    // states[Connection.ETHERNET] = 'Ethernet connection';
    // states[Connection.WIFI]     = 'WiFi connection';
    // states[Connection.CELL_2G]  = 'Cell 2G connection';
    // states[Connection.CELL_3G]  = 'Cell 3G connection';
    // states[Connection.CELL_4G]  = 'Cell 4G connection';
    // states[Connection.CELL]     = 'Cell generic connection';
    // states[Connection.NONE]     = 'No network connection';

    // // alert('Connection type: ' + states[networkState]);

    // if(states[networkState]=='No network connection'){

    //     myApp.alert('No network connection');
    //     return false;
    // }

    if(Lockr.get('is_logged_in')){

        var id = Lockr.get('id');
        get_points(id);
    }
    
});

function check_connection(){

    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    // alert('Connection type: ' + states[networkState]);

    if(states[networkState]=='No network connection'){
        myApp.alert('Try Again');
    }else{

      if(Lockr.get('is_logged_in')){
        // mainView.router.loadPage('location.html');
        mainView.router.loadPage("type.html");

      }else{
        mainView.router.loadPage('index.html');
      }
    }

}



myApp.onPageInit('index', function (page) {

    //$('.navbar-inner').css('background','none');

});



function get_profile(id){

    $.ajax({
        url: base_url+'get_profile',
        type: 'POST',
        dataType: 'json',
        data: {
            id: id
        },
    })
    .done(function(result) {

        if(result['status']=="success"){

            // alert(result['data']['id']);
            // alert('img url is '+profile_img_path+result['data']['img_name']);
            $('#profile_img').attr('src', profile_img_path+result['data']['img_name']); 
            $('#profile_img').attr('onclick', "prompt_update()");

        }else{

            if(result['msg']=="no data"){

                myApp.alert('no data');

            }else{

                alert("failed");
            }
        }
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {
        console.log("complete");
    });
    

}

myApp.onPageInit('location', function (page) {

    //$('.navbar-inner').css('background','none');

    
    get_location();

    if(Lockr.get("is_logged_in")){

         get_profile(Lockr.get("id"));
         
         $("#signin-div").html("<h2 class='username'><span>Hi, "+Lockr.get("name")+"</span><br><span class='ref_points' style='color: #b7b3b3;font-size: 14px;'></span> </h2>");
         $("#signout-div").css("display","block");
         $("#invite_div").css("display","block");
         $("#wallet_div").css("display","block");
         $("#redeem_div").css("display","block");
         
         

         // $("#profile_picker").addClass('open-picker close-panel');
    }

});

myApp.onPageInit('entitie', function (page) {

        // Starrr plugin (https://github.com/dobtco/starrr)

        var __slice = [].slice;
        (function($, window) {

            var Starrr;

            Starrr = (function() {
                Starrr.prototype.defaults = {
                    rating: void 0,
                    numStars: 5,
                    change: function(e, value) {}
                };

                function Starrr($el, options) {
                    var i, _, _ref,
                        _this = this;

                    this.options = $.extend({}, this.defaults, options);
                    this.$el = $el;
                    _ref = this.defaults;
                    for (i in _ref) {
                        _ = _ref[i];
                        if (this.$el.data(i) != null) {
                            this.options[i] = this.$el.data(i);
                        }
                    }
                    this.createStars();
                    this.syncRating();
                    this.$el.on('mouseover.starrr', 'i', function(e) {
                        return _this.syncRating(_this.$el.find('i').index(e.currentTarget) + 1);
                    });
                    this.$el.on('mouseout.starrr', function() {
                        return _this.syncRating();
                    });
                    this.$el.on('click.starrr', 'i', function(e) {
                        return _this.setRating(_this.$el.find('i').index(e.currentTarget) + 1);
                    });
                    this.$el.on('starrr:change', this.options.change);
                }

                Starrr.prototype.createStars = function() {
                    var _i, _ref, _results;

                    _results = [];
                    for (_i = 1, _ref = this.options.numStars; 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
                        _results.push(this.$el.append("<i class='fa fa-star-o'></i>"));
                    }
                    return _results;
                };

                Starrr.prototype.setRating = function(rating) {
                    if (this.options.rating === rating) {
                        rating = void 0;
                    }
                    this.options.rating = rating;
                    this.syncRating();
                    return this.$el.trigger('starrr:change', rating);
                };

                Starrr.prototype.syncRating = function(rating) {
                    var i, _i, _j, _ref;

                    rating || (rating = this.options.rating);
                    if (rating) {
                        for (i = _i = 0, _ref = rating - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                            this.$el.find('i').eq(i).removeClass('fa-star-o').addClass('fa-star');
                        }
                    }
                    if (rating && rating < 5) {
                        for (i = _j = rating; rating <= 4 ? _j <= 4 : _j >= 4; i = rating <= 4 ? ++_j : --_j) {
                            this.$el.find('i').eq(i).removeClass('fa-star').addClass('fa-star-o');
                        }
                    }
                    if (!rating) {
                        return this.$el.find('i').removeClass('fa-star').addClass('fa-star-o');
                    }
                };

                return Starrr;

            })();
            return $.fn.extend({
                starrr: function() {
                    var args, option;

                    option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                    return this.each(function() {
                        var data;

                        data = $(this).data('star-rating');
                        if (!data) {
                            $(this).data('star-rating', (data = new Starrr($(this), option)));
                        }
                        if (typeof option === 'string') {
                            return data[option].apply(data, args);
                        }
                    });
                }
            });
            
        })(window.jQuery, window);


        $(function() {
            return $(".starrr").starrr();
        });

              
        $('#stars').on('starrr:change', function(e, value){
            $('#count').html(value);
        });
          
        $('#stars-existing').on('starrr:change', function(e, value){
            $('#count-existing').html(value);
        });

        var id = page.query.id; 
        $('#submit_review').attr('data-id', id);
        get_entitie(id);


        
        
});

myApp.onPageInit('event', function (page) {

        var id = page.query.id;
        // alert("id on event page is "+id);
        get_event(id);
        
});


myApp.onPageInit('liquor', function (page) {

        var id = page.query.id;
        // alert("id on event page is "+id);
        get_liquor(id);
        
});

myApp.onPageInit('offer', function (page) {

        var id = page.query.id;
        get_offer(id);
        
});


myApp.onPageInit('mapview', function (page) {

      var id= Lockr.get('loc_id');
      get_initial_map_data(id);

      get_top_location(id); 

      get_owl_slider_map(id);


      $(document).on('click', '.owl-item', function(){
            n = $(this).index();
            console.log(n)
            $('.owl-wrapper').trigger('owl.goTo', n);
     });


});

myApp.onPageInit('listview', function (page) {

          $('#scroll-data-attr').attr('data-id','1');
          get_owl_slider_list();
          
          $(document).on('click', '.tab', function(){
                n = $(this).index();
                console.log(n)
                $('.owl-wrapper').trigger('owl.goTo', n);
          });

          $(document).on('click', '.category', function(){

                var number_id = Number($(this).attr('data-id'));

                $('.owl-wrapper').trigger('owl.goTo', number_id);
                $('.owl-item').removeClass('active-tab');
                $('.tab').removeClass('active-tab');
                $('#list-tab-'+number_id).addClass('active-tab');


                // if(number_id=="Liquor"||number_id=="Offers"){

                //     // alert("text is "+number_id);
                //     $('.owl-wrapper').trigger('owl.goTo', number_id);
                //     $('.owl-item').removeClass('active-tab');
                //     $('.tab').removeClass('active-tab');
                //     $('#list-tab-'+number_id).addClass('active-tab');

                // }else{

                //     var number_id = Number($(this).attr('data-id'));
                //     // alert("number is "+number_id);
                //     $('.owl-wrapper').trigger('owl.goTo', number_id);
                //     $('.owl-item').removeClass('active-tab');
                //     $('.tab').removeClass('active-tab');
                //     $('#list-tab-'+number_id).addClass('active-tab');

                // }




          });

          // var id = page.query.id;
          var id = Lockr.get('loc_id');
          get_top_location(id);
          get_event_type();

          // $('#date-container').css('position','fixed');
          // $('#date-container').css('top','55px');
          // $('#date-container').css('z-index','9');


});

myApp.onPageInit('club_types', function (page) {

    // if(Lockr.get('is_logged_in')){
    //      // alert('logged in');
    //      $('.home').attr('href','location.html');
    // }else{
    //     // alert('NOT logged in');
    //     $('.home').attr('href','index.html');
    // }

});


myApp.onPageInit('club_list', function (page) {

    // var id = page.query.id;
    // get_top_location(id);

    $(".date-text").html(current_date());

    // current_date();

    console.log(current_date());

    
    var type = page.query.type;
    get_club_list(type);
    
});

myApp.onPageInit('club', function (page) {

    var id = page.query.id;
    get_club(id);

});

myApp.onPageInit('search', function (page) {

  // $('.navbar-inner').css('background','url("img/topbg.png")');

  get_search();

});

myApp.onPageInit('invite', function (page) {

  var id = Lockr.get('id');
  get_ref_code(id);

});

myApp.onPageInit('login', function (page) {

  //$('.navbar-inner').css('background','none');


  if(Lockr.get('email')){

    var email = Lockr.get('email');
    $('#email').val(email);

    console.log(email);

  }

});


myApp.onPageInit('register', function (page) {

  //$('.navbar-inner').css('background','none');   


});



myApp.onPageInit('book', function (page) {

      var options = {

        "key": "rzp_test_8JVmfLet3Dw8wA",
        // password  m9iD1p5LgDALcDsAv6ee9QjA
        "amount": "20000", // 2000 paise = INR 20
        "name": "Test payment",
        "description": "Test Product",
        "image": "img/icon.jpg",
        "handler": function (response){

          $.ajax({

            url: 'http://casaestilo.in/taha/razorpay-testapp/charge.php',
            type: 'POST',
            crossDomain: true,
            data: {

              amount: 20000,
              razorpay_payment_id:response.razorpay_payment_id

            },
            
          })
          .done(function(res) {

            if(res.status=="captured"){

              alert('payment captured');

            }


            myApp.alert("payment done successfully");
            // console.log("success: "+);

          })
          .fail(function(err) {
            console.log("error: "+err.messege);
          })
          .always(function() {
            console.log("complete");
          });

        },
        "prefill": {
            "name": "Test Name",
            "email": "Test@gmail.com"
        },
        "notes": {
            "address": "Hello World"
        },
        "theme": {
            "color": "#F37254"
        }
    };

    var rzp1 = new Razorpay(options);

    $(document).on('click','#rzp-button1',function(e){

        rzp1.open();
        e.preventDefault();

    });

});

myApp.onPageInit('notification', function (page) {

    get_notification();

});


// myApp.onPageBack('index', function(page) {
//     alert('called');
// });

myApp.onPageInit('invite', function (page) {
    //$('.navbar-inner').css('background','none');
});

myApp.onPageInit('redeem', function (page) {
    //$('.navbar-inner').css('background','none');
    check_redeem();
});


myApp.onPageInit('mywallet', function (page) {
    //$('.navbar-inner').css('background','none');
});

myApp.onPageInit('offline', function (page) {
    //$('.navbar-inner').css('background','none');
});



