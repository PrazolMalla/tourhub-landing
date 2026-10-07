import { TEXT_MUTED } from '@/lib/theme';

type EmptyStateProps = {
  title: string;
  description?: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-white py-20 px-6 text-center">
      <h3 className="text-2xl font-semibold">{title}</h3>

      {description && <p className={`mt-3 max-w-md ${TEXT_MUTED}`}>{description}</p>}
    </div>
  );
}
