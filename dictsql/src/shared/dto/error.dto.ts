export interface ErrorDto {
  code: string
  message: string
  details?: string
  stack?: string
}

export function isErrorDto(obj: unknown): obj is ErrorDto {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'code' in obj &&
    typeof obj.code === 'string' &&
    'message' in obj &&
    typeof obj.message === 'string'
  )
}
