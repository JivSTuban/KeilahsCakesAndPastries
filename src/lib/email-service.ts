"use client";

import emailjs from "@emailjs/browser";

// EmailJS configuration
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string;

// Ensure env vars exist at build-time (inlined by Next.js)
const ensureEmailEnv = () => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error("Missing EmailJS env vars. Define NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, NEXT_PUBLIC_EMAILJS_PUBLIC_KEY.");
  }
};

// Initialize EmailJS with public key
export const initEmailService = () => {
  if (typeof window !== 'undefined') {
    ensureEmailEnv();
    emailjs.init(PUBLIC_KEY);
  }
};

// Send email using EmailJS
export const sendOrderEmail = async (form: HTMLFormElement) => {
  try {
    ensureEmailEnv();
    
    // Add current order date to the form data
    const orderDateInput = document.createElement('input');
    orderDateInput.type = 'hidden';
    orderDateInput.name = 'order_date';
    orderDateInput.value = new Date().toLocaleString('en-PH', { 
      dateStyle: 'full', 
      timeStyle: 'short' 
    });
    form.appendChild(orderDateInput);
    
    // Format the "Order For" date for display in the email
    const orderForDateField = form.elements.namedItem('order_for_date') as HTMLInputElement;
    if (orderForDateField && orderForDateField.value) {
      const orderForDate = new Date(orderForDateField.value);
      const formattedOrderForDate = orderForDate.toLocaleString('en-PH', {
        dateStyle: 'full'
      });
      
      // Add formatted "Order For" date
      const orderForInput = document.createElement('input');
      orderForInput.type = 'hidden';
      orderForInput.name = 'order_for_formatted';
      orderForInput.value = formattedOrderForDate;
      form.appendChild(orderForInput);
    }
    
    const result = await emailjs.sendForm(
      SERVICE_ID,
      TEMPLATE_ID,
      form,
      PUBLIC_KEY
    );
    
    // Remove the hidden inputs after sending
    form.removeChild(orderDateInput);
    
    // Remove order for formatted date input if it exists
    const orderForInput = form.querySelector('input[name="order_for_formatted"]');
    if (orderForInput) {
      form.removeChild(orderForInput);
    }
    
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
