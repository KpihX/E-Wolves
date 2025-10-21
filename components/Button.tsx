import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'action';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'default', 
  ...props 
}) => {
  const buttonClasses = `game-button ${variant} ${className || ''}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};