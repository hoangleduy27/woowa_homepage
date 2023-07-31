

$(document).ready(function () {

    $("#phone_email").on('keyup', function(){
        var text = $("#phone_email").val();
        const re = /^\S+@\S+\.\S+$/;
        var number = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/ ;

        if (text.length == 0){
            $("#error_phone_email").text("Xin vui lòng nhập số điện thoại hoặc email !");
            $("#phone_email").css('border-style','solid').css('border-color','red');

            return false;
        } 

        if (!text.match(re) && (!(text.match(number)))){
            $("#error_phone_email").text("Số điện thoại hoặc email không hợp lệ !").css('color','red');
            $("#phone_email").css('border-style','solid').css('border-color','red');

        }

        if (text.match(re) || ((text.match(number)))){
            if (text.match(re)){
                $("#error_phone_email").text("Email hoặc số điện thoại hợp lệ").css('color','green');
                $("#phone_email").css('border-style','solid').css('border-color','green');

            }
            if ((text.match(number))){
            //    if (text.length > 11){
            //     $("#error_phone_email").text("Số điện thoại không được vượt quá 11 số !").css('color','red');
            //     $("#phone_email").css('border-style','solid').css('border-color','red');

            //    }
            //    else
               {
                $("#error_phone_email").text("Email hoặc số điện thoại hợp lệ").css('color','green');
                $("#phone_email").css('border-style','solid').css('border-color','green');

            }
            }
        }
    });


    $("#pass_login").on('keyup', function(){
        var password = $("#pass_login").val();
        if (password.length == 0){
            $("#error_password").text("Xin vui lòng nhập mật khẩu !").css('color', 'red');
            $("#pass_login").css("border-style", 'solid').css("border-color", 'red');
        }

        if ((password.length > 0) || (password.length < 8)) {
            $("#error_password").text("Mật khẩu phải có tối thiểu 8 kí tự !").css('color', 'red');
            $("#pass_login").css("border-style", 'solid').css("border-color", 'red');
        }
        if (password.length > 8){
            $("#error_password").text("");
            $("#pass_login").css("border-style", 'solid').css("border-color", 'green');
        }
    })

    $("#login_btn").click(function(){
        text = $("#phone_email").val();
        console.log(text);
        password = $("#pass_login").val();
        const re = /^\S+@\S+\.\S+$/;
        var number = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/ ;

        if ((text.length == 0) && (password.length == 0)){
            $("small#error_phone_email").text("Xin vui lòng nhập mật khẩu !").css('color', 'red');
            $("small#error_password").text("Xin vui lòng nhập mật khẩu !").css('color', 'red');
            $(".form-control").css("border-style", 'solid').css("border-color", 'red');
        }

        if ((text.length > 0)){
            $("#error_phone_email").text("");
            $("#phone_email").css("border-style","solid").css("border-color", "green");

        }

        if ((!text.match(re)) && (!(text.match(number)))){
            $("#error_phone_email").text("Số điện thoại hoặc email không hợp lệ !").css('color','red');
            $("#phone_email").css('border-style','solid').css('border-color','red');

        }
        if (text.match(re) || ((text.match(number)))){
            $("#error_phone_email").text("");
            $("#phone_email").css('border-style','solid').css('border-color','green');

        }
        

        if (text.length == 0){
            $("#error_phone_email").text("Email hoặc số điện thoại không được để trống !").css('color','red');
            $("#phone_email").css("border-style","solid").css("border-color", "red");
        }
        
        if (password.length == 0){
            $("#error_password").text("Mật khẩu không được để trống !").css('color', 'red');
            $("#pass_login").css("border-style","solid").css("border-color", "red");

        }
        
        if ( (password.length > 0) &&  (password.length < 8)){
            $("#error_password").text("Mật khẩu phải có tối thiểu 8 kí tự !");
            $("#pass_login").css("border-style", "solid").css("border-color","red");

        }

        
        // if (!text.match(re) && (!isVietnamesePhoneNumber(text))){
        //     $("#lb_email_phone").text("Email hoặc số điện thoại không hợp lệ !").css('color','red');
        // }
        // if (text.match(re) || (isVietnamesePhoneNumber(text))){
        //     $("#lb_email_phone").text("Email hoặc số điện thoại hợp lệ").css('color','green');
        // }
            
            
    });
});

