import sys
import os
import fitz
from datetime import datetime

# Add the current directory to path so we can import apps
sys.path.append(os.getcwd())

from apps.documents.watermark import DocumentWatermarkService

def test_watermark():
    try:
        print("Starting test...")
        service = DocumentWatermarkService("SARAS TEST UNIVERSITY")
        
        # Create a blank PDF
        print("Creating blank PDF...")
        doc = fitz.open()
        page = doc.new_page()
        page.insert_text((100, 100), "ORIGINAL CONTENT - PAGE 1", fontsize=20)
        pdf_bytes = doc.tobytes()
        doc.close()
        
        print(f"Original PDF size: {len(pdf_bytes)} bytes")
        
        # Apply watermark
        print("Applying watermark...")
        watermarked_bytes = service.watermark(
            pdf_bytes=pdf_bytes,
            viewer_name="Mister Admin",
            viewer_id="ADM-001",
            view_timestamp=datetime.now()
        )
        print("Watermark applied successfully!")
        
        output_path = "watermark_premium_verification.pdf"
        with open(output_path, "wb") as f:
            f.write(watermarked_bytes)
        
        print(f"Watermarked PDF size: {len(watermarked_bytes)} bytes")
        print(f"Generated {output_path}")
        
    except Exception as e:
        print(f"TEST FAILED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_watermark()
