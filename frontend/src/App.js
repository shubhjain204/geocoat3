import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import Primer from "@/pages/Primer";
import { ScrollToTop } from "@/components/ScrollToTop";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/paint" element={<Landing />} />
                    <Route path="/primer" element={<Primer />} />
                </Routes>
            </BrowserRouter>
            <Toaster position="bottom-right" theme="light" richColors />
        </div>
    );
}

export default App;
