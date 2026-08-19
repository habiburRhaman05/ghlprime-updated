// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import { HelmetProvider } from 'react-helmet-async'
// import App from './App'
// import './index.css'
// import './styles/section-overrides.css'
// import './styles/services-redesign.css'
// import './styles/certifications.css'
// import './styles/footer-redesign.css'
// import './styles/contact-page.css'
// import './styles/certification-badges.css'
// import './styles/faq.css'

// const rootElement = document.getElementById('root')
// const app = (
//   <React.StrictMode>
//     <HelmetProvider>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </HelmetProvider>
//   </React.StrictMode>
// )

// if (rootElement.hasChildNodes()) {
//   ReactDOM.hydrateRoot(rootElement, app)
// } else {
//   ReactDOM.createRoot(rootElement).render(app)
// }

// // Signal the prerender plugin that the app has mounted.
// // Wrapped in setTimeout so Helmet has a tick to flush <head> tags.
// if (typeof window !== 'undefined') {
//   // Signal the prerender plugin AFTER async data (Supabase fetches on /team,
//   // /case-studies, etc.) has had time to load and render. This event is only
//   // consumed by the build-time prerenderer; in production nothing listens to
//   // it, so the delay has no effect on real users.
//   setTimeout(() => {
//     window.dispatchEvent(new Event('render-event'))
//   }, 3500)
// }
