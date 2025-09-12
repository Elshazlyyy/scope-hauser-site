import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/types/project';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="overflow-hidden rounded-2xl border transition hover:shadow">
      <div className="relative h-48 w-full">
        {project.image1?.src && (
          <Image
            src={project.image1.src}
            alt={project.image1.alt ?? project.name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={false}
          />
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="text-xs tracking-wide text-neutral-500 uppercase">
          {project.propertyType} {project.location && `· ${project.location}`}
        </div>
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <p className="line-clamp-2 text-sm text-neutral-600">
          {project.description}
        </p>
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
