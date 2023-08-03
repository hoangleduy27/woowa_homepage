
  $(document).ready(function () {
    // Function to validate the login form
    function validateLoginForm() {
      let valid = true;

      // Get the values of the input fields
      const phoneNumberOrEmail = $("#phonenumberOrEmail").val();
      const password = $("#password").val();

      // Check if the phone number or email is empty
      if (!phoneNumberOrEmail) {
        $("#error_phone_email").text("Email hoặc số điện thoại không được để trống!").css('color', 'red');
        $("#phonenumberOrEmail").css("border-style", "solid").css("border-color", "red");
        valid = false;
      } else {
        $("#error_phone_email").text("");
        $("#phonenumberOrEmail").css("border-style", "none");
      }

      // Check if the password is empty
      if (!password) {
        $("#error_password").text("Mật khẩu không được để trống!").css('color', 'red');
        $("#password").css("border-style", 'solid').css("border-color", "red");
        valid = false;
      } else {
        $("#error_password").text("");
        $("#password").css("border-style", "none");
      }

      return valid;
    }

    // Function to toggle password visibility
    function togglePassword(icon) {
      const passwordField = $("#password");
      const type = passwordField.attr("type");
      const newType = type === "password" ? "text" : "password";
      passwordField.attr("type", newType);

      // Change the icon based on the password visibility state
      icon.className = newType === "password" ? "fas fa-eye showpass cursor-pointer" : "fas fa-eye-slash showpass cursor-pointer";
    }

    // Attach event handler to the form submit event
    $("form.form-horizontal").on("submit", function (event) {
      // Validate the login form before submission
      if (!validateLoginForm()) {
        event.preventDefault(); // Prevent form submission if validation fails
      }
    });
  });
