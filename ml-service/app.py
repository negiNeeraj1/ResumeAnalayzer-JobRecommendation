"""
Resume Analyzer ML Service
Main Flask application for resume parsing and analysis
"""

from flask import Flask, request, jsonify
from flask_cors import CORS

# Import our custom modules
from parsers import PDFParser
from extractors import InformationExtractor

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Initialize parser and extractor
pdf_parser = PDFParser()
info_extractor = InformationExtractor()


@app.route('/', methods=['GET'])
def home():
    """Home endpoint - API information"""
    return jsonify({
        "service": "Resume Analyzer ML Service",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "parse_resume": "/parse-resume (POST)",
        }
    })


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "ML Service",
        "modules": {
            "pdf_parser": "active",
            "info_extractor": "active"
        }
    })


@app.route('/parse-resume', methods=['POST'])
def parse_resume():
    """
    Main endpoint: Parse resume and extract information
    
    Request:
        - file: PDF file (multipart/form-data)
    
    Response:
        - success: bool
        - data: dict with extracted information
        - message: str
    """
    
    print(f"🔍 Parse Resume Request - Files: {list(request.files.keys())}")
    
    # Validate request
    if 'file' not in request.files:
        print("❌ No file in request")
        return jsonify({
            'success': False,
            'error': 'No file provided'
        }), 400
    
    file = request.files['file']
    print(f"📄 File received: {file.filename}, size: {file.content_length}")
    
    # Check if file is empty
    if file.filename == '':
        print("❌ Empty filename")
        return jsonify({
            'success': False,
            'error': 'Empty filename'
        }), 400
    
    # Check file extension
    if not file.filename.lower().endswith('.pdf'):
        print(f"❌ Invalid file type: {file.filename}")
        return jsonify({
            'success': False,
            'error': f'Only PDF files are supported. Received: {file.filename}'
        }), 400
    
    try:
        # Read PDF bytes
        pdf_bytes = file.read()
        print(f"📊 PDF bytes read: {len(pdf_bytes)} bytes")
        
        # Validate PDF
        print("🔍 Validating PDF...")
        is_valid, validation_message = pdf_parser.validate_pdf(pdf_bytes)
        if not is_valid:
            print(f"❌ PDF validation failed: {validation_message}")
            return jsonify({
                'success': False,
                'error': f'PDF validation failed: {validation_message}'
            }), 400
        
        print("✅ PDF validation passed")
        
        # Extract text from PDF
        print("📝 Extracting text from PDF...")
        full_text = pdf_parser.extract_text(pdf_bytes)
        print(f"📄 Extracted text length: {len(full_text)} characters")
        
        # Extract structured information
        extracted_info = info_extractor.extract_all(full_text)
        
        # Prepare response with all extracted data
        response_data = {
            'raw_text': full_text[:2000],  # First 2000 chars for preview
            'full_text': full_text,  # Complete text
            'text_length': len(full_text),
            'word_count': len(full_text.split()),
            
            # Personal Information
            'name': extracted_info['name'],
            'email': extracted_info['email'],
            'phone': extracted_info['phone'],
            'location': extracted_info['location'],
            
            # Skills
            'skills': extracted_info['skills'],
            'total_skills': len(extracted_info['skills']),
            
            # Education
            'education': extracted_info['education'],
            
            # Experience
            'experience': extracted_info['experience'],
            'years_of_experience': extracted_info['years_of_experience'],
            
            # Certifications
            'certifications': extracted_info['certifications'],
            
            # URLs/Links
            'urls': extracted_info['urls'],
        }
        
        return jsonify({
            'success': True,
            'data': response_data,
            'message': 'Resume parsed successfully'
        }), 200
        
    except Exception as e:
        error_msg = f"Error parsing resume: {str(e)}"
        print(f"❌ {error_msg}")
        app.logger.error(error_msg)
        return jsonify({
            'success': False,
            'error': f'Failed to parse resume: {str(e)}'
        }), 500


@app.route('/extract-skills', methods=['POST'])
def extract_skills_only():
    """
    Extract only skills from text
    
    Request:
        - text: Resume text content (JSON)
    
    Response:
        - skills: list of found skills
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                'success': False,
                'error': 'No text provided'
            }), 400
        
        text = data['text']
        skills = info_extractor.extract_skills(text)
        
        return jsonify({
            'success': True,
            'skills': skills,
            'count': len(skills)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/validate-pdf', methods=['POST'])
def validate_pdf_endpoint():
    """
    Validate if uploaded file is a valid PDF
    
    Request:
        - file: PDF file (multipart/form-data)
    
    Response:
        - valid: bool
        - message: str
    """
    if 'file' not in request.files:
        return jsonify({
            'valid': False,
            'message': 'No file provided'
        }), 400
    
    file = request.files['file']
    pdf_bytes = file.read()
    
    is_valid, message = pdf_parser.validate_pdf(pdf_bytes)
    
    return jsonify({
        'valid': is_valid,
        'message': message
    }), 200 if is_valid else 400


# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


# Run application
if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Resume Analyzer ML Service Starting...")
    print("=" * 60)
    print("📍 Home:         http://localhost:5000/")
    print("📍 Health Check: http://localhost:5000/health")
    print("📄 Parse Resume: http://localhost:5000/parse-resume (POST)")
    print("🏷️  Extract Skills: http://localhost:5000/extract-skills (POST)")
    print("✅ Validate PDF: http://localhost:5000/validate-pdf (POST)")
    print("=" * 60)
    print("✨ Modules loaded: PDFParser, InformationExtractor")
    print("=" * 60)
    
    app.run(
        debug=True,
        port=5000,
        host='0.0.0.0'
    )
