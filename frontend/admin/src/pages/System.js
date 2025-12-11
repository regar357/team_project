// src/pages/System.js
import {  Save, RefreshCw, Database, Shield, Bell, Globe,} from 'lucide-react';
import { useState, useEffect } from 'react';
import './System.css';

const SETTINGS_STORAGE_KEY = 'adminSystemSettings';
const SETTINGS_API_URL = 'http://localhost:3001/api/system/settings'; 


export function System() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('한국어');
  const [backupCycle, setBackupCycle] = useState('매일');
  const [systemStatus, setSystemStatus] = useState(null);
  const [exceptionLogs, setExceptionLogs] = useState([]);


  // const logs = [
  //   {
  //     time: '2025-12-06 12:45:32',
  //     level: '경고',
  //     message: 'API 응답 시간 임계값 초과 (245ms)',
  //   },
  //   {
  //     time: '2025-12-06 10:23:15',
  //     level: '오류',
  //     message: '이미지 처리 실패: 파일 형식 오류',
  //   },
  //   {
  //     time: '2025-12-05 18:12:44',
  //     level: '정보',
  //     message: '시스템 백업 완료',
  //   },
  //   {
  //     time: '2025-12-05 15:34:22',
  //     level: '경고',
  //     message: '저장소 사용량 70% 도달',
  //   },
  // ];

  const getLogLevelClass = (level) => {
    if (level === '오류') return 'log-level log-error';
    if (level === '경고') return 'log-level log-warning';
    return 'log-level log-info';
  };


    //  localStorage에서 설정 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (typeof parsed.twoFactor === 'boolean') {
        setTwoFactor(parsed.twoFactor);
      }
      if (typeof parsed.notifications === 'boolean') {
        setNotifications(parsed.notifications);
      }
      if (typeof parsed.language === 'string') {
        setLanguage(parsed.language);
      }
      if (typeof parsed.backupCycle === 'string') {
        setBackupCycle(parsed.backupCycle);
      }
    } catch (err) {
      console.error('Failed to load system settings from localStorage', err);
    }


    // (API GET)
  const fetchFromServer = async () => {
    try {
      const res = await fetch(SETTINGS_API_URL);
      if (!res.ok) {
        throw new Error('API 응답 오류');
      }

      const data = await res.json();
      // 백엔드 응답 형식에 맞춰서 필드명 맞춰야 함!
      // 예시: { twoFactor: true, notifications: false, language: "한국어", backupCycle: "매일" }

      if (typeof data.twoFactor === 'boolean') {
        setTwoFactor(data.twoFactor);
      }
      if (typeof data.notifications === 'boolean') {
        setNotifications(data.notifications);
      }
      if (typeof data.language === 'string') {
        setLanguage(data.language);
      }
      if (typeof data.backupCycle === 'string') {
        setBackupCycle(data.backupCycle);
      }

      // 서버 값이 정상이면 localStorage도 최신으로 덮어쓰기
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to load system settings from API', err);
      // 실패해도 localStorage 값으로는 계속 동작함
    }
  };
    fetchFromServer();

  }, []);

  // 시스템 상태 불러오기 (DB, AI 모델)
const fetchSystemStatus = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/system/status');
    if (!res.ok) throw new Error('시스템 상태 API 오류');

    const data = await res.json();
    setSystemStatus(data);
    localStorage.setItem('adminSystemStatus', JSON.stringify(data));
  } catch (err) {
    console.error(err);
    // 서버 오류 시 localStorage fallback
    const saved = localStorage.getItem('adminSystemStatus');
    if (saved) setSystemStatus(JSON.parse(saved));
  }
};

// 예외 로그 불러오기
const fetchExceptionLogs = async () => {
  try {
    const res = await fetch('http://localhost:3001/api/system/logs');
    if (!res.ok) throw new Error('로그 API 오류');

    const data = await res.json();
    setExceptionLogs(data);
    localStorage.setItem('adminSystemLogs', JSON.stringify(data));
  } catch (err) {
    console.error(err);
    const saved = localStorage.getItem('adminSystemLogs');
    if (saved) setExceptionLogs(JSON.parse(saved));
  }
};

fetchSystemStatus();
fetchExceptionLogs();



  const handleSave =  async () => {
    const summary = `
[시스템 설정 저장]
- 2단계 인증: ${twoFactor ? '활성' : '비활성'}
- 알림: ${notifications ? '수신' : '차단'}
- 언어: ${language}
- 백업 주기: ${backupCycle}
    `.trim();

    const payload = {
      twoFactor,
      notifications,
      language,
      backupCycle,
    };

    // localStorage에 저장
    try {
      const data = {
        twoFactor,
        notifications,
        language,
        backupCycle,
      };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save system settings to localStorage', err);
    }

    //(API POST)
    try {
      const res = await fetch(SETTINGS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error('API 응답 오류');
    }

    window.alert(summary);
  } catch (err) {
    console.error('Failed to save system settings to API', err);
    window.alert('설정 저장 중 서버 오류가 발생했습니다.');
    }
  };

  const handleReset = () => {
    if (!window.confirm('설정을 초기값으로 되돌리시겠습니까?')) return;
    setTwoFactor(true);
    setNotifications(true);
    setLanguage('한국어');
    setBackupCycle('매일');

    try {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear system settings from localStorage', err);
    }

  };

  return (
    <div className="system">
      {/* 헤더 */}
      <div className="system-header">
        <h1 className="system-title">System</h1>
        <p className="system-description">
          예외 로그, 시스템 정상, AI 모델 상태
        </p>
      </div>

      {/* 상단 상태 카드 그리드 */}
      <div className="system-status-grid">
        {/* DB 상태 */}
        <div className="system-card">
          <div className="system-card-header">
            <div className="system-icon-wrapper db">
              <Database className="system-icon" />
            </div>
            <div>
              <h2 className="system-card-title">데이터베이스</h2>
              <p className="system-card-subtitle">{systemStatus?.db?.status === 'active' ? '정상 작동 중' : '오류'}</p>
            </div>
          </div>

          <div className="system-card-body">
            <div className="system-status-row">
              <span className="status-label">연결 상태</span>
              <span className="status-chip status-ok">{systemStatus?.db?.status ?? '---'}</span>
            </div>
            <div className="system-status-row">
              <span className="status-label">응답 시간</span>
              <span className="status-value">{systemStatus?.db?.responseTime ?? '-'}ms</span>
            </div>
            <div className="system-status-row">
              <span className="status-label">사용 중인 연결</span>
              <span className="status-value">{systemStatus?.db?.connections ?? '--'}</span>
            </div>
          </div>
        </div>

        {/* AI 모델 상태 */}
        <div className="system-card">
          <div className="system-card-header">
            <div className="system-icon-wrapper ai">
              <RefreshCw className="system-icon" />
            </div>
            <div>
              <h2 className="system-card-title">AI 모델</h2>
              <p className="system-card-subtitle">v1 (최신)</p>
            </div>
          </div>

          <div className="system-card-body">
            <div className="system-status-row">
              <span className="status-label">모델 상태</span>
              <span className="status-chip status-ok">정상</span>
            </div>
            <div className="system-status-row">
              <span className="status-label">평균 정확도</span>
              <span className="status-value">94.2%</span>
            </div>
            <div className="system-status-row">
              <span className="status-label">마지막 업데이트</span>
              <span className="status-value">2일 전</span>
            </div>
          </div>
        </div>
      </div>

      {/* 시스템 설정 */}
      <div className="system-card settings-card">
        <h2 className="system-card-title settings-title">시스템 설정</h2>

        <div className="settings-list">
          {/* 보안 인증 */}
          <div className="settings-item">
            <div className="settings-item-info">
              <Shield className="settings-icon" />
              <div>
                <p className="settings-item-title">보안 인증</p>
                <p className="settings-item-subtitle">
                  2단계 인증 활성화
                </p>
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                className="toggle-input"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}

              />
              <span className="toggle-track" />
            </label>
          </div>

          {/* 알림 */}
          <div className="settings-item">
            <div className="settings-item-info">
              <Bell className="settings-icon" />
              <div>
                <p className="settings-item-title">알림</p>
                <p className="settings-item-subtitle">
                  시스템 알림 수신
                </p>
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                className="toggle-input"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span className="toggle-track" />
            </label>
          </div>

          {/* 언어 설정 */}
          <div className="settings-item">
            <div className="settings-item-info">
              <Globe className="settings-icon" />
              <div>
                <p className="settings-item-title">언어</p>
                <p className="settings-item-subtitle">
                  시스템 언어 설정
                </p>
              </div>
            </div>
            <select className="system-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>한국어</option>
              <option>English</option>
              <option>日本語</option>
            </select>
          </div>

          {/* 데이터 백업 */}
          <div className="settings-item no-border">
            <div className="settings-item-info">
              <Database className="settings-icon" />
              <div>
                <p className="settings-item-title">데이터 백업</p>
                <p className="settings-item-subtitle">
                  자동 백업 주기 설정
                </p>
              </div>
            </div>
            <select className="system-select"
              value={backupCycle}
              onChange={(e) => setBackupCycle(e.target.value)}
            >
              <option>매일</option>
              <option>매주</option>
              <option>매월</option>
            </select>
          </div>
        </div>

        <div className="settings-actions">
          <button className="btn btn-primary"  onClick={handleSave}>
            <Save className="btn-icon" />
            <span>설정 저장</span>
          </button>
          <button className="btn btn-ghost" onClick={handleReset}>초기화</button>
        </div>
      </div>

      {/* 예외 로그 */}
      <div className="system-card logs-card">
        <h2 className="system-card-title">최근 예외 로그</h2>
        <div className="logs-list">
          {exceptionLogs.length === 0 && (
            <p className="log-empty">예외 로그가 없습니다.</p>
          )}
          
          {exceptionLogs.map((log, i) => (
            <div key={i} className="log-item">
              <span className={getLogLevelClass(log.level)}>
                {log.level}
              </span>
              <div className="log-content">
                <p className="log-message">{log.message}</p>
                <p className="log-time">{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
