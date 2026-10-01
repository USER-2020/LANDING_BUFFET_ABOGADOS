import { Mail, MapPin, MessageCircle, Phone, ArrowUpRight } from 'lucide-react';
import useAttorneyCarousel from './useAttorneyCarousel';
import './attorneys.css';

// Replace email values once the institutional domain and mailboxes are confirmed.
const attorneys = [
  { name: 'Alexander James Cooper', initials: 'AC', license: '318302', email: 'lic.alexandercooper@gmail.com', whatsapp: '16562018658', whatsappLabel: '+1 (656) 201-8658', phone: '+14043627000', phoneLabel: '+1 (404) 362-7000' },
  { name: 'Alicia Verónica Ramírez', initials: 'AR', license: '283642', email: 'lawramirezveronica@gmail.com', whatsapp: '15642225649', whatsappLabel: '+1 (564) 222-5649', phone: '+15642225649', phoneLabel: '+1 (564) 222-5649' },
  { name: 'Eddie Corona', initials: 'EC', license: '323623', email: null, whatsapp: '16285002679', whatsappLabel: '+1 (628) 500-2679', phone: null },
  { name: 'Manuel E. Solis', initials: 'MS', license: '18826790', email: null, location: 'Chicago, Illinois', whatsapp: '18033866785', whatsappLabel: '+1 (803) 386-6785', phone: '+18033866785', phoneLabel: '+1 (803) 386-6785' },
];

export default function Attorneys({ t }) {
  const carousel = useAttorneyCarousel(attorneys.length);
  return <section className="attorneys section container" id="abogados" aria-labelledby="attorneys-title">
    <div className="section-top">
      <div><div className="eyebrow">{t('NUESTRO EQUIPO LEGAL')}</div><h2 id="attorneys-title">{t('Conoce a nuestros')}<br/><span>{t('abogados.')}</span></h2></div>
      <p>{t('Detrás de cada caso, una conversación. Contacta directamente con los abogados de nuestro equipo.')}</p>
    </div>
    <div className="attorney-carousel" role="region" aria-roledescription={t('Carrusel')} aria-label={t('NUESTRO EQUIPO LEGAL')} {...carousel.interaction}>
    <div className="attorney-viewport" ref={carousel.viewport}>
    <div className={`attorney-track${carousel.animated ? ' is-moving' : ''}`} style={{ transform: `translate3d(${-carousel.index * carousel.step}px, 0, 0)` }} onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === 'transform') carousel.settle(); }}>
      {[...attorneys, ...attorneys, ...attorneys].map((attorney, position) => <article className="attorney-card" key={`${attorney.name}-${position}`} inert={position < carousel.index || position >= carousel.index + carousel.visible} aria-hidden={position < carousel.index || position >= carousel.index + carousel.visible}>
        <div className="attorney-identity"><span className="attorney-monogram" aria-hidden="true">{attorney.initials}</span>{attorney.license ? <span className="attorney-license">{t('Licencia / Bar No.')}<strong>#{attorney.license}</strong></span> : attorney.title && <span className="attorney-license">{t(attorney.title)}</span>}</div>
        <h3>{attorney.name}</h3>
        <p className="attorney-location"><MapPin size={16} aria-hidden="true"/>{t(attorney.location || 'Los Ángeles, California')}</p>
        <div className="attorney-details">
          <a href={`https://wa.me/${attorney.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp: ${attorney.name}, ${attorney.whatsappLabel}`}><MessageCircle size={17} aria-hidden="true"/><span><small>WhatsApp</small>{attorney.whatsappLabel}</span></a>
          {attorney.phone && <a href={`tel:${attorney.phone}`} aria-label={`${t('Llamadas')}: ${attorney.name}, ${attorney.phoneLabel}`}><Phone size={17} aria-hidden="true"/><span><small>{t('Llamadas')}</small>{attorney.phoneLabel}</span></a>}
          {attorney.email && <a href={`mailto:${attorney.email}`}><Mail size={17} aria-hidden="true"/><span><small>{t('Correo electrónico')}</small>{attorney.email}</span></a>}
        </div>
        <div className="attorney-actions">
          <a className="button" href={`https://wa.me/${attorney.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp: ${attorney.name}`}>WhatsApp<ArrowUpRight size={18} aria-hidden="true"/></a>
          {attorney.email ? <a className="attorney-email" href={`mailto:${attorney.email}`} aria-label={`${t('Enviar correo')}: ${attorney.name}`}><Mail size={17} aria-hidden="true"/>{t('Enviar correo')}</a> : !attorney.hideEmail && <span className="attorney-email-pending">{t('Correo próximamente')}</span>}
        </div>
      </article>)}
    </div>
    </div>
    <div className="attorney-indicators" role="group" aria-label={t('Elegir abogado')}>
      {attorneys.map((attorney, position) => <button
        key={attorney.name}
        type="button"
        aria-label={`${t('Ver abogado')}: ${attorney.name}`}
        aria-current={carousel.index % attorneys.length === position ? 'true' : undefined}
        onClick={() => carousel.goTo(position)}
      ><span aria-hidden="true"/></button>)}
    </div>
    </div>
  </section>;
}
