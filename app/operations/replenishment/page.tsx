'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import { useStore } from '@/store/useStore'
import { Plus, Edit, RefreshCw } from 'lucide-react'

export default function ReplenishmentPage() {
  const { replenishments, products, locations, addReplenishment, updateReplenishment } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReplenishment, setSelectedReplenishment] = useState<any>(null)
  const [formData, setFormData] = useState({
    reference: '',
    productId: '',
    locationId: '',
    requestedQty: 0,
    expectedDate: '',
    date: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const replenishmentId = selectedReplenishment?.id || `rep-${Date.now()}`
    if (selectedReplenishment) {
      updateReplenishment(replenishmentId, {
        ...formData,
        orderedQty: formData.requestedQty,
      })
    } else {
      addReplenishment({
        id: replenishmentId,
        ...formData,
        orderedQty: 0,
        receivedQty: 0,
        state: 'draft',
      })
    }
    setIsModalOpen(false)
    setSelectedReplenishment(null)
    setFormData({ reference: '', productId: '', locationId: '', requestedQty: 0, expectedDate: '', date: new Date().toISOString().split('T')[0] })
  }

  const getStateLabel = (state: string) => {
    const states: Record<string, string> = {
      draft: 'مسودة',
      ordered: 'مطلوب',
      received: 'مستلم',
      done: 'مكتمل',
    }
    return states[state] || state
  }

  const getStateColor = (state: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      ordered: 'bg-yellow-100 text-yellow-800',
      received: 'bg-blue-100 text-blue-800',
      done: 'bg-green-100 text-green-800',
    }
    return colors[state] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تجديد المخزون</h1>
            <p className="text-gray-600 mt-1">إدارة طلبات تجديد المخزون</p>
          </div>
          <button
            onClick={() => {
              setSelectedReplenishment(null)
              setFormData({ reference: '', productId: '', locationId: '', requestedQty: 0, expectedDate: '', date: new Date().toISOString().split('T')[0] })
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة طلب تجديد
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الرقم المرجعي</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموقع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكمية المطلوبة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكمية المستلمة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ المتوقع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {replenishments.map((rep) => {
                const product = products.find((p) => p.id === rep.productId)
                const location = locations.find((l) => l.id === rep.locationId)
                return (
                  <tr key={rep.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rep.reference}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rep.requestedQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rep.receivedQty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rep.expectedDate || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStateColor(rep.state)}`}>
                        {getStateLabel(rep.state)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedReplenishment(rep)
                          setFormData({
                            reference: rep.reference,
                            productId: rep.productId,
                            locationId: rep.locationId,
                            requestedQty: rep.requestedQty,
                            expectedDate: rep.expectedDate || '',
                            date: rep.date,
                          })
                          setIsModalOpen(true)
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {replenishments.length === 0 && (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد طلبات تجديد</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                {selectedReplenishment ? 'تعديل طلب تجديد' : 'إضافة طلب تجديد'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الرقم المرجعي</label>
                  <input
                    type="text"
                    required
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المنتج</label>
                  <select
                    required
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">اختر منتج</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الموقع</label>
                  <select
                    required
                    value={formData.locationId}
                    onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">اختر موقع</option>
                    {locations.filter((l) => l.type === 'internal').map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الكمية المطلوبة</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.requestedQty}
                    onChange={(e) => setFormData({ ...formData, requestedQty: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ المتوقع</label>
                  <input
                    type="date"
                    value={formData.expectedDate}
                    onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {selectedReplenishment ? 'تحديث' : 'إضافة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      setSelectedReplenishment(null)
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

