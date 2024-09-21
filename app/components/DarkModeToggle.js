export default function DarkModeToggle({ isDarkMode, setIsDarkMode }) {
    return (
        <div className="mode">
            <label className="toggle" htmlFor="dark-mode-btn">
                <input
                    id="dark-mode-btn"
                    type="checkbox"
                    className="toggle-checkbox"
                    checked={isDarkMode}
                    onChange={() => setIsDarkMode(!isDarkMode)}
                />
                <div className="toggle-track">
                    <img src="/images/sun.png" alt="Light mode" />
                    <img src="/images/moon.png" alt="Dark mode" />
                </div>
                <div className="toggle-thumb"></div>
            </label>
        </div>
    )
}