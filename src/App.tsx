import React, {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router";
import { Main,  Timeline,  Expertise, Project, Contact,
  Navigation, Footer, Articles, ArticlesList, Post} from "./components";
import FadeIn from './components/FadeIn';
import './index.scss';

function App() {
    const [mode, setMode] = useState<string>('dark');
    const [view, setView] = useState("homeView");

    const handleModeChange = () => {
        if (mode === 'dark') {
            setMode('light');
        } else {
            setMode('dark');
        }
    }

    useEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      }, []);

    const HomeView = () => {
        console.log('Home View');
        return(
        <FadeIn transitionDuration={700}>
            <Main/>
            <Expertise/>
            <Timeline/>
            <Articles/>
        </FadeIn>
        );
    }
    return (
    <div className={`main-container ${mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>

        <BrowserRouter>
            <Navigation parentToChild={{mode}} modeChange={handleModeChange}/>
            <Routes>
                <Route path="/" element={<HomeView/>}/>
                <Route path="/articles-list" element={<ArticlesList/>}/>

            </Routes>
        </BrowserRouter>
        <Footer />
    </div>
    );
}

export default App;