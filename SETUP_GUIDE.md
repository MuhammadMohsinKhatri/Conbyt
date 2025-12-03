# 🚀 Formspree & Mailchimp Setup Guide

## 📋 **Step 1: Create Accounts**

### **Formspree Account Setup:**
1. Go to [formspree.io](https://formspree.io)
2. Click "Sign Up" (Free tier available)
3. Create account with email/password
4. Verify your email
5. Create a new form:
   - Click "New Form"
   - Give it a name (e.g., "Contact Form")
   - You'll get a unique form ID like: `xrgjqjqj`

### **Mailchimp Account Setup:**
1. Go to [mailchimp.com](https://mailchimp.com)
2. Click "Sign Up Free"
3. Create account (Free tier: 2,000 subscribers, 10,000 emails/month)
4. Verify your email
5. Create an audience/list:
   - Go to Audience → All contacts
   - Click "Create Audience"
   - Name it (e.g., "Newsletter Subscribers")
   - Get your Audience ID from Audience → Settings → Audience name and defaults

---

## 🔧 **Step 2: Update Your Code**

### **For Contact Form (Formspree):**
Replace `YOUR_FORMSPREE_FORM_ID` in `src/components/ContactForm.jsx`:

```javascript
// Line 32 in ContactForm.jsx
const response = await fetch('https://formspree.io/f/YOUR_ACTUAL_FORM_ID', {
```

**Example:**
```javascript
const response = await fetch('https://formspree.io/f/xrgjqjqj', {
```

### **For Newsletter (Mailchimp):**
Replace the simulated subscription in `src/components/Footer.jsx` with real Mailchimp API:

```javascript
// Replace the handleSubscribe function in Footer.jsx
const handleSubscribe = async (e) => {
  e.preventDefault();
  setIsSubscribing(true);
  setSubscribeStatus(null);

  try {
    // Mailchimp API call
    const response = await fetch('https://us1.api.mailchimp.com/3.0/lists/YOUR_AUDIENCE_ID/members', {
      method: 'POST',
      headers: {
        'Authorization': 'apikey YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: email,
        status: 'subscribed'
      })
    });

    if (response.ok) {
      setSubscribeStatus('success');
      setEmail("");
    } else {
      setSubscribeStatus('error');
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    setSubscribeStatus('error');
  } finally {
    setIsSubscribing(false);
  }
};
```

---

## 🔑 **Step 3: Get Your API Keys**

### **Mailchimp API Key:**
1. Go to Account → Extras → API Keys
2. Click "Create A Key"
3. Copy the generated API key
4. Note your server prefix (e.g., `us1`, `us2`) from the API key

### **Mailchimp Audience ID:**
1. Go to Audience → Settings → Audience name and defaults
2. Copy the Audience ID (looks like: `abc123def4`)

---

## 🧪 **Step 4: Testing**

### **Test Contact Form:**
1. Start your development server: `npm run dev`
2. Go to your contact section
3. Fill out the form with test data
4. Submit the form
5. Check your Formspree dashboard for the submission
6. Check your email for the notification

### **Test Newsletter:**
1. Go to your footer section
2. Enter a test email address
3. Click "Subscribe"
4. Check your Mailchimp dashboard for the new subscriber
5. Check the email for confirmation (if double opt-in is enabled)

---

## 📧 **Step 5: Email Notifications**

### **Formspree Notifications:**
- Form submissions are automatically sent to your email
- You can customize notification settings in Formspree dashboard
- Free tier: 50 submissions per month

### **Mailchimp Notifications:**
- New subscribers are added to your audience
- You can send welcome emails automatically
- Free tier: 2,000 subscribers, 10,000 emails/month

---

## 🚨 **Important Notes:**

### **Security:**
- Never expose API keys in client-side code
- For production, use environment variables
- Consider using serverless functions for API calls

### **Environment Variables (Recommended):**
Create a `.env` file in your project root:

```env
VITE_FORMSPREE_FORM_ID=your_formspree_form_id
VITE_MAILCHIMP_API_KEY=your_mailchimp_api_key
VITE_MAILCHIMP_AUDIENCE_ID=your_audience_id
VITE_MAILCHIMP_SERVER_PREFIX=us1
```

Then update your code:

```javascript
// ContactForm.jsx
const response = await fetch(`https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_FORM_ID}`, {

// Footer.jsx
const response = await fetch(`https://${import.meta.env.VITE_MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${import.meta.env.VITE_MAILCHIMP_AUDIENCE_ID}/members`, {
  headers: {
    'Authorization': `apikey ${import.meta.env.VITE_MAILCHIMP_API_KEY}`,
    'Content-Type': 'application/json'
  },
```

### **Production Deployment:**
- Add `.env` to your `.gitignore` file
- Set environment variables in your hosting platform
- Test thoroughly before going live

---

## 🆘 **Troubleshooting:**

### **Contact Form Not Working:**
- Check browser console for errors
- Verify form ID is correct
- Check Formspree dashboard for submissions
- Ensure form fields match Formspree expectations

### **Newsletter Not Working:**
- Check browser console for errors
- Verify API key and audience ID
- Check Mailchimp dashboard for subscribers
- Ensure email format is valid

### **CORS Errors:**
- Formspree handles CORS automatically
- For Mailchimp, you might need a proxy or serverless function

---

## 📞 **Support:**

- **Formspree:** [help.formspree.io](https://help.formspree.io)
- **Mailchimp:** [mailchimp.com/help](https://mailchimp.com/help)
- **Your Code:** Check browser console and network tab for errors

---

## ✅ **Checklist:**

- [ ] Created Formspree account
- [ ] Created Mailchimp account
- [ ] Got form ID from Formspree
- [ ] Got API key from Mailchimp
- [ ] Got audience ID from Mailchimp
- [ ] Updated contact form code
- [ ] Updated newsletter code
- [ ] Tested contact form
- [ ] Tested newsletter subscription
- [ ] Set up environment variables (optional)
- [ ] Tested in production environment

**🎉 You're all set! Your forms should now be fully functional!** 