import { getLatestPosts } from '@/lib/cms';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';
import { BlogCard } from '../common/BlogCard';
import SectionHeader from '../common/SectionHeader';

/** Homepage "stories from the trail" — latest four posts. */
export async function BlogPreview() {
  const posts = await getLatestPosts(4);

  return (
    <section className="section bg-paper" id="blog">
      <div className="wrap">
        <SectionHeader eyebrow="News, tips & insights" title="Stories from the trail." />

        <div
          className="reveal grid md:grid-cols-3 xl:grid-cols-4 gap-[24px] max-[860px]:grid-cols-1"
          suppressHydrationWarning
        >
          {posts.map((p, index) => (
            <BlogCard key={p.slug} p={p} index={index} />
          ))}
          <div className="col-span-full flex justify-center mt-6">
            <Link className="btn btn-ghost" href={ROUTES.blog}>
              Read all articles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
