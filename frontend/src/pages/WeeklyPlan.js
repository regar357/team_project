import React, { useState, useEffect } from "react";
import Card from "../components/common/Card";
import { fetchWeeklyPlan } from "../utils/api/weekly"; 
import "./WeeklyPlan.css";


const DAYS = ["Mon", "Tue", "Wed", "Thu","Fri", "Sat", "Sun", "Empty"];
const DAYS_TOP = DAYS.slice(0, 4); 
const DAYS_BOTTOM = DAYS.slice(4, 8); 

export default function WeeklyPlan() {    
    const [weeklyPlanData, setWeeklyPlanData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWeeklyPlan = async () => {
            try {
                setLoading(true);
                const data = await fetchWeeklyPlan();
                setWeeklyPlanData(data);
            } catch (error) {
                console.error("주간 식단 로딩 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        loadWeeklyPlan();
    }, []);

    // API 데이터에서 메뉴를 가져오는 함수
    const getMenu = (day, rowIndex) => {
        const dailyMenus = weeklyPlanData[day];
        return dailyMenus ? dailyMenus[rowIndex] : undefined;
    };

    if (loading) {
        return (
            <div className="weekly-page loading-state">
                <div className="weekly-content-wrap">
                    <p className="weekly-loading-text">주간 식단표를 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

  return (
  <div className="weekly-page">

      <div className="weekly-content-wrap">
          <section className="saved-hero">  
            <h1>WEEKLY PLAN</h1>  <p>주간 식단</p>
          </section>

          <div className="weekly-block">
            <div className="weekly-days weekly-days-4">
              {DAYS_TOP.map((day) => (
                <div 
                    key={day} 
                    className={`weekly-day ${day !== "Empty" ? "day-tab" : ""}`}
                >
                    {day !== "Empty" ? day : ""}
                </div>
              ))}
            </div>

            <div className="weekly-table">
              {[0, 1].map((row) => (
                <div key={row} className="weekly-row weekly-row-4">
                  {DAYS_TOP.map((day) => {
                    if (day === "Empty") {
                      return <div key={`${day}-${row}`} className="weekly-card weekly-empty" />;
                    }
                    const menu = getMenu(day, row);
                    return (
                      <Card key={`${day}-${row}`} className="weekly-card">
                        {menu ? menu.title : "-"}
                      </Card>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* ===== 아랫줄: Fri~Sun (4칸 맞추기) ===== */}
          <div className="weekly-block">
            <div className="weekly-days weekly-days-4">
              {DAYS_BOTTOM.map((day) => (
                <div 
                    key={day} 
                    className={`weekly-day ${day !== "Empty" ? "day-tab" : ""}`}
                >
                  {day !== "Empty" ? day : ""}
                </div>
              ))}
            </div>

            <div className="weekly-table">
              {[0, 1].map((row) => (
                <div key={row} className="weekly-row weekly-row-4">
                  {DAYS_BOTTOM.map((day) => {
                    if (day === "Empty") {
                      return <div key={`${day}-${row}`} className="weekly-card weekly-empty" />;
                    }
                    const menu = getMenu(day, row);
                    return (
                      <Card key={`${day}-${row}`} className="weekly-card">
                        {menu ? menu.title : "-"}
                      </Card>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

      </div>
    </div>
  );
}