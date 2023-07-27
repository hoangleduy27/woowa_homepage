

$(document).ready(function () {

    

    $("#login_btn").click(function(){
        text = $("#email_phone").val();
        console.log(text);
        password = $("#pass_login").val();

        if ((text.length > 0)){
            $("#error_phone_email").text("");
        }

        if (text.length == 0){
            $("#error_phone_email").text("Email hoặc số điện thoại không được để trống !").css('color','red');

        }
        
        if (password.length == 0){
            $("#error_password").text("Mật khẩu không được để trống !").css('color', 'red');

        }
        
        if (password.length > 0){
            $("#error_password").text("");

        }
        // if (!text.match(re) && (!isVietnamesePhoneNumber(text))){
        //     $("#lb_email_phone").text("Email hoặc số điện thoại không hợp lệ !").css('color','red');
        // }
        // if (text.match(re) || (isVietnamesePhoneNumber(text))){
        //     $("#lb_email_phone").text("Email hoặc số điện thoại hợp lệ").css('color','green');
        // }
            
            
    });
});

