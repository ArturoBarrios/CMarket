import { ref, computed, nextTick } from 'vue'
import { securityValidator, type SecurityWarning } from '~/utils/InputSecurity'

export interface SecureInputConfig {
  maxLength?: number
  allowUrls?: boolean
  allowEmails?: boolean
  customValidation?: (text: string) => SecurityWarning[]
}

export function useSecureInput(config: SecureInputConfig = {}) {
  const text = ref('')
  const securityWarnings = ref<SecurityWarning[]>([])
  
  const {
    maxLength = 280,
    allowUrls = false,
    allowEmails = false,
    customValidation
  } = config
  
  const hasSecurityIssues = computed(() => {
    // Filter out warnings for allowed content
    const filteredWarnings = securityWarnings.value.filter(warning => {
      if (!allowUrls && warning.type === 'url_content') return true
      if (!allowEmails && warning.type === 'email_content') return true
      if (warning.type === 'url_content' && allowUrls) return false
      if (warning.type === 'email_content' && allowEmails) return false
      return true
    })
    
    return filteredWarnings.length > 0
  })
  
  const filteredWarnings = computed(() => {
    return securityWarnings.value.filter(warning => {
      if (!allowUrls && warning.type === 'url_content') return true
      if (!allowEmails && warning.type === 'email_content') return true
      if (warning.type === 'url_content' && allowUrls) return false
      if (warning.type === 'email_content' && allowEmails) return false
      return true
    })
  })
  
  const charactersLeft = computed(() => maxLength - text.value.length)
  
  const isValid = computed(() => {
    return text.value.trim().length > 0 && 
           text.value.length <= maxLength && 
           !hasSecurityIssues.value
  })
  
  function validateAndUpdate(newText: string) {
    const result = securityValidator.validateAndSanitize(newText)
    
    // Apply custom validation if provided
    if (customValidation) {
      const customWarnings = customValidation(result.sanitizedText)
      result.warnings.push(...customWarnings)
    }
    
    text.value = result.sanitizedText
    securityWarnings.value = result.warnings
    
    return result
  }
  
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement
    const result = validateAndUpdate(target.value)
    
    // Update the input if text was sanitized
    if (result.sanitizedText !== target.value) {
      nextTick(() => {
        target.value = result.sanitizedText
      })
    }
  }
  
  function handlePaste(event: ClipboardEvent) {
    event.preventDefault()
    const pastedText = event.clipboardData?.getData('text') || ''
    
    // Insert sanitized text at cursor position
    const target = event.target as HTMLInputElement | HTMLTextAreaElement
    const start = target.selectionStart || 0
    const end = target.selectionEnd || 0
    const currentValue = text.value
    
    const newText = currentValue.substring(0, start) + pastedText + currentValue.substring(end)
    validateAndUpdate(newText)
  }
  
  function reset() {
    text.value = ''
    securityWarnings.value = []
  }
  
  return {
    text,
    securityWarnings: filteredWarnings,
    hasSecurityIssues,
    charactersLeft,
    isValid,
    handleInput,
    handlePaste,
    validateAndUpdate,
    reset
  }
}