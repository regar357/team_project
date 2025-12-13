// // // src/pages/WeeklyPlan.js
// // import React from "react";
// // import Card from "../components/common/Card";
// // import { weeklyPlanDummy } from "../utils/api/weekly";
// // import "./WeeklyPlan.css";



// // const DAYS_TOP = ["Mon", "Tue", "Wed", "Thu"];
// // const DAYS_BOTTOM = ["Fri", "Sat", "Sun"];

// // function getMenu(day, rowIndex) {
// //   return weeklyPlanDummy.filter((item) => item.day === day)[rowIndex];
// // }

// // export default function WeeklyPlan() {
// //   return (
// //     <div className="weekly-page">
// //       <h1 className="weekly-title">주간 식단</h1>

// //       {/* ===== 윗줄: Mon~Thu ===== */}
// //       <div className="weekly-block">
// //         <div className="weekly-days weekly-days-4">
// //           {DAYS_TOP.map((day) => (
// //             <div key={day} className="weekly-day">{day}</div>
// //           ))}
// //         </div>

// //         <div className="weekly-table">
// //           {[0, 1].map((row) => (
// //             <div key={row} className="weekly-row weekly-row-4">
// //               {DAYS_TOP.map((day) => {
// //                 const menu = getMenu(day, row);
// //                 return (
// //                   <Card key={`${day}-${row}`} className="weekly-card">
// //                     {menu ? menu.title : "-"}
// //                   </Card>
// //                 );
// //               })}
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* ===== 아랫줄: Fri~Sun ===== */}
// //       {/* ===== 아랫줄: Fri~Sun ===== */}
// // <div className="weekly-block">
// //   <div className="weekly-days weekly-days-4">
// //     {["Fri", "Sat", "Sun", ""].map((day, idx) => (
// //       <div key={idx} className="weekly-day">
// //         {day}
// //       </div>
// //     ))}
// //   </div>

// //   <div className="weekly-table">
// //     {[0, 1].map((row) => (
// //       <div key={row} className="weekly-row weekly-row-4">
// //         {["Fri", "Sat", "Sun"].map((day) => {
// //           const menu = getMenu(day, row);
// //           return (
// //             <Card key={`${day}-${row}`} className="weekly-card">
// //               {menu ? menu.title : "-"}
// //             </Card>
// //           );
// //         })}

// //         {/* 빈 카드 (크기 맞추기용) */}
// //         <div className="weekly-card weekly-empty" />
// //       </div>
// //     ))}
// //   </div>
// // </div>

      
// //     </div>
// //   );
// // }

// // src/pages/WeeklyPlan.js
// import React from "react";
// import Card from "../components/common/Card";
// import { weeklyPlanDummy } from "../utils/api/weekly";
// import "./WeeklyPlan.css";

// // 요일 리스트를 하나로 합치고, 빈 요소를 채워서 4의 배수로 맞춥니다.
// const DAYS = [
//     // 윗줄
//     "Mon", "Tue", "Wed", "Thu", 
//     // 아랫줄
//     "Fri", "Sat", "Sun", "Empty" // Empty는 스타일링용 더미입니다.
// ];

// // 4개씩 분리
// const DAYS_TOP = DAYS.slice(0, 4); 
// const DAYS_BOTTOM = DAYS.slice(4, 8); // ["Fri", "Sat", "Sun", "Empty"]

// function getMenu(day, rowIndex) {
//   return weeklyPlanDummy.filter((item) => item.day === day)[rowIndex];
// }

// export default function WeeklyPlan() {
//   return (
//     <div className="weekly-page">
//       <h1 className="weekly-title">주간 식단</h1>

//       {/* 🚨🚨 추가: 전체 컨텐츠를 감싸는 컨테이너 (중앙 정렬용) */}
//       <div className="weekly-content-wrap">
//           {/* ===== 윗줄: Mon~Thu ===== */}
//           <div className="weekly-block">
//             {/* 🚨 요일 헤더 */}
//             <div className="weekly-days weekly-days-4">
//               {DAYS_TOP.map((day) => (
//                 <div 
//                     key={day} 
//                     className={`weekly-day ${day !== "Empty" ? "day-tab" : ""}`}
//                 >
//                     {day !== "Empty" ? day : ""}
//                 </div>
//               ))}
//             </div>

//             {/* 🚨 메뉴 카드 */}
//             <div className="weekly-table">
//               {[0, 1].map((row) => (
//                 <div key={row} className="weekly-row weekly-row-4">
//                   {DAYS_TOP.map((day) => {
//                     if (day === "Empty") {
//                       return <div key={`${day}-${row}`} className="weekly-card weekly-empty" />;
//                     }
//                     const menu = getMenu(day, row);
//                     return (
//                       <Card key={`${day}-${row}`} className="weekly-card">
//                         {menu ? menu.title : "-"}
//                       </Card>
//                     );
//                   })}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ===== 아랫줄: Fri~Sun (4칸 맞추기) ===== */}
//           <div className="weekly-block">
//             {/* 🚨 요일 헤더 */}
//             <div className="weekly-days weekly-days-4">
//               {DAYS_BOTTOM.map((day) => (
//                 <div 
//                     key={day} 
//                     className={`weekly-day ${day !== "Empty" ? "day-tab" : ""}`}
//                 >
//                   {day !== "Empty" ? day : ""}
//                 </div>
//               ))}
//             </div>

//             {/* 🚨 메뉴 카드 */}
//             <div className="weekly-table">
//               {[0, 1].map((row) => (
//                 <div key={row} className="weekly-row weekly-row-4">
//                   {DAYS_BOTTOM.map((day) => {
//                     if (day === "Empty") {
//                       return <div key={`${day}-${row}`} className="weekly-card weekly-empty" />;
//                     }
//                     const menu = getMenu(day, row);
//                     return (
//                       <Card key={`${day}-${row}`} className="weekly-card">
//                         {menu ? menu.title : "-"}
//                       </Card>
//                     );
//                   })}
//                 </div>
//               ))}
//             </div>
//           </div>

//       </div>
//     </div>
//   );
// }
// src/pages/WeeklyPlan.js

import React from "react";
import Card from "../components/common/Card";
// 🚨🚨 수정: 새로운 더미 데이터 구조를 위한 헬퍼 함수를 import
import { getMenuFromDummy } from "../utils/api/weekly"; 
import "./WeeklyPlan.css";


const DAYS = [
    "Mon", "Tue", "Wed", "Thu", 
    "Fri", "Sat", "Sun", "Empty"
];

const DAYS_TOP = DAYS.slice(0, 4); 
const DAYS_BOTTOM = DAYS.slice(4, 8); 

function getMenu(day, rowIndex) {
  return getMenuFromDummy(day, rowIndex); 
}

export default function WeeklyPlan() {
  return (
  <div className="weekly-page">

      <div className="weekly-content-wrap">
          <section className="saved-hero">  
            <h1>WEEKLY PLAN</h1>  <p>주간 식단</p>
          </section>

          {/* ===== 윗줄: Mon~Thu ===== */}
          <div className="weekly-block">
            {/* 🚨 요일 헤더 */}
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

            {/* 🚨 메뉴 카드 */}
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
                        {/* 🚨 menu가 undefined 일 때 "-" 표시 */}
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
            {/* 🚨 요일 헤더 */}
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

            {/* 🚨 메뉴 카드 */}
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