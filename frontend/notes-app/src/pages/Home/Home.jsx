import { MdAdd } from "react-icons/md";
import Navbar from "../../components/Navbar";
import NoteCard from "../../components/NoteCard";
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";
import Toast from "../../components/Toast";
import EmptyCard from "../../components/EmptyCard";
import addNote from '../../assets/addNote.png'
import noData from '../../assets/noData.png'


export default function Home() {

    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: 'add',
        data: null,
    });

    const [allNotes, setAllNotes] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    const [isSearch, setIsSearch] = useState(false);
    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: "",
        type: "add"
    });

    const handleEdit = (noteDetails) => {
        setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
    };

    const showToastMessage = (message, type) => {
        setShowToastMsg({
            isShown: true,
            message,
            type
        });
    };

    const handleCloseToast = (message, type) => {
        setShowToastMsg({
            isShown: false,
            message: "",
        });
    };

    const getUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/get-user', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });

            if (response.status === 401) {
                localStorage.clear();
                navigate('/login');
            }

            const resData = await response.json();
            if (resData && resData.user) {
                setUserInfo(resData.user);
            }

        }
        catch (error) {
            console.log(error);
        }
    };

    const getAllNotes = async () => {

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/get-all-notes', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });

            const resData = await response.json();

            if (resData && resData.notes) {
                setAllNotes(resData.notes);
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const deleteNote = async (data) => {
        const noteId = data._id;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/delete-note/' + noteId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            });

            const resData = await response.json();

            if (resData && resData.error) {
                setError(resData.message);
            }

            if (resData && !resData.error) {
                showToastMessage("Note Deleted Successfully", 'delete');
                getAllNotes();
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const onSearchNote = async (query) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/search-notes?query=' + query, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }

            });

            const resData = await response.json();

            if (resData && resData.notes) {
                setIsSearch(true);
                setAllNotes(resData.notes)
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    const updateIsPinned = async (noteData) => {
        const noteId = noteData._id;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/update-note-pinned/' + noteId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    isPinned: !noteData.isPinned
                }),
            });

            const resData = await response.json();

            if (resData && resData.error) {
                setError(resData.message);
            }

            if (resData && resData.note) {
                showToastMessage("Note Updated Successfully");
                getAllNotes();
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleClearSearch = () => {
        setIsSearch(false);
        getAllNotes();
    }

    useEffect(() => {
        getAllNotes();
        getUserInfo();
        return () => { };
    }, []);

    return (
        <>
            <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

            <div className="container mx-auto">
                {allNotes.length > 0 ? < div className="grid grid-cols-3 gap-4 mt-8">
                    {allNotes.map((note, index) => (
                        <NoteCard
                            key={note._id}
                            title={note.title} date={note.createdOn} content={note.content} tags={note.tags} isPinned={note.isPinned} onEdit={() => { handleEdit(note) }} onDelete={() => { deleteNote(note) }} onPinNote={() => { updateIsPinned(note) }} />
                    ))}
                </div> :
                    <EmptyCard imgSrc={isSearch ? noData : addNote} message={isSearch ? `Oops! No notes found matching your search` : `Start creating your first note by clicking on the 'Add' button`} />
                }
            </div >

            <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10" onClick={() => { setOpenAddEditModal({ isShown: true, type: 'add', data: null }) }}>
                <MdAdd className="text-[32px] text-white" />
            </button>

            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => { }}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                    },
                }}
                contentLabel=""
                className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
            >
                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose={() => {
                        setOpenAddEditModal({ isShown: false, type: 'add', data: null });
                    }}
                    getAllNotes={getAllNotes}
                    showToastMessage={showToastMessage}
                />
            </Modal>

            <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />
        </>
    );
}