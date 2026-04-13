import PublicSiteLayout from '../components/PublicSiteLayout'

const awarenessSections = [
  {
    heading: 'Awareness',
    paragraphs: [],
  },
  {
    subheading: 'Literature Survey',
    paragraphs: [
      'The most crucial part of organ donation after it’s available is to instantly find a donor and securely transfer it. The introduction of the machine to machine communication where all of these devices communicate without any human interference ensuring fast actions. It includes services that provide convenience to the device owners and along with that conduct certain transactions. They have to maintain track and maintain track of them as well. Already implemented situations use blockchains for tracking all of these transactions without compromising the secrecy of the data of the owner and also to prevent the risk of fraud and also keep its integrity intact for medical legal requirements. The health services where e-government applications, TeleMedicine and Artificial Intelligence have been reviewed.',
      'The effects of sharing of the data about patients and diseases among health sector parties through smart contracts have been investigated. Blockchain technology will eliminate inefficiency and will also cause a reduction of costs by conducting transactions among parties without central authority through smart contracts. Everything could be tied to a blockchain ledger containing verifiable time-stamped records of creation and ownership. These systems could also be used to transfer value between users, detect changes in documents, or prevent data tampering. This has proven to be a very trusted way of transfer entities such as organs via a trustworthy platform. According to NASSCOM, blockchain-led increase in productivity and cost reduction can create a value of upto USD 5 billion dollars in the Indian economy by 2023. India has some of the most sophisticated uses of blockchain in some areas. For instance, one of the most advanced applications of blockchain to store property records known to date can be found in AP.',
    ],
  },
  {
    subheading: 'Organ Donation',
    paragraphs: [
      'Organ donation means giving part of body (organ) to a person with end stage organ disease who needs a transplant. An organ is a part of the body that performs a specific function: like heart, lungs, kidney, liver etc. The organs that can be donated for transplantation include kidney, liver, heart, lungs, and small bowel and tissues such as corneas, heart valves, skin and bone. Tissue means a group of cells performing a particular function in the human body such as bone, skin, cornea of the eye, heart valve, blood vessels, nerves and tendon etc.',
    ],
  },
  {
    subheading: 'Legal Framework In India',
    paragraphs: [
      'Organ donation in India is regulated by the Transplantation of Human Organs and Tissues Act, 1994. The law allows both deceased and living donors to donate their organs. It also identifies brain death as a form of death. The National Organ and Tissue Transplant Organisation (NOTTO) functions as the apex body for activities of relating to procurement, allotment and distribution of organs in the country. Although India has performed the second largest number of transplants in the world in 2019 (after United States), it lags far behind the western nations like Spain (35.1 pmp), United States (21.9 pmp) and United Kingdom (15.5 pmp) in national donation with a donation rate of only 0.65 per million population (2019) due to its huge population. According to the World Health Organization, only around 0.01 percent of people in India donate their organs after death. Some of the reasons behind such poor performance are lack of public awareness, religious or superstitious beliefs among people, and strict laws.',
    ],
  },
]

const donorFacts = [
  'Anybody can be an organ donor irrespective of their age, caste, religion, community etc.',
  'There is no defined age for donating organs. The decision to donate organs is based on strict medical criteria, not age.',
  'Tissues such as cornea, heart valves, skin, and bone can be donated in case of natural death but vital organs such as heart, liver, kidneys, intestines, lungs, and pancreas can be donated only in the case of brain death.',
  'Organs such as the heart, pancreas, liver, kidneys and lungs can be transplanted to those recipients whose organs are failing because it allows many recipients to return to a normal lifestyle.',
  'Anyone younger than age 18 needs to have the agreement of a parent or guardian to be a donor. Having a serious condition like actively spreading cancer, HIV, diabetes, kidney disease, or heart disease can prevent you from donating as a living donor.',
]

const donationPhases = [
  {
    title: 'Phase 1: Organ Donation Sign-Up',
    points: [
      'Organ transplants cannot occur without those who generously sign up to be organ donors. You can elect to become a donor when you apply for or renew your driver’s license, or by visiting your state’s organ donor registry.',
    ],
  },
  {
    title: 'Phase 2: Critical Care and Determination of Death',
    points: [
      'When a potential donor has a serious accident or illness and is in the hospital, the doctors and nurses responsible for that patient make every attempt to save his or her life. The priority of all hospital staff is to save the life of the patient.',
      'Once all lifesaving efforts have been taken, the doctors will test for brain death to determine without a doubt that the patient has died.',
      'Not every death is conducive to organ donation. The most viable donors are often victims of head trauma, heart stroke, or aneurysm.',
    ],
  },
  {
    title: 'Phase 3: Donor Identification and Consent',
    points: [
      'When a patient has died or is near death, the hospital contacts their local organ procurement organization and confirms the potential to donate.',
      'If the patient had not previously enrolled as an organ donor, the organ procurement representative seeks consent from the next of kin.',
      'Once consent is received, the donor’s medical history is reviewed and a recipient is identified based on blood type, tissue type, body size, illness severity, and time on the waiting list.',
    ],
  },
  {
    title: 'Phase 4: Organ Transport',
    points: [
      'Once a viable match has been made, arrangements are made for the recovery of the organs and tissues that will be donated.',
      'Organs and tissues are then rushed to the hospital that is housing the recipient. The surgical process involves closed incisions and does not affect the donor’s ability to have an open casket funeral.',
    ],
  },
  {
    title: 'Phase 5: Organ Transplant',
    points: [
      'Once the organs and tissues arrive, transplantation surgery begins right away, as the recipient is typically already in the hospital and waiting for the surgery.',
    ],
  },
  {
    title: 'Phase 6: Recovery',
    points: [
      'Recovery time depends on each patient, including factors such as the severity of the illness and type of organ or tissues donated.',
      'The recipient will work with the transplant team during recovery to prevent rejection, stave off infections, and ensure the proper medications and tests are provided.',
    ],
  },
]

const AwarenessPage = () => (
  <PublicSiteLayout>
    <div className='public-container'>
      <div className='public-awareness'>
        {awarenessSections.map((section) => (
          <section key={section.heading || section.subheading}>
            {section.heading ? <h1>{section.heading}</h1> : null}
            {section.subheading ? <h2>{section.subheading}</h2> : null}
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <section>
          <h1>Types of Donors</h1>
          <p>Organ donors can be living or dead. The type of organ donations are as follows:</p>
          <div className='public-awareness-group'>
            <h2>Living Donors</h2>
            <p>Living donors are permitted to donate the following:</p>
            <ul>
              <li>One of their kidneys</li>
              <li>Portion of pancreas</li>
              <li>Part of the liver</li>
            </ul>
            <p>
              Living donors must be over 18 years of age and are limited to donating only to
              their immediate blood relatives or, in some special cases, out of affection and
              attachment towards the recipient.
            </p>
          </div>

          <div className='public-awareness-group'>
            <h4>Types of Living Donors</h4>
            <h6>Living Near Related Donors:</h6>
            <p>
              Only immediate blood relations are accepted usually as donors viz., parents,
              siblings, children, grand parents and grand children (THOA Rules 2014). Spouse is
              also accepted as a living donor in the category of near relative and is permitted
              to be a donor.
            </p>
            <h6>Living Non-near Relative Donors:</h6>
            <p>
              These are other than near relative of recipient or patient. They can donate only
              for the reason of affection and attachment towards the recipient or for any other
              special reason.
            </p>
            <h6>SWAP Donors:</h6>
            <p>
              In those cases where the living near-relative donor is incompatible with the
              recipient, provision for swapping of donors between two such pairs exists when the
              donor of the first pair matches with the second recipient and donor of the second
              pair matches with the first recipient.
            </p>
          </div>

          <div className='public-awareness-group'>
            <h2>Deceased Donors :</h2>
            <p>
              Deceased donor is anyone, regardless of age, race or gender, who can become an
              organ and tissue donor after death. Consent of near relative or a person in lawful
              possession of the dead body is required. Medical suitability for donation is
              determined at the time of death.
            </p>
            <p>
              Deceased donors may donate kidneys, liver, heart, lungs, pancreas, and intestine.
              After a natural cardiac death, organs that can be donated are cornea, bone, skin,
              and blood vessels, whereas after brainstem death about 37 different organs and
              tissues can be donated.
            </p>
          </div>
        </section>

        <section>
          <h2>Organ Transplant</h2>
          <p>
            Organ transplant is a medical procedure where one organ removed from one person and
            placed in the body of recipient. Donor vital organs such as the heart, pancreas,
            liver, kidneys, and lungs can be transplanted to those whose organs are failing.
          </p>

          <h2>Green Corridors</h2>
          <p>
            Studies have suggested that the chances of transplantation being successful are
            enhanced by reducing the time delay between harvest and transplant of the organ.
            Transportation of the organ is therefore a critical factor, and green corridors have
            been created in many parts of India to shorten that travel time.
          </p>
          <p>
            Green corridors are generally used for transporting heart and liver, which have the
            shortest preservation times. The system has been used effectively in cities such as
            Mumbai, Gurgaon, Hyderabad, Bangalore, Kolkata, and Indore.
          </p>
        </section>

        <section>
          <h4>Facts about Organ Donation</h4>
          <ul>
            {donorFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </section>

        <section>
          <h1>How Organ Donation Works</h1>
          <p>
            For many, the idea of organ donation can be scary or confusing. The current system
            of organ donation consists of 6 major phases of organ donation as mentioned below.
          </p>
          {donationPhases.map((phase) => (
            <div key={phase.title} className='public-awareness-group'>
              <h4>{phase.title}</h4>
              <ul>
                {phase.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  </PublicSiteLayout>
)

export default AwarenessPage
