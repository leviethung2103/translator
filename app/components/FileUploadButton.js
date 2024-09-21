import { useState } from 'react';
import { languages } from '../lib/languages';
import axios from 'axios';

const getFileIcon = (fileExtension) => {
    switch (fileExtension) {
        case 'docx':
            return '/images/word-icon.png';
        case 'pptx':
            return '/images/ppt-icon.png';
        case 'pdf':
            return '/images/pdf-icon.png';
        default:
            return '/images/default-icon.png';
    }
}

export default function TranslationBox({ value, onChange, charLimit, readOnly, isInput = false, targetLanguage }) {
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');


    const handleUpload = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
        console.log(uploadedFile);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        setFile(droppedFile);
        // Save the file locally or handle it as needed
        console.log(droppedFile);
    };

    const handleTranslate = async () => {
        console.log(`Translating ${file.name} into ${targetLanguage}`);

        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('source_language', 'auto');
        formData.append('target_language', targetLanguage);

        let endpoint = '';
        const fileExtension = file.name.split('.').pop().toLowerCase();

        console.log('fileExtensoin', fileExtension)

        switch (fileExtension) {
            case 'pptx':
                endpoint = '/translate/ppt';
                break;
            case 'pdf':
                endpoint = '/translate/pdf';
                break;
            case 'docx':
                endpoint = '/translate/doc';
                break;
            default:
                setErrorMessage('Unsupported file type');
                console.error('Unsupported file type');
                return;
        }

        try {
            const response = await axios.post(`http://localhost:8000${endpoint}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name.replace(`.${fileExtension}`, `_translated.${fileExtension}`));
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Translation failed', error);
        }

    };

    const handleCancel = () => {
        setFile(null);
    };

    return (
        <div className='card-bottom'>
            {file ? (
                <div className="file-uploaded flex items-center space-x-4 p-4 bg-gray-100 rounded-md text-center">
                    <div className="flex items-center justify-center">
                        <img src={getFileIcon(file.name.split('.').pop().toLowerCase())} alt="File Icon" className="w-8 h-8 mr-2" />
                        <p className="text-sm font-large">{file.name}</p>
                    </div>
                    <button
                        onClick={handleTranslate}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Translate into {languages.find(lang => lang.code === targetLanguage)?.name || targetLanguage}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <p className="text-center">Or choose your document!</p>
                    <p className="text-sm text-gray-500 text-center">Supported file formats: .docx, .pptx, .pdf</p>
                    <label
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Choose File
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleUpload}
                        />
                    </label>
                </div>
            )}
            {errorMessage && (
                <p className="text-red-500 text-center mt-2">{errorMessage}</p>
            )}
        </div>
    );
}

