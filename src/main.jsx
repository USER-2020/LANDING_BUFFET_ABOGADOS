import React, { useState, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, Menu, X, Globe2, UsersRound, BriefcaseBusiness, Fingerprint, HeartHandshake, ShieldCheck, MessageCircle, Plus, Minus, Check, Compass, ChevronDown } from 'lucide-react';
import './styles.css';
import './brand.css';
import './language.css';
import './typography.css';
import { translate, initialLanguage } from './i18n';
import Attorneys from './Attorneys';
gsap.registerPlugin(ScrollTrigger);

const services = [
  { icon: UsersRound, title: 'Inmigración familiar', text: 'Porque estar cerca de quienes amas lo cambia todo. Exploremos las opciones para reunir a tu familia.', tag: 'Volver a estar juntos' },
  { icon: BriefcaseBusiness, title: 'Visas de trabajo', text: 'Tu talento merece nuevas oportunidades. Te orientamos para dar el siguiente paso en tu carrera.', tag: 'Crecer sin fronteras' },
  { icon: Fingerprint, title: 'Residencia y ciudadanía', text: 'Convierte un nuevo lugar en tu hogar. Conoce el camino hacia una vida con mayor estabilidad.', tag: 'Echar raíces' },
  { icon: ShieldCheck, title: 'Protección migratoria', text: 'Cuando más necesitas claridad, estamos contigo para escuchar tu historia y evaluar tus opciones.', tag: 'Mirar hacia adelante' },
];
const questions = [
  ['¿Cómo funciona la primera consulta?', 'Es un espacio para conocer tu historia, el país de destino y lo que quieres lograr. Revisaremos tu situación inicial y conversaremos sobre los siguientes pasos, el alcance del servicio y sus honorarios.'],
  ['¿Puedo recibir asesoría si estoy en otro país?', 'Puedes solicitar una consulta a distancia. La disponibilidad del servicio y la representación legal dependerán del país de destino y de la jurisdicción de tu caso.'],
  ['¿Qué documentos debo preparar?', 'Para comenzar, prepara un resumen de tu situación y tus preguntas. Durante la consulta te indicaremos qué documentos son necesarios. No envíes documentos de identidad ni información sensible a través de este formulario.'],
  ['¿Cuánto tiempo tarda un proceso migratorio?', 'Cada proceso es diferente. Los tiempos dependen del tipo de solicitud, la jurisdicción y las autoridades competentes. Una evaluación individual permite explicar mejor las etapas, sin garantizar plazos ni resultados.'],
];

function Logo({ t }) {
  return <a href="#inicio" className="logo" aria-label={t("U.S. Migration & Defense Group, inicio")}><img src="/us-migration-logo.jpeg" alt="Logo U.S. Migration & Defense Group"/><span>U.S. MIGRATION <b>&</b><small>DEFENSE GROUP</small></span></a>;
}

function App() {
  const [language, setLanguageState] = useState(initialLanguage);
  function setLanguage(nextLanguage) {
    setLanguageState(nextLanguage);
    try { localStorage.setItem('us-migration-language', nextLanguage); } catch {}
  }
  const t = (text) => translate(language, text);
  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'es' ? 'U.S. Migration & Defense Group — Tu futuro. Nuestra misión.' : 'U.S. Migration & Defense Group — Your future. Our mission.';
    document.querySelector('meta[name="description"]').content = language === 'es' ? 'Asesoría en inmigración y defensa legal. Conoce nuestros servicios y prepara tu consulta en español o inglés.' : 'Immigration and legal defense guidance. Explore our services and prepare your consultation in English or Spanish.';
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [language]);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-copy .eyebrow', { y: 16, opacity: 0, duration: .7 })
        .from('.hero-title-line > span', { yPercent: 110, rotate: 3, duration: 1.15, stagger: .14 }, '-=.4')
        .from('.hero-copy > p, .hero-actions, .hero-reassurance', { y: 24, opacity: 0, duration: .8, stagger: .12 }, '-=.7')
        .from('.brand-seal', { scale: .88, opacity: 0, rotate: -8, duration: 1.5 }, .3)
        .from('.hero-art-label, .floating-note, .hero-bottom', { y: 20, opacity: 0, stagger: .15, duration: .8 }, 1.1);
      gsap.utils.toArray('.section-top, .service-card, .about-visual, .about-copy, .process-step, .faq > div, .contact').forEach((element) => {
        gsap.from(element, { y: 42, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
      });
      gsap.to('.seal-orbit', { rotation: 90, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to('.reading-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });
    });
    return () => media.revert();
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedService, setSelectedService] = useState('');
  const [prepared, setPrepared] = useState(false);
  const [summary, setSummary] = useState(null);
  const selectService = (title) => { setSelectedService(title); setPrepared(false); };
  function submit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSummary(Object.fromEntries(data));
    setPrepared(true);
  }
  function download() {
    const url = URL.createObjectURL(new Blob([`${t('Solicitud de consulta')} — U.S. Migration & Defense Group\n${t('Nombre')}: ${summary.name}\n${t('Correo')}: ${summary.email}\n${t('Servicio')}: ${t(summary.service)}\n${t('Mensaje')}: ${summary.message || t('Sin mensaje adicional')}`], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = language === 'es' ? 'mi-consulta-us-migration.txt' : 'my-consultation-us-migration.txt'; anchor.click(); URL.revokeObjectURL(url);
  }
  return <>
    <div className="reading-progress" aria-hidden="true"/>
    <div className="announcement"><span>{t("Un nuevo país. Un nuevo comienzo. El mismo tú.")}</span><a href="#contacto">{t("Hablemos de tu futuro")}<ArrowUpRight size={13}/></a></div>
    <header className="header"><div className="container nav"><Logo t={t}/><nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label={t("Navegación principal")}><a href="#nosotros" onClick={() => setMenuOpen(false)}>{t("Nosotros")}</a><a href="#servicios" onClick={() => setMenuOpen(false)}>{t("Servicios")}</a><a href="#abogados" onClick={() => setMenuOpen(false)}>{t("Abogados")}</a><a href="#proceso" onClick={() => setMenuOpen(false)}>{t("Tu proceso")}</a><a href="#preguntas" onClick={() => setMenuOpen(false)}>{t("Preguntas frecuentes")}</a></nav><a className="button nav-cta" href="#contacto">{t("Agenda una consulta")}<ArrowUpRight size={17}/></a><div className="language-switch" role="group" aria-label={language === 'es' ? 'Idioma' : 'Language'}><button type="button" lang="es" aria-label="Español" aria-pressed={language === 'es'} onClick={() => setLanguage('es')}>ES</button><span aria-hidden="true">/</span><button type="button" lang="en" aria-label="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button></div><button className="menu-toggle" aria-label={menuOpen ? t('Cerrar menú') : t('Abrir menú')} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button></div></header>
    <main>
      <section className="hero" id="inicio"><div className="hero-grid container">
        <div className="hero-copy"><div className="eyebrow"><span className="little-line"/>{t("INMIGRACIÓN & DEFENSA LEGAL")}</div><h1><span className="hero-title-line"><span>{t("Tu futuro.")}</span></span><span className="hero-title-line"><span>{t("Nuestra")}</span></span><span className="hero-title-line gold-line"><span>{t("misión.")}</span></span></h1><p>{t("Cruzar una frontera cambia tu vida.")}<br/>{t("Contar con el respaldo adecuado, también.")}<br/>{t("Construyamos juntos tu próximo capítulo.")}</p><div className="hero-actions"><a className="button" href="#contacto">{t("Hablemos de tu caso")}<ArrowUpRight size={21}/></a><a className="text-link" href="#servicios">{t("Conoce nuestros servicios")}<ArrowRight size={18}/></a></div><div className="hero-reassurance"><span className="reassurance-icon"><ShieldCheck size={23}/></span><span>{t("Tu historia merece ser escuchada.")}<br/><strong>{t("Asesoría cercana. Un camino claro.")}</strong></span></div></div>
        <div className="hero-art"><div className="hero-art-label"><span className="gold-dot"/> PEOPLE. SOLUTIONS. A BRIGHTER TOMORROW.</div><div className="seal-stage"><div className="seal-orbit" aria-hidden="true"/><img className="brand-seal" src="/us-migration-logo.jpeg" alt={t("U.S. Migration & Defense Group: emblema dorado con bandera estadounidense y Capitolio")} fetchPriority="high"/></div><div className="floating-note"><span className="note-icon"><Globe2 size={27}/></span><div>{t("Un nuevo comienzo.")}<small>{t("El respaldo para dar el siguiente paso.")}</small></div><ArrowUpRight size={23}/></div></div>
        <div className="hero-bottom"><a href="#servicios"><span className="scroll-cue">↓</span>{t("DESCUBRE TU CAMINO")}</a><span>{t("COMPROMISO HUMANO")}<i/>{t("VISIÓN SIN FRONTERAS")}</span></div>
      </div></section>
      <div className="values-strip"><div className="container values"><span><MessageCircle/>{t("Hablamos tu idioma")}</span><span><HeartHandshake/>{t("Atención humana y cercana")}</span><span><Compass/>{t("Claridad en cada paso")}</span><span><Globe2/>{t("Acompañamiento a distancia")}</span></div></div>
      <section id="servicios" className="services section container"><div className="section-top"><div><div className="eyebrow">{t("UN CAMINO PARA CADA HISTORIA")}</div><h2>{t("Grandes sueños.")}<br/><span>{t("Pasos bien acompañados.")}</span></h2></div><p>{t("No hay dos historias iguales. Por eso, empezamos")}<br className="desktop-break"/>{' '}{t("por escucharte y encontrar el camino para ti.")}</p></div><div className="service-grid">{services.map(({icon: Icon, title, text, tag}, i) => <a key={title} className="service-card" href="#contacto" onClick={() => selectService(title)}><div className="card-top"><Icon size={27} strokeWidth={1.4}/><span>0{i + 1}</span></div><h3>{t(title)}</h3><p>{t(text)}</p><div className="card-bottom"><span>{t(tag)}</span><ArrowUpRight size={21}/></div></a>)}</div></section>
      <section className="about container" id="nosotros"><div className="about-visual"><img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=85" alt={t("Personas colaborando en un espacio de trabajo luminoso")} loading="lazy"/><span className="photo-label">{t("PERSONAS QUE ACOMPAÑAN A PERSONAS")}</span></div><div className="about-copy"><div className="eyebrow">{t("MÁS CERCA DE LO QUE IMAGINAS")}</div><h2>{t("Lo legal es nuestro trabajo.")}<br/><span>{t("Lo humano, nuestra esencia.")}</span></h2><p>{t("Migrar es mucho más que un trámite. Es llevar tus sueños a otro lugar, empezar de nuevo y abrirle espacio a lo que viene.")}</p><p>{t("En U.S. Migration & Defense Group creemos en una asesoría que escucha primero. Queremos que entiendas tus opciones y tomes decisiones con confianza, sintiéndote acompañado en cada etapa.")}</p><a className="text-link" href="#contacto">{t("Conversemos sobre tu historia")}<ArrowUpRight size={19}/></a></div></section>
      <Attorneys t={t}/>
      <section className="process section" id="proceso"><div className="container"><div className="section-top"><div><div className="eyebrow">{t("MENOS INCERTIDUMBRE. MÁS DIRECCIÓN.")}</div><h2>{t("El primer paso")}<br/><span>{t("es más sencillo de lo que crees.")}</span></h2></div><a href="#contacto" className="button button-outline">{t("Empecemos juntos")}<ArrowUpRight size={18}/></a></div><div className="process-grid">{[['01', 'Cuéntanos tu historia', 'Te escuchamos para entender dónde estás y a dónde quieres llegar.'], ['02', 'Trazamos un camino', 'Evaluamos tus opciones y te explicamos los pasos, el alcance y los costos.'], ['03', 'Avanzamos contigo', 'Te acompañamos en tu proceso, con comunicación clara y atención cercana.']].map(([number,title,text]) => <div className="process-step" key={number}><div className="step-number">{number}<span/></div><h3>{t(title)}</h3><p>{t(text)}</p></div>)}</div></div></section>
      <section id="preguntas" className="faq section container"><div><div className="eyebrow">{t("HABLEMOS CON CLARIDAD")}</div><h2>{t("Es normal")}<br/><span>{t("tener preguntas.")}</span></h2><p>{t("Aquí empiezan algunas respuestas.")}<br/>{t("Para lo demás, conversemos.")}</p><a className="text-link" href="#contacto">{t("Tengo otra pregunta")}<ArrowUpRight size={18}/></a></div><div className="faq-list">{questions.map(([q,a],i) => <div className={`faq-item ${openFaq === i ? 'active' : ''}`} key={q}><h3><button aria-expanded={openFaq === i} aria-controls={`answer-${i}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>{t(q)}{openFaq === i ? <Minus size={19}/> : <Plus size={19}/>}</button></h3><div id={`answer-${i}`} hidden={openFaq !== i}><p>{t(a)}</p></div></div>)}</div></section>
      <section className="contact container" id="contacto"><div className="contact-copy"><div className="eyebrow">{t("TU FUTURO MERECE UNA CONVERSACIÓN")}</div><h2>{t("Un primer paso.")}<br/>{t("Un mundo de")}<br/><span>{t("posibilidades.")}</span></h2><p>{t("Cuéntanos un poco de ti.")}<br/>{t("Demos forma a tu próximo capítulo.")}</p><div className="contact-detail"><MessageCircle size={21}/><span>{t("En español. Con calma. Contigo.")}</span></div><div className="contact-decoration" aria-hidden="true">✳</div></div><div className="contact-form-wrap">{prepared ? <div className="form-result" role="status"><span className="success-icon"><Check size={28}/></span><h3>{t("Tu consulta está preparada.")}</h3><p>{t("Esta es una demostración: tus datos no se han enviado. Puedes descargar tu resumen para conservarlo.")}</p><button className="button" onClick={download}>{t("Descargar mi resumen")}<ArrowRight size={18}/></button><button className="text-link" onClick={() => setPrepared(false)}>{t("Volver al formulario")}</button></div> : <form onSubmit={submit}><h3>{t("Hablemos de tu caso")}</h3><p className="form-intro">{t("Los grandes cambios empiezan con un hola.")}</p><label htmlFor="name">{t("Tu nombre")}</label><input id="name" name="name" autoComplete="name" placeholder={t("¿Cómo te llamas?")} required maxLength={100}/><label htmlFor="email">{t("Correo electrónico")}</label><input id="email" name="email" type="email" autoComplete="email" placeholder={t("tu@correo.com")} required/><label htmlFor="service">{t("¿En qué podemos acompañarte?")}</label><div className="select-wrap"><select id="service" name="service" value={selectedService} onChange={e => setSelectedService(e.target.value)} required><option value="" disabled>{t("Selecciona un servicio")}</option>{services.map(s => <option key={s.title} value={s.title}>{t(s.title)}</option>)}<option value="Quiero conocer mis opciones">{t("Quiero conocer mis opciones")}</option></select><ChevronDown size={16}/></div><label htmlFor="message">{t("Un poco de tu historia")}{' '}<span>{t("(opcional)")}</span></label><textarea id="message" name="message" rows={3} maxLength={1500} placeholder={t("Cuéntanos qué te gustaría lograr…")}/><p className="form-notice">{t("Formulario de demostración. No envía ni almacena tus datos. Evita incluir información sensible.")}</p><button type="submit" className="button">{t("Preparar mi consulta")}<ArrowUpRight size={18}/></button></form>}</div></section>
    </main>
    <footer className="footer container"><div className="footer-top"><Logo t={t}/><p>{t("Conectamos tu presente")}<br/>{t("con un futuro lleno de posibilidades.")}</p><a className="text-link" href="#inicio">{t("Volver al inicio")}<ArrowUpRight size={17}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {t('U.S. Migration & Defense Group · Todos los derechos reservados.')}</span><span>{t("El contenido es informativo y no constituye asesoría legal.")}</span><span>{t("Hecho para nuevos comienzos")}<span className="footer-star">✳</span></span></div></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);


