# Rest

> A minimal Java project providing a skeleton for an arithmetic **Addition** program.

---

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Technologies Used](#technologies-used)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Running the Application](#running-the-application)
8. [API Endpoints](#api-endpoints)
9. [Usage Examples](#usage-examples)
10. [Contributing](#contributing)
11. [License](#license)

---

## Overview

**Rest** is a beginner-level Java project that defines a single class, `Addition`, with a standard `main` entry point. The project currently serves as a foundational skeleton — the class and its `main` method are in place with a placeholder comment indicating where addition logic should be implemented. It is intended as a starting point for learning Java or for extending into a more fully-featured arithmetic or REST-based application.

The repository is hosted on GitHub under the `basic` branch and was bootstrapped as part of a guided learning or code-studio workflow.

---

## Project Structure

```
Rest/
└── Addition.java       # Main Java source file containing the Addition class
```

| File            | Description                                                                                   |
|-----------------|-----------------------------------------------------------------------------------------------|
| `Addition.java` | Defines the `Addition` public class with a `main(String[] args)` entry point. Currently contains a stub comment `// Addition program` awaiting full implementation. |

---

## Technologies Used

| Technology | Version      | Purpose                          |
|------------|--------------|----------------------------------|
| Java       | Any (JDK 8+) | Primary programming language     |
| Git        | Any          | Version control                  |
| GitHub     | —            | Remote repository hosting        |

> **Framework / Build Tool:** None — this is a plain Java project with no build framework (Maven, Gradle, etc.) currently configured.

---

## Prerequisites

Before you can compile and run this project, ensure the following are installed on your machine:

- **Java Development Kit (JDK)** — version 8 or higher
  - Verify with: `java -version` and `javac -version`
  - Download from: [https://adoptium.net](https://adoptium.net) or [https://www.oracle.com/java/](https://www.oracle.com/java/)
- **Git** — for cloning the repository
  - Verify with: `git --version`
  - Download from: [https://git-scm.com](https://git-scm.com)

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ramalingam123maha-commits/Rest.git
   ```

2. **Navigate into the project directory**

   ```bash
   cd Rest
   ```

3. **Verify the source file is present**

   ```bash
   ls
   # Expected output: Addition.java
   ```

> There are no external dependencies or package managers required at this stage. No `pom.xml`, `build.gradle`, or `package.json` exists — everything compiles with the standard JDK toolchain.

---

## Configuration

This project requires **no configuration files**, environment variables, or external services at its current stage.

| Setting            | Required | Description                        |
|--------------------|----------|------------------------------------|
| `JAVA_HOME`        | Optional | Set if `javac`/`java` are not on your system `PATH` |

If needed, set `JAVA_HOME` to point to your JDK installation:

```bash
# Linux / macOS
export JAVA_HOME=/path/to/your/jdk
export PATH=$JAVA_HOME/bin:$PATH

# Windows (Command Prompt)
set JAVA_HOME=C:\path\to\your\jdk
set PATH=%JAVA_HOME%\bin;%PATH%
```

---

## Running the Application

### Step 1 — Compile the source file

```bash
javac Addition.java
```

This produces a `Addition.class` bytecode file in the same directory.

### Step 2 — Run the compiled class

```bash
java Addition
```

### Expected Output (current state)

The `main` method body currently contains only a comment placeholder:

```java
public static void main(String[] args) {
    // Addition program
}
```

Running the program will execute without errors but will produce **no output** until the addition logic is implemented.

### Full compile-and-run one-liner

```bash
javac Addition.java && java Addition
```

---

## API Endpoints

This project is **not a REST API** in its current form — it is a standalone Java command-line application. There are no HTTP endpoints, servlets, or web framework integrations present at this time.

If the project is extended into a REST API (e.g., using Spring Boot or Jakarta EE), this section should be updated with endpoint documentation in the following format:

| Method | Path          | Description                  | Request Body        | Response            |
|--------|---------------|------------------------------|---------------------|---------------------|
| `GET`  | `/add?a=&b=`  | Returns the sum of two numbers | Query params `a`, `b` | `{ "result": 5 }` |

---

## Usage Examples

### Current Skeleton Usage

```bash
# Clone the project
git clone https://github.com/ramalingam123maha-commits/Rest.git
cd Rest

# Compile
javac Addition.java

# Run (currently produces no output)
java Addition
```

### Extending the Addition Logic

To implement the addition feature, open `Addition.java` and replace the placeholder comment:

```java
public class Addition {
    public static void main(String[] args) {
        // Addition program
        int a = 10;
        int b = 20;
        int sum = a + b;
        System.out.println("Sum of " + a + " and " + b + " = " + sum);
    }
}
```

Then recompile and run:

```bash
javac Addition.java && java Addition
# Output: Sum of 10 and 20 = 30
```

### Accepting Command-Line Arguments

You can further extend the class to accept user-provided numbers:

```java
public class Addition {
    public static void main(String[] args) {
        if (args.length < 2) {
            System.out.println("Usage: java Addition <num1> <num2>");
            return;
        }
        int a = Integer.parseInt(args[0]);
        int b = Integer.parseInt(args[1]);
        System.out.println("Sum = " + (a + b));
    }
}
```

```bash
javac Addition.java && java Addition 15 27
# Output: Sum = 42
```

---

## Contributing

Contributions are welcome! To contribute to this project:

1. **Fork** the repository on GitHub.
2. **Create a new branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** — follow the existing code style and keep classes focused on single responsibilities.
4. **Commit your changes** with a clear, descriptive message:
   ```bash
   git commit -m "feat: implement addition logic with command-line argument support"
   ```
5. **Push** to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** against the `basic` branch of the original repository, describing what you changed and why.

### Coding Guidelines

- Follow standard Java naming conventions (PascalCase for classes, camelCase for methods/variables).
- Add Javadoc comments to public classes and methods.
- Write unit tests (e.g., using JUnit) for any new logic added.
- Keep commits small and focused.

---

## License

**Not specified.**

No `LICENSE` file is currently present in this repository. If you intend to open-source this project, consider adding a license. Common choices include:

- [MIT License](https://choosealicense.com/licenses/mit/) — permissive, simple
- [Apache 2.0](https://choosealicense.com/licenses/apache-2.0/) — permissive with patent protection
- [GPL v3](https://choosealicense.com/licenses/gpl-3.0/) — copyleft

Visit [https://choosealicense.com](https://choosealicense.com) to help select the right license for your needs.

---

*README generated for repository: [ramalingam123maha-commits/Rest](https://github.com/ramalingam123maha-commits/Rest) — branch `basic`*
