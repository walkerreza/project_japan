import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TOOLBAR_OPTIONS = [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ 'color': [] }, { 'background': [] }],
    ['clean'],
];

export default function QuillEditor({ value, onChange, placeholder = 'Tulis konten di sini...' }) {
    // Karena di-lazy load lewat React.lazy di file pemanggil, 
    // komponen ini hanya akan dijalankan di sisi client (browser).
    
    return (
        <div className="quill-wrapper">
            <style>{`
                .quill-wrapper .ql-container {
                    border-bottom-left-radius: 12px;
                    border-bottom-right-radius: 12px;
                    border-color: #e5e7eb;
                    font-family: inherit;
                    font-size: 14px;
                    min-height: 200px;
                }
                .quill-wrapper .ql-toolbar {
                    border-top-left-radius: 12px;
                    border-top-right-radius: 12px;
                    border-color: #e5e7eb;
                    background: #f9fafb;
                }
                .quill-wrapper .ql-container.ql-snow:focus-within,
                .quill-wrapper .ql-toolbar.ql-snow:focus-within {
                    border-color: #E64A19;
                }
                .quill-wrapper .ql-editor {
                    min-height: 200px;
                }
                .quill-wrapper .ql-editor.ql-blank::before {
                    color: #9ca3af;
                    font-style: normal;
                }
            `}</style>
            <ReactQuill
                theme="snow"
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                modules={{ toolbar: TOOLBAR_OPTIONS }}
            />
        </div>
    );
}
