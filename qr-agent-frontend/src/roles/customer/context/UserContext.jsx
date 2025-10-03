import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  // Hardcoded user and group data to bypass authentication
  const [user, setUser] = useState({
    name: 'Default User',
    phone: '1234567890',
    // Add any other user properties your components might need
  });

  const [groupData, setGroupData] = useState({
    group_id: 'default_group',
    qr_url: '',
    // Add any other group properties your components might need
  });

    const [organizationId, setOrganizationId] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState('success');

  // Mock functions to avoid errors
  const sendOTP = async () => {
    console.log('OTP sending is disabled.');
    setVerificationStatus('verifying');
    return Promise.resolve();
  };

  const verifyOTP = async () => {
    console.log('OTP verification is disabled.');
    setVerificationStatus('success');
    return Promise.resolve({ success: true, token: 'fake-token' });
  };

  const createGroup = async () => {
    console.log('Group creation is disabled.');
    return Promise.resolve({ group_id: 'default_group' });
  };

  const joinGroup = async () => {
    console.log('Joining group is disabled.');
    return Promise.resolve({ member_token: 'fake-member-token' });
  };

  useEffect(() => {
    // You can set default values in localStorage/sessionStorage if needed
    localStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('group', JSON.stringify(groupData));
    localStorage.setItem('organization_id', organizationId);
    sessionStorage.setItem('table_id', 'table_default');
  }, [user, groupData, organizationId]);

  return (
    <UserContext.Provider value={{
      user,
      groupData,
      organizationId,
      verificationStatus,
      sendOTP,
      verifyOTP,
      createGroup,
      joinGroup,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
