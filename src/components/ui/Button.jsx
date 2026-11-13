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
    const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168a91] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.985] cursor-pointer';

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-9 px-4 text-xs gap-2',
      lg: 'h-11 px-5 text-sm gap-2.5'
    }[size] || 'h-9 px-4 text-xs gap-2';

    const variants = {
      primary: 'bg-[#168a91] hover:bg-[#11747a] active:bg-[#0d6166] text-white shadow-xs border border-transparent font-medium',
      secondary: 'bg-white hover:bg-[#f0f6f6] active:bg-[#e7f3f3] text-[#263b40] hover:text-[#263b40] border border-[#dce5e7] shadow-xs font-medium',
      tertiary: 'bg-transparent hover:bg-[#f0f6f6] active:bg-[#e7f3f3] text-[#61777c] hover:text-[#263b40] border border-transparent',
      destructive: 'bg-[#d95757] hover:bg-[#c44848] active:bg-[#b03c3c] text-white shadow-xs border border-transparent font-medium',
      outline: 'bg-white hover:bg-[#ddf1f1] active:bg-[#cbeae9] text-[#168a91] border border-[#168a91]/30 shadow-xs font-medium'
    }[variant] || 'bg-white text-[#263b40] border border-[#dce5e7]';

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
