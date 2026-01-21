'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import { useStore } from '@/store/useStore'
import { Plus, Edit, Trash2, ClipboardList } from 'lucide-react'

export default function OperationTypesPage() {
  const { operationTypes, locations, addOperationType, updateOperationType, deleteOperationType } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingType, setEditingType] = useState<any>(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'receipt' as const,
    sourceLocationId: '',
    destinationLocationId: '',
  })

  const typeOptions = [
    { value: 'receipt', label: 'استلام' },
    { value: 'delivery', label: 'صرف' },
    { value: 'internal', label: 'تحويل داخلي' },
    { value: 'adjustment', label: 'تسوية' },
    { value: 'scrap', label: 'هالك' },
    { value: 'production', label: 'إنتاج' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingType) {
      updateOperationType(editingType.id, formData)
    } else {
      addOperationType({
        id: `op-${Date.now()}`,
        ...formData,
      })
    }
    setIsModalOpen(false)
    setEditingType(null)
    setFormData({ code: '', name: '', type: 'receipt', sourceLocationId: '', destinationLocationId: '' })
  }

  const handleEdit = (type: any) => {
    setEditingType(type)
    setFormData({
      code: type.code,
      name: type.name,
      type: type.type,
      sourceLocationId: type.sourceLocationId || '',
      destinationLocationId: type.destinationLocationId || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف نوع العملية؟')) {
      deleteOperationType(id)
    }
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">أنواع العمليات</h1>
            <p className="text-gray-600 mt-1">إدارة أنواع العمليات المخزنية</p>
          </div>
          <button
            onClick={() => {
              setEditingType(null)
              setFormData({ code: '', name: '', type: 'receipt', sourceLocationId: '', destinationLocationId: '' })
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة نوع عملية
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكود</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النوع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموقع المصدر</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الموقع الوجهة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {operationTypes.map((type) => {
                const sourceLocation = type.sourceLocationId ? locations.find((l) => l.id === type.sourceLocationId) : null
                const destLocation = type.destinationLocationId ? locations.find((l) => l.id === type.destinationLocationId) : null
                const typeLabel = typeOptions.find((t) => t.value === type.type)?.label
                return (
                  <tr key={type.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{type.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{type.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{typeLabel}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sourceLocation?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{destLocation?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(type)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(type.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {operationTypes.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد أنواع عمليات</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                {editingType ? 'تعديل نوع عملية' : 'إضافة نوع عملية'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الكود</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {typeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الموقع المصدر (اختياري)</label>
                  <select
                    value={formData.sourceLocationId}
                    onChange={(e) => setFormData({ ...formData, sourceLocationId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">بدون</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الموقع الوجهة (اختياري)</label>
                  <select
                    value={formData.destinationLocationId}
                    onChange={(e) => setFormData({ ...formData, destinationLocationId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">بدون</option>
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {editingType ? 'تحديث' : 'إضافة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditingType(null)
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

