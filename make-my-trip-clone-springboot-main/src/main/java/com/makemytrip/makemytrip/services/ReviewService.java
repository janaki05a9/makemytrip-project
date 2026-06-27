package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public ResponseEntity<?> addReview(String userId, String userName, String targetId,
                                        String targetType, int rating, String comment, String photoUrl) {
        Review review = new Review();
        review.setUserId(userId);
        review.setUserName(userName);
        review.setTargetId(targetId);
        review.setTargetType(targetType);
        review.setRating(rating);
        review.setComment(comment);
        review.setPhotoUrl(photoUrl);
        review.setCreatedAt(LocalDateTime.now().toString());
        review.setHelpfulCount(0);
        review.setFlagged(false);
        reviewRepository.save(review);
        return ResponseEntity.ok(review);
    }

    public ResponseEntity<?> getReviews(String targetId, String sortBy) {
        List<Review> reviews = reviewRepository.findByTargetId(targetId);
        reviews = reviews.stream().filter(r -> !r.isFlagged()).toList();
        if (sortBy.equals("highest")) {
            reviews = reviews.stream().sorted(Comparator.comparingInt(Review::getRating).reversed()).toList();
        } else if (sortBy.equals("helpful")) {
            reviews = reviews.stream().sorted(Comparator.comparingInt(Review::getHelpfulCount).reversed()).toList();
        } else {
            reviews = reviews.stream().sorted(Comparator.comparing(Review::getCreatedAt).reversed()).toList();
        }
        return ResponseEntity.ok(reviews);
    }

    public ResponseEntity<?> addReply(String reviewId, String userId, String userName, String comment) {
        Optional<Review> optional = reviewRepository.findById(reviewId);
        if (optional.isEmpty()) return ResponseEntity.badRequest().body("Review not found");
        Review review = optional.get();
        Review.Reply reply = new Review.Reply();
        reply.setUserId(userId);
        reply.setUserName(userName);
        reply.setComment(comment);
        reply.setCreatedAt(LocalDateTime.now().toString());
        review.getReplies().add(reply);
        reviewRepository.save(review);
        return ResponseEntity.ok(review);
    }

    public ResponseEntity<?> markHelpful(String reviewId) {
        Optional<Review> optional = reviewRepository.findById(reviewId);
        if (optional.isEmpty()) return ResponseEntity.badRequest().body("Review not found");
        Review review = optional.get();
        review.setHelpfulCount(review.getHelpfulCount() + 1);
        reviewRepository.save(review);
        return ResponseEntity.ok(review);
    }

    public ResponseEntity<?> flagReview(String reviewId) {
        Optional<Review> optional = reviewRepository.findById(reviewId);
        if (optional.isEmpty()) return ResponseEntity.badRequest().body("Review not found");
        Review review = optional.get();
        review.setFlagged(true);
        reviewRepository.save(review);
        return ResponseEntity.ok("Review flagged");
    }
}