export const printElement = (element: HTMLElement, documentTitle: string) => {
  const printableContent = element.innerHTML;
  
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${documentTitle}</title>
          <link rel="stylesheet" href="/_next/static/css/app/layout.css">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              margin: 1.5rem;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            @page {
              size: auto;
              margin: 1.5cm 0;
            }
            .bg-background { background-color: hsl(0 0% 100%); }
            .bg-card { background-color: hsl(0 0% 100%); }
            .text-card-foreground { color: hsl(224 71% 4%); }
            .bg-primary { background-color: hsl(231 48% 48%); }
            .text-primary-foreground { color: hsl(0 0% 100%); }
            .text-muted-foreground { color: hsl(220 9% 45%); }
            .text-primary { color: hsl(231 48% 48%); }
            .border-primary { border-color: hsl(231 48% 48%); }
            .border-dashed { border-style: dashed; }
            .border-muted-foreground\/30 { border-color: hsla(220, 9%, 45%, 0.3); }
            .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
            .rounded-lg { border-radius: 0.5rem; }
            .overflow-hidden { overflow: hidden; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .p-4 { padding: 1rem; }
            .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
            .flex-grow { flex-grow: 1; }
            .justify-between { justify-content: space-between; }
            .items-center { align-items: center; }
            .font-bold { font-weight: 700; }
            .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
            .text-xs { font-size: 0.75rem; line-height: 1rem; }
            .mb-4 { margin-bottom: 1rem; }
            .gap-2 { gap: 0.5rem; }
            .gap-4 { gap: 1rem; }
            .grid { display: grid; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
            .text-right { text-align: right; }
            .text-2xl { font-size: 1.5rem; line-height: 2rem; }
            .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .font-medium { font-weight: 500; }
            .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
            .w-32 { width: 8rem; }
            .border-l { border-left-width: 1px; }
            .text-center { text-align: center; }
            .h-16 { height: 4rem; }
            .w-16 { width: 4rem; }
            .h-12 { height: 3rem; }
            .w-full { width: 100%; }
            .mt-1 { margin-top: 0.25rem; }
            .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
            .items-start { align-items: flex-start; }
            .mt-4 { margin-top: 1rem; }
            .pt-2 { padding-top: 0.5rem; }
            .border-t { border-top-width: 1px; }
            .w-24 { width: 6rem; }
            .p-2 { padding: 0.5rem; }
            .justify-center { justify-content: center; }
            .tracking-tighter { letter-spacing: -0.05em; }
            .mt-2 { margin-top: 0.5rem; }
            .bg-muted\/50 { background-color: hsla(220, 13%, 91%, 0.5); }
            svg {
                display: inline-block;
                width: 1em;
                height: 1em;
            }
            .h-5 { height: 1.25rem; }
            .w-5 { width: 1.25rem; }
            .h-12 { height: 3rem; }
          </style>
        </head>
        <body>
          ${printableContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    // Use a timeout to ensure all content and styles are loaded
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
  }
};
