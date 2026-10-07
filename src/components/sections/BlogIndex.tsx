'use client';

import { PRIMARY, RADIUS_CHIP, TEXT_MUTED } from '@/lib/theme';
import type { BlogPost } from '@/types/blog';
import { useState } from 'react';
import { BlogCard } from '../common/BlogCard';

const CHIP_BASE = `text-[11.5px] tracking-[0.07em] uppercase font-bold px-4 py-[9px] ${RADIUS_CHIP} [transition:all_0.2s] cursor-pointer`;

function chipClass(active: boolean) {
  return active
    ? `${CHIP_BASE} ${PRIMARY} text-white shadow-none`
    : `${CHIP_BASE} bg-white ${TEXT_MUTED} shadow-[inset_0_0_0_1px_var(--line)] hover:text-ink hover:shadow-[inset_0_0_0_1px_var(--ink)]`;
}

/** Blog index grid with category filter chips. */
export function BlogIndex({ posts, categories }: { posts: BlogPost[]; categories: string[] }) {
  const [filter, setFilter] = useState('all');
  const visible = posts.filter((p) => filter === 'all' || p.category === filter);

  return (
    <section className="section">
      <div className="wrap">
        <div className="flex gap-2 flex-wrap mb-10">
          <button className={chipClass(filter === 'all')} onClick={() => setFilter('all')}>
            All guides
          </button>
          {categories.map((c) => (
            <button key={c} className={chipClass(filter === c)} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-[repeat(4,1fr)] gap-[26px] max-[1200px]:grid-cols-[repeat(3,1fr)]  max-[900px]:grid-cols-[repeat(2,1fr)] max-[620px]:grid-cols-[1fr]">
          {visible.map((p, index) => (
            <BlogCard key={p.slug} p={p} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
