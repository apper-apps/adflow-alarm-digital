import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  icon,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const hasValue = value && value.toString().length > 0;
  const shouldFloat = focused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <ApperIcon 
            name={icon} 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 z-10" 
          />
        )}
        
        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200
            ${icon ? 'pl-11' : ''}
            ${error 
              ? 'border-error focus:border-error focus:ring-error/20' 
              : 'border-surface-300 focus:border-secondary focus:ring-secondary/20'
            }
            focus:outline-none focus:ring-2
            ${shouldFloat ? 'pt-6 pb-2' : ''}
          `}
          placeholder={shouldFloat ? '' : placeholder}
          {...props}
        />
        
        {label && (
          <label className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${icon ? 'left-11' : ''}
            ${shouldFloat 
              ? 'top-2 text-xs text-surface-500' 
              : 'top-1/2 -translate-y-1/2 text-surface-400'
            }
          `}>
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error flex items-center gap-1">
          <ApperIcon name="AlertCircle" size={16} />
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;