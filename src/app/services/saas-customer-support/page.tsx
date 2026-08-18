import type { Metadata } from 'next'
import SaasCustomerSupportPage, { config } from '../../../pages/SaasCustomerSupportPage'
import { buildServiceMetadata } from '../../_lib/serviceMetadata'

export const metadata: Metadata = buildServiceMetadata(config)

export default function Page() {
  return <SaasCustomerSupportPage />
}
