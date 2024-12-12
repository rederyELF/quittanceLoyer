import { supabase } from '../utils/supabase'
import { STORAGE_KEY } from '../utils/localStorage'

export class StorageService {
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  static async saveQuittance(quittanceData) {
    const user = await this.getCurrentUser()

    if (user) {
      // Utilisateur connecté -> Sauvegarde dans Supabase
      const { data, error } = await supabase
        .from('quittances')
        .insert([
          {
            user_id: user.id,
            ...quittanceData,
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error
      return data
    } else {
      // Utilisateur non connecté -> Sauvegarde dans localStorage
      try {
        const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        const newData = [...existingData, {
          id: Date.now(),
          ...quittanceData,
          created_at: new Date().toISOString()
        }]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
        return newData
      } catch (error) {
        console.error('Erreur localStorage:', error)
        throw error
      }
    }
  }

  static async getQuittances() {
    const user = await this.getCurrentUser()

    if (user) {
      // Utilisateur connecté -> Récupération depuis Supabase
      const { data, error } = await supabase
        .from('quittances')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } else {
      // Utilisateur non connecté -> Récupération depuis localStorage
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      } catch (error) {
        console.error('Erreur localStorage:', error)
        return []
      }
    }
  }

  static async migrateLocalToSupabase(userId) {
    try {
      const localData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (localData.length === 0) return

      const dataToMigrate = localData.map(item => ({
        ...item,
        user_id: userId,
        migrated_at: new Date().toISOString()
      }))

      const { error } = await supabase
        .from('quittances')
        .insert(dataToMigrate)

      if (error) throw error

      // Vider le localStorage après migration réussie
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Erreur de migration:', error)
      throw error
    }
  }
}
