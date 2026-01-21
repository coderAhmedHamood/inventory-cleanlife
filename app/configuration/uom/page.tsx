'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import { useStore } from '@/store/useStore'
import { Plus, Edit, Trash2, Ruler } from 'lucide-react'

export default function UOMPage() {
  const { unitsOfMeasure, addCategory, updateCategory } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUOM, setEditingUOM] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Unit',
    factor: 1,
    isBase: false,
  })

  const categories = ['Unit', 'Weight', 'Volume', 'Length', 'Time']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Note: This should add/update UOM, but we're using categories for now
    // You may need to add addUOM and updateUOM to useStore
    setIsModalOpen(false)
    setEditingUOM(null)
    setFormData({ name: '', category: 'Unit', factor: 1, isBase: false })
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">وحدات القياس</h1>
            <p className="text-gray-600 mt-1">إدارة وحدات القياس والتحويلات</p>
          </div>
          <button
            onClick={() => {
              setEditingUOM(null)
              setFormData({ name: '', category: 'Unit', factor: 1, isBase: false })
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة وحدة قياس
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unitsOfMeasure.map((uom) => (
            <div key={uom.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary-100 text-primary-600 p-3 rounded-lg">
                  <Ruler className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{uom.name}</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>الفئة: {uom.category}</p>
                <p>عامل التحويل: {uom.factor}</p>
                {uom.isBase && (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">وحدة أساسية</span>
                )}
              </div>
            </div>
          ))}
          {unitsOfMeasure.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Ruler className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد وحدات قياس</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                {editingUOM ? 'تعديل وحدة قياس' : 'إضافة وحدة قياس'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">عامل التحويل</label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={formData.factor}
                    onChange={(e) => setFormData({ ...formData, factor: parseFloat(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isBase}
                    onChange={(e) => setFormData({ ...formData, isBase: e.target.checked })}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">وحدة أساسية</label>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {editingUOM ? 'تحديث' : 'إضافة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditingUOM(null)
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

