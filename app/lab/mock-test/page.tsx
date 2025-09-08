"use client"

import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Clock, Target, RotateCcw, Play } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: "grammar" | "vocabulary" | "medical" | "conversation"
  difficulty: "beginner" | "intermediate" | "advanced"
}

interface TestResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number
  categoryScores: Record<string, { correct: number; total: number }>
}

export default function MockTestPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate")
  const supabase = createClient()

  const mockQuestions: Question[] = [
    {
      id: "1",
      question: "Welches Wort beschreibt eine Entzündung der Gelenke?",
      options: ["Arthritis", "Arthrose", "Arthroskopie", "Arthralgie"],
      correctAnswer: 0,
      explanation: "Arthritis bedeutet Gelenkentzündung, während Arthrose Gelenkverschleiß bedeutet.",
      category: "medical",
      difficulty: "intermediate",
    },
    {
      id: "2",
      question: "Wie sagt man 'I have a headache' auf Deutsch?",
      options: ["Ich habe Kopfschmerzen", "Ich bin Kopfschmerzen", "Ich mache Kopfschmerzen", "Ich tue Kopfschmerzen"],
      correctAnswer: 0,
      explanation: "Die korrekte Übersetzung ist 'Ich habe Kopfschmerzen'.",
      category: "vocabulary",
      difficulty: "beginner",
    },
    {
      id: "3",
      question: "Welcher Artikel gehört zu 'Krankenhaus'?",
      options: ["der", "die", "das", "den"],
      correctAnswer: 2,
      explanation: "'Das Krankenhaus' ist neutral und verwendet den Artikel 'das'.",
      category: "grammar",
      difficulty: "beginner",
    },
    {
      id: "4",
      question: "Was bedeutet 'Anamnese' in der Medizin?",
      options: ["Behandlung", "Diagnose", "Krankengeschichte", "Operation"],
      correctAnswer: 2,
      explanation: "Anamnese ist die systematische Befragung zur Krankengeschichte des Patienten.",
      category: "medical",
      difficulty: "advanced",
    },
    {
      id: "5",
      question: "Wie fragt man höflich nach dem Befinden eines Patienten?",
      options: ["Was ist los mit dir?", "Wie geht es Ihnen?", "Was machst du?", "Wo tut es weh?"],
      correctAnswer: 1,
      explanation: "'Wie geht es Ihnen?' ist die höfliche Form der Befragung nach dem Befinden.",
      category: "conversation",
      difficulty: "intermediate",
    },
  ]

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        redirect("/auth/login")
      }
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (testStarted && !testCompleted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishTest()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [testStarted, testCompleted, timeLeft])

  const generateTest = async () => {
    setIsGenerating(true)
    try {
      // Filter questions by selected level
      const filteredQuestions = mockQuestions.filter((q) => q.difficulty === selectedLevel)
      setQuestions(filteredQuestions.length > 0 ? filteredQuestions : mockQuestions.slice(0, 5))
    } catch (error) {
      console.error("Error generating test:", error)
      setQuestions(mockQuestions.slice(0, 5))
    } finally {
      setIsGenerating(false)
    }
  }

  const startTest = () => {
    setTestStarted(true)
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setTestCompleted(false)
    setTestResult(null)
    setTimeLeft(1800)
  }

  const selectAnswer = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      finishTest()
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const finishTest = () => {
    setTestCompleted(true)
    setTestStarted(false)

    // Calculate results
    let correctAnswers = 0
    const categoryScores: Record<string, { correct: number; total: number }> = {}

    questions.forEach((question, index) => {
      const category = question.category
      if (!categoryScores[category]) {
        categoryScores[category] = { correct: 0, total: 0 }
      }
      categoryScores[category].total++

      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++
        categoryScores[category].correct++
      }
    })

    const result: TestResult = {
      score: Math.round((correctAnswers / questions.length) * 100),
      totalQuestions: questions.length,
      correctAnswers,
      timeSpent: 1800 - timeLeft,
      categoryScores,
    }

    setTestResult(result)
  }

  const resetTest = () => {
    setTestStarted(false)
    setTestCompleted(false)
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setTestResult(null)
    setTimeLeft(1800)
    setQuestions([])
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (!user) return null

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold">Mock Tests</h1>
              <p className="text-muted-foreground">AI-generated German practice tests</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary">Grammar</Badge>
            <Badge variant="secondary">Vocabulary</Badge>
            <Badge variant="secondary">Medical Terms</Badge>
            <Badge variant="secondary">Conversation</Badge>
          </div>
        </div>

        {/* Test Setup */}
        {!testStarted && !testCompleted && questions.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generate Practice Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Select Difficulty Level</Label>
                <RadioGroup
                  value={selectedLevel}
                  onValueChange={(value: any) => setSelectedLevel(value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner">Beginner (A1-A2)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate (B1-B2)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced">Advanced (C1-C2)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Test Information</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 5 questions covering grammar, vocabulary, medical terms, and conversation</li>
                  <li>• 30 minutes time limit</li>
                  <li>• Immediate feedback with explanations</li>
                  <li>• Performance breakdown by category</li>
                </ul>
              </div>

              <Button onClick={generateTest} disabled={isGenerating} className="w-full">
                {isGenerating ? "Generating Test..." : "Generate Test"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Test Ready */}
        {!testStarted && !testCompleted && questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Test Ready
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-2xl font-bold">{questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">30</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
              </div>
              <Button onClick={startTest} className="w-full gap-2">
                <Play className="h-4 w-4" />
                Start Test
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Test Interface */}
        {testStarted && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Question {currentQuestion + 1} of {questions.length}
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className={`font-mono ${timeLeft < 300 ? "text-red-600" : ""}`}>{formatTime(timeLeft)}</span>
                  </div>
                  <Badge variant="outline">{questions[currentQuestion]?.category}</Badge>
                </div>
              </div>
              <Progress value={((currentQuestion + 1) / questions.length) * 100} className="w-full" />
            </CardHeader>
            <CardContent className="space-y-6">
              {questions[currentQuestion] && (
                <>
                  <div>
                    <h3 className="text-lg font-medium mb-4">{questions[currentQuestion].question}</h3>
                    <RadioGroup
                      value={selectedAnswers[currentQuestion]?.toString()}
                      onValueChange={(value) => selectAnswer(currentQuestion, Number.parseInt(value))}
                    >
                      {questions[currentQuestion].options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50"
                        >
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={previousQuestion} disabled={currentQuestion === 0}>
                      Previous
                    </Button>
                    <Button onClick={nextQuestion} disabled={selectedAnswers[currentQuestion] === undefined}>
                      {currentQuestion === questions.length - 1 ? "Finish Test" : "Next"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {testCompleted && testResult && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Test Completed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{testResult.score}%</div>
                  <div className="text-muted-foreground">
                    {testResult.correctAnswers} out of {testResult.totalQuestions} correct
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Completed in {formatTime(testResult.timeSpent)}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(testResult.categoryScores).map(([category, scores]) => (
                    <div key={category} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">{category}</h4>
                        <Badge variant="outline">
                          {scores.correct}/{scores.total}
                        </Badge>
                      </div>
                      <Progress value={(scores.correct / scores.total) * 100} />
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button onClick={resetTest} variant="outline" className="gap-2 bg-transparent">
                    <RotateCcw className="h-4 w-4" />
                    New Test
                  </Button>
                  <Button onClick={() => setTestCompleted(false)}>Review Answers</Button>
                </div>
              </CardContent>
            </Card>

            {/* Answer Review */}
            <Card>
              <CardHeader>
                <CardTitle>Answer Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((question, index) => {
                  const userAnswer = selectedAnswers[index]
                  const isCorrect = userAnswer === question.correctAnswer

                  return (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">
                            Question {index + 1}: {question.question}
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Your answer: </span>
                              <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                {question.options[userAnswer] || "Not answered"}
                              </span>
                            </div>
                            {!isCorrect && (
                              <div>
                                <span className="font-medium">Correct answer: </span>
                                <span className="text-green-600">{question.options[question.correctAnswer]}</span>
                              </div>
                            )}
                            <div className="bg-muted/50 p-3 rounded">
                              <span className="font-medium">Explanation: </span>
                              {question.explanation}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
