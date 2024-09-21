export default function DownloadButton({ text, language }) {
    const handleDownload = () => {
        if (text) {
            const blob = new Blob([text], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.download = `translated-to-${language}.txt`
            a.href = url
            a.click()
        }
    }

    return (
        <div className="card-bottom">
            <p>Download as a document!</p>
            <button onClick={handleDownload}>Download</button>
        </div>
    )
}
