// LIFF 初始化和管理
export const initLiff = async (liffId) => {
  try {
    if (!window.liff) {
      throw new Error('LIFF SDK 未載入');
    }

    // 初始化 LIFF
    await window.liff.init({ liffId });
    
    console.log('LIFF 初始化成功');
    
    // 檢查是否在 LINE 應用內
    if (window.liff.isInClient()) {
      console.log('在 LINE 應用內執行');
    } else {
      console.log('在外部瀏覽器執行');
    }
    
    return true;
  } catch (error) {
    console.error('LIFF 初始化失敗:', error);
    return false;
  }
};

// 發送訊息到聊天室
export const sendMessageToChat = async (message) => {
  try {
    if (!window.liff) {
      throw new Error('LIFF 未初始化');
    }

    if (!window.liff.isInClient()) {
      throw new Error('不在 LINE 應用內，無法發送訊息');
    }

    if (!window.liff.isLoggedIn()) {
      throw new Error('用戶未登入');
    }

    // 發送訊息
    await window.liff.sendMessages([
      {
        type: 'text',
        text: message
      }
    ]);
    
    console.log('訊息發送成功:', message);
    return true;
  } catch (error) {
    console.error('發送訊息失敗:', error);
    throw error;
  }
};

// 檢查 LIFF 狀態
export const checkLiffStatus = () => {
  if (!window.liff) {
    return {
      initialized: false,
      inClient: false,
      loggedIn: false,
      error: 'LIFF SDK 未載入'
    };
  }

  try {
    return {
      initialized: window.liff.isInitialized ? window.liff.isInitialized() : false,
      inClient: window.liff.isInClient(),
      loggedIn: window.liff.isLoggedIn ? window.liff.isLoggedIn() : false,
      error: null
    };
  } catch (error) {
    return {
      initialized: false,
      inClient: false,
      loggedIn: false,
      error: error.message
    };
  }
};

// 登入 LIFF
export const loginLiff = async () => {
  try {
    if (!window.liff) {
      throw new Error('LIFF 未初始化');
    }

    if (!window.liff.isLoggedIn()) {
      window.liff.login();
    }
    
    return true;
  } catch (error) {
    console.error('LIFF 登入失敗:', error);
    throw error;
  }
};

// 取得用戶資料
export const getUserProfile = async () => {
  try {
    if (!window.liff) {
      throw new Error('LIFF 未初始化');
    }

    if (!window.liff.isLoggedIn()) {
      throw new Error('用戶未登入');
    }

    const profile = await window.liff.getProfile();
    return profile;
  } catch (error) {
    console.error('取得用戶資料失敗:', error);
    throw error;
  }
};