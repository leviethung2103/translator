export default function TextArea({ value, onChange, placeholder, readOnly }) {
    return (
        <div className="text-area">
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={readOnly}
            ></textarea>
            <div className="chars">
                <span>{value.length}</span> / 5000
            </div>
        </div>
    )
}