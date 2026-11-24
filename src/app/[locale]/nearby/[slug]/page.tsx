import type { Metadata } from 'next';
import type { ReactNode } from 'react';
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
const labels = {
  en: {
    explore: 'Explore', about: 'Management and visitor access', facts: 'Visitor essentials',
    local: 'Local name', address: 'Address or entrance', region: 'Area', time: 'Suggested stay', minutes: 'minutes',
    hours: 'Opening hours', fees: 'Tickets and costs', transport: 'Getting there', history: 'What to look for',
    viewpoints: 'Photo viewpoints', stay: 'Where to stay', gallery: 'Photographs', reviews: 'Visitor reviews',
    readReviews: 'Read current reviews on Google Maps', directions: 'Directions and map', checked: 'Source checked 24 November 2026',
  },
  es: {
    explore: 'Explorar', about: 'Gestión y acceso', facts: 'Datos para la visita',
    local: 'Nombre local', address: 'Dirección o entrada', region: 'Zona', time: 'Estancia sugerida', minutes: 'minutos',
    hours: 'Horario de apertura', fees: 'Entradas y precios', transport: 'Cómo llegar', history: 'Detalles para observar',
    viewpoints: 'Puntos para fotografiar', stay: 'Dónde alojarse', gallery: 'Fotografías', reviews: 'Opiniones de visitantes',
    readReviews: 'Leer opiniones actuales en Google Maps', directions: 'Dirección y mapa', checked: 'Fuente consultada el 24 de noviembre de 2026',
  },
  zh: {
    explore: '探索', about: '管理与参观范围', facts: '基础信息', local: '当地名称', address: '地址或入口',
    region: '所在地区', time: '建议停留', minutes: '分钟', hours: '开放时间', fees: '门票与费用',
    transport: '交通方式', history: '历史与现场看点', viewpoints: '拍照机位', stay: '住宿建议',
    gallery: '实景照片', reviews: '游客评价', readReviews: '在 Google 地图查看最新游客评价',
    directions: '交通指南与地图', checked: '资料核对日期 2026年11月24日',
  },
};
function GuideSection({title,children}:{title:string;children:ReactNode}) {
  return <section className="my-9"><h2 className="font-display text-2xl font-semibold mb-3">{title}</h2>
    <div className="space-y-3 leading-relaxed">{children}</div></section>;
}
export default async function PlacePage({params}: Props) {
  const {locale, slug} = await params;
  setRequestLocale(locale);
  const index = nearbyPlaces.findIndex(item => item.slug === slug);
  if (index === -1 || !(locale in nearbyLabels)) notFound();
  const place = nearbyPlaces[index];
  const copy = place.copy[locale];
  const t = nearbyLabels[locale];
  const l = labels[locale];
  const next = nearbyPlaces[(index + 1) % nearbyPlaces.length];
  const questions = [[copy.question, copy.answer], [copy.q0, copy.a0], [copy.q1, copy.a1]];
  const structured = {
    '@context':'https://schema.org', '@type':'FAQPage',
    mainEntity: questions.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}})),
  };
  return <><Header solid/><main className="mx-auto max-w-4xl px-4 pt-28 pb-20 sm:px-6">
    <nav><a className="underline" href={'/'+locale+'/#nearby'}>{t.directory}</a> · {copy.region}</nav>
    <header className="mb-10">
      <h1 className="mt-6 mb-5 font-display text-3xl font-bold sm:text-5xl">{copy.title}</h1>
      <p className="mb-4 text-lg leading-relaxed">{copy.body}</p>
      <p>{l.hours} · {copy.hours}</p>
      <div className="flex flex-wrap gap-5 mt-3"><a className="underline" href={place.map}>{t.map}</a><a className="underline" href={place.map}>{l.readReviews}</a></div>
    </header>
    <section className="rounded-xl p-5 sm:p-7" style={{background:'var(--bg-secondary)'}}>
      <h2 className="font-display text-2xl font-semibold mb-3">{l.explore} {copy.title}</h2>
      <p>{copy.route}</p><h3 className="mt-5 mb-2 font-semibold">{l.about}</h3><p>{copy.management}</p>
    </section>
    <GuideSection title={l.facts}><table className="w-full text-left"><tbody>
      {[[l.local,place.copy.es.title],[l.region,copy.region],[l.address,place.address],[l.time,place.minutes+' '+l.minutes]].map(([label,value])=><tr key={label} className="border-b" style={{borderColor:'var(--border-color)'}}><th className="p-3 align-top">{label}</th><td className="p-3">{value}</td></tr>)}
    </tbody></table></GuideSection>
    <GuideSection title={l.hours}><p>{copy.hours}</p></GuideSection>
    <GuideSection title={l.fees}><p>{copy.fees}</p></GuideSection>
    <GuideSection title={l.transport}><p>{copy.transport}</p><address className="not-italic">{place.address}</address></GuideSection>
    <GuideSection title={l.history}><p>{copy.context}</p></GuideSection>
    <GuideSection title={t.route}><p>{copy.route}</p><p>{copy.a0}</p></GuideSection>
    <GuideSection title={l.viewpoints}><ul className="list-disc pl-6 space-y-2"><li>{copy.photo1}</li><li>{copy.photo2}</li></ul></GuideSection>
    <GuideSection title={l.stay}><p>{copy.stay}</p></GuideSection>
    <GuideSection title={l.gallery}><figure><img className="w-full max-h-[520px] object-contain rounded-xl" src={place.photo} alt={copy.caption}/>
      <figcaption className="pt-2 text-sm">{copy.caption} · <a className="underline" href={place.pictureSource}>{t.source}</a></figcaption></figure></GuideSection>
    <GuideSection title={l.reviews}><a className="underline" href={place.map}>{l.readReviews} · {copy.title}</a></GuideSection>
    <GuideSection title={l.directions}><address className="not-italic">{place.copy.es.title} · {place.address}</address><a className="underline" href={place.map}>{t.map}</a></GuideSection>
    <GuideSection title={t.faq}><dl>{questions.map(([q,a])=><div className="my-5" key={q}><dt className="font-semibold">{q}</dt><dd>{a}</dd></div>)}</dl></GuideSection>
    <div className="flex gap-4 flex-wrap">{(['es','en','zh'] as const).map(language=><a lang={language} hrefLang={language} key={language} className="underline" href={'/'+language+'/nearby/'+slug}>{({es:'Español',en:'English',zh:'中文'})[language]}</a>)}</div>
    <p className="mt-6">{t.next} · <a className="underline" href={'/'+locale+'/nearby/'+next.slug}>{next.copy[locale].title}</a></p>
    <p className="mt-5 text-sm"><a className="underline" href={place.source}>{t.source}</a> · {l.checked}</p>
  </main><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,'\\u003c')}}/><Footer/></>;
}
