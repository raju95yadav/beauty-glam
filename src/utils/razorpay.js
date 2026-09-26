/**
 * Dynamically loads Razorpay checkout.js script into the DOM.
 * Guarantees single-instance injection and resolves when script is loaded.
 * 
 * @returns {Promise<boolean>} resolves to true if script is loaded, false otherwise
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // If Razorpay is already attached to window
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const scriptSrc = 'https://checkout.razorpay.com/v1/checkout.js';
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      console.error('Failed to load Razorpay checkout SDK script');
      resolve(false);
    };

    document.body.appendChild(script);
  });
};
