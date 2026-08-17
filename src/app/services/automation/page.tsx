import type { Metadata } from 'next'
import AutomationPage, { config } from '../../../pages/AutomationPage'
import { buildServiceMetadata } from '../../_lib/serviceMetadata'

export const metadata: Metadata = buildServiceMetadata(config)

export default function Page() {
  return <AutomationPage />
}
