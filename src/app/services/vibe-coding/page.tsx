import type { Metadata } from 'next'
import VibeCodingPage, { config } from '../../../pages/VibeCodingPage'
import { buildServiceMetadata } from '../../_lib/serviceMetadata'

export const metadata: Metadata = buildServiceMetadata(config)

export default function Page() {
  return <VibeCodingPage />
}
