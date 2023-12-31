const express = require("express");
const app = express();
const moment = require("moment");
const async = require("async");
const nodemailer = require("nodemailer");
const path = require("path");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const session = require("express-session");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const qrcode = require("qrcode");
const config = require("./config"); // Đường dẫn đến file config.js
const randomstring = require("randomstring"); // Import the 'randomstring' library for generating random strings
const ejs = require("ejs");
const fs = require("fs");
const uuid = require("uuid");
const qr = require("qr-image");
const multer = require("multer");
const { log } = require("util");
const { error } = require("console");


const port = 8000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection({
  user: "root",
  password: "123123",
  database: "da_1",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connection successfull");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: config.sessionSecret, // Replace with your secret key for session management
    resave: false,
    saveUninitialized: true,
  })
);

// Khởi tạo    Client với các thông tin tài khoản Twilio của bạn
const accountSid = "AC0c7087bf0b8346d436c8e7a3f0b0d4ee";
const authToken = "22d14b03a4c182da00ed0f18293ac403";
const twilioPhoneNumber = "+12193488491"; // Số điện thoại Twilio gửi SMS

const client = twilio(accountSid, authToken);

// Set up the multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB (adjust as needed)
  },
  fileFilter: (req, file, cb) => {
    // Adjust allowed file types here if needed
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."));
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
app.get("/", function (req, res) {
  const userId = req.session.userId;

  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    (err, rows) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ error: "Error fetching user" });
      }

      if (rows.length === 0) {
        // Nếu không tìm thấy người dùng, vẫn hiển thị trang homepage nhưng không có dữ liệu người dùng
        const profileImage = null;
        return res.render("homepage", {
          user: null,
          profileImage: profileImage,
        });
      }

      const profileImage = rows[0].profile_image_path || null;
      res.render("homepage", { user: rows[0], profileImage: profileImage });
    }
  );
});

app.get("/about", function (req, res) {
  const userId = req.session.userId;

  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    (err, rows) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ error: "Error fetching user" });
      }

      if (rows.length === 0) {
        // Nếu không tìm thấy người dùng, vẫn hiển thị trang about nhưng không có dữ liệu người dùng
        const profileImage = null;
        return res.render("about", { user: null, profileImage: profileImage });
      }

      const profileImage = rows[0].profile_image_path || null;
      res.render("about", { user: rows[0], profileImage: profileImage });
    }
  );
});

app.get("/events", (req, res) => {
  const userId = req.query.userId;

  // Fetch all events from the events table
  const getEventsQuery = "SELECT * FROM events";
  connection.query(getEventsQuery, (err, events) => {
    if (err) {
      console.error("Error querying the database for events:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi truy vấn cơ sở dữ liệu cho các sự kiện" });
    }

    // Check if the userId is provided and set it in the session
    if (userId) {
      req.session.userId = userId;
    }

    // Fetch user information from the users table based on the userId stored in the session
    const userIdFromSession = req.session.userId;
    const getUserQuery = "SELECT * FROM users WHERE id = ?";
    connection.query(getUserQuery, [userIdFromSession], (userErr, userRows) => {
      if (userErr) {
        console.error("Error querying user data:", userErr);
        return res
          .status(500)
          .json({ message: "Lỗi khi truy vấn dữ liệu người dùng" });
      }

      const user = userRows.length === 1 ? userRows[0] : null;
      const profileImage = user ? user.profile_image_path : null;

      res.render("events", {
        user,
        events,
        ticket: user ? user.ticket : null,
        profileImage,
      });
    });
  });
});

app.get("/ticket", (req, res) => {
  const userId = req.session.userId;
  const redeemmessage = req.query.redeemmessage;
  const errorR = req.query.error; // Lấy parameter query error

  if (!userId) {
    return res.redirect("/login");
  }

  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching user" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = rows[0];
      const referralCodeCount = user.referral_code_count || 0;
      const profileImage = user ? user.profile_image_path : null;

      // Fetch user's ticket information
      connection.query(
        "SELECT area FROM tickets WHERE user_id = ?",
        [userId],
        (ticketErr, ticketRows) => {
          if (ticketErr) {
            return res
              .status(500)
              .json({ error: "Error fetching user ticket" });
          }

          let selectedAreas = [];
          if (ticketRows.length > 0) {
            selectedAreas = ticketRows[0].area;
          }
          if (user.ticket === "yes") {
            return res.redirect("/"); // Thay thế "/homepage" bằng đường dẫn bạn muốn chuyển hướng đến
          }

          res.render("ticket", {
            user,
            redeemmessage,
            profileImage,
            errorR,
            selectedAreas,
          });
        }
      );
    }
  );
});

const areas = {
  A: { shared: 30, name: "Khu A", color: "vvip-text-color" },
  B: { shared: 25, name: "Khu B", color: "vip-text-color" },
  C: { shared: 20, name: "Khu C", color: "standard-text-color" },
  D: { shared: 17, name: "Khu D", color: "zone1-text-color" },
  E: { shared: 13, name: "Khu E", color: "zone2-text-color" },
};

app.post("/redeem-gift", async (req, res) => {
  const userId = req.session.userId;
  const selectedAreas = req.body;

  const getUserReferralCountQuery =
    "SELECT referral_code_count, ticket FROM users WHERE id = ?";
  connection.query(
    getUserReferralCountQuery,
    [userId],
    async (error, userRows) => {
      if (error) {
        console.error("Error getting user referral code count:", error);
        return res.status(500).json({
          message: "Lỗi khi lấy số lượng mã giới thiệu của người dùng",
        });
      }

      if (userRows.length !== 1) {
        return res.status(500).json({
          message: "Người dùng không tồn tại hoặc có nhiều bản ghi trùng lặp",
        });
      }

      const referralCodeCount = userRows[0].referral_code_count;
      const userTicketStatus = userRows[0].ticket;
      if (userTicketStatus === "yes") {
        return res.redirect(
          "/ticket?errorR=" + encodeURIComponent("Bạn đã có vé rồi.")
        );
      }
      // Xác định tổng số referral code count cần trừ dựa trên từng khu vực đã chọn

      const totalReferralCodeCountToSubtract = selectedAreas.reduce(
        (total, selectedArea) => total + areas[selectedArea].shared,
        0
      );

      if (referralCodeCount < totalReferralCodeCountToSubtract) {
        return res.status(400).json({
          message: "Không đủ mã giới thiệu để đổi vé cho các khu vực đã chọn.",
        });
      }

      async function getNextSeatNumber(selectedAreas, connection) {
        return new Promise((resolve, reject) => {
          const areaList = selectedAreas.map((area) => `'${area}'`).join(",");

          const query = `
          SELECT user_id, seat_number
          FROM tickets
            WHERE area IN (${areaList});
          `;
          connection.query(query, (err, results) => {
            if (err) {
              reject(err);
            } else {
              console.log("=" + areaList);
              const usedSeatNumbers = results.map((row) => row.seat_number);
              console.log("Used Seat Numbers:", usedSeatNumbers);

              for (const selectedArea of selectedAreas) {
                let seatNumber = 1;

                while (seatNumber <= areas[selectedArea].shared) {
                  const candidateSeatNumber = `${selectedArea}${seatNumber
                    .toString()
                    .padStart(2, "0")}`;

                  if (!usedSeatNumbers.includes(candidateSeatNumber)) {
                    resolve(candidateSeatNumber);
                    return;
                  }

                  seatNumber++;
                }
              }

              reject(new Error("Không tìm thấy vị trí ghế trống."));
            }
          });
        });
      }

      const nextSeatNumber = await getNextSeatNumber(selectedAreas, connection);
      console.log("Next Seat Number:", nextSeatNumber);

      const insertTicketQuery =
        "INSERT INTO tickets (user_id, area, seat_number) VALUES (?, ?, ?)";
      try {
        console.log(
          selectedAreas,
          selectedAreas[0],
          JSON.stringify(selectedAreas)
        );
        connection.query(
          insertTicketQuery,
          [userId, selectedAreas[0], nextSeatNumber],
          async (error, results) => {
            if (error) {
              console.error("Error:", error);
              return res
                .status(500)
                .json({ error: "Đã xảy ra lỗi khi lưu vào cơ sở dữ liệu." });
            }

            const newReferralCodeCount =
              referralCodeCount - totalReferralCodeCountToSubtract;
            const updateUserQuery =
              "UPDATE users SET referral_code_count = ?, ticket = ? WHERE id = ?";
            connection.query(
              updateUserQuery,
              [newReferralCodeCount, "yes", userId],
              async (error, updateResult) => {
                if (error) {
                  console.error(
                    "Error updating user referral code count:",
                    error
                  );
                  return res.status(500).json({
                    error:
                      "Đã xảy ra lỗi khi cập nhật số lượng mã giới thiệu của người dùng.",
                  });
                }
                // Update user's ticket status to 'yes'
                const updateUserTicketQuery =
                  "UPDATE users SET ticket = ? WHERE id = ?";
                connection.query(
                  updateUserTicketQuery,
                  ["yes", userId],
                  async (error, updateTicketResult) => {
                    if (error) {
                      console.error(
                        "Error updating user ticket status:",
                        error
                      );
                      return res.status(500).json({
                        error:
                          "Đã xảy ra lỗi khi cập nhật trạng thái vé của người dùng.",
                      });
                    }

                    // Gửi email sau khi tất cả c ác hoạt động hoàn tất
                    sendConfirmationEmail(userId, res);
                    return res.status(200).json({
                      message: "Đổi vé thành công và đã gửi email xác nhận.",
                    });
                    // return res.redirect("/events");
                  }
                );
              }
            );
          }
        );
      } catch (error) {
        console.error("Error:", error);
        return res
          .status(500)
          .json({ error: "Đã xảy ra lỗi khi lưu vào cơ sở dữ liệu." });
      }
    }
  );
});

// Function to send confirmation email
function sendConfirmationEmail(userId, res) {
  const getUserEmailAndTicketDataQuery =
    "SELECT users.email, users.username, tickets.area, tickets.seat_number FROM users INNER JOIN tickets ON users.id = tickets.user_id WHERE users.id = ?";
  connection.query(
    getUserEmailAndTicketDataQuery,
    [userId],
    async (err, userEmailAndTicketRows) => {
      if (err) {
        console.error("Error getting user email and ticket data:", err);
        return res.status(500).json({
          message: "Lỗi khi lấy thông tin email và vé của người dùng",
        });
      }

      if (userEmailAndTicketRows.length !== 1) {
        console.error(
          "User with id " +
            userId +
            " not found or multiple records with the same id exist."
        );
        return res.redirect("/logout");
      }

      const userEmail = userEmailAndTicketRows[0].email;
      const userName = userEmailAndTicketRows[0].username;
      const selectedArea = userEmailAndTicketRows[0].area;
      const seatNumber = userEmailAndTicketRows[0].seat_number;

      const encryptionKey =
        "50c023426b4d6fbcd1a2ed0157e7ece6dce90265219da96a14ac6becc6c08e1c";

      // Generate the QR code with all user data
      const userData = {
        username: userName,
        email: userEmail,
        ticket: "yes",
        // referral_code_count: referralCodeCount,
        area: selectedArea,
        seat_number: seatNumber,
      };

      // const qrCodeData = JSON.stringify(userData);
      // const qrCodeImage = qr.imageSync(qrCodeData, { type: "png" });
      const userDataString = JSON.stringify(userData);

      const cipher = crypto.createCipher("aes-256-cbc", encryptionKey);
      let encryptedUserData = cipher.update(userDataString, "utf-8", "hex");
      encryptedUserData += cipher.final("hex");

      console.log("Encrypted User Data:", encryptedUserData);

      // Generate QR code with encrypted user data
      const qrCodeData = qr.imageSync(encryptedUserData, {
        type: "png",
      });

      // Decryption process

      const decipher = crypto.createDecipher("aes-256-cbc", encryptionKey);
      let decryptedUserData = decipher.update(
        encryptedUserData,
        "hex",
        "utf-8"
      );
      decryptedUserData += decipher.final("utf-8");

      const decryptedData = JSON.parse(decryptedUserData);

      console.log("Decrypted User Data:", decryptedData);

      (async () => {
        try {
          // Generate the QR code as SVG data

          // Email information

          const mailOptions = {
            from: "hlduy01dn@gmail.com", // Your email address
            to: userEmail, // Receiver's email address from the database
            subject: "Ticket Confirmation", // Email subject
            html: `<!DOCTYPE html>
                        <html>
                          <head>
                            <meta charset="UTF-8" />
                            <title>XÁC NHẬN VÉ CONCERT</title>
                            <style>
                              body {
                                font-family: Arial, sans-serif;
                                background-color: #2d2d2d;
                                margin: 0;
                                padding: 0;
                                color: white;
                              }
                              .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #232323;
                                border-radius: 5px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                padding: 20px;
                              }
                              h2 {
                                text-align: center;
                                color: #ff6600;
                              }
                              p {
                                margin: 10px 0;
                                color: #ffffff;
                              }
                              strong {
                                color: #ff6600;
                              }
                              .footer {
                                text-align: center;
                                margin-top: 20px;
                                color: #ffffff;
                              }
                            </style>
                          </head>
                          <body>
                            <div class="container">
                              <p>Dear ${userName},</p>
                              <p>Your ticket has been confirmed.</p>
                              <p>Here is your user information ticket:</p>
                              <p> Seat level: ${selectedArea} </p>
                              <p> Your seat: ${seatNumber} </p>
      
                              <!-- Thêm ảnh QR code vào email -->
                              <img
                                src="cid:qrcode"
                                alt="QR Code"
                                style="display: block; margin: 0 auto"
                              />
                              <p>Thank you for using our service!</p>
                              <p>
                                Please bring this email or take a screenshot of the QR code to pass
                                through the gate.
                              </p>
                              <div class="footer">
                                <p>Best regards,</p>
                                <p>The Admin Team</p>
                              </div>
                            </div>
                          </body>
                        </html>
                        `, // Nhúng mã QR code trong email bằng data URL

            attachments: [
              {
                filename: "qrcode.png",
                content: qrCodeData, // Replace qrCodeImage with the generated PNG data
                encoding: "base64",
                cid: "qrcode",
              },
            ],
          };

          // Send email
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("Error sending email:", error);
            } else {
              console.log("Email sent to:", userEmail);
              return res.render("/events", { redeemmessage });
            }
            // fs.unlinkSync(qrCodeFilePath);
          });
        } catch (error) {
          console.log("Error generating QR code:", error);
          return res.status(500).json({ message: "Lỗi khi tạo mã QR code" });
        }
      })();
    }
  );
}

// Cấu hình dịch vụ Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hlduy01dn@gmail.com", // Email của bạn
    pass: "dsqrtreqocyxrwtr", // Mật khẩu của bạn
  },
});

app.get("/signup", (req, res) => {
  const inviteCode = req.query.inviteCode;

  // Check if the user is logged in (user ID exists in the session)
  const user = req.session.userId ? { id: req.session.userId } : null;

  return res.render("signup", { user, inviteCode: inviteCode });
});

// Signup route
app.post("/signup", async (req, res) => {
  const {
    username,
    phonenumber,
    email,
    password,
    confirmpassword,
    referralCodeType,
  } = req.body;

  const modifiedPhoneNumber = phonenumber.replace(/^0/, "+84");

  if (password.length < 8) {
    return res.render("signup", {
      errorMessageSignup: "Passwords must be at least 8 characters",
      user: null,
    });
  }

  if (password !== confirmpassword) {
    return res.render("signup", {
      errorMessageSignup: "Passwords do not match",
      user: null,
    });
  }

  // Check if the email already exists in the database
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, rows) => {
      if (err) {
        console.error("Error checking email:", err);
        return res.status(500).json({ error: "Error fetching user" });
      }

      if (rows.length > 0) {
        // An account with this email already exists
        return res.render("signup", {
          errorMessageSignup: "Email is already registered",
          user: null,
        });
      }

      // Check if the phone number already exists in the database
      connection.query(
        "SELECT * FROM users WHERE phonenumber = ?",
        [modifiedPhoneNumber],
        async (err, rows) => {
          if (err) {
            console.error("Error checking phone number:", err);
            return res.status(500).json({ error: "Error fetching user" });
          }

          // if (rows.length > 0) {
          //   // An account with this phone number already exists
          //   return res.render("signup", {
          //     errorMessageSignup: "Phone number is already registered",
          //     user: null,
          //   });
          // }

          if (referralCodeType) {
            connection.query(
              "SELECT * FROM users WHERE referral_code = ?",
              [referralCodeType],
              async (err, rows) => {
                if (err) {
                  console.error("Error checking referral code:", err);
                }

                if (rows.length === 0) {
                  // Referral code does not exist in the database
                  return res.render("signup", {
                    errorreferral: "Sai mã giới thiệu",
                    user: null,
                  });
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
                    to: modifiedPhoneNumber,
                  });
                  console.log(otp);

                  // Save the user information in session for later use in the /confirmotp route
                  req.session.userData = {
                    username,
                    phonenumber: modifiedPhoneNumber,
                    email,
                    password,
                    referralCodeType,
                  };

                  req.session.modifiedPhoneNumber = modifiedPhoneNumber;

                  res.redirect("/confirmotp"); // Redirect to /confirmotp without passing an object
                } catch (error) {
                  console.error("Error sending OTP:", error);
                  res.send("System error, please try again later.");
                }
              }
            );
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
                to: modifiedPhoneNumber,
              });
              console.log(otp);

              // Save the user information in session for later use in the /confirmotp route
              req.session.userData = {
                username,
                phonenumber: modifiedPhoneNumber,
                email,
                password,
                referralCodeType,
              };
              req.session.modifiedPhoneNumber = modifiedPhoneNumber;

              res.redirect("/confirmotp");
            } catch (error) {
              console.error("Error sending OTP:", error);
              res.send("System error, please try again later.");
            }
          }
        }
      );
    }
  );
});

// Confirm OTP route
app.get("/confirmotp", (req, res) => {
  // Retrieve the userData from the session
  const userData = req.session.userData;

  // Check if userData exists in the session
  if (!userData) {
    return res.redirect("/signup"); // Redirect to signup if userData is missing
  }

  const { phonenumber: phoneNumber, otp } = userData;

  res.render("confirmotp", { errorMessageOTP: null, phoneNumber });
});

app.post("/confirmotp", (req, res) => {
  const { otp1, otp2, otp3, otp4, otp5, otp6 } = req.body;
  const otp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
  // const { otp } = req.body;
  const sessionOTP = req.session.otp;
  const userData = req.session.userData;
  if (!otp || Number(otp) !== sessionOTP) {
    // Incorrect or missing OTP, display an error message
    return res.render("confirmotp", {
      errorMessageOTP: "Incorrect OTP, please try again.",
    });
  }

  // OTP confirmed successfully, proceed with user registration
  delete req.session.otp; // Remove OTP from session after successful confirmation

  // Insert the user data into the database
  const { username, phonenumber, email, password, referralCodeType } = userData;

  // Calculate the referral points based on the referral code entered by the user
  const referralCode = randomstring.generate({
    length: 6,
    charset: "alphanumeric",
    capitalization: "uppercase",
  });

  let referrerReferralPoint = 0;
  let referredUserReferralPoint = 0;

  if (referralCodeType) {
    connection.query(
      "SELECT * FROM users WHERE referral_code = ?",
      [referralCodeType],
      (err, rows) => {
        if (err) {
          console.error("Error fetching user with referral code:", err);
        }

        if (rows.length > 0) {
          // Referral code is valid, increase the referral points for both the referrer and the referred user
          const referredUserId = rows[0].id;
          referrerReferralPoint = 10; // Set the referral points for the referrer to 1000
          referredUserReferralPoint = 5; // Set the referral points for the referred user to 500

          connection.query(
            "UPDATE users SET referral_code_count = referral_code_count + 1, user_point = user_point + ? WHERE id = ?",
            [referrerReferralPoint, referredUserId],
            (err, updateResult) => {
              if (err) {
                console.error(
                  "Error updating referral code count and user points:",
                  err
                );
                // Handle the error if needed
              }
            }
          );
        }

        // Continue with user registration process and insert the user into the database
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            return res.status(500).json({ error: "Error hashing password" });
          }

          const referredUser = {
            username,
            phonenumber,
            email,
            password: hashedPassword,
            referral_code: referralCode,
            user_point: referredUserReferralPoint,
          };
          connection.query(
            "INSERT INTO users SET ?",
            referredUser,
            (err, referredUserResult) => {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Error registering referred user" });
              }

              // Once the user is registered, redirect to the homepage or login page
              res.render("homepage", {
                user: null,
                registrationSuccess: true,
                showLoginForm: true,
                phonenumber,
              });
            }
          );
        });
      }
    );
  } else {
    // Continue with user registration process without referral points
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: "Error hashing password" });
      }
      const user = {
        username,
        phonenumber,
        email,
        password: hashedPassword,
        referral_code: referralCode,
        user_point: 0,
        ticket:'',
      };
      console.log(user);
      const insertUserQuery = `
  INSERT INTO da_1.users (username, phonenumber, email, password, referral_code, user_point, ticket)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;
      const userValues = [
        user.username,
        user.phonenumber,
        user.email,
        user.password,
        user.referral_code,
        user.user_point,
        user.ticket,
      ];

      connection.query(
        insertUserQuery, userValues, (err, result) => {
          console.log(result);

          if (err) {
            return res.status(500).json({ error: "Error registering user" });
          }
          console.log("User inserted successfully!");
 
          // Once the user is registered, redirect to the homepage or login page
          res.render("homepage", {
            user: null,
            registrationSuccess: true,
            showLoginForm: true,
          });
        }
      );
    });
  }
});

app.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect("/");
  }

  res.render("login"); // Assuming you have a login.ejs file for the login form
});

app.post("/login", (req, res) => {
  const { phonenumberOrEmail, password } = req.body;

  // if (!phonenumberOrEmail) {
  //     return res.render('login', { errorMessage: 'Phone Number/Email is required', user: null });
  // }

  // Check if the phonenumberOrEmail is a valid email or phone number

  let fieldToCheck;
  if (phonenumberOrEmail.includes("@")) {
    fieldToCheck = "email";
  } else {
    fieldToCheck = "phonenumber";
  }

  connection.query(
    `SELECT * FROM users WHERE ${fieldToCheck} = ?`,
    [phonenumberOrEmail],
    (err, rows) => {
      if (err) {
        return res.render("login", {
          errorMessage: "Error fetching user",
          user: null,
        });
      }

      if (rows.length === 0) {
        return res.render("login", {
          errorMessage: " Wrong Email or PhoneNumber ",
          user: null,
        });
      }

      const user = rows[0];
      if (user.status === 0) {
        return res.render("login", {
          errorMessage: "User is disabled",
          user: null,
        });
      }
      bcrypt.compare(password, user.password, (error, result) => {
        if (error) {
          return res.render("login", {
            errorMessage: "Error comparing passwords",
            user: null,
          });
        }
        if (!result) {
          return res.render("login", {
            errorMessage: "Incorret password",
            user: null,
          });
        }

        // Đăng nhập thành công, lưu userId vào session
        // req.session.loggedIn = true;
        req.session.userId = user.id;

        // Chuyển hướng người dùng đến trang "homepage" sau khi đăng nhập thành công
        res.render("homepage", {
          user,
          loginSuccess: true,
          errorMessage: null,
        });
      });
    }
  );
});




app.get("/forgotpassword", (req, res) => {
  return res.render("forgotpassword");
});
// Xử lý yêu cầu gửi email quên mật khẩu
app.post("/forgotpassword", (req, res) => {
  const email = req.body.email;

  // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu hay không
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, rows) => {
      if (err) {
        console.error("Error querying database:", err);
        return res
          .status(500)
          .json({ message: "Lỗi khi truy vấn cơ sở dữ liệu" });
      }

      if (rows.length === 0) {
        // Email không tồn tại trong cơ sở dữ liệu
        return res.status(400).json({ message: "Email không tồn tại" });
      }

      // Tạo mã khôi phục ngẫu nhiên
      const token = crypto.randomBytes(20).toString("hex");

      // Lưu mã khôi phục vào cơ sở dữ liệu
      connection.query(
        "INSERT INTO reset_tokens (email, token) VALUES (?, ?) ",
        [email, token],
        (err, result) => {
          if (err) {
            console.error("Error inserting reset token:", err);
            return res
              .status(500)
              .json({ message: "Lỗi khi lưu mã khôi phục vào cơ sở dữ liệu" });
          }
 

          // Gửi email chứa liên kết để reset mật khẩu
          const resetLink = `http://172.20.10.4:8000/resetpassword/${token}`;

          const mailOptions = {
            from: "DUY",
            to: email,
            subject: "Reset Password",
            // html: `<p>Click on the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset Email</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #ececec;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ececec;
                        border-radius: 10px;
                        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
                    }
                    .logo {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .logo img {
                        max-width: 100px;
                        height: auto;
                    }
                    .content {
                        text-align: center;
                        color: black;

                    }
                    .reset-link {
                        display: block;
                        margin-top: 20px;
                        color: #007bff;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="logo">
                    <img src="cid:logo" alt="Logo">
                    </div>
                    <div class="content">
                        <p>Click on the link below to reset your password:</p>
                        <a class="reset-link" href="${resetLink}">${resetLink}</a>
                    </div>
                </div>
            </body>
            </html>`,

            attachments: [
              {
                filename: "woowa_logo.png",
                path: "public/image/woowa_logo.png", // Đường dẫn tương đối đến hình ảnh
                cid: "logo", // Thay "logo" bằng cid tương ứng với hình ảnh
              },
            ],
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Error sending email:", error);
              return res.status(500).json({ message: "Lỗi khi gửi email" });
            }

            //   return res.status(200).json({ message: 'Vui lòng kiểm tra email để đặt lại mật khẩu' });
            return res.render("homepage", {
              resetpassmmessage: true,
              user: null,
            });
          });
        }
      );
    }
  );
});

// Trang reset mật khẩu
app.get("/resetpassword/:token", (req, res) => {
  const token = req.params.token;

  // Kiểm tra xem mã khôi phục có hợp lệ hay không
  connection.query(
    "SELECT * FROM reset_tokens WHERE token = ?",
    [token],
    (err, rows) => {
      if (err) {
        console.error("Error querying database:", err);
        return res
          .status(500)
          .json({ message: "Lỗi khi truy vấn cơ sở dữ liệu" });
      }

      if (rows.length === 0) {
        // Mã khôi phục không hợp lệ
        return res.status(400).json({ message: "Mã khôi phục không hợp lệ" });
      }

      const email = rows[0].email;
      res.render("resetpassword", { token, email });
    }
  );
});

// Xử lý yêu cầu reset mật khẩu
app.post("/resetpassword", (req, res) => {
  const token = req.body.token;
  const newPassword = req.body.password;

  // Kiểm tra xem mã khôi phục có hợp lệ hay không
  connection.query(
    "SELECT * FROM reset_tokens WHERE token = ?",
    [token],
    (err, rows) => {
      if (err) {
        console.error("Error querying database:", err);
        return res
          .status(500)
          .json({ message: "Lỗi khi truy vấn cơ sở dữ liệu" });
      }

      if (rows.length === 0) {
        // Mã khôi phục không hợp lệ
        return res.status(400).json({ message: "Mã khôi phục không hợp lệ" });
      }

      const email = rows[0].email;

      // Mã hóa mật khẩu mới trước khi lưu vào cơ sở dữ liệu
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res
            .status(500)
            .json({ message: "Lỗi khi mã hóa mật khẩu mới" });
        }

        // Cập nhật mật khẩu mới trong cơ sở dữ liệu cho người dùng
        connection.query(
          "UPDATE users SET password = ? WHERE email = ?",
          [hashedPassword, email],
          (err, result) => {
            if (err) {
              console.error("Error updating password:", err);
              return res
                .status(500)
                .json({ message: "Lỗi khi cập nhật mật khẩu mới" });
            }

            // Xóa mã khôi phục trong cơ sở dữ liệu sau khi đã sử dụng
            connection.query(
              "DELETE FROM reset_tokens WHERE token = ?",
              [token],
              (err, result) => {
                if (err) {
                  console.error("Error deleting reset token:", err);
                  return res
                    .status(500)
                    .json({ message: "Lỗi khi xóa mã khôi phục" });
                }

                //  res.redirect(`/?resetmessage=success`);
                return res.render("homepage", {
                  resetmessage: true,
                  user: null,
                });
              }
            );
          }
        );
      });
    }
  );
});

app.get("/profile", function (req, res) {
  const userId = req.session.userId;

  if (!userId) {
    return res.redirect("/login");
  }

  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching user" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = rows[0];
      const referralCodeCount = user.referral_code_count || 0;

      // Set user_level based on referral_code_count
      if (referralCodeCount >= 10 && referralCodeCount < 20) {
        user.user_level = "D";
      } else if (referralCodeCount >= 20 && referralCodeCount < 30) {
        user.user_level = "C";
      } else if (referralCodeCount >= 30 && referralCodeCount < 40) {
        user.user_level = "B";
      } else if (referralCodeCount >= 40 && referralCodeCount < 50) {
        user.user_level = "A";
      } else if (referralCodeCount >= 50) {
        user.user_level = "VIP";
      } else {
        user.user_level = null;
      }

      const qrCodeData = `http://172.20.10.4:8000/signup?inviteCode=${user.referral_code}`;
      const qrCodeImage = qr.imageSync(qrCodeData, { type: "png" });

      // Update user level in the database
      connection.query(
        "UPDATE users SET user_level = ? WHERE id = ?",
        [user.user_level, userId],
        (err, updateResult) => {
          if (err) {
            console.error("Error updating user level:", err);
          }

          // Get the profile image path from the user data, or set it to null if not available
          const profileImage = user.profile_image_path || null;

          // Pass the user information including profileImage to the template when rendering
          res.render("profile", {
            user: user,
            profileImage: profileImage,
            qrCodeImage: qrCodeImage,
            inviteCode: user.referral_code,
          });
        }
      );
    }
  );
});

app.get("/update-profile", function (req, res) {
  // Check if the user is logged in (user ID exists in the session)
  const userId = req.session.userId;

  if (!userId) {
    return res.redirect("/");
  }

  // Retrieve the user data from the database based on the user ID
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching user" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const profileImage = rows[0].profile_image_path || null;

      // Render the profile update form using the 'update-profile.ejs' template
      res.render("update-profile", {
        user: rows[0],
        profileImage: profileImage,
      });
    }
  );
});

app.post("/update-profile", upload.single("profileImage"), function (req, res) {
  // Check if the user is logged in (user ID exists in the session)
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect("/");
  }

  const { username, email, phonenumber, birthday, gender } = req.body;
  const profileImage = req.file;

  // Check if a new profile image was uploaded
  if (profileImage) {
    // Update the user's information in the database with the image file path
    const imagePath = path.join(__dirname, "uploads", profileImage.filename);

    // Move the uploaded image to the 'uploads' folder
    fs.rename(profileImage.path, imagePath, (err) => {
      if (err) {
        console.error("Error moving image to uploads folder:", err);
        return res
          .status(500)
          .json({ error: "Error moving image to uploads folder" });
      }

      // Update the user's information in the database with the image file path
      const query =
        "UPDATE users SET username = ?, email = ?, phonenumber = ?, birthday = ?, gender = ?, profile_image_path = ? WHERE id = ?";
      connection.query(
        query,
        [
          username,
          email,
          phonenumber,
          birthday,
          gender,
          profileImage.filename,
          userId,
        ],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Error updating profile" });
          }

          // Redirect the user back to the profile page after successful update
          res.redirect("/profile");
        }
      );
    });
  } else {
    // If no new image was uploaded, update the user's information without changing the profile_image_path
    const query =
      "UPDATE users SET username = ?, email = ?, phonenumber = ?, birthday = ? , gender = ? WHERE id = ?";
    connection.query(
      query,
      [username, email, phonenumber, birthday, gender, userId],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Error updating profile" });
        }

        // Redirect the user back to the profile page after successful update
        res.redirect("/profile");
      }
    );
  }
});

app.get("/change-password", function (req, res) {
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect("/");
  }

  res.render("change-password", { user: { id: userId } });
});

// Route to handle the password change form submission
// Route to handle the password change form submission

app.post("/changepassword", function (req, res) {
  // Check if the user is logged in (user ID exists in the session)
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect("/");
  }

  const { oldPassword, newPassword, confirmPassword } = req.body;

  // Check if the new password and confirm password match
  if (newPassword !== confirmPassword) {
    return res.render("change-password");
  }
  if (newPassword.length < 8) {
    return res.render("change-password");
  }

  // Fetch the user's information from the database
  connection.query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching user" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = rows[0];

      // Compare the old password provided with the one in the database
      bcrypt.compare(oldPassword, user.password, (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Error comparing passwords" });
        }

        if (!result) {
          return res.render("change-password", {
            errorMessage: "Old Password not correct ",
          });
        }

        // Hash the new password before storing it in the database
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
          if (err) {
            return res.status(500).json({ error: "Error hashing password" });
          }

          // Update the user's password in the database
          connection.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, userId],
            (err, result) => {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Error changing password" });
              }

              // Redirect the user back to the profile page after successful password change
              res.redirect("/profile");
            }
          );
        });
      });
    }
  );
});

app.get("/logout", (req, res) => {
  // Hủy bỏ phiên đăng nhập bằng cách xóa userId từ phiên
  req.session.hasReferenced = false;

  req.session.userId = null;

  // Xóa toàn bộ thông tin phiên và đăng xuất người dùng
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
    }

    // Chuyển hướng người dùng đến trang đăng nhập sau khi đăng xuất
    res.redirect("/");
  });
});




//Admin//
app.get("/admin/login", (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect("/");
  }

  res.render("admin_login"); // Render the admin login form
});

app.post("/admin/login", (req, res) => {
  const { phonenumberOrEmail, password } = req.body;

  let fieldToCheck;
  if (phonenumberOrEmail.includes("@")) {
    fieldToCheck = "email";
  } else {
    fieldToCheck = "phonenumber";
  }

  connection.query(
    `SELECT admins.*, users.password AS user_password 
    FROM admins
    JOIN users ON admins.user_id = users.id
    WHERE users.${fieldToCheck} = ?`,
    [phonenumberOrEmail],
    (err, rows) => {
      if (err) {
        return res.render("admin_login", {
          errorMessage: "Error fetching admin",
          user: null,
        });
      }

      if (rows.length === 0) {
        return res.render("admin_login", {
          errorMessage: "Wrong Email or PhoneNumber",
          user: null,
        });
      }

      const admin = rows[0];

      bcrypt.compare(password, admin.user_password, (error, result) => {
        if (error) {
          return res.render("admin_login", {
            errorMessage: "Error comparing passwords",
            user: null,
          });
        }
        if (!result) {
          return res.render("admin_login", {
            errorMessage: "Incorrect password",
            user: null,
          });
        }

        // Successful admin login, store adminId in session
        req.session.adminId = admin.id;
        req.session.adminUsername = admin.full_name;

        // Redirect the admin to the admin dashboard after successful login
        res.redirect("/admin/dashboard");
      });
    }
  );
});

app.get("/admin/dashboard", (req, res) => {
  if (!req.session.adminId) {
    return res.redirect("/admin/login");
  }
  const adminId = req.session.adminId;
  const adminUsername = req.session.adminUsername;


  // Fetch user data from the database
  connection.query("SELECT * FROM users", (err, users) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching user data" });
    }
    // Render the admin dashboard view and pass user data
    res.render("admin_dashboard", { users, adminUsername  });
  });
});
app.get('/admin/search', (req, res) => {
  const searchQuery = req.query.query;
  const sortBy = req.query.sort; // New line to get sorting parameter

  let searchSQL = `
    SELECT id, username, phonenumber, email, referral_code_count, ticket
    FROM users
    WHERE phonenumber LIKE ? OR email LIKE ? OR username LIKE ?
       OR referral_code_count = ? OR (ticket = ? OR ticket IS NULL)
  `;

  const query = '%' + searchQuery + '%';
  const ticketValue = searchQuery === 'yes' ? 'yes' : '';

  if (sortBy === 'referral_code_count') {
    searchSQL += ' ORDER BY referral_code_count ASC'; // Sort by referral_code_count
  }

  connection.query(
    searchSQL,
    [query, query, query, searchQuery, ticketValue],
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching search results' });
      }

      res.json({ users });
    }
  );
});


app.post('/admin/toggle-user-status/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log('Attempting to toggle status for user ID:', userId);

  // Fetch current user status from the database
  connection.query(
    'SELECT status FROM users WHERE id = ?',
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching user status' });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      console.log('User status fetched:', rows);

      const currentStatus = rows[0].status;
      const newStatus = currentStatus === 1 ? 0 : 1;

      // Update user status in the database
      const updateStatusSQL = 'UPDATE users SET status = ? WHERE id = ?';
      connection.query(updateStatusSQL, [newStatus, userId], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error updating user status' });
        }
        console.log(newStatus);

        // Redirect back to the admin dashboard after updating status
        res.json({ success: true });

      });
    }
  );
});
app.post('/admin/edit-user/:userId', (req, res) => {
  const userId = req.params.userId;
  const { username, email, phonenumber, codecount } = req.body;

  // Perform a database query to update the user's info
  const updateSQL = `
    UPDATE users
    SET username = ?, email = ?, phonenumber = ? , referral_code_count = ?
    WHERE id = ?
  `;

  connection.query(updateSQL, [username, email, phonenumber, codecount ,userId], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Error updating user info' });
    }

    res.json({ success: true });
  });
});

app.delete('/admin/delete-user/:userId', (req, res) => {
  const userId = req.params.userId;

  // Perform a database query to delete the user by userId
  const deleteSQL = `
    DELETE FROM users
    WHERE id = ?
  `;
  
  connection.query(deleteSQL, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Error deleting user' });
    }

    res.json({ success: true });
  });
});

//end-admin//


//Decrypted//
app.get('/Decrypted', (req, res) => {
  res.render('Decrypted', { decryptedContent: null });
});

app.post('/decrypted', (req, res) => {
  const encryptedData = req.body.encryptedData;
  const encryptionKey = req.body.encryptionKey;

  try {
      const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
      let decryptedContent = decipher.update(encryptedData, 'hex', 'utf-8');
      decryptedContent += decipher.final('utf-8');
      const decryptedJSON = JSON.parse(decryptedContent);

      const query = `
      SELECT users.email, users.username, users.ticket, tickets.area, tickets.seat_number
      FROM users
      INNER JOIN tickets ON users.id = tickets.user_id
      WHERE users.username = ? AND users.email = ? AND users.ticket = ? AND tickets.area = ? AND tickets.seat_number = ?
    `;        
    connection.query(query, [decryptedJSON.username, decryptedJSON.email, decryptedJSON.ticket, decryptedJSON.area, decryptedJSON.seat_number], (error, results) => {
      if (error) {
              res.render('Decrypted', { decryptedContent: 'Lỗi truy vấn cơ sở dữ liệu: ' + error.message });
          } else {
              if (results.length > 0) {
                  res.render('Decrypted', { decryptedContent, successMessage:'Nội dung đã giải mã khớp với dữ liệu trong cơ sở dữ liệu.' });
                  console.log(decryptedContent)
              } else {
                  res.render('Decrypted', { decryptedContent, errorMessage: 'Nội dung đã giải mã không khớp với dữ liệu trong cơ sở dữ liệu.' });
              }
          }
      });
  } catch (error) {
      res.render('Decrypted', { decryptedContent: 'Lỗi giải mã: ' + error.message });
  }
});


app.listen(port, () => {
  // console.log("listening on http://localhost:" + port);
  console.log("172.20.10.4:" + port);

});
