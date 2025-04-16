export const validate_dimelo = (text) => {
  const dimelo_validator = Boolean(text.toLowerCase() === 'dimelo' || text.toLowerCase() === 'dímelo' || text.toLowerCase().includes('dimelo') || text.toLowerCase().includes('dímelo'))
  const expresamelo_validator = Boolean(text.toLowerCase() === 'explayate' || text.toLowerCase().includes('explayate'))
  
  return dimelo_validator || expresamelo_validator
}

export const getCurrentTime = () => {
  const now = new Date()
  return now.toLocaleString()
}