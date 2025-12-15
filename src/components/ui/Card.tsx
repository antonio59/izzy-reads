import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'

export type CardVariant = 'default' | 'elevated' | 'interactive' | 'outlined' | 'gradient'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: CardVariant
  padding?: CardPadding
  children: React.ReactNode
  hoverEffect?: boolean
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white shadow-soft',
  elevated: 'bg-white shadow-soft-md',
  interactive: 'bg-white shadow-soft hover:shadow-soft-lg cursor-pointer',
  outlined: 'bg-white border border-gray-200',
  gradient: 'bg-gradient-to-br from-primary-50 to-accent-50 shadow-soft',
}

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      children,
      hoverEffect = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'rounded-2xl overflow-hidden'

    return (
      <motion.div
        ref={ref}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${paddingStyles[padding]}
          ${className}
        `}
        whileHover={hoverEffect ? { y: -4, scale: 1.01 } : {}}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

// Card Header component
interface CardHeaderProps {
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

export function CardHeader({ children, className = '', action }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  )
}

// Card Title component
interface CardTitleProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function CardTitle({ children, className = '', as: Tag = 'h3' }: CardTitleProps) {
  return (
    <Tag className={`font-display font-bold text-gray-900 ${className}`}>
      {children}
    </Tag>
  )
}

// Card Description component
interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-gray-500 mt-1 ${className}`}>
      {children}
    </p>
  )
}

// Card Content component
interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={className}>{children}</div>
}

// Card Footer component
interface CardFooterProps {
  children: React.ReactNode
  className?: string
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  )
}

// Stat Card - specialized card for displaying statistics
interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'primary' | 'accent' | 'sage' | 'gray'
  className?: string
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = 'primary',
  className = ''
}: StatCardProps) {
  const colorStyles = {
    primary: 'text-primary-500',
    accent: 'text-accent-500',
    sage: 'text-sage-500',
    gray: 'text-gray-500',
  }

  const bgStyles = {
    primary: 'bg-primary-50',
    accent: 'bg-accent-50',
    sage: 'bg-sage-50',
    gray: 'bg-gray-50',
  }

  return (
    <Card variant="default" padding="md" className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className={`text-3xl font-bold font-display mt-1 ${colorStyles[color]}`}>
            {value}
          </p>
          {trend && (
            <p className={`text-xs mt-2 ${trend.isPositive ? 'text-sage-600' : 'text-red-500'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl ${bgStyles[color]}`}>
            <span className={colorStyles[color]}>{icon}</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default Card
