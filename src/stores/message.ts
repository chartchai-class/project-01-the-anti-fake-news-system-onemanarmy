import type { MessageState } from '@/types'
import { defineStore } from 'pinia'
export const useMessageStore = defineStore('message', {
    state: (): MessageState => ({
        messages: ''
    }),
    actions: {
        updateMessages(messages: string) : void {
            this.messages = messages
        },
        resetMessages(): void {
            this.messages = ''
        }
    }
})

