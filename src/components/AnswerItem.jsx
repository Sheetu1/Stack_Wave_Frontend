import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ConfirmationModal from "./ConfirmationModal";
import MDEditor from "@uiw/react-md-editor";
import CommentItem from "./CommentItem";
import { BASE_URL } from "../utils/constants";


const UpVoteIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`w-6 h-6 ${
      filled ? "text-indigo-600 dark:text-indigo-400" : ""
    }`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 15.75l7.5-7.5 7.5 7.5"
    />
  </svg>
);

const DownVoteIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`w-6 h-6 ${filled ? "text-red-600 dark:text-red-400" : ""}`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 mr-1"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
    />
  </svg>
);

const CommentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 mr-1"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443h2.882c1.684 0 3.032-1.349 3.032-3.032V6.332c0-1.684-1.348-3.032-3.032-3.032H6.332c-1.684 0-3.032 1.348-3.032 3.032v6.428z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 mr-1"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

const MarkdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={atomDark}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={`inline-code ${className || ""}`} {...props}>
        {children}
      </code>
    );
  },
  a: ({ node, ...props }) => (
    <a className="text-indigo-500 hover:underline" {...props} />
  ),
};

function AnswerItem({ answer, questionId, loggedInUser, token, onAnswerDeleted }) {

  const {
    content: initialContent,
    authorId: author,
    vote: initialVotes,
    createdAt,
    _id: answerId,
    upvotedby,
    downvotedby,
    commentCount,
  } = answer;

  // --- State for Voting ---
  const [currentVotes, setCurrentVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [commentCounts, setCommentCounts] = useState(commentCount);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(initialContent);
  const [currentContent, setCurrentContent] = useState(initialContent);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Comments State (Placeholders for now) ---
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const inputRef = useRef(null);


  useEffect(() => {
    if (loggedInUser) {
      const userId = loggedInUser._id;
      if (upvotedby.some((id) => id === userId)) {
        setUserVote("up");
      } else if (downvotedby.some((id) => id === userId)) {
        setUserVote("down");
      } else {
        setUserVote(null);
      }
    } else {
      setUserVote(null);
    }
    setCurrentVotes(initialVotes);
  }, [upvotedby, downvotedby, loggedInUser, initialVotes]);

  const handleVote = useCallback(
    async (voteType) => {
      if (!loggedInUser) {
        toast.error("Please log in to vote.");
        return;
      }
      if (isVoting) return;

      setIsVoting(true);

      // --- Optimistic UI Update ---
      const previousVotes = currentVotes;
      const previousUserVote = userVote;
      let optimisticVotes = currentVotes;
      let optimisticUserVote = userVote;

      if (voteType === "up") {
        if (userVote === "up") {
          optimisticVotes--;
          optimisticUserVote = null;
        } else if (userVote === "down") {
          optimisticVotes += 2;
          optimisticUserVote = "up";
        } else {
          optimisticVotes++;
          optimisticUserVote = "up";
        }
      } else {
        if (userVote === "down") {
          optimisticVotes++;
          optimisticUserVote = null;
        } else if (userVote === "up") {
          optimisticVotes -= 2;
          optimisticUserVote = "down";
        } else {
          // New downvote
          optimisticVotes--;
          optimisticUserVote = "down";
        }
      }

      setCurrentVotes(optimisticVotes);
      setUserVote(optimisticUserVote);

      try {
        const apiUrl = `${BASE_URL}/api/answers/${
          voteType === "up" ? "upVote" : "downVote"
        }/${answerId}`;
        const response = await axios.post(
          apiUrl,
          {},
          {
            headers: { Authorization: `bearer ${token}` },
          }
        );

        if (response.data && typeof response.data.newVoteCount === "number") {
          setCurrentVotes(response.data.newVoteCount);
        }
      } catch (err) {
        console.error(`Error ${voteType}voting answer:`, err);
        toast.error(
          err.response?.data?.message || `Failed to ${voteType}vote.`
        );
        setCurrentVotes(previousVotes);
        setUserVote(previousUserVote);
      } finally {
        setIsVoting(false);
      }
    },
    [loggedInUser, token, answerId, isVoting, currentVotes, userVote]
  );

  const handleEditClick = () => {
    setEditedContent(currentContent);
    setIsEditing(true);
    setEditError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(currentContent);
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    if (isSavingEdit) return;
    if (!editedContent?.trim()) {
      setEditError("Answer content cannot be empty.");
      return;
    }
    if (editedContent === currentContent) {
      setIsEditing(false);
      setEditError(null);
      return;
    }

    setIsSavingEdit(true);
    setEditError(null);

    try {
      const response = await axios.put(
        `${BASE_URL}/api/answers/${answerId}`,
        { content: editedContent },
        { headers: { Authorization: `bearer ${token}` } }
      );

      const updatedAnswer = response.data?.answer;

      if (updatedAnswer) {
        setCurrentContent(updatedAnswer.content);
        setEditedContent(updatedAnswer.content);

        setIsEditing(false);
        toast.success("Answer updated successfully!");
      }
    } catch (err) {
      console.error("Error updating answer:", err);
      setEditError(err.response?.data?.message || "Failed to save changes.");
      toast.error("Failed to update answer.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const fetchComments = useCallback(async () => {
    if (!answerId) return;
    setIsLoadingComments(true);
    setCommentError(null);
    console.log("Fetching comments for answer:", answerId);
    try {
      const response = await axios.get(`${BASE_URL}/api/comments/${answerId}`,{
        headers: {Authorization: `bearer ${token}`}
      });
      setComments(response.data?.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setCommentError("Could not load comments.");
    } finally {
      setIsLoadingComments(false);
    }
  }, [answerId]);

  const handleToggleComments = () => {
    const becomingVisible = !showComments;
    setShowComments(becomingVisible);
    if (becomingVisible && comments.length === 0 && !isLoadingComments) {
      fetchComments();
    }
    if (!becomingVisible) {
      setReplyingTo(null);
    }
  };

  const handlePostCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isPostingComment) return;

    setIsPostingComment(true);
    setCommentError(null);

    const content = newComment.trim();
    const isReply = !!replyingTo;
    const url = isReply
      ? `${BASE_URL}/api/comments/${replyingTo.commentId}/replies`
      : `${BASE_URL}/api/comments/${answerId}`;

    const payload = { content };

    try {
      const response = await axios.post(url, payload, {
        headers: { Authorization: `bearer ${token}` },
      });

      const postedComment = response.data?.comment;
      if (postedComment) {
        fetchComments();

        if(!isReply){
          setCommentCounts(prev => prev + 1)
        }
        toast.success(isReply ? "Reply posted!" : "Comment added!");
      }
      setNewComment("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Error posting comment/reply:", err);
      setCommentError(err.response?.data?.message || "Failed to post comment.");
      toast.error("Failed to post comment.");
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleTriggerReply = (commentId, username) => {
    setReplyingTo({ commentId, username });
    inputRef.current?.focus();
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async function () {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      await axios.delete(BASE_URL + `/api/answers/${answerId}`, {
        headers: { Authorization: `bearer ${token}` },
      });

      onAnswerDeleted(answerId);
      setShowDeleteModal(false);
    } catch (err) {
      setShowDeleteModal(false);
      toast.error("Error: Can not delete message");
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = loggedInUser && author && loggedInUser._id === author._id;

  return (
    <div className="flex items-start space-x-4 py-4 border-t border-gray-200 dark:border-gray-700 first:border-t-0">
      {/* Voting Section */}
      <div className="flex flex-col items-center space-y-1 flex-shrink-0 text-gray-600 dark:text-gray-400 pt-1">
        <button
          onClick={() => handleVote("up")}
          disabled={isVoting || !loggedInUser}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Upvote"
        >
          <UpVoteIcon filled={userVote === "up"} />
        </button>
        <span
          className={`text-lg font-bold ${
            userVote === "up"
              ? "text-indigo-600 dark:text-indigo-400"
              : userVote === "down"
              ? "text-red-600 dark:text-red-400"
              : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {currentVotes}
        </span>
        <button
          onClick={() => handleVote("down")}
          disabled={isVoting || !loggedInUser}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Downvote"
        >
          <DownVoteIcon filled={userVote === "down"} />
        </button>
      </div>

      {/* Answer Content Section */}
      <div className="flex-grow min-w-0">
        {/* --- Conditional Rendering: Edit Mode vs View Mode --- */}
        {isEditing ? (
          <div className="space-y-3">
            {/* Display Edit Error */}
            {editError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm"
                role="alert"
              >
                {editError}
              </div>
            )}
            {/* Markdown Editor for Editing */}
            <div
              data-color-mode={
                document.documentElement.classList.contains("dark")
                  ? "dark"
                  : "light"
              }
            >
              <MDEditor
                value={editedContent}
                onChange={setEditedContent}
                height={200}
                preview="live"
              />
            </div>
            {/* Save/Cancel Buttons */}
            <div className="flex items-center space-x-3 mt-2">
              <button
                onClick={handleSaveEdit}
                disabled={isSavingEdit || editedContent === currentContent} // Disable if no change or saving
                className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSavingEdit ? "Saving..." : "Save Edits"}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isSavingEdit}
                className="inline-flex items-center px-4 py-1.5 border border-gray-300 dark:border-gray-500 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm sm:prose dark:prose-invert max-w-none mb-4">
            <ReactMarkdown
              components={MarkdownComponents}
              remarkPlugins={[remarkGfm]}
            >
              {currentContent}
            </ReactMarkdown>
          </div>
        )}

        {/* Author Info & Actions (Only show when not editing) */}
        {!isEditing && (
          <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-2 mt-4">
            {/* Edit/Delete/Comment Buttons */}
            <div className="text-xs space-x-3 flex items-center text-gray-500 dark:text-gray-400">
              {isOwner && (
                <>
                  {/* Updated Edit button to call handler */}
                  <button
                    onClick={handleEditClick}
                    className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <EditIcon /> <span className="ml-1">Edit</span>
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="flex items-center hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <TrashIcon /> <span className="ml-1">Delete</span>
                  </button>
                </>
              )}
              <button
                onClick={handleToggleComments}
                className="flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <CommentIcon />
                <span className="ml-1">
                  {showComments ? "Hide" : "Show"} Comments{" "} 
                </span>
              </button>
            </div>

            {/* Author Card */}
            <div className="flex-shrink-0 bg-blue-50 dark:bg-gray-700 p-2 rounded-md text-xs ... shadow-sm">
              {/* ... Author details ... */}
              <p className="mb-1 ...">
                answered{" "}
                {createdAt
                  ? formatDistanceToNow(new Date(createdAt), {
                      addSuffix: true,
                    })
                  : "recently"}
              </p>
              <Link
                to={`/profile/${author?._id}`}
                className="flex items-center gap-2 group"
              >
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={author?.avatar}
                  alt="author_name"
                />
                <span className="font-medium ... group-hover:underline">
                  {author?.username}
                </span>
              </Link>
            </div>
          </div>
        )}

        {/* --- Comments Section (Render conditionally) --- */}
        {showComments && (
          <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {isLoadingComments && (
              <p className="text-xs text-center text-gray-400">
                Loading comments...
              </p>
            )}
            {commentError && (
              <p className="text-xs text-center text-red-500">{commentError}</p>
            )}
            {!isLoadingComments && !commentError && comments.length === 0 && (
              <p className="text-xs text-center text-gray-400 italic py-2">
                No comments yet for this answer.
              </p>
            )}

            {comments.map(comment => <CommentItem 
              key={comment._id} 
              comment={comment} 
              token={token} 
              onCommentDeleted={() => fetchComments()}
              onReply={(commentId, username) => handleTriggerReply(commentId, username)}
              loggedInUser={loggedInUser}
            />)}

            {/* Add Comment Form (Only for logged-in users) */}
            {loggedInUser && (
              <form
                onSubmit={handlePostCommentSubmit}
                className="flex items-start space-x-2 pt-3 border-t border-gray-200 dark:border-gray-600 mt-3"
              >
                {" "}
                {/* Added top margin/border */}
                <img className="h-6 w-6 rounded-full object-cover flex-shrink-0" src={loggedInUser.avatar ||`https://ui-avatars.com/api/?name=${loggedInUser.username}&size=24&background=random`}
                  alt="Your avatar"
                />
                <input
                  type="text"
                  value={newComment}
                  ref={inputRef}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-grow block w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  aria-label="Add a comment"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || isPostingComment}
                  className="px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 disabled:opacity-60"
                >
                  {isPostingComment ? "..." : "Add"}
                </button>
              </form>
            )}
            {!loggedInUser && ( // Show message if not logged in
              <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                <Link to="/login" className="text-indigo-600 hover:underline">
                  Log in
                </Link>{" "}
                or{" "}
                <Link to="/signup" className="text-indigo-600 hover:underline">
                  sign up
                </Link>{" "}
                to add a comment.
              </p>
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Answer Deletion"
        message="Are you sure you want to delete this answer? This action cannot be undone."
        confirmText="Delete Answer"
        cancelText="Cancel"
        confirmButtonVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default AnswerItem;
