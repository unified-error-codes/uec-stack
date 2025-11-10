import './App.css';
import { ApplicationContext } from './contexts/ApplicationContext';
import { getApp } from './lib/Application';
import { Plot } from './ui/Plot';

function App() {
    return (
        <ApplicationContext.Provider value={getApp()}>
            <Plot />
        </ApplicationContext.Provider>
    );
}

export default App;
