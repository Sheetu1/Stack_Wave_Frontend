
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown'; // Using simple markdown for comments maybe? Or just text?
import remarkGfm from 'remark-gfm';
import MDEditor from '@uiw/react-md-editor'; // For editing comment

import { BASE_URL } from '../utils/constants'; 
import ConfirmationModal from './ConfirmationModal';

// --- Icons ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const ReplyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 mr-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>;


const SimpleMarkdownComponents = {
   p: ({node, ...props}) => <p className="my-1" {...props} />,
   a: ({node, ...props}) => <a className="text-indigo-500 hover:underline" {...props} />,
   code: ({node, inline, className, children, ...props}) => <code className={`text-xs bg-gray-100 dark:bg-gray-700 rounded px-1 py-0.5 ${className || ''}`} {...props}>{children}</code>,
   h1: 'p', h2: 'p', h3: 'p', h4: 'p', h5: 'p', h6: 'p',
   img: () => null,
};


function CommentItem({ comment,loggedInUser,token,onCommentDeleted,onReply,level = 0 }) {

    const { content: initialContent, authorId: author , createdAt, _id: commentId, parentComment, replyCount } = comment;

    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(initialContent);
    const [currentContent, setCurrentContent] = useState(initialContent);
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [editError, setEditError] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const [isLoadingReplies, setIsLoadingReplies] = useState(false);
    const [replyError, setReplyError] = useState(null);

    // --- Edit Handlers ---
    const handleEditClick = () => { 
        setIsEditing(true); 
        setEditedContent(currentContent); 
        setEditError(null); 
    };

    const handleCancelEdit = () => { 
        setIsEditing(false); 
        setEditedContent(currentContent); 
        setEditError(null); 
    };

    const handleSaveEdit = async () => {
        if (isSavingEdit || !editedContent?.trim() || editedContent === currentContent) {
            if(editedContent === currentContent) setIsEditing(false);
            return;
        }
        setIsSavingEdit(true); 
        setEditError(null);

        try {
            const response = await axios.put(`${BASE_URL}/api/comments/${commentId}`,
               { content: editedContent },
               { headers: { Authorization: `bearer ${token}` } }
            );
            const updatedComment = response.data?.comment;
            if (updatedComment) {
                setCurrentContent(updatedComment.content);
                setEditedContent(updatedComment.content);
            } else {
                setCurrentContent(editedContent);
            }
            setIsEditing(false);
            toast.success("Comment updated");
        } catch (err) {
            console.error("Error updating comment:", err);
            setEditError(err.response?.data?.message || "Failed to save comment.");
            toast.error("Failed to update comment.");
        } finally {
            setIsSavingEdit(false);
        }
    };


    const handleDeleteClick = () => setShowDeleteModal(true);

    const handleCancelDelete = () => setShowDeleteModal(false);

    const handleConfirmDelete = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        try {
            await axios.delete(`${BASE_URL}/api/comments/${commentId}`, {
                headers: { Authorization: `bearer ${token}` }
            });
            setShowDeleteModal(false);
            if (onCommentDeleted) onCommentDeleted();
            toast.success("Comment deleted");
        } catch (err) {
            console.error("Error deleting comment:", err);
            toast.error(err.response?.data?.message || "Failed to delete comment.");
            setShowDeleteModal(false);
        } finally {
            setIsDeleting(false);
        }
    };

    // --- Reply Handler ---
    const handleReplyClick = () => {
        if (onReply) {
            onReply(commentId, author.username);
        }
    };

    const fetchReplies = () => {
        if (isLoadingReplies) return;
        setIsLoadingReplies(true);
        setReplyError(null);

        axios.get(BASE_URL + `/api/comments/${commentId}/replies`,{
            headers: {Authorization: `bearer ${token}`}
        })
        .then((res) => {
            console.log(res);
            setIsLoadingReplies(false);
            setReplies(res.data.replies);
        })
        .catch((err) => {
            console.log(err);
            setIsLoadingReplies(false);
            setReplyError(err.response.data.message)
        })
    }

    const handleToggleReplies = () => {
        const becomingVisible = !showReplies;
        setShowReplies(becomingVisible);
        if (becomingVisible && replies.length === 0 && replyCount > 0) {
            fetchReplies();
        }
    };

    const handleReplyUpdated = (updatedReply) => {
        setReplies(prevReplies => prevReplies.map(reply =>
            reply._id === updatedReply._id ? updatedReply : reply
        ));
    }

    const isOwner = loggedInUser && author && loggedInUser._id === author._id;

    return (
        <div className={`flex space-x-2 text-xs ${level > 0 ? `ml-${level * 4}` : ''}`}>
            {/* Avatar */}
            <Link to={`/profile/${author?._id}`} className="flex-shrink-0 mt-1">
                <img
                    className="h-5 w-5 rounded-full object-cover"
                    src={author?.avatar || `https://ui-avatars.com/api/?name=${author?.username || '?'}&size=20&background=random`}
                    alt={author?.username}
                />
            </Link>

            {/* Comment Body & Actions */}
            <div className="flex-grow">
                {isEditing ? (
                    <div className="space-y-2">
                        {editError && <p className="text-red-500 text-xs">{editError}</p>}
                        <MDEditor
                            value={editedContent}
                            onChange={setEditedContent}
                            height={100}
                            preview="edit"
                            hideToolbar={true}
                            textareaProps={{ placeholder: "Edit your comment..." }}
                            visibleDragbar={false}
                            className="text-xs"
                        />
                         <div className="flex items-center space-x-2">
                             <button onClick={handleSaveEdit} disabled={isSavingEdit} className="px-2 py-0.5 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">Save</button>
                             <button onClick={handleCancelEdit} disabled={isSavingEdit} className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300">Cancel</button>
                         </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1.5">
                             <Link to={`/profile/${author?._id}`} className="font-semibold text-gray-900 dark:text-white hover:underline mr-1">{author?.username}</Link>
                            <span className="text-gray-700 dark:text-gray-300">
                                
                                <ReactMarkdown components={SimpleMarkdownComponents} remarkPlugins={[remarkGfm]}>
                                    {currentContent}
                                </ReactMarkdown>
                            </span>
                        </div>
                         
                         <div className="flex items-center space-x-3 mt-1 px-1 text-gray-500 dark:text-gray-400">
                            {level < 1 && <button onClick={handleReplyClick} className="hover:underline inline-flex items-center cursor-pointer"> <ReplyIcon /> Reply </button> }
                             {isOwner && (
                                 <>
                                     <button onClick={handleEditClick} className="hover:underline cursor-pointer">Edit</button>
                                     <button onClick={handleDeleteClick} className="hover:underline text-red-500/80 hover:text-red-600 cursor-pointer">Delete</button>
                                 </>
                             )}
                             <span title={new Date(createdAt).toLocaleString()}>
                                 {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : ''}
                             </span>
                            {level < 1 && <button onClick={handleToggleReplies} className='hover:underline inline-flex items-center cursor-pointer'>Show Replies  </button> }
                         </div>
                    </>
                )}


                {showReplies && (
                    <div className="mt-2 space-y-2">
                        {isLoadingReplies && <p className="text-xs text-gray-400 italic ml-4">Loading replies...</p>}
                        {replyError && <p className="text-xs text-red-500 ml-4">{replyError}</p>}
                        {!isLoadingReplies && !replyError && replies.length > 0 && (
                            replies.map(reply => (
                                <CommentItem
                                    key={reply._id}
                                    comment={reply}
                                    loggedInUser={loggedInUser}
                                    token={token}
                                    onCommentDeleted={() => fetchReplies()}
                                    onCommentUpdated={handleReplyUpdated}
                                    onReply={onReply}
                                    level={level + 1}
                                />
                            ))
                        )}
                        {!isLoadingReplies && !replyError && replies.length === 0 && replyCount > 0 && <p className="text-xs text-gray-400 italic ml-4">No replies found.</p>}
                    </div>
                )}

            </div>

             {/* Delete Confirmation */}
             <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Confirm Comment Deletion"
                message="Are you sure you want to delete this comment?"
                confirmText="Delete"
                confirmButtonVariant="danger"
                isLoading={isDeleting}
             />
        </div>
    );
}

export default CommentItem;