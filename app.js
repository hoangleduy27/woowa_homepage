const QRCode = require('qrcode');
const mysql = require('mysql');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'da_1'
};

// Connect to the database
const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');

  // Fetch information from the database
  const query = 'SELECT * FROM users WHERE referral_code_count >= 10 AND ticket = "yes" LIMIT 1';
  connection.query(query, (err, rows) => {
    if (err) {
      console.error('Error fetching user information:', err);
      connection.end();
      return;
    }

    if (rows.length === 0) {
      console.error('No user found with referral_code_count >= 10 and ticket = "yes"');
      connection.end();
      return;
    }

    const user = rows[0];
    const text = `Username: ${user.username}\nEmail: ${user.email}\nPhone: ${user.phonenumber}\nReferral Code: ${user.referral_code}`;

    // Generate the QR code with the fetched information
    QRCode.toFile(
      'qrcode.png', // Output file path for the QR code image
      text, // Information to be encoded in the QR code
      {
        errorCorrectionLevel: 'H',
        type: '/image/png',
        quality: 1.0,
        margin: 1,
        color: {
          dark: '#000000', // QR code color (black)
          light: '#ffffff', // Background color (white)
        },
      },
      (err) => {
        if (err) {
          console.error('Error generating QR code:', err);
        } else {
          console.log('QR code generated successfully');
        }
        connection.end();
      }
    );
  });
});
