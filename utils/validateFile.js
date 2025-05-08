export default function validateFile(file) {
    if (!file) return { valid: false, message: "Fichier invalide." };
  
    const maxImageSize = 2 * 1024 * 1024; // 2 Mo
    const maxPdfSize = 5 * 1024 * 1024;   // 5 Mo
  
    const { mimeType, size, name } = file;
  
    // Type autorisé
    const isImage = mimeType?.startsWith("image/");
    const isPdf = mimeType === "application/pdf";
  
    if (!isImage && !isPdf) {
      return {
        valid: false,
        message: "Seules les images et les fichiers PDF sont autorisés.",
      };
    }
  
    // Taille
    if (isImage && size > maxImageSize) {
      return {
        valid: false,
        message: `L’image ${name} est trop volumineuse (max 2 Mo).`,
      };
    }
  
    if (isPdf && size > maxPdfSize) {
      return {
        valid: false,
        message: `Le document ${name} est trop volumineux (max 5 Mo).`,
      };
    }
  
    return { valid: true };
  }
  