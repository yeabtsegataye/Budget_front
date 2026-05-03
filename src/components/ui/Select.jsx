import { forwardRef, useState, Children, cloneElement } from 'react';
import { cn } from '../../utils/cn';

const Select = ({ value, onValueChange, children, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderedItems = Children.map(children, (child) => {
    if (!child || !child.props) return child;

    return cloneElement(child, {
      onClick: (selectedValue) => {
        onValueChange?.(selectedValue);
        setIsOpen(false);
      }
    });
  });

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <span className={value ? "" : "text-muted-foreground"}>
          {value || placeholder}
        </span>
        <svg
          className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md">
          <div className="p-1">
            {renderedItems}
          </div>
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

const SelectItem = ({ value, children, onClick }) => (
  <div
    className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
    onClick={() => onClick?.(value)}
  >
    {children}
  </div>
);

export { Select, SelectItem };