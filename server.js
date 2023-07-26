const express = require('express');
const app = express();
const moment = require('moment');

const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const config = require('./config'); // Đường dẫn đến file config.js
const randomstring = require('randomstring'); // Import the 'randomstring' library for generating random strings



const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/events', function (req, res) {
    const userId = req.query.userId;

    if (userId) {
        req.session.userId = userId;
    }

    // Check if the user is logged in (user ID exists in the session)
    const user = req.session.userId ? { id: req.session.userId } : null;  

    return res.render('events', { user });
});





app.post('/signup', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    if (password.length < 8) {
        return res.render('homepage', { errorMessageSignup: 'Passwords at least 8 characters', user: null });
    }

    // if (password !== confirmPassword) {
    //     return res.render('homepage', { user: null });
    // }

    // Check if the email is already registered
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching user' });
        }

        if (rows.length > 0) {
            // An account with this email already exists
            return res.render('homepage', { errorMessageSignup: 'Email is already registered', user: null });
        }

        const referralCode = randomstring.generate({
            length: 6,
            charset: 'alphanumeric',
            capitalization: 'uppercase'
        });

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: 'Error hashing password' });
            }

            const user = { username, email, password: hashedPassword, referral_code: referralCode };
            connection.query('INSERT INTO users SET ?', user, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error register user' });
                }
                // req.session.userId = result.insertId;

                // // Pass signupError as false since there is no signup error
                // res.render('homepage', { user, registrationSuccess: true });
                res.render('homepage', {user: null, registrationSuccess: true,  showLoginForm: true });

                // return res.render('homepage', { user, signupError: false });
            });
        });
    });
});


// Handle POST request for user login
app.post('/login', (req, res) => {
    const { email, password } = req.body;


    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching user' });
        }

        if (rows.length === 0) {
            // return res.status(404).json({ error: 'User not found' });
            return res.render('homepage', { errorMessage: 'User not found', user: null });

        }

        const user = rows[0];
        bcrypt.compare(password, user.password, (error, result) => {
            if (error) {
                return res.status(500).json({ error: 'Error comparing passwords', user: null });
            }
            if (!result) {
                // return res.render('homepage', { loginError: true, user: null });
                // return res.status(401).json({ error: 'Incorrect username or password' });
                return res.render('homepage', { errorMessage: 'Incorrect username or password', user: null });
                // return res.status(401).json({ success: false, errorMessage: 'Incorrect username or password' });

                // return res.render('homepage', { errorMessage: 'Incorret username or password', user: null });

                // return res.redirect('/?loginError=true');
            }
            req.session.userId = user.id;
            // return res.render('homepage');
            // return res.render('homepage', { user, errorMessage: false });
            // return res.redirect('/');
            
            return res.render('homepage', { user,});




        });
    });
});

// app.post('/login', (req, res) => {
//     const { email, password } = req.body;

//     connection.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
//         if (err) {
//             return res.status(500).json({ success: false, errorMessage: 'Error fetching user' });
//         }

//         if (rows.length === 0) {
//             return res.status(401).json({ success: false, errorMessage: 'User not found' });
//         }

//         const user = rows[0];
//         bcrypt.compare(password, user.password, (error, result) => {
//             if (error) {
//                 return res.status(500).json({ success: false, errorMessage: 'Error comparing passwords' });
//             }

//             if (!result) {
//                 return res.status(401).json({ success: false, errorMessage: 'Incorrect username or password' });
//             }

//             req.session.userId = user.id;
//             return res.status(200).json({ success: true }); // Login successful
//         });
//     });
// });


app.get('/profile', function (req, res) {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/');
    }

    connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching user' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = rows[0];

        // Render the dashboard with user information
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
        // if (user.birthday) {
        //     user.birthday = moment(user.birthday).format('YYYY-MM-DD');
        // } else {
        //     // If user.birthday is not set or invalid, set it to null to avoid the default "1/1/1970" value
        //     user.birthday = null;
        // }
        // Render the profile page with user information
        // res.render('update-profile', { user });
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


app.post('/register-for-event', (req, res) => {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa bằng cách kiểm tra session
    const userId = req.session.userId;
  
    if (!userId) {
      // Nếu người dùng chưa đăng nhập, trả về thông báo lỗi
      return res.status(401).json({ error: 'Unauthorized. Please log in to register for the event.' });
    }
  
    const { event_id } = req.body;
  
    // Thực hiện thêm thông tin tham gia vào bảng event_participants
    connection.query(
      'INSERT INTO event_participants (event_id, user_id) VALUES (?, ?)',
      [event_id, userId],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error registering for the event' });
        }
  
        // Trả về kết quả thành công
        return res.status(200).json({ success: true });
      }
    );
  });



app.get('/logout', (req, res) => {
    // Hủy bỏ phiên đăng nhập bằng cách xóa userId từ phiên
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