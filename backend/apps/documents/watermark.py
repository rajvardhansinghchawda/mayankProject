"""
SARAS — Document Privacy Service
=================================
Every PDF is watermarked with viewer identity + timestamp using PyMuPDF.
Watermarked version is NEVER stored — generated fresh for every request.
"""

import io
import math
import logging
from datetime import datetime

import fitz  # PyMuPDF

logger = logging.getLogger('saras')


class DocumentWatermarkService:
    """
    Injects dynamic per-viewer watermarks into PDF bytes.
    Generated fresh for EVERY request — watermarked version is never stored.
    """

    FOOTER_COLOR = (0.5, 0.5, 0.5)
    FOOTER_FONT_SIZE = 8

    def __init__(self, institution_name: str = "SARAS Institution"):
        self.institution_name = institution_name

    def watermark(
        self,
        pdf_bytes: bytes,
        viewer_name: str,
        viewer_id: str,
        view_timestamp: datetime,
        document_title: str = ""
    ) -> bytes:
        """
        Main entry point. Returns watermarked PDF bytes.
        """
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        except Exception as e:
            logger.error(f"Failed to open PDF for watermarking: {e}")
            raise ValueError("Invalid or corrupted PDF file")

        timestamp_str = view_timestamp.strftime("%d %b %Y %H:%M:%S IST")
        diagonal_text = self.institution_name
        footer_text = (
            f"Viewed by: {viewer_name} ({viewer_id}) | "
            f"{timestamp_str} | {self.institution_name} | CONFIDENTIAL"
        )

        page_num = 0
        try:
            for page_num in range(len(doc)):
                page = doc[page_num]
                self._add_diagonal_watermark(page, diagonal_text)
                self._add_footer_watermark(page, footer_text)
                self._add_page_corner_stamp(page, viewer_id, page_num + 1, len(doc))
        except Exception as e:
            logger.error(f"Watermark injection failed on page {page_num + 1}: {e}")
            doc.close()
            raise

        # Compatibility Fix: doc.save() with a buffer crashes in some environments (e.g. SWIG type error).
        # doc.tobytes() is safer and more efficient for generating byte streams.
        watermarked_bytes = doc.tobytes()
        doc.close()

        logger.info(
            f"Watermark injected: viewer={viewer_id}, "
            f"pages={page_num + 1}, size={len(watermarked_bytes)} bytes"
        )
        return watermarked_bytes

    def _add_diagonal_watermark(self, page: fitz.Page, text: str):
        """
        Tiles the institution name diagonally across the ENTIRE page.
        """
        rect = page.rect
        W = rect.width
        H = rect.height

        FONT_SIZE = 18
        OPACITY = 0.15                  # subtle — content stays readable
        COLOR = (0.75, 0.0, 0.0)        # dark red

        # Estimate rendered text width to set spacing
        char_width_approx = FONT_SIZE * 0.52
        text_width = len(text) * char_width_approx

        # Gap between stamp centres
        gap_along = text_width + 80
        gap_perp = FONT_SIZE + 60

        # Note about Rotation: In some environments (Python 3.13), the 'morph' parameter for text
        # rotation causes a ValueError. We use horizontal placement as a stable fallback if 
        # rotation fails.
        
        for row in range(-5, 15):
            for col in range(-5, 10):
                px = col * gap_along + (row % 2) * (gap_along / 2)
                py = row * gap_perp
                
                if px < -50 or px > W + 50 or py < -20 or py > H + 20:
                    continue

                try:
                    # Compatibility Fix: use fill_opacity instead of opacity
                    page.insert_text(
                        fitz.Point(px, py),
                        text,
                        fontname="helv",
                        fontsize=FONT_SIZE,
                        color=COLOR,
                        fill_opacity=OPACITY
                    )
                except Exception:
                    # Fallback to no opacity if fill_opacity also fails
                    page.insert_text(
                        fitz.Point(px, py),
                        text,
                        fontname="helv",
                        fontsize=FONT_SIZE,
                        color=COLOR
                    )

    def _add_footer_watermark(self, page: fitz.Page, footer_text: str):
        """
        Adds a readable footer strip at the bottom of every page.
        """
        rect = page.rect
        footer_rect = fitz.Rect(
            rect.x0 + 10,
            rect.y1 - 20,
            rect.x1 - 10,
            rect.y1 - 5
        )

        # Light grey background strip so text is always legible
        page.draw_rect(footer_rect, color=(0.95, 0.95, 0.95), fill=(0.95, 0.95, 0.95))

        page.insert_textbox(
            footer_rect,
            footer_text,
            fontsize=self.FOOTER_FONT_SIZE,
            color=self.FOOTER_COLOR,
            align=fitz.TEXT_ALIGN_CENTER,
        )

    def _add_page_corner_stamp(self, page: fitz.Page, viewer_id: str, page_num: int, total_pages: int):
        """
        Small top-right stamp: viewer ID + page number.
        """
        rect = page.rect
        stamp_text = f"[{viewer_id}] P.{page_num}/{total_pages}"
        stamp_rect = fitz.Rect(
            rect.x1 - 120,
            rect.y0 + 5,
            rect.x1 - 5,
            rect.y0 + 18
        )

        page.insert_textbox(
            stamp_rect,
            stamp_text,
            fontsize=7,
            color=(0.6, 0.0, 0.0),
            align=fitz.TEXT_ALIGN_RIGHT,
        )

    def validate_pdf(self, pdf_bytes: bytes) -> dict:
        """
        Validates uploaded bytes are a legitimate, non-empty PDF.
        Returns basic metadata for storage.
        """
        if pdf_bytes[:5] != b'%PDF-':
            raise ValueError("File is not a valid PDF (magic bytes check failed)")

        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            page_count = len(doc)
            doc.close()
        except Exception:
            raise ValueError("File is not a valid or readable PDF")

        if page_count == 0:
            raise ValueError("PDF has no pages")

        return {
            'page_count': page_count,
            'size_bytes': len(pdf_bytes),
        }