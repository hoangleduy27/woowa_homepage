$(document).ready(function () {

    $("#fullname").on('keyup',function(){
        var name = $("#fullname").val();
        if (name.length == 0){
            $("#error_name").text("Xin vui lòng nhập tên !");
            $("#fullname").css('border-style','solid').css('border-color','red');

            return false;
        }else if ((name.length > 0) && (name.length < 3) ){
            $("#error_name").text("Độ dài tên phải tối thiểu 3 kí tự !").css('color','red');
            $("#fullname").css('border-style','solid').css('border-color','red');

        }else{
            $("#error_name").text("");
            $("#fullname").css('border-style','solid').css('border-color','#0E9700');

            
        }
    });


    $("#email").on('keyup', function(){
        var text = $("#email").val();
        const re = /^\S+@\S+\.\S+$/;
        
        if (text.length == 0){
            $("#error_email").text("Xin vui lòng nhập email !");
            $("#email").css('border-style','solid').css('border-color','red');

        }
        
        if (!text.match(re)){
            $("#error_email").text("Email không hợp lệ !").css('color','red');
            $("#email").css('border-style','solid').css('border-color','red');

        }
        if (text.match(re)){          
                $("#error_email").text("");
                $("#email").css('border-style','solid').css('border-color','#0E9700');
            
        }
    });

    


    $("#phone").on('keyup',function(){
        var phone = $("#phone").val();
        var number = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/ ;
        if (phone.length == 0){
            $("#error_phone").text("Xin vui lòng nhập số điện thoại !");
            $("#phone").css('border-style','solid').css('border-color','red');

            return false;
        }  
        
        if((!phone.match(number)) || (phone.length > 11)){
            $("#error_phone").text("Số điện thoại không hợp lệ !").css('color', 'red');
            $("#phone").css('border-style','solid').css('border-color','red');

        }

        if (phone.match(number)){
            $("#error_phone").text("");
            $("#phone").css('border-style','solid').css('border-color','#0E9700');

        }
        
       

        
    });


    $("#password").on('keyup',function(){
        var password = $("#password").val();
        var number = /([0-9])/;
        var alphabets = /([a-zA-Z])/;
        var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;
        console.log(password);
        if (password.length == 0){
            $("#error_password").text("Xin vui lòng nhập mật khẩu !").css('color', 'red');
            $("#password").css('border-style','solid').css('border-color','red');

            return false;
        }if ((password.length < 8)){
            $("#error_password").text("Mật khẩu phải có tối thiểu 8 kí tự !").css('color', 'red');
            $("#password").css('border-style','solid').css('border-color','red');

        }else{
            if (password.match(number) && password.match(alphabets) && password.match(alphabets)){
                $("#error_password").text("Bảo mật: mạnh").css('color','green');
                $("#password").css('border-style','solid').css('border-color','#0E9700');

            }
            else{
                $("#error_password").text("Bảo mật: trung bình. Mật khẩu nên bao gồm cả chữ cái, số và kí tự đặc biệt").css('color', 'orange');
                $("#password").css('border-style','solid').css('border-color','orange');

            }
        }
        
        
    });

    $("#confirm-password").on('keyup', function(){
        var confirm_password = $("#confirm-password").val();
        var password = $("#password").val();

        if (confirm_password != password){
            $("#error_confirmpassword").text("Không khớp mật khẩu.").css('color', 'red');
            $("#confirm-password").css("border-style", 'solid').css("border-color", 'red');

        }
        if (confirm_password.length == ""){
            $("#error_confirmpassword").text("Xin vui lòng nhập lại mật khẩu !").css('color', 'red');
            $("#confirm-password").css("border-style", 'solid').css("border-color", 'red');

        }
        if (confirm_password == password){
            $("#error_confirmpassword").text("Khớp mật khẩu").css('color', 'green');
            $("#confirm-password").css("border-style", 'solid').css("border-color", 'green');
        }
    })


    $('#btn-register').click(function (){
        var name = $("#fullname").val();
        var email = $("#email").val();
        var phone = $("#phone").val();
        var password = $("#password").val();
        var confirm_password = $("#confirm-password").val();
        var invite_code = $("#invitecode").val();
        var lb = $('#label_name').text();
        console.log(lb);
        if ((name.length == "") && (email.length == "") && (phone.length == "") && (password.length == "") && (confirm_password.length == "")){
            $("small#error_name").text('Xin vui lòng nhập tên ! ').css('color','red');
            $("small#error_email").text('Xin vui lòng nhập email ! ').css('color','red');
            $("small#error_phone").text('Xin vui lòng nhập số điện thoại ! ').css('color','red');
            $("small#error_password").text('Xin vui lòng nhập mật khẩu! ').css('color','red');
            $("small#error_confirmpassword").text("Xin vui lòng xác nhận lại mật khẩu !").css('color','red');
            $(".form-control").css('border-style','solid').css('border-color','red');
            $("#invitecode").css('border-style','none');
        }
        if (name.length == ""){
            $("#error_name").text("Xin vui lòng nhập tên !").css('color','red');
            // $("#name").val("Xin vui lòng nhập tên !").css('color', 'red');
            $('#error_name').focus();
            $("#fullname").css('border-style','solid').css('border-color','red');
            return false;
        }
        if (email.length == ""){
            $("#error_email").text("Xin vui lòng nhập email !").css('color','red');
            $('#error_email').focus();
            $("#email").css('border-style','solid').css('border-color','red');

            return false;
        }
        if (phone.length == ""){
            $("#error_phone").text("Xin vui lòng nhập số điện thoại !").css('color','red');
            // $("#label_name").css('font-color',);
            
            // $("#name").css('color', 'red');
            $("#error_phone").val("Xin vui lòng nhập số điện thoại !").css('color', 'red');
            $('#error_phone').focus();
            $("#phone").css('border-style','solid').css('border-color','red');

            return false;
        }

        if ((password.length == "")){
            $("#error_password").text("Xin vui lòng nhập mật khẩu !").css('color','red');
            
            $('#error_password').focus();
            $("#password").css('border-style','solid').css('border-color','red');

            return false;
        }
        if ((confirm_password.length == "")){
            $("#error_confirmpassword").text("Xin vui lòng xác nhận lại mật khẩu !").css('color','red');
            
            $('#error_confirmpassword').focus();
            $("#confirm-password").css('border-style','solid').css('border-color','red');

            return false;
        }

        if (confirm_password != password){
            $("#error_confirmpassword").text("Mật khẩu không khớp! Xin vui lòng xác nhận lại mật khẩu.").css('color', 'red');
            $("#confirm-password").css("border-style", 'solid').css("border-color", "red");
        }
        
        
    });
});