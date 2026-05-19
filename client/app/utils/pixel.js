const safe = (...args) => { if (typeof window !== 'undefined' && window.fbq) window.fbq(...args); };

export const initPixel = (pixelId) => {
  if (!pixelId || typeof window === 'undefined') return;
  if (window._pixelInitialized === pixelId) return;
  window._pixelInitialized = pixelId;
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
};

export const trackPageView = () => safe('track', 'PageView');

export const trackViewContent = (product) => safe('track', 'ViewContent', {
  content_ids: [String(product._id)],
  content_name: product.name,
  content_type: 'product',
  value: product.price,
  currency: 'PKR'
});

export const trackAddToCart = (product, qty = 1) => safe('track', 'AddToCart', {
  content_ids: [String(product._id)],
  content_name: product.name,
  content_type: 'product',
  value: product.price * qty,
  currency: 'PKR'
});

export const trackPurchase = (order) => safe('track', 'Purchase', {
  value: order.total || 0,
  currency: 'PKR',
  content_ids: (order.products || []).map(p => String(p._id)),
  content_type: 'product'
});
