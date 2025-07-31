import DOMPurify from 'dompurify'

export interface SecurityWarning {
  type: string
  message: string
}

export interface SecurityValidationResult {
  isValid: boolean
  warnings: SecurityWarning[]
  sanitizedText: string
}

// Security patterns to detect
export const securityPatterns = {
  script: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  htmlTags: /<[^>]*>/g,
  sqlInjection: /(union|select|insert|delete|update|drop|create|alter|exec|execute|\-\-|\/\*|\*\/)/gi,
  xss: /(javascript:|vbscript:|onload|onerror|onclick|onmouseover)/gi,
  urls: /(https?:\/\/[^\s]+)/gi,
  suspiciousChars: /[<>&"'`]/g,
  emails: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
}

export class SecurityValidator {
  private static instance: SecurityValidator
  
  public static getInstance(): SecurityValidator {
    if (!SecurityValidator.instance) {
      SecurityValidator.instance = new SecurityValidator()
    }
    return SecurityValidator.instance
  }

  /**
   * Sanitize input text by removing harmful content
   */
  sanitizeInput(text: string): string {
    if (!text) return ''
    
    // Remove HTML tags and sanitize
    let sanitized = DOMPurify.sanitize(text, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    })
    
    // Remove potential XSS patterns
    sanitized = sanitized.replace(securityPatterns.xss, '')
    
    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim()
    
    return sanitized
  }

  /**
   * Validate text for security issues
   */
  validateSecurity(text: string): SecurityWarning[] {
    const warnings: SecurityWarning[] = []
    
    if (securityPatterns.script.test(text)) {
      warnings.push({
        type: 'script_injection',
        message: 'Script tags are not allowed'
      })
    }
    
    if (securityPatterns.htmlTags.test(text)) {
      warnings.push({
        type: 'html_tags',
        message: 'HTML tags are not allowed'
      })
    }
    
    if (securityPatterns.sqlInjection.test(text)) {
      warnings.push({
        type: 'sql_injection',
        message: 'Suspicious SQL-like content detected'
      })
    }
    
    if (securityPatterns.xss.test(text)) {
      warnings.push({
        type: 'xss_attempt',
        message: 'Potentially harmful JavaScript detected'
      })
    }
    
    if (securityPatterns.urls.test(text)) {
      warnings.push({
        type: 'url_content',
        message: 'URLs are not allowed'
      })
    }
    
    if (securityPatterns.emails.test(text)) {
      warnings.push({
        type: 'email_content',
        message: 'Email addresses are not allowed'
      })
    }
    
    // Check for excessive special characters (potential injection attempt)
    const specialCharCount = (text.match(securityPatterns.suspiciousChars) || []).length
    if (specialCharCount > text.length * 0.3) {
      warnings.push({
        type: 'suspicious_chars',
        message: 'Too many special characters detected'
      })
    }
    
    // Check for repeated patterns (potential spam/injection)
    const words = text.split(/\s+/)
    const uniqueWords = new Set(words)
    if (words.length > 5 && uniqueWords.size < words.length * 0.3) {
      warnings.push({
        type: 'repetition',
        message: 'Excessive repetition detected'
      })
    }
    
    // Check for extremely long words (potential buffer overflow attempt)
    const hasLongWords = words.some(word => word.length > 50)
    if (hasLongWords) {
      warnings.push({
        type: 'long_words',
        message: 'Extremely long words detected'
      })
    }
    
    return warnings
  }

  /**
   * Comprehensive security validation with sanitization
   */
  validateAndSanitize(text: string): SecurityValidationResult {
    const sanitizedText = this.sanitizeInput(text)
    const warnings = this.validateSecurity(sanitizedText)
    
    return {
      isValid: warnings.length === 0,
      warnings,
      sanitizedText
    }
  }
}

// Export singleton instance
export const securityValidator = SecurityValidator.getInstance()