// Utility to load html2pdf.js from CDN
export function loadHtml2PdfScript() {
  return new Promise((resolve, reject) => {
    if (document.getElementById('html2pdf-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'html2pdf-script';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => resolve(true);
    script.onerror = reject;
    document.body.appendChild(script);
  });
}
