package gr36.clubActiv.exeption_handling;

import gr36.clubActiv.exeption_handling.exeptions.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(ActivityNotFoundException.class)
  public ResponseEntity<Response> handleException(ActivityNotFoundException e) {
    log.error("ActivityNotFoundException occurred: {}", e.getMessage());

    Response response = new Response(e.getMessage(), HttpStatus.NOT_FOUND.value());
    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<Response> handleException(UserNotFoundException e) {
    log.error("UserNotFoundException occurred: {}", e.getMessage());

    Response response = new Response(e.getMessage(), HttpStatus.NOT_FOUND.value());
    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(ActivityCreationException.class)
  public ResponseEntity<Response> handleException(ActivityCreationException e) {
    log.error("ActivityCreationException occurred: {}", e.getMessage());

    Response response = new Response(e.getMessage(), HttpStatus.BAD_REQUEST.value());
    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(UserAlreadyExistsException.class)
  public ResponseEntity<Response> handleException(UserAlreadyExistsException e) {
    log.error("UserAlreadyExistsException occurred: {}", e.getMessage());

    String detailedMessage = String.format("User with the provided email already exists: %s", e.getMessage());
    Response response = new Response(detailedMessage, HttpStatus.CONFLICT.value());
    return new ResponseEntity<>(response, HttpStatus.CONFLICT);
  }

  @ExceptionHandler(RoleNotFoundException.class)
  public ResponseEntity<Response> handleException(RoleNotFoundException e) {
    log.error("RoleNotFoundException occurred: {}", e.getMessage());

    Response response = new Response(e.getMessage(), HttpStatus.NOT_FOUND.value());
    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(AuthenticationFailedException.class)
  public ResponseEntity<Response> handleAuthenticationFailed(AuthenticationFailedException e) {
    log.error("AuthenticationFailedException occurred: {}", e.getMessage());
    Response response = new Response(e.getMessage(), HttpStatus.UNAUTHORIZED.value());
    return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(TokenRefreshException.class)
  public ResponseEntity<Response> handleTokenRefreshException(TokenRefreshException e) {
    log.error("TokenRefreshException occurred: {}", e.getMessage());
    Response response = new Response(e.getMessage(), HttpStatus.BAD_REQUEST.value());
    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ConfirmationFailedException.class)
  public ResponseEntity<Response> handleException(ConfirmationFailedException e) {
    log.error("ConfirmationFailedException occurred: {}", e.getMessage());

    Response response = new Response(e.getMessage(), HttpStatus.BAD_REQUEST.value());
    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
  }

  //NewsNotFoundException

  @ExceptionHandler(NewsNotFoundException.class)
  public ResponseEntity<Response> handleException(NewsNotFoundException e) {
    log.error("NewsNotFoundException occurred: {}", e.getMessage());

    Response response = new Response(e.getMessage(), HttpStatus.NOT_FOUND.value());
    return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
  }
}
