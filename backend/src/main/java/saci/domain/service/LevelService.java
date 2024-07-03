package saci.domain.service;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import saci.domain.model.Level;
import saci.domain.service.exceptions.AlreadyExistsException;
import saci.domain.service.exceptions.CoefficientOverlapException;
import saci.domain.service.exceptions.NotFoundException;
import saci.domain.service.validators.LevelValidator;
import saci.infrastructure.LevelRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class LevelService {

    private final LevelRepository levelRepository;

    public void deleteLevelById(long levelId) {
        Optional<Level> level = levelRepository.findById(levelId);
        if (level.isPresent()) {
            levelRepository.deleteById(levelId);
        } else {
            log.error("Level not found with ID: {}", levelId);
            throw new NotFoundException("Level not found with ID: " + levelId);
        }
    }

    public List<Level> getSortedLevelsByRoleIdAsc(Long roleId) {
        List<Level> levels = levelRepository.findSortedLevelsByRoleId(roleId);
        if (levels.isEmpty()) {
            String message = "No levels found for role ID: " + roleId;
            log.error(message);
            throw new NotFoundException(message);
        }
        return levels;
    }

    public Level createLevel(Level level) {
        int overlappingLevels =
                levelRepository.overlappingLevelsCounter(
                        level.getRoleId(), level.getMinCoefficient(), level.getMaxCoefficient());

        if (!LevelValidator.levelIsValid(level, overlappingLevels)) {
            String messagelevel =
                    "Error Creating the Level: Overlapping Coefficients or Invalid Coefficients";
            log.error(messagelevel);
            throw new CoefficientOverlapException(messagelevel);
        }
        Optional<Level> optionalLevel = levelRepository.findByName(level.getName());
        if (optionalLevel.isPresent()) {
            String messagelevels = "Level name already exists: " + level.getName();
            log.error(messagelevels, level.getName());
            throw new AlreadyExistsException(messagelevels);
        }
        return levelRepository.save(level);
    }

    public Optional<Level> findLevelByScore(Long roleId, double score) {
        return levelRepository.findLevelByRoleIdAndScore(roleId, score);
    }

    public Optional<Level> findNextLevelBasedOfScore(Long roleId, double score) {
        return levelRepository.findNextLevelByRoleIdAndScore(roleId, score);
    }
}
