const express = require('express');
const app = express();
const moment = require('moment');
const async = require('async');
const nodemailer = require('nodemailer');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const twilio = require('twilio');
const config = require('./config'); // Đường dẫn đến file config.js
const randomstring = require('randomstring'); // Import the 'randomstring' library for generating random strings
const { render } = require('ejs');



const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'da_1'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connection successfull')
})




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
    session({
        secret: config.sessionSecret, // Replace with your secret key for session management
        resave: false,
        saveUninitialized: true,
    })
);

// Khởi tạo Twilio Client với các thông tin tài khoản Twilio của bạn
const accountSid = 'ACd522933544b3c3f3f2add765c5a98c7d';
const authToken = '2ebbfa39c713834aaaa953d93de0af1c';
const twilioPhoneNumber = '+1 470 613 4992'; // Số điện thoại Twilio gửi SMS

const client = twilio(accountSid, authToken);








app.get('/', function (req, res) {
    const userId = req.query.userId;

    if (userId) {
        req.session.userId = userId;
    }

    // Check if the user is logged in (user ID exists in the session)
    const user = req.session.userId ? { id: req.session.userId } : null;

    res.render('homepage', { user, errorMessage: null, errorMessageSignup: null });
});

app.get('/about', function (req, res) {
    return res.render('about');

});


app.get('/events', (req, res) => {
    const userId = req.query.userId;

    // Fetch all events from the events table
    const getEventsQuery = 'SELECT * FROM events';
    connection.query(getEventsQuery, (err, events) => {
        if (err) {
            console.error('Error querying the database for events:', err);
            return res.status(500).json({ message: 'Lỗi khi truy vấn cơ sở dữ liệu cho các sự kiện' });
        }

        // Check if the userId is provided and set it in the session
        if (userId) {
            req.session.userId = userId;
        }

        // Fetch user information from the users table based on the userId stored in the session
        const userIdFromSession = req.session.userId;
        const getUserQuery = 'SELECT * FROM users WHERE id = ?';
        connection.query(getUserQuery, [userIdFromSession], (userErr, userRows) => {
            if (userErr) {
                console.error('Error querying user data:', userErr);
                return res.status(500).json({ message: 'Lỗi khi truy vấn dữ liệu người dùng' });
            }

            const user = userRows.length === 1 ? userRows[0] : null;
            const redeemmessage = req.query.redeemmessage;

            res.render('events', { user, events, ticket: user ? user.ticket : null, redeemmessage });
        });
    });
});

/// set event = point (không xoá)

// app.get('/redeem-gift', (req, res) => {
//     const userId = req.session.userId;

//     if (!userId) {
//       return res.redirect('/login');
//     }

//     // Check if the user has enough points to redeem the gift (minimum 5000 points)
//     const getUserPointQuery = 'SELECT user_point FROM users WHERE id = ?';
//     connection.query(getUserPointQuery, [userId], (err, userRows) => {
//       if (err) {
//         console.error('Error getting user point:', err);
//         return res.status(500).json({ message: 'Lỗi khi lấy điểm người dùng' });
//       }

//       if (userRows.length !== 1) {
//         return res.status(500).json({ message: 'Người dùng không tồn tại hoặc có nhiều bản ghi trùng lặp' });
//       }

//       const userPoint = userRows[0].user_point;

//       if (userPoint < 5000) {
//         // User does not have enough points to redeem the gift
//         return res.redirect('/events?redeemmessage=not_enough_points');
//       }

//       // Deduct 5000 points from the user's point and update the ticket status to "yes"
//       const newUserPoint = userPoint - 5000;
//       const updateUserQuery = 'UPDATE users SET user_point = ?, ticket = "yes" WHERE id = ?';
//       connection.query(updateUserQuery, [newUserPoint, userId], (err, updateUserResult) => {
//         if (err) {
//           console.error('Error updating user point and ticket status:', err);
//           return res.status(500).json({ message: 'Lỗi khi cập nhật điểm người dùng và trạng thái vé' });
//         }



//         // Gửi email khi đăng ký thành công
//         const getUserEmailQuery = 'SELECT email, username FROM users WHERE id = ?';
//         connection.query(getUserEmailQuery, [userId], (err, userEmailRows) => {
//           if (err) {
//             console.error('Error getting user email:', err);
//             return res.status(500).json({ message: 'Lỗi khi lấy email người dùng' });
//           }

//           if (userEmailRows.length !== 1) {
//             console.error('User with id ' + userId + ' not found or multiple records with the same id exist.');
//             return res.status(500).json({ message: 'Người dùng không tồn tại hoặc có nhiều bản ghi trùng lặp' });
//           }

//           const userEmail = userEmailRows[0].email;
//           const userName = userEmailRows[0].username;

//           // Thông tin email
//           const mailOptions = {
//             from: 'hlduy01dn@gmail.com', // Email của bạn
//             to: userEmail, // Địa chỉ email người nhận từ CSDL
//             subject: 'Ticket Confirmation', // Tiêu đề email
//             html: `<p>Dear ${userName},</p>
//                     <p>Your ticket has been confirmed.</p>
//                     <p>Thank you for using our service!</p>
//                     <p>Best regards,</p>
//                     <p>The Admin Team</p>`,
//           };

//           // Gửi email
//           transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//               console.log('Error sending email:', error);
//             } else {
//               console.log('Email sent to:', userEmail);
//             }
//           });
//         });

//         res.redirect(`/events?redeemmessage=success`);
//       });
//     });
//   });




app.get('/redeem-gift', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');
    }

    // Check if the user has enough referral_code_count to redeem the gift (minimum 10 referral_code_count)
    const getUserReferralCountQuery = 'SELECT referral_code_count FROM users WHERE id = ?';
    connection.query(getUserReferralCountQuery, [userId], (err, userRows) => {
        if (err) {
            console.error('Error getting user referral code count:', err);
            return res.status(500).json({ message: 'Lỗi khi lấy số lượng mã giới thiệu của người dùng' });
        }

        if (userRows.length !== 1) {
            return res.status(500).json({ message: 'Người dùng không tồn tại hoặc có nhiều bản ghi trùng lặp' });
        }

        const referralCodeCount = userRows[0].referral_code_count;

        if (referralCodeCount < 10) {
            // User does not have enough referral_code_count to redeem the gift
            return res.redirect('/events?redeemmessage=not_enough_referral_codes');
        }

        // Update the ticket status to "yes"
        const updateUserQuery = 'UPDATE users SET ticket = "yes" WHERE id = ?';
        connection.query(updateUserQuery, [userId], (err, updateUserResult) => {
            if (err) {
                console.error('Error updating user ticket status:', err);
                return res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái vé' });
            }

            // Send email upon successful registration
            const getUserEmailQuery = 'SELECT email, username FROM users WHERE id = ?';
            connection.query(getUserEmailQuery, [userId], (err, userEmailRows) => {
                if (err) {
                    console.error('Error getting user email:', err);
                    return res.status(500).json({ message: 'Lỗi khi lấy email người dùng' });
                }

                if (userEmailRows.length !== 1) {
                    console.error('User with id ' + userId + ' not found or multiple records with the same id exist.');
                    return res.status(500).json({ message: 'Người dùng không tồn tại hoặc có nhiều bản ghi trùng lặp' });
                }

                const userEmail = userEmailRows[0].email;
                const userName = userEmailRows[0].username;

                // Email information
                const mailOptions = {
                    from: 'hlduy01dn@gmail.com', // Your email address
                    to: userEmail, // Receiver's email address from the database
                    subject: 'Ticket Confirmation', // Email subject
                    html: `<p>Dear ${userName},</p>
                    <p>Your ticket has been confirmed.</p>
                    <p>Thank you for using our service!</p>
                    <p>Best regards,</p>
                    <p>The Admin Team</p>`,
                };

                // Send email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Error sending email:', error);
                    } else {
                        console.log('Email sent to:', userEmail);
                    }
                });
            });

            res.redirect(`/events?redeemmessage=success`);
        });
    });
});


// Cấu hình dịch vụ Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hlduy01dn@gmail.com', // Email của bạn
        pass: 'dsqrtreqocyxrwtr', // Mật khẩu của bạn 

    },
});


app.get('/giftshop', (req, res) => {
    return res.render('giftshop');
});





app.get('/signup', (req, res) => {
    // Check if the user is logged in (user ID exists in the session)
    const user = req.session.userId ? { id: req.session.userId } : null;

    return res.render('signup', { user });
});



// app.post('/signup', (req, res) => {
//     const { username, phonenumber, email, password, confirmpassword, referralCodeType } = req.body;

//     if (password.length < 8) {
//         return res.render('signup', { errorMessageSignup: 'Passwords must be at least 8 characters', user: null });
//     }

//     if (password !== confirmpassword) {
//         return res.render('signup', { errorMessageSignup: 'Passwords do not match', user: null });
//     }



//     connection.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
//         if (err) {
//             return res.status(500).json({ error: 'Error fetching user' });
//         }

//         if (rows.length > 0) {
//             // An account with this email already exists
//             return res.render('signup', { errorMessageSignup: 'Email is already registered', user: null });
//         }

//         connection.query('SELECT * FROM users WHERE phonenumber = ?', [phonenumber], (err, rows) => {
//             if (err) {
//                 return res.status(500).json({ error: 'Error fetching user' });
//             }

//             if (rows.length > 0) {
//                 // An account with this phone number already exists
//                 return res.render('signup', { errorMessageSignup: 'Phone number is already registered', user: null });
//             }

//             const referralCode = randomstring.generate({
//                 length: 6,
//                 charset: 'alphanumeric',
//                 capitalization: 'uppercase'
//             });

//             // Calculate the referral points based on the referral code entered by the user
//             let referrerReferralPoint = 0;
//             let referredUserReferralPoint = 0;

//             if (referralCodeType) {
//                 connection.query('SELECT * FROM users WHERE referral_code = ?', [referralCodeType], (err, rows) => {
//                     if (err) {
//                         console.error('Error fetching user with referral code:', err);
//                         // Handle the error if needed
//                     }

//                     if (rows.length > 0) {
//                         // Referral code is valid, increase the referral points for both the referrer and the referred user
//                         const referredUserId = rows[0].id;
//                         referrerReferralPoint = 1000; // Set the referral points for the referrer to 1000
//                         referredUserReferralPoint = 500; // Set the referral points for the referred user to 500

//                         connection.query('UPDATE users SET referral_code_count = referral_code_count + 1, user_point = user_point + ? WHERE id = ?', [referrerReferralPoint, referredUserId], (err, updateResult) => {
//                             if (err) {
//                                 console.error('Error updating referral code count and user points:', err);
//                                 // Handle the error if needed
//                             }
//                         });
//                     }

//                     // Continue with user registration process
//                     bcrypt.hash(password, 10, (err, hashedPassword) => {
//                         if (err) {
//                             return res.status(500).json({ error: 'Error hashing password' });
//                         }



//                         // Register the referred user with the corresponding referral points
//                         const referredUser = { username, phonenumber, email, password: hashedPassword, referral_code: referralCode, user_point: referredUserReferralPoint };
//                         connection.query('INSERT INTO users SET ?', referredUser, (err, referredUserResult) => {
//                             if (err) {
//                                 return res.status(500).json({ error: 'Error registering referred user' });
//                             }

//                             res.render('homepage', { user: null, registrationSuccess: true, showLoginForm: true });
//                         });
//                     });
//                 });
//             } else {
//                 // Continue with user registration process without referral points
//                 bcrypt.hash(password, 10, (err, hashedPassword) => {
//                     if (err) {
//                         return res.status(500).json({ error: 'Error hashing password' });
//                     }

//                     // Assign zero referral points to the users before registration
//                     const user = { username, phonenumber, email, password: hashedPassword, referral_code: referralCode, user_point: 0 };
//                     connection.query('INSERT INTO users SET ?', user, (err, result) => {
//                         if (err) {
//                             return res.status(500).json({ error: 'Error registering user' });
//                         }

//                         // res.render('homepage', { user: null, registrationSuccess: true, showLoginForm: true });



//                     });
//                 });
//             }

//         });

//     });
// });

// Signup route
app.post('/signup', async (req, res) => {
    const { username, phonenumber, email, password, confirmpassword, referralCodeType } = req.body;
    const modifiedPhoneNumber = phonenumber.replace(/^0/, '+84');

    if (password.length < 8) {
        return res.render('signup', { errorMessageSignup: 'Passwords must be at least 8 characters', user: null });
    }

    if (password !== confirmpassword) {
        return res.render('signup', { errorMessageSignup: 'Passwords do not match', user: null });
    }

    // Check if the email already exists in the database
    connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, rows) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ error: 'Error fetching user' });
        }

        if (rows.length > 0) {
            // An account with this email already exists
            return res.render('signup', { errorMessageSignup: 'Email is already registered', user: null });
        }

        // Check if the phone number already exists in the database
        connection.query('SELECT * FROM users WHERE phonenumber = ?', [phonenumber], async (err, rows) => {
            if (err) {
                console.error('Error checking phone number:', err);
                return res.status(500).json({ error: 'Error fetching user' });
            }

            if (rows.length > 0) {
                // An account with this phone number already exists
                return res.render('signup', { errorMessageSignup: 'Phone number is already registered', user: null });
            }

            if (referralCodeType) {
                connection.query('SELECT * FROM users WHERE referral_code = ?', [referralCodeType], async (err, rows) => {
                    if (err) {
                        console.error('Error checking referral code:', err);
                    }

                    if (rows.length === 0) {
                        // Referral code does not exist in the database
                        return res.render('signup', { errorreferral: 'Mã giới thiệu chưa chính xác', user: req.body });
                    }

                    try {
                        // Generate OTP
                        const otp = Math.floor(100000 + Math.random() * 900000);

                        // Save OTP to session for verification later
                        req.session.otp = otp;

                        // Send OTP via SMS using Twilio
                        await client.messages.create({
                            body: `Your OTP is: ${otp}`,
                            from: twilioPhoneNumber,
                            to: modifiedPhoneNumber
                        });

                        // Save the user information in session for later use in the /confirmotp route
                        req.session.userData = { username, phonenumber: modifiedPhoneNumber, email, password, referralCodeType };

                        res.redirect('/confirmotp', { phoneNumber: modifiedPhoneNumber });
                    } catch (error) {
                        console.error('Error sending OTP:', error);
                        res.send('System error, please try again later.');
                    }
                });
            } else {
                // Continue with the rest of the signup process without referral code
                try {
                    // Generate OTP
                    const otp = Math.floor(100000 + Math.random() * 900000);

                    // Save OTP to session for verification later
                    req.session.otp = otp;

                    // Send OTP via SMS using Twilio
                    await client.messages.create({
                        body: `Your OTP is: ${otp}`,
                        from: twilioPhoneNumber,
                        to: modifiedPhoneNumber
                    });

                    // Save the user information in session for later use in the /confirmotp route
                    req.session.userData = { username, phonenumber: modifiedPhoneNumber, email, password, referralCodeType };

                    res.redirect('/confirmotp');
                } catch (error) {
                    console.error('Error sending OTP:', error);
                    res.send('System error, please try again later.');
                }
            }
        });
    });
});

// Confirm OTP route
// Confirm OTP route
app.get('/confirmotp', (req, res) => {
    // Retrieve the userData from the session
    const userData = req.session.userData;

    // Check if userData exists in the session
    if (!userData) {
        return res.redirect('/signup'); // Redirect to signup if userData is missing
    }

    const { phonenumber: phoneNumber, otp } = userData;

    res.render('confirmotp', { errorMessageOTP: null, phoneNumber });
});


app.post('/confirmotp', (req, res) => {
    const { otp1, otp2, otp3, otp4, otp5, otp6 } = req.body;
    const otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
    // const { otp } = req.body;
    const sessionOTP = req.session.otp;
    const userData = req.session.userData;
    if (!otp || Number(otp) !== sessionOTP) {
        // Incorrect or missing OTP, display an error message
        return res.render('confirmotp', { errorMessageOTP: 'Incorrect OTP, please try again.' });
    }

    // OTP confirmed successfully, proceed with user registration
    delete req.session.otp; // Remove OTP from session after successful confirmation

    // Insert the user data into the database
    const { username, phonenumber, email, password , referralCodeType } = userData;

    // Calculate the referral points based on the referral code entered by the user
    const referralCode = randomstring.generate({
        length: 6,
        charset: 'alphanumeric',
        capitalization: 'uppercase'
    });

    let referrerReferralPoint = 0;
    let referredUserReferralPoint = 0;

    if (referralCodeType) {
        connection.query('SELECT * FROM users WHERE referral_code = ?', [referralCodeType], (err, rows) => {
            if (err) {
                console.error('Error fetching user with referral code:', err);

            }

            if (rows.length > 0) {
                // Referral code is valid, increase the referral points for both the referrer and the referred user
                const referredUserId = rows[0].id;
                referrerReferralPoint = 1000; // Set the referral points for the referrer to 1000
                referredUserReferralPoint = 500; // Set the referral points for the referred user to 500

                connection.query('UPDATE users SET referral_code_count = referral_code_count + 1, user_point = user_point + ? WHERE id = ?', [referrerReferralPoint, referredUserId], (err, updateResult) => {
                    if (err) {
                        console.error('Error updating referral code count and user points:', err);
                        // Handle the error if needed
                    }
                });
            }

            // Continue with user registration process and insert the user into the database
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ error: 'Error hashing password' });
                }

                const referredUser = { username, phonenumber, email, password: hashedPassword, referral_code: referralCode, user_point: referredUserReferralPoint };
                connection.query('INSERT INTO users SET ?', referredUser, (err, referredUserResult) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error registering referred user' });
                    }

                    // Once the user is registered, redirect to the homepage or login page
                    res.render('homepage', { user: null, registrationSuccess: true, showLoginForm: true });
                });
            });
        });
    } else {
        // Continue with user registration process without referral points
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: 'Error hashing password' });
            }

            const user = { username, phonenumber, email, password: hashedPassword, referral_code: referralCode, user_point: 0 };
            connection.query('INSERT INTO users SET ?', user, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error registering user' });
                }

                // Once the user is registered, redirect to the homepage or login page
                res.render('homepage', { user: null, registrationSuccess: true, showLoginForm: true });
            });
        });
    }
});




app.get('/login', (req, res) => {

    if (req.session.loggedIn) {
        // Chuyển hướng về trang chủ (home) nếu đã đăng nhập
        return res.redirect('/');
    }

    res.render('login'); // Assuming you have a login.ejs file for the login form
});

app.post('/login', (req, res) => {
    // const { phonenumber, email , password } = req.body;
   
    const { phonenumberOrEmail, password } = req.body;

    // if (!phonenumberOrEmail) {
    //     return res.render('login', { errorMessage: 'Phone Number/Email is required', user: null });
    // }

    // Check if the phonenumberOrEmail is a valid email or phone number

    let fieldToCheck;
    if (phonenumberOrEmail.includes('@')) {
        fieldToCheck = 'email';
    } else {
        fieldToCheck = 'phonenumber';
    }


    connection.query(`SELECT * FROM users WHERE ${fieldToCheck} = ?`, [phonenumberOrEmail], (err, rows) => {
        if (err) {
            return res.render('login', { errorMessage: 'Error fetching user', user: null });
        }

        if (rows.length === 0) {
            return res.render('login', { errorMessage: 'User not found', user: null });
        }

        const user = rows[0];
        bcrypt.compare(password, user.password, (error, result) => {
            if (error) {
                return res.render('login', { errorMessage: 'Error comparing passwords', user: null });
            }
            if (!result) {
                return res.render('login', { errorMessage: 'Incorret password', user: null });
            }

            // Đăng nhập thành công, lưu userId vào session
            // req.session.loggedIn = true;
            req.session.userId = user.id;

            // Chuyển hướng người dùng đến trang "homepage" sau khi đăng nhập thành công
            res.render('homepage', { user, loginSuccess: true, errorMessage: null });
        });
    });
});
app.get('/forgotpassword', (req, res) => {
    return res.render('forgotpassword');
});



app.get('/profile', function (req, res) {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');
    }

    connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching user' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = rows[0];

        res.render('profile', { user });

    });
});


app.get('/update-profile', function (req, res) {
    // Check if the user is logged in (user ID exists in the session)
    const userId = req.session.userId;
    if (!userId) {
        return res.redirect('/');
    }

    // Retrieve the user data from the database based on the user ID
    connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching user' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = rows[0];

        res.render('update-profile', { user });

    });
});

// Route to handle the profile update form submission
app.post('/update-profile', function (req, res) {
    // Check if the user is logged in (user ID exists in the session)
    const userId = req.session.userId;
    if (!userId) {
        return res.redirect('/');
    }

    const { username, email, phonenumber, birthday } = req.body;

    // Update the user's information in the database
    connection.query('UPDATE users SET username = ?, email = ?, phonenumber = ?, birthday = ?  WHERE id = ?', [username, email, phonenumber, birthday, userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error updating profile' });
        }

        // Redirect the user back to the profile page after successful update
        res.redirect('/profile');
    });
});


app.get('/change-password', function (req, res) {
    const userId = req.session.userId;
    if (!userId) {
        return res.redirect('/');
    }

    res.render('change-password', { user: { id: userId } });
});

// Route to handle the password change form submission
// Route to handle the password change form submission

app.post('/changepassword', function (req, res) {
    // Check if the user is logged in (user ID exists in the session)
    const userId = req.session.userId;
    if (!userId) {
        return res.redirect('/');
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
        return res.render('change-password');

    }
    if (newPassword.length < 8) {
        return res.render('change-password');
    }

    // Fetch the user's information from the database
    connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching user' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = rows[0];

        // Compare the old password provided with the one in the database
        bcrypt.compare(oldPassword, user.password, (error, result) => {
            if (error) {
                return res.status(500).json({ error: 'Error comparing passwords' });
            }

            if (!result) {
                return res.render('change-password', { errorMessage: 'Old Password not correct ' });
            }

            // Hash the new password before storing it in the database
            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ error: 'Error hashing password' });
                }

                // Update the user's password in the database
                connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error changing password' });
                    }

                    // Redirect the user back to the profile page after successful password change
                    res.redirect('/profile');
                });
            });
        });
    });
});




app.get('/logout', (req, res) => {
    // Hủy bỏ phiên đăng nhập bằng cách xóa userId từ phiên
    req.session.hasReferenced = false;

    req.session.userId = null;


    // Xóa toàn bộ thông tin phiên và đăng xuất người dùng
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
        }

        // Chuyển hướng người dùng đến trang đăng nhập sau khi đăng xuất
        res.redirect('/');
    });
});


app.listen(port, () => {
    console.log('listening on http://localhost:' + port);
});