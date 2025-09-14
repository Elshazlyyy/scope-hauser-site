import ProjectsCarousel from '@/components/ProjectsCarousel';
import ThreeSliceImage from '@/components/ThreeSliceImage';

const ABOUT_IMAGE = '/images/About.png';

const STATS = [
  { value: '400+', label: 'Property Ready' },
  { value: '30+', label: 'Years of Experience' },
  { value: '10,000+', label: 'Happy Customers' },
];

const INTRO_TEXT = (
  <>
    Welcome to Scope Hauser Founded in 1995 and reimagined for today, <br />
    Scope Hauser brings nearly three decades of expertise to every client <br />
    relationship. Our focus is simple: measured decisions that deliver lasting{' '}
    <br />
    value. Whether you’re buying, selling, or investing, we make real estate{' '}
    <br />
    straightforward — property made easy, solutions made clear.
  </>
);

const VISION_TEXT = (
  <>
    Our vision is to be the most trusted and forward-thinking real estate <br />
    partner in the region. <br />
    We aim to redefine property experiences through innovation, <br />
    professionalism, and decades of knowledge.
  </>
);

export default function AboutPage() {
  return (
    <main className="px-6 md:px-12 lg:px-24 py-16 space-y-16">
      {/* Split About image into 3 slices */}
      <ThreeSliceImage src={ABOUT_IMAGE} />

      {/* Intro Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold">About Scope Hauser</h1>
        <p className="text-lg text-gray-600">{INTRO_TEXT}</p>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="p-6 border rounded-xl shadow-sm bg-white"
          >
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Vision Section */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold">Our Vision</h2>
        <p className="text-lg text-gray-600">{VISION_TEXT}</p>
      </section>

      {/* Projects Carousel */}
      <ProjectsCarousel />
    </main>
  );
}
