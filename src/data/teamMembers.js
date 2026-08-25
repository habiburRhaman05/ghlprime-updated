// `badge_label` / `badge_icon` / `years_experience` drive the two floating
// overlays on the leader card (top-left pill, bottom-right stat). All three
// are OPTIONAL -- LeaderCardGrid renders each overlay only when its field is
// present, so records coming from the API without them simply show the card
// without that overlay rather than breaking.
export const teamMembers = [
  {
    id: 'jewel-rana',
    name: 'Jewel Rana',
    role: 'CEO & Co-Founder',
    badge_label: 'Visionary Leader',
    badge_icon: 'star',
    years_experience: '10+',
    description:
      'Jewel Rana is a experiences business coach and agency leader who has helped freelancers and service providers build profitable careers and scalable service businesses. Scale your agency.',
    image_url: '/CEO.png',
    sort_order: 1,
    linkedin_url: 'https://www.linkedin.com/in/thejewelrana/',
    facebook_url: 'https://www.facebook.com/thenewjewel',
    instagram_url: '',
    twitter_url: '',
    upwork_url: 'https://www.upwork.com/freelancers/~013caf34b8df0444cf/',
    website_url: '',
  },
  {
    id: 'niyamul-islam-sajal',
    name: 'Niyamul Islam Sajal',
    role: 'COO & Co-Founder',
    badge_label: 'Automation Expert',
    badge_icon: 'rocket',
    years_experience: '3+',
    description:
      'Niyamul Islam Sajal is a senior automation engineer with extensive experience building AI-powered systems, CRM infrastructures, and custom integrations for agencies.',
    image_url: '/COO.png',
    sort_order: 2,
    linkedin_url: 'https://www.linkedin.com/in/niyamulislam/',
    facebook_url: 'https://www.facebook.com/niaymul.islam.2025/',
    instagram_url: '',
    twitter_url: '',
    upwork_url: 'https://www.upwork.com/freelancers/~010f634a8b80365e7b',
    website_url: '',
  },
]
