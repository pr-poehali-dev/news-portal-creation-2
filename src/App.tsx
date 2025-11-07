
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminContent from "./pages/AdminContent";
import AdminNewsEdit from "./pages/AdminNewsEdit";
import AdminArticlesEdit from "./pages/AdminArticlesEdit";
import AdminPressReleasesEdit from "./pages/AdminPressReleasesEdit";
import AdminHoroscopesEdit from "./pages/AdminHoroscopesEdit";
import AdminBlogsEdit from "./pages/AdminBlogsEdit";
import AdminBiographiesEdit from "./pages/AdminBiographiesEdit";
import Login from "./pages/Login";
import NewsDetail from "./pages/NewsDetail";
import ArticleDetail from "./pages/ArticleDetail";
import PressReleaseDetail from "./pages/PressReleaseDetail";
import HoroscopeDetail from "./pages/HoroscopeDetail";
import BlogDetail from "./pages/BlogDetail";
import BiographyDetail from "./pages/BiographyDetail";
import AdminAds from "./pages/AdminAds";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/press-releases/:id" element={<PressReleaseDetail />} />
          <Route path="/horoscopes/:id" element={<HoroscopeDetail />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/biographies/:id" element={<BiographyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/news/edit/:id" element={<AdminNewsEdit />} />
          <Route path="/admin/articles/edit/:id" element={<AdminArticlesEdit />} />
          <Route path="/admin/press-releases/edit/:id" element={<AdminPressReleasesEdit />} />
          <Route path="/admin/horoscopes/edit/:id" element={<AdminHoroscopesEdit />} />
          <Route path="/admin/blogs/edit/:id" element={<AdminBlogsEdit />} />
          <Route path="/admin/biographies/edit/:id" element={<AdminBiographiesEdit />} />
          <Route path="/admin/ads" element={<AdminAds />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;