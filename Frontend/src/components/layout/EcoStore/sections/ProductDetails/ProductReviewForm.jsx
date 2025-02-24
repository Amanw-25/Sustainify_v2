import React, { useState } from 'react';
import { Rating, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../../../config';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please login to add a review');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${BASE_URL}/product/review/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'Success') {
        toast.success('Review added successfully');
        setRating(5);
        setComment('');
        onReviewAdded?.(data.review);
      } else {
        toast.error(data.message || 'Failed to add review');
      }
    } catch (error) {
      toast.error('Error adding review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Rating
            value={rating}
            onChange={(_, value) => setRating(value)}
            size="large"
          />
        </div>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts..."
          required
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;