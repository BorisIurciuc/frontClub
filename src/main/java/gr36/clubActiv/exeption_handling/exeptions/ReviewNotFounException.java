package gr36.clubActiv.exeption_handling.exeptions;

public class ReviewNotFounException extends RuntimeException {

//  public ReviewNotFounException(String reviewNotFound) {
//  }

  public ReviewNotFounException(Long activity_id) {
    super(String.format("Review with id %d not found", activity_id));
  }

}
