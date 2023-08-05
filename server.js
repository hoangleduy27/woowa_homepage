const express = require('express');
const app = express();
const moment = require('moment');
const async = require('async');
const nodemailer = require('nodemailer');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const session = require('express-session');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const qrcode = require('qrcode');
const config = require('./config'); // Đường dẫn đến file config.js
const randomstring = require('randomstring'); // Import the 'randomstring' library for generating random strings
const ejs = require('ejs');
const fs = require('fs');
const uuid = require('uuid');
const qr = require('qr-image');
const multer = require('multer');







const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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
const authToken = '2e8871a0b92c30aa2af8adcb1387146e';
const twilioPhoneNumber = '+1 470 613 4992'; // Số điện thoại Twilio gửi SMS

const client = twilio(accountSid, authToken);




// Set up the multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB (adjust as needed)
    },
    fileFilter: (req, file, cb) => {
      // Adjust allowed file types here if needed
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only images are allowed.'));
      }
    },
  });






// app.get('/', function (req, res) {
//     const userId = req.query.userId;

//     if (userId) {
//         req.session.userId = userId;
//     }

//     // Check if the user is logged in (user ID exists in the session)

//     const user = req.session.userId ? { id: req.session.userId } : null;

//     res.render('homepage', { user , errorMessage: null, errorMessageSignup: null});
// });
app.get('/', function (req, res) {
    const userId = req.session.userId;

    connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Error fetching user' });
        }

        if (rows.length === 0) {
            // Nếu không tìm thấy người dùng, vẫn hiển thị trang homepage nhưng không có dữ liệu người dùng
            const profileImage = null;
            return res.render('homepage', { user: null, profileImage: profileImage });
        }

        const profileImage = rows[0].profile_image_path || null;
        res.render('homepage', { user: rows[0], profileImage: profileImage });
    });
});





app.get('/about', function (req, res) {
    const userId = req.session.userId;

    connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Error fetching user' });
        }

        if (rows.length === 0) {
            // Nếu không tìm thấy người dùng, vẫn hiển thị trang about nhưng không có dữ liệu người dùng
            const profileImage = null;
            return res.render('about', { user: null, profileImage: profileImage });
        }

        const profileImage = rows[0].profile_image_path || null;
        res.render('about', { user: rows[0], profileImage: profileImage });
    });
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
            const profileImage = user ? user.profile_image_path : null;

            res.render('events', { user, events, ticket: user ? user.ticket : null, redeemmessage, profileImage });
        });
    });
});

app.get('/ticket', (req, res) =>{
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
        const referralCodeCount = user.referral_code_count || 0;

 
        res.render('ticket', { user });
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





app.get('/redeem-gift', async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login');
    }

    // Check if the user has enough referral_code_count to redeem the gift (minimum 10 referral_code_count)
    const getUserReferralCountQuery = 'SELECT referral_code_count FROM users WHERE id = ?';
    connection.query(getUserReferralCountQuery, [userId], async (err, userRows) => {
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
        connection.query(updateUserQuery, [userId], async (err, updateUserResult) => {
            if (err) {
                console.error('Error updating user ticket status:', err);
                return res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái vé' });
            }

            // Send email upon successful registration
            const getUserEmailQuery = 'SELECT email, username FROM users WHERE id = ?';
            connection.query(getUserEmailQuery, [userId], async (err, userEmailRows) => {
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

                // Kiểm tra và tạo thư mục nếu nó chưa tồn tại
                // const qrCodeDir = 'qr_codes';
                // if (!fs.existsSync(qrCodeDir)) {
                //     fs.mkdirSync(qrCodeDir);
                // }
                // Generate the QR code with all user data
                const userData = {
                    username: userName,
                    email: userEmail,
                    referral_code_count: referralCodeCount,
                    ticket: 'yes',
                };
                const qrCodeData = JSON.stringify(userData);
                const qrCodeImage = qr.imageSync(qrCodeData, { type: 'png' });

                const qrCodeDataURL = `data:image/png;base64,${qrCodeImage.toString('base64')}`;

                
                (async () => {
                try {
                    
                    

                    // Generate the QR code as SVG data



                    // Email information
                    const mailOptions = {
                        from: 'hlduy01dn@gmail.com', // Your email address
                        to: userEmail, // Receiver's email address from the database
                        subject: 'Ticket Confirmation', // Email subject
                        html: `<p>Dear ${userName},</p> 
                <p>Your ticket has been confirmed.</p>
                <p>Here is your user information:</p>
                <pre>${JSON.stringify(userData, null, 2)}</pre>
                <p>Thank you for using our service!</p>
                <p>Please bring this email or take a screenshot of the QR code to pass through the gate
                </p>

                <p>Best regards,</p>
                <p>The Admin Team</p>`, // Nhúng mã QR code trong email bằng data URL
                attachments: [
                    {
                      filename: 'qrcode.png',
                      content: qrCodeImage, // Replace qrCodeImage with the generated PNG data
                      encoding: 'base64',
                    },
                  ],
                    };
                    // Send email
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log('Error sending email:', error);
                        } else {
                            console.log('Email sent to:', userEmail);
                        }
                        // fs.unlinkSync(qrCodeFilePath);

                    });
                } catch (error) {
                    console.log('Error generating QR code:', error);
                    return res.status(500).json({ message: 'Lỗi khi tạo mã QR code' });
                }
            })();
                res.redirect(`/events?redeemmessage=success`);
            });
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

        // if (rows.length > 0) {
        //     // An account with this email already exists
        //     return res.render('signup', { errorMessageSignup: 'Email is already registered', user: null });
        // }

        // Check if the phone number already exists in the database
        connection.query('SELECT * FROM users WHERE phonenumber = ?', [modifiedPhoneNumber], async (err, rows) => {
            if (err) {
                console.error('Error checking phone number:', err);
                return res.status(500).json({ error: 'Error fetching user' });
            }

            // if (rows.length > 0) {
            //     // An account with this phone number already exists
            //     return res.render('signup', { errorMessageSignup: 'Phone number is already registered', user: null });
            // }

            if (referralCodeType) {
                connection.query('SELECT * FROM users WHERE referral_code = ?', [referralCodeType], async (err, rows) => {
                    if (err) {
                        console.error('Error checking referral code:', err);
                    }

                    if (rows.length === 0) {
                        // Referral code does not exist in the database
                        return res.render('signup', {errorreferral:'Sai mã giới thiệu', user:null })
                        
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

                        req.session.modifiedPhoneNumber = modifiedPhoneNumber;

                        res.redirect('/confirmotp'); // Redirect to /confirmotp without passing an object
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
                    req.session.userData = { username, phonenumber:modifiedPhoneNumber, email, password, referralCodeType };
                    req.session.modifiedPhoneNumber = modifiedPhoneNumber;

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
    const { username, phonenumber, email, password, referralCodeType } = userData;

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
                referrerReferralPoint = 10; // Set the referral points for the referrer to 1000
                referredUserReferralPoint = 5; // Set the referral points for the referred user to 500

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
            return res.render('login', { errorMessage: ' Wrong Email or PhoneNumber ', user: null });
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
// Xử lý yêu cầu gửi email quên mật khẩu
app.post('/forgotpassword', (req, res) => {
    const email = req.body.email;
  
    // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu hay không
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Lỗi khi truy vấn cơ sở dữ liệu' });
      }
  
      if (rows.length === 0) {
        // Email không tồn tại trong cơ sở dữ liệu
        return res.status(400).json({ message: 'Email không tồn tại' });
      }
  
      // Tạo mã khôi phục ngẫu nhiên
      const token = crypto.randomBytes(20).toString('hex');
  
      // Lưu mã khôi phục vào cơ sở dữ liệu
      connection.query('INSERT INTO reset_tokens (email, token) VALUES (?, ?)', [email, token], (err, result) => {
        if (err) {
          console.error('Error inserting reset token:', err);
          return res.status(500).json({ message: 'Lỗi khi lưu mã khôi phục vào cơ sở dữ liệu' });
        }
  
        // Gửi email chứa liên kết để reset mật khẩu
        const resetLink = `http://localhost:3000/resetpassword/${token}`;
  
        const mailOptions = {
          from: 'your-email-username',
          to: email,
          subject: 'Reset Password',
          html: `<p>Click on the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Lỗi khi gửi email' });
          }
  
        //   return res.status(200).json({ message: 'Vui lòng kiểm tra email để đặt lại mật khẩu' });
        return res.render('homepage',{resetpassmmessage : true, user:null});
          
        });
      });
    });
  });



  // Trang reset mật khẩu
  app.get('/resetpassword/:token', (req, res) => {
    const token = req.params.token;
  
    // Kiểm tra xem mã khôi phục có hợp lệ hay không
    connection.query('SELECT * FROM reset_tokens WHERE token = ?', [token], (err, rows) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Lỗi khi truy vấn cơ sở dữ liệu' });
      }
  
      if (rows.length === 0) {
        // Mã khôi phục không hợp lệ
        return res.status(400).json({ message: 'Mã khôi phục không hợp lệ' });
      }
  
      const email = rows[0].email;
      res.render('resetpassword', { token, email });
    });
  });
  
  // Xử lý yêu cầu reset mật khẩu
  app.post('/resetpassword', (req, res) => {
    const token = req.body.token;
    const newPassword = req.body.password;
  
    // Kiểm tra xem mã khôi phục có hợp lệ hay không
    connection.query('SELECT * FROM reset_tokens WHERE token = ?', [token], (err, rows) => {
      if (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ message: 'Lỗi khi truy vấn cơ sở dữ liệu' });
      }
  
      if (rows.length === 0) {
        // Mã khôi phục không hợp lệ
        return res.status(400).json({ message: 'Mã khôi phục không hợp lệ' });
      }
  
      const email = rows[0].email;
  
      // Mã hóa mật khẩu mới trước khi lưu vào cơ sở dữ liệu
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ message: 'Lỗi khi mã hóa mật khẩu mới' });
        }
  
        // Cập nhật mật khẩu mới trong cơ sở dữ liệu cho người dùng
        connection.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], (err, result) => {
          if (err) {
            console.error('Error updating password:', err);
            return res.status(500).json({ message: 'Lỗi khi cập nhật mật khẩu mới' });
          }
  
          // Xóa mã khôi phục trong cơ sở dữ liệu sau khi đã sử dụng
          connection.query('DELETE FROM reset_tokens WHERE token = ?', [token], (err, result) => {
            if (err) {
              console.error('Error deleting reset token:', err);
              return res.status(500).json({ message: 'Lỗi khi xóa mã khôi phục' });
            }
  
            //  res.redirect(`/?resetmessage=success`);
             return res.render('homepage',{resetmessage : true, user:null});
        });
        });
      });
    });
  });





  
// app.get('/profile', function (req, res) {
//     const userId = req.session.userId;

//     if (!userId) {
//         return res.redirect('/login');
//     }

//     connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows) => {
//         if (err) {
//             return res.status(500).json({ error: 'Error fetching user' });
//         }

//         if (rows.length === 0) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // const user = rows[0];
//         const profileImage = rows[0].profile_image_path || null;

//         res.render('profile', { user: rows[0], profileImage: profileImage  });

//     });
// });


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
        const referralCodeCount = user.referral_code_count || 0;

        // Set user_level based on referral_code_count
        if (referralCodeCount >= 10 && referralCodeCount < 20) {
            user.user_level = 'D';
        } else if (referralCodeCount >= 20 && referralCodeCount < 30) {
            user.user_level = 'C';
        } else if (referralCodeCount >= 30 && referralCodeCount < 40) {
            user.user_level = 'B';
        } else if (referralCodeCount >= 40 && referralCodeCount < 50) {
            user.user_level = 'A';
        } else if (referralCodeCount >= 50) {
            user.user_level = 'VIP';
        } else {
            user.user_level = null;
        }

        // Update user level in the database
        connection.query('UPDATE users SET user_level = ? WHERE id = ?', [user.user_level, userId], (err, updateResult) => {
            if (err) {
                console.error('Error updating user level:', err);
            }

            // Get the profile image path from the user data, or set it to null if not available
            const profileImage = user.profile_image_path || null;

            // Pass the user information including profileImage to the template when rendering
            res.render('profile', { user: user, profileImage: profileImage });
        });
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
      const userBirthday = new Date(rows[0].birthday);
      const profileImage = rows[0].profile_image_path || null;

      // Render the profile update form using the 'update-profile.ejs' template
      res.render('update-profile', { user: rows[0],  userBirthday: userBirthday , profileImage: profileImage });
    });
  });




app.post('/update-profile', upload.single('profileImage'), function (req, res) {
    // Check if the user is logged in (user ID exists in the session)
    const userId = req.session.userId;
    if (!userId) {
      return res.redirect('/');
    }
  
    const { username, email, phonenumber, birthday, gender  } = req.body;
    const profileImage = req.file;
  
    // Check if a new profile image was uploaded
    if (profileImage) {
      // Update the user's information in the database with the image file path
      const imagePath = path.join(__dirname, 'uploads', profileImage.filename);
  
      // Move the uploaded image to the 'uploads' folder
      fs.rename(profileImage.path, imagePath, (err) => {
        if (err) {
          console.error('Error moving image to uploads folder:', err);
          return res.status(500).json({ error: 'Error moving image to uploads folder' });
        }
  
        // Update the user's information in the database with the image file path
        const query = 'UPDATE users SET username = ?, email = ?, phonenumber = ?, birthday = ?, gender = ?, profile_image_path = ? WHERE id = ?';
        connection.query(query, [username, email, phonenumber, birthday, gender, profileImage.filename, userId], (err, result) => {
            if (err) {
            return res.status(500).json({ error: 'Error updating profile' });
          }
  
          // Redirect the user back to the profile page after successful update
          res.redirect('/profile');
        });
      });
    } else {
      // If no new image was uploaded, update the user's information without changing the profile_image_path
      const query = 'UPDATE users SET username = ?, email = ?, phonenumber = ?, birthday = ? , gender = ? WHERE id = ?';
      connection.query(query, [username, email, phonenumber, birthday, gender, userId], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error updating profile' });
        }
  
        // Redirect the user back to the profile page after successful update
        res.redirect('/profile');
      });
    }
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