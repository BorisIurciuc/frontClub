package gr36.clubActiv.services;

import gr36.clubActiv.domain.entity.Response;
import gr36.clubActiv.domain.entity.Review;

import gr36.clubActiv.exeption_handling.exeptions.ReviewNotFounException;
import gr36.clubActiv.repository.ResponseRepository;
import gr36.clubActiv.repository.ReviewRepository;
import gr36.clubActiv.services.interfaces.ResponseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResponseServiceImpl implements ResponseService {

  private final ResponseRepository responseRepository;
  private final ReviewRepository reviewRepository;

  public ResponseServiceImpl(ResponseRepository responseRepository,
      ReviewRepository reviewRepository) {
    this.responseRepository = responseRepository;
    this.reviewRepository = reviewRepository;
  }

  @Override
  public Response addResponse(Long reviewId, Response response) {
    Review review = reviewRepository.findById(reviewId)
        .orElseThrow(() -> new ReviewNotFounException(reviewId));
    response.setReview(review);
    return responseRepository.save(response);
  }

  @Override
  public void deleteResponse(Long responseId) {
    responseRepository.deleteById(responseId);
  }

  @Override
  public List<Response> getResponsesByReviewId(Long reviewId) {
    return responseRepository.findByReviewId(reviewId);
  }

  @Override
  public Response findResponseById(Long responseId) {
    return responseRepository.findById(responseId).orElse(null);
  }
}
