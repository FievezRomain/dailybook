import Purchases from "react-native-purchases";
import { Platform } from "react-native";
import LoggerService from './LoggerService';

const RevenueCatService = {
  // Initialiser RevenueCat avec la clé API
  initialize: (userId) => {
    const apiKey =
      Platform.OS === "ios"
        ? "appl_fWiNvWdSXcyGwybadfiGdmawJkK" 
        : "goog_DRQiyGXaBcrIyTjHsqJRaNgkRkK"; 
    Purchases.configure({
      apiKey: apiKey, 
      appUserID: userId, 
    });
  },

  // Vérifier si un utilisateur possède un abonnement actif
  checkSubscriptionStatus: async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const entitlements = customerInfo.entitlements.active;

      if (entitlements["premium"]) {
        return { status: "active", plan: "premium" };
      } else if (entitlements["pro"]) {
        return { status: "active", plan: "pro" };
      } else {
        return { status: "inactive", plan: null };
      }
    } catch (error) {
      LoggerService.log( "Erreur lors de la vérification de l'abonnement :" + error );
      return { status: "error", error };
    }
  },

  // Récupérer les offres disponibles
  getAvailableOffers: async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        return offerings.current.availablePackages;
      } else {
        return [];
      }
    } catch (error) {
      LoggerService.log( "Erreur lors de la récupération des offres :" + error );
      return { status: "error", error };
    }
  },

  // Effectuer un achat
  purchaseOffer: async (packageToPurchase) => {
    try {
      const purchase = await Purchases.purchasePackage(packageToPurchase);
      return { status: "success", purchase };
    } catch (error) {
      if (error.userCancelled) {
        return { status: "cancelled" };
      } else {
        LoggerService.log( "Erreur lors de l'achat :" + error );
        return { status: "error", error };
      }
    }
  },

  // Restaurer les achats
  restorePurchases: async () => {
    try {
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    } catch (error) {
      LoggerService.log( "Erreur lors de la restauration des achats :" + error );
      return { status: "error", error };
    }
  },
};

export default RevenueCatService;
