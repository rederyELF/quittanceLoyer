// Utilitaires pour la gestion du localStorage
export const STORAGE_KEY = 'quittance_data';

export const saveFormData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return false;
  }
};

export const loadFormData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    return null;
  }
};

export const clearFormData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return false;
  }
};
