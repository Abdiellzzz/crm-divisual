export const formatCurrency = (value: number, currency = 'USD') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(value)
}

export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export const getInitials = (firstName: string, lastName: string) => {
  return (firstName[0] + lastName[0]).toUpperCase()
}

export const getAvatarColor = (index: number) => {
  const colors = ['bg-green-900', 'bg-red-900', 'bg-yellow-900', 'bg-blue-900', 'bg-cyan-900', 'bg-pink-900']
  return colors[index % colors.length]
}
