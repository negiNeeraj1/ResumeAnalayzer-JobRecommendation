"""
PDF Parser Module
Handles extraction of text from PDF files with OCR support
"""

import fitz  # PyMuPDF
from PIL import Image
import io
import pytesseract


class PDFParser:
    """Parse PDF files and extract text content with OCR fallback"""
    
    def __init__(self):
        self.supported_formats = ['.pdf']
        self.ocr_enabled = True
        
        # Try to detect tesseract installation
        try:
            pytesseract.get_tesseract_version()
        except Exception as e:
            print(f"⚠️ Warning: Tesseract not found. OCR will be disabled. Error: {e}")
            self.ocr_enabled = False
    
    def extract_text_with_ocr(self, pdf_bytes):
        """
        Extract text from image-based PDF using OCR
        
        Args:
            pdf_bytes: Binary content of PDF file
            
        Returns:
            str: Extracted text using OCR
        """
        if not self.ocr_enabled:
            return ""
        
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            text = ""
            
            print("🔍 Using OCR to extract text from image-based PDF...")
            
            for page_num, page in enumerate(doc, start=1):
                print(f"  📄 Processing page {page_num}/{len(doc)} with OCR...")
                
                # Render page to image (higher resolution for better OCR)
                mat = fitz.Matrix(2.0, 2.0)  # 2x zoom for better quality
                pix = page.get_pixmap(matrix=mat)
                
                # Convert to PIL Image
                img_data = pix.tobytes("png")
                image = Image.open(io.BytesIO(img_data))
                
                # Perform OCR
                page_text = pytesseract.image_to_string(image, lang='eng')
                text += page_text
                
                # Add page separator
                if page_num < len(doc):
                    text += "\n\n--- Page Break ---\n\n"
                
                # Close image resources
                image.close()
                pix = None
            
            doc.close()
            print("✅ OCR extraction completed")
            
            return text.strip()
            
        except Exception as e:
            print(f"❌ OCR extraction failed: {str(e)}")
            return ""
    
    def extract_text(self, pdf_bytes):
        """
        Extract text from PDF bytes with automatic OCR fallback
        
        Args:
            pdf_bytes: Binary content of PDF file
            
        Returns:
            str: Extracted text from all pages
            
        Raises:
            Exception: If PDF extraction fails
        """
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            text = ""
            
            # Extract text from all pages
            for page_num, page in enumerate(doc, start=1):
                page_text = page.get_text()
                text += page_text
                
                # Optional: Add page separator
                if page_num < len(doc):
                    text += "\n\n--- Page Break ---\n\n"
            
            doc.close()
            
            # Check if we got sufficient text
            if len(text.strip()) < 10:
                print("⚠️ Insufficient text extracted, falling back to OCR...")
                text = self.extract_text_with_ocr(pdf_bytes)
            
            return text.strip()
            
        except Exception as e:
            raise Exception(f"PDF extraction failed: {str(e)}")
    
    def get_metadata(self, pdf_bytes):
        """
        Extract PDF metadata
        
        Args:
            pdf_bytes: Binary content of PDF file
            
        Returns:
            dict: Metadata information
        """
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            metadata = {
                'page_count': len(doc),
                'author': doc.metadata.get('author', ''),
                'title': doc.metadata.get('title', ''),
                'subject': doc.metadata.get('subject', ''),
                'keywords': doc.metadata.get('keywords', ''),
            }
            doc.close()
            return metadata
            
        except Exception as e:
            return {'error': str(e)}
    
    def validate_pdf(self, pdf_bytes):
        """
        Validate if file is a valid PDF
        
        Args:
            pdf_bytes: Binary content to validate
            
        Returns:
            tuple: (is_valid: bool, message: str)
        """
        if not pdf_bytes or len(pdf_bytes) == 0:
            return False, "Empty file"
        
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            
            if len(doc) == 0:
                return False, "PDF has no pages"
            
            # Try to extract text from first page
            first_page_text = doc[0].get_text()
            doc.close()
            
            # If we have text, it's a valid text-based PDF
            if len(first_page_text.strip()) >= 10:
                return True, "Valid text-based PDF"
            
            # If insufficient text but OCR is enabled, still accept it
            if self.ocr_enabled:
                return True, "Valid image-based PDF (will use OCR)"
            else:
                return False, "PDF appears to be image-based but OCR is not available"
            
        except Exception as e:
            return False, f"Invalid PDF: {str(e)}"

