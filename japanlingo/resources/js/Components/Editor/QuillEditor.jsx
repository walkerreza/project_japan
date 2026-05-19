import React, { useRef } from 'react';
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

export default function QuillEditor({ value, onChange, placeholder = 'Tulis konten di sini...', editorMinHeight = '200px', uploadImageUrl = null }) {
    // Karena di-lazy load lewat React.lazy di file pemanggil, 
    // komponen ini hanya akan dijalankan di sisi client (browser).
    const quillRef = useRef(null);

    const uploadImage = () => {
        if (!uploadImageUrl) return;

        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/jpeg,image/png,image/webp');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);

            const response = await window.axios.post(uploadImageUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const editor = quillRef.current?.getEditor();
            const range = editor?.getSelection(true);

            if (editor && response.data?.url) {
                editor.insertEmbed(range?.index ?? editor.getLength(), 'image', response.data.url, 'user');
            }
        };
    };
    
    return (
        <div className="quill-wrapper">
            <style>{`
                .quill-wrapper .ql-container {
                    border-bottom-left-radius: 12px;
                    border-bottom-right-radius: 12px;
                    border-color: #e5e7eb;
                    font-family: inherit;
                    font-size: 14px;
                    min-height: ${editorMinHeight};
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
                    min-height: ${editorMinHeight};
                }
                .quill-wrapper .ql-editor.ql-blank::before {
                    color: #9ca3af;
                    font-style: normal;
                }
                .dark .quill-wrapper .ql-container {
                    border-color: #374151;
                    background: #030712;
                    color: #f9fafb;
                }
                .dark .quill-wrapper .ql-toolbar {
                    border-color: #374151;
                    background: #111827;
                }
                .dark .quill-wrapper .ql-toolbar .ql-stroke {
                    stroke: #d1d5db;
                }
                .dark .quill-wrapper .ql-toolbar .ql-fill {
                    fill: #d1d5db;
                }
                .dark .quill-wrapper .ql-toolbar .ql-picker {
                    color: #d1d5db;
                }
                .dark .quill-wrapper .ql-picker-options {
                    border-color: #374151;
                    background: #111827;
                }
                .dark .quill-wrapper .ql-editor.ql-blank::before {
                    color: #6b7280;
                }
            `}</style>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                modules={{
                    toolbar: {
                        container: TOOLBAR_OPTIONS,
                        handlers: uploadImageUrl ? { image: uploadImage } : {},
                    },
                }}
            />
        </div>
    );
}
