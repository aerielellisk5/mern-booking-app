import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: true, // This will make the server accessible on the network
  //   port: 5173, // Specify the port if needed
  // },
})
