'use client'

import { useState, useEffect, useRef } from 'react'
import LanguageDropdown from './components/LanguageDropdown'
import SwapButton from './components/SwapButton'
import DarkModeToggle from './components/DarkModeToggle'
import TranslationBox from './components/FileUploadButton'
import DownloadButton from './components/DownloadButton'
import './styles/styles.css'
import { GoogleTranslationService } from './services/GoogleTranslationService'
import { TranslationService } from './services/TranslationService'

export default function Home() {
  const [inputLanguage, setInputLanguage] = useState('auto')
  const [outputLanguage, setOutputLanguage] = useState('en')
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  const translationService: TranslationService = new GoogleTranslationService();

  const handleSwap = () => {
    setInputLanguage(outputLanguage)
    setOutputLanguage(inputLanguage)
    setInputText(outputText)
    setOutputText(inputText)
  }

  const handleTranslate = async () => {
    try {
      const translatedText = await translationService.translate(inputText, inputLanguage, outputLanguage);
      setOutputText(translatedText);
    } catch (error) {
      console.error('Translation error:', error)
    }
  }

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }
  }, [inputText]);

  useEffect(() => {
    handleTranslate();
  }, [inputText, inputLanguage, outputLanguage]);

  return (
    <div className={`container ${isDarkMode ? 'dark' : ''}`}>
      <div className="card input-wrapper">
        <LanguageDropdown
          label="From"
          selectedLanguage={inputLanguage}
          onSelectLanguage={setInputLanguage}
        />
        <textarea
          ref={textAreaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to translate"
          className="text-area"
        />
        <TranslationBox targetLanguage={outputLanguage} />
      </div>

      <SwapButton onClick={handleSwap} />

      <div className="card output-wrapper">
        <LanguageDropdown
          label="To"
          selectedLanguage={outputLanguage}
          onSelectLanguage={setOutputLanguage}
        />
        <textarea
          value={outputText}
          readOnly
          placeholder="Translation will appear here"
          className="text-area"
        />
        <DownloadButton text={outputText} language={outputLanguage} />
      </div>

      <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </div>
  )
}