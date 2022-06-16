import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';

const initialState = {
  loading: false,
  createdDevotional: null,
  error: '',
  success: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_RESET':
      return initialState;
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loading: false,
        createdDevotional: action.payload,
        success: true,
        error: '',
      };
    case 'CREATE_FAIL':
      return {
        ...state,
        error: action.payload,
        loading: false,
        success: false,
      };
    default:
      return state;
  }
};

// devotionals: [
//   {
//     bibleVersion: 'Afrikaans 1983 (AFR83)',
//     bibleChapter: 'Psalm 121:1-8; 125:1-2',
//     bibleReading:
//       '125:1 n Pelgrimslied. Dié wat op die Here vertrou, is soos Sionsberg wat nie wankel nie en altyd vas bly staan.  2 Soos die berge Jerusalem aan alle kante beskerm, so beskerm die Here sy volk, nou en vir altyd.',
//     title: 'In veilige bewaring',
//     body: 'Vertrektyd! Hoeveel uiteenlopende gedagtes spoed nie deur ons gedagtes nie! Tog bly daar n knaende onsekerheid wat deel is van...',
//     quoteAuthor: 'David Nicholas',
//     quote:
//       'God se beloftes is soos die sterre, hoe donkerder die nag, hoe helderder skyn hulle.',
//     bookId: 1,
//     userId: 1,
//   },
// ],

export default function DevotionalScreen() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { loading, error, createdDevotional, success } = state;
  const [bibleVersion, setBibleVersion] = useState('');
  const [bibleChapter, setBibleChapter] = useState('');
  const [bibleReading, setBibleReading] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');
  const [quote, setQuote] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'CREATE_REQUEST' });
    try {
      const { data } = await axios.post(`${backendAPI}/devotionals`, {
        title,
        body,
        userId: user.id,
        id: Math.floor(Math.random() * 1000000),
      });
      dispatch({ type: 'CREATE_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL', payload: err.message });
    }
  };
  const reset = () => {
    dispatch({ type: 'CREATE_RESET' });
  };
  return (
    <div>
      <h1>Create Post</h1>
      {success ? (
        <div>
          <p>
            Post titled <strong>{createdDevotional.title}</strong> has been
            created.
          </p>
          <button onClick={reset}>Create another post</button>
        </div>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-item">
            <label htmlFor="title">Title: </label>
            <input
              name="title"
              id="title"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
            ></input>
          </div>
          <div className="form-item">
            <label htmlFor="body">Body: </label>
            <textarea
              name="body"
              id="body"
              type="text"
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
          </div>
          <div className="form-item">
            <label></label>
            <button>Create</button>
          </div>
          {loading && (
            <div className="form-item">
              <label></label>
              <span>Processing...</span>
            </div>
          )}
          {error && (
            <div className="form-item">
              <label></label>
              <span className="error">{error}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
