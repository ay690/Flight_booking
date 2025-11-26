import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const FALLBACK_VARS: Record<string, string> = {
  background: '#ffffff',
  foreground: '#0a0a0a',
  card: '#ffffff',
  'card-foreground': '#0a0a0a',
  popover: '#ffffff',
  'popover-foreground': '#0a0a0a',
  primary: '#171717',
  'primary-foreground': '#fafafa',
  secondary: '#f5f5f5',
  'secondary-foreground': '#171717',
  muted: '#f5f5f5',
  'muted-foreground': '#6b7280',
  accent: '#f5f5f5',
  'accent-foreground': '#171717',
  destructive: '#ef4444',
  border: '#e5e7eb',
  input: '#e5e7eb',
  ring: '#a1a1aa',
  'chart-1': '#6d28d9',
  'chart-2': '#0ea5e9',
  'chart-3': '#1d4ed8',
  'chart-4': '#22c55e',
  'chart-5': '#eab308',
  sidebar: '#fafafa',
  'sidebar-foreground': '#0a0a0a',
  'sidebar-primary': '#171717',
  'sidebar-primary-foreground': '#fafafa',
  'sidebar-accent': '#f5f5f5',
  'sidebar-accent-foreground': '#171717',
  'sidebar-border': '#e5e7eb',
  'sidebar-ring': '#a1a1aa',
};

const applyFallbackThemeToElement = (el: HTMLElement) => {
  const originals = new Map<string, string>();
  Object.keys(FALLBACK_VARS).forEach((k) => {
    originals.set(k, el.style.getPropertyValue(`--${k}`));
    el.style.setProperty(`--${k}`, FALLBACK_VARS[k]);
  });
  return () => {
    originals.forEach((v, k) => {
      if (v) {
        el.style.setProperty(`--${k}`, v);
      } else {
        el.style.removeProperty(`--${k}`);
      }
    });
  };
};

export const downloadPDF = async (element: HTMLElement, filename: string) => {
  // Apply fallbacks to the live DOM on the root so variables resolve across the subtree
  const restoreLive = applyFallbackThemeToElement(document.documentElement);
  // Mark the element so we can target it in the cloned DOM
  element.setAttribute('data-capture-root', '');
  try {
    // Ensure web fonts are loaded before rendering (if supported by the browser)
    try {
      if (typeof (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts?.ready !== 'undefined') {
        const ready = (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts?.ready;
        if (ready) await ready;
      }
    } catch {}

    // Determine capture size explicitly to avoid zero-size/blank canvases
    const rect = element.getBoundingClientRect();
    const width = Math.max(element.scrollWidth, element.clientWidth, Math.ceil(rect.width));
    const height = Math.max(element.scrollHeight, element.clientHeight, Math.ceil(rect.height));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      foreignObjectRendering: false,
      backgroundColor: '#ffffff',
      width,
      height,
      onclone: (doc) => {
        // Ensure fallbacks are also present in the cloned tree used for rendering
        const root = doc.documentElement as HTMLElement;
        Object.keys(FALLBACK_VARS).forEach((k) => {
          root.style.setProperty(`--${k}`, FALLBACK_VARS[k]);
        });
        const body = doc.body as HTMLBodyElement;
        if (body) body.style.backgroundColor = '#ffffff';

        // Inject targeted overrides for common opacity utilities used in the UI
        // to force rgba fallbacks and avoid lab/oklch in computed styles
        const style = doc.createElement('style');
        style.setAttribute('data-html2canvas-fallbacks', '');
        style.textContent = `
          /* Universal safety net to avoid any oklab/oklch from theme */
          * { color: #0a0a0a !important; background-color: #ffffff !important; border-color: #e5e7eb !important; box-shadow: none !important; }
          svg, svg * { fill: #171717 !important; stroke: #171717 !important; }

          /* E-ticket and confirmation page */
          [class*="bg-primary/10"] { background-color: rgba(23, 23, 23, 0.10) !important; }
          [class*="bg-muted/50"] { background-color: rgba(245, 245, 245, 0.50) !important; }
          [class*="text-primary/80"] { color: rgba(23, 23, 23, 0.80) !important; }
          [class*="text-foreground/80"] { color: rgba(10, 10, 10, 0.80) !important; }

          [class*="border-muted-foreground/30"] { border-color: rgba(107, 114, 128, 0.30) !important; }

          /* General utility fallbacks commonly used in the capture */
          [class*="bg-background"] { background-color: #ffffff !important; }
          [class*="bg-card"] { background-color: #ffffff !important; }
          [class*="text-card-foreground"] { color: #0a0a0a !important; }
          [class*="text-foreground"] { color: #0a0a0a !important; }
          [class*="text-primary"] { color: #171717 !important; }
          [class*="text-muted-foreground"] { color: #6b7280 !important; }
          [class*="bg-popover"] { background-color: #ffffff !important; }
          [class*="text-popover-foreground"] { color: #0a0a0a !important; }
          [class*="border-foreground"] { border-color: #0a0a0a !important; }
          [class*="border-muted"] { border-color: #e5e7eb !important; }
        `;
        doc.head.appendChild(style);

        // Normalize computed colors to inline rgb values for every node in the capture tree
        try {
          const win = doc.defaultView as Window;
          const captureRoot = doc.querySelector('[data-capture-root]') as HTMLElement | null;
          if (win && captureRoot) {
            const cssProps: string[] = [
              'color',
              'background-color',
              'border-top-color',
              'border-right-color',
              'border-bottom-color',
              'border-left-color',
              'outline-color',
              'text-decoration-color',
              'box-shadow',
              'background-image',
              'filter',
              'border-image',
            ];

            const all = captureRoot.querySelectorAll<HTMLElement>('*');
            all.forEach((node) => {
              const cs = win.getComputedStyle(node);
              cssProps.forEach((prop) => {
                if (prop === 'background-image') {
                  node.style.setProperty('background-image', 'none');
                  return;
                }
                if (prop === 'filter' || prop === 'border-image') {
                  node.style.setProperty(prop, 'none');
                  return;
                }
                const val = cs.getPropertyValue(prop);
                if (val) node.style.setProperty(prop, val);
              });
              // Ensure shorthand background uses the flat color only
              const bg = cs.getPropertyValue('background-color');
              if (bg) node.style.setProperty('background', bg);
            });

            // Handle SVG-specific color attributes
            const svgs = captureRoot.querySelectorAll<SVGElement>('svg, svg *');
            svgs.forEach((el) => {
              const cs = win.getComputedStyle(el);
              const fill = cs.getPropertyValue('fill');
              const stroke = cs.getPropertyValue('stroke');
              if (fill && fill !== 'none') el.setAttribute('fill', fill);
              if (stroke && stroke !== 'none') el.setAttribute('stroke', stroke);
            });
          }
        } catch {}
      },
    });

    // Create an A4 PDF and scale the image to fit width, adding pages as needed
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgData = canvas.toDataURL('image/png');
    const imgWidthPx = canvas.width;
    const imgHeightPx = canvas.height;

    // Convert px to mm using 96 DPI -> 25.4 mm per inch
    const pxToMm = (px: number) => (px * 25.4) / 96;
    const imgWidthMm = pxToMm(imgWidthPx);
    const imgHeightMm = pxToMm(imgHeightPx);

    const scale = pageWidth / imgWidthMm;
    const renderWidth = pageWidth;
    const renderHeight = imgHeightMm * scale;

    let remaining = renderHeight;
    let position = 0;

    // If single page fits
    if (renderHeight <= pageHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, renderWidth, renderHeight);
    } else {
      // Multi-page: draw slices by shifting Y position
      // We reuse the same image, adjusting y each page; jsPDF will clip automatically
      // Start at top
      pdf.addImage(imgData, 'PNG', 0, position, renderWidth, renderHeight);
      remaining -= pageHeight;
      while (remaining > -pageHeight) {
        pdf.addPage();
        position = - (renderHeight - remaining);
        pdf.addImage(imgData, 'PNG', 0, position, renderWidth, renderHeight);
        remaining -= pageHeight;
      }
    }
    pdf.save(filename);
  } finally {
    element.removeAttribute('data-capture-root');
    restoreLive();
  }
};