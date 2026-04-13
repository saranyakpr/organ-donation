import PublicSiteLayout from '../components/PublicSiteLayout'

const needCards = [
  {
    icon: '/waiting-list-icon.svg',
    text: 'A person is added to the waiting list every 9 minutes',
  },
  {
    icon: '/transplant-icon.svg',
    text: '17 people die each day while waiting for an organ transplant',
  },
  {
    icon: '/donation-icon.svg',
    text: 'One organ, eye and tissue donor can save and heal more than 75 lives',
  },
]

const faqs = [
  {
    question: 'Who can be a donor?',
    title: 'Who can be a donor?',
    answer:
      'People of all ages and medical histories should consider themselves potential donors. Your medical condition at the time of death will determine what organs and tissues can be donated.\n\nA national system matches available organs from the donor with people on the waiting list based on blood type, body size, how sick they are, donor distance, tissue type and time on the list. Sexual orientation, gender, gender identity or expression, race, income, celebrity and social status are never considered.',
  },
  {
    question: 'How does the deceased donation process work?',
    title: 'How does the deceased donation process work?',
    answer:
      'Deceased organ donation is the process of giving an organ or a part of an organ, at the time of the donor’s death, for the purpose of transplantation to another person. Only after all efforts to save the patient’s life have been exhausted, tests have been performed to confirm the absence of brain or brainstem activity, and brain death has been declared, is donation a possibility.\n\nThe state donor registry and National Donate Life Registry are searched securely online to determine if the patient has authorized donation. If the potential donor is not found in a registry, their next of kin or legally authorized representative is offered the opportunity to authorize the donation. Donation and transplantation professionals follow national policy to determine which organs can be transplanted and to which patients on the national transplant waiting list the organs are to be allocated.',
  },
  {
    question: 'Is there a cost to be an organ, eye and tissue donor?',
    title: 'Is there a cost to be an organ, eye and tissue donor?',
    answer:
      'There is no cost to the donor’s family or estate for donation. The donor family pays only for medical expenses before death and costs associated with funeral arrangements.',
  },
  {
    question: 'Does registering as a donor change my patient care?',
    title: 'Does registering as a donor change my patient care?',
    answer:
      'Your life always comes first. Doctors work hard to save every patient’s life, but sometimes there is a complete and irreversible loss of brain function. The patient is declared clinically and legally dead. Only then is donation an option.',
  },
  {
    question: 'I want to learn more about living donation. Where should I look?',
    title: 'I want to learn more about living donation. Where should I look?',
    answer:
      'Living organ donation offers another choice for some transplant candidates, reducing their time on the waiting list and leading to better long term outcomes for the recipient.\n\nLiving tissue donation, birth tissue, is used to promote healing and to treat burns and painful wounds.',
  },
]

const HomePage = () => (
  <PublicSiteLayout>
    <div className='public-container'>
      <section className='public-hero-row'>
        <div className='public-banner'>
          <h1>
            Pledge To Become
            <br />A Donor
          </h1>
          <h3>
            More than 100,000 people are waiting for a lifesaving transplant. You can help.
          </h3>
          <a className='public-cta-button' href='/pledge'>
            Pledge To Become A Donor
          </a>
        </div>

        <div className='public-hero-image-wrap'>
          <div className='public-hero-image'>
            <img src='/reference-header-image.png' alt='Organ donation illustration' />
          </div>
        </div>
      </section>
    </div>

    <section className='public-panel public-panel-tinted'>
      <div className='public-container'>
        <h1 className='public-section-heading'>The Need</h1>
        <div className='public-card-grid'>
          {needCards.map((item) => (
            <article key={item.text} className='public-info-card'>
              <img src={item.icon} alt='' />
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className='public-panel'>
      <div className='public-container'>
        <h1 className='public-section-heading'>FAQ&apos;s</h1>
        <div className='public-accordion'>
          {faqs.map((item, index) => (
            <details key={item.question} open={index === 0}>
              <summary>{item.question}</summary>
              <div className='public-accordion-content'>
                <p>{item.title}</p>
                {item.answer.split('\n\n').map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  </PublicSiteLayout>
)

export default HomePage
