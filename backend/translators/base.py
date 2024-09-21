from deep_translator import GoogleTranslator


class Translator:
    def __init__(
        self,
        target_language: str = "en",
        source_language: str = "auto",
    ) -> None:
        self.translator = GoogleTranslator(source=source_language, target=target_language)

    def translate_text(self, text: str) -> str:
        return self.translator.translate(text)
