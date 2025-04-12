const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const EMAILJS_SERVICE_ID = 'service_cax0c6e';
const EMAILJS_TEMPLATE_ID = 'template_ml6p7zu';
const EMAILJS_PUBLIC_KEY = 'ILBZr43VWmZLzAO6k';

// Add /ping endpoint for UptimeRobot
app.get('/ping', (req, res) => {
  console.log('Received GET request to /ping');
  res.status(200).send('OK');
});

app.post('/send-email', async (req, res) => {
  console.log('Received POST request to /send-email');
  const { name, email, message } = req.body;

  const emailData = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: {
      from_name: name,
      from_email: email,
      message: message
    }
  };

  console.log('Request payload:', JSON.stringify(emailData, null, 2));
  try {
    console.log('Sending request to EmailJS...');
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost',  // Fake browser origin
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      body: JSON.stringify(emailData)
    });

    console.log('EmailJS status:', response.status);
    if (response.ok) {
      console.log('EmailJS response OK');
      res.status(200).json({ message: 'Email sent successfully' });
    } else {
      const errorText = await response.text();
      console.log('EmailJS response failed with status:', response.status, 'Details:', errorText);
      res.status(500).json({ error: 'Failed to send email', details: errorText });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;