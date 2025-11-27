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

/**
 * Downloads the given HTML element as a PDF file
 * @param element The HTML element to convert to PDF
 * @param filename The name of the output PDF file
 */
export const downloadPDF = async (element: HTMLElement, filename: string) => {
  // Create container and clone outside the try block for finally
  const container = document.createElement('div');
  let restoreLive: (() => void) | null = null;
  
  try {
    console.log('Starting PDF generation for:', filename);
    
    // Set up container styles
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.zIndex = '9999';
    container.style.visibility = 'hidden';
    container.style.pointerEvents = 'none';
    
    // Clone the element
    const elementClone = element.cloneNode(true) as HTMLElement;
    container.appendChild(elementClone);
    document.body.appendChild(container);
    
    // Force layout and styles to be applied
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Get dimensions
    const rect = elementClone.getBoundingClientRect();
    const width = Math.max(rect.width, 1);
    const height = Math.max(rect.height, 1);
    
    console.log('Element dimensions:', { width, height });

    // Create canvas
    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;
    
    // Set white background
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply fallback styles
    restoreLive = applyFallbackThemeToElement(document.documentElement);

    // Define print styles
    const printStyles = `
      * { 
        -webkit-print-color-adjust: exact !important; 
        color-adjust: exact !important;
        box-sizing: border-box;
      }
      body, html { 
        margin: 0 !important; 
        padding: 0 !important;
        width: 100% !important;
        height: auto !important;
        background: white !important;
      }
      ${elementClone.tagName.toLowerCase()} {
        width: 100% !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    `;

    // Render to canvas
    console.log('Starting html2canvas rendering...');
    const canvasFromElement = await html2canvas(elementClone, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true,
      removeContainer: false,
      onclone: (clonedDoc, clonedElement) => {
        // Ensure the element is visible for rendering
        clonedElement.style.visibility = 'visible';
        clonedElement.style.opacity = '1';
        
        // Add print styles
        const style = document.createElement('style');
        style.textContent = printStyles;
        clonedDoc.head.appendChild(style);
      },
    });

    console.log('html2canvas rendering complete');

    // Create PDF
    const pdf = new jsPDF({
      orientation: width > height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Convert canvas to image
    const imgData = canvasFromElement.toDataURL('image/png');
    
    // Calculate aspect ratio
    const imgAspectRatio = canvasFromElement.width / canvasFromElement.height;
    let imgWidth = pageWidth - 20; // 10mm margin on each side
    let imgHeight = imgWidth / imgAspectRatio;
    
    // If the image is too tall for one page, scale it down
    if (imgHeight > pageHeight - 20) {
      imgHeight = pageHeight - 20;
      imgWidth = imgHeight * imgAspectRatio;
    }
    
    // Center the image on the page
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;
    
    console.log('Adding image to PDF...');
    pdf.addImage(
      imgData,
      'PNG',
      x,
      y,
      imgWidth,
      imgHeight
    );

    console.log('Saving PDF...');
    pdf.save(filename);
    console.log('PDF saved successfully');
    
    return true;
  } catch (error) {
    console.error('Error in downloadPDF:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    // Clean up container if it exists in the DOM
    if (container && container.parentNode) {
      document.body.removeChild(container);
    }
    // Restore original styles if they were modified
    if (restoreLive) {
      restoreLive();
    }
  }
};