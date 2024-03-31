import { defineConfig } from "vite";
import liveReload from 'vite-plugin-live-reload'
import globSync from 'glob'
import path, { resolve } from 'node:path'
import { fileURLToPath } from "node:url";

export default defineConfig({
    plugins: [
        liveReload('./**/*.html', { alwaysReload: true })
    ],
    esbuild: {
        supported: {
            'top-level-await': true
        }
    },
    build: {
        minify: false,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'assets/login.html'),
                header: resolve(__dirname, 'assets/header.html'),
                footer: resolve(__dirname, 'assets/footer.html'),
                modalEdit: resolve(__dirname, 'assets/modal-edit.html'),

            }
        }
    },

})