import { useState } from 'react'
import { languages } from '../lib/languages'
import { Search } from 'lucide-react'

export default function LanguageDropdown({ label, selectedLanguage, onSelectLanguage }) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLanguages = languages.filter(language =>
        language.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative text-sm">
            <div className="dropdown-container ${isOpen ? 'active' : ''}">
                <div className="from flex items-center space-x-2">
                    <span className="heading font-medium">{label}:</span>
                    <div
                        className="dropdown-toggle flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span>
                            {languages.find(lang => lang.code === selectedLanguage)
                                ? `${languages.find(lang => lang.code === selectedLanguage).name} (${languages.find(lang => lang.code === selectedLanguage).native})`
                                : 'Select Language'}
                        </span>
                        <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search language..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 text-sm border-b border-gray-300 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        <ul className="max-h-60 overflow-auto">
                            {filteredLanguages.map((lang) => (
                                <li
                                    key={lang.code}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${lang.code === selectedLanguage ? 'bg-blue-100' : ''}`}
                                    onClick={() => {
                                        onSelectLanguage(lang.code)
                                        setIsOpen(false)
                                    }}
                                >
                                    {lang.name} ({lang.native})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}