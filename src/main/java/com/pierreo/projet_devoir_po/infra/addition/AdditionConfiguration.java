package com.pierreo.projet_devoir_po.infra.addition;

import com.pierreo.projet_devoir_po.application.addition.AdditionExerciseService;
import com.pierreo.projet_devoir_po.domain.addition.AdditionExerciseGenerator;
import com.pierreo.projet_devoir_po.domain.addition.AdditionExerciseRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Random;
import java.util.random.RandomGenerator;

@Configuration
public class AdditionConfiguration {

    @Bean
    public RandomGenerator randomGenerator() {
        return new Random();
    }

    @Bean
    public AdditionExerciseGenerator additionExerciseGenerator(RandomGenerator randomGenerator) {
        return new AdditionExerciseGenerator(randomGenerator);
    }

    @Bean
    public AdditionExerciseRepository additionExerciseRepository() {
        return new InMemoryAdditionExerciseRepository();
    }

    @Bean
    public AdditionExerciseService additionExerciseService(
            AdditionExerciseGenerator generator,
            AdditionExerciseRepository repository) {
        return new AdditionExerciseService(generator, repository);
    }
}
