import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import LoadingScreen from "./components/LoadingScreen";
import SEO from "./components/SEO";

const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Blogs = lazy(() => import("./pages/Blogs"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Team = lazy(() => import("./pages/Team"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminProjects = lazy(() => import("./pages/AdminProjects"));
const AdminTeam = lazy(() => import("./pages/AdminTeam"));
const AdminContacts = lazy(() => import("./pages/AdminContacts"));
const AdminBlogs = lazy(() => import("./pages/AdminBlogs"));
const AdminFeatures = lazy(() => import("./pages/AdminFeatures"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const NotFound = lazy(() => import("./pages/not-found"));

function RouteLoadingScreen() {
  const [location] = useLocation();
  const firstRender = useRef(true);
  const timeoutRef = useRef<number>(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    window.clearTimeout(timeoutRef.current);
    setActive(true);
    timeoutRef.current = window.setTimeout(() => setActive(false), 950);

    return () => window.clearTimeout(timeoutRef.current);
  }, [location]);

  return <LoadingScreen active={active} duration={850} />;
}

function ScrollToTopOnRouteChange() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location]);

  return null;
}

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<div className="route-loading" aria-label="Loading page" />}>
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
          <Route path="/admin/settings" component={AdminSettings} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <LoadingScreen />
      <RouteLoadingScreen />
      <ScrollToTopOnRouteChange />
      <SEO />
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
