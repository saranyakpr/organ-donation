import PublicSiteLayout from '../components/PublicSiteLayout'

const ContactPage = () => (
  <PublicSiteLayout>
    <div className='public-container'>
      <div className='public-contact-row'>
        <article className='public-info-card public-contact-card'>
          <img src='/mail-icon.svg' alt='' />
          <h3>Have Questions?</h3>
          <p>
            Get in touch now !
            <br />
            organdonationplatform@gmail.com
          </p>
        </article>
      </div>
    </div>
  </PublicSiteLayout>
)

export default ContactPage
