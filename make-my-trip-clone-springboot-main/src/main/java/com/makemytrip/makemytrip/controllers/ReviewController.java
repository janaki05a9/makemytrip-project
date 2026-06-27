package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestParam String userId,
                                        @RequestParam String userName,
                                        @RequestParam String targetId,
                                        @RequestParam String targetType,
                                        @RequestParam int rating,
                                        @RequestParam String comment,
                                        @RequestParam(required = false) String photoUrl) {
        return reviewService.addReview(userId, userName, targetId, targetType, rating, comment, photoUrl);
    }

    @GetMapping("/get/{targetId}")
    public ResponseEntity<?> getReviews(@PathVariable String targetId,
                                         @RequestParam(defaultValue = "newest") String sortBy) {
        return reviewService.getReviews(targetId, sortBy);
    }

    @PostMapping("/reply/{reviewId}")
    public ResponseEntity<?> addReply(@PathVariable String reviewId,
                                       @RequestParam String userId,
                                       @RequestParam String userName,
                                       @RequestParam String comment) {
        return reviewService.addReply(reviewId, userId, userName, comment);
    }

    @PostMapping("/helpful/{reviewId}")
    public ResponseEntity<?> markHelpful(@PathVariable String reviewId) {
        return reviewService.markHelpful(reviewId);
    }

    @PostMapping("/flag/{reviewId}")
    public ResponseEntity<?> flagReview(@PathVariable String reviewId) {
        return reviewService.flagReview(reviewId);
    }
}
