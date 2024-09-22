import os

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from translators.base import Translator
from translators.doc import DocxTranslator
from translators.pdf import PDFTranslator
from translators.ppt import PPTTranslator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

from dotenv import load_dotenv
import os

load_dotenv(override=True)
OUTPUTS_FOLDER = os.getenv("OUTPUTS_FOLDER", "outputs")
INPUTS_FOLDER = os.getenv("INPUTS_FOLDER", "inputs")

if not os.path.exists(OUTPUTS_FOLDER):
    os.makedirs(OUTPUTS_FOLDER)

if not os.path.exists(INPUTS_FOLDER):
    os.makedirs(INPUTS_FOLDER)


@app.post("/translate/ppt")
async def translate_ppt(file: UploadFile = File(...), source_language: str = "auto", target_language: str = "vi"):
    filename = os.path.basename(file.filename)
    input_path = f"{INPUTS_FOLDER}/{filename}"

    file_extension = os.path.splitext(filename)[1]
    output_path = f"{OUTPUTS_FOLDER}/{filename.replace(file_extension, '_translated' + file_extension)}"

    with open(input_path, "wb") as f:
        f.write(await file.read())

    ppt_translator = PPTTranslator(source_language=source_language, target_language=target_language)
    ppt_translator.translate_ppt(input_path, output_path)

    return FileResponse(
        output_path,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        filename=os.path.basename(output_path),
    )


@app.post("/translate/pdf")
async def translate_pdf(file: UploadFile = File(...), source_language: str = "auto", target_language: str = "vi"):
    filename = os.path.basename(file.filename)
    input_path = f"{INPUTS_FOLDER}/{filename}"
    file_extension = os.path.splitext(filename)[1]
    output_path = f"{OUTPUTS_FOLDER}/{filename.replace(file_extension, '_translated' + file_extension)}"

    with open(input_path, "wb") as f:
        f.write(await file.read())

    pdf_translator = PDFTranslator(source_language=source_language, target_language=target_language)
    pdf_translator.translate_pdf(input_path, output_path)

    return FileResponse(
        output_path,
        media_type="application/pdf",
        filename=os.path.basename(output_path),
    )


@app.post("/translate/text")
async def translate_text_endpoint(text: str, source_language: str = "auto", target_language: str = "vi"):
    translator = Translator(target_language=target_language, source_language=source_language)
    translated_text = translator.translate_text(text)
    return {"translated_text": translated_text}


@app.post("/translate/doc")
async def translate_docx(file: UploadFile = File(...), source_language: str = "auto", target_language: str = "en"):
    filename = os.path.basename(file.filename)
    input_path = f"{INPUTS_FOLDER}/{filename}"
    file_extension = os.path.splitext(filename)[1]
    output_path = f"{OUTPUTS_FOLDER}/{filename.replace(file_extension, '_translated' + file_extension)}"  # Update output path with translated suffix

    with open(input_path, "wb") as f:
        f.write(await file.read())

    docx_translator = DocxTranslator(source_language=source_language, target_language=target_language)
    docx_translator.translate_docx(input_path, output_path)

    return FileResponse(
        output_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=os.path.basename(output_path),
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, log_level="info", reload=True)
