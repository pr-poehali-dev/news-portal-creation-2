
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminNews from "./pages/AdminNews";
import AdminNewsEdit from "./pages/AdminNewsEdit";
import AdminArticles from "./pages/AdminArticles";
import AdminArticlesEdit from "./pages/AdminArticlesEdit";
import AdminPressReleases from "./pages/AdminPressReleases";
import AdminPressReleasesEdit from "./pages/AdminPressReleasesEdit";
import AdminHoroscopes from "./pages/AdminHoroscopes";
import AdminHoroscopesEdit from "./pages/AdminHoroscopesEdit";
import AdminBlogs from "./pages/AdminBlogs";
import AdminBlogsEdit from "./pages/AdminBlogsEdit";
import AdminBiographies from "./pages/AdminBiographies";
import AdminBiographiesEdit from "./pages/AdminBiographiesEdit";
import Login from "./pages/Login";
import NewsDetail from "./pages/NewsDetail";
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
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/news" element={<AdminNews />} />
          <Route path="/admin/news/edit/:id" element={<AdminNewsEdit />} />
          <Route path="/admin/articles" element={<AdminArticles />} />
          <Route path="/admin/articles/edit/:id" element={<AdminArticlesEdit />} />
          <Route path="/admin/press-releases" element={<AdminPressReleases />} />
          <Route path="/admin/press-releases/edit/:id" element={<AdminPressReleasesEdit />} />
          <Route path="/admin/horoscopes" element={<AdminHoroscopes />} />
          <Route path="/admin/horoscopes/edit/:id" element={<AdminHoroscopesEdit />} />
          <Route path="/admin/blogs" element={<AdminBlogs />} />
          <Route path="/admin/blogs/edit/:id" element={<AdminBlogsEdit />} />
          <Route path="/admin/biographies" element={<AdminBiographies />} />
          <Route path="/admin/biographies/edit/:id" element={<AdminBiographiesEdit />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;