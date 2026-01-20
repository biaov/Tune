/**
 * 转换 CSS 变量为字符串
 * cssVariable -> --css-variable
 */
export const useCssVars = (vars: Record<string, string>) => Object.entries(vars).reduce((prev, [key, value]) => `${prev}--${key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)}: ${value}; `, '')
