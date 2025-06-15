import React, { useState, useEffect } from 'react';
import { checkLiffStatus, getUserProfile, loginLiff } from '../utils/liff';
import { useAppContext } from '../context/AppContext';

const LiffDebugger = () => {
  const [status, setStatus] = useState(null);
  const [profile, setProfile] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const checkStatus = () => {
      const currentStatus = checkLiffStatus();
      setStatus(currentStatus);
      
      let info = `LIFF 狀態檢查:\n`;
      info += `- 初始化: ${currentStatus.initialized ? '✓' : '✗'}\n`;
      info += `- 在 LINE 應用內: ${currentStatus.inClient ? '✓' : '✗'}\n`;
      info += `- 已登入: ${currentStatus.loggedIn ? '✓' : '✗'}\n`;
      info += `- 錯誤: ${currentStatus.error || '無'}\n`;
      info += `- User Agent: ${navigator.userAgent}\n`;
      info += `- URL: ${window.location.href}\n`;
      
      setDebugInfo(info);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleGetProfile = async () => {
    try {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('取得用戶資料失敗:', error);
      alert(`取得用戶資料失敗: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      await loginLiff();
    } catch (error) {
      console.error('登入失敗:', error);
      alert(`登入失敗: ${error.message}`);
    }
  };

  const handleTestSendMessage = async () => {
    try {
      const { sendMessageToChat } = await import('../utils/liff');
      await sendMessageToChat('LIFF 測試訊息 - 發送成功！');
      alert('測試訊息發送成功！');
    } catch (error) {
      console.error('測試訊息發送失敗:', error);
      alert(`測試訊息發送失敗: ${error.message}`);
    }
  };

  // 只在開發環境或有錯誤時顯示
  if (process.env.NODE_ENV === 'production' && !liffError) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>LIFF 偵錯器</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>狀態:</strong>
        <div style={{ color: status?.initialized ? 'green' : 'red' }}>
          初始化: {status?.initialized ? '✓' : '✗'}
        </div>
        <div style={{ color: status?.inClient ? 'green' : 'red' }}>
          在 LINE 內: {status?.inClient ? '✓' : '✗'}
        </div>
        <div style={{ color: status?.loggedIn ? 'green' : 'red' }}>
          已登入: {status?.loggedIn ? '✓' : '✗'}
        </div>
        {status?.error && (
          <div style={{ color: 'red' }}>
            錯誤: {status.error}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={handleLogin}
          style={{ 
            margin: '2px', 
            padding: '5px 10px', 
            fontSize: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          登入
        </button>
        <button 
          onClick={handleGetProfile}
          style={{ 
            margin: '2px', 
            padding: '5px 10px', 
            fontSize: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          取得用戶資料
        </button>
        <button 
          onClick={handleTestSendMessage}
          style={{ 
            margin: '2px', 
            padding: '5px 10px', 
            fontSize: '10px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          測試發送訊息
        </button>
      </div>

      {profile && (
        <div style={{ marginBottom: '10px', fontSize: '10px' }}>
          <strong>用戶資料:</strong>
          <div>名稱: {profile.displayName}</div>
          <div>ID: {profile.userId}</div>
        </div>
      )}

      <details>
        <summary>詳細資訊</summary>
        <pre style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>
          {debugInfo}
        </pre>
      </details>
    </div>
  );
};

export default LiffDebugger;