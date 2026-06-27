import type { LucideProps } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface HabitIconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export function HabitIcon({ name, size = 20, className, color }: HabitIconProps) {
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>)[name];
  if (!IconComponent) return <LucideIcons.Star size={size} className={className} color={color} />;
  return <IconComponent size={size} className={className} color={color} />;
}
