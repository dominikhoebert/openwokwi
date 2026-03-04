import axios from 'axios';

// In development the Vite dev server runs separately from the backend, so we
// default to the backend's direct address.  When built for Docker the
// VITE_API_BASE build-arg is set to "/api" and nginx proxies those requests
// to the backend container, avoiding any CORS issues.
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8001/api';

export interface CompileResult {
  success: boolean;
  hex_content?: string;
  stdout: string;
  stderr: string;
  error?: string;
}

export async function compileCode(
  code: string,
  board: string = 'arduino:avr:uno'
): Promise<CompileResult> {
  try {
    console.log('Sending compilation request to:', `${API_BASE}/compile`);
    console.log('Board:', board);
    console.log('Code length:', code.length);

    const response = await axios.post<CompileResult>(`${API_BASE}/compile`, {
      code,
      board_fqbn: board,
    });

    console.log('Compilation response status:', response.status);
    console.log('Compilation response data:', response.data);

    return response.data;
  } catch (error) {
    console.error('Compilation request failed:', error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        return error.response.data;
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server. Is the backend running on port 8001?');
      }
    }

    throw error;
  }
}
