## Project Overview
The API translator application is built using FastAPI. 

### Features
- **Translation of Powerpoint/Word/PDF files**
    - .pptx
    - .docx
    - .pdf
    - raw text
- **RESTful API**: The application exposes endpoints for file upload and translation status.
- **Asynchronous processing**: Utilizes FastAPI's asynchronous capabilities for efficient file handling.

### Future Features
- Support another file format .txt, .odt, .odp
- Handle more complicated structure of files
- Change another Translator

### Getting Started
1. **Installation**: Ensure you have Python 3.6+ installed. 
    
    Create a new environment
    ```bash
    python -m venv venv
    ```


    Install the required packages using:
   ```bash
   pip install fastapi uvicorn python-multipart
   ```

2. **Running the Application**: Start the FastAPI server with:

    For development
   ```bash
   python app.py
   ```

   For production
   ```bash
    uvicorn app:app --reload
    ```

3. **API Documentation**: Access the interactive API documentation at `http://127.0.0.1:8000/docs`.


### Unit test
```bash
python -m unittest tests/tests_translate.py
```