const express = require('express');
const app = express();
const moment = require('moment');
const async = require('async');

const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
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
  
    if (userId) {
      req.session.userId = userId;
    }
  
    const user = req.session.userId ? { id: req.session.userId } : null;
  
    // const sql = 'SELECT * FROM events'; 
    const sql = 'SELECT e.event_id, e.event_name, e.event_date, e.event_location, e.content, CASE WHEN EXISTS (SELECT 1 FROM event_participants ep WHERE e.event_id = ep.event_id AND ep.user_id = ?) THEN 1 ELSE 0 END AS hasRegistered FROM events e;';
        connection.query(sql, [userId], (err, events) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ message: 'Lỗi khi truy vấn cơ sở dữ liệu' });
      }
    

      const sql = 'SELECT * FROM event_participants WHERE user_id = ?';
      connection.query(sql, [userId], (error, results) => {
        if (error) {
          console.error('Lỗi truy vấn cơ sở dữ liệu: ' + error.stack);
          return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
        }
      
        // Kiểm tra xem user đã đăng ký sự kiện nào hay chưa
        const hasRegistered = results.length > 0;
      
        // Tiếp tục xử lý với biến hasRegistered ở đây
      
        res.render('events', { user, events, hasRegistered });
      });
  });

});


app.post('/register', (req, res) => {
    const eventId = req.body.eventId; // Get eventId from the client
    const userId = req.session.userId; // Get userId from the session
  
    // Check if the user is already registered for the event
    const checkQuery = 'SELECT * FROM event_participants WHERE event_id = ? AND user_id = ?';
    connection.query(checkQuery, [eventId, userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi truy vấn dữ liệu' });
        }

        // If the user is already registered, respond with the appropriate message
        if (rows.length > 0) {
            return res.json({ message: 'Người dùng đã đăng ký sự kiện này trước đó' });
            
        }


        // If the user is not registered, proceed with inserting the registration record
        const insertQuery = 'INSERT INTO event_participants (event_id, user_id) VALUES (?, ?)';
        connection.query(insertQuery, [eventId, userId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Lỗi khi thêm dữ liệu vào bảng event_participants' });
            }

            // Check the affectedRows to determine if the insertion was successful
            if (result.affectedRows === 1) {
                // If the affectedRows is 1, it means a new registration was added successfully
                // Update the event's registration status in the server-side data
                const sqlUpdate = 'UPDATE events SET hasRegistered = 1 WHERE event_id = ?';
                connection.query(sqlUpdate, [eventId], (err, updateResult) => {
                    if (err) {
                        console.error('Error updating event registration status:', err);
                    }

                    // Send the success message back to the client
                    return res.json({ message: 'Đăng ký tham gia sự kiện thành công' });
                });
            } else {
                // If the affectedRows is 0, it means the insertion was ignored (duplicate registration)
                return res.json({ message: 'Người dùng đã đăng ký sự kiện này trước đó' });
                // res.redirect('/events');
            }
        });
    });
});


app.get('/signup', (req, res) => {
    // Check if the user is logged in (user ID exists in the session)
    const user = req.session.userId ? { id: req.session.userId } : null;

    return res.render('signup', { user });
});

app.post('/signup', (req, res) => {
    const { username, phonenumber, email, password, confirmPassword } = req.body;
    if (password.length < 8) {
        return res.render('homepage', { errorMessageSignup: 'Passwords at least 8 characters', user: null });
    }

    connection.query('SELECT * FROM users WHERE phonenumber = ?', [phonenumber], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching user' });
        }

        if (rows.length > 0) {
            // An account with this email already exists
            return res.render('signup', { errorMessageSignup: 'Phone is already registered', user: null });
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

            const user = { username, phonenumber, email, password: hashedPassword, referral_code: referralCode };
            connection.query('INSERT INTO users SET ?', user, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error register user' });
                }
                // req.session.userId = result.insertId;

                res.render('homepage', {user: null, registrationSuccess: true,  showLoginForm: true });

            });
        });
    });
});


app.get('/login', (req, res) => {
    res.render('login'); // Assuming you have a login.ejs file for the login form
});

app.post('/login', (req, res) => {
    const { phonenumber, password } = req.body;

    connection.query('SELECT * FROM users WHERE phonenumber = ?', [phonenumber], (err, rows) => {
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
                return res.render('login', { errorMessage: 'Incorret phone or password', user: null });
            }

            // Đăng nhập thành công, lưu userId vào session

            req.session.userId = user.id;

            // Chuyển hướng người dùng đến trang "homepage" sau khi đăng nhập thành công
            res.render('homepage', {user, loginSuccess: true, errorMessage: null });
        });
    });
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
      return res.render('change-password', { errorMessage: 'Password not match ' });

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