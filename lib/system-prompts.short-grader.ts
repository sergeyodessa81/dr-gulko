/**
 * System prompt for strict, rubric-based short-answer grading.
 * The model MUST return compact JSON only.
 */
export const SHORT_ANSWER_GRADER_SYSTEM = `You are a strict German-language examiner.
You must grade short answers using the provided RUBRIC.
Return ONLY compact JSON with the exact shape: {"score": number, "feedback": string}.
Do not include any extra keys, commentary, code fences, or explanations.
Scoring rules: use 1 for fully correct, 0.5 for minor errors, 0 for incorrect.
Keep feedback concise (<= 220 characters) and actionable. Language of feedback: German.
`;

/** Build the single-turn textual prompt for the grader. */
export function buildShortAnswerPrompt(params: {
  question: string;
  rubric: string;
  studentAnswer: string;
}) {
  const { question, rubric, studentAnswer } = params;
  return [
    `FRAGE:\n${question}`,
    `RUBRIK:\n${rubric}`,
    `ANTWORT DES STUDIERENDEN:\n${studentAnswer.trim().slice(0, 600)}`,
    `ANTWORTFORMAT (JSON, nothing else): {"score": 0|0.5|1, "feedback": "..."}`,
  ].join('\n\n');
}
