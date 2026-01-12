import * as React from 'react';
import { cn } from '../lib/utils';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import {
  Sparkles,
  Brain,
  Wand2,
  MessageSquare,
  Send,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  ChevronDown,
  ChevronRight,
  Loader2,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Users,
  Star,
  Lightbulb,
  CheckCircle,
  Plus,
  X,
} from 'lucide-react';

// AI Chat Message
export interface AIChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  isLoading?: boolean;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  onCopy?: () => void;
  onFeedback?: (positive: boolean) => void;
  className?: string;
}

export function AIChatMessage({
  role,
  content,
  timestamp,
  isLoading = false,
  suggestions = [],
  onSuggestionClick,
  onCopy,
  onFeedback,
  className,
}: AIChatMessageProps) {
  return (
    <div
      className={cn(
        'flex gap-3',
        role === 'user' ? 'flex-row-reverse' : '',
        className
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
          role === 'assistant'
            ? 'bg-gradient-to-br from-primary-500 to-violet-500'
            : 'bg-slate-200 dark:bg-slate-700'
        )}
      >
        {role === 'assistant' ? (
          <Sparkles className="h-5 w-5 text-white" />
        ) : (
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            You
          </span>
        )}
      </div>

      <div
        className={cn(
          'flex-1 space-y-2',
          role === 'user' ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            role === 'assistant'
              ? 'bg-white shadow-sm dark:bg-slate-800'
              : 'bg-primary-500 text-white',
            role === 'user' && 'ml-auto max-w-[80%]'
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              <span className="text-slate-500">Thinking...</span>
            </div>
          ) : (
            <p
              className={cn(
                'text-sm',
                role === 'assistant' && 'text-slate-700 dark:text-slate-300'
              )}
            >
              {content}
            </p>
          )}
        </div>

        {role === 'assistant' && !isLoading && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                className="rounded-lg bg-primary-50 px-3 py-1.5 text-sm text-primary-700 transition-colors hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300"
                onClick={() => onSuggestionClick?.(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {role === 'assistant' && !isLoading && (
          <div className="flex items-center gap-2">
            <button
              className="p-1.5 text-slate-400 hover:text-slate-600"
              onClick={onCopy}
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              className="p-1.5 text-slate-400 hover:text-emerald-500"
              onClick={() => onFeedback?.(true)}
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button
              className="p-1.5 text-slate-400 hover:text-red-500"
              onClick={() => onFeedback?.(false)}
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// AI Chat Input
export interface AIChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function AIChatInput({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Ask AI to plan your trip...',
  disabled = false,
  className,
}: AIChatInputProps) {
  return (
    <div
      className={cn(
        'flex items-end gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800',
        className
      )}
    >
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-slate-400"
        rows={1}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit?.();
          }
        }}
      />
      <Button
        variant="primary"
        size="sm"
        disabled={disabled || !value.trim()}
        onClick={onSubmit}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}

// AI Trip Suggestion Card
export interface AITripSuggestionProps {
  destination: string;
  duration: string;
  budget: string;
  highlights: string[];
  matchScore: number;
  reasoning?: string;
  image?: string;
  onAccept?: () => void;
  onModify?: () => void;
  onReject?: () => void;
  className?: string;
}

export function AITripSuggestion({
  destination,
  duration,
  budget,
  highlights,
  matchScore,
  reasoning,
  image,
  onAccept,
  onModify,
  onReject,
  className,
}: AITripSuggestionProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Card className={cn('overflow-hidden', className)}>
      {image && (
        <div className="relative aspect-[3/1] overflow-hidden">
          <img
            src={image}
            alt={destination}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h3 className="text-2xl font-bold text-white">{destination}</h3>
          </div>
          <div className="absolute right-4 top-4">
            <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary-500" />
              <span className="text-sm font-semibold text-slate-900">
                {matchScore}% Match
              </span>
            </div>
          </div>
        </div>
      )}

      <CardContent className="p-4">
        {!image && (
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {destination}
            </h3>
            <div className="flex items-center gap-1 rounded-full bg-primary-100 px-3 py-1 dark:bg-primary-900/30">
              <Sparkles className="h-4 w-4 text-primary-500" />
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                {matchScore}% Match
              </span>
            </div>
          </div>
        )}

        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Duration</span>
            </div>
            <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
              {duration}
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <div className="flex items-center gap-2 text-slate-500">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs">Budget</span>
            </div>
            <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
              {budget}
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <div className="flex items-center gap-2 text-slate-500">
              <Star className="h-4 w-4" />
              <span className="text-xs">Highlights</span>
            </div>
            <div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
              {highlights.length}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {highlights.slice(0, 3).map((highlight, i) => (
              <Badge key={i} variant="secondary" size="sm">
                {highlight}
              </Badge>
            ))}
            {highlights.length > 3 && (
              <Badge variant="secondary" size="sm">
                +{highlights.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {reasoning && (
          <div className="mb-4">
            <button
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
              onClick={() => setExpanded(!expanded)}
            >
              <Lightbulb className="h-4 w-4" />
              <span>Why we recommend this</span>
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {expanded && (
              <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                {reasoning}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="primary" className="flex-1" onClick={onAccept}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Accept
          </Button>
          <Button variant="secondary" className="flex-1" onClick={onModify}>
            <Wand2 className="mr-2 h-4 w-4" />
            Modify
          </Button>
          <Button variant="ghost" onClick={onReject}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// AI Preferences Form
export interface AIPreference {
  id: string;
  label: string;
  selected?: boolean;
}

export interface AIPreferencesProps {
  title?: string;
  description?: string;
  preferences: AIPreference[];
  multiSelect?: boolean;
  onSelect?: (id: string) => void;
  className?: string;
}

export function AIPreferences({
  title,
  description,
  preferences,
  multiSelect = true,
  onSelect,
  className,
}: AIPreferencesProps) {
  return (
    <Card className={className}>
      {title && (
        <h3 className="mb-2 font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
      )}
      {description && (
        <p className="mb-4 text-sm text-slate-500">{description}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {preferences.map((pref) => (
          <button
            key={pref.id}
            className={cn(
              'rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors',
              pref.selected
                ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/30 dark:text-primary-300'
                : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400'
            )}
            onClick={() => onSelect?.(pref.id)}
          >
            {pref.label}
          </button>
        ))}
      </div>
    </Card>
  );
}

// AI Generated Itinerary Day
export interface AIItineraryDayProps {
  day: number;
  date?: Date;
  title: string;
  activities: Array<{
    time: string;
    title: string;
    description?: string;
    duration?: string;
    location?: string;
    type?: string;
  }>;
  onAddActivity?: () => void;
  onEditActivity?: (index: number) => void;
  onRemoveActivity?: (index: number) => void;
  className?: string;
}

export function AIItineraryDay({
  day,
  date,
  title,
  activities,
  onAddActivity,
  onEditActivity,
  onRemoveActivity,
  className,
}: AIItineraryDayProps) {
  return (
    <Card className={className}>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
          <span className="text-lg font-bold text-primary-600">
            Day {day}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          {date && (
            <p className="text-sm text-slate-500">
              {date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>

      <div className="relative space-y-4 pl-6">
        {/* Timeline line */}
        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700" />

        {activities.map((activity, i) => (
          <div key={i} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-4 top-2 h-3 w-3 rounded-full border-2 border-primary-500 bg-white dark:bg-slate-900" />

            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    {activity.time}
                    {activity.duration && (
                      <>
                        <span className="text-slate-300">•</span>
                        {activity.duration}
                      </>
                    )}
                  </div>
                  <h4 className="mt-1 font-medium text-slate-900 dark:text-slate-100">
                    {activity.title}
                  </h4>
                  {activity.description && (
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {activity.description}
                    </p>
                  )}
                  {activity.location && (
                    <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {activity.location}
                    </div>
                  )}
                </div>
                {onEditActivity && onRemoveActivity && (
                  <div className="flex gap-1">
                    <button
                      className="p-1.5 text-slate-400 hover:text-slate-600"
                      onClick={() => onEditActivity(i)}
                    >
                      <Wand2 className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1.5 text-slate-400 hover:text-red-500"
                      onClick={() => onRemoveActivity(i)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {onAddActivity && (
          <button
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-3 text-sm text-slate-500 transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-slate-700"
            onClick={onAddActivity}
          >
            <Plus className="h-4 w-4" />
            Add Activity
          </button>
        )}
      </div>
    </Card>
  );
}

// AI Loading State
export interface AILoadingStateProps {
  message?: string;
  steps?: Array<{
    label: string;
    completed: boolean;
    current?: boolean;
  }>;
  className?: string;
}

export function AILoadingState({
  message = 'AI is planning your perfect trip...',
  steps = [],
  className,
}: AILoadingStateProps) {
  return (
    <Card className={cn('text-center', className)}>
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 p-1">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-slate-900">
              <Brain className="h-10 w-10 text-primary-500" />
            </div>
          </div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
        </div>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {message}
      </h3>

      {steps.length > 0 && (
        <div className="mt-6 space-y-2 text-left">
          {steps.map((step, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-2',
                step.current && 'bg-primary-50 dark:bg-primary-900/20'
              )}
            >
              {step.completed ? (
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              ) : step.current ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-slate-200 dark:border-slate-700" />
              )}
              <span
                className={cn(
                  'text-sm',
                  step.completed && 'text-slate-500',
                  step.current && 'font-medium text-primary-700 dark:text-primary-300',
                  !step.completed && !step.current && 'text-slate-400'
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

// Quick Prompt Suggestions
export interface QuickPromptsProps {
  prompts: string[];
  onSelect?: (prompt: string) => void;
  className?: string;
}

export function QuickPrompts({
  prompts,
  onSelect,
  className,
}: QuickPromptsProps) {
  return (
    <div className={cn('', className)}>
      <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
        <Sparkles className="h-4 w-4" />
        <span>Try asking</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, i) => (
          <button
            key={i}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
            onClick={() => onSelect?.(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
