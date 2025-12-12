import type { Currency, FormattedCurrency } from './currencies.types'

/**
 * Vérifie si un système de devises est hiérarchique (avec conversions fixes)
 */
export function isHierarchical(currencies: Record<string, Currency>): boolean {
  return Object.values(currencies).some((c) => c.baseValue !== undefined)
}

/**
 * Récupère les devises triées par valeur décroissante
 * Utile pour formater une valeur en plusieurs devises
 */
export function getCurrencyHierarchy(
  currencies: Record<string, Currency>,
): Currency[] {
  return Object.values(currencies)
    .filter((c) => c.baseValue !== undefined)
    .sort((a, b) => (b.baseValue || 0) - (a.baseValue || 0))
}

/**
 * Formate une valeur dans un système de devises hiérarchique
 * Ex: 1450 rois → [{ currency: COURONNE, amount: 1 }, { currency: SCEPTRE, amount: 4 }, { currency: SCEPTRE, amount: 5 }]
 *
 * @param value Valeur dans l'unité de base
 * @param currencies Système de devises
 * @returns Tableau de devises avec leurs quantités
 */
export function formatCurrency(
  value: number,
  currencies: Record<string, Currency>,
): FormattedCurrency[] {
  if (!isHierarchical(currencies)) {
    throw new Error('Cannot format non-hierarchical currency system')
  }

  const hierarchy = getCurrencyHierarchy(currencies)
  const result: FormattedCurrency[] = []
  let remaining = value

  for (const currency of hierarchy) {
    if (!currency.baseValue) continue

    const amount = Math.floor(remaining / currency.baseValue)
    if (amount > 0) {
      result.push({ currency, amount })
      remaining -= amount * currency.baseValue
    }
  }

  return result
}

/**
 * Convertit une valeur d'une devise vers l'unité de base
 *
 * @param amount Quantité de la devise
 * @param currency Devise source
 * @returns Valeur dans l'unité de base
 */
export function toBaseValue(amount: number, currency: Currency): number {
  if (!currency.baseValue) {
    throw new Error(`Currency ${currency.id} has no baseValue`)
  }
  return amount * currency.baseValue
}

/**
 * Convertit une valeur de l'unité de base vers une devise
 *
 * @param baseValue Valeur dans l'unité de base
 * @param currency Devise cible
 * @returns Quantité dans la devise cible
 */
export function fromBaseValue(baseValue: number, currency: Currency): number {
  if (!currency.baseValue) {
    throw new Error(`Currency ${currency.id} has no baseValue`)
  }
  return baseValue / currency.baseValue
}

/**
 * Formate une valeur monétaire en texte lisible
 * Ex: formatCurrencyText(1450, ARIA_CURRENCIES) → "1 Couronne, 4 Sceptres, 5 Rois"
 *
 * @param value Valeur dans l'unité de base
 * @param currencies Système de devises
 * @returns Texte formaté
 */
export function formatCurrencyText(
  value: number,
  currencies: Record<string, Currency>,
): string {
  const formatted = formatCurrency(value, currencies)

  if (formatted.length === 0) {
    const baseUnit = Object.values(currencies).find((c) => c.baseValue === 1)
    return `0 ${baseUnit?.name || 'unités'}`
  }

  return formatted.map((f) => `${f.amount} ${f.currency.name}${f.amount > 1 ? 's' : ''}`).join(', ')
}

/**
 * Formate une valeur monétaire avec symboles courts
 * Ex: formatCurrencySymbols(1450, DND_CURRENCIES) → "14 po, 5 pa"
 *
 * @param value Valeur dans l'unité de base
 * @param currencies Système de devises
 * @param showZero Afficher les valeurs à 0 (défaut: false)
 * @returns Texte formaté avec symboles
 */
export function formatCurrencySymbols(
  value: number,
  currencies: Record<string, Currency>,
  showZero = false,
): string {
  const formatted = formatCurrency(value, currencies)

  if (formatted.length === 0) {
    const baseUnit = Object.values(currencies).find((c) => c.baseValue === 1)
    return `0 ${baseUnit?.symbol || baseUnit?.name || 'unités'}`
  }

  return formatted
    .filter((f) => showZero || f.amount > 0)
    .map((f) => `${f.amount} ${f.currency.symbol || f.currency.name}`)
    .join(', ')
}

/**
 * Formate une valeur dans la plus haute devise possible (arrondi au supérieur)
 * Ex: formatCurrencySimple(150, DND_CURRENCIES) → "2 po" (1.5 po arrondi)
 *
 * @param value Valeur dans l'unité de base
 * @param currencies Système de devises
 * @returns Texte formaté dans la devise la plus haute
 */
export function formatCurrencySimple(
  value: number,
  currencies: Record<string, Currency>,
): string {
  const hierarchy = getCurrencyHierarchy(currencies)

  // Trouver la devise la plus haute qui a du sens
  for (const currency of hierarchy) {
    if (!currency.baseValue) continue

    const amount = value / currency.baseValue

    // Si >= 1, on utilise cette devise
    if (amount >= 1) {
      const rounded = Math.ceil(amount * 10) / 10 // Arrondi au dixième supérieur
      return `${rounded} ${currency.symbol || currency.name}`
    }
  }

  // Sinon, on utilise l'unité de base
  const baseUnit = Object.values(currencies).find((c) => c.baseValue === 1)
  return `${value} ${baseUnit?.symbol || baseUnit?.name || 'unités'}`
}
