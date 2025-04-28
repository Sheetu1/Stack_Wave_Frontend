
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import QuestionItem from '../components/QuestionItem';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { toast } from "react-toastify"
import Loading from '../components/Loading';


const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;


function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Newest');
  const { token } = useSelector((state) => state.user);
  const [page, setPage] = useState(1)


  const fetchQuestions = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/questions?page=${pageNumber}&limit=3&filter=${activeFilter}`, {
        headers: { Authorization: `bearer ${token}` }
      });
      setQuestions(res.data?.questions);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchQuestions(page);
  },[page,activeFilter])

  const handlePrev = () => {
    if(page > 1){
      setPage(prev => prev - 1)
    }
  }

  const handleNext = () => {
    if(questions.length > 1){
      setPage(prev => prev + 1)
    }
  }


  const handleFilterChange = async (filter) => {
    setActiveFilter(filter);
  };
  

  const FilterButton = ({ filterName }) => (
     <button
        onClick={() => handleFilterChange(filterName)}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          activeFilter === filterName
            ? 'bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-white'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`} >
        {filterName}
     </button>
  );

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          All Questions
        </h1>
          <Link to="/ask" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap">
            <PlusIcon /> Ask Question
          </Link>
      </div>

      <div className="flex items-center px-4">
          <div className="flex space-x-1 sm:space-x-2 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
             <FilterButton filterName="Newest" />
             <FilterButton filterName="Top Voted" />
             <FilterButton filterName="Unanswered" />
          </div>
      </div>

      {/* Question List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading && <div className="p-6 text-center"> <Loading/> </div>}
        {!loading && questions.length === 0 && <div className="p-6 text-center text-gray-500">No questions found.</div>}

        {!loading && questions.length > 0 && (
          <div>
            {questions.map((q) => (
              <QuestionItem key={q._id} question={q} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="join ">
            <button onClick={handlePrev} className={`join-item btn ${page <= 1 && "disabled" }`}>«</button>
            <button className="join-item btn">Page {page}</button>
            <button onClick={handleNext} className="join-item btn">»</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionsPage;