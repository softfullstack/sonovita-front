import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/legal-page'
import { legalCompany as company } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Aviso de privacidad | Sonovita',
  description: 'Cómo Sonovita recaba, usa y protege tus datos personales conforme a la LFPDPPP.',
}

export default function PrivacyNoticePage() {
  return (
    <LegalPage title="Aviso de privacidad integral" lastUpdated={company.lastUpdated}>
      <p>
        En cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (en adelante, la
        «Ley»), su Reglamento y demás disposiciones aplicables, ponemos a tu disposición el presente Aviso de Privacidad.
      </p>

      <h2>1. Identidad y domicilio del responsable</h2>
      <p>
        {company.name} (en adelante, «Sonovita»), con RFC {company.rfc} y domicilio en {company.address}, es responsable del
        tratamiento de los datos personales que recaba a través del sitio {company.website} (el «Sitio»).
      </p>

      <h2>2. Datos personales que recabamos</h2>
      <p>Para las finalidades señaladas en este aviso, podemos recabar las siguientes categorías de datos:</p>
      <ul>
        <li><strong>Identificación:</strong> nombre o razón social.</li>
        <li><strong>Contacto:</strong> correo electrónico y número telefónico (incluido el que uses para WhatsApp).</li>
        <li><strong>Autenticación:</strong> contraseña (almacenada de forma cifrada) y códigos de verificación enviados a tu correo.</li>
        <li>
          <strong>Información de los equipos que publicas:</strong> marca, modelo, año, estado, registro sanitario, precio,
          descripción, fotografías y ubicación del equipo (código postal, colonia, municipio o alcaldía, ciudad y estado).
        </li>
        <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador y datos de uso del Sitio.</li>
      </ul>
      <p>
        Sonovita <strong>no recaba datos personales sensibles</strong> ni datos financieros o bancarios. Te pedimos no incluir
        en las descripciones ni en las fotografías de tus equipos datos de pacientes, expedientes clínicos o cualquier otra
        información sensible de terceros.
      </p>

      <h2>3. Finalidades del tratamiento</h2>
      <p>Tus datos se utilizan para las siguientes <strong>finalidades primarias</strong>, necesarias para el servicio:</p>
      <ol>
        <li>Crear y administrar tu cuenta, así como verificar tu correo electrónico y permitir la recuperación de tu contraseña.</li>
        <li>Recibir, revisar y validar los datos e imágenes de los equipos que envías antes de publicarlos.</li>
        <li>Publicar tus anuncios aprobados en el catálogo del Sitio.</li>
        <li>
          Permitir que compradores interesados te contacten: tu nombre y teléfono se muestran en tus anuncios publicados y se
          usan para generar el enlace de contacto por WhatsApp.
        </li>
        <li>Atender tus dudas, aclaraciones y solicitudes.</li>
        <li>Prevenir fraudes, mantener la seguridad del Sitio y cumplir obligaciones legales.</li>
      </ol>
      <p>De manera adicional, podemos usar tus datos para las siguientes <strong>finalidades secundarias</strong>:</p>
      <ol>
        <li>Enviarte información sobre novedades, equipos o promociones del Sitio.</li>
        <li>Elaborar estadísticas y mejorar nuestros servicios.</li>
      </ol>
      <p>
        Si no deseas que tus datos se usen para las finalidades secundarias, envía un correo a{' '}
        <a href={`mailto:${company.email}`}>{company.email}</a> indicándolo. Tu negativa no será motivo para negarte el servicio.
      </p>

      <h2>4. Transferencias de datos</h2>
      <p>
        Al publicar un anuncio, tu nombre, teléfono y la ubicación general del equipo quedan visibles para los visitantes del
        Sitio, con la finalidad de que puedan contactarte. Al iniciar una conversación por WhatsApp, la comunicación se rige por
        los términos y el aviso de privacidad de WhatsApp (Meta).
      </p>
      <p>
        Sonovita no vende ni renta tus datos personales. Podemos compartirlos con proveedores que nos prestan servicios de
        alojamiento, envío de correos electrónicos y analítica, quienes los tratan por cuenta nuestra y bajo obligaciones de
        confidencialidad, así como con autoridades competentes cuando exista un requerimiento legal. Estas comunicaciones no
        requieren tu consentimiento conforme a la Ley.
      </p>

      <h2>5. Derechos ARCO y revocación del consentimiento</h2>
      <p>
        Tienes derecho a <strong>Acceder</strong> a tus datos, <strong>Rectificarlos</strong> si son inexactos,{' '}
        <strong>Cancelarlos</strong> cuando consideres que no se requieren para las finalidades señaladas, y{' '}
        <strong>Oponerte</strong> a su tratamiento para fines específicos (derechos ARCO). También puedes revocar el
        consentimiento que nos hayas otorgado.
      </p>
      <p>
        Para ejercerlos, envía tu solicitud a <a href={`mailto:${company.email}`}>{company.email}</a> con: (i) tu nombre y correo
        para comunicarte la respuesta; (ii) una identificación oficial o, en su caso, la representación legal; (iii) la
        descripción clara del derecho que deseas ejercer y de los datos involucrados; y (iv) cualquier documento que facilite
        la localización de tus datos.
      </p>
      <p>
        Te responderemos en un plazo máximo de 20 días hábiles desde la recepción de la solicitud y, de ser procedente, la
        haremos efectiva dentro de los 15 días hábiles siguientes. Puedes corregir en cualquier momento los datos de tus
        anuncios desde la sección <em>Mi cuenta</em>.
      </p>

      <h2>6. Limitación del uso o divulgación</h2>
      <p>
        Puedes limitar el uso de tus datos escribiendo a <a href={`mailto:${company.email}`}>{company.email}</a>. También puedes
        inscribirte en el Registro Público para Evitar Publicidad (REPEP) de la PROFECO.
      </p>

      <h2>7. Cookies y tecnologías similares</h2>
      <p>
        El Sitio utiliza almacenamiento local del navegador para mantener tu sesión iniciada, así como herramientas de
        analítica que recaban datos técnicos de navegación de forma agregada. Puedes deshabilitarlas desde la configuración
        de tu navegador; sin embargo, algunas funciones del Sitio, como iniciar sesión, podrían dejar de funcionar.
      </p>

      <h2>8. Conservación y seguridad</h2>
      <p>
        Conservamos tus datos mientras tu cuenta esté activa y durante el tiempo necesario para cumplir obligaciones legales.
        Aplicamos medidas de seguridad administrativas, técnicas y físicas para protegerlos contra daño, pérdida, alteración o
        acceso no autorizado.
      </p>

      <h2>9. Cambios a este aviso</h2>
      <p>
        Este aviso puede modificarse por cambios legales o en nuestros servicios. Publicaremos cualquier cambio en esta página
        e indicaremos la fecha de la última actualización.
      </p>

      <h2>10. Autoridad</h2>
      <p>
        Si consideras que tu derecho a la protección de datos personales ha sido vulnerado, puedes acudir ante la autoridad
        competente en materia de protección de datos personales.
      </p>

      <p className="text-sm text-[#796d77]">
        Consulta también nuestros <Link href="/terminos-y-condiciones/">Términos y condiciones</Link>.
      </p>
    </LegalPage>
  )
}
