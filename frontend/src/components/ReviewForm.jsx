import { useState } from 'react';
import { errorMessage } from '../services/api';

export default function ReviewForm({ review, onSave, onCancel }) {
  const [rating, setRating] = useState(review?.rating || '');
  const [comment, setComment] = useState(review?.comment || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onSave({ rating: rating === '' ? '' : Number(rating), comment });
      if (!review) { setRating(''); setComment(''); }
    } catch (failure) { setError(errorMessage(failure)); }
    finally { setBusy(false); }
  }

  return (
    <form className="flex flex-col gap-4 rounded-xl border border-line bg-paper p-5" onSubmit={submit} noValidate>
      <h3>{review ? 'Edit your review' : 'Leave a review'}</h3>
      <label className="input-label">Rating
        <select value={rating} onChange={(event) => setRating(event.target.value)}>
          <option value="">Choose a rating</option>
          {[1, 2, 3, 4, 5].map((score) => <option key={score} value={score}>{score} / 5</option>)}
        </select>
      </label>
      <label className="input-label">Comment
        <textarea className="min-h-28 rounded-md border border-line bg-paper p-3 font-normal" value={comment} onChange={(event) => setComment(event.target.value)} />
      </label>
      <span className="text-sm text-muted">Maximum 1,000 characters.</span>
      {error && <p role="alert" className="mb-0">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button className="button" disabled={busy}>{busy ? 'Saving review...' : review ? 'Save changes' : 'Post review'}</button>
        {onCancel && <button className="text-link" type="button" disabled={busy} onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
