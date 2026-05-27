import React from 'react';
import { Switch, Route, Router as WouterRouter } from "wouter";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import LoadingScreen from "./components/LoadingScreen";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Team from "./pages/Team";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminProjects from "./pages/AdminProjects";
import AdminTeam from "./pages/AdminTeam";
import AdminContacts from "./pages/AdminContacts";
import AdminBlogs from "./pages/AdminBlogs";
import AdminFeatures from "./pages/AdminFeatures";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/projects" component={Projects} />
        <Route path="/projects/:slug" component={ProjectDetail} />
        <Route path="/blogs" component={Blogs} />
        <Route path="/blogs/:slug" component={BlogDetail} />
        <Route path="/team" component={Team} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/projects" component={AdminProjects} />
        <Route path="/admin/team" component={AdminTeam} />
        <Route path="/admin/contacts" component={AdminContacts} />
        <Route path="/admin/blogs" component={AdminBlogs} />
        <Route path="/admin/features" component={AdminFeatures} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <LoadingScreen />
      <CustomCursor />
      <Navbar />
      <main>
        <Router />
      </main>
      <Footer />
    </WouterRouter>
  );
}

export default App;
