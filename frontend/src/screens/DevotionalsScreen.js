import { useEffect, useReducer } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
// import data from '../data';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, devotionals: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function DevotionalsScreen() {
  const [{ loading, error, devotionals }, dispatch] = useReducer(
    logger(reducer),
    {
      devotionals: [],
      loading: true,
      error: '',
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/devotionals');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>bee free</title>
      </Helmet>
      <h1>Devotionals</h1>
      <div className="">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <ul>
            {devotionals.map((devotional) => (
              <li key={devotional._id}>
                <Link to={`/devotional/${devotional._id}`}>
                  <h2>{devotional.title}</h2>
                </Link>
                <p>{devotional.devotional}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export default DevotionalsScreen;
