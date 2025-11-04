import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickRepliesProps {
  options: string[];
  onSelect: (option: string) => void;
  className?: string;
}

const QuickReplies = ({ options, onSelect, className }: QuickRepliesProps) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelect(option)}
          className="rounded-full border-2 hover:bg-accent hover:text-accent-foreground transition-all"
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default QuickReplies;
