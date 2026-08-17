import type { Metadata } from 'next'
import AppDevelopmentPage, { config } from '../../../pages/AppDevelopmentPage'
import { buildServiceMetadata } from '../../_lib/serviceMetadata'

export const metadata: Metadata = buildServiceMetadata(config)

export default function Page() {
  return <AppDevelopmentPage />
}
