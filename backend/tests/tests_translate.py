import unittest
from fastapi.testclient import TestClient
from app import app


class TestTranslationEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_translate_pdf(self):
        with open("./test_data/test_document.pdf", "rb") as file:
            response = self.client.post(
                "/translate/pdf",
                files={"file": ("./test_data/test_document.pdf", file)},
                data={"source_language": "auto", "target_language": "vi"},
            )
        self.assertEqual(response.status_code, 200)

    def test_translate_ppt(self):
        with open("./test_data/test_document.pptx", "rb") as file:
            response = self.client.post(
                "/translate/ppt",
                files={"file": ("./test_data/test_document.pptx", file)},
                data={"source_language": "auto", "target_language": "vi"},
            )
        self.assertEqual(response.status_code, 200)

    def test_translate_docx(self):
        with open("./test_data/test_document.docx", "rb") as file:
            response = self.client.post(
                "/translate/doc",
                files={"file": ("./test_data/test_document.docx", file)},
                data={"source_language": "auto", "target_language": "en"},
            )
        self.assertEqual(response.status_code, 200)

    def test_translate_text(self):
        response = self.client.post(
            "/translate/text", params={"text": "Hello, world!", "source_language": "auto", "target_language": "vi"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("translated_text", response.json())


if __name__ == "__main__":
    unittest.main()
