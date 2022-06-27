import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function DevotionalEditScreen() {
  const navigate = useNavigate();
  const params = useParams(); // /devotional/:id
  const { id: devotionalId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [title, setTitle] = useState('');
  const [bibleVersion, setBibleVersion] = useState('');
  const [bibleReading, setBibleReading] = useState(''); //Bible Chapters
  const [bible, setBible] = useState('');
  const [devotional, setDevotional] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');
  const [quote, setQuote] = useState('');
  const [bookId, setBookId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/devotionals/${devotionalId}`);
        setTitle(data.title);
        setBibleVersion(data.bibleVersion);
        setBibleReading(data.bibleReading);
        setBible(data.bible);
        setDevotional(data.devotional);
        setQuoteAuthor(data.quoteAuthor);
        setQuote(data.quote);
        setBookId(data.bookId);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [devotionalId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/devotionals/${devotionalId}`,
        {
          _id: devotionalId,
          title,
          bibleVersion,
          bibleReading,
          bible,
          devotional,
          quoteAuthor,
          quote,
          bookId,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Devotional updated successfully.');
      navigate('/admin/devotionals');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };
  // const uploadFileHandler = async (e, forImages) => {
  //   const file = e.target.files[0];
  //   const bodyFormData = new FormData();
  //   bodyFormData.append('file', file);
  //   try {
  //     dispatch({ type: 'UPLOAD_REQUEST' });
  //     const { data } = await axios.post('/api/upload', bodyFormData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         authorization: `Bearer ${userInfo.token}`,
  //       },
  //     });
  //     dispatch({ type: 'UPLOAD_SUCCESS' });

  //     if (forImages) {
  //       setImages([...images, data.secure_url]);
  //     } else {
  //       setImage(data.secure_url);
  //     }
  //     toast.success('Image uploaded successfully. Update to apply.');
  //   } catch (err) {
  //     toast.error(getError(err));
  //     dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
  //   }
  // };
  // const deleteFileHandler = async (fileName, f) => {
  //   console.log(fileName, f);
  //   console.log(images);
  //   console.log(images.filter((x) => x !== fileName));
  //   setImages(images.filter((x) => x !== fileName));
  //   toast.success('Image removed successfully. Update to apply.');
  // };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Devotional ${devotionalId}</title>
      </Helmet>
      <h1>Edit Devotional {devotionalId}</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="bibleVersion">
            <Form.Label>Bible Version</Form.Label>
            <Form.Control
              value={bibleVersion}
              onChange={(e) => setBibleVersion(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="bibleReading">
            <Form.Label>Bible Reading</Form.Label>
            <Form.Control
              value={bibleReading}
              onChange={(e) => setBibleReading(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="bible">
            <Form.Label>Bible</Form.Label>
            <Form.Control
              value={bible}
              onChange={(e) => setBible(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="devotional">
            <Form.Label>Devotional</Form.Label>
            <Form.Control
              value={devotional}
              onChange={(e) => setDevotional(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="quoteAuthor">
            <Form.Label>Quote Author</Form.Label>
            <Form.Control
              value={quoteAuthor}
              onChange={(e) => setQuoteAuthor(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="quote">
            <Form.Label>Quote</Form.Label>
            <Form.Control
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="bookId">
            <Form.Label>Book Id</Form.Label>
            <Form.Control
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              required
            />
          </Form.Group>

          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
}
