import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'

// GitHub Pages has no SPA rewrite support: a direct visit (or refresh) on a
// client-side route like /articles-list/some-post looks for a real file at
// that path and returns 404. GitHub Pages serves 404.html for unknown paths,
// so shipping a copy of index.html as 404.html lets the app boot and React
// Router render the correct route. Asset URLs are absolute (see `base`), so
// they resolve correctly from any nested path.
function spaGithubPagesFallback(): Plugin {
    return {
        name: 'spa-github-pages-404',
        apply: 'build',
        closeBundle() {
            copyFileSync('dist/index.html', 'dist/404.html')
        },
    }
}

export default defineConfig({
    plugins: [react(), spaGithubPagesFallback()],
    base: 'https://rinnadia.com',  // matches your homepage
})
