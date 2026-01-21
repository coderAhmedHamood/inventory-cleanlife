'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import { useStore } from '@/store/useStore'
import { Plus, Edit, CheckCircle, ClipboardCheck, XCircle } from 'lucide-react'

export default function InventoryCountPage() {
  const { inventoryCounts, locations, products, addInventoryCount, updateInventoryCount, getStockQuantity, addStockMove } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCount, setSelectedCount] = useState<any>(null)
  const [formData, setFormData] = useState({
    reference: '',
    locationId: '',
    date: new Date().toISOString().split('T')[0],
    lines: [] as any[],
  })
  const [currentLine, setCurrentLine] = useState({
    productId: '',
    countedQty: 0,
  })

  const handleAddLine = () => {
    if (currentLine.productId && formData.locationId) {
      const systemQty = getStockQuantity(currentLine.productId, formData.locationId)
      setFormData({
        ...formData,
        lines: [
          ...formData.lines,
          {
            id: `line-${Date.now()}`,
            ...currentLine,
            systemQty,
            difference: currentLine.countedQty - systemQty,
          },
        ],
      })
      setCurrentLine({ productId: '', countedQty: 0 })
    }
  }

  const handleRemoveLine = (index: number) => {
    setFormData({
      ...formData,
      lines: formData.lines.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const countId = selectedCount?.id || `count-${Date.now()}`
    if (selectedCount) {
      updateInventoryCount(countId, { ...formData, state: 'draft' })
    } else {
      addInventoryCount({
        id: countId,
        ...formData,
        state: 'draft',
      })
    }
    setIsModalOpen(false)
    setSelectedCount(null)
    setFormData({ reference: '', locationId: '', date: new Date().toISOString().split('T')[0], lines: [] })
  }

  const handleValidate = (count: any) => {
    // Create adjustment moves for differences
    const moveIds: string[] = []
    count.lines.forEach((line: any) => {
      if (line.difference !== 0) {
        const moveId = `move-${Date.now()}-${Math.random()}`
        moveIds.push(moveId)
        if (line.difference > 0) {
          // Increase stock
          addStockMove({
            id: moveId,
            productId: line.productId,
            quantity: Math.abs(line.difference),
            destinationLocationId: count.locationId,
            date: count.date,
            state: 'done',
            reference: `ADJ-${count.reference}`,
          })
        } else {
          // Decrease stock
          addStockMove({
            id: moveId,
            productId: line.productId,
            quantity: Math.abs(line.difference),
            sourceLocationId: count.locationId,
            date: count.date,
            state: 'done',
            reference: `ADJ-${count.reference}`,
          })
        }
      }
    })
    updateInventoryCount(count.id, { state: 'done' })
  }

  const getStateLabel = (state: string) => {
    const states: Record<string, string> = {
      draft: 'مسودة',
      in_progress: 'قيد التنفيذ',
      done: 'مكتمل',
      cancel: 'ملغي',
    }
    return states[state] || state
  }

  const getStateColor = (state: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      done: 'bg-green-100 text-green-800',
      cancel: 'bg-red-100 text-red-800',
    }
    return colors[state] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">الجرد المادي</h1>
            <p className="text-gray-600 mt-1">إدارة عمليات الجرد الفعلية للمخزون</p>
          </div>
          <button
            onClick={() => {
              setSelectedCount(null)
              setFormData({ reference: '', locationId: '', date: new Date().toISOString().split('T')[0], lines: [] })
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة جرد
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الرقم المرجعي</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموقع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد الأصناف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryCounts.map((count) => {
                const location = locations.find((l) => l.id === count.locationId)
                return (
                  <tr key={count.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{count.reference}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{count.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{count.lines.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStateColor(count.state)}`}>
                        {getStateLabel(count.state)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedCount(count)
                            setFormData({
                              reference: count.reference,
                              locationId: count.locationId,
                              date: count.date,
                              lines: count.lines,
                            })
                            setIsModalOpen(true)
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {count.state !== 'done' && (
                          <button
                            onClick={() => handleValidate(count)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {inventoryCounts.length === 0 && (
            <div className="text-center py-12">
              <ClipboardCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد عمليات جرد</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {selectedCount ? 'تعديل جرد' : 'إضافة جرد'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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

                {/* Add Line */}
                {formData.locationId && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-3">إضافة صنف للجرد</h3>
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">المنتج</label>
                        <select
                          value={currentLine.productId}
                          onChange={(e) => setCurrentLine({ ...currentLine, productId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">اختر منتج</option>
                          {products.filter((p) => p.type === 'stockable').map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الكمية المعدودة</label>
                        <input
                          type="number"
                          min="0"
                          value={currentLine.countedQty}
                          onChange={(e) => setCurrentLine({ ...currentLine, countedQty: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        {currentLine.productId && formData.locationId && (
                          <p className="text-xs text-gray-500 mt-1">
                            الكمية في النظام: {getStockQuantity(currentLine.productId, formData.locationId)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={handleAddLine}
                          className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          إضافة
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lines List */}
                {formData.lines.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-3">أصناف الجرد</h3>
                    <div className="space-y-2">
                      {formData.lines.map((line, index) => {
                        const product = products.find((p) => p.id === line.productId)
                        return (
                          <div key={line.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">{product?.name}</p>
                              <div className="grid grid-cols-3 gap-4 mt-1 text-sm">
                                <div>
                                  <span className="text-gray-500">النظام: </span>
                                  <span className="font-medium">{line.systemQty}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">المعدود: </span>
                                  <span className="font-medium">{line.countedQty}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">الفرق: </span>
                                  <span className={`font-bold ${line.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {line.difference >= 0 ? '+' : ''}{line.difference}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveLine(index)}
                              className="text-red-600 hover:text-red-900 mr-3"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-4 border-t">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {selectedCount ? 'تحديث' : 'إضافة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      setSelectedCount(null)
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

