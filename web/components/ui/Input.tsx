import React from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helper, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-flupp-neutral-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          type={type}
          id={inputId}
          className={cn(
            'flupp-input',
            {
              'border-red-300 focus:border-red-500 focus:ring-red-500/50': error,
              'border-flupp-neutral-300 focus:border-flupp-sage focus:ring-flupp-sage/50': !error,
            },
            className
          )}
          ref={ref}
          {...props}
        />
        
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        
        {helper && !error && (
          <p className="mt-1 text-sm text-flupp-neutral-500">
            {helper}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'