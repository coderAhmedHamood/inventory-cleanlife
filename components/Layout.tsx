'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Settings,
  Package,
  ArrowLeftRight,
  FileText,
  BarChart3,
  Warehouse,
  MapPin,
  Tag,
  Ruler,
  Users,
  ClipboardList,
  Box,
  Truck,
  PackageSearch,
  AlertCircle,
} from 'lucide-react'
import { useStore } from '@/store/useStore'

interface MenuItem {
  id: string
  label: string
  icon: ReactNode
  path: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'لوحة التحكم',
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: '/dashboard',
  },
  {
    id: 'operations',
    label: 'العمليات',
    icon: <ClipboardList className="w-5 h-5" />,
    path: '/operations',
    children: [
      { id: 'receipts', label: 'الإيصالات', icon: <Box className="w-4 h-4" />, path: '/operations/receipts' },
      { id: 'deliveries', label: 'التوصيل', icon: <Truck className="w-4 h-4" />, path: '/operations/deliveries' },
      { id: 'transfers', label: 'التحويلات', icon: <ArrowLeftRight className="w-4 h-4" />, path: '/operations/transfers' },
      { id: 'adjustments', label: 'التسويات', icon: <PackageSearch className="w-4 h-4" />, path: '/operations/adjustments' },
      { id: 'scrap', label: 'الهالك', icon: <AlertCircle className="w-4 h-4" />, path: '/operations/scrap' },
    ],
  },
  {
    id: 'products',
    label: 'المنتجات',
    icon: <Package className="w-5 h-5" />,
    path: '/products',
  },
  {
    id: 'reports',
    label: 'التقارير',
    icon: <BarChart3 className="w-5 h-5" />,
    path: '/reports',
    children: [
      { id: 'stock', label: 'المخزون', icon: <Warehouse className="w-4 h-4" />, path: '/reports/stock' },
      { id: 'moves', label: 'سجلات الحركة', icon: <FileText className="w-4 h-4" />, path: '/reports/moves' },
      { id: 'analysis', label: 'تحليل الحركة', icon: <BarChart3 className="w-4 h-4" />, path: '/reports/analysis' },
    ],
  },
  {
    id: 'configuration',
    label: 'الإعدادات',
    icon: <Settings className="w-5 h-5" />,
    path: '/configuration',
    children: [
      { id: 'warehouses', label: 'المستودعات', icon: <Warehouse className="w-4 h-4" />, path: '/configuration/warehouses' },
      { id: 'locations', label: 'المواقع', icon: <MapPin className="w-4 h-4" />, path: '/configuration/locations' },
      { id: 'categories', label: 'الفئات', icon: <Tag className="w-4 h-4" />, path: '/configuration/categories' },
      { id: 'uom', label: 'وحدات القياس', icon: <Ruler className="w-4 h-4" />, path: '/configuration/uom' },
      { id: 'operation-types', label: 'أنواع العمليات', icon: <ClipboardList className="w-4 h-4" />, path: '/configuration/operation-types' },
      { id: 'partners', label: 'الشركاء', icon: <Users className="w-4 h-4" />, path: '/configuration/partners' },
    ],
  },
]

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { currentUser, initializeDemoData, warehouses } = useStore()

  useEffect(() => {
    if (warehouses.length === 0) {
      initializeDemoData()
    }
  }, [warehouses.length, initializeDemoData])

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-full bg-white border-l border-gray-200 transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h1 className="text-xl font-bold text-primary-600">نظام المخازن</h1>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.children ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 text-gray-700 font-medium">
                      {item.icon}
                      {sidebarOpen && <span>{item.label}</span>}
                    </div>
                    {sidebarOpen && (
                      <div className="mr-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive(child.path)
                                ? 'bg-primary-50 text-primary-600'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {child.icon}
                            <span>{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    {sidebarOpen && <span>{item.label}</span>}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Info */}
          {sidebarOpen && currentUser && (
            <div className="p-4 border-t border-gray-200">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {currentUser.role === 'admin' && 'مدير النظام'}
                  {currentUser.role === 'warehouse_manager' && 'مدير مخازن'}
                  {currentUser.role === 'accountant' && 'محاسب'}
                  {currentUser.role === 'supervisor' && 'مشرف'}
                  {currentUser.role === 'user' && 'مستخدم'}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? 'mr-64' : 'mr-20'
        }`}
      >
        {children}
      </main>
    </div>
  )
}

