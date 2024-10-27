package gr36.clubActiv.exeption_handling.exeptions;

public class NewsNotFoundException extends RuntimeException {

  public NewsNotFoundException(Long id) {
    super(String.format("News with id %d not found", id));
  }

}
