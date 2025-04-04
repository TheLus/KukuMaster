import type { Config } from 'vike/types'

export const config = {
    meta: {
        title: {
            env: { server: true, client: true }
        },
        description: {
            env: { server: true, client: true }
        },
    }
} satisfies Config


