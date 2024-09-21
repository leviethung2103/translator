import fitz
from typing import List, Tuple
from deep_translator import GoogleTranslator
from .base import Translator
import os


class PDFTranslator(Translator):
    def __init__(self, target_language: str, source_language: str = "auto") -> None:
        super().__init__(target_language, source_language)
        self.fonts_dir = "./fonts"
        self.font_files = ["OpenSans.ttf"]

    def _load_fonts(self) -> List[Tuple[str, str]]:
        loaded_fonts = []
        for font_file in self.font_files:
            font_path = os.path.join(self.fonts_dir, font_file)
            if os.path.exists(font_path):
                try:
                    font_name = font_file.split(".")[0]
                    loaded_fonts.append((font_name, font_path))
                    print(f"Font file loaded: {font_file}")
                except Exception as e:
                    print(f"Failed to load font {font_file}: {str(e)}")

        if not loaded_fonts:
            print("No fonts could be loaded. Using built-in font as fallback.")
            loaded_fonts = [("helv", None)]

        return loaded_fonts

    def translate_pdf(self, file_path: str, output_path: str):
        pdf_document = fitz.open(file_path)
        no_pages = len(pdf_document)

        # Load fonts from files
        loaded_fonts = self._load_fonts()

        # Create a new PDF for the translated content
        translated_pdf = fitz.open()

        # Process each page
        for page_num in range(no_pages):
            page = pdf_document[page_num]
            new_page = translated_pdf.new_page(width=page.rect.width, height=page.rect.height)

            # Get all text blocks on the page
            blocks = page.get_text("dict")["blocks"]

            for block in blocks:
                if block["type"] == 0:  # Text block
                    for line in block["lines"]:
                        for span in line["spans"]:
                            original_text = span["text"]
                            font_size = span["size"]

                            # Translate the text
                            translated_text = GoogleTranslator(source="auto", target="vi").translate(original_text)

                            # Try to insert text with loaded fonts
                            for font_name, font_path in loaded_fonts:
                                try:
                                    if font_path:
                                        new_page.insert_font(fontname=font_name, fontfile=font_path)
                                    new_page.insert_text(
                                        (span["origin"][0], span["origin"][1]),
                                        translated_text,
                                        fontsize=font_size,
                                        fontname=font_name,
                                        color=(0, 0, 0),
                                    )
                                    # If successful, break the loop
                                    break
                                except Exception as e:
                                    # If it's the last font in the list
                                    if (font_name, font_path) == loaded_fonts[-1]:
                                        print(f"Failed to insert text: {translated_text}")
                                        print(f"Error: {str(e)}")
                elif block["type"] == 1:  # Image block
                    try:
                        # Copy images from the original PDF to the new PDF
                        new_page.insert_image(block["bbox"], stream=page.get_images()[block["number"]][1])
                    except Exception as e:
                        print(f"Failed to insert image. Error: {str(e)}")

        # Save the modified PDF
        translated_pdf.save(output_path)
        translated_pdf.close()
        pdf_document.close()
        print("Translation complete. Saved as 'translated_output.pdf'.")
