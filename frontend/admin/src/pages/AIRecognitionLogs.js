// src/pages/AIRecognitionLogs.js
import { Filter, Download, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import './AIRecognitionLogs.css';

const LOGS_STORAGE_KEY = 'adminAIRecognitionLogs';
const LOGS_API_URL = 'http://localhost:3001/api/admin/ai-logs';

export function AIRecognitionLogs() {
  const [logs, setLogs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('전체'); 
  const [dateFilter, setDateFilter] = useState('전체');    
  const [loading, setLoading] = useState(false);

  
  // // 임시 로그 데이터 (날짜 필터가 실제로 먹도록 timestamp를 ISO 형태로)
  // const logs = [
  //   {
  //     id: 1,
  //     timestamp: '2025-02-14T14:23:15',
  //     refrigeratorImage: '냉장고_001.jpg',
  //     detectedItems: [
  //       { name: '토마토', confidence: 98.5 },
  //       { name: '양파', confidence: 95.3 },
  //       { name: '당근', confidence: 97.1 },
  //       { name: '우유', confidence: 96.8 },
  //     ],
  //     totalItems: 4,
  //     status: '성공',
  //     processingTime: '2.3초',
  //   },
  //   {
  //     id: 2,
  //     timestamp: '2025-02-14T10:12:30',
  //     refrigeratorImage: '냉장고_002.jpg',
  //     detectedItems: [
  //       { name: '계란', confidence: 99.1 },
  //       { name: '상추', confidence: 92.4 },
  //       { name: '파프리카', confidence: 94.7 },
  //     ],
  //     totalItems: 3,
  //     status: '성공',
  //     processingTime: '1.8초',
  //   },
  //   {
  //     id: 3,
  //     timestamp: '2025-02-13T22:00:12',
  //     refrigeratorImage: '냉장고_003.jpg',
  //     detectedItems: [
  //       { name: '감자', confidence: 96.2 },
  //       { name: '고구마', confidence: 93.5 },
  //     ],
  //     totalItems: 2,
  //     status: '성공',
  //     processingTime: '1.5초',
  //   },
  //   {
  //     id: 4,
  //     timestamp: '2025-02-10T09:43:56',
  //     refrigeratorImage: '냉장고_004.jpg',
  //     detectedItems: [],
  //     totalItems: 0,
  //     status: '실패',
  //     processingTime: '3.2초',
  //   },
  //   {
  //     id: 5,
  //     timestamp: '2025-01-30T08:11:20',
  //     refrigeratorImage: '냉장고_005.jpg',
  //     detectedItems: [
  //       { name: '사과', confidence: 97.8 },
  //       { name: '배', confidence: 95.1 },
  //       { name: '귤', confidence: 96.4 },
  //       { name: '바나나', confidence: 98.3 },
  //       { name: '포도', confidence: 94.2 },
  //     ],
  //     totalItems: 5,
  //     status: '성공',
  //     processingTime: '2.7초',
  //   },
  // ];

  // 페이지 처음 들어올 때: localStorage → API 순서로 데이터 로딩
  useEffect(() => {
    //  localStorage에서 먼저 채우기 
    try {
      const saved = localStorage.getItem(LOGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setLogs(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load AI logs from localStorage', err);
    }

    // 서버에서 최신 데이터 가져오기
    const fetchFromServer = async () => {
      try {
        setLoading(true);
        const res = await fetch(LOGS_API_URL);
        if (!res.ok) throw new Error('API 응답 오류');

        // 🔸 백엔드에서 반환하는 형식은
        // [{ id, timestamp, refrigeratorImage, detectedItems, totalItems, status, processingTime }, ...]
        // 라고 가정
        const data = await res.json();

        if (Array.isArray(data)) {
          setLogs(data);
          localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(data));
        }
      } catch (err) {
        console.error('Failed to fetch AI logs from API', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFromServer();
  }, []);


  // 상태/날짜 필터 반영된 로그
  const filteredLogs = logs.filter((log) => {

    const status = log.status || '';
    const timestamp = log.timestamp || '';
    let logDate;

    try {
      logDate = new Date(timestamp);
    } catch {
      logDate = null;
    }

    const now = new Date();

     // 상태 필터
    if (statusFilter === '성공' && status !== '성공') return false;
    if (statusFilter === '실패' && status !== '실패') return false;

    //  날짜 필터
     if (logDate && dateFilter !== '전체') {
      const diffMs = now - logDate;
      const oneDay = 24 * 60 * 60 * 1000;
      
      if (dateFilter === '오늘') {
        const isToday =
          logDate.getFullYear() === now.getFullYear() &&
          logDate.getMonth() === now.getMonth() &&
          logDate.getDate() === now.getDate();
        if (!isToday) return false;
      }

      if (dateFilter === '최근 7일') {
        if (diffMs > 7 * oneDay) return false;

      }

      if (dateFilter === '최근 30일') {
        if (diffMs > 30 * oneDay) return false;

      }
    }

    return true;
  });

  const getStatusChipClass = (status) =>
    status === '성공' ? 'log-status-chip success' : 'log-status-chip fail';

  const getConfidenceBarClass = (confidence) => {
    if (confidence >= 95) return 'confidence-bar high';
    if (confidence >= 90) return 'confidence-bar medium';
    return 'confidence-bar low';
  };

   const handleResetFilters = () => {
    setStatusFilter('전체');
    setDateFilter('전체');
  };

  // CSV로 로그 내보내기 
  const handleExport = () => {
    if (!filteredLogs.length) {
      window.alert('내보낼 로그가 없습니다.');
      return;
    }
    const header = [
      'id',
      'timestamp',
      'refrigeratorImage',
      'totalItems',
      'status',
      'processingTime',
    ];
    const rows = filteredLogs.map((log) => [
      log.id,
      log.timestamp,
      log.refrigeratorImage,
      log.totalItems,
      log.status,
      log.processingTime,
    ]);

    const csvContent = [header, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;', });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai_recognition_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className="ai-logs">
      <div className="ai-logs-header">
        <h1 className="ai-logs-title">AI Recognition Logs</h1>
        <p className="ai-logs-description">
          냉장고 이미지 분석 기록, 인식된 식품 목록, 성공/실패 여부
        </p>
      </div>

      <div className="ai-logs-card">
        {/* 상단 필터/버튼 영역 */}
        <div className="ai-logs-toolbar">
          <div className="ai-logs-filters">
            {/* 상태 필터 */}
            <select
              className="ai-logs-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="전체">전체</option>
              <option value="성공">성공</option>
              <option value="실패">실패</option>
            </select>

            {/* 날짜 필터 */}
            <select
              className="ai-logs-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="전체">전체</option>
              <option value="오늘">오늘</option>
              <option value="최근 7일">최근 7일</option>
              <option value="최근 30일">최근 30일</option>
            </select>

            <button
              className="ai-logs-filter-button"
              onClick={handleResetFilters}
            >
              <Filter className="ai-logs-filter-icon" />
              <span>필터 초기화</span>
            </button>
          </div>

          <button
            className="ai-logs-export-button"
            onClick={handleExport}
          >
            <Download className="ai-logs-export-icon" />
            <span>로그 내보내기</span>
          </button>
        </div>

        {/* 메인 테이블: ***여기 꼭 filteredLogs 사용*** */}
        <div className="ai-logs-table-wrapper">
          <table className="ai-logs-table">
            <thead>
              <tr>
                <th>시간</th>
                <th>냉장고 이미지</th>
                <th>인식된 식품</th>
                <th>처리 시간</th>
                <th>상태</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const detectedItems = log.detectedItems || [];
                const totalItems =
                  typeof log.totalItems === 'number'
                    ? log.totalItems
                    : detectedItems.length;

                return (

                <tr key={log.id}>
                  <td className="cell-strong">
                    {log.timestamp
                      ? String(log.timestamp).replace('T', ' ')
                       : '-'}
                  </td>
                  <td className="cell-muted">{log.refrigeratorImage || '-'}</td>
                  <td>
                    {detectedItems.length > 0 ? (
                      <div className="ai-logs-detected">
                        <p className="ai-logs-detected-summary">
                          {totalItems}개 식품 인식
                        </p>
                        <div className="ai-logs-detected-tags">
                          {detectedItems.slice(0, 3).map((item, idx) => (
                            <span
                              key={idx}
                              className="ai-logs-detected-tag"
                            >
                              {item.name}
                            </span>
                          ))}
                          {detectedItems.length > 3 && (
                            <span className="ai-logs-detected-tag more">
                              +{detectedItems.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="ai-logs-detected-empty">
                        인식 실패
                      </span>
                    )}
                  </td>
                  <td className="cell-muted">{log.processingTime}</td>
                  <td>
                    <span className={getStatusChipClass(log.status)}>
                      {log.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="ai-logs-detail-button"
                      onClick={() =>
                        window.alert(
                          `"${log.refrigeratorImage}" 상세 보기 (추후 구현)`
                        )
                      }
                    >
                      <Eye className="ai-logs-detail-icon" />
                      <span>상세</span>
                    </button>
                  </td>
                </tr>
                );
              })}

              {filteredLogs.length === 0 &&  !loading && (
                <tr>
                  <td colSpan={6} className="ai-logs-empty">
                    조건에 맞는 로그가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 하단: 개수/페이지네이션 */}
        <div className="ai-logs-footer">
          <p className="ai-logs-count">
            총 {filteredLogs.length}개의 로그
          </p>
          <div className="ai-logs-pagination">
            <button className="page-button ghost" disabled>
              이전
            </button>
            <button className="page-button active">1</button>
            <button className="page-button ghost" disabled>
              다음
            </button>
          </div>
        </div>
      </div>

      {/* 아래 상세 카드도 filteredLogs 기준으로 */}
      <div className="ai-logs-detail-grid">
        {filteredLogs
          .filter((log) => log.status === '성공')
          .slice(0, 2)
          .map((log) => {
            const detectedItems = log.detectedItems || [];
            const totalItems =
              typeof log.totalItems === 'number'
                ? log.totalItems
                : detectedItems.length;
            return (
            <div key={log.id} className="ai-logs-detail-card">
              <div className="ai-logs-detail-header">
                <div>
                  <h3 className="ai-logs-detail-title">
                    {log.refrigeratorImage || '냉장고 이미지'}
                  </h3>
                  <p className="ai-logs-detail-time">
                    {log.timestamp
                        ? String(log.timestamp).replace('T', ' ')
                        : '-'}
                  </p>
                </div>
                <span className="ai-logs-detail-chip">
                  {totalItems}개 인식
                </span>
              </div>
              <div className="ai-logs-detail-body">
                <p className="ai-logs-detail-label">인식된 식품 상세:</p>
                {detectedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="ai-logs-detail-row"
                  >
                    <span className="ai-logs-detail-name">
                      {item.name}
                    </span>
                    <div className="ai-logs-detail-confidence">
                      <div className="confidence-track">
                        <div
                          className={getConfidenceBarClass(
                            item.confidence || 0
                          )}
                          style={{ width: `${item.confidence || 0 }%` }}
                        />
                      </div>
                      <span className="confidence-label">
                        {item.confidence || 0 }%
                      </span>
                    </div>
                  </div>
                ))}

                {!detectedItems.length && (
                    <p className="ai-logs-detail-empty">
                      인식된 식품이 없습니다.
                    </p>
                  )}

              </div>
            </div>
            );
          })}
      </div>
    </div>
  );
}
