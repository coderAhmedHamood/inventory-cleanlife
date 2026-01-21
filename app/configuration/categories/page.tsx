'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import { useStore } from '@/store/useStore'
import { Plus, Edit, Tag } from 'lucide-react'

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    valuationMethod: 'fifo' as const,
    costingMethod: 'fifo' as const,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategory) {
      updateCategory(editingCategory.id, formData)
    } else {
      addCategory({
        id: `cat-${Date.now()}`,
        ...formData,
      })
    }
    setIsModalOpen(false)
    setEditingCategory(null)
    setFormData({ code: '', name: '', valuationMethod: 'fifo', costingMethod: 'fifo' })
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">فئات المنتجات</h1>
            <p className="text-gray-600 mt-1">إدارة فئات المنتجات</p>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null)
              setFormData({ code: '', name: '', valuationMethod: 'fifo', costingMethod: 'fifo' })
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            إضافة فئة
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-primary-100 text-primary-600 p-3 rounded-lg">
                  <Tag className="w-6 h-6" />
                </div>
                <button
                  onClick={() => {
                    setEditingCategory(category)
                    setFormData({
                      code: category.code,
                      name: category.name,
                      valuationMethod: category.valuationMethod,
                      costingMethod: category.costingMethod,
                    })
                    setIsModalOpen(true)
                  }}
                  className="text-primary-600 hover:text-primary-900"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500 mb-2">الكود: {category.code}</p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>طريقة التقييم: {category.valuationMethod.toUpperCase()}</p>
                <p>طريقة التكلفة: {category.costingMethod.toUpperCase()}</p>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد فئات</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                {editingCategory ? 'تعديل فئة' : 'إضافة فئة'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">طريقة التقييم</label>
                  <select
                    required
                    value={formData.valuationMethod}
                    onChange={(e) => setFormData({ ...formData, valuationMethod: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="fifo">FIFO</option>
                    <option value="avco">AVCO</option>
                    <option value="standard">Standard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">طريقة التكلفة</label>
                  <select
                    required
                    value={formData.costingMethod}
                    onChange={(e) => setFormData({ ...formData, costingMethod: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="fifo">FIFO</option>
                    <option value="avco">AVCO</option>
                    <option value="standard">Standard</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {editingCategory ? 'تحديث' : 'إضافة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditingCategory(null)
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

