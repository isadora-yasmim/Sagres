import Navbar from '../../components/layout/Navbar/Navbar'
import Footer from '../../components/layout/Footer/Footer'
import styles from './LegalPage.module.css'

function TermosPage() {
  return (
    <div className={[styles.page, styles.pageAlt].join(' ')}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.inner}>
          <h1 className={styles.title}>Termos de Uso</h1>
          <p className={styles.meta}>Última atualização: 30 de Maio de 2026</p>

          <p className={styles.intro}>
            Bem-vindo à plataforma SAGRES Monitoria. Ao acessar ou usar nosso serviço, você concorda
            em cumprir estes termos. Leia-os atentamente.
          </p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Aceitação dos Termos</h2>
            <p className={styles.sectionText}>
              O SAGRES é oferecido inicialmente a estudantes regularmente matriculados na
              Universidade Federal de Goiás (UFG). O acesso para discentes de outras universidades
              será disponibilizado em uma etapa posterior. O uso indevido de contas ou o fornecimento
              de dados falsos resultará na suspensão imediata do acesso.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Responsabilidades do Monitor</h2>
            <p className={styles.sectionText}>
              Monitores cadastrados comprometem-se a agir com ética, pontualidade e respeito. A
              comprovação de aprovação nas disciplinas é obrigatória. Em caso de cancelamento pelo
              monitor, aplicam-se penalidades detalhadas na seção de regras da plataforma.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Pagamentos e Escrow</h2>
            <p className={styles.sectionText}>
              O SAGRES utiliza um sistema de retenção segura (escrow). O valor pago pelo aluno fica
              retido e é repassado ao monitor apenas após a confirmação dupla da realização da aula,
              descontada a taxa administrativa da plataforma.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Código de Conduta</h2>
            <p className={styles.sectionText}>
              Não toleramos qualquer forma de assédio, fraude ou comportamento ofensivo. Qualquer
              violação pode ser reportada através de nossos canais de denúncia, resultando no
              banimento permanente da conta.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default TermosPage
