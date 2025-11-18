import {
    SignedIn,
    SignedOut,
    SignIn,
    SignUp,
    RedirectToSignIn,
} from "@clerk/clerk-react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import EffortToday from "./EffortToday";

function App() {
    return (
        <Routes>
            {/* Public landing page */}
            <Route
                path="/"
                element={
                    <>
                        <SignedIn>
                            <EffortToday />
                        </SignedIn>
                        <SignedOut>
                            <LandingPage />
                        </SignedOut>
                    </>
                }
            />

            {/* Sign-in page – Clerk is the main focus */}
            <Route
                path="/sign-in/*"
                element={
                    <SignedOut>
                        <div className="flex min-h-screen items-center justify-center bg-slate-950">
                            <SignIn routing="path" path="/sign-in" />
                        </div>
                    </SignedOut>
                }
            />

            {/* Sign-up page – Clerk is the main focus */}
            <Route
                path="/sign-up/*"
                element={
                    <SignedOut>
                        <div className="flex min-h-screen items-center justify-center bg-slate-950">
                            <SignUp routing="path" path="/sign-up" />
                        </div>
                    </SignedOut>
                }
            />

            {/* Authenticated app */}
            <Route
                path="/app"
                element={
                    <>
                        <SignedIn>
                            <EffortToday />
                        </SignedIn>
                        <SignedOut>
                            <RedirectToSignIn redirectUrl="/app" />
                        </SignedOut>
                    </>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
