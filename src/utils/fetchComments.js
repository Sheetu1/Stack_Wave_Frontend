
import axios from "axios";
import { BASE_URL } from "./constants";


export async function fetchComments(answerId, token) {
    try {
        const res = await axios.get(`${BASE_URL}/api/comments/${answerId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.comments;
    } catch (err) {
        console.error("Error fetching comments:", err);
        return []; // fallback
    }
}

export default fetchComments;