// Load environment variables from .env file
require('dotenv').config();

const express  = require('express');
const nodemailer = require('nodemailer');
const { marked } = require('marked');
const fs       = require('fs');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ──────────────────────────────────────────────
// Lets Express read JSON sent from your contact form
app.use(express.json());

// Serves everything in /public automatically —
// index.html, style.css, script.js, blog pages, photos
app.use(express.static(path.join(__dirname, 'public')));


// ── ROUTE 1: BLOG ───────────────────────────────────────────
// When someone visits /blog/year1, this reads posts/year1.md
// converts it to HTML, and sends it back
app.get('/blog/:year', function (req, res) {
  const year     = req.params.year;                          // e.g. "year1"
  const filePath = path.join(__dirname, 'posts', year + '.md');

  // Check the file actually exists before trying to read it
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Post not found');
  }

  const markdown = fs.readFileSync(filePath, 'utf-8');
  const html     = marked(markdown);                         // converts md → html

  // Send back a full HTML page with your blog styling
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${year} — Chapters</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/blog/blog.css" />
    </head>
    <body>
      <nav class="navbar">
        <a href="/" class="nav-logo">Chapters ✦</a>
        <div class="nav-links">
          <a href="/#timeline" class="nav-link">timeline</a>
          <a href="/#gallery"  class="nav-link">gallery</a>
          <a href="/#blog"     class="nav-link active">blog</a>
          <a href="/#connect"  class="nav-link">connect</a>
        </div>
      </nav>
      <article class="blog-body">
        ${html}
      </article>
      <footer class="blog-footer">
        <a href="/">← Back to Chapters</a>
        <span>Naman Kaur · 2025</span>
      </footer>
    </body>
    </html>
  `);
});


// ── ROUTE 2: CONTACT FORM ───────────────────────────────────
// When your contact form submits, this receives the data,
// validates it, and sends you an email
app.post('/contact', async function (req, res) {
  const { name, email, message } = req.body;

  // Basic validation — reject empty fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email.' });
  }

  // Set up the email sender using your .env credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from:    process.env.EMAIL_USER,
      to:      process.env.EMAIL_USER,   // sends to yourself
      subject: `Chapters — message from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    res.status(200).json({ success: 'Message sent! I will get back to you soon.' });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});


// ── START THE SERVER ────────────────────────────────────────
app.listen(PORT, function () {
  console.log('Chapters is running at http://localhost:' + PORT);
});