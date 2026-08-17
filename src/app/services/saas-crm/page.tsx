import type { Metadata } from 'next'
import SaasCrmLaunchPage, { config } from '../../../pages/SaasCrmLaunchPage'
import { buildServiceMetadata } from '../../_lib/serviceMetadata'

export const metadata: Metadata = buildServiceMetadata(config)

export default function Page() {
  return <SaasCrmLaunchPage />
}
