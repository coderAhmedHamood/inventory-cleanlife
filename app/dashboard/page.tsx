'use client'

import { useEffect } from 'react'
import Layout from '@/components/Layout'
import { useStore } from '@/store/useStore'
import { Package, ArrowUpCircle, ArrowDownCircle, AlertTriangle, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const {
    products,
    receipts,
    deliveryOrders,
    stockMoves,
    warehouses,
    getStockQuantity,
    initializeDemoData,
  } = useStore()

  useEffect(() => {
    if (products.length === 0) {
      initializeDemoData()
    }
  }, [products.length, initializeDemoData])

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.isActive).length
  const totalWarehouses = warehouses.length

  const pendingReceipts = receipts.filter((r) => r.state !== 'done').length
  const pendingDeliveries = deliveryOrders.filter((d) => d.state !== 'done').length

  const recentMoves = stockMoves.slice(-10).reverse()

  const lowStockProducts = products.filter((p) => {
    const stock = getStockQuantity(p.id)
    return stock < 10 && p.type === 'stockable'
  })

  const stats = [
    {
      title: 'إجمالي المنتجات',
      value: totalProducts,
      icon: <Package className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'المنتجات النشطة',
      value: activeProducts,
      icon: <Package className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'المستودعات',
      value: totalWarehouses,
      icon: <Package className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'إيصالات قيد الانتظار',
      value: pendingReceipts,
      icon: <ArrowDownCircle className="w-6 h-6" />,
      color: 'bg-orange-500',
    },
    {
      title: 'طلبات توصيل قيد الانتظار',
      value: pendingDeliveries,
      icon: <ArrowUpCircle className="w-6 h-6" />,
      color: 'bg-red-500',
    },
    {
      title: 'منتجات منخفضة المخزون',
      value: lowStockProducts.length,
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'bg-yellow-500',
    },
  ]

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600 mt-1">نظرة عامة على نظام المخازن</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Moves */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">آخر الحركات</h2>
            <div className="space-y-3">
              {recentMoves.length > 0 ? (
                recentMoves.map((move) => {
                  const product = products.find((p) => p.id === move.productId)
                  return (
                    <div
                      key={move.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{product?.name || 'منتج غير معروف'}</p>
                        <p className="text-sm text-gray-500">{move.reference || move.id}</p>
                      </div>
                      <div className="text-left">
                        <p className={`font-bold ${move.destinationLocationId ? 'text-green-600' : 'text-red-600'}`}>
                          {move.destinationLocationId ? '+' : '-'}{move.quantity}
                        </p>
                        <p className="text-xs text-gray-500">{move.date}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-500 text-center py-4">لا توجد حركات حديثة</p>
              )}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">تنبيهات المخزون المنخفض</h2>
            <div className="space-y-3">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => {
                  const stock = getStockQuantity(product.id)
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.code}</p>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-yellow-600">{stock}</p>
                        <p className="text-xs text-gray-500">كمية متبقية</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-500 text-center py-4">لا توجد منتجات منخفضة المخزون</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

