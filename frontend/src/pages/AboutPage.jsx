import PublicSiteLayout from '../components/PublicSiteLayout'

const teamMembers = [
  { name: 'Mrs.M.Sheela mano balin', role: 'Team Guide' },
  { name: 'Sweety A', role: 'Member' },
  { name: 'Manthra M', role: 'Member' },
  { name: 'Jeyasutha K', role: 'Member' },
  { name: 'Asiha N', role: 'Member' },
]

const initialsFor = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

const AboutPage = () => (
  <PublicSiteLayout>
    <div className='public-container public-team-page'>
      <div className='public-team-row public-team-row-centered'>
        <div className='public-team-card'>
          <h1 className='public-section-heading'>Team</h1>
          <div className='public-team-avatar'>{initialsFor(teamMembers[0].name)}</div>
          <h3>{teamMembers[0].name}</h3>
          <p>{teamMembers[0].role}</p>
        </div>
      </div>

      <div className='public-team-grid'>
        {teamMembers.slice(1).map((member) => (
          <div key={member.name} className='public-team-card'>
            <div className='public-team-avatar'>{initialsFor(member.name)}</div>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  </PublicSiteLayout>
)

export default AboutPage
