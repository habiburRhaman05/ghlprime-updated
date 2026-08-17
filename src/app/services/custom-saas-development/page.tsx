import type { Metadata } from 'next'
import CustomSaasDevelopmentPage, { config } from '../../../pages/CustomSaasDevelopmentPage'
import { buildServiceMetadata } from '../../_lib/serviceMetadata'

export const metadata: Metadata = buildServiceMetadata(config)

export default function Page() {
  return <CustomSaasDevelopmentPage />
}
