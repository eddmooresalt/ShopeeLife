import { Progress } from "@/components/ui/progress"

interface ProgressDetailProps {
  label: string
  value: number
  maxValue: number
  className?: string
}

export function ProgressDetail({ label, value, maxValue, className }: ProgressDetailProps) {
  const percentage = (value / maxValue) * 100
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        {/* Display rounded percentage */}
        <span>{Math.round(percentage)}%</span>
      </div>
      <Progress value={percentage} className="h-2 bg-gray-200 [&>*]:bg-orange-500" />
    </div>
  )
}
