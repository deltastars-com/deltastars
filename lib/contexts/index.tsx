import React, { createContext, useContext } from 'react';

export { ProductsPage } from '../../ProductsPage';
export { CartPage } from '../../CartPage';
export { WishlistPage } from '../../WishlistPage';
export { ProductDetailPage } from '../../ProductDetailPage';
export { useI18n } from '../../I18nContext';
export { useToast } from '../../ToastContext';

const FirebaseContext = createContext<any>({});

export const FirebaseProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const mockFirebase = {
    db: {},
    user: null,
    products: [], addProduct: () => {}, updateProduct: () => {}, deleteProduct: () => {},
    orders: [], updateOrder: () => {},
    coupons: [], addCoupon: () => {}, updateCoupon: () => {}, deleteCoupon: () => {},
    updateUserPermissions: () => {},
    priceUpdateRequests: [], updatePriceUpdateRequest: () => {}, addPriceUpdateRequest: () => {},
    deliveryAgents: [], addDeliveryAgent: () => {}, updateDeliveryAgent: () => {}, deleteDeliveryAgent: () => {},
    legalPages: [], updateLegalPage: () => {}, seedLegalPages: () => {},
    categories: [], units: [], showroomItems: [],
    ads: [], addAd: () => {}, updateAd: () => {}, deleteAd: () => {},
    branches: [], addBranch: () => {}, updateBranch: () => {}, deleteBranch: () => {},
  };
  return <FirebaseContext.Provider value={mockFirebase}>{children}</FirebaseContext.Provider>;
};

export const useFirebase = () => useContext(FirebaseContext);
