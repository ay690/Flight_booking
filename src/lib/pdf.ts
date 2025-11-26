import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const downloadPDF = async (element: HTMLElement, filename: string) => {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: null, 
  });
  
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });

  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
};