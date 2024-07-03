import { useState } from "react";
import TagInput from "../../components/TagInput";
import { MdClose } from "react-icons/md";

export default function AddEditNotes({ noteData, type, getAllNotes, onClose, showToastMessage }) {

    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || []);

    const [error, setError] = useState(null);

    const addNewNote = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/add-note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    title,
                    content,
                    tags
                }),
            });

            const resData = await response.json();

            if (resData && resData.error) {
                setError(resData.message);
            }

            if (resData && resData.note) {
                showToastMessage("Note Added Successfully");
                getAllNotes();
                onClose();
            }
        }
        catch (error) {
            console.log('Internal server error')
        }
    }

    const editNote = async () => {
        const noteId = noteData._id;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/edit-note/' + noteId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    title,
                    content,
                    tags
                }),
            });

            const resData = await response.json();

            if (resData && resData.error) {
                setError(resData.message);
            }

            if (resData && resData.note) {
                showToastMessage("Note Updated Successfully");
                getAllNotes();
                onClose()
            }
        }
        catch (error) {
            console.log('Internal server error')
        }
    }

    const handleAddNote = () => {
        if (!title) {
            setError("Please enter the title");
            return;
        }
        if (!content) {
            setError("Please enter the content");
            return;
        }

        setError("");

        if (type === 'edit') {
            editNote();
        } else {
            addNewNote();
        }
    }
    return (
        <div className="relative">

            <button
                className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
                onClick={onClose}
            >
                <MdClose className="text-xl text-slate-400" />
            </button>

            <div className="flex flex-col gap-2">
                <label className="input-label">TITLE</label>
                <input
                    type="text"
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="Go to Gym at 5"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />

            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label className="input-label">CONTENT</label>
                <textarea
                    type="text"
                    className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                    placeholder="Content"
                    rows={10}
                    value={content}
                    onChange={({ target }) => setContent(target.value)}
                />
            </div>

            <div className="mt-3">
                <label className="input-label">TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

            <button className="btn-primary font-medium mt-5 p-3" onClick={() => { handleAddNote() }}>
                {type === 'edit' ? 'UPDATE' : 'Add'}
            </button>
        </div>
    );
}