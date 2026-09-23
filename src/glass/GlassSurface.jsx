import { useEffect, useRef } from 'react';
import { Container } from './container.js';

/**
 * Wraps children in a real WebGL liquid-glass surface (dashersw/liquid-glass-js).
 * The glass canvas is inserted as the host's first child (behind the content)
 * and samples the actual page: edge refraction, rim lighting, gaussian blur,
 * and a dark-tinted gradient.
 */
export default function GlassSurface({
  children,
  className = '',
  borderRadius = 26,
  tintOpacity = 0.22,
  style,
}) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const glass = new Container({ borderRadius, tintOpacity });
    glass.element.classList.add('glass-surface');
    host.insertBefore(glass.element, host.firstChild);

    const sync = () => {
      const rect = host.getBoundingClientRect();
      glass.element.style.width = `${Math.ceil(rect.width)}px`;
      glass.element.style.height = `${Math.ceil(rect.height)}px`;
      glass.updateSizeFromDOM();
      if (glass.render) glass.render();
    };
    const raf = requestAnimationFrame(sync);
    const observer = new ResizeObserver(sync);
    observer.observe(host);
    // Re-sync once the page snapshot + WebGL init settle
    const late = setTimeout(sync, 1200);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(late);
      observer.disconnect();
      const index = Container.instances.indexOf(glass);
      if (index > -1) Container.instances.splice(index, 1);
      glass.element.remove();
    };
  }, [borderRadius, tintOpacity]);

  return (
    <div ref={hostRef} className={`glass-host ${className}`} style={style}>
      <div className="glass-content">{children}</div>
    </div>
  );
}
