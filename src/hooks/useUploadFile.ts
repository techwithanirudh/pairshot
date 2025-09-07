import { useMutation } from '@tanstack/react-query'

export function useUploadFile() {
  return useMutation<Record<string, unknown>, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Upload failed')
      }

      return res.json()
    },
  })
}
