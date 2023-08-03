

$(document).ready(function () {


    $('#phonenumberOrEmail').on("keyup", function(){
        text = $("#phonenumberOrEmail").val();

        if (text.length == 0){
            $("#error_phone_email").text("Email hoặc số điện thoại không được để trống !").css('color','red');
            $("#phonenumberOrEmail").css("border-style", "solid").css("border-color", "red");
        }

        if (text.length > 0){
            $("#error_phone_email").text("");
            $("#phonenumberOrEmail").css("border-style", "none");
        }
    });

    $("#password").on("keyup", function(){
        password = $("#password").val();
        
        if (password.length == 0){
            $("#error_password").text("Mật khẩu không được để trống !").css('color', 'red');
            $("#password").css("border-style", 'solid').css("border-color", "red");
        }
        
        if (password.length > 0){
            $("#error_password").text("");
            $("#password").css("border-style", "none");
        }
    });
});

