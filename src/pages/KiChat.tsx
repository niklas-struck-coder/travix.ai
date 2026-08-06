import { PageHeader } from '@/components/layout/PageHeader'
import { KiChat as KiChatContainer } from '@/components/chat/KiChat'

export function KiChat() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="KI-Chat" description="Dein persönlicher Reiseberater" />
      <KiChatContainer />
    </div>
  )
}
