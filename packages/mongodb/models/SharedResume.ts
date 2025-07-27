import { Schema, model, models } from 'mongoose'

const SharedResumeSchema = new Schema({
  // ID único para el enlace público
  shareId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Datos completos del CV
  resumeData: {
    type: Schema.Types.Mixed,
    required: true
  },
  
  // Metadatos
  title: {
    type: String,
    required: true
  },
  
  description: {
    type: String,
    default: ''
  },
  
  // Configuración de privacidad
  isPublic: {
    type: Boolean,
    default: true
  },
  
  // Estadísticas
  viewCount: {
    type: Number,
    default: 0
  },
  
  // Fechas
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Fecha de expiración (opcional)
  expiresAt: {
    type: Date,
    default: null
  }
})

// Middleware para actualizar updatedAt
SharedResumeSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

// Índices para optimizar búsquedas
SharedResumeSchema.index({ createdAt: -1 })
SharedResumeSchema.index({ isPublic: 1 })
SharedResumeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const SharedResumeModel = models.SharedResume || model('SharedResume', SharedResumeSchema)