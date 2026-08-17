import type { Metadata } from 'next'
import FigmaToCodePage, { config } from '../../../pages/FigmaToCodePage'
import { buildServiceMetadata } from '../../_lib/serviceMetadata'

export const metadata: Metadata = buildServiceMetadata(config)

export default function Page() {
  return <FigmaToCodePage />
}
