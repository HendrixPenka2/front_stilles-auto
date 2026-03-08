export type ContactStatus = 'NEW' | 'READ' | 'IN_PROGRESS' | 'RESOLVED'
export type ImportExportType = 'IMPORT' | 'EXPORT'
export type ImportExportStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'QUOTE_SENT'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'REJECTED'

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: ContactStatus
  assignedTo?: string
  createdAt: string
}

export interface ImportExportDocument {
  id: string
  requestId: string
  fileName: string
  mimeType: string
  size: number
  dataUrl?: string
  createdAt: string
}

export interface ImportExportComment {
  id: string
  author: string
  content: string
  createdAt: string
}

export interface ImportExportRequest {
  id: string
  userId: string
  userEmail: string
  type: ImportExportType
  vehicleDescription: string
  originCountry: string
  destinationCountry: string
  estimatedBudget: number
  status: ImportExportStatus
  createdAt: string
  updatedAt: string
  documents: ImportExportDocument[]
  internalComments: ImportExportComment[]
}

const CONTACT_KEY = 'mock_contact_messages'
const IMPORT_EXPORT_KEY = 'mock_import_export_requests'

const seedContacts: ContactMessage[] = [
  {
    id: 'ct_1',
    name: 'Jean Mbia',
    email: 'jean.mbia@email.com',
    phone: '+237670000001',
    subject: 'Demande devis location',
    message: 'Bonjour, je souhaite louer un SUV premium pour 10 jours.',
    status: 'NEW',
    createdAt: new Date().toISOString(),
  },
]

const seedRequests: ImportExportRequest[] = [
  {
    id: 'ie_1',
    userId: 'user-001',
    userEmail: 'user@example.com',
    type: 'IMPORT',
    vehicleDescription: 'Toyota Prado TXL 2022, diesel, automatique',
    originCountry: 'UAE',
    destinationCountry: 'Cameroun',
    estimatedBudget: 32000000,
    status: 'UNDER_REVIEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    documents: [],
    internalComments: [
      {
        id: 'c_1',
        author: 'Admin',
        content: 'Dossier reçu, analyse des coûts en cours.',
        createdAt: new Date().toISOString(),
      },
    ],
  },
]

function canUseStorage() {
  return typeof window !== 'undefined'
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return
  localStorage.setItem(key, JSON.stringify(value))
}

function initData() {
  if (!canUseStorage()) return
  if (!localStorage.getItem(CONTACT_KEY)) {
    writeJson(CONTACT_KEY, seedContacts)
  }
  if (!localStorage.getItem(IMPORT_EXPORT_KEY)) {
    writeJson(IMPORT_EXPORT_KEY, seedRequests)
  }
}

initData()

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ""))
    reader.onerror = () => reject(new Error("Unable to read file"))
    reader.readAsDataURL(file)
  })
}

export const mockCrmApi = {
  async createContact(data: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>) {
    await wait()
    const all = readJson<ContactMessage[]>(CONTACT_KEY, seedContacts)
    const item: ContactMessage = {
      id: `ct_${Date.now()}`,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      ...data,
    }
    all.unshift(item)
    writeJson(CONTACT_KEY, all)
    return item
  },

  async listAdminContacts() {
    await wait()
    return readJson<ContactMessage[]>(CONTACT_KEY, seedContacts)
  },

  async updateContactStatus(id: string, status: ContactStatus, assignedTo?: string) {
    await wait()
    const all = readJson<ContactMessage[]>(CONTACT_KEY, seedContacts)
    const updated = all.map((item) =>
      item.id === id ? { ...item, status, assignedTo: assignedTo || item.assignedTo } : item
    )
    writeJson(CONTACT_KEY, updated)
    return updated.find((item) => item.id === id)!
  },

  async createImportExportRequest(data: {
    userId: string
    userEmail: string
    type: ImportExportType
    vehicleDescription: string
    originCountry: string
    destinationCountry: string
    estimatedBudget: number
  }) {
    await wait()
    const all = readJson<ImportExportRequest[]>(IMPORT_EXPORT_KEY, seedRequests)
    const item: ImportExportRequest = {
      id: `ie_${Date.now()}`,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: [],
      internalComments: [],
      ...data,
    }
    all.unshift(item)
    writeJson(IMPORT_EXPORT_KEY, all)
    return item
  },

  async listMyImportExport(userId?: string, userEmail?: string) {
    await wait()
    const all = readJson<ImportExportRequest[]>(IMPORT_EXPORT_KEY, seedRequests)
    return all.filter((item) => item.userId === userId || item.userEmail === userEmail)
  },

  async listAdminImportExport() {
    await wait()
    return readJson<ImportExportRequest[]>(IMPORT_EXPORT_KEY, seedRequests)
  },

  async updateImportExportStatus(id: string, status: ImportExportStatus) {
    await wait()
    const all = readJson<ImportExportRequest[]>(IMPORT_EXPORT_KEY, seedRequests)
    const updated = all.map((item) =>
      item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item
    )
    writeJson(IMPORT_EXPORT_KEY, updated)
    return updated.find((item) => item.id === id)!
  },

  async addInternalComment(id: string, content: string, author = 'Admin') {
    await wait()
    const all = readJson<ImportExportRequest[]>(IMPORT_EXPORT_KEY, seedRequests)
    const updated = all.map((item) => {
      if (item.id !== id) return item
      const comment: ImportExportComment = {
        id: `com_${Date.now()}`,
        author,
        content,
        createdAt: new Date().toISOString(),
      }
      return {
        ...item,
        updatedAt: new Date().toISOString(),
        internalComments: [comment, ...item.internalComments],
      }
    })
    writeJson(IMPORT_EXPORT_KEY, updated)
    return updated.find((item) => item.id === id)!
  },

  async uploadImportExportDocument(id: string, file: File) {
    await wait()
    const all = readJson<ImportExportRequest[]>(IMPORT_EXPORT_KEY, seedRequests)
    const dataUrl = await fileToDataUrl(file)

    const formData = new FormData()
    formData.append('file', file)

    const updated = all.map((item) => {
      if (item.id !== id) return item
      const doc: ImportExportDocument = {
        id: `doc_${Date.now()}`,
        requestId: id,
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        dataUrl,
        createdAt: new Date().toISOString(),
      }
      return {
        ...item,
        updatedAt: new Date().toISOString(),
        documents: [doc, ...item.documents],
      }
    })

    writeJson(IMPORT_EXPORT_KEY, updated)
    return updated.find((item) => item.id === id)!
  },
}
