"""
SARAS — Document Privacy Service
=================================
This is the privacy core of the entire system.

Every PDF is:
1. Retrieved as raw bytes from PostgreSQL (never from filesystem)
2. Watermarked with viewer identity + timestamp using PyMuPDF
3. Streamed to client with no-store headers
4. Never cached, never saved

The watermark contains:
- Viewer's full name + ID (roll number / employee ID)
- Exact timestamp of this specific view
- Institution name

This means every screenshot or phone photo taken of the document
contains forensic evidence of WHO took it and WHEN.

Inspired by Snapchat Web's content protection philosophy:
deterrence + detection, not absolute prevention.
"""

import io
import logging
from datetime import datetime

import fitz  # PyMuPDF

logger = logging.getLogger('saras')


class DocumentWatermarkService:
    """
    Injects dynamic per-viewer watermarks into PDF bytes.
    Generated fresh for EVERY request — watermarked version is never stored.
    """

    # Watermark visual configuration
    DIAGONAL_OPACITY = 0.15          # Low enough to read content, high enough to be visible
    FOOTER_OPACITY = 0.6             # Footer is more prominent
    DIAGONAL_COLOR = (0.7, 0.0, 0.0)  # Dark red diagonal overlay
    FOOTER_COLOR = (0.5, 0.5, 0.5)   # Grey footer text
    DIAGONAL_FONT_SIZE = 14
    FOOTER_FONT_SIZE = 8
    DIAGONAL_REPEATS = 6             # How many diagonal stamps per page

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

        Args:
            pdf_bytes: Original clean PDF bytes from PostgreSQL
            viewer_name: Viewer's full name
            viewer_id: Roll number or employee ID
            view_timestamp: Exact datetime of this view request
            document_title: Document title (optional, used in footer)

        Returns:
            Watermarked PDF bytes (never stored — consumed immediately)
        """
        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        except Exception as e:
            logger.error(f"Failed to open PDF for watermarking: {e}")
            raise ValueError("Invalid or corrupted PDF file")

        # Build watermark strings
        timestamp_str = view_timestamp.strftime("%d %b %Y %H:%M:%S IST")
        diagonal_text = f"{viewer_name} | {viewer_id}"
        footer_text = (
            f"Viewed by: {viewer_name} ({viewer_id}) | "
            f"{timestamp_str} | {self.institution_name} | CONFIDENTIAL"
        )

        try:
            for page_num in range(len(doc)):
                page = doc[page_num]
                self._add_diagonal_watermark(page, diagonal_text)
                self._add_footer_watermark(page, footer_text)
                self._add_page_corner_stamp(page, viewer_id, page_num + 1, len(doc))

        except Exception as e:
            logger.error(f"Watermark injection failed on page: {e}")
            doc.close()
            raise

        # Write to buffer — do NOT save to disk
        output_buffer = io.BytesIO()
        doc.save(output_buffer, garbage=4, deflate=True)
        doc.close()

        watermarked_bytes = output_buffer.getvalue()
        logger.info(
            f"Watermark injected: viewer={viewer_id}, "
            f"pages={page_num + 1}, "
            f"size={len(watermarked_bytes)} bytes"
        )
        return watermarked_bytes

    def _add_diagonal_watermark(self, page: fitz.Page, text: str):
        """
        Adds repeating diagonal text stamps across the page.
        Positioned in a grid so every screenshot will contain at least one stamp.
        """
        rect = page.rect
        page_width = rect.width
        page_height = rect.height

        # Create diagonal stamps in a grid pattern
        step_x = page_width / 3
        step_y = page_height / (self.DIAGONAL_REPEATS // 2 + 1)

        for row in range(self.DIAGONAL_REPEATS // 2 + 1):
            for col in range(3):
                x = step_x * col + step_x * 0.3
                y = step_y * row + step_y * 0.5

                # Clamp to page bounds
                x = max(50, min(x, page_width - 100))
                y = max(20, min(y, page_height - 20))

                # Use PyMuPDF text writer for proper opacity support
                writer = fitz.TextWriter(page.rect)
                font = fitz.Font("helv")
                writer.append(
                    (x, y),
                    text,
                    font=font,
                    fontsize=self.DIAGONAL_FONT_SIZE
                )
                writer.write_text(
                    page,
                    color=self.DIAGONAL_COLOR,
                    opacity=self.DIAGONAL_OPACITY,
                    morph=(fitz.Point(x, y), fitz.Matrix(45))  # 45° diagonal rotation
                )

    def _add_footer_watermark(self, page: fitz.Page, footer_text: str):
        """
        Adds a small but readable footer at the bottom of every page.
        More visible than the diagonal — harder to crop out.
        """
        rect = page.rect
        footer_rect = fitz.Rect(
            rect.x0 + 10,
            rect.y1 - 20,
            rect.x1 - 10,
            rect.y1 - 5
        )

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
        Adds a small stamp in the top-right corner with viewer ID + page number.
        Survives even aggressive cropping of top/bottom.
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
        Validates that uploaded bytes are a legitimate PDF.
        Returns metadata for storage.
        """
        # Check magic bytes first
        if not pdf_bytes[:5] == b'%PDF-':
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
