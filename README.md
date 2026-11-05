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

## Enquiry forms and Salesforce

Both forms use the original site's Salesforce Web-to-Lead organisation and field
IDs, stored in `public/api/salesforce-config.json`. The contact form uses B2C and
the distributor form uses B2B, with lead source Website and country IN. State
names are translated to the original Salesforce state codes. All original form
fields are mapped; the added partnership consent is saved in Lead Description.

Submission flow:
1. The browser POSTs to `api/submit-form.php` for field and CAPTCHA validation.
2. PHP returns the mapped Salesforce fields after validation and a 60-second
   session cooldown. This response does not confirm lead creation.
3. JavaScript submits a normal browser POST to Salesforce, matching the original
   site. Salesforce redirects to `https://eaplworld.com/` after processing.

The website no longer calls PHP mail(). Email recipients, sender addresses and
notifications must be configured within Salesforce. The earlier website-level
BCC to ravishridhar1@gmail.com is not a Salesforce Web-to-Lead setting; ask the
Salesforce administrator to add this recipient to an appropriate notification.
A redirect is not proof of lead creation or email delivery. Validate one contact
and one partner submission by checking the new leads and notification rules in
Salesforce. Check whether any Salesforce validation or reCAPTCHA requirements
have changed since the original forms were generated.

Deploy using PHP 7.3+ (PHP 8.x recommended), writable PHP session storage, and GD
with PNG support. Run `npm run build:plesk` for the live domain root, or
`npm run build:test` for `/web/new-site-test/`, and upload the contents of `dist`.
The build includes `api`, `favicon.ico`, and `.htaccess` with a custom 404 rule.
Merge `.htaccess` rules if the host already has required configuration.

For local development, install PHP with GD and run
`php -S 127.0.0.1:8000 -t public` alongside `npm run dev`. Vite proxies `/api` to
PHP. GitHub Pages cannot execute the local validation or CAPTCHA handlers.

CAPTCHA challenges are six-character PNGs with unique IDs and five-minute
expiry. The EAPL_FORMS_SESSION session stores a hash and the PNG for up to ten
current challenges, so different tabs do not replace one another's codes. Each
verification attempt consumes its challenge. Refresh generates a new ID, and
submission is blocked until the image loads. CAPTCHA and honeypot values are
never forwarded to Salesforce. No enquiry details are stored in the session.
The image CAPTCHA has no audio alternative.

Before deployment, verify field validation, invalid/expired/reused CAPTCHA,
separate browser tabs, and the Salesforce field mappings. On the live host,
confirm both actual lead records with the Salesforce administrator, including
state, products and distributor fields; confirm the desired email recipients
separately. Tests must not create real leads without explicit authorization.
