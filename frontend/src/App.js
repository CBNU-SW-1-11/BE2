
// // import React, { useEffect } from "react";
// // import { Provider, useDispatch } from "react-redux";
// // import { GoogleOAuthProvider } from "@react-oauth/google";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import { store } from "./store";
// // import MainPage from "./pages/MainPage";
// // import KakaoCallback from "./components/KakaoCallback";
// // import NaverCallback from "./components/NaverCallback";
// // import OCRToolPage from "./pages/OCRToolPage"; // 새로 추가된 OCR 도구 페이지
// // import { ChatProvider } from "./context/ChatContext";
// // import axios from "axios";
// // import { loginSuccess } from "./store/authSlice";
// // import ScheduleManagement from "./services/scheduleService";
// // axios.defaults.baseURL = "http://localhost:8000";

// // // App 초기화 시 localStorage에 저장된 인증 정보를 Redux에 복원
// // function AuthInitializer({ children }) {
// //   const dispatch = useDispatch();
// //   useEffect(() => {
// //     const token = localStorage.getItem("accessToken");
// //     const user = localStorage.getItem("user");
// //     if (token && user) {
// //       dispatch(loginSuccess({ token, user: JSON.parse(user) }));
// //     }
// //   }, [dispatch]);
// //   return children;
// // }

// // function App() {
// //   return (
// //     <Provider store={store}>
// //       <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
// //         <ChatProvider>
// //           <Router>
// //             <AuthInitializer>
// //               <Routes>
// //                 <Route path="/" element={<MainPage />} />
// //                 <Route path="/ocr-tool" element={<OCRToolPage />} />
// //                 <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
// //                 <Route path="/auth/naver/callback" element={<NaverCallback />} />
// //                 <Route path="/schedule-management" element={<ScheduleManagement />} />
// //               </Routes>
// //             </AuthInitializer>
// //           </Router>
// //         </ChatProvider>
// //       </GoogleOAuthProvider>
// //     </Provider>
// //   );
// // }

// // export default App;
// import { safeJsonParse } from './utils/safeJson';

// import React, { useEffect } from "react";
// import { Provider, useDispatch } from "react-redux";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { store } from "./store";
// import MainPage from "./pages/MainPage";
// import KakaoCallback from "./components/KakaoCallback";
// import NaverCallback from "./components/NaverCallback";
// import OCRToolPage from "./pages/OCRToolPage";
// import { ChatProvider } from "./context/ChatContext";
// import axios from "axios";
// import { loginSuccess } from "./store/authSlice";
// import ScheduleManagement from "./services/scheduleService";

// // 새로 추가: 비디오 관련 페이지들
// import VideoAnalysisPage from "./pages/VideoAnalysisPage"; // 비디오 분석 메인 페이지
// import IntegratedChatPage from "./pages/IntegratedChatPage"; // 통합 채팅 페이지
// import VideoUploadPage from "./pages/VideoUploadPage"; // 비디오 업로드 페이지
// import VideoDetailPage from "./pages/VideoDetailPage";
// axios.defaults.baseURL = "http://localhost:8000";

// // App 초기화 시 localStorage에 저장된 인증 정보를 Redux에 복원
// function AuthInitializer({ children }) {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     const user = localStorage.getItem("user");
//     if (token && user) {
//       dispatch(loginSuccess({ token, user: safeJsonParse(user, {}) }));
//     }
//   }, [dispatch]);
//   return children;
// }

// function App() {
//   return (
//     <Provider store={store}>
//       <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
//         <ChatProvider>
//           <Router>
//             <AuthInitializer>
//               <Routes>
//                 {/* 기존 라우트들 */}
//                 <Route path="/" element={<MainPage />} />
//                 <Route path="/ocr-tool" element={<OCRToolPage />} />
//                 <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
//                 <Route path="/auth/naver/callback" element={<NaverCallback />} />
//                 <Route path="/schedule-management" element={<ScheduleManagement />} />
                
//                 {/* 새로 추가: 비디오 관련 라우트들 */}
//                 <Route path="/video-analysis" element={<VideoAnalysisPage />} />
//                 <Route path="/video-upload" element={<VideoUploadPage />} />
//                 <Route path="/integrated-chat" element={<IntegratedChatPage />} />
                
//                 {/* 선택사항: 비디오 상세 페이지 */}
//                 <Route path="/video/:videoId" element={<VideoDetailPage />} />
//               </Routes>
//             </AuthInitializer>
//           </Router>
//         </ChatProvider>
//       </GoogleOAuthProvider>
//     </Provider>
//   );
// }

// export default App;

// src/App.js
import { safeJsonParse } from './utils/safeJson';

import React, { useMemo, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Router는 index.js에서 래핑
import { Provider, useDispatch } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

import { store } from './store';
import { loginSuccess } from './store/authSlice';

import { ChatProvider } from './context/ChatContext';

import WelcomePage from './pages/WelcomePage';
import MainPage from './pages/MainPage';
import OCRToolPage from './pages/OCRToolPage';

import KakaoCallback from './components/KakaoCallback';
import NaverCallback from './components/NaverCallback';
import ScheduleManagement from './services/scheduleService';

// 비디오 관련
import VideoAnalysisPage from './pages/VideoAnalysisPage';
import IntegratedChatPage from './pages/IntegratedChatPage';
import VideoUploadPage from './pages/VideoUploadPage';
import VideoDetailPage from './pages/VideoDetailPage';

// 백엔드 기본 URL
axios.defaults.baseURL = 'http://localhost:8000';

// 앱 시작 시 토큰/유저 복원 → Redux에 주입
function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch(loginSuccess({ token, user: safeJsonParse(user, {}) }));
    }
  }, [dispatch]);
  return children;
}

function AppInner() {
  // 1번 코드: Welcome → Main 전환 & 선택 모델 전달
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedModels, setSelectedModels] = useState([]);

  const handleStartChat = (models) => {
    setSelectedModels(models || []);
    setShowWelcome(false);
  };

  // "/" 렌더링: Welcome 또는 Main+ChatProvider
  const HomeElement = useMemo(
    () =>
      showWelcome ? (
        <WelcomePage onStartChat={handleStartChat} />
      ) : (
        <ChatProvider initialModels={selectedModels}>
          <MainPage />
        </ChatProvider>
      ),
    [showWelcome, selectedModels]
  );

  return (
    <AuthInitializer>
      <Routes>
        {/* 홈 (Welcome → Main 전환) */}
        <Route path="/" element={HomeElement} />

        {/* OCR 페이지는 useChat() 사용 → ChatProvider로 감싸기 */}
        <Route
          path="/ocr-tool"
          element={
            <ChatProvider initialModels={[]}>
              <OCRToolPage />
            </ChatProvider>
          }
        />

        {/* OAuth 콜백 */}
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/auth/naver/callback" element={<NaverCallback />} />

        {/* 스케줄 관리 */}
        <Route path="/schedule-management" element={<ScheduleManagement />} />

        {/* 비디오 관련 — 2번 코드에선 앱 전체가 ChatProvider였음.
            여기선 사용 가능성을 고려해 핵심 페이지만 감쌈. 필요 시 다른 페이지도 감싸줘도 됨. */}
        <Route
          path="/video-analysis"
          element={
            <ChatProvider initialModels={[]}>
              <VideoAnalysisPage />
            </ChatProvider>
          }
        />
        <Route path="/video-upload" element={<VideoUploadPage />} />
        <Route
          path="/integrated-chat"
          element={
            <ChatProvider initialModels={[]}>
              <IntegratedChatPage />
            </ChatProvider>
          }
        />
        <Route path="/video/:videoId" element={<VideoDetailPage />} />

        {/* 기타 경로 → 홈 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthInitializer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        {/* Router는 index.js에서 감싸고 있다고 했으므로 여기선 Routes만 사용 */}
        <AppInner />
      </GoogleOAuthProvider>
    </Provider>
  );
}
