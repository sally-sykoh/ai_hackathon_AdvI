import { getLectures, uploadLecture, generateQuestions, startSession, sendMessage } from "./api";

const STUDENT_ID = "alex";

const SEED_LECTURE = {
  lectureId: "lec4",
  title: "Functions",
  content: `This lecture covers functions in C++ — one of the foundational building blocks of structured programming.

Key Topics:

1) Pass-by-Value vs Pass-by-Reference — Pass-by-value copies the argument into the parameter; changes inside the function do not affect the caller. Pass-by-reference (using &) passes the actual variable; modifications inside the function persist after the call. Use const& to avoid copying large objects without allowing mutation.

2) For Loops vs While Loops — A for loop is ideal when the number of iterations is known (initializer, condition, and increment on one line). A while loop is better when the exit condition is not count-based (e.g., reading input until EOF). A do-while loop guarantees at least one execution of the body.

3) Header Files (.h) and Source Files (.cpp) — Header files contain declarations (function prototypes, class definitions, constants). Source files contain implementations. This separation enables separate compilation: changing a .cpp file only requires recompiling that file. Include guards (#ifndef / #define / #endif) or #pragma once prevent double inclusion.

4) Function Prototypes — Declaring a function's signature before its definition allows the compiler to check calls before seeing the full implementation. Prototypes typically go in header files.

5) Scope and Lifetime — Local variables exist only within their enclosing block. Parameters are local to the function. Global variables are accessible everywhere but should be avoided. Static local variables persist across calls.

6) Default Arguments — C++ allows default parameter values (e.g., void print(int x, int base = 10)). Defaults must be specified from right to left and are typically declared in the header file.`,
};

const DEMO_ANSWERS = [
  "Pass-by-value copies the argument so changes inside the function don't affect the original. Pass-by-reference uses & and modifies the original variable directly. I'd use const& for large objects I don't want to modify.",
  "A for loop is best when you know the iteration count — initializer, condition, and increment are all in one line. A while loop is better for unknown iterations, like reading until EOF. There's also do-while which runs at least once.",
];

export async function ensureSeeded() {
  try {
    const lectures = await getLectures();
    const exists = lectures.some((l) => l.lecture_id === SEED_LECTURE.lectureId);
    if (exists) return true;
  } catch {
    return false;
  }

  try {
    await uploadLecture(
      SEED_LECTURE.lectureId,
      SEED_LECTURE.title,
      SEED_LECTURE.content
    );
    await generateQuestions(SEED_LECTURE.lectureId, 3);

    // Pre-answer the first 2 questions so the demo starts with 1 remaining
    await startSession(STUDENT_ID, SEED_LECTURE.lectureId);
    for (const answer of DEMO_ANSWERS) {
      await sendMessage(STUDENT_ID, SEED_LECTURE.lectureId, answer);
    }

    return true;
  } catch {
    return false;
  }
}
