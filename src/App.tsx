import React, {useState, useEffect} from "react";
import {
  Main,
  Timeline,
  Expertise,
  Project,
  Contact,
  Navigation,
  Footer,
  Publication,
    Articles,
    FullArticles
} from "./components";
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

        {view === 'homeView' && <HomeView/>}
        {view === 'fullArticleList' && <HomeView/>}
        <Navigation parentToChild={{mode}} modeChange={handleModeChange}/>
        <Footer />
    </div>
    );
}

export default App;