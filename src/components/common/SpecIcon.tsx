import { CalendarCheckIcon, ClockIcon, TrendIcon, UsersIcon } from '@/components/icons';
import type { SpecIcon as SpecIconKey } from '@/data/vehicles';
import {
  AirplaneTaxiingIcon,
  BackpackIcon,
  FanIcon,
  JeepIcon,
  MountainsIcon,
  RoadHorizonIcon,
} from '@phosphor-icons/react/dist/ssr';

const MAP: Record<SpecIconKey, React.ComponentType<{ className?: string }>> = {
  users: UsersIcon,
  bag: BackpackIcon,
  ac: FanIcon,
  trend: TrendIcon,
  calendar: CalendarCheckIcon,
  clock: ClockIcon,
  airport: AirplaneTaxiingIcon,
  drivetrain: JeepIcon,
  mountain: MountainsIcon,
  road: RoadHorizonIcon,
};

/** Render a vehicle spec icon from its data key. Backend-managed content isn't
 *  type-checked, so an unrecognised key falls back to a generic icon instead
 *  of crashing the page. */
export function SpecIcon({ name, className }: { name: SpecIconKey; className?: string }) {
  const Icon = MAP[name] ?? UsersIcon;
  return <Icon className={className} />;
}
