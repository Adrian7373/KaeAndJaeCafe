import { createBrowserClient } from '@supabase/ssr'

// Create a function that generates the client
export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Client components are also rendered on the server during `next build`
    // (prerendering). Newer @supabase/ssr versions throw when the URL/key are
    // missing, so use inert placeholders on the server only. No requests are
    // made during prerender; in the browser the real values are required.
    if ((!url || !key) && typeof window === 'undefined') {
        return createBrowserClient('http://localhost:54321', 'build-time-placeholder-key')
    }

    return createBrowserClient(url!, key!)
}
