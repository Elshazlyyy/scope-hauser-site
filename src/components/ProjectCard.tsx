import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/types/project';

export default function ProjectCard({ project }: { project: Project }) {
  const src = project.imageUrl || '';

  return (
    <article className="overflow-hidden rounded-2xl border transition hover:shadow">
      <div className="relative h-48 w-full">
        {src ? (
          <Image
            src={src}
            alt={project.projectName}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={false}
          />
        ) : (
          <div className="h-full w-full bg-neutral-100" />
        )}
      </div>

      <div className="space-y-2 p-4">
        <div className="text-xs tracking-wide text-neutral-500 uppercase">
          {project.location ? `Project · ${project.location}` : 'Project'}
        </div>
        <h3 className="text-lg font-semibold">{project.projectName}</h3>

        <div className="pt-3">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-block text-sm underline underline-offset-4"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
