import { nearbyPlaces, nearbyLabels, type NearbyLanguage } from '@/data/nearby';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Intro from '@/components/Intro';
import BasicInfo from '@/components/BasicInfo';
import DeepDive from '@/components/DeepDive';
import HistoryTimeline from '@/components/HistoryTimeline';
import DidYouKnow from '@/components/DidYouKnow';
import FAQ from '@/components/FAQ';
import RouteSection from '@/components/RouteSection';
import HoursSection from '@/components/HoursSection';
import TicketsSection from '@/components/TicketsSection';
import TransportSection from '@/components/TransportSection';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import MapEmbed from '@/components/MapEmbed';
import Footer from '@/components/Footer';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const access = await getTranslations({ locale, namespace: 'accessNotice' });

  const language = locale as NearbyLanguage;
  const nearby = nearbyLabels[language];
  return (
    <>
      <Header />
      <main>
        <Hero />
        <section aria-labelledby="access-notice" className="mx-auto my-8 max-w-5xl px-4 sm:px-6">
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950 sm:p-6">
            <h2 id="access-notice" className="mb-2 text-xl font-semibold">{access('title')}</h2>
            <p className="leading-relaxed">{access('body')}</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <li><a className="underline" href="https://www.atlantico.gov.co/index.php/para-ninos-y-ninas-77012?catid=800&amp;id=28657%3Agobernacion-del-atlantico-prepara-intervenciones-para-la-recuperacion-del-castillo-de-salgar&amp;view=article">{access('gov')}</a></li>
              <li><a className="underline" href="https://www.elheraldo.co/atlantico/2026/10/15/gobernacion-pide-respetar-restricciones-en-el-castillo-de-salgar-durante-obras-de-recuperacion/">{access('press')}</a></li>
            </ul>
          </div>
        </section>
        <About />
        <Intro />
        <BasicInfo />
        <DeepDive />
        <HistoryTimeline />
        <DidYouKnow />
        <RouteSection />
        <HoursSection />
        <TicketsSection />
        <TransportSection />
        <Gallery />
        <Reviews />
        <FAQ />
        <section id="nearby" className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-3xl font-semibold">{nearby.directory}</h2>
          <p className="my-4">{nearby.intro}</p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{nearbyPlaces.map(place => <li key={place.slug}><a className="block border rounded-lg p-3 hover:underline" href={'/'+locale+'/nearby/'+place.slug}>{place.copy[language].title}</a></li>)}</ul>
        </section>
        <MapEmbed />
      </main>
      <Footer />
    </>
  );
}
