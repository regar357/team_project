// src/pages/Dashboard.js
import { Package, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Dashboard.css';


const DASHBOARD_STORAGE_KEY = 'adminDashboard';
const DASHBOARD_API_URL = 'http://localhost:3001/api/admin/dashboard';

export function Dashboard() {

  const [stats, setStats] = useState({
    totalIngredients: 0,   // 전체 식재료 수
    totalAnalyses: 0,      // 전체 냉장고 분석 건수
  });

  const [recentAnalyses, setRecentAnalyses] = useState([]); // 최근 냉장고 분석 기록
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // localStorage에서 먼저 불러오기
    try {
      const saved = localStorage.getItem(DASHBOARD_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);

        if (parsed && typeof parsed === 'object') {
          if (parsed.stats) setStats(parsed.stats);
          if (Array.isArray(parsed.recentAnalyses)) {
            setRecentAnalyses(parsed.recentAnalyses);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data from localStorage', err);
    }

    // 서버에서 최신 대시보드 데이터 가져오기
    const fetchFromServer = async () => {
      try {
        setLoading(true);
        const res = await fetch(DASHBOARD_API_URL);
        if (!res.ok) throw new Error('Dashboard API 응답 오류');

        /**
         * 백엔드에서 이런 식으로 내려온다고 가정:
         * {
         *   totalIngredients: number,
         *   totalAnalyses: number,
         *   recentAnalyses: [
         *     {
         *       id,
         *       refrigeratorImage,
         *       analyzedAt,      // '2025-12-06 14:23:15' 같은 문자열
         *       itemCount,       // 인식된 식품 수
         *       status           // '완료' / '실패' 등
         *     },
         *     ...
         *   ],
         * }
         */
        const data = await res.json();

        const nextStats = {
          totalIngredients: data.totalIngredients ?? 0,
          totalAnalyses: data.totalAnalyses ?? 0,
        };

        const nextRecentAnalyses = Array.isArray(data.recentAnalyses)
          ? data.recentAnalyses.slice(0, 4)
          : [];

        setStats(nextStats);
        setRecentAnalyses(nextRecentAnalyses);

        // 로컬스토리지에도 같이 저장
        localStorage.setItem(
          DASHBOARD_STORAGE_KEY,
          JSON.stringify({ stats: nextStats, recentAnalyses: nextRecentAnalyses, })
        );
      } catch (err) {
        console.error('Failed to fetch dashboard data from API', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFromServer();
  }, []);

  // 상단 카드용 설정
  const statCards = [
    {
      id: 'totalIngredients',
      label: '전체 식재료',
      value: stats.totalIngredients.toLocaleString(),
      icon: Package,
      variant: 'ingredients',
    },
    {
      id: 'totalAnalyses',
      label: '냉장고 분석 건수',
      value: stats.totalAnalyses.toLocaleString(),
      icon: Brain,
      variant: 'analyses',
    },
  ];


  return (
    <div className="dashboard">
      {/* 상단 타이틀 영역 */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-description">
          전체 시스템 개요, 냉장고 분석 통계, 최근 분석 목록
        </p>
      </div>

      {loading && (
        <div className="dashboard-loading">
          대시보드 데이터를 불러오는 중입니다...
        </div>
      )}

      {/* 통계 카드 영역 */}
      <div className="dashboard-stats-grid">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="dashboard-stat-card">
              <div className="dashboard-stat-card-header">
                <div
                  className={`dashboard-stat-icon dashboard-stat-icon-${card.variant}`}
                >
                  <Icon className="dashboard-stat-icon-inner" />
                </div>
              </div>
              <div className="dashboard-stat-card-body">
                <p className="dashboard-stat-label">{card.label}</p>
                <p className="dashboard-stat-value">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 2컬럼 영역 */}
      <div className="dashboard-bottom-grid">
        {/* 최근 냉장고 분석 */}
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">최근 냉장고 분석</h2>
          <div className="dashboard-recent-list">
            {recentAnalyses.length === 0 && (
              <p className="dashboard-empty">
                최근 분석 기록이 없습니다.
              </p>
            )}
            
            {recentAnalyses.map((item, idx) => (
              <div key={item.id ?? idx} className="dashboard-recent-item">
                <div className="dashboard-recent-text">
                  <p className="dashboard-recent-image">
                    {item.refrigeratorImage ?? '냉장고 이미지'}
                  </p>
                  <p className="dashboard-recent-sub">
                    {(item.analyzedAt || '').replace('T', ' ')} ·{' '}
                    {item.itemCount ?? 0}개 식품 인식
                  </p>
                </div>
                <span
                  className={`dashboard-recent-status ${
                    item.status === '완료'
                      ? 'status-complete'
                      : item.status === '실패'
                      ? 'status-fail'
                      : 'status-neutral'
                    }`}
                >
                  {item.status ?? '상태 미상'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}