# Kids Homework — Educational Exercise Platform

A personal portfolio project focused on building an interactive educational platform for children.

The goal is to provide a simple and engaging environment where children can practice academic skills through interactive exercises, receive immediate feedback, and eventually track their progress.

The project is being developed incrementally, with an emphasis on **clean architecture, domain-driven design principles, test-driven development, and maintainable code**.

## Tech Stack

**Backend**
- Java 21
- Spring Boot 4
- Maven
- Lombok
- Spring Web MVC

**Testing**
- JUnit 6
- Mockito
- Spring Boot Test
- MockMvc

**Frontend**
- React and TypeScript (planned)

**Persistence**
- In-memory repository using `ConcurrentHashMap`
- Persistent storage planned for future development

## Current Features

### Addition Exercises

The application currently supports:

- Generating exercises with two random integers between 1 and 10.
- Assigning a unique UUID to each exercise.
- Submitting an answer for a generated exercise.
- Validating answers and returning immediate feedback.
- Returning HTTP 404 when an exercise does not exist.

### REST API

**Create an addition exercise**

`POST /api/additions`

Example response (`201 Created`):

```json
{
  "exerciseId": "550e8400-e29b-41d4-a716-446655440000",
  "firstOperand": 3,
  "secondOperand": 8
}
```

**Submit an answer**

`POST /api/additions/{exerciseId}/answer`

Example request:

```json
{
  "answer": 11
}
```

Example response (`200 OK`):

```json
{
  "correct": true
}
```

An unknown exercise identifier results in `404 Not Found`.

## Architecture

The backend follows a layered architecture inspired by Domain-Driven Design (DDD).

```text
src/main/java/com/pierreo/projet_devoir_po/
├── api/
│   └── addition/
├── application/
│   └── addition/
├── domain/
│   └── addition/
└── infra/
    └── addition/
```

**Domain:** Contains the exercise model, answer validation logic, exercise generator, and repository contract.

**Application:** Coordinates use cases such as exercise creation and answer verification.

**Infrastructure:** Implements persistence mechanisms and configures Spring dependency injection.

**API:** Exposes REST endpoints, manages request and response objects, and maps application exceptions to HTTP responses.

The architecture aims to keep business rules independent of frameworks and infrastructure implementations.

## Design Principles

The project emphasizes:

- **Single Responsibility Principle (SRP):** Each component has a focused responsibility.
- **Dependency Inversion Principle (DIP):** Application services depend on repository contracts rather than concrete persistence implementations.
- **Test-Driven Development (TDD):** Features are developed using the Red–Green–Refactor workflow.
- **Dependency Injection:** Dependencies are assembled through explicit Spring configuration.
- **Separation of Concerns:** Business logic, application orchestration, infrastructure, and HTTP concerns are kept separate.

## Running the Application

### Prerequisites

- JDK 21
- Git

The Maven Wrapper is included, so a separate Maven installation is not required.

### Clone the Repository

```bash
git clone https://github.com/Pierreo1991/projet-devoirs.git
cd projet-devoirs
```

### Run the Backend

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

On Linux or macOS:

```bash
./mvnw spring-boot:run
```

By default, the API is available at:

`http://localhost:8080`

## Running Tests

On Windows:

```powershell
.\mvnw.cmd clean test
```

On Linux or macOS:

```bash
./mvnw clean test
```

The test suite includes unit tests, Spring MVC controller tests, Spring context tests, repository tests, and an integration test covering the complete addition exercise workflow.

The integration test creates an exercise, retrieves its generated operands, calculates the expected answer, and submits that answer through the API.

## Roadmap

Planned improvements include:

- [x] Addition exercise generation
- [x] Answer validation
- [x] REST API
- [x] Automated unit and integration tests
- [ ] Subtraction exercises
- [ ] Multiplication and division exercises
- [ ] React and TypeScript user interface
- [ ] Exercise difficulty levels
- [ ] User profiles
- [ ] Progress tracking
- [ ] Persistent database storage

## Project Status

**In active development.**

The addition exercise backend is functional and tested. The user interface and additional educational features are planned for future iterations.