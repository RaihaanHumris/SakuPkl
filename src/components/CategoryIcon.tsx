import {
  Award,
  Briefcase,
  Bus,
  Car,
  Coffee,
  MoreHorizontal,
  ShoppingBag,
  Utensils,
  Wallet,
} from 'lucide-react';
import { CATEGORY_STYLES } from '../data/seedData';
import type { TransactionCategory } from '../types/finance';

interface CategoryIconProps {
  category: TransactionCategory;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryIcon({ category, size = 'md' }: CategoryIconProps) {
  const style = CATEGORY_STYLES[category] ?? CATEGORY_STYLES['Lain-lain'];

  const containerSize =
    size === 'sm'
      ? 'w-8 h-8 rounded-lg'
      : size === 'lg'
        ? 'w-11 h-11 rounded-xl'
        : 'w-10 h-10 rounded-xl';

  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-[18px] h-[18px]';

  const renderIcon = () => {
    switch (category) {
      case 'Makan & Minum':
        return <Utensils className={iconSize} strokeWidth={2} />;
      case 'Transportasi':
        return <Car className={iconSize} strokeWidth={2} />;
      case 'Belanja Online':
        return <ShoppingBag className={iconSize} strokeWidth={2} />;
      case 'Kebutuhan PKL':
        return <Briefcase className={iconSize} strokeWidth={2} />;
      case 'Jajan & Kopi':
        return <Coffee className={iconSize} strokeWidth={2} />;
      case 'Uang Transport':
        return <Bus className={iconSize} strokeWidth={2} />;
      case 'Bonus PKL':
        return <Award className={iconSize} strokeWidth={2} />;
      case 'Uang Saku':
        return <Wallet className={iconSize} strokeWidth={2} />;
      case 'Lain-lain':
      default:
        return <MoreHorizontal className={iconSize} strokeWidth={2} />;
    }
  };

  return (
    <div
      className={`${containerSize} ${style.bgClass} ${style.textClass} flex items-center justify-center shrink-0`}
      aria-hidden="true"
    >
      {renderIcon()}
    </div>
  );
}
