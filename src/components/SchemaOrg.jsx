import { Helmet } from 'react-helmet-async'

// Renders an array of schema.org objects as <script type="application/ld+json"> tags
// in document head. Skips nullish entries so callers can use conditional schemas.
export default function SchemaOrg({ schemas = [] }) {
  const valid = schemas.filter(Boolean)
  if (!valid.length) return null
  return (
    <Helmet>
      {valid.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}