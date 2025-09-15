"use client"

import { useState, useEffect } from "react"
import type { MockTest, QuestionSingle, QuestionShort } from "@/types/mock-tests"

interface Answer {
  questionId: string
  answer: number | string // number for single choice (index), string for short answer
}

interface GradeResult {
  questionId: string
  score: number
  maxScore: number
  feedback?: string
}

interface GradeResponse {
  totalScore: number
  maxScore: number
  results: GradeResult[]
}

export default function MockTest001Page() {
  const [mockTest, setMockTest] = useState<MockTest | null>(null)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGrading, setIsGrading] = useState(false)
  const [gradeResults, setGradeResults] = useState<GradeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Load mock test on mount
  useEffect(() => {
    const fetchMockTest = async () => {
      try {
        const response = await fetch("/api/mock-tests/001")
        if (!response.ok) {
          throw new Error(`Failed to load test: ${response.status}`)
        }
        const data: MockTest = await response.json()
        setMockTest(data)

        // Initialize answers array
        const initialAnswers: Answer[] = data.questions.map((q) => ({
          questionId: q.id,
          answer: q.type === "single" ? -1 : "", // -1 for unselected, empty string for short
        }))
        setAnswers(initialAnswers)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load test")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMockTest()
  }, [])

  // Update answer for a question
  const updateAnswer = (questionId: string, answer: number | string) => {
    setAnswers((prev) => prev.map((a) => (a.questionId === questionId ? { ...a, answer } : a)))
  }

  // Check if all single choice questions are answered
  const canGrade = () => {
    if (!mockTest) return false

    const singleQuestions = mockTest.questions.filter((q) => q.type === "single")
    return singleQuestions.every((q) => {
      const answer = answers.find((a) => a.questionId === q.id)
      return answer && typeof answer.answer === "number" && answer.answer >= 0
    })
  }

  // Submit for grading
  const handleGrade = async () => {
    if (!mockTest || !canGrade()) return

    setIsGrading(true)
    setError(null)

    try {
      const response = await fetch("/api/mock-tests/grade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testId: mockTest.id,
          answers: answers.reduce(
            (acc, a) => {
              acc[a.questionId] = a.answer
              return acc
            },
            {} as Record<string, number | string>,
          ),
        }),
      })

      if (!response.ok) {
        throw new Error(`Grading failed: ${response.status}`)
      }

      const results: GradeResponse = await response.json()
      setGradeResults(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Grading failed")
    } finally {
      setIsGrading(false)
    }
  }

  // Get character count for short answer
  const getCharCount = (questionId: string): number => {
    const answer = answers.find((a) => a.questionId === questionId)
    return typeof answer?.answer === "string" ? answer.answer.length : 0
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    )
  }

  if (error && !mockTest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!mockTest) return null

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{mockTest.title}</h1>
        <p className="text-gray-600">Language: {mockTest.lang.toUpperCase()}</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {gradeResults && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Test Results</h2>
          <p className="text-lg mb-4">
            Total Score:{" "}
            <span className="font-bold">
              {gradeResults.totalScore}/{gradeResults.maxScore}
            </span>
          </p>

          <div className="space-y-4">
            {gradeResults.results.map((result) => {
              const question = mockTest.questions.find((q) => q.id === result.questionId)
              return (
                <div key={result.questionId} className="border-l-4 border-green-400 pl-4">
                  <p className="font-medium">
                    Question {result.questionId}: {result.score}/{result.maxScore} points
                  </p>
                  {question && <p className="text-sm text-gray-600 mb-2">{question.question}</p>}
                  {result.feedback && <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{result.feedback}</p>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="space-y-8">
        {mockTest.questions.map((question, index) => (
          <div key={question.id} className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Question {index + 1}
              {question.type === "single" && ` (${(question as QuestionSingle).points} points)`}
              {question.type === "short" && ` (${(question as QuestionShort).maxPoints} points)`}
            </h3>

            <p className="text-gray-800 mb-4">{question.question}</p>

            {question.type === "single" && (
              <div className="space-y-2">
                {(question as QuestionSingle).choices.map((choice, choiceIndex) => {
                  const currentAnswer = answers.find((a) => a.questionId === question.id)
                  const isSelected = currentAnswer?.answer === choiceIndex

                  return (
                    <label key={choiceIndex} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={choiceIndex}
                        checked={isSelected}
                        onChange={() => updateAnswer(question.id, choiceIndex)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        disabled={!!gradeResults}
                      />
                      <span className="text-gray-700">{choice}</span>
                    </label>
                  )
                })}
              </div>
            )}

            {question.type === "short" && (
              <div>
                <textarea
                  value={(answers.find((a) => a.questionId === question.id)?.answer as string) || ""}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 600) // Enforce 600 char limit
                    updateAnswer(question.id, value)
                  }}
                  placeholder="Enter your answer here..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  disabled={!!gradeResults}
                  aria-label={`Answer for: ${question.question}`}
                />
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>Character count: {getCharCount(question.id)}/600</span>
                  {(question as QuestionShort).rubric && (
                    <details className="cursor-pointer">
                      <summary className="text-blue-600 hover:text-blue-800">Scoring Rubric</summary>
                      <p className="mt-2 text-xs text-gray-600 max-w-md">{(question as QuestionShort).rubric}</p>
                    </details>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!gradeResults && (
        <div className="mt-8 text-center">
          <button
            onClick={handleGrade}
            disabled={!canGrade() || isGrading}
            className={`px-8 py-3 rounded-lg font-semibold ${
              canGrade() && !isGrading
                ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isGrading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Grading...
              </span>
            ) : (
              "Grade Test"
            )}
          </button>

          {!canGrade() && (
            <p className="mt-2 text-sm text-gray-500">Please answer all multiple choice questions to enable grading</p>
          )}
        </div>
      )}
    </div>
  )
}
