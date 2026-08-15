import { useState, useEffect, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Page = 'dashboard' | 'sales' | 'inventory' | 'purchasing' | 'couriers' | 'map' | 'history' | 'settings'

type OrderStatus =
  | 'Новый'
  | 'В обработке'
  | 'Ожидает закупки'
  | 'Нужно заказать'
  | 'Закуплен'
  | 'Передан курьеру'
  | 'В доставке'
  | 'Доставлен'
  | 'Возврат'

interface Order {
  id: string
  product: string
  brand: string
  client: string
  phone: string
  district: string
  price: string
  installment: string
  status: OrderStatus
  courier: string
  date: string
  model?: string
}

interface Product {
  id: string
  photo: string
  brand: string
  name: string
  model: string
  category: string
  qty: number
  minQty: number
  price: string
  installment: string
  warehouse: string
  status: 'В наличии' | 'Заканчивается' | 'Нет в наличии'
}

interface Courier {
  id: string
  name: string
  district: string
  total: number
  inDelivery: number
  delivered: number
  returns: number
  status: 'Свободен' | 'Есть заказы' | 'В доставке' | 'Не работает'
  avatar: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ORDERS: Order[] = [
  { id: '#1024', product: 'Холодильник Midea', brand: 'Midea', client: 'Азамат Бердибеков', phone: '+996 700 123 456', district: 'Ленинский', price: '48 500 сом', installment: '54 000 сом', status: 'Ожидает закупки', courier: '—', date: '15.08.2026', model: 'MDR-450' },
  { id: '#1023', product: 'Телевизор Samsung', brand: 'Samsung', client: 'Айжан Мамытова', phone: '+996 550 234 567', district: 'Октябрьский', price: '72 000 сом', installment: '80 000 сом', status: 'В доставке', courier: 'Александр', date: '15.08.2026', model: 'UE55AU7100' },
  { id: '#1022', product: 'Стиральная машина LG', brand: 'LG', client: 'Бакыт Осмонов', phone: '+996 777 345 678', district: 'Первомайский', price: '55 000 сом', installment: '62 000 сом', status: 'Доставлен', courier: 'Коля', date: '15.08.2026', model: 'F4WV510S0E' },
  { id: '#1021', product: 'Духовой шкаф Bosch', brand: 'Bosch', client: 'Гүлзат Токтогулова', phone: '+996 502 456 789', district: 'Свердловский', price: '38 000 сом', installment: '42 000 сом', status: 'Передан курьеру', courier: 'Сергей', date: '14.08.2026', model: 'HBF534EB0' },
  { id: '#1020', product: 'Пылесос Xiaomi', brand: 'Xiaomi', client: 'Эрлан Джакыпов', phone: '+996 700 567 890', district: 'Ленинский', price: '18 500 сом', installment: '21 000 сом', status: 'Доставлен', courier: 'Николай', date: '14.08.2026', model: 'G10' },
  { id: '#1019', product: 'Микроволновка Haier', brand: 'Haier', client: 'Айнур Асанова', phone: '+996 555 678 901', district: 'Октябрьский', price: '12 000 сом', installment: '14 000 сом', status: 'Доставлен', courier: 'Александр', date: '14.08.2026', model: 'HSA-2060' },
  { id: '#1018', product: 'Холодильник LG', brand: 'LG', client: 'Мирлан Сейтбеков', phone: '+996 700 789 012', district: 'Первомайский', price: '65 000 сом', installment: '72 000 сом', status: 'Возврат', courier: 'Коля', date: '13.08.2026', model: 'GN-H702HMHZ' },
  { id: '#1017', product: 'Кондиционер Samsung', brand: 'Samsung', client: 'Зайна Байсалова', phone: '+996 550 890 123', district: 'Свердловский', price: '85 000 сом', installment: '95 000 сом', status: 'В обработке', courier: '—', date: '13.08.2026', model: 'AR09TXHQASINUA' },
  { id: '#1016', product: 'Посудомойка Bosch', brand: 'Bosch', client: 'Нурбек Токтомаматов', phone: '+996 502 901 234', district: 'Ленинский', price: '42 000 сом', installment: '48 000 сом', status: 'Закуплен', courier: '—', date: '13.08.2026', model: 'SMS44GW00R' },
  { id: '#1015', product: 'Стиральная Midea', brand: 'Midea', client: 'Чолпон Акунова', phone: '+996 700 012 345', district: 'Октябрьский', price: '47 000 сом', installment: '53 000 сом', status: 'Новый', courier: '—', date: '12.08.2026', model: 'MF100W60' },
]

const PRODUCTS: Product[] = [
  { id: 'p1', photo: '🧊', brand: 'Midea', name: 'Холодильник', model: 'MDR-450', category: 'Холодильники', qty: 7, minQty: 3, price: '48 500 сом', installment: '54 000 сом', warehouse: 'Midea', status: 'В наличии' },
  { id: 'p2', photo: '📺', brand: 'Samsung', name: 'Телевизор', model: 'UE55AU7100', category: 'Телевизоры', qty: 3, minQty: 4, price: '72 000 сом', installment: '80 000 сом', warehouse: 'Samsung', status: 'Заканчивается' },
  { id: 'p3', photo: '🫧', brand: 'LG', name: 'Стиральная машина', model: 'F4WV510S0E', category: 'Стиральные', qty: 0, minQty: 2, price: '55 000 сом', installment: '62 000 сом', warehouse: 'LG', status: 'Нет в наличии' },
  { id: 'p4', photo: '🔥', brand: 'Bosch', name: 'Духовой шкаф', model: 'HBF534EB0', category: 'Кухня', qty: 5, minQty: 2, price: '38 000 сом', installment: '42 000 сом', warehouse: 'Bosch', status: 'В наличии' },
  { id: 'p5', photo: '❄️', brand: 'Samsung', name: 'Кондиционер', model: 'AR09TXHQ', category: 'Климат', qty: 2, minQty: 3, price: '85 000 сом', installment: '95 000 сом', warehouse: 'Samsung', status: 'Заканчивается' },
  { id: 'p6', photo: '🌀', brand: 'Xiaomi', name: 'Пылесос', model: 'G10', category: 'Пылесосы', qty: 12, minQty: 3, price: '18 500 сом', installment: '21 000 сом', warehouse: 'Общий', status: 'В наличии' },
  { id: 'p7', photo: '📡', brand: 'Haier', name: 'Микроволновка', model: 'HSA-2060', category: 'Кухня', qty: 8, minQty: 2, price: '12 000 сом', installment: '14 000 сом', warehouse: 'Haier', status: 'В наличии' },
  { id: 'p8', photo: '🫧', brand: 'Bosch', name: 'Посудомойка', model: 'SMS44GW00R', category: 'Кухня', qty: 1, minQty: 2, price: '42 000 сом', installment: '48 000 сом', warehouse: 'Bosch', status: 'Заканчивается' },
]

const COURIERS: Courier[] = [
  { id: 'c1', name: 'Коля', district: 'Первомайский', total: 12, inDelivery: 4, delivered: 8, returns: 0, status: 'Есть заказы', avatar: '👤' },
  { id: 'c2', name: 'Николай', district: 'Ленинский', total: 9, inDelivery: 2, delivered: 7, returns: 1, status: 'В доставке', avatar: '👤' },
  { id: 'c3', name: 'Александр', district: 'Октябрьский', total: 15, inDelivery: 6, delivered: 9, returns: 0, status: 'В доставке', avatar: '👤' },
  { id: 'c4', name: 'Сергей', district: 'Свердловский', total: 6, inDelivery: 0, delivered: 6, returns: 2, status: 'Свободен', avatar: '👤' },
]

// ─── Utility ──────────────────────────────────────────────────────────────────

function statusColor(status: OrderStatus | string): string {
  switch (status) {
    case 'Новый': return 'bg-blue-50 text-blue-700 border border-blue-200'
    case 'В обработке': return 'bg-purple-50 text-purple-700 border border-purple-200'
    case 'Ожидает закупки': return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    case 'Нужно заказать': return 'bg-orange-50 text-orange-700 border border-orange-200'
    case 'Закуплен': return 'bg-cyan-50 text-cyan-700 border border-cyan-200'
    case 'Передан курьеру': return 'bg-indigo-50 text-indigo-700 border border-indigo-200'
    case 'В доставке': return 'bg-blue-50 text-blue-700 border border-blue-200'
    case 'Доставлен': return 'bg-green-50 text-green-700 border border-green-200'
    case 'Возврат': return 'bg-red-50 text-red-700 border border-red-200'
    case 'В наличии': return 'bg-green-50 text-green-700 border border-green-200'
    case 'Заканчивается': return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
    case 'Нет в наличии': return 'bg-red-50 text-red-700 border border-red-200'
    case 'Свободен': return 'bg-gray-100 text-gray-600 border border-gray-200'
    case 'Есть заказы': return 'bg-blue-50 text-blue-700 border border-blue-200'
    default: return 'bg-gray-100 text-gray-600 border border-gray-200'
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium whitespace-nowrap ${statusColor(status as OrderStatus)}`}>
      {status}
    </span>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

function Btn({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  disabled,
  className = '',
}: {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  children: React.ReactNode
  disabled?: boolean
  className?: string
}) {
  const base = 'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg cursor-pointer border'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' }
  const variants = {
    primary: 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 active:bg-indigo-800',
    secondary: 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:bg-slate-100',
    ghost: 'bg-transparent text-slate-600 border-transparent hover:bg-slate-100',
    danger: 'bg-red-600 text-white border-red-600 hover:bg-red-700',
    success: 'bg-green-600 text-white border-green-600 hover:bg-green-700',
  }
  const dis = disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${dis} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
}: {
  label?: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (v: string) => void
  error?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className={`w-full px-3 py-2 text-sm bg-white border rounded-lg outline-none text-slate-900 placeholder:text-slate-400
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200
          ${error ? 'border-red-400' : 'border-slate-200'}
        `}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
}

function Select({ label, options, value, onChange }: {
  label?: string
  options: string[]
  value?: string
  onChange?: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <select
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 cursor-pointer appearance-none"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icon = {
  dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  sales: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  ),
  purchasing: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    </svg>
  ),
  inventory: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
    </svg>
  ),
  couriers: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  ),
  map: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
      <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  ),
  history: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  chevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  filter: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  arrowUp: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
    </svg>
  ),
  arrowDown: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
    </svg>
  ),
  check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  x: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  dots: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
    </svg>
  ),
  package: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  truck: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  shoppingCart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
    </svg>
  ),
  alertTriangle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  checkCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  barChart: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  undo: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
    </svg>
  ),
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS: { key: Page; label: string; icon: keyof typeof Icon }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'sales', label: 'Продажи', icon: 'sales' },
  { key: 'purchasing', label: 'Закуп', icon: 'purchasing' },
  { key: 'inventory', label: 'Остатки', icon: 'inventory' },
  { key: 'couriers', label: 'Курьеры', icon: 'couriers' },
  { key: 'map', label: 'Карта', icon: 'map' },
  { key: 'history', label: 'История', icon: 'history' },
  { key: 'settings', label: 'Настройки', icon: 'settings' },
]

function Sidebar({ current, onChange }: { current: Page; onChange: (p: Page) => void }) {
  return (
    <aside className="w-60 h-full flex flex-col bg-slate-900 text-white shrink-0">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            AH
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide">AZBY HOME</div>
            <div className="text-xs text-slate-500 mt-0.5">CRM / Управление</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const Ic = Icon[item.icon]
          const active = current === item.key
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer
                ${active
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <Ic />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t border-slate-800 pt-4">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-semibold shrink-0">
            АД
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Администратор</div>
            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-slate-500">Онлайн</span>
            </div>
          </div>
          <button className="text-slate-500 hover:text-slate-300 cursor-pointer">
            <Icon.logout />
          </button>
        </div>
      </div>
    </aside>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

const PAGE_TITLES: Record<Page, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Обзор работы магазина' },
  sales: { title: 'Продажи', subtitle: 'Управление продажами и заказами' },
  purchasing: { title: 'Закуп', subtitle: 'Управление поставками и заявками' },
  inventory: { title: 'Остатки', subtitle: 'Контроль товаров и складских запасов' },
  couriers: { title: 'Курьеры', subtitle: 'Управление курьерами и доставками' },
  map: { title: 'Карта', subtitle: 'Мониторинг доставок на карте Бишкека' },
  history: { title: 'История', subtitle: 'Журнал всех операций' },
  settings: { title: 'Настройки', subtitle: 'Конфигурация системы' },
}

function Header({ page, onSearch }: { page: Page; onSearch?: (v: string) => void }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const { title, subtitle } = PAGE_TITLES[page]

  const notifs = [
    { id: 1, icon: '🔴', text: 'Товар закончился на складе', time: '2 мин назад' },
    { id: 2, icon: '🟡', text: 'Новый заказ ожидает закупки', time: '15 мин назад' },
    { id: 3, icon: '🔵', text: 'Заказ #1023 передан курьеру', time: '32 мин назад' },
    { id: 4, icon: '🔴', text: 'Получен возврат по заказу #1018', time: '1 час назад' },
    { id: 5, icon: '✅', text: 'Заказ #1022 успешно доставлен', time: '2 час назад' },
  ]

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0">
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      {/* Search */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon.search />
        </div>
        <input
          type="text"
          placeholder="Глобальный поиск..."
          value={search}
          onChange={e => { setSearch(e.target.value); onSearch?.(e.target.value) }}
          className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg w-56 outline-none focus:border-indigo-400 focus:bg-white"
        />
      </div>
      {/* Notifications */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setNotifOpen(v => !v)}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
        >
          <Icon.bell />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-11 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Уведомления</span>
              <span className="text-xs text-indigo-600 cursor-pointer hover:underline">Отметить все</span>
            </div>
            {notifs.map(n => (
              <div key={n.id} className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0">
                <div className="flex gap-3">
                  <span className="text-base">{n.icon}</span>
                  <div>
                    <p className="text-sm text-slate-800">{n.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* User */}
      <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded-lg px-2 py-1.5">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white">
          АД
        </div>
        <span className="text-sm font-medium text-slate-700">Администратор</span>
        <Icon.chevronDown />
      </div>
    </header>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, icon, change, changeType = 'up', color = 'indigo',
}: {
  label: string; value: string; icon: React.ReactNode
  change: string; changeType?: 'up' | 'down' | 'neutral'; color?: string
}) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-0.5 text-xs font-medium
          ${changeType === 'up' ? 'text-green-600' : changeType === 'down' ? 'text-red-600' : 'text-slate-500'}`}>
          {changeType === 'up' ? <Icon.arrowUp /> : changeType === 'down' ? <Icon.arrowDown /> : null}
          {change}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-500 mt-0.5">{label}</div>
      </div>
    </Card>
  )
}

function MiniChart() {
  const points = [40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100]
  const max = Math.max(...points)
  const h = 80, w = 300
  const step = w / (points.length - 1)
  const pts = points.map((p, i) => `${i * step},${h - (p / max) * h}`).join(' ')
  const area = `${pts} ${(points.length - 1) * step},${h} 0,${h}`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 80 }}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4338CA" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4338CA" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#cg)" />
      <polyline points={pts} fill="none" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SalesChart() {
  const [period, setPeriod] = useState<'Сегодня' | '7 дней' | '30 дней' | '3 месяца'>('30 дней')
  const periods = ['Сегодня', '7 дней', '30 дней', '3 месяца'] as const

  const chartData = [
    { label: '1 авг', val: 420 },
    { label: '5 авг', val: 680 },
    { label: '8 авг', val: 520 },
    { label: '10 авг', val: 900 },
    { label: '12 авг', val: 750 },
    { label: '13 авг', val: 1100 },
    { label: '14 авг', val: 870 },
    { label: '15 авг', val: 1248 },
  ]

  const maxVal = Math.max(...chartData.map(d => d.val))
  const h = 140, w = 520
  const step = w / (chartData.length - 1)
  const toY = (v: number) => h - (v / maxVal) * h * 0.9
  const pts = chartData.map((d, i) => `${i * step},${toY(d.val)}`).join(' ')
  const area = `${pts} ${(chartData.length - 1) * step},${h} 0,${h}`

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Продажи</h3>
          <p className="text-xs text-slate-500 mt-0.5">Динамика выручки</p>
        </div>
        <div className="flex items-center gap-1">
          {periods.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer
                ${period === p ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-8">
        <div className="flex-1">
          <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full" style={{ height: 160 }}>
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4338CA" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#4338CA" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
              <line key={i} x1="0" y1={toY(maxVal * t)} x2={w} y2={toY(maxVal * t)}
                stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
            ))}
            <polygon points={area} fill="url(#sg)" />
            <polyline points={pts} fill="none" stroke="#4338CA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {chartData.map((d, i) => (
              <g key={i}>
                <circle cx={i * step} cy={toY(d.val)} r="4" fill="white" stroke="#4338CA" strokeWidth="2" />
                <text x={i * step} y={h + 16} textAnchor="middle" fontSize="10" fill="#94A3B8">{d.label}</text>
              </g>
            ))}
          </svg>
        </div>
        <div className="w-44 shrink-0 flex flex-col justify-center border-l border-slate-100 pl-6">
          <p className="text-xs text-slate-500">Продажи за период</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">1 248 500</p>
          <p className="text-sm text-slate-500">сом</p>
          <div className="mt-3 flex items-center gap-1 text-green-600 text-xs font-medium">
            <Icon.arrowUp />
            <span>+18.4% к прошлому</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

function AttentionCard({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const items = [
    { color: 'text-red-500', bg: 'hover:bg-red-50', label: 'Нет товара на складе', count: '3 товара', border: 'border-l-2 border-red-400', page: 'inventory' as Page },
    { color: 'text-yellow-500', bg: 'hover:bg-yellow-50', label: 'Нужно заказать', count: '5 заказов', border: 'border-l-2 border-yellow-400', page: 'purchasing' as Page },
    { color: 'text-blue-500', bg: 'hover:bg-blue-50', label: 'Ожидает доставки', count: '7 заказов', border: 'border-l-2 border-blue-400', page: 'couriers' as Page },
    { color: 'text-red-500', bg: 'hover:bg-red-50', label: 'Возвраты', count: '2 заказа', border: 'border-l-2 border-red-400', page: 'sales' as Page },
  ]
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">Требует внимания</h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => onNavigate(item.page)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer ${item.bg} ${item.border} text-left`}
          >
            <span className="text-sm text-slate-700">{item.label}</span>
            <span className={`text-sm font-semibold ${item.color}`}>{item.count}</span>
          </button>
        ))}
      </div>
    </Card>
  )
}

function RecentOrders({ onOrderClick }: { onOrderClick: (id: string) => void }) {
  const recent = ORDERS.slice(0, 5)
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Последние заказы</h3>
        <span className="text-xs text-indigo-600 cursor-pointer hover:underline">Все заказы →</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {['№ заказа', 'Клиент', 'Товар', 'Район', 'Стоимость', 'Статус', 'Курьер', ''].map(h => (
                <th key={h} className="text-left text-xs text-slate-400 font-medium pb-2.5 pr-4 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map(o => (
              <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50 last:border-0">
                <td className="py-2.5 pr-4 font-medium text-slate-900 whitespace-nowrap">{o.id}</td>
                <td className="py-2.5 pr-4 text-slate-700 whitespace-nowrap">{o.client.split(' ')[0]}</td>
                <td className="py-2.5 pr-4 text-slate-700 whitespace-nowrap max-w-32 truncate">{o.product}</td>
                <td className="py-2.5 pr-4 text-slate-500 whitespace-nowrap">{o.district}</td>
                <td className="py-2.5 pr-4 font-medium text-slate-900 whitespace-nowrap">{o.price}</td>
                <td className="py-2.5 pr-4"><StatusBadge status={o.status} /></td>
                <td className="py-2.5 pr-4 text-slate-500 whitespace-nowrap">{o.courier}</td>
                <td className="py-2.5">
                  <button onClick={() => onOrderClick(o.id)} className="text-xs text-indigo-600 hover:underline cursor-pointer whitespace-nowrap">Открыть</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function Dashboard({ onNavigate, onOrderClick }: { onNavigate: (p: Page) => void; onOrderClick: (id: string) => void }) {
  const stats = [
    { label: 'Всего товаров', value: '186', icon: <Icon.package />, change: '+3', changeType: 'up' as const, color: 'indigo' },
    { label: 'В наличии', value: '142', icon: <Icon.checkCircle />, change: '+5', changeType: 'up' as const, color: 'green' },
    { label: 'Заканчивается', value: '28', icon: <Icon.alertTriangle />, change: '+2', changeType: 'down' as const, color: 'yellow' },
    { label: 'Нет в наличии', value: '16', icon: <Icon.alertTriangle />, change: '-1', changeType: 'up' as const, color: 'red' },
    { label: 'Продажи сегодня', value: '12', icon: <Icon.shoppingCart />, change: '+4', changeType: 'up' as const, color: 'blue' },
    { label: 'В доставке', value: '7', icon: <Icon.truck />, change: '0', changeType: 'neutral' as const, color: 'cyan' },
    { label: 'Ожидают закупки', value: '5', icon: <Icon.clock />, change: '-2', changeType: 'up' as const, color: 'orange' },
    { label: 'Доставлено сегодня', value: '9', icon: <Icon.checkCircle />, change: '+3', changeType: 'up' as const, color: 'green' },
  ]
  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {stats.slice(0, 4).map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {stats.slice(4).map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <SalesChart />
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <RecentOrders onOrderClick={onOrderClick} />
        </div>
        <AttentionCard onNavigate={onNavigate} />
      </div>
    </div>
  )
}

// ─── Sales Page ───────────────────────────────────────────────────────────────

function SalesPage({
  onOrderClick, onNewSale,
}: {
  onOrderClick: (id: string) => void
  onNewSale: () => void
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Все')
  const [districtFilter, setDistrictFilter] = useState('Все районы')

  const statuses = ['Все', 'Новый', 'В обработке', 'Ожидает закупки', 'Закуплен', 'Передан курьеру', 'В доставке', 'Доставлен', 'Возврат']
  const districts = ['Все районы', 'Ленинский', 'Октябрьский', 'Первомайский', 'Свердловский']

  const filtered = ORDERS.filter(o => {
    const matchSearch = search === '' || o.product.toLowerCase().includes(search.toLowerCase()) || o.client.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'Все' || o.status === statusFilter
    const matchDistrict = districtFilter === 'Все районы' || o.district === districtFilter
    return matchSearch && matchStatus && matchDistrict
  })

  return (
    <div className="p-6 space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon.search /></div>
          <input
            placeholder="Поиск по товару или клиенту"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-400 cursor-pointer"
        >
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <select
          value={districtFilter}
          onChange={e => setDistrictFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-400 cursor-pointer"
        >
          {districts.map(d => <option key={d}>{d}</option>)}
        </select>
        <input type="date" className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-400 cursor-pointer text-slate-600" />
        <div className="ml-auto">
          <Btn onClick={onNewSale}><Icon.plus /> Новая продажа</Btn>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['№', 'Товар', 'Бренд', 'Клиент', 'Телефон', 'Район', 'Цена', 'Рассрочка', 'Статус', 'Курьер', 'Дата', 'Действия'].map(h => (
                  <th key={h} className="text-left text-xs text-slate-500 font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{o.id}</td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap max-w-36 truncate">{o.product}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{o.brand}</td>
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{o.client}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{o.phone}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{o.district}</td>
                  <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{o.price}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{o.installment}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{o.courier}</td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{o.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => onOrderClick(o.id)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded cursor-pointer"><Icon.eye /></button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"><Icon.edit /></button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"><Icon.dots /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Показано {filtered.length} из {ORDERS.length} заказов</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">←</button>
            <button className="px-2.5 py-1 rounded bg-indigo-600 text-white">1</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">2</button>
            <button className="px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">→</button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── New Sale Modal ───────────────────────────────────────────────────────────

function NewSaleModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  const [productName, setProductName] = useState('')
  const [brand, setBrand] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('1')
  const [clientName, setClientName] = useState('')
  const [phone, setPhone] = useState('')
  const [district, setDistrict] = useState('Ленинский')

  const districts = ['Ленинский', 'Октябрьский', 'Первомайский', 'Свердловский']
  const total = price ? `${parseInt(price.replace(/\D/g, '') || '0') * parseInt(qty || '1')} сом` : '—'

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-12 z-50 overflow-y-auto px-4 pb-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex overflow-hidden">
        {/* Form */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[80vh]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Новая продажа</h2>
              <p className="text-sm text-slate-500 mt-0.5">Заполните данные заказа</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><Icon.x /></button>
          </div>

          <div className="space-y-6">
            {/* Товар */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 pb-2 border-b border-slate-100">Товар</h3>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Название товара" placeholder="Холодильник Midea" value={productName} onChange={setProductName} />
                <Input label="Бренд" placeholder="Midea" value={brand} onChange={setBrand} />
                <Input label="Модель" placeholder="MDR-450" />
                <Input label="Количество" type="number" value={qty} onChange={setQty} />
                <Input label="Цена" placeholder="48 500" value={price} onChange={setPrice} />
                <Input label="Цена в рассрочку" placeholder="54 000" />
              </div>
              <div className="mt-3">
                <Input label="Описание" placeholder="Дополнительная информация о товаре..." />
              </div>
            </div>

            {/* Клиент */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 pb-2 border-b border-slate-100">Клиент</h3>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Имя клиента" placeholder="Азамат Бердибеков" value={clientName} onChange={setClientName} />
                <Input label="Номер телефона" placeholder="+996 700 000 000" value={phone} onChange={setPhone} />
              </div>
            </div>

            {/* Адрес */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 pb-2 border-b border-slate-100">Адрес доставки</h3>
              <div className="grid grid-cols-2 gap-3">
                <Select label="Район" options={districts} value={district} onChange={setDistrict} />
                <Input label="Улица" placeholder="ул. Киевская" />
                <Input label="Дом / квартира" placeholder="120, кв. 5" />
                <Input label="Ссылка на 2GIS" placeholder="https://2gis.kg/..." />
              </div>
              <div className="mt-3">
                <label className="text-sm font-medium text-slate-700 block mb-1.5">Комментарий</label>
                <textarea
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500 resize-none"
                  rows={2}
                  placeholder="Дополнительный комментарий курьеру..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
            <Btn variant="secondary" onClick={onClose}>Отмена</Btn>
            <Btn onClick={onSave}><Icon.check /> Создать продажу</Btn>
          </div>
        </div>

        {/* Summary */}
        <div className="w-56 bg-slate-50 border-l border-slate-200 p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Итог заказа</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Товар</span>
              <span className="text-slate-900 text-right max-w-24 text-xs">{productName || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Количество</span>
              <span className="text-slate-900">{qty} шт.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Цена</span>
              <span className="text-slate-900">{price ? `${price} сом` : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Доставка</span>
              <span className="text-green-600 font-medium">Бесплатно</span>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700">Итого</span>
                <span className="text-slate-900">{total}</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs text-slate-400">Район</span>
            <p className="text-sm text-slate-700 mt-0.5">{district}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Order Details ─────────────────────────────────────────────────────────────

function OrderDetails({ orderId, onClose, onReturn }: { orderId: string; onClose: () => void; onReturn: () => void }) {
  const order = ORDERS.find(o => o.id === orderId) || ORDERS[0]

  const timelineSteps = [
    { label: 'Продажа создана', done: true },
    { label: 'Проверка остатков', done: true },
    { label: 'Ожидает закупки', done: order.status !== 'Новый' && order.status !== 'В обработке', active: order.status === 'Ожидает закупки' },
    { label: 'Закуплен', done: ['Закуплен', 'Передан курьеру', 'В доставке', 'Доставлен'].includes(order.status), active: order.status === 'Закуплен' },
    { label: 'Передан курьеру', done: ['Передан курьеру', 'В доставке', 'Доставлен'].includes(order.status), active: order.status === 'Передан курьеру' },
    { label: 'В доставке', done: ['В доставке', 'Доставлен'].includes(order.status), active: order.status === 'В доставке' },
    { label: 'Доставлен', done: order.status === 'Доставлен', active: order.status === 'Доставлен' },
  ]

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-8 z-50 overflow-y-auto px-4 pb-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Заказ {order.id}</h2>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-2">
            <Btn variant="danger" size="sm" onClick={onReturn}><Icon.undo /> Возврат</Btn>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><Icon.x /></button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-5 gap-6">
          {/* Info */}
          <div className="col-span-3 space-y-5">
            {/* Customer */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Клиент</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                  {order.client.split(' ')[0][0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{order.client}</p>
                  <p className="text-sm text-slate-500">{order.phone}</p>
                </div>
              </div>
            </div>

            {/* Product */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Товар</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-slate-500 text-xs">Наименование</p><p className="font-medium text-slate-900 mt-0.5">{order.product}</p></div>
                <div><p className="text-slate-500 text-xs">Модель</p><p className="font-medium text-slate-900 mt-0.5">{order.model || 'ABC-123'}</p></div>
                <div><p className="text-slate-500 text-xs">Количество</p><p className="font-medium text-slate-900 mt-0.5">1 шт.</p></div>
                <div><p className="text-slate-500 text-xs">Бренд</p><p className="font-medium text-slate-900 mt-0.5">{order.brand}</p></div>
                <div><p className="text-slate-500 text-xs">Цена</p><p className="font-semibold text-slate-900 mt-0.5">{order.price}</p></div>
                <div><p className="text-slate-500 text-xs">Рассрочка</p><p className="font-semibold text-slate-900 mt-0.5">{order.installment}</p></div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Адрес доставки</h3>
              <div className="text-sm space-y-1">
                <p className="text-slate-900 font-medium">{order.district} район</p>
                <p className="text-slate-600">ул. Киевская, 120</p>
                <p className="text-slate-400 text-xs mt-2">Ориентир: рядом с аптекой «Медикус»</p>
              </div>
              {/* Fake map preview */}
              <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 h-28 bg-slate-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 300 112">
                    <rect width="300" height="112" fill="#E2E8F0" />
                    {/* Simple grid roads */}
                    {[20, 56, 92].map(y => <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#CBD5E1" strokeWidth="4" />)}
                    {[50, 100, 150, 200, 250].map(x => <line key={x} x1={x} y1="0" x2={x} y2="112" stroke="#CBD5E1" strokeWidth="2" />)}
                    <rect x="20" y="30" width="30" height="20" rx="3" fill="#94A3B8" opacity="0.4" />
                    <rect x="70" y="10" width="25" height="15" rx="3" fill="#94A3B8" opacity="0.4" />
                    <rect x="110" y="62" width="40" height="25" rx="3" fill="#94A3B8" opacity="0.4" />
                    {/* Marker */}
                    <circle cx="150" cy="56" r="10" fill="#4338CA" opacity="0.9" />
                    <circle cx="150" cy="56" r="4" fill="white" />
                    <text x="160" y="50" fontSize="9" fill="#4338CA" fontWeight="600">ул. Киевская, 120</text>
                  </svg>
                </div>
                <div className="absolute bottom-2 right-2 bg-white rounded px-2 py-0.5 text-xs text-slate-600 border border-slate-200">
                  2GIS
                </div>
              </div>
            </div>

            {order.courier !== '—' && (
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Курьер</h3>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm">
                    {order.courier[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{order.courier}</p>
                    <p className="text-xs text-slate-500">{order.district} район</p>
                  </div>
                  <StatusBadge status="В доставке" />
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="col-span-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Статус заказа</h3>
            <div className="relative">
              {timelineSteps.map((step, i) => (
                <div key={i} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10
                      ${step.done && !step.active ? 'bg-indigo-600 text-white' :
                        step.active ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
                        'bg-slate-100 text-slate-400'}`}
                    >
                      {step.done ? <Icon.check /> : <span className="text-xs">{i + 1}</span>}
                    </div>
                    {i < timelineSteps.length - 1 && (
                      <div className={`w-0.5 flex-1 mt-1 ${step.done ? 'bg-indigo-300' : 'bg-slate-200'}`} style={{ minHeight: 20 }} />
                    )}
                  </div>
                  <div className="pt-0.5 pb-4">
                    <p className={`text-sm font-medium ${step.active ? 'text-indigo-600' : step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                    </p>
                    {step.active && <p className="text-xs text-slate-500 mt-0.5">Текущий статус</p>}
                    {step.done && !step.active && i < 2 && <p className="text-xs text-slate-400 mt-0.5">{order.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Return Modal ─────────────────────────────────────────────────────────────

function ReturnModal({ orderId, onClose, onConfirm }: { orderId: string; onClose: () => void; onConfirm: () => void }) {
  const order = ORDERS.find(o => o.id === orderId) || ORDERS[0]
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')

  const reasons = ['Клиент отказался', 'У покупателя нет денег', 'Брак товара', 'Клиент передумал', 'Другая причина']

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">Оформить возврат</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><Icon.x /></button>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5 text-sm space-y-1">
          <div className="flex justify-between"><span className="text-slate-500">Заказ</span><span className="font-medium text-slate-900">{order.id}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Товар</span><span className="font-medium text-slate-900">{order.product}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Клиент</span><span className="font-medium text-slate-900">{order.client.split(' ')[0]}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Курьер</span><span className="font-medium text-slate-900">{order.courier !== '—' ? order.courier : '—'}</span></div>
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium text-slate-700 block mb-2">Причина возврата</label>
          <div className="space-y-2">
            {reasons.map(r => (
              <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${reason === r ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}
                  onClick={() => setReason(r)}
                >
                  {reason === r && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-sm text-slate-700">{r}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <label className="text-sm font-medium text-slate-700 block mb-1.5">Комментарий</label>
          <textarea
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500 resize-none"
            rows={3}
            placeholder="Дополнительная информация..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Btn variant="secondary" className="flex-1" onClick={onClose}>Отмена</Btn>
          <Btn variant="danger" className="flex-1" onClick={onConfirm} disabled={!reason}>Оформить возврат</Btn>
        </div>
      </div>
    </div>
  )
}

// ─── Product Unavailable Modal ────────────────────────────────────────────────

function UnavailableModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [reason, setReason] = useState('')
  const options = ['Товар закончился', 'Временно отсутствует', 'Ошибка склада', 'Другая причина']

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-900">Почему товара нет?</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><Icon.x /></button>
        </div>
        <div className="space-y-2 mb-4">
          {options.map(o => (
            <label key={o} className="flex items-center gap-2.5 cursor-pointer">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${reason === o ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}
                onClick={() => setReason(o)}
              >
                {reason === o && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className="text-sm text-slate-700">{o}</span>
            </label>
          ))}
        </div>
        <label className="text-sm font-medium text-slate-700 block mb-1.5">Комментарий</label>
        <textarea
          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500 resize-none mb-5"
          rows={2}
          placeholder="Комментарий"
        />
        <div className="flex gap-3">
          <Btn variant="secondary" className="flex-1" onClick={onClose}>Отмена</Btn>
          <Btn className="flex-1" onClick={onConfirm} disabled={!reason}>Подтвердить</Btn>
        </div>
      </div>
    </div>
  )
}

// ─── Inventory Page ───────────────────────────────────────────────────────────

function InventoryPage({ onProductClick }: { onProductClick: (id: string) => void }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Все')
  const [brandFilter, setBrandFilter] = useState('Все')

  const brands = ['Все', 'Midea', 'Samsung', 'LG', 'Bosch', 'Haier', 'Xiaomi']
  const statuses = ['Все', 'В наличии', 'Заканчивается', 'Нет в наличии']

  const filtered = PRODUCTS.filter(p => {
    const ms = search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
    const mb = brandFilter === 'Все' || p.brand === brandFilter
    const mst = statusFilter === 'Все' || p.status === statusFilter
    return ms && mb && mst
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon.search /></div>
          <input placeholder="Поиск товара" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-400" />
        </div>
        <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-400 cursor-pointer">
          {brands.map(b => <option key={b}>{b}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-400 cursor-pointer">
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="ml-auto">
          <Btn><Icon.plus /> Добавить товар</Btn>
        </div>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['', 'Бренд', 'Название', 'Модель', 'Категория', 'Кол-во', 'Мин. остаток', 'Цена', 'Рассрочка', 'Склад', 'Статус'].map(h => (
                <th key={h} className="text-left text-xs text-slate-500 font-medium px-4 py-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} onClick={() => onProductClick(p.id)} className="border-b border-slate-50 hover:bg-slate-50/50 last:border-0 cursor-pointer">
                <td className="px-4 py-3 text-xl">{p.photo}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{p.brand}</td>
                <td className="px-4 py-3 text-slate-700">{p.name}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{p.model}</td>
                <td className="px-4 py-3 text-slate-500">{p.category}</td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${p.qty === 0 ? 'text-red-600' : p.qty <= p.minQty ? 'text-yellow-600' : 'text-slate-900'}`}>
                    {p.qty} шт.
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{p.minQty} шт.</td>
                <td className="px-4 py-3 font-medium text-slate-900">{p.price}</td>
                <td className="px-4 py-3 text-slate-500">{p.installment}</td>
                <td className="px-4 py-3 text-slate-500">{p.warehouse}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-slate-500 font-medium">Товаров пока нет</p>
            <p className="text-slate-400 text-sm mt-1">Попробуйте изменить фильтры</p>
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── Product Details ──────────────────────────────────────────────────────────

function ProductDetails({ productId, onClose }: { productId: string; onClose: () => void }) {
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0]
  const history = [
    { date: '15.08.2026', op: 'Продажа', qty: -1, staff: 'Администратор', stock: product.qty + 1 },
    { date: '14.08.2026', op: 'Поступление', qty: +5, staff: 'Менеджер', stock: product.qty + 2 },
    { date: '13.08.2026', op: 'Продажа', qty: -2, staff: 'Администратор', stock: product.qty - 3 },
    { date: '12.08.2026', op: 'Продажа', qty: -1, staff: 'Администратор', stock: product.qty - 1 },
  ]

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-8 z-50 overflow-y-auto px-4 pb-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">{product.brand} {product.name}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><Icon.x /></button>
        </div>
        <div className="p-6 grid grid-cols-5 gap-6">
          {/* Image + info */}
          <div className="col-span-2">
            <div className="bg-slate-50 rounded-xl h-48 flex items-center justify-center text-7xl border border-slate-100">
              {product.photo}
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Бренд</span><span className="font-medium">{product.brand}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Категория</span><span className="font-medium">{product.category}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Модель</span><span className="font-medium">{product.model}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Цена</span><span className="font-semibold text-slate-900">{product.price}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Рассрочка</span><span className="font-medium">{product.installment}</span></div>
              <div className="border-t border-slate-100 pt-2 flex justify-between"><span className="text-slate-500">Остаток</span><span className={`font-semibold ${product.qty === 0 ? 'text-red-600' : product.qty <= product.minQty ? 'text-yellow-600' : 'text-green-600'}`}>{product.qty} шт.</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Мин. остаток</span><span className="font-medium">{product.minQty} шт.</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Склад</span><span className="font-medium">{product.warehouse}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500">Статус</span><StatusBadge status={product.status} /></div>
            </div>
          </div>
          {/* History */}
          <div className="col-span-3">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">История движения товара</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Дата', 'Операция', 'Кол-во', 'Сотрудник', 'Остаток'].map(h => (
                    <th key={h} className="text-left text-xs text-slate-400 font-medium pb-2 pr-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5 pr-3 text-slate-400 text-xs">{h.date}</td>
                    <td className="py-2.5 pr-3 text-slate-700">{h.op}</td>
                    <td className={`py-2.5 pr-3 font-medium ${h.qty > 0 ? 'text-green-600' : 'text-red-600'}`}>{h.qty > 0 ? `+${h.qty}` : h.qty}</td>
                    <td className="py-2.5 pr-3 text-slate-500">{h.staff}</td>
                    <td className="py-2.5 text-slate-900 font-medium">{h.stock} шт.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Purchasing Page ──────────────────────────────────────────────────────────

function PurchasingPage({ onUnavailable }: { onUnavailable: () => void }) {
  const suppliers = [
    { name: 'Midea', count: 12, amount: '450 000 сом', status: 'Активный', color: 'text-blue-600 bg-blue-50' },
    { name: 'Samsung', count: 18, amount: '780 000 сом', status: 'Активный', color: 'text-blue-600 bg-blue-50' },
    { name: 'LG', count: 15, amount: '620 000 сом', status: 'Активный', color: 'text-blue-600 bg-blue-50' },
    { name: 'Bosch', count: 10, amount: '390 000 сом', status: 'Ожидание', color: 'text-yellow-600 bg-yellow-50' },
    { name: 'Haier', count: 14, amount: '510 000 сом', status: 'Активный', color: 'text-blue-600 bg-blue-50' },
  ]

  const requests = ORDERS.filter(o => o.status === 'Ожидает закупки')

  return (
    <div className="p-6 space-y-6">
      {/* Supplier cards */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Поставщики / Склады</h2>
        <div className="grid grid-cols-5 gap-4">
          {suppliers.map(s => (
            <Card key={s.name} className="p-4 hover:shadow-md cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm mb-3">
                {s.name[0]}
              </div>
              <p className="font-semibold text-slate-900 text-sm">{s.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.count} товаров</p>
              <p className="text-sm font-medium text-slate-700 mt-1">{s.amount}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>{s.status}</span>
                <button className="text-xs text-indigo-600 hover:underline cursor-pointer">Открыть</button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Requests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700">Заявки на закуп</h2>
          <span className="text-xs text-slate-500">{requests.length} заявок</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {requests.length === 0 ? (
            <Card className="col-span-2 py-16 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-slate-500 font-medium">Нет заявок на закуп</p>
              <p className="text-slate-400 text-sm mt-1">Все заявки обработаны</p>
            </Card>
          ) : (
            requests.map(o => (
              <Card key={o.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Заявка {o.id}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{o.date}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <div className="space-y-1.5 text-sm mb-4">
                  <div className="flex gap-2"><span className="text-slate-400 w-20">Товар</span><span className="text-slate-900 font-medium">{o.product}</span></div>
                  <div className="flex gap-2"><span className="text-slate-400 w-20">Количество</span><span className="text-slate-700">2 шт.</span></div>
                  <div className="flex gap-2"><span className="text-slate-400 w-20">Клиент</span><span className="text-slate-700">{o.client.split(' ')[0]}</span></div>
                  <div className="flex gap-2"><span className="text-slate-400 w-20">Район</span><span className="text-slate-700">{o.district}</span></div>
                  <div className="flex gap-2"><span className="text-slate-400 w-20">Стоимость</span><span className="text-slate-900 font-semibold">{o.price}</span></div>
                </div>
                <div className="flex gap-2">
                  <Btn variant="success" size="sm" className="flex-1"><Icon.check /> Забрать товар</Btn>
                  <Btn variant="secondary" size="sm" className="flex-1" onClick={onUnavailable}>Товара нет</Btn>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Couriers Page ────────────────────────────────────────────────────────────

function CouriersPage({ onCourierClick }: { onCourierClick: (id: string) => void }) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-5">
        {COURIERS.map(c => (
          <Card key={c.id} className="p-5 hover:shadow-md cursor-pointer" onClick={() => onCourierClick(c.id)}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                  {c.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{c.name}</p>
                  <p className="text-sm text-slate-500">{c.district} район</p>
                </div>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <div className="grid grid-cols-4 gap-3 bg-slate-50 rounded-xl p-3">
              {[
                { label: 'Всего', value: c.total },
                { label: 'В доставке', value: c.inDelivery, color: 'text-blue-600' },
                { label: 'Доставлено', value: c.delivered, color: 'text-green-600' },
                { label: 'Возвраты', value: c.returns, color: c.returns > 0 ? 'text-red-600' : 'text-slate-900' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className={`text-xl font-bold ${s.color || 'text-slate-900'}`}>{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-end">
              <span className="text-xs text-indigo-600 hover:underline cursor-pointer">Подробнее →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Courier Details ──────────────────────────────────────────────────────────

function CourierDetails({ courierId, onClose, onOrderClick }: {
  courierId: string; onClose: () => void; onOrderClick: (id: string) => void
}) {
  const courier = COURIERS.find(c => c.id === courierId) || COURIERS[0]
  const courierOrders = ORDERS.filter(o => o.courier === courier.name)

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-8 z-50 overflow-y-auto px-4 pb-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-semibold">
              {courier.name[0]}
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">{courier.name}</h2>
              <p className="text-xs text-slate-500">{courier.district} район</p>
            </div>
            <StatusBadge status={courier.status} />
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><Icon.x /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Заказов сегодня', value: courier.total, color: 'text-slate-900' },
              { label: 'Доставлено', value: courier.delivered, color: 'text-green-600' },
              { label: 'В доставке', value: courier.inDelivery, color: 'text-blue-600' },
              { label: 'Возвраты', value: courier.returns, color: courier.returns > 0 ? 'text-red-600' : 'text-slate-900' },
            ].map(s => (
              <Card key={s.label} className="p-3 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-400 mt-1">{s.label}</p>
              </Card>
            ))}
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Текущие заказы</h3>
          <div className="space-y-3">
            {courierOrders.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <div className="text-3xl mb-2">📭</div>
                <p className="text-sm">Нет текущих доставок</p>
              </div>
            ) : (
              courierOrders.map(o => (
                <div key={o.id} className="bg-slate-50 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900">{o.id}</span>
                      <StatusBadge status={o.status} />
                    </div>
                    <p className="text-sm text-slate-700">{o.product}</p>
                    <p className="text-xs text-slate-500 mt-0.5">ул. Манаса, 45 · {o.district}</p>
                  </div>
                  <button
                    onClick={() => onOrderClick(o.id)}
                    className="text-xs text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 cursor-pointer whitespace-nowrap"
                  >
                    Открыть заказ
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Map Page ─────────────────────────────────────────────────────────────────

function MapPage({ onOrderClick }: { onOrderClick: (id: string) => void }) {
  const [districtFilter, setDistrictFilter] = useState('Все')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const filters = ['Все', 'Первомайский', 'Ленинский', 'Октябрьский', 'Свердловский', 'В доставке', 'Ожидают доставки', 'Доставлены']

  const markers = [
    { id: '#1023', x: 280, y: 200, status: 'В доставке', client: 'Айжан', phone: '+996 550 234 567', product: 'Телевизор Samsung', district: 'Октябрьский', address: 'ул. Горького, 88', courier: 'Александр' },
    { id: '#1022', x: 160, y: 280, status: 'Доставлен', client: 'Бакыт', phone: '+996 777 345 678', product: 'Стиральная машина LG', district: 'Первомайский', address: 'ул. Манаса, 45', courier: 'Коля' },
    { id: '#1024', x: 220, y: 320, status: 'Ожидает закупки', client: 'Азамат', phone: '+996 700 123 456', product: 'Холодильник Midea', district: 'Ленинский', address: 'ул. Киевская, 120', courier: 'Николай' },
    { id: '#1021', x: 350, y: 360, status: 'Передан курьеру', client: 'Гүлзат', phone: '+996 502 456 789', product: 'Духовой шкаф Bosch', district: 'Свердловский', address: 'ул. Фрунзе, 33', courier: 'Сергей' },
  ]

  const markerColor = (status: string) => {
    if (status === 'В доставке') return '#2563EB'
    if (status === 'Доставлен') return '#16A34A'
    if (status === 'Ожидает закупки') return '#D97706'
    return '#4338CA'
  }

  const sel = markers.find(m => m.id === selectedOrder)

  return (
    <div className="p-6 flex flex-col gap-4 h-full">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon.search /></div>
          <input placeholder="Поиск заказа..." className="pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-400 w-48" />
        </div>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setDistrictFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium cursor-pointer
              ${districtFilter === f ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Map */}
      <Card className="flex-1 overflow-hidden relative min-h-96">
        <svg viewBox="0 0 560 500" className="w-full h-full" style={{ minHeight: 400 }}>
          {/* Background */}
          <rect width="560" height="500" fill="#F0F4F8" />
          {/* District fills */}
          <polygon points="0,0 280,0 280,250 0,250" fill="#EEF2FF" opacity="0.7" />
          <polygon points="280,0 560,0 560,250 280,250" fill="#F0FDF4" opacity="0.7" />
          <polygon points="0,250 280,250 280,500 0,500" fill="#FFF7ED" opacity="0.7" />
          <polygon points="280,250 560,250 560,500 280,500" fill="#FFF1F2" opacity="0.7" />
          {/* District borders */}
          <line x1="280" y1="0" x2="280" y2="500" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="6 4" />
          <line x1="0" y1="250" x2="560" y2="250" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="6 4" />
          {/* Roads */}
          {[60, 120, 180, 320, 380, 440].map(y => (
            <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="#E2E8F0" strokeWidth="5" />
          ))}
          {[70, 140, 210, 350, 420, 490].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="500" stroke="#E2E8F0" strokeWidth="3" />
          ))}
          {/* Main roads */}
          <line x1="0" y1="250" x2="560" y2="250" stroke="#CBD5E1" strokeWidth="8" />
          <line x1="280" y1="0" x2="280" y2="500" stroke="#CBD5E1" strokeWidth="8" />
          {/* Buildings */}
          {[[30,30,50,40],[100,20,40,30],[200,40,35,25],[320,30,45,35],[400,20,50,30],[460,50,35,40],
            [30,280,40,30],[80,300,50,25],[180,270,35,30],[320,280,40,35],[420,300,45,28],
            [30,150,35,25],[120,160,40,20],[200,140,30,25],[350,150,45,30],[450,160,35,25],
            [30,380,40,30],[100,370,35,25],[200,390,50,20],[330,380,35,30],[450,370,40,25]
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill="#CBD5E1" opacity="0.4" />
          ))}
          {/* District labels */}
          <text x="140" y="30" fontSize="11" fill="#6366F1" fontWeight="600" opacity="0.8">Первомайский</text>
          <text x="380" y="30" fontSize="11" fill="#16A34A" fontWeight="600" opacity="0.8">Октябрьский</text>
          <text x="130" y="480" fontSize="11" fill="#D97706" fontWeight="600" opacity="0.8">Ленинский</text>
          <text x="370" y="480" fontSize="11" fill="#DC2626" fontWeight="600" opacity="0.8">Свердловский</text>

          {/* Markers */}
          {markers.map(m => (
            <g key={m.id} onClick={() => setSelectedOrder(selectedOrder === m.id ? null : m.id)} className="cursor-pointer">
              <circle cx={m.x} cy={m.y} r="14" fill={markerColor(m.status)} opacity="0.15" />
              <circle cx={m.x} cy={m.y} r="9" fill={markerColor(m.status)} />
              <circle cx={m.x} cy={m.y} r="4" fill="white" />
              {selectedOrder === m.id && (
                <circle cx={m.x} cy={m.y} r="14" fill="none" stroke={markerColor(m.status)} strokeWidth="2" />
              )}
            </g>
          ))}
        </svg>

        {/* Popup */}
        {sel && (
          <div className="absolute top-4 right-4 bg-white rounded-xl border border-slate-200 shadow-xl w-64 p-4 z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-slate-900 text-sm">Заказ {sel.id}</span>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><Icon.x /></button>
            </div>
            <div className="space-y-1.5 text-sm mb-3">
              <div className="flex gap-2"><span className="text-slate-400 w-16">Клиент</span><span className="text-slate-900 font-medium">{sel.client}</span></div>
              <div className="flex gap-2"><span className="text-slate-400 w-16">Телефон</span><span className="text-slate-700">{sel.phone}</span></div>
              <div className="flex gap-2"><span className="text-slate-400 w-16">Товар</span><span className="text-slate-700">{sel.product}</span></div>
              <div className="flex gap-2"><span className="text-slate-400 w-16">Район</span><span className="text-slate-700">{sel.district}</span></div>
              <div className="flex gap-2"><span className="text-slate-400 w-16">Адрес</span><span className="text-slate-700">{sel.address}</span></div>
              <div className="flex gap-2"><span className="text-slate-400 w-16">Курьер</span><span className="text-slate-700">{sel.courier}</span></div>
              <div className="flex gap-2 items-center"><span className="text-slate-400 w-16">Статус</span><StatusBadge status={sel.status} /></div>
            </div>
            <Btn size="sm" className="w-full" onClick={() => { setSelectedOrder(null); onOrderClick(sel.id) }}>
              Открыть заказ
            </Btn>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-xl border border-slate-200 shadow p-3 flex gap-3 text-xs">
          {[{ color: '#2563EB', label: 'В доставке' }, { color: '#16A34A', label: 'Доставлен' }, { color: '#D97706', label: 'Ожидает' }, { color: '#4338CA', label: 'Назначен' }].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
              <span className="text-slate-600">{l.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ─── History Page ─────────────────────────────────────────────────────────────

function HistoryPage() {
  const [filter, setFilter] = useState('Все')
  const filters = ['Все', 'Продажи', 'Закуп', 'Доставка', 'Возвраты', 'Остатки']

  const events = [
    { date: '15.08.2026', time: '10:42', action: 'Продажа создана', product: 'Холодильник Midea', qty: 1, staff: 'Администратор', status: 'Новый' },
    { date: '15.08.2026', time: '10:18', action: 'Товар передан курьеру', product: 'Телевизор Samsung', qty: 1, staff: 'Николай', status: 'Передан курьеру' },
    { date: '15.08.2026', time: '09:55', action: 'Товар доставлен', product: 'Стиральная машина LG', qty: 1, staff: 'Коля', status: 'Доставлен' },
    { date: '14.08.2026', time: '16:30', action: 'Товар закуплен', product: 'Духовой шкаф Bosch', qty: 2, staff: 'Менеджер', status: 'Закуплен' },
    { date: '14.08.2026', time: '14:15', action: 'Возврат оформлен', product: 'Холодильник LG', qty: 1, staff: 'Администратор', status: 'Возврат' },
    { date: '14.08.2026', time: '11:00', action: 'Поступление товара', product: 'Пылесос Xiaomi', qty: 5, staff: 'Менеджер', status: 'В наличии' },
    { date: '13.08.2026', time: '17:45', action: 'Продажа создана', product: 'Кондиционер Samsung', qty: 1, staff: 'Администратор', status: 'Новый' },
    { date: '13.08.2026', time: '15:20', action: 'Товар передан курьеру', product: 'Посудомойка Bosch', qty: 1, staff: 'Сергей', status: 'Передан курьеру' },
  ]

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer
              ${filter === f ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {f}
          </button>
        ))}
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {['Дата', 'Время', 'Действие', 'Товар', 'Кол-во', 'Сотрудник', 'Статус'].map(h => (
                <th key={h} className="text-left text-xs text-slate-500 font-medium px-4 py-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 last:border-0">
                <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{e.date}</td>
                <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{e.time}</td>
                <td className="px-4 py-3 text-slate-800 font-medium">{e.action}</td>
                <td className="px-4 py-3 text-slate-600">{e.product}</td>
                <td className="px-4 py-3 text-slate-500">{e.qty} шт.</td>
                <td className="px-4 py-3 text-slate-600">{e.staff}</td>
                <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

// ─── Settings Page ────────────────────────────────────────────────────────────

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Профиль')
  const tabs = ['Профиль', 'Магазин', 'Курьеры', 'Районы', 'Склады', 'Уведомления']

  return (
    <div className="p-6 flex gap-6">
      {/* Tabs */}
      <div className="w-48 shrink-0">
        <Card className="p-2">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer
                ${activeTab === t ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {t}
            </button>
          ))}
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-5">
        {activeTab === 'Профиль' && (
          <>
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Личные данные</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl text-white font-bold">АД</div>
                <div>
                  <p className="font-semibold text-slate-900">Администратор</p>
                  <p className="text-sm text-slate-500">admin@azbyhome.kg</p>
                  <button className="text-xs text-indigo-600 mt-1 hover:underline cursor-pointer">Изменить фото</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Имя" value="Администратор" />
                <Input label="Email" value="admin@azbyhome.kg" />
                <Input label="Телефон" value="+996 700 000 000" />
                <Select label="Роль" options={['Администратор', 'Менеджер', 'Кассир']} value="Администратор" />
              </div>
              <div className="mt-4 flex justify-end">
                <Btn>Сохранить</Btn>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Изменить пароль</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Текущий пароль" type="password" />
                <div />
                <Input label="Новый пароль" type="password" />
                <Input label="Повторите пароль" type="password" />
              </div>
              <div className="mt-4 flex justify-end">
                <Btn>Обновить пароль</Btn>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'Магазин' && (
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Данные магазина</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Название магазина" value="AZBY HOME" />
              <Input label="Телефон" value="+996 700 777 000" />
              <Input label="Адрес" value="ул. Чуй, 123" />
              <Select label="Город" options={['Бишкек', 'Ош', 'Джалал-Абад']} />
              <Input label="Email" value="info@azbyhome.kg" />
              <Input label="ИНН" value="02345678" />
            </div>
            <div className="mt-4 flex justify-end">
              <Btn>Сохранить</Btn>
            </div>
          </Card>
        )}

        {activeTab === 'Курьеры' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Управление курьерами</h3>
              <Btn size="sm"><Icon.plus /> Добавить курьера</Btn>
            </div>
            <div className="space-y-2">
              {COURIERS.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold">{c.name[0]}</div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.district}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={c.status} />
                    <button className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"><Icon.edit /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'Районы' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Районы доставки</h3>
              <Btn size="sm"><Icon.plus /> Добавить район</Btn>
            </div>
            <div className="space-y-2">
              {['Ленинский', 'Октябрьский', 'Первомайский', 'Свердловский'].map(d => (
                <div key={d} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-sm font-medium text-slate-900">{d} район</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Активный</span>
                    <button className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"><Icon.edit /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'Склады' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Склады и поставщики</h3>
              <Btn size="sm"><Icon.plus /> Добавить склад</Btn>
            </div>
            <div className="space-y-2">
              {['Midea', 'Samsung', 'LG', 'Bosch', 'Haier', 'Общий'].map(w => (
                <div key={w} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">{w[0]}</div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{w}</p>
                      <p className="text-xs text-slate-500">Бишкек, ул. Чуй</p>
                    </div>
                  </div>
                  <button className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"><Icon.edit /></button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'Уведомления' && (
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Настройка уведомлений</h3>
            <div className="space-y-4">
              {[
                { label: 'Новый заказ', desc: 'Уведомлять при создании нового заказа' },
                { label: 'Товар заканчивается', desc: 'Когда остаток ниже минимального' },
                { label: 'Заказ доставлен', desc: 'При успешной доставке заказа' },
                { label: 'Возврат', desc: 'При оформлении возврата' },
                { label: 'Заявка на закуп', desc: 'При поступлении новой заявки' },
              ].map(n => (
                <div key={n.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{n.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                  </div>
                  <div className="w-10 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

interface Toast {
  id: number
  type: 'success' | 'warning' | 'error'
  message: string
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border max-w-xs pointer-events-auto
            ${t.type === 'success' ? 'bg-white border-green-200 text-green-800' :
              t.type === 'warning' ? 'bg-white border-yellow-200 text-yellow-800' :
              'bg-white border-red-200 text-red-800'}`}
        >
          <span className="text-base">
            {t.type === 'success' ? '✓' : t.type === 'warning' ? '⚠' : '✕'}
          </span>
          <span className="text-sm font-medium flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><Icon.x /></button>
        </div>
      ))}
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [toastCounter, setToastCounter] = useState(0)

  // Modals
  const [showNewSale, setShowNewSale] = useState(false)
  const [orderDetailId, setOrderDetailId] = useState<string | null>(null)
  const [returnOrderId, setReturnOrderId] = useState<string | null>(null)
  const [showUnavailable, setShowUnavailable] = useState(false)
  const [productDetailId, setProductDetailId] = useState<string | null>(null)
  const [courierDetailId, setCourierDetailId] = useState<string | null>(null)

  function addToast(type: Toast['type'], message: string) {
    const id = toastCounter + 1
    setToastCounter(id)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  function removeToast(id: number) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  function handleNewSaleSave() {
    setShowNewSale(false)
    addToast('success', 'Продажа успешно создана')
  }

  function handleReturn() {
    if (returnOrderId) {
      setReturnOrderId(null)
      if (orderDetailId) setOrderDetailId(null)
      addToast('success', 'Возврат оформлен')
    }
  }

  function handleUnavailableConfirm() {
    setShowUnavailable(false)
    addToast('warning', 'Статус заявки обновлён')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar current={page} onChange={setPage} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header page={page} />
        <main className="flex-1 overflow-y-auto">
          {page === 'dashboard' && (
            <Dashboard
              onNavigate={setPage}
              onOrderClick={id => { setOrderDetailId(id) }}
            />
          )}
          {page === 'sales' && (
            <SalesPage
              onOrderClick={id => setOrderDetailId(id)}
              onNewSale={() => setShowNewSale(true)}
            />
          )}
          {page === 'inventory' && (
            <InventoryPage onProductClick={id => setProductDetailId(id)} />
          )}
          {page === 'purchasing' && (
            <PurchasingPage onUnavailable={() => setShowUnavailable(true)} />
          )}
          {page === 'couriers' && (
            <CouriersPage onCourierClick={id => setCourierDetailId(id)} />
          )}
          {page === 'map' && (
            <MapPage onOrderClick={id => setOrderDetailId(id)} />
          )}
          {page === 'history' && <HistoryPage />}
          {page === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Modals */}
      {showNewSale && (
        <NewSaleModal onClose={() => setShowNewSale(false)} onSave={handleNewSaleSave} />
      )}
      {orderDetailId && (
        <OrderDetails
          orderId={orderDetailId}
          onClose={() => setOrderDetailId(null)}
          onReturn={() => { setReturnOrderId(orderDetailId) }}
        />
      )}
      {returnOrderId && (
        <ReturnModal
          orderId={returnOrderId}
          onClose={() => setReturnOrderId(null)}
          onConfirm={handleReturn}
        />
      )}
      {showUnavailable && (
        <UnavailableModal
          onClose={() => setShowUnavailable(false)}
          onConfirm={handleUnavailableConfirm}
        />
      )}
      {productDetailId && (
        <ProductDetails productId={productDetailId} onClose={() => setProductDetailId(null)} />
      )}
      {courierDetailId && (
        <CourierDetails
          courierId={courierDetailId}
          onClose={() => setCourierDetailId(null)}
          onOrderClick={id => { setCourierDetailId(null); setOrderDetailId(id) }}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
