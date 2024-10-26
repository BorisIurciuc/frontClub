package gr36.clubActiv.controller;

import gr36.clubActiv.domain.dto.ActivityDto;
import gr36.clubActiv.domain.entity.User;
import gr36.clubActiv.exeption_handling.exeptions.ActivityNotFoundException;
import gr36.clubActiv.exeption_handling.exeptions.UserNotFoundException;
import gr36.clubActiv.repository.ActivityRepository;
import gr36.clubActiv.services.interfaces.ActivityService;
import gr36.clubActiv.services.interfaces.UserService;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import gr36.clubActiv.domain.entity.Activity;

import java.util.List;

//@CrossOrigin(origins = "http://localhost:5173")
//comment to test
@RestController
@RequestMapping("/api/activity")
public class ActivityController {

  private final ActivityService service;
  private final UserService userService;
  private static final Logger log = LoggerFactory.getLogger(ActivityController.class);
  private final ActivityRepository activityRepository;

  public ActivityController(ActivityService service, UserService userService,
      ActivityRepository activityRepository) {
    this.service = service;
    this.userService = userService;
    this.activityRepository = activityRepository;
  }

  @PostMapping
  public ResponseEntity<ActivityDto> create(@RequestBody ActivityDto activityDto,
      Authentication authentication) {
    log.info("Creating new activity: {}", activityDto);
    String username = authentication.getName();
    User author = userService.findByUsername(username)
        .orElseThrow(() -> new UserNotFoundException("User not found"));
    ActivityDto createdActivity = service.create(activityDto, author);
    log.info("Activity created successfully with ID: {}", createdActivity.getId());
    return ResponseEntity.status(HttpStatus.CREATED).body(createdActivity);
  }

  @GetMapping
  public List<ActivityDto> getAllActivities() {
    log.info("Fetching all activities");
    return service.getAllActivities();
  }

  @GetMapping("/{id}")
  public ResponseEntity<ActivityDto> getActivityById(@PathVariable Long id) {
    log.info("Fetching activity by ID: {}", id);
    ActivityDto activity = service.getActivityById(id);
    return ResponseEntity.ok(activity);
  }

  @PutMapping("/update/{id}")
  public ResponseEntity<?> update(@PathVariable("id") Long id, @RequestBody ActivityDto dto,
      Authentication authentication) {
    String currentUsername = authentication.getName();
    ActivityDto activity = service.getActivityById(id);
    User currentUser = userService.findByUsername(currentUsername)
        .orElseThrow(() -> new UserNotFoundException("User not found"));
    boolean isAuthor =
        activity.getAuthorId() != null && activity.getAuthorId().equals(currentUser.getId());

    boolean isAdmin = authentication.getAuthorities().stream()
        .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

    if (!isAdmin && !isAuthor) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
          .body("You are not authorized to update this activity");
    }

    ActivityDto updatedActivity = service.update(id, dto);
    return ResponseEntity.ok(updatedActivity);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable Long id, Authentication authentication) {
    String currentUsername = authentication.getName();
    ActivityDto activity = service.getActivityById(id);
    User currentUser = userService.findByUsername(currentUsername)
        .orElseThrow(() -> new RuntimeException("User not found"));

    boolean isAuthor =
        activity.getAuthorId() != null && activity.getAuthorId().equals(currentUser.getId());
    boolean isAdmin = authentication.getAuthorities().stream()
        .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

    if (!isAdmin && !isAuthor) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
          .body("You are not authorized to delete this activity");
    }

    service.deleteActivity(id);
    log.info("Activity with ID {} deleted successfully.", id);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/{activity_id}/add-user")
  public ResponseEntity<?> addUserToActivity(@PathVariable Long activity_id, Authentication authentication) {
    String username = authentication.getName();
    try {
      ActivityDto updatedActivity = service.addUserToActivity(activity_id, username);
      return ResponseEntity.ok(updatedActivity);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
    }
  }



  @GetMapping("/my-activities")
  public ResponseEntity<List<ActivityDto>> getMyActivities(Authentication authentication) {
    String username = authentication.getName();
    User user = userService.findByUsername(username)
        .orElseThrow(() -> new UserNotFoundException("User not found"));
    List<ActivityDto> activities;
    activities = service.getActivitiesByUserId(user.getId());
    return ResponseEntity.ok(activities);
  }

  @DeleteMapping("/{activity_id}/remove-user")
  public ResponseEntity<?> removeUserFromActivity(@PathVariable Long activity_id,
      Authentication authentication) {
    String currentUsername = authentication.getName();
    User currentUser = userService.findByUsername(currentUsername)
        .orElseThrow(() -> new UserNotFoundException("User not found"));

    Activity activity = activityRepository.findById(activity_id)
        .orElseThrow(() -> new ActivityNotFoundException(activity_id));

    boolean isAuthor =
        activity.getAuthor() != null && activity.getAuthor().getId().equals(currentUser.getId());

    boolean isAdmin = authentication.getAuthorities().stream()
        .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN"));

    boolean isParticipant = activity.getUsers().stream()
        .anyMatch(user -> user.getId().equals(currentUser.getId()));

    log.info("Checking authorization for user: {}, isAdmin: {}, isAuthor: {}, isParticipant: {}",
        currentUsername, isAdmin, isAuthor, isParticipant);

    if (!isAdmin && !isAuthor && !isParticipant) {
      log.warn("User {} is not authorized to remove users from activity {}", currentUsername,
          activity_id);
      return ResponseEntity.status(HttpStatus.FORBIDDEN)
          .body("You are not authorized to remove users from this activity.");
    }

    try {
      service.removeUserFromActivity(activity_id, currentUsername);
      log.info("User {} has been removed from the activity {}", currentUsername, activity_id);
      return ResponseEntity.ok("You have successfully removed yourself from the activity.");
    } catch (IllegalArgumentException e) {
      log.error("Error removing user from activity: {}", e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
  }

  @GetMapping("/{id}/is-registered")
  public ResponseEntity<Boolean> isUserRegistered(@PathVariable Long id,
      Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
      log.info("User is not authenticated");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
    }

    String currentUsername = authentication.getName();
    log.info("Authenticated user: {}", currentUsername);

    boolean isRegistered = service.isUserRegistered(id, currentUsername);
    return ResponseEntity.ok(isRegistered);
  }


  @GetMapping("/user/registered-activities")
  public ResponseEntity<List<Long>> getUserRegisteredActivities(Authentication authentication) {
    String username = authentication.getName();
    User user = userService.findByUsername(username)
        .orElseThrow(() -> new UserNotFoundException("User not found"));

    List<Long> activityIds = service.getActivitiesByUserId(user.getId()).stream()
        .map(ActivityDto::getId)
        .collect(Collectors.toList());

    return ResponseEntity.ok(activityIds);
  }

  @GetMapping("/user/activities/created")
  public ResponseEntity<List<ActivityDto>> getActivitiesByAuthor(Authentication authentication) {

    String username = authentication.getName();

    User user = userService.findByUsername(username)
        .orElseThrow(() -> new UserNotFoundException("User not found"));

    List<ActivityDto> authoredActivities = service.getActivitiesByAuthor(user.getId());

    return ResponseEntity.ok(authoredActivities);
  }

  @GetMapping("/{id}/author")
  public ResponseEntity<String> getActivityAuthorUsername(@PathVariable Long id) {
    try {
      log.info("Fetching author username for activity ID: {}", id);
      String authorUsername = service.getActivityAuthorUsername(id);
      return ResponseEntity.ok(authorUsername);
    } catch (ActivityNotFoundException e) {
      log.error("Activity not found with ID: {}", id);
      return ResponseEntity.notFound().build();
    } catch (IllegalStateException e) {
      log.error("Error fetching author for activity ID {}: {}", id, e.getMessage());
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}



