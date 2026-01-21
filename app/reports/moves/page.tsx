'use client'

import Layout from '@/components/Layout'
import { useStore } from '@/store/useStore'
import { FileText, Search } from 'lucide-react'
import { useState } from 'react'

export default function MovesReportPage() {
  const { stockMoves, products, locations } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filteredMoves = stockMoves.filter((move) => {
    const product = products.find((p) => p.id === move.productId)
    const matchesSearch = !searchQuery || 
      product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      move.reference?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDateFrom = !dateFrom || move.date >= dateFrom
    const matchesDateTo = !dateTo || move.date <= dateTo
    return matchesSearch && matchesDateFrom && matchesDateTo
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const getStateLabel = (state: string) => {
    const states: Record<string, string> = {
      draft: 'مسودة',
      waiting: 'قيد الانتظار',
      assigned: 'معين',
      done: 'منفذ',
      cancel: 'ملغي',
    }
    return states[state] || state
  }

  const getStateColor = (state: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      waiting: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      done: 'bg-green-100 text-green-800',
      cancel: 'bg-red-100 text-red-800',
    }
    return colors[state] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">سجلات الحركة</h1>
          <p className="text-gray-600 mt-1">عرض جميع الحركات المخزنية</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البحث</label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="البحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">من تاريخ</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">إلى تاريخ</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('')
                  setDateFrom('')
                  setDateTo('')
                }}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                مسح
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">إجمالي الحركات</p>
                <p className="text-3xl font-bold text-gray-900">{filteredMoves.length}</p>
              </div>
              <div className="bg-blue-500 text-white p-3 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">منفذ</p>
                <p className="text-3xl font-bold text-green-600">
                  {filteredMoves.filter((m) => m.state === 'done').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">قيد الانتظار</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {filteredMoves.filter((m) => m.state === 'waiting' || m.state === 'assigned').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">مسودة</p>
                <p className="text-3xl font-bold text-gray-600">
                  {filteredMoves.filter((m) => m.state === 'draft').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكمية</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المصدر</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الوجهة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المرجع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMoves.map((move) => {
                const product = products.find((p) => p.id === move.productId)
                const sourceLocation = move.sourceLocationId ? locations.find((l) => l.id === move.sourceLocationId) : null
                const destLocation = move.destinationLocationId ? locations.find((l) => l.id === move.destinationLocationId) : null
                return (
                  <tr key={move.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product?.name || '-'}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${move.destinationLocationId ? 'text-green-600' : 'text-red-600'}`}>
                      {move.destinationLocationId ? '+' : '-'}{move.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sourceLocation?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{destLocation?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{move.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{move.reference || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStateColor(move.state)}`}>
                        {getStateLabel(move.state)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredMoves.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد حركات</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

