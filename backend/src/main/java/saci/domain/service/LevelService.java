package saci.domain.service;

import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import saci.domain.model.Level;
import saci.domain.service.exceptions.AlreadyExistsException;
import saci.domain.service.exceptions.NotFoundException;
import saci.infrastructure.LevelRepository;

@Service
@RequiredArgsConstructor
public class LevelService {

    private final LevelRepository levelRepository;

    public Level createLevel(Level level) {
        Optional<Level> optionalLevel = levelRepository.findByName(level.getName());
        if (optionalLevel.isPresent()) {
            throw new AlreadyExistsException("Level name already exists");
        }
        return levelRepository.save(level);
    }

    public List<Level> getLevels() {
        return levelRepository.findAll();
    }

    public void deleteLevelById(long levelId) {
        Optional<Level> level = levelRepository.findById(levelId);
        if (level.isPresent()) {
            levelRepository.deleteById(levelId);
        } else {
            throw new NotFoundException("Level not found with ID: " + levelId);
        }
    }

    public Optional<Level> findById(long levelId) {
        return levelRepository.findById(levelId);
    }

    public List<Level> getLevelsByRoleId(Long roleId) {
        return levelRepository.findByRoleId(roleId);
    }
}
