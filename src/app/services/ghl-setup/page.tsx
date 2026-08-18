import type { Metadata } from 'next'
import GhlSetupPage, { config } from '../../../pages/GhlSetupPage'
import { buildServiceMetadata } from '../../_lib/serviceMetadata'

export const metadata: Metadata = buildServiceMetadata(config)

export default function Page() {
  return <GhlSetupPage />
}
