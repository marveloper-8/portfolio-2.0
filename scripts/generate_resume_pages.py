#!/usr/bin/env python3
"""
Utility script to render high-resolution PNG pages of public/resume.pdf
for instant multi-page preview in the web application.
"""
import os
import pymupdf

def render_pages():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    pdf_path = os.path.join(project_root, 'public', 'resume.pdf')
    
    if not os.path.exists(pdf_path):
        print(f"Error: PDF not found at {pdf_path}")
        return

    doc = pymupdf.open(pdf_path)
    print(f"Loaded {pdf_path} ({len(doc)} pages)")
    
    for i, page in enumerate(doc):
        # 250 DPI provides crystal-clear rendering on Retina / 4K screens
        pix = page.get_pixmap(dpi=250)
        out_png = os.path.join(project_root, 'public', f'resume-page-{i+1}.png')
        pix.save(out_png)
        print(f"Wrote Page {i+1} -> {out_png} ({pix.width}x{pix.height})")
        
        # Also write SVG for optional vector usage
        svg_content = page.get_svg_image()
        out_svg = os.path.join(project_root, 'public', f'resume-page-{i+1}.svg')
        with open(out_svg, 'w', encoding='utf-8') as f:
            f.write(svg_content)
        print(f"Wrote SVG -> {out_svg}")

if __name__ == '__main__':
    render_pages()
