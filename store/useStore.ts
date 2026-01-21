import { create } from 'zustand'

// Types
export interface Warehouse {
  id: string
  code: string
  name: string
  address?: string
  isActive: boolean
}

export interface Location {
  id: string
  code: string
  name: string
  warehouseId: string
  type: 'internal' | 'vendor' | 'customer' | 'inventory' | 'production' | 'scrap'
  isActive: boolean
}

export interface ProductCategory {
  id: string
  code: string
  name: string
  parentId?: string
  valuationMethod: 'fifo' | 'avco' | 'standard'
  costingMethod: 'fifo' | 'avco' | 'standard'
}

export interface UnitOfMeasure {
  id: string
  name: string
  category: string
  factor: number
  isBase: boolean
}

export interface Product {
  id: string
  code: string
  name: string
  categoryId: string
  type: 'stockable' | 'consumable' | 'service'
  barcode?: string
  tracking: 'none' | 'lot' | 'serial'
  uomId: string
  routeIds: string[]
  isActive: boolean
  reorderingRules?: ReorderingRule[]
}

export interface ReorderingRule {
  id: string
  productId: string
  locationId: string
  minQty: number
  maxQty: number
  qtyMultiple: number
}

export interface LotSerial {
  id: string
  number: string
  productId: string
  type: 'lot' | 'serial'
  expiryDate?: string
  quantity?: number
}

export interface StockMove {
  id: string
  productId: string
  quantity: number
  sourceLocationId?: string
  destinationLocationId?: string
  lotSerialId?: string
  date: string
  state: 'draft' | 'waiting' | 'assigned' | 'done' | 'cancel'
  reference?: string
  operationTypeId?: string
}

export interface Receipt {
  id: string
  reference: string
  partnerId?: string
  state: 'draft' | 'waiting' | 'ready' | 'done' | 'cancel'
  date: string
  moves: string[]
}

export interface DeliveryOrder {
  id: string
  reference: string
  partnerId?: string
  state: 'draft' | 'ready' | 'done' | 'cancel'
  date: string
  moves: string[]
}

export interface InventoryAdjustment {
  id: string
  reference: string
  locationId: string
  state: 'draft' | 'done' | 'cancel'
  date: string
  moves: string[]
}

export interface InventoryCount {
  id: string
  reference: string
  locationId: string
  state: 'draft' | 'in_progress' | 'done' | 'cancel'
  date: string
  lines: InventoryCountLine[]
}

export interface InventoryCountLine {
  id: string
  productId: string
  systemQty: number
  countedQty: number
  difference: number
}

export interface ScrapOrder {
  id: string
  reference: string
  locationId: string
  state: 'draft' | 'done' | 'cancel'
  date: string
  moves: string[]
  reason?: string
}

export interface Replenishment {
  id: string
  reference: string
  productId: string
  locationId: string
  requestedQty: number
  orderedQty: number
  receivedQty: number
  state: 'draft' | 'ordered' | 'received' | 'done'
  date: string
  expectedDate?: string
}

export interface Partner {
  id: string
  code: string
  name: string
  type: 'vendor' | 'customer'
  address?: string
  phone?: string
  email?: string
}

export interface OperationType {
  id: string
  code: string
  name: string
  type: 'receipt' | 'delivery' | 'internal' | 'adjustment' | 'scrap' | 'production'
  sourceLocationId?: string
  destinationLocationId?: string
}

export interface User {
  id: string
  name: string
  role: 'admin' | 'warehouse_manager' | 'accountant' | 'supervisor' | 'user'
  permissions: string[]
}

interface StoreState {
  // Data
  warehouses: Warehouse[]
  locations: Location[]
  products: Product[]
  categories: ProductCategory[]
  unitsOfMeasure: UnitOfMeasure[]
  lotsSerials: LotSerial[]
  stockMoves: StockMove[]
  receipts: Receipt[]
  deliveryOrders: DeliveryOrder[]
  inventoryAdjustments: InventoryAdjustment[]
  inventoryCounts: InventoryCount[]
  scrapOrders: ScrapOrder[]
  replenishments: Replenishment[]
  partners: Partner[]
  operationTypes: OperationType[]
  users: User[]
  currentUser: User | null

  // Actions
  setCurrentUser: (user: User | null) => void
  addWarehouse: (warehouse: Warehouse) => void
  updateWarehouse: (id: string, warehouse: Partial<Warehouse>) => void
  deleteWarehouse: (id: string) => void
  addLocation: (location: Location) => void
  updateLocation: (id: string, location: Partial<Location>) => void
  deleteLocation: (id: string) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addCategory: (category: ProductCategory) => void
  updateCategory: (id: string, category: Partial<ProductCategory>) => void
  addStockMove: (move: StockMove) => void
  updateStockMove: (id: string, move: Partial<StockMove>) => void
  addReceipt: (receipt: Receipt) => void
  updateReceipt: (id: string, receipt: Partial<Receipt>) => void
  addDeliveryOrder: (order: DeliveryOrder) => void
  updateDeliveryOrder: (id: string, order: Partial<DeliveryOrder>) => void
  addInventoryAdjustment: (adjustment: InventoryAdjustment) => void
  updateInventoryAdjustment: (id: string, adjustment: Partial<InventoryAdjustment>) => void
  addInventoryCount: (count: InventoryCount) => void
  updateInventoryCount: (id: string, count: Partial<InventoryCount>) => void
  addScrapOrder: (order: ScrapOrder) => void
  updateScrapOrder: (id: string, order: Partial<ScrapOrder>) => void
  addReplenishment: (replenishment: Replenishment) => void
  updateReplenishment: (id: string, replenishment: Partial<Replenishment>) => void
  addPartner: (partner: Partner) => void
  updatePartner: (id: string, partner: Partial<Partner>) => void
  deletePartner: (id: string) => void
  addOperationType: (type: OperationType) => void
  updateOperationType: (id: string, type: Partial<OperationType>) => void
  deleteOperationType: (id: string) => void
  getStockQuantity: (productId: string, locationId?: string) => number
  initializeDemoData: () => void
}

export const useStore = create<StoreState>()(
    (set, get) => ({
      // Initial State
      warehouses: [],
      locations: [],
      products: [],
      categories: [],
      unitsOfMeasure: [],
      lotsSerials: [],
      stockMoves: [],
      receipts: [],
      deliveryOrders: [],
      inventoryAdjustments: [],
      partners: [],
      operationTypes: [],
      users: [],
      currentUser: null,

      // Actions
      setCurrentUser: (user) => set({ currentUser: user }),

      addWarehouse: (warehouse) =>
        set((state) => ({
          warehouses: [...state.warehouses, warehouse],
        })),

      updateWarehouse: (id, updates) =>
        set((state) => ({
          warehouses: state.warehouses.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        })),

      deleteWarehouse: (id) =>
        set((state) => ({
          warehouses: state.warehouses.filter((w) => w.id !== id),
        })),

      addLocation: (location) =>
        set((state) => ({
          locations: [...state.locations, location],
        })),

      updateLocation: (id, updates) =>
        set((state) => ({
          locations: state.locations.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
        })),

      deleteLocation: (id) =>
        set((state) => ({
          locations: state.locations.filter((l) => l.id !== id),
        })),

      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product],
        })),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, category],
        })),

      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      addStockMove: (move) =>
        set((state) => ({
          stockMoves: [...state.stockMoves, move],
        })),

      updateStockMove: (id, updates) =>
        set((state) => ({
          stockMoves: state.stockMoves.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),

      addReceipt: (receipt) =>
        set((state) => ({
          receipts: [...state.receipts, receipt],
        })),

      updateReceipt: (id, updates) =>
        set((state) => ({
          receipts: state.receipts.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      addDeliveryOrder: (order) =>
        set((state) => ({
          deliveryOrders: [...state.deliveryOrders, order],
        })),

      updateDeliveryOrder: (id, updates) =>
        set((state) => ({
          deliveryOrders: state.deliveryOrders.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          ),
        })),

      addInventoryAdjustment: (adjustment) =>
        set((state) => ({
          inventoryAdjustments: [...state.inventoryAdjustments, adjustment],
        })),

      updateInventoryAdjustment: (id, updates) =>
        set((state) => ({
          inventoryAdjustments: state.inventoryAdjustments.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      addInventoryCount: (count) =>
        set((state) => ({
          inventoryCounts: [...state.inventoryCounts, count],
        })),

      updateInventoryCount: (id, updates) =>
        set((state) => ({
          inventoryCounts: state.inventoryCounts.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      addScrapOrder: (order) =>
        set((state) => ({
          scrapOrders: [...state.scrapOrders, order],
        })),

      updateScrapOrder: (id, updates) =>
        set((state) => ({
          scrapOrders: state.scrapOrders.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          ),
        })),

      addReplenishment: (replenishment) =>
        set((state) => ({
          replenishments: [...state.replenishments, replenishment],
        })),

      updateReplenishment: (id, updates) =>
        set((state) => ({
          replenishments: state.replenishments.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      addPartner: (partner) =>
        set((state) => ({
          partners: [...state.partners, partner],
        })),

      updatePartner: (id, updates) =>
        set((state) => ({
          partners: state.partners.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deletePartner: (id) =>
        set((state) => ({
          partners: state.partners.filter((p) => p.id !== id),
        })),

      addOperationType: (type) =>
        set((state) => ({
          operationTypes: [...state.operationTypes, type],
        })),

      updateOperationType: (id, updates) =>
        set((state) => ({
          operationTypes: state.operationTypes.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteOperationType: (id) =>
        set((state) => ({
          operationTypes: state.operationTypes.filter((t) => t.id !== id),
        })),

      getStockQuantity: (productId, locationId) => {
        const state = get()
        const moves = state.stockMoves.filter((m) => m.productId === productId)

        if (locationId) {
          const incoming = moves
            .filter((m) => m.destinationLocationId === locationId && m.state === 'done')
            .reduce((sum, m) => sum + m.quantity, 0)
          const outgoing = moves
            .filter((m) => m.sourceLocationId === locationId && m.state === 'done')
            .reduce((sum, m) => sum + m.quantity, 0)
          return incoming - outgoing
        }

        const incoming = moves
          .filter((m) => m.destinationLocationId && m.state === 'done')
          .reduce((sum, m) => sum + m.quantity, 0)
        const outgoing = moves
          .filter((m) => m.sourceLocationId && m.state === 'done')
          .reduce((sum, m) => sum + m.quantity, 0)
        return incoming - outgoing
      },

      initializeDemoData: () => {
        // This will be called on first load
        const demoData = getDemoData()
        set({
          warehouses: demoData.warehouses,
          locations: demoData.locations,
          products: demoData.products,
          categories: demoData.categories,
          unitsOfMeasure: demoData.unitsOfMeasure,
          lotsSerials: demoData.lotsSerials,
          stockMoves: demoData.stockMoves,
          receipts: demoData.receipts,
          deliveryOrders: demoData.deliveryOrders,
          inventoryAdjustments: demoData.inventoryAdjustments,
          inventoryCounts: demoData.inventoryCounts,
          scrapOrders: demoData.scrapOrders,
          replenishments: demoData.replenishments,
          partners: demoData.partners,
          operationTypes: demoData.operationTypes,
          users: demoData.users,
          currentUser: demoData.users[0],
        })
      },
    })
)

// Demo Data Generator
function getDemoData() {
  const warehouses: Warehouse[] = [
    {
      id: 'wh-1',
      code: 'WH',
      name: 'المستودع الرئيسي',
      address: 'الرياض، المملكة العربية السعودية',
      isActive: true,
    },
  ]

  const locations: Location[] = [
    { id: 'loc-1', code: 'WH/Stock', name: 'المخزون الرئيسي', warehouseId: 'wh-1', type: 'internal', isActive: true },
    { id: 'loc-2', code: 'Vendors', name: 'الموردين', warehouseId: 'wh-1', type: 'vendor', isActive: true },
    { id: 'loc-3', code: 'Customers', name: 'العملاء', warehouseId: 'wh-1', type: 'customer', isActive: true },
    { id: 'loc-4', code: 'Inventory', name: 'خسارة المخزون', warehouseId: 'wh-1', type: 'inventory', isActive: true },
    { id: 'loc-5', code: 'Production', name: 'الإنتاج', warehouseId: 'wh-1', type: 'production', isActive: true },
    { id: 'loc-6', code: 'Scrap', name: 'الهالك', warehouseId: 'wh-1', type: 'scrap', isActive: true },
  ]

  const categories: ProductCategory[] = [
    { id: 'cat-1', code: 'CAT-001', name: 'إلكترونيات', valuationMethod: 'fifo', costingMethod: 'fifo' },
    { id: 'cat-2', code: 'CAT-002', name: 'ملابس', valuationMethod: 'fifo', costingMethod: 'fifo' },
    { id: 'cat-3', code: 'CAT-003', name: 'أطعمة', valuationMethod: 'fifo', costingMethod: 'fifo' },
  ]

  const unitsOfMeasure: UnitOfMeasure[] = [
    { id: 'uom-1', name: 'قطعة', category: 'Unit', factor: 1, isBase: true },
    { id: 'uom-2', name: 'كيلوجرام', category: 'Weight', factor: 1, isBase: true },
    { id: 'uom-3', name: 'لتر', category: 'Volume', factor: 1, isBase: true },
    { id: 'uom-4', name: 'علبة', category: 'Unit', factor: 12, isBase: false },
  ]

  const products: Product[] = [
    {
      id: 'prod-1',
      code: 'PROD-001',
      name: 'هاتف ذكي',
      categoryId: 'cat-1',
      type: 'stockable',
      barcode: '1234567890123',
      tracking: 'none',
      uomId: 'uom-1',
      routeIds: [],
      isActive: true,
    },
    {
      id: 'prod-2',
      code: 'PROD-002',
      name: 'قميص قطني',
      categoryId: 'cat-2',
      type: 'stockable',
      tracking: 'lot',
      uomId: 'uom-1',
      routeIds: [],
      isActive: true,
    },
    {
      id: 'prod-3',
      code: 'PROD-003',
      name: 'زيت زيتون',
      categoryId: 'cat-3',
      type: 'stockable',
      tracking: 'lot',
      uomId: 'uom-3',
      routeIds: [],
      isActive: true,
    },
  ]

  const lotsSerials: LotSerial[] = [
    { id: 'lot-1', number: 'LOT-001', productId: 'prod-2', type: 'lot', quantity: 100 },
    { id: 'lot-2', number: 'LOT-002', productId: 'prod-3', type: 'lot', quantity: 50, expiryDate: '2024-12-31' },
  ]

  const operationTypes: OperationType[] = [
    { id: 'op-1', code: 'IN', name: 'استلام', type: 'receipt', destinationLocationId: 'loc-1' },
    { id: 'op-2', code: 'OUT', name: 'صرف', type: 'delivery', sourceLocationId: 'loc-1' },
    { id: 'op-3', code: 'INT', name: 'تحويل داخلي', type: 'internal' },
    { id: 'op-4', code: 'ADJ', name: 'تسوية مخزنية', type: 'adjustment' },
    { id: 'op-5', code: 'SCRAP', name: 'هالك', type: 'scrap', sourceLocationId: 'loc-1', destinationLocationId: 'loc-6' },
  ]

  const partners: Partner[] = [
    { id: 'part-1', code: 'VEND-001', name: 'شركة المورد الأول', type: 'vendor', phone: '0501234567' },
    { id: 'part-2', code: 'CUST-001', name: 'عميل مميز', type: 'customer', phone: '0509876543' },
  ]

  const stockMoves: StockMove[] = [
    {
      id: 'move-1',
      productId: 'prod-1',
      quantity: 100,
      destinationLocationId: 'loc-1',
      date: '2024-01-15',
      state: 'done',
      reference: 'REC-001',
    },
    {
      id: 'move-2',
      productId: 'prod-1',
      quantity: 25,
      sourceLocationId: 'loc-1',
      destinationLocationId: 'loc-3',
      date: '2024-01-20',
      state: 'done',
      reference: 'DO-001',
    },
  ]

  const receipts: Receipt[] = [
    {
      id: 'rec-1',
      reference: 'REC-001',
      partnerId: 'part-1',
      state: 'done',
      date: '2024-01-15',
      moves: ['move-1'],
    },
  ]

  const deliveryOrders: DeliveryOrder[] = [
    {
      id: 'do-1',
      reference: 'DO-001',
      partnerId: 'part-2',
      state: 'done',
      date: '2024-01-20',
      moves: ['move-2'],
    },
  ]

  const inventoryAdjustments: InventoryAdjustment[] = []
  const inventoryCounts: InventoryCount[] = []
  const scrapOrders: ScrapOrder[] = []
  const replenishments: Replenishment[] = []

  const users: User[] = [
    {
      id: 'user-1',
      name: 'مدير النظام',
      role: 'admin',
      permissions: ['*'],
    },
    {
      id: 'user-2',
      name: 'أمين المستودع',
      role: 'warehouse_manager',
      permissions: ['warehouse.view', 'warehouse.create', 'warehouse.update'],
    },
  ]

  return {
    warehouses,
    locations,
    products,
    categories,
    unitsOfMeasure,
    lotsSerials,
    stockMoves,
    receipts,
    deliveryOrders,
    inventoryAdjustments,
    inventoryCounts,
    scrapOrders,
    replenishments,
    partners,
    operationTypes,
    users,
  }
}

