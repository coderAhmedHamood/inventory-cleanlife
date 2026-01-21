'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import { useStore } from '@/store/useStore'
import { Plus, Edit, CheckCircle, XCircle, Box } from 'lucide-react'

export default function ReceiptsPage() {
  const { receipts, partners, locations, products, addReceipt, updateReceipt, addStockMove, updateStockMove } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null)
  const [formData, setFormData] = useState({
    reference: '',
    partnerId: '',
    date: new Date().toISOString().split('T')[0],
    moves: [] as any[],
  })
  const [currentMove, setCurrentMove] = useState({
    productId: '',
    quantity: 0,
    destinationLocationId: '',
  })

  const handleAddMove = () => {
    if (currentMove.productId && currentMove.quantity > 0 && currentMove.destinationLocationId) {
      setFormData({
        ...formData,
        moves: [...formData.moves, { ...currentMove, id: `move-${Date.now()}` }],
      })
      setCurrentMove({ productId: '', quantity: 0, destinationLocationId: '' })
    }
  }

  const handleRemoveMove = (index: number) => {
    setFormData({
      ...formData,
      moves: formData.moves.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const moveIds: string[] = []
    formData.moves.forEach((move) => {
      const moveId = `move-${Date.now()}-${Math.random()}`
      moveIds.push(moveId)
      addStockMove({
        id: moveId,
        productId: move.productId,
        quantity: move.quantity,
        destinationLocationId: move.destinationLocationId,
        date: formData.date,
        state: formData.moves.length > 0 ? 'draft' : 'draft',
        reference: formData.reference,
      })
    })

    const receiptId = selectedReceipt?.id || `rec-${Date.now()}`
    if (selectedReceipt) {
      updateReceipt(receiptId, { ...formData, moves: moveIds })
    } else {
      addReceipt({
        id: receiptId,
        ...formData,
        moves: moveIds,
        state: 'draft',
      })
    }
    setIsModalOpen(false)
    setSelectedReceipt(null)
    setFormData({ reference: '', partnerId: '', date: new Date().toISOString().split('T')[0], moves: [] })
  }

  const handleConfirm = (receipt: any) => {
    // Update all moves to done state
    receipt.moves.forEach((moveId: string) => {
      updateStockMove(moveId, { state: 'done' })
    })
    updateReceipt(receipt.id, { state: 'done' })
  }

  const getStateLabel = (state: string) => {
    const states: Record<string, string> = {
      draft: 'مسودة',
      waiting: 'قيد الانتظار',
      ready: 'جاهز',
      done: 'منفذ',
      cancel: 'ملغي',
    }
    return states[state] || state
  }

  const getStateColor = (state: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      waiting: 'bg-yellow-100 text-yellow-800',
      ready: 'bg-blue-100 text-blue-800',
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
            <h1 className="text-3xl font-bold text-gray-900">الإيصالات</h1>
            <p className="text-gray-600 mt-1">إدارة إيصالات الاستلام</p>
          </div>
          <button
            onClick={() => {
              setSelectedReceipt(null)
              setFormData({ reference: '', partnerId: '', date: new Date().toISOString().split('T')[0], moves: [] })
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة إيصال
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الرقم المرجعي</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المورد</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد الحركات</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {receipts.map((receipt) => {
                const partner = partners.find((p) => p.id === receipt.partnerId)
                return (
                  <tr key={receipt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{receipt.reference}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{partner?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{receipt.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{receipt.moves.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStateColor(receipt.state)}`}>
                        {getStateLabel(receipt.state)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedReceipt(receipt)
                            setFormData({
                              reference: receipt.reference,
                              partnerId: receipt.partnerId || '',
                              date: receipt.date,
                              moves: [],
                            })
                            setIsModalOpen(true)
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {receipt.state !== 'done' && (
                          <button
                            onClick={() => handleConfirm(receipt)}
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
          {receipts.length === 0 && (
            <div className="text-center py-12">
              <Box className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد إيصالات</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {selectedReceipt ? 'تعديل إيصال' : 'إضافة إيصال'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">المورد</label>
                    <select
                      value={formData.partnerId}
                      onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">اختر مورد</option>
                      {partners.filter((p) => p.type === 'vendor').map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
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

                {/* Add Move */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">إضافة حركة</h3>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">المنتج</label>
                      <select
                        value={currentMove.productId}
                        onChange={(e) => setCurrentMove({ ...currentMove, productId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">اختر منتج</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الكمية</label>
                      <input
                        type="number"
                        min="1"
                        value={currentMove.quantity}
                        onChange={(e) => setCurrentMove({ ...currentMove, quantity: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">الموقع الوجهة</label>
                      <select
                        value={currentMove.destinationLocationId}
                        onChange={(e) => setCurrentMove({ ...currentMove, destinationLocationId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">اختر موقع</option>
                        {locations.map((l) => (
                          <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMove}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    إضافة حركة
                  </button>
                </div>

                {/* Moves List */}
                {formData.moves.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-3">الحركات</h3>
                    <div className="space-y-2">
                      {formData.moves.map((move, index) => {
                        const product = products.find((p) => p.id === move.productId)
                        const location = locations.find((l) => l.id === move.destinationLocationId)
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{product?.name}</p>
                              <p className="text-sm text-gray-500">الكمية: {move.quantity} - الموقع: {location?.name}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveMove(index)}
                              className="text-red-600 hover:text-red-900"
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
                    {selectedReceipt ? 'تحديث' : 'إضافة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      setSelectedReceipt(null)
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

