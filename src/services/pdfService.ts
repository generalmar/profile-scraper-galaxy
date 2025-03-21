
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source (required for PDF.js)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extracts text content from a PDF file
 * @param file PDF file to extract text from
 * @returns Promise that resolves to the extracted text
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF file
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // Array to store text from each page
    const textContent: string[] = [];
    
    // Process each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      // Extract text items and join them
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ');
      
      textContent.push(pageText);
    }
    
    // Join all pages with newlines
    return textContent.join('\n');
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};
