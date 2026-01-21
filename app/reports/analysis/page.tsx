'use client'

import Layout from '@/components/Layout'
import { useStore } from '@/store/useStore'
import { BarChart3, TrendingUp, TrendingDown, Package } from 'lucide-react'
import { useMemo } from 'react'

export default function AnalysisPage() {
  const { stockMoves, products, locations } = useStore()

  const analysis = useMemo(() => {
    const doneMoves = stockMoves.filter((m) => m.state === 'done')
    
    // Top products by movement
    const productMovements = doneMoves.reduce((acc, move) => {
      if (!acc[move.productId]) {
        acc[move.productId] = { incoming: 0, outgoing: 0, product: products.find((p) => p.id === move.productId) }
      }
      if (move.destinationLocationId) {
        acc[move.productId].incoming += move.quantity
      }
      if (move.sourceLocationId) {
        acc[move.productId].outgoing += move.quantity
      }
      return acc
    }, {} as Record<string, any>)

    const topProducts = Object.entries(productMovements)
      .map(([id, data]: [string, any]) => ({
        id,
        product: data.product,
        total: data.incoming + data.outgoing,
        incoming: data.incoming,
        outgoing: data.outgoing,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)

    // Monthly trends
    const monthlyData = doneMoves.reduce((acc, move) => {
      const month = move.date.substring(0, 7) // YYYY-MM
      if (!acc[month]) {
        acc[month] = { incoming: 0, outgoing: 0 }
      }
      if (move.destinationLocationId) {
        acc[month].incoming += move.quantity
      }
      if (move.sourceLocationId) {
        acc[month].outgoing += move.quantity
      }
      return acc
    }, {} as Record<string, any>)

    const monthlyTrends = Object.entries(monthlyData)
      .map(([month, data]: [string, any]) => ({
        month,
        incoming: data.incoming,
        outgoing: data.outgoing,
        net: data.incoming - data.outgoing,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Location analysis
    const locationData = doneMoves.reduce((acc, move) => {
      if (move.destinationLocationId) {
        const loc = locations.find((l) => l.id === move.destinationLocationId)
        if (loc) {
          acc[loc.name] = (acc[loc.name] || 0) + move.quantity
        }
      }
      if (move.sourceLocationId) {
        const loc = locations.find((l) => l.id === move.sourceLocationId)
        if (loc) {
          acc[loc.name] = (acc[loc.name] || 0) - move.quantity
        }
      }
      return acc
    }, {} as Record<string, number>)

    return {
      topProducts,
      monthlyTrends,
      locationData,
      totalMoves: doneMoves.length,
      totalIncoming: doneMoves.filter((m) => m.destinationLocationId).reduce((sum, m) => sum + m.quantity, 0),
      totalOutgoing: doneMoves.filter((m) => m.sourceLocationId).reduce((sum, m) => sum + m.quantity, 0),
    }
  }, [stockMoves, products, locations])

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">تحليل الحركة</h1>
          <p className="text-gray-600 mt-1">تحليل شامل لحركات المخزون</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">إجمالي الحركات</p>
                <p className="text-3xl font-bold text-gray-900">{analysis.totalMoves}</p>
              </div>
              <div className="bg-blue-500 text-white p-3 rounded-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">إجمالي الوارد</p>
                <p className="text-3xl font-bold text-green-600">{analysis.totalIncoming}</p>
              </div>
              <div className="bg-green-500 text-white p-3 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">إجمالي الصادر</p>
                <p className="text-3xl font-bold text-red-600">{analysis.totalOutgoing}</p>
              </div>
              <div className="bg-red-500 text-white p-3 rounded-lg">
                <TrendingDown className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">صافي الحركة</p>
                <p className={`text-3xl font-bold ${analysis.totalIncoming - analysis.totalOutgoing >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analysis.totalIncoming - analysis.totalOutgoing}
                </p>
              </div>
              <div className="bg-purple-500 text-white p-3 rounded-lg">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">أكثر المنتجات حركة</h2>
            <div className="space-y-3">
              {analysis.topProducts.length > 0 ? (
                analysis.topProducts.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.product?.name || 'منتج غير معروف'}</p>
                        <p className="text-sm text-gray-500">وارد: {item.incoming} | صادر: {item.outgoing}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">{item.total}</p>
                      <p className="text-xs text-gray-500">إجمالي</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">لا توجد بيانات</p>
              )}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">الاتجاه الشهري</h2>
            <div className="space-y-3">
              {analysis.monthlyTrends.length > 0 ? (
                analysis.monthlyTrends.map((trend) => (
                  <div key={trend.month} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{trend.month}</p>
                      <p className={`font-bold ${trend.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.net >= 0 ? '+' : ''}{trend.net}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">وارد</p>
                        <p className="font-medium text-green-600">{trend.incoming}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">صادر</p>
                        <p className="font-medium text-red-600">{trend.outgoing}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">لا توجد بيانات</p>
              )}
            </div>
          </div>
        </div>

        {/* Location Analysis */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">تحليل المواقع</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(analysis.locationData).map(([location, balance]) => (
              <div key={location} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 mb-1">{location}</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {balance >= 0 ? '+' : ''}{balance}
                </p>
                <p className="text-xs text-gray-500 mt-1">صافي الرصيد</p>
              </div>
            ))}
            {Object.keys(analysis.locationData).length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-4">لا توجد بيانات</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

