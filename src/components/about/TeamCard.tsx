import { ChatsCircleIcon, Headset, Mountains, PersonSimpleHike } from '@phosphor-icons/react';
import Image from 'next/image';
import { TeamMember } from './TeamCarousel';

const ICONS = {
  mountains: Mountains,
  hiker: PersonSimpleHike,
  chat: ChatsCircleIcon,
  headset: Headset,
} as const;

export default function TeamCard({
  name,
  role,
  body,
  image,
  icon,
  className = '',
}: TeamMember & { className?: string }) {
  const Icon = ICONS[icon];

  return (
    <article
      data-card
      tabIndex={0}
      aria-label={`${name}, ${role}`}
      className={`group relative aspect-[3/4] overflow-hidden rounded-2xl bg-paper outline-none
                  focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${className}`}
    >
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover object-center transition-transform duration-700 ease-out motion-reduce:transition-none group-hover:scale-105 group-focus-within:scale-105"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/70 to-transparent" />

      <header className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-6">
        <div>
          <h3 className="font-serif text-[24px] leading-tight text-white">{name}</h3>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-gold">{role}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111513] text-gold shadow-(--shadow)">
          <Icon size={20} weight="regular" />
        </span>
      </header>

      <div className="absolute inset-x-0 bottom-0 translate-y-6 bg-gradient-to-t from-black/90 via-black/75 to-transparent px-6 pb-6 pt-20 opacity-0 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <p className="text-[14px] leading-7 text-white/90">{body}</p>
      </div>
    </article>
  );
}
