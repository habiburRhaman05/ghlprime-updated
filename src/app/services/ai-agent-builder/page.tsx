import type { Metadata } from 'next'
import AiAgentBuilderPage, { config } from '../../../pages/AiAgentBuilderPage'
import { buildServiceMetadata } from '../../_lib/serviceMetadata'

export const metadata: Metadata = buildServiceMetadata(config)

export default function Page() {
  return <AiAgentBuilderPage />
}
