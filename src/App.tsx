import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { TeacherLayout } from './layouts/TeacherLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage, RegisterPage } from './pages/auth/LoginPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { MyLearningPage } from './pages/student/MyLearningPage';
import { StudyPlannerPage } from './pages/student/StudyPlannerPage';
import { QuizzesPage } from './pages/student/QuizzesPage';
import { AssistantPage } from './pages/student/AssistantPage';
import { RecommendationsPage } from './pages/student/RecommendationsPage';
import { ProgressPage } from './pages/student/ProgressPage';
import { ProfilePage } from './pages/student/ProfilePage';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import {
  TeacherStudentsPage,
  TeacherAssessmentsPage,
  TeacherAnalyticsPage,
} from './pages/teacher/TeacherSubPages';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import {
  AdminUsersPage,
  AdminSubjectsPage,
  AdminContentPage,
  AdminAnalyticsPage,
  AdminSettingsPage,
} from './pages/admin/AdminSubPages';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Public Routes ─────────────────────────────────────────── */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ── Student Routes (role: student only) ───────────────────── */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard"       element={<StudentDashboard />} />
              <Route path="my-learning"     element={<MyLearningPage />} />
              <Route path="planner"         element={<StudyPlannerPage />} />
              <Route path="quizzes"         element={<QuizzesPage />} />
              <Route path="assistant"       element={<AssistantPage />} />
              <Route path="recommendations" element={<RecommendationsPage />} />
              <Route path="progress"        element={<ProgressPage />} />
              <Route path="profile"         element={<ProfilePage />} />
            </Route>

            {/* ── Teacher Routes (role: teacher only) ───────────────────── */}
            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/teacher/dashboard" replace />} />
              <Route path="dashboard"   element={<TeacherDashboard />} />
              <Route path="students"    element={<TeacherStudentsPage />} />
              <Route path="assessments" element={<TeacherAssessmentsPage />} />
              <Route path="analytics"   element={<TeacherAnalyticsPage />} />
            </Route>

            {/* ── Admin Routes (role: admin only) ───────────────────────── */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users"     element={<AdminUsersPage />} />
              <Route path="subjects"  element={<AdminSubjectsPage />} />
              <Route path="content"   element={<AdminContentPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="settings"  element={<AdminSettingsPage />} />
            </Route>

            {/* ── Catch-all ─────────────────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
