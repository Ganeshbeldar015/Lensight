import React from 'react';

export const Button = React.forwardRef(
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
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fa5d19] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.985] cursor-pointer';

    // Size variants
    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5'
    }[size] || 'h-10 px-4 text-sm gap-2';

    // Style variants for modern light UI
    const variants = {
      primary: 'bg-[#fa5d19] hover:bg-[#ea580c] active:bg-[#c2410c] text-white shadow-heat-glow border border-transparent font-semibold',
      secondary: 'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300 shadow-xs font-medium',
      tertiary: 'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-600 hover:text-slate-900 border border-transparent',
      destructive: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-xs border border-transparent font-semibold',
      outline: 'bg-white hover:bg-orange-50 active:bg-orange-100 text-[#fa5d19] border border-orange-300 shadow-xs font-semibold'
    }[variant] || 'bg-white text-slate-700 border border-slate-300';

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
