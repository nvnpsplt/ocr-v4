// Load PDF.js from CDN
const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.min.mjs');

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.mjs';

export const convertPDFToImage = async (file) => {
  try {
    // Read the PDF file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    // Get the first page only
    const page = await pdf.getPage(1);
    
    // Set scale for better quality
    const scale = 2.0;
    const viewport = page.getViewport({ scale });
    
    // Prepare canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Render PDF page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
    
    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob], 'page1.png', { type: 'image/png' }));
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    throw new Error('Failed to convert PDF to image');
  }
};
