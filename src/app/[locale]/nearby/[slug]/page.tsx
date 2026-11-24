import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { nearbyLabels, nearbyPlaces, type NearbyLanguage } from '@/data/nearby';
import { getBaseUrl } from '@/lib/env';

type Props = { params: Promise<{ locale: NearbyLanguage; slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return nearbyPlaces.map(({slug}) => ({slug}));
}
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const place = nearbyPlaces.find(item => item.slug === slug);
  if (!place || !place.copy[locale]) notFound();
  const copy = place.copy[locale];
  const link = (language: string) => getBaseUrl() + '/' + language + '/nearby/' + slug;
  return { title: copy.title + ' | Atlántico', description: copy.body, alternates: {
    canonical: link(locale), languages: {es: link('es'), en: link('en'), zh: link('zh'), 'x-default': link('es')}
  }, openGraph: { title: copy.title, description: copy.body, url: link(locale), images: [getBaseUrl()+place.photo] }};
}
export default async function PlacePage({params}: Props) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const index = nearbyPlaces.findIndex(item => item.slug === slug);
  if (index === -1 || !(locale in nearbyLabels)) notFound();
  const place = nearbyPlaces[index];
  const copy = place.copy[locale];
  const t = nearbyLabels[locale];
  const next = nearbyPlaces[(index + 1) % nearbyPlaces.length];
  const questions = [[copy.question, copy.answer], [t.address, place.address], [t.manager, copy.management]];
  return <><Header solid/><main className="mx-auto max-w-4xl px-4 pt-28 pb-20 sm:px-6">
    <a className="underline" href={'/'+locale+'/#nearby'}>{t.directory}</a>
    <h1 className="mt-6 mb-5 font-display text-3xl font-bold sm:text-5xl">{copy.title}</h1>
    <p className="mb-6 text-lg leading-relaxed">{copy.body}</p>
    <figure><img className="w-full max-h-[520px] object-contain rounded-xl" src={place.photo} alt={copy.title}/><figcaption className="pt-2 text-sm"><a className="underline" href={place.source}>{t.source}</a></figcaption></figure>
    <section className="my-9"><h2 className="font-display text-2xl font-semibold mb-3">{t.route}</h2><p className="leading-relaxed">{copy.route}</p></section>
    <section className="rounded-xl p-5" style={{background:'var(--bg-secondary)'}}><h2 className="font-display text-2xl font-semibold mb-3">{t.practical}</h2><p>{copy.management}</p><address className="my-3 not-italic">{place.address}</address><a className="underline" href={place.map}>{t.map}</a></section>
    <section className="my-9"><h2 className="font-display text-2xl font-semibold">{t.faq}</h2><dl>{questions.map(([q,a])=><div className="my-5" key={q}><dt className="font-semibold">{q}</dt><dd>{a}</dd></div>)}</dl></section>
    <div className="flex gap-4 flex-wrap">{(['es','en','zh'] as const).map(l=><a lang={l} hrefLang={l} key={l} className="underline" href={'/'+l+'/nearby/'+slug}>{({es:'Español',en:'English',zh:'中文'})[l]}</a>)}</div>
    <p className="mt-6">{t.next} · <a className="underline" href={'/'+locale+'/nearby/'+next.slug}>{next.copy[locale].title}</a></p>
  </main><Footer/></>;
}
