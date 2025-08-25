# EmailJS Setup Instructions

This application uses EmailJS to send order forms via email. Follow these steps to set up your own EmailJS configuration:

## Setting Up EmailJS

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Add an Email Service:
   - Navigate to the "Email Services" section
   - Click "Add New Service" and select your email provider (e.g., Gmail)
   - Follow the prompts to connect your email account

3. Create an Email Template:
   - Go to the "Email Templates" section
   - Click "Create New Template" and design your email layout
   - Use the following variables in your template:
     - `{{product_name}}` - The name of the product being ordered
     - `{{size}}` - The size/details of the product
     - `{{price}}` - The price of the product
     - `{{customer_name}}` - The name of the customer
     - `{{phone_number}}` - The customer's phone number
     - `{{email}}` - The customer's email (optional)
     - `{{notes}}` - Any special instructions or notes
     - `{{order_date}}` - The date and time when the order was placed
     - `{{order_for_formatted}}` - The requested delivery/pickup date

4. Get Your Credentials:
   - Service ID: Found in the "Email Services" section
   - Template ID: Found in the "Email Templates" section
   - Public Key: Found in the "Account" section

## Configuring the Application

### Option 1: Environment Variables (Recommended for Production)

1. Create a `.env.local` file in the root directory of the project
2. Add the following variables:
   ```
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```
3. Replace the values with your own EmailJS credentials
4. Restart your development server

### Option 2: Direct Configuration (Quick Setup for Development)

1. Open `src/config/email-config.ts`
2. Replace the default values with your own EmailJS credentials:
   ```typescript
   export const emailJSConfig: EmailJSConfig = {
     serviceId: 'your_service_id',
     templateId: 'your_template_id',
     publicKey: 'your_public_key',
   };
   ```
3. Restart your development server

## Security Notes

- The public key is safe to use in client-side code
- Never include your EmailJS private key in the client-side code
- For production, always use environment variables
