"use client"

import type React from "react"

import type { FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface InputBarProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  disabled?: boolean
}

export function InputBar({ input, handleInputChange, handleSubmit, isLoading, disabled }: InputBarProps) {
  return (
    <form onSubmit={handleSubmit} className="p-6 border-t">
      <div className="flex gap-3">
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder={disabled ? "Daily limit reached..." : "Type your message in German..."}
          className="min-h-[60px] resize-none"
          disabled={disabled || isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              if (!disabled && !isLoading && input.trim()) {
                handleSubmit(e as any)
              }
            }
          }}
        />
        <Button type="submit" disabled={disabled || isLoading || !input.trim()} size="lg" className="px-6">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}
