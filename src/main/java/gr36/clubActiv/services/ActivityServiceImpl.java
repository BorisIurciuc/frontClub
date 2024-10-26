package gr36.clubActiv.services;

import gr36.Images;
import gr36.clubActiv.domain.dto.ActivityDto;
import gr36.clubActiv.domain.entity.Activity;
import gr36.clubActiv.domain.entity.User;
import gr36.clubActiv.exeption_handling.exeptions.ActivityCreationException;
import gr36.clubActiv.exeption_handling.exeptions.ActivityNotFoundException;
import gr36.clubActiv.exeption_handling.exeptions.UserNotFoundException;
import gr36.clubActiv.repository.ActivityRepository;
import gr36.clubActiv.repository.UserRepository;
import gr36.clubActiv.services.interfaces.ActivityService;
import gr36.clubActiv.services.mapping.ActivityMappingService;

import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ActivityServiceImpl implements ActivityService {

  private final ActivityRepository repository;
  private final ActivityMappingService mappingService;
  private final UserRepository userRepository;
  private static final Logger log = LoggerFactory.getLogger(ActivityServiceImpl.class);
  private final ActivityRepository activityRepository;


  public ActivityServiceImpl(ActivityRepository repository, ActivityMappingService mappingService,
      UserRepository userRepository, ActivityRepository activityRepository) {
    this.repository = repository;
    this.mappingService = mappingService;
    this.userRepository = userRepository;
    this.activityRepository = activityRepository;
  }

  private String getRandomImage() {
    Images images = new Images();
    return images.getRandomImage();
  }

  @Override
  @Transactional
  public ActivityDto create(ActivityDto activityDto, User author) {
    Optional<Activity> activityToCheck = activityRepository.findByTitle(activityDto.getTitle());
    if (activityToCheck.isPresent()) {
      throw new ActivityCreationException(
          "This activity - " + activityDto.getTitle() + ", already exists");
    }

    try {
      Activity activity = new Activity();
      activity.setTitle(activityDto.getTitle());
      activity.setDescription(activityDto.getDescription());
      activity.setStartDate(activityDto.getStartDate());
      if (activityDto.getImage() != null && !activityDto.getImage().isEmpty()) {
        activity.setImage(activityDto.getImage());
        log.info("Image provided: " + activityDto.getImage());
      } else {
        activity.setImage(getRandomImage());
        log.info("No image provided, using random image: " + activity.getImage());
      }

      activity.setAddress(activityDto.getAddress());
      activity.setAuthor(author);

      repository.save(activity);
      return new ActivityDto(activity);

    } catch (Exception e) {
      throw new ActivityCreationException("Error while creating activity: " + e.getMessage());
    }
  }
  @Override
  public List<ActivityDto> getAllActivities() {
    return repository.findAll().stream()
        .map(mappingService::mapEntityToDto)
        .toList();
  }
  @Override
  public ActivityDto getActivityById(Long id) {
    Activity activity = repository.findById(id)
        .orElseThrow(() -> new ActivityNotFoundException(id));
    return mappingService.mapEntityToDto(activity);
  }
  @Override
  @Transactional
  public ActivityDto update(Long id, ActivityDto dto) {
    Activity activity = repository.findById(id)
        .orElseThrow(() -> new ActivityNotFoundException(id));

    if (dto.getTitle() != null) {
      activity.setTitle(dto.getTitle());
    }
    if (dto.getAddress() != null) {
      activity.setAddress(dto.getAddress());
    }
    if (dto.getStartDate() != null) {
      activity.setStartDate(dto.getStartDate());
    }
    if (dto.getImage() != null) {
      activity.setImage(dto.getImage());
    }
    if (dto.getDescription() != null) {
      activity.setDescription(dto.getDescription());
    }
    repository.save(activity);
    return new ActivityDto(activity);
  }

  @Override
  @Transactional
  public void deleteActivity(Long id) {
    Activity activity = repository.findById(id)
        .orElseThrow(() -> new ActivityNotFoundException(id));
    repository.delete(activity);
  }

  @Override
  @Transactional
  public ActivityDto addUserToActivity(Long activityId, String username) {
    Activity activity = repository.findById(activityId)
        .orElseThrow(() -> new ActivityNotFoundException(activityId));
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UserNotFoundException(username));

    // Проверка на то, является ли пользователь автором активности
    if (activity.getAuthor().getId().equals(user.getId())) {
      throw new IllegalArgumentException("Автор активности не может добавлять себя в свою же активность.");
    }

    // Проверка на то, состоит ли пользователь уже в активности
    if (activity.getUsers().contains(user)) {
      throw new IllegalArgumentException("Пользователь уже зарегистрирован в этой активности.");
    }

    // Если пользователь не автор и не состоит в активности, добавляем его
    activity.addUser(user);
    repository.save(activity);

    return mappingService.mapEntityToDto(activity);
  }



  @Override
  public List<ActivityDto> getActivitiesByUserId(Long userId) {
    List<Activity> activities = repository.findByUsersId(userId);
    return activities.stream()
        .map(mappingService::mapEntityToDto)
        .toList();
  }


  @Transactional
  public void removeUserFromActivity(Long activityId, String username) {
    Activity activity = activityRepository.findById(activityId)
        .orElseThrow(() -> new ActivityNotFoundException(activityId));
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UserNotFoundException(username));

    if (!activity.getUsers().contains(user)) {
      throw new IllegalArgumentException("User is not registered for this activity.");
    }

    activity.getUsers().remove(user);
    activityRepository.save(activity);
  }

  public boolean isUserRegistered(Long activityId, String username) {
    Activity activity = repository.findById(activityId)
        .orElseThrow(() -> new ActivityNotFoundException(activityId));
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UserNotFoundException(username));

    return activity.getUsers().contains(user);
  }
  @Override
  public List<Long> getUserRegisteredActivities(String username) {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UserNotFoundException("User not found"));

    return user.getActivities().stream()
        .map(Activity::getId)
        .collect(Collectors.toList());
  }

  @Override
  public List<ActivityDto> getActivitiesByAuthor(Long authorId) {
    List<Activity> activities = activityRepository.findByAuthorId(authorId);
    return activities.stream()
        .map(mappingService::mapEntityToDto)
        .collect(Collectors.toList());
  }

  @Override
  public String getActivityAuthorUsername(Long activityId) {
    Activity activity = repository.findById(activityId)
        .orElseThrow(() -> new ActivityNotFoundException(activityId));

    if (activity.getAuthor() == null) {
      throw new IllegalStateException("Activity " + activityId + " has no author");
    }

    return activity.getAuthor().getUsername();
  }

}
