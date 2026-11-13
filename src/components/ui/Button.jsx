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
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16845b] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.985] cursor-pointer';

    // Size variants
    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-9 px-4 text-xs gap-2',
      lg: 'h-11 px-5 text-sm gap-2.5'
    }[size] || 'h-9 px-4 text-xs gap-2';

    // Style variants for modern professional light UI
    const variants = {
      primary: 'bg-[#16845b] hover:bg-[#116b49] active:bg-[#0d5238] text-white shadow-xs border border-transparent font-medium',
      secondary: 'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs font-medium',
      tertiary: 'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-600 hover:text-slate-900 border border-transparent',
      destructive: 'bg-[#dc5656] hover:bg-[#c94242] active:bg-[#b53434] text-white shadow-xs border border-transparent font-medium',
      outline: 'bg-white hover:bg-[#eaf5ef] active:bg-[#d8ecdf] text-[#16845b] border border-[#16845b]/30 shadow-xs font-medium'
    }[variant] || 'bg-white text-slate-700 border border-slate-200';

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
