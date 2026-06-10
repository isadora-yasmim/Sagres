import Navbar from '../../components/layout/Navbar/Navbar'
import Footer from '../../components/layout/Footer/Footer'
import styles from './LegalPage.module.css'

function PrivacidadePage() {
  return (
    <div className={[styles.page, styles.pageAlt].join(' ')}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.inner}>
          <h1 className={styles.title}>Política de Privacidade</h1>
          <p className={styles.meta}>Conformidade LGPD — Atualizado em 30 de Maio de 2026</p>

          <p className={styles.intro}>
            A SAGRES tem o compromisso de proteger sua privacidade. Coletamos e utilizamos seus
            dados pessoais (nome, e-mail institucional e informações acadêmicas) exclusivamente
            para viabilizar as monitorias.
          </p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Uso das Informações</h2>
            <p className={styles.sectionText}>
              Seus dados são usados para o agendamento, processamento de pagamentos e
              funcionamento do chat interno. Não compartilhamos, vendemos ou alugamos suas
              informações para terceiros.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Seus Direitos (LGPD)</h2>
            <p className={styles.sectionText}>
              Você pode acessar a área de "Configurações" da sua conta a qualquer momento para
              fazer o download completo de seus dados ou solicitar a exclusão permanente de sua
              conta e informações pessoais.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default PrivacidadePage
