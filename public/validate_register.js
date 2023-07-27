$(document).ready(function () {

    $("#username").on('keyup',function(){
        var name = $("#username").val();
        if (name.length == 0){
            $("#error_name").text("Xin vui lòng nhập tên !");
        
            return false;
        }else if ((name.length > 0) && (name.length < 3) ){
            $("#error_name").text("Độ dài tên phải tối thiểu 3 kí tự").css('color','red');
        }else{
            $("#error_name").text("");
            
        }
    });


    $("#email").on('keyup', function(){
        var text = $("#email").val();
        const re = /^\S+@\S+\.\S+$/;
        
        if (text.length == ""){
            $("#error_email").text("Xin vui lòng nhập email hoặc số điện thoại !");

        }
        
        if (!text.match(re)){
            $("#error_email").text("Email không hợp lệ !").css('color','red');
        }
        if (text.match(re)){          
                $("#error_email").text("");            
        }
    });


    $("#phone").on('keyup',function(){
        var phone = $("#phone").val();
        var number = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/ ;
        if (phone.length == 0){
            $("#error_phone").text("Xin vui lòng nhập số điện thoại !");
            return false;
        }  
        
        if((!phone.match(number)) || (phone.length > 11)){
            $("#error_phone").text("Số điện thoại không hợp lệ !").css('color', 'red');

        }

        if (phone.match(number)){
            $("#error_phone").text("");

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
            return false;
        }if ((password.length < 8)){
            $("#error_password").text("Mật khẩu phải có tối thiểu 8 kí tự !").css('color', 'red');
        }else{
            if (password.match(number) && password.match(alphabets) && password.match(alphabets)){
            $("#error_password").text("Bảo mật: mạnh").css('color','green')
            }
            else{
                $("#error_password").text("Bảo mật: trung bình. Mật khẩu nên bao gồm cả chữ cái, số và kí tự đặc biệt").css('color', 'orange');
            }
        }
        
        
    });


    $('#btn-register').click(function (){
        var name = $("#username").val();
        var email = $("#email").val();
        var phone = $("#phonenumber").val();
        var password = $("#password").val();
        var invite_code = $("#invite_code").val();
        var lb = $('#label_name').text();
        console.log(lb);
        if (name.length == ""){
            $("#error_name").text("Xin vui lòng nhập tên !").css('color','red');
            // $("#name").val("Xin vui lòng nhập tên !").css('color', 'red');
            $('#error_name').focus();
            return false;
        }
        if (email.length == ""){
            $("#error_email").text("Xin vui lòng nhập email !").css('color','red');
            $('#error_email').focus();
            return false;
        }
        if (phone.length == ""){
            $("#error_phone").text("Xin vui lòng nhập số điện thoại !").css('color','red');
            // $("#label_name").css('font-color',);
            
            // $("#name").css('color', 'red');
            $("#error_phone").val("Xin vui lòng nhập số điện thoại !").css('color', 'red');
            $('#error_phone').focus();
            return false;
        }

        if (password.length == ""){
            $("#error_password").text("Xin vui lòng nhập mật khẩu !").css('color','red');
            // $("#label_name").css('font-color',);
            
            // $("#name").css('color', 'red');
            // $("#phone").val("Xin vui lòng nhập email !").css('color', 'red');
            $('#error_password').focus();
            return false;
        }

        
        
        
    });
});