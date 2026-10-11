import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerUser, SavedAddress } from '../types';
import { AuthService, SendOtpResult, VerifyOtpResult } from '../services/authService';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (onSuccessCallback?: () => void) => void;
  closeAuthModal: () => void;
  requestOtp: (phone: string, countryCode?: string) => Promise<SendOtpResult>;
  verifyOtp: (phone: string, otp: string) => Promise<VerifyOtpResult>;
  logout: () => void;
  saveAddress: (address: SavedAddress) => void;
  updateProfile: (data: { fullName: string; email: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(() => AuthService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [postLoginAction, setPostLoginAction] = useState<(() => void) | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    // Sync current user on mount
    const current = AuthService.getCurrentUser();
    if (current) {
      setUser(current);
    }
  }, []);

  const openAuthModal = (onSuccessCallback?: () => void) => {
    if (onSuccessCallback) {
      setPostLoginAction(() => onSuccessCallback);
    } else {
      setPostLoginAction(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPostLoginAction(null);
  };

  const requestOtp = async (phone: string, countryCode: string = '+91'): Promise<SendOtpResult> => {
    return await AuthService.requestOtp(phone, countryCode);
  };

  const verifyOtp = async (phone: string, otp: string): Promise<VerifyOtpResult> => {
    const res = await AuthService.verifyOtp(phone, otp);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${res.user.fullName || 'Patron'}!`, 'success');
      if (postLoginAction) {
        postLoginAction();
        setPostLoginAction(null);
      }
    }
    return res;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    showToast('You have been logged out safely.', 'info');
  };

  const saveAddress = (address: SavedAddress) => {
    const updated = AuthService.saveAddress(address);
    if (user) {
      const updatedUser = { ...user, savedAddresses: updated };
      setUser(updatedUser);
    }
    showToast('Shipping address saved to your address book.', 'success');
  };

  const updateProfile = (data: { fullName: string; email: string }) => {
    if (!user) return;
    const updatedUser: CustomerUser = {
      ...user,
      fullName: data.fullName,
      email: data.email,
    };
    setUser(updatedUser);
    try {
      sessionStorage.setItem('aurevya_auth_session_v1', JSON.stringify(updatedUser));
    } catch (e) {
      console.error(e);
    }
    showToast('Profile details updated.', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        requestOtp,
        verifyOtp,
        logout,
        saveAddress,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
