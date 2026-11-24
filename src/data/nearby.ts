import data from './nearby.json';

export type NearbyLanguage = 'es' | 'en' | 'zh';
export const nearbyPlaces = data;
export const nearbyLabels = {
  es: { directory: 'Lugares para visitar', route: 'Recorrido a pie', practical: 'Información práctica', map: 'Ver el punto en el mapa', faq: 'Preguntas de visitantes', source: 'Fuente y fotografía: Visit Barranquilla', address: '¿Qué dirección debo usar para llegar?', manager: '¿Quién orienta sobre el acceso?', next: 'Siguiente lugar', intro: 'Del litoral de Puerto Colombia al centro de Barranquilla y otros municipios del Atlántico. Cada paseo empieza en el lugar indicado; organiza por separado el traslado entre municipios.' },
  en: { directory: 'Places to explore', route: 'Walking route', practical: 'Visitor information', map: 'View this location on the map', faq: 'Visitor questions', source: 'Source and photograph: Visit Barranquilla', address: 'Which address should I use to get here?', manager: 'Who can advise on access?', next: 'Next place', intro: 'From the Puerto Colombia shore to central Barranquilla and other Atlántico towns. Each walk starts at the named destination; arrange transport between towns separately.' },
  zh: { directory: '周边景点', route: '现场步行路线', practical: '参观信息', map: '在地图中查看此地点', faq: '游客常见问题', source: '资料与实景图来自巴兰基亚市旅游目录', address: '导航时应该使用哪个地址？', manager: '参观和进入场地由谁负责？', next: '下一处景点', intro: '从哥伦比亚港海岸到巴兰基亚老城及大西洋省其他市镇。每条步行路线从对应地点开始，跨市镇路段请另行安排交通。' },
};
