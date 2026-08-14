export const CERTIFIED_ADMIN_BADGE = 'https://directory.gohighlevel.com/objects/uploads/284cf43c-3358-4259-8aee-6e43855333a6'

export const BADGES = [
  { name: 'A2P 10DLC Compliance', url: 'https://directory.gohighlevel.com/objects/uploads/89d95d7f-9306-45e6-b8c6-9083d0697ddf' },
  { name: 'AI Tech Stack',        url: 'https://directory.gohighlevel.com/objects/uploads/0f226997-6c78-478a-a59b-813fb3010070' },
  { name: 'AI Voice',             url: 'https://directory.gohighlevel.com/objects/uploads/1f233e79-035e-490b-bb31-562e696e5b3f' },
  { name: 'Automated Swag Store', url: 'https://directory.gohighlevel.com/objects/uploads/cb8172b3-9c01-466e-9bbb-9069ee1243be' },
  { name: 'Course Creator',       url: 'https://directory.gohighlevel.com/objects/uploads/6cae2dbe-a205-4b12-b143-6ecafa42c646' },
  { name: 'Funnel Builder',       url: 'https://directory.gohighlevel.com/objects/uploads/96444763-22b4-4c9c-bce7-56f38c5e646c' },
  { name: 'HighLevel Calendars',  url: 'https://directory.gohighlevel.com/objects/uploads/27e17845-19e3-4f08-8e0d-a437e0b2e7bb' },
  { name: 'HIPAA Compliance',     url: 'https://directory.gohighlevel.com/objects/uploads/4efcd27a-7452-467a-8cfe-a55f03ec88a6' },
  { name: 'Lead Capture Systems', url: 'https://directory.gohighlevel.com/objects/uploads/d02c8e94-c973-4e52-9dfa-8a80529d1fe7' },
  { name: 'Paid Ads',             url: 'https://directory.gohighlevel.com/objects/uploads/4eaeab54-6ab2-4c08-a8f2-e03d2730ccc7' },
  { name: 'SaaS Local Hero',      url: 'https://directory.gohighlevel.com/objects/uploads/31873c93-ddb8-4ec5-9409-328edc37c19e' },
  { name: 'Social Media Manager', url: 'https://directory.gohighlevel.com/objects/uploads/a37fd200-fdb3-4842-b6c2-dcbaa76097ba' },
  { name: 'WhatsApp Integration', url: 'https://directory.gohighlevel.com/objects/uploads/a74f547e-f745-43b6-a981-e833d7ec89c1' },
]

export function getPersonBadges(personIndex) {
  const i = Number(personIndex) || 0
  const count = 4 + (i % 3)
  const shuffled = [...BADGES].sort((a, b) => {
    const hashA = Math.sin(i * 9301 + BADGES.indexOf(a) * 49297) * 1000
    const hashB = Math.sin(i * 9301 + BADGES.indexOf(b) * 49297) * 1000
    return hashA - hashB
  })
  return shuffled.slice(0, count)
}
