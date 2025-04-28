
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MDEditor from '@uiw/react-md-editor';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

function EditQuestionPage() {

  const {id: questionId} = useParams();
  const navigate = useNavigate();
  const { token, user: loggedInUser } = useSelector(state => state.user);
  

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');

  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchQuestionData = async () => {
      setError(null);
      try {
        const response = await axios.get(`${BASE_URL}/api/questions/${questionId}`, {headers: {Authorization: `bearer ${token}`}});
        const questionData = response.data?.question;
        if (!questionData) {
          throw new Error("Question not found.");
        }
  
        setTitle(questionData.title);
        setBody(questionData.body);
        setTags(questionData.tags.join(', '));
  
      } catch (err) {
        console.error("Error fetching question data for edit:", err);
        setError(err.message || "Failed to load question data.");
      }
    };
  
    fetchQuestionData();
  }, [questionId, loggedInUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !body.trim() || !tags.trim()) {
      setError('Please fill in all fields: Title, Body, and Tags.');
      return;
    }

    const processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    if (processedTags.length === 0) {
        setError('Please enter at least one valid tag.');
        return;
    }

    if (processedTags.length > 5) {
        setError('You can add a maximum of 5 tags.');
        return;
    }

    const questionData = {
      title: title.trim(),
      body: body,
      tags: processedTags,
    };


    try {
      const response = await axios.put(`${BASE_URL}/api/questions/${questionId}`, questionData, {
        headers: { Authorization: `bearer ${token}` }
      });

      console.log('API Response:', response.data);
      navigate(`/question/${questionId}`);

    } catch (err) {
      console.error("Error posting question:", err);
      setError(err.response?.data?.message || 'Failed to post question. Please try again.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

      {/* Main Form Area */}
      <div className="flex-grow bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Edit Your Question
        </h1>
        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(Be specific and imagine you’re asking a question to another person)</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={15}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. How to implement dark mode toggle with Tailwind CSS and React?"
            />
          </div>

          
          <div>
             <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Body
               <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(Include all the information someone would need to answer your question)</span>
             </label>
             
             <div data-color-mode={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}>
                 <MDEditor
                   value={body}
                   onChange={setBody}
                   height={400}
                   preview="live" // Options: 'live', 'edit', 'preview'
                 />
             </div>
          </div>

          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
               <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">(Add up to 5 tags separated by commas)</span>
            </label>
            <input
              type="text"
              name="tags"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. react,javascript,tailwind-css,dark-mode"
            />
             <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Comma-separated tags (e.g., `react, node.js, api`)</p>
          </div>

          
          <div>
            <button
              type="submit"
              disabled={isUpdating} // Use isUpdating state
              className="inline-flex justify-center items-center py-2 px-6 border ... rounded-md text-white bg-indigo-600 hover:bg-indigo-700 ... disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Updating...' : 'Update Your Question'}
            </button>
             {/* Optional Cancel Button */}
              <button
                  type="button"
                  onClick={() => navigate(`/question/${questionId}`)} // Go back without saving
                  disabled={isUpdating}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 ..."
              >
                  Cancel
              </button>
          </div>
        </form>
      </div>

    </div>
  );
}

export default EditQuestionPage;