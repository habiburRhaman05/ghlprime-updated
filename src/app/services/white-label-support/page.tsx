import type { Metadata } from 'next'
import WhiteLabelSupportPage, { config } from '../../../pages/WhiteLabelSupportPage'
import { buildServiceMetadata } from '../../_lib/serviceMetadata'

export const metadata: Metadata = buildServiceMetadata(config)

export default function Page() {
  return <WhiteLabelSupportPage />
}
