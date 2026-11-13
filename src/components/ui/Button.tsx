import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fa5d19] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.985] cursor-pointer';

    // Size variants
    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5'
    }[size];

    // Style variants from design.md
    const variants = {
      primary: 'bg-[#fa5d19] hover:bg-[#ff6826] active:bg-[#e04e0e] text-white shadow-heat-glow border border-transparent font-semibold',
      secondary: 'bg-[#1f1f1f] hover:bg-[#282828] active:bg-[#161616] text-[#f5f5f5] border border-[#333333]',
      tertiary: 'bg-transparent hover:bg-[rgba(255,255,255,0.06)] active:bg-[rgba(255,255,255,0.09)] text-[#e0e0e0]',
      destructive: 'bg-[#eb3424] hover:bg-[#d62617] text-white border border-transparent font-semibold',
      outline: 'bg-transparent hover:bg-[rgba(250,93,25,0.08)] text-[#fa5d19] border border-[rgba(250,93,25,0.35)]'
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${base} ${sizes} ${variants} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
