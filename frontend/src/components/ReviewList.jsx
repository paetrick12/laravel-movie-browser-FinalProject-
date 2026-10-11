import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { createReview, deleteReview, getReviews, updateReview } from '../services/reviewService';
import { errorMessage } from '../services/api';
import ReviewForm from './ReviewForm';

export default function ReviewList({ movieId }) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getReviews(movieId, controller.signal)
      .then((data) => { if (!controller.signal.aborted) { setReviews(data); setError(''); } })
      .catch((failure) => { if (!controller.signal.aborted) { setError(errorMessage(failure)); } })
      .finally(() => { if (!controller.signal.aborted) { setLoading(false); } });
    return () => controller.abort();
  }, [movieId, retryCount]);

  async function create(data) {
    const result = await createReview(movieId, data);
    setReviews((current) => [result.data, ...current]);
    setNotice(result.message);
  }

  async function update(id, data) {
    const result = await updateReview(id, data);
    setReviews((current) => current.map((review) => review.id === id ? result.data : review));
    setEditing(null);
    setNotice(result.message);
  }

  async function remove(id) {
    setDeleting(id);
    setError('');
    try {
      const result = await deleteReview(id);
      setReviews((current) => current.filter((review) => review.id !== id));
      setNotice(result.message);
    } catch (failure) { setError(errorMessage(failure)); }
    finally { setDeleting(null); }
  }

  return (
    <section className="mt-12 border-t border-line pt-8">
      <h2>Reviews</h2>
      {notice && <p className="text-forest" role="status">{notice}</p>}
      {loading && <p role="status">Loading reviews...</p>}
      {error && <p role="alert">{error} <button className="text-link" onClick={() => { setLoading(true); setRetryCount((count) => count + 1); }}>Retry</button></p>}
      {!loading && !error && reviews.length === 0 && <p className="text-muted">No reviews yet.</p>}
      <div className="mb-6 flex flex-col gap-4">
        {reviews.map((review) => (
          <article className="rounded-xl border border-line bg-paper p-5" key={review.id}>
            {editing === review.id && user?.id === review.user_id ? (
              <ReviewForm key={review.id} review={review} onSave={(data) => update(review.id, data)} onCancel={() => setEditing(null)} />
            ) : (
              <>
                <h3>{review.user.name} · {review.rating} / 5</h3>
                <p className="text-sm text-muted"><time dateTime={review.created_at}>{new Date(review.created_at).toLocaleDateString()}</time></p>
                <p className="whitespace-pre-wrap break-words">{review.comment}</p>
                {user?.id === review.user_id && <div className="flex gap-4">
                  <button className="text-link" disabled={deleting !== null} onClick={() => setEditing(review.id)}>Edit</button>
                  <button className="text-link" disabled={deleting !== null} onClick={() => remove(review.id)}>{deleting === review.id ? 'Deleting...' : 'Delete'}</button>
                </div>}
              </>
            )}
          </article>
        ))}
      </div>
      {authLoading ? <p>Checking login...</p> : user ? <ReviewForm key={user.id} onSave={create} /> : <p><Link className="text-link" to="/login">Log in to leave a review.</Link></p>}
    </section>
  );
}
