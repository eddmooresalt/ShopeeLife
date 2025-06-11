"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

interface ProgressDetailProps {
  taskName: string
  progress: number
  duration: number
  taskType: "task" | "location" | "lunch" // Added 'lunch' type
  taskId?: string
  location?: string
  emoji?: string // New prop for displaying emoji during progress
}

export const ProgressDetail: React.FC<ProgressDetailProps> = ({
  taskName,
  progress,
  duration,
  taskType,
  taskId,
  location,
  emoji, // Destructure emoji
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentDescription, setCurrentDescription] = useState("")

  // Define detailed steps for different tasks
  const getTaskSteps = (taskId: string) => {
    const taskSteps = {
      // Basic Tasks
      email: [
        "Opening email client...",
        "Scanning inbox for new messages...",
        "Reading urgent emails from clients...",
        "Thinking about appropriate responses...",
        "Typing professional replies...",
        "Checking for attachments...",
        "Marking important emails as read...",
        "Organizing emails into folders...",
        "Sending responses to stakeholders...",
        "Refreshing inbox for new messages...",
      ],
      "organize-desk": [
        "Assessing current desk situation...",
        "Stacking scattered documents...",
        "Collecting loose pens and supplies...",
        "Throwing away unnecessary papers...",
        "Cleaning computer screen and keyboard...",
        "Organizing phone and charger cables...",
        "Arranging files in proper order...",
        "Wiping down desk surface...",
      ],
      "file-documents": [
        "Gathering loose documents...",
        "Reading document headers and dates...",
        "Categorizing by department and priority...",
        "Opening appropriate filing cabinets...",
        "Cross-referencing with filing system...",
        "Placing documents in correct folders...",
        "Updating filing index...",
        "Securing confidential documents...",
      ],
      "data-entry": [
        "Opening database application...",
        "Loading customer information forms...",
        "Reviewing handwritten notes...",
        "Typing customer names and details...",
        "Entering phone numbers and addresses...",
        "Processing payment information...",
        "Validating data for accuracy...",
        "Saving entries to database...",
        "Moving to next customer record...",
      ],
      "phone-calls": [
        "Dialing customer phone number...",
        "Listening to ringtone...",
        "Greeting customer professionally...",
        "Listening to customer concerns...",
        "Thinking about best solutions...",
        "Explaining company policies...",
        "Taking notes on customer feedback...",
        "Reaching satisfactory resolution...",
        "Updating customer service log...",
      ],
      report: [
        "Gathering data from various sources...",
        "Analyzing sales trends and patterns...",
        "Opening report template...",
        "Writing executive summary...",
        "Creating charts and graphs...",
        "Double-checking all statistics...",
        "Formatting report layout...",
        "Adding recommendations section...",
        "Preparing for management review...",
      ],
      meeting: [
        "Walking to meeting room...",
        "Greeting team members...",
        "Reviewing meeting agenda...",
        "Discussing project updates...",
        "Brainstorming new ideas...",
        "Taking detailed meeting notes...",
        "Setting action items...",
        "Scheduling follow-up meetings...",
        "Concluding with next steps...",
      ],
      presentation: [
        "Setting up presentation equipment...",
        "Testing microphone and audio...",
        "Welcoming audience members...",
        "Presenting opening slides...",
        "Explaining key data points...",
        "Answering audience questions...",
        "Sharing strategic insights...",
        "Highlighting recommendations...",
        "Receiving positive feedback...",
        "Distributing summary materials...",
      ],
      strategy: [
        "Analyzing market conditions...",
        "Reviewing competitor analysis...",
        "Brainstorming strategic options...",
        "Modeling financial projections...",
        "Defining key objectives...",
        "Outlining implementation plan...",
        "Weighing risks and benefits...",
        "Documenting strategic framework...",
        "Iterating on strategic approach...",
      ],
      coffee: [
        "Walking to coffee machine...",
        "Selecting favorite coffee blend...",
        "Filling cup with hot water...",
        "Stirring in cream and sugar...",
        "Enjoying the rich aroma...",
        "Taking first satisfying sip...",
        "Feeling energy levels rising...",
        "Reflecting on morning tasks...",
      ],
      meditation: [
        "Finding quiet, comfortable spot...",
        "Closing eyes and relaxing...",
        "Taking deep, calming breaths...",
        "Clearing mind of distractions...",
        "Focusing on present moment...",
        "Feeling stress melting away...",
        "Maintaining peaceful awareness...",
        "Emerging refreshed and centered...",
      ],
    }

    return (
      taskSteps[taskId] || [
        "🔄 Starting task...",
        "⚡ Making progress...",
        "💪 Working diligently...",
        "🎯 Focusing on objectives...",
        "✅ Completing final steps...",
      ]
    )
  }

  const getLocationSteps = (location: string, actionName: string) => {
    const locationSteps = {
      desk: {
        "Organize Desk": [
          "Sitting down at workstation...",
          "Surveying the desk clutter...",
          "Stacking books and documents...",
          "Gathering scattered pens...",
          "Discarding old sticky notes...",
          "Cleaning monitor screen...",
          "Organizing keyboard area...",
          "Final desk surface wipe...",
        ],
        "Check Emails": [
          "Opening email application...",
          "Loading inbox messages...",
          "Scanning subject lines...",
          "Reading priority emails...",
          "Composing thoughtful replies...",
          "Downloading attachments...",
          "Filing important messages...",
          "Marking tasks complete...",
        ],
        "Personal Development": [
          "Opening learning materials...",
          "Setting learning objectives...",
          "Reading industry articles...",
          "Taking notes on key concepts...",
          "Practicing new skills...",
          "Reflecting on learnings...",
          "Planning next study session...",
        ],
        "Power Nap": [
          "Finding comfortable position...",
          "Closing eyes gently...",
          "Taking slow, deep breaths...",
          "Drifting into light sleep...",
          "Allowing mind to rest...",
          "Natural awakening...",
          "Feeling refreshed...",
        ],
      },
      meeting: {
        "Team Meeting": [
          "Entering meeting room...",
          "Greeting colleagues...",
          "Taking seat at table...",
          "Reviewing meeting agenda...",
          "Participating in discussions...",
          "Contributing ideas...",
          "Taking detailed meeting notes...",
          "Setting action items...",
          "Scheduling follow-up meetings...",
          "Concluding with next steps...",
        ],
        "Give Presentation": [
          "Setting up laptop...",
          "Loading presentation slides...",
          "Testing audio equipment...",
          "Welcoming attendees...",
          "Presenting key findings...",
          "Sharing insights...",
          "Handling Q&A session...",
          "Receiving feedback...",
        ],
        "Brainstorming Session": [
          "Gathering creative team...",
          "Setting up whiteboard...",
          "Generating initial ideas...",
          "Sketching concepts...",
          "Building on suggestions...",
          "Iterating solutions...",
          "Refining best ideas...",
          "Documenting outcomes...",
        ],
        "Network with Colleagues": [
          "Approaching colleagues...",
          "Starting casual conversation...",
          "Sharing work experiences...",
          "Exchanging contact info...",
          "Discussing collaboration...",
          "Finding common interests...",
          "Planning future meetups...",
        ],
      },
      pantry: {
        "Coffee Break": [
          "Walking to pantry area...",
          "Approaching coffee machine...",
          "Selecting coffee beans...",
          "Adding fresh water...",
          "Waiting for brewing...",
          "Adding milk and sugar...",
          "Enjoying coffee aroma...",
          "Taking first satisfying sip...",
        ],
        "Grab a Snack": [
          "Opening pantry cabinet...",
          "Browsing snack options...",
          "Selecting healthy choice...",
          "Getting refreshing drink...",
          "Finding comfortable spot...",
          "Enjoying tasty snack...",
          "Staying hydrated...",
        ],
        "Water Break": [
          "Walking to water dispenser...",
          "Getting clean cup...",
          "Filling with cool water...",
          "Taking refreshing sips...",
          "Feeling hydrated...",
        ],
        "Chat with Colleagues": [
          "Greeting nearby colleagues...",
          "Starting friendly conversation...",
          "Sharing funny stories...",
          "Discussing weekend plans...",
          "Building relationships...",
          "Enjoying social time...",
        ],
      },
      gameroom: {
        "Play Table Tennis": [
          "Picking up paddle...",
          "Warming up with practice swings...",
          "Serving first ball...",
          "Engaging in fast rallies...",
          "Making competitive shots...",
          "Working up a sweat...",
          "Celebrating good plays...",
          "Shaking hands after game...",
        ],
        "Play Video Games": [
          "Turning on gaming console...",
          "Selecting favorite game...",
          "Loading game interface...",
          "Starting new level...",
          "Navigating challenges...",
          "Achieving high scores...",
          "Enjoying gaming session...",
        ],
        "Play Board Games": [
          "Setting up game board...",
          "Reviewing game rules...",
          "Gathering players...",
          "Making strategic moves...",
          "Planning next turn...",
          "Enjoying friendly competition...",
          "Celebrating victories...",
        ],
        "Team Building Activity": [
          "Gathering team members...",
          "Explaining activity rules...",
          "Forming collaborative groups...",
          "Solving puzzles together...",
          "Working toward common goal...",
          "Supporting teammates...",
          "Celebrating team success...",
        ],
      },
      phonebooth: {
        "Client Call": [
          "Dialing client number...",
          "Waiting for connection...",
          "Professional greeting...",
          "Listening to client needs...",
          "Understanding requirements...",
          "Providing solutions...",
          "Taking detailed notes...",
          "Confirming next steps...",
          "Updating client records...",
        ],
        "Focus Work": [
          "Closing booth door...",
          "Opening work documents...",
          "Entering deep focus mode...",
          "Working without distractions...",
          "Analyzing complex data...",
          "Generating solutions...",
          "Completing tasks efficiently...",
        ],
        "Personal Call": [
          "Dialing personal contact...",
          "Casual greeting...",
          "Catching up on news...",
          "Sharing daily updates...",
          "Expressing care...",
          "Making personal plans...",
          "Saying goodbye...",
        ],
        Meditation: [
          "Sitting comfortably...",
          "Closing eyes softly...",
          "Breathing deeply...",
          "Clearing mental clutter...",
          "Relaxing tense muscles...",
          "Finding inner peace...",
          "Feeling centered...",
        ],
      },
      itroom: {
        "Tech Support": [
          "Explaining technical issue...",
          "IT staff diagnosing problem...",
          "Running system diagnostics...",
          "Applying software fixes...",
          "Testing solution...",
          "Documenting resolution...",
          "Confirming everything works...",
        ],
        "Software Update": [
          "Checking for updates...",
          "Downloading new version...",
          "Installing software...",
          "Restarting applications...",
          "Verifying functionality...",
          "Reading update notes...",
          "Testing new features...",
        ],
        "Learn New Tool": [
          "Opening tutorial materials...",
          "Watching demo videos...",
          "Following step-by-step guide...",
          "Practicing with interface...",
          "Understanding key features...",
          "Completing practice exercises...",
          "Taking notes for reference...",
          "Mastering basic functions...",
        ],
        "Hardware Upgrade": [
          "Selecting upgrade components...",
          "Processing purchase order...",
          "Receiving new hardware...",
          "Installing components...",
          "Configuring settings...",
          "Running performance tests...",
          "Verifying improvements...",
          "Updating equipment records...",
        ],
      },
    }

    return (
      locationSteps[location]?.[actionName] || [
        "🔄 Starting activity...",
        "⚡ Making progress...",
        "💪 Working steadily...",
        "🎯 Focusing on task...",
        "✅ Completing action...",
      ]
    )
  }

  const getLunchSteps = (lunchName: string) => {
    return [
      `Walking to ${lunchName}...`,
      "Placing your order...",
      "Waiting for your meal...",
      "Enjoying the first bite...",
      "Savoring the delicious flavors...",
      "Finishing up your meal...",
      "Feeling refreshed and energized...",
      "Heading back to the office...",
    ]
  }

  useEffect(() => {
    let steps: string[] = []

    if (taskType === "task" && taskId) {
      steps = getTaskSteps(taskId)
    } else if (taskType === "location" && location) {
      steps = getLocationSteps(location, taskName)
    } else if (taskType === "lunch") {
      steps = getLunchSteps(taskName)
    }

    if (steps.length === 0) return

    // Calculate which step we should be on based on progress
    const stepIndex = Math.floor((progress / 100) * steps.length)
    const clampedIndex = Math.min(stepIndex, steps.length - 1)

    if (clampedIndex !== currentStep) {
      setCurrentStep(clampedIndex)
      setCurrentDescription(steps[clampedIndex])
    }
  }, [progress, taskType, taskId, location, taskName, currentStep])

  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span className="font-medium">🔄 {taskName} in progress...</span>
        </div>
      </div>

      {/* Display enlarged emoji for lunch progress */}
      {taskType === "lunch" && emoji && (
        <div className="text-center my-4">
          <span className="text-7xl animate-pulse">{emoji}</span>
        </div>
      )}

      <Progress value={progress} className="h-2 mb-3" />

      {currentDescription && (
        <div className="bg-white p-3 rounded border border-blue-100">
          <p className="text-sm text-gray-700 animate-pulse">{currentDescription}</p>
        </div>
      )}

      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Step {currentStep + 1}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>
    </div>
  )
}
