

$(document).ready(function () {

    //Click login button , check if input is null or not
    $("#login_btn").on('keyup',function(){
        text = $("#phonenumberOrEmail").val();
        password = $("#password").val();

        if ((text.length == 0) && (password.length == 0)){
            $("small#error_phone_email").text("Xin vui lòng nhập mật khẩu !").css('color', 'red');
            $("small#error_password").text("Xin vui lòng nhập mật khẩu !").css('color', 'red');
            $(".form-control").css("border-style", 'solid').css("border-color", 'red');
        }

        if ((text.length > 0)){
            $("#error_phone_email").text("");
            $("#phonenumberOrEmail").css("border-style", "none");

        }

        if (password.length > 0){
            $("#error_password").text("");
            $("#password").css("border-style", "none");
        }

        

        if (text.length == 0){
            $("#error_phone_email").text("Email hoặc số điện thoại không được để trống !").css('color','red');
            $("#phonenumberOrEmail").css("border-style","solid").css("border-color", "red");
        }
        
        if (password.length == 0){
            $("#error_password").text("Mật khẩu không được để trống !").css('color', 'red');
            $("#password").css("border-style","solid").css("border-color", "red");

        }
        
        
            
            
    });
});

