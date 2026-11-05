import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/legal-page'
import { legalCompany as company } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Términos y condiciones | Sonovita',
  description: 'Condiciones de uso del marketplace de equipos médicos Sonovita.',
}

export default function TermsPage() {
  return (
    <LegalPage title="Términos y condiciones de uso" lastUpdated={company.lastUpdated}>
      <p>
        Estos Términos y condiciones (los «Términos») regulan el acceso y uso del sitio {company.website} (el «Sitio»),
        operado por {company.name} (en adelante, «Sonovita»), con RFC {company.rfc} y domicilio en {company.address}. Al
        navegar en el Sitio, crear una cuenta o publicar un equipo, aceptas estos Términos y nuestro{' '}
        <Link href="/aviso-de-privacidad/">Aviso de privacidad</Link>. Si no estás de acuerdo, no utilices el Sitio.
      </p>

      <h2>1. Naturaleza del servicio</h2>
      <p>
        Sonovita es una plataforma en línea que permite a profesionales, clínicas, distribuidores y particulares (los
        «Usuarios») publicar y consultar anuncios de equipos médicos, como equipos de ultrasonido, nuevos y seminuevos.
      </p>
      <p>
        Sonovita actúa únicamente como <strong>intermediario</strong> que pone en contacto a vendedores y compradores.{' '}
        <strong>Sonovita no es propietario, vendedor, distribuidor ni fabricante</strong> de los equipos anunciados, no
        participa en la negociación, no recibe pagos por cuenta de los Usuarios y no es parte de la compraventa que, en su
        caso, celebren entre ellos.
      </p>

      <h2>2. Registro y cuenta</h2>
      <ul>
        <li>Para publicar equipos debes crear una cuenta con datos verdaderos, completos y actualizados, y verificar tu correo.</li>
        <li>Debes ser mayor de edad y tener capacidad legal para contratar, o actuar en representación de una persona moral con facultades suficientes.</li>
        <li>Eres responsable de la confidencialidad de tu contraseña y de toda actividad realizada desde tu cuenta.</li>
        <li>Sonovita puede suspender o cancelar cuentas que incumplan estos Términos o proporcionen información falsa.</li>
      </ul>

      <h2>3. Publicación de equipos y validación</h2>
      <p>
        Todo equipo que envíes queda <strong>pendiente de revisión</strong>. El equipo administrador de Sonovita revisa los
        datos y las imágenes antes de publicarlo y puede aprobarlo, solicitarte correcciones o rechazarlo a su criterio, por
        ejemplo cuando la información sea incompleta, engañosa, las fotografías no correspondan al equipo o el anuncio
        contravenga estos Términos o la ley. Sonovita también puede retirar en cualquier momento un anuncio ya publicado.
      </p>
      <p>
        La revisión tiene como único propósito mantener la calidad del catálogo. <strong>No constituye una inspección
        técnica, certificación, garantía ni aval</strong> del estado, funcionamiento, legitimidad o cumplimiento regulatorio
        del equipo.
      </p>

      <h2>4. Responsabilidades del vendedor</h2>
      <p>Al publicar un equipo, declaras y garantizas que:</p>
      <ul>
        <li>Eres propietario del equipo o cuentas con autorización para venderlo, y está libre de gravámenes o reclamaciones.</li>
        <li>La información del anuncio (marca, modelo, año, estado, precio, accesorios y descripción) es veraz y no induce a error.</li>
        <li>Las fotografías son propias o tienes derecho a usarlas, y muestran el equipo real que ofreces.</li>
        <li>
          El equipo y su comercialización cumplen la normatividad sanitaria aplicable, incluida, en su caso, la relativa al
          registro sanitario ante la COFEPRIS y las Normas Oficiales Mexicanas correspondientes.
        </li>
        <li>No incluirás datos de pacientes, expedientes clínicos ni información personal de terceros en tus anuncios o fotografías.</li>
        <li>Responderás frente al comprador por el estado del equipo, su entrega, garantía, facturación y obligaciones fiscales.</li>
      </ul>

      <h2>5. Responsabilidades del comprador</h2>
      <p>
        Antes de comprar, te recomendamos verificar personalmente el equipo, su funcionamiento, documentación, registro
        sanitario y la identidad del vendedor. La decisión de compra, el pago y la entrega se acuerdan directamente entre
        comprador y vendedor, bajo su exclusiva responsabilidad.
      </p>

      <h2>6. Contacto por WhatsApp</h2>
      <p>
        El Sitio muestra el teléfono del vendedor y un enlace para contactarlo por WhatsApp. Al usarlo, la comunicación ocurre
        fuera del Sitio y se rige por los términos de WhatsApp (Meta). Sonovita no monitorea, almacena ni es responsable de las
        conversaciones, acuerdos o pagos que se realicen por ese medio. Desconfía de solicitudes de anticipos o pagos a cuentas
        de terceros y reporta cualquier conducta sospechosa a <a href={`mailto:${company.email}`}>{company.email}</a>.
      </p>

      <h2>7. Contenido y conductas prohibidas</h2>
      <ul>
        <li>Publicar equipos robados, falsificados, de procedencia ilícita o cuya venta esté prohibida o restringida sin cumplir los requisitos legales.</li>
        <li>Publicar medicamentos, sustancias controladas o productos distintos a equipos médicos.</li>
        <li>Usar el Sitio para fraudes, spam, suplantación de identidad o para recopilar datos de otros Usuarios.</li>
        <li>Intentar vulnerar la seguridad del Sitio o interferir con su funcionamiento.</li>
      </ul>

      <h2>8. Limitación de responsabilidad</h2>
      <p>
        En la medida permitida por la ley, Sonovita no será responsable por: la veracidad de los anuncios; la calidad,
        seguridad, legalidad o funcionamiento de los equipos; el incumplimiento de compradores o vendedores; ni por daños
        derivados de las operaciones celebradas entre Usuarios. El Sitio se ofrece «tal cual» y puede presentar
        interrupciones por mantenimiento o causas ajenas a Sonovita.
      </p>

      <h2>9. Propiedad intelectual</h2>
      <p>
        La marca Sonovita, el logotipo, el diseño y el software del Sitio son propiedad de Sonovita o de sus licenciantes. Al
        publicar un anuncio, otorgas a Sonovita una licencia gratuita y no exclusiva para mostrar, adaptar (por ejemplo,
        recortar o redimensionar) y difundir su contenido e imágenes con el fin de operar y promocionar el Sitio.
      </p>

      <h2>10. Costos</h2>
      <p>
        Actualmente, crear una cuenta y publicar equipos en el Sitio no tiene costo. Si en el futuro se establecen tarifas o
        servicios de pago, se informarán previamente y no se aplicarán sin tu aceptación.
      </p>

      <h2>11. Modificaciones</h2>
      <p>
        Sonovita puede modificar estos Términos en cualquier momento. Los cambios se publicarán en esta página con su fecha de
        actualización; el uso continuo del Sitio después de su publicación implica su aceptación.
      </p>

      <h2>12. Legislación aplicable y jurisdicción</h2>
      <p>
        Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Para su interpretación y cumplimiento, las
        partes se someten a los tribunales competentes de {company.jurisdiction}, renunciando a cualquier otro fuero que pudiera
        corresponderles, sin perjuicio de los derechos que la Ley Federal de Protección al Consumidor otorga, en su caso, a los
        consumidores ante la PROFECO.
      </p>

      <h2>13. Contacto</h2>
      <p>
        Para cualquier duda sobre estos Términos, escríbenos a <a href={`mailto:${company.email}`}>{company.email}</a>.
      </p>
    </LegalPage>
  )
}
