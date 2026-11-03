# Eastman Website

A modern, responsive corporate website developed for **Eastman**, showcasing the company's products, services, manufacturing capabilities, and business information. The project focuses on clean UI, responsive layouts, and optimized frontend performance. :contentReference[oaicite:0]{index=0}

## 🌐 Live Demo

👉 https://ravishridhar.github.io/eastman/

---

## ✨ Features

- Modern and responsive design
- Mobile-first layout
- Smooth scrolling and animations
- Product showcase sections
- Company profile
- Contact section
- SEO-friendly structure
- Fast loading performance
- Cross-browser compatibility
- Clean and maintainable code

---

## 🛠️ Built With

- Vite
- Lenis
- HTML5
- CSS3
- JavaScript (ES6)
- Tailwind / Custom CSS
- Custom/Google Fonts

---

## 📱 Responsive

The website is optimized for:

- Desktop
- Laptop
- Tablet
- Mobile

---


## 🎯 Objectives

- Professional corporate website
- Responsive UI
- Easy navigation
- Better user experience
- Clean frontend architecture

---

## 🌍 Browser Support

- Google Chrome
- Microsoft Edge
- Firefox
- Safari
- Opera

---

## 📈 Future Improvements

- Dark Mode
- Product Search
- CMS Integration
- Blog Section
- Multi-language Support
- Backend Contact Form
- Performance Optimization

---

## 👨‍💻 Author

**Ravi Shridhar**

- GitHub: https://github.com/RaviShridhar
- Portfolio: https://ravishridhar.github.io/
- LinkedIn: *https://in.linkedin.com/in/ravishridhar*

---

## 📄 License

This project is created for portfolio and educational purposes.

Feel free to fork and explore.

---

## ⭐ Support

If you like this project, don't forget to give it a **⭐ Star** on GitHub!

## PHP enquiry forms

The contact and distributor forms POST to `public/api/submit-form.php`. Both send
plain-text email containing every form field from `support@eaplworld.com` to
`marketing@eaplworld.com`. A valid visitor email is used as Reply-To.
No external form or email service is used.

Deploy with PHP 7.3+ (PHP 8.x recommended), writable PHP session storage, and a
working server mail transport configured to send for `support@eaplworld.com`.
The domain's mail authentication must allow the hosting server to send mail.
After `npm run build`, upload the contents of `dist` to the PHP-capable host;
Vite copies the handler to `dist/api/submit-form.php`. For a domain-root deploy,
use `VITE_BASE_PATH=/ npm run build`. GitHub Pages cannot execute PHP.

For local development, install PHP, then run `php -S 127.0.0.1:8000 -t public`
in a separate terminal alongside `npm run dev`. Vite proxies `/api` to PHP.
Vite alone cannot process submissions. Local email delivery also requires a
configured mail transport.

Verify both forms on the PHP host with test details and confirm receipt in the
marketing inbox. A successful response means the server accepted the message
for sending; inbox delivery must be checked separately. Failed submissions keep
entered details. The handler validates required fields, email, phone and partner
consent, rejects a honeypot field, and applies a 60-second session-based cooldown
after successful submissions. No enquiry details are saved in the session.

Both forms require a self-hosted image CAPTCHA. Enable PHP's **GD extension**
(with PNG support) as well as sessions. `api/captcha.php` generates a random
six-character PNG; only its hash and a five-minute expiry are stored in the
session, separately for each form. Each verification attempt consumes its code.
The frontend loads a fresh code after submission and provides a New code button.
Opening the same form in another tab replaces its previous code; refresh if needed.
CAPTCHA answers are never included in enquiry emails. Image CAPTCHA has no audio
alternative; the marketing email address is provided when the image cannot load.

On the PHP host, check correct, incorrect, empty, expired, refreshed and reused
codes on both forms. Only a valid current code may reach the mail function.
Verify that a code from one form cannot validate the other form, and that mail
failures retain the visitor's entered enquiry details while refreshing the code.
